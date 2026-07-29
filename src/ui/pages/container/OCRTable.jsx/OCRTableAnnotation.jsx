import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Table.css';
import ReactQuill from 'react-quill';
import "./editor.css";
import "quill/dist/quill.snow.css";
import DataTable from './DataTable';
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import TranslationBar from './TranslationBar';
import Sidebar from './Sidebar';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TableControls from './TableControls';
import CustomizedSnackbars from '../../component/common/Snackbar';
import CircularIndeterminate from '../../component/common/Spinner';
import { useDispatch ,useSelector} from 'react-redux';
import GetTaskDetailsAPI from '../../../../redux/actions/api/Tasks/GetTaskDetails';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GetNextProjectAPI from '../../../../redux/actions/CL-Transcription/GetNextProject';
import GetProjectDetailsAPI from '../../../../redux/actions/api/ProjectDetails/GetProjectDetails';
import { Button } from '@mui/material';
import PatchAnnotationOCRAPI from '../../../../redux/actions/CL-Transcription/PatchAnnoationOCR';
import GetAnnotationsTaskOCRAPI from '../../../../redux/actions/CL-Transcription/GetAnnotationsTaskOCR';
import AnnotationStageButtons from './AnnotationStageButtons';
import SaveTranscriptOCRAPI from '../../../../redux/actions/CL-Transcription/SaveTranscriptOCR';

// Pure helper: computes updated mergedCells after a merge operation
// Replace the top-level helper
const computeUpdatedMergedCells = (range, existing = {}) => {
  const { startRow, startCol, endRow, endCol } = range;
  const newMergedCells = { ...existing };
  const colSpan = endCol - startCol + 1;
  const rowSpan = endRow - startRow + 1;

  const firstCellKey = `${startRow}-${startCol}`;
  newMergedCells[firstCellKey] = {
    isFirst: true,
    colSpan,
    rowSpan,
    startRow,
    startCol,
    endRow,
    endCol,
  };

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      if (i === startRow && j === startCol) continue;
      const cellKey = `${i}-${j}`;
      newMergedCells[cellKey] = { isFirst: false, hidden: true };
    }
  }
  return newMergedCells;
};
// ── HELPERS for shifting/cleaning mergedCells indices ────────────────────────

/**
 * Rebuild mergedCells map after inserting a new row at `insertAt`.
 * Every entry whose row index >= insertAt gets shifted down by 1.
 */
const shiftMergedCellsForRowInsert = (mergedCells, insertAt) => {
  const updated = {};
  Object.entries(mergedCells).forEach(([key, value]) => {
    const [r, c] = key.split('-').map(Number);
    const newR = r >= insertAt ? r + 1 : r;
    const newKey = `${newR}-${c}`;
    const newValue = { ...value };
    if (newValue.isFirst) {
      if (newValue.startRow >= insertAt) newValue.startRow += 1;
      if (newValue.endRow >= insertAt) newValue.endRow += 1;
    }
    updated[newKey] = newValue;
  });
  return updated;
};



/**
 * Rebuild mergedCells map after inserting a new column at `insertAt`.
 * Every entry whose col index >= insertAt gets shifted right by 1.
 */
const shiftMergedCellsForColInsert = (mergedCells, insertAt) => {
  const updated = {};
  Object.entries(mergedCells).forEach(([key, value]) => {
    const [r, c] = key.split('-').map(Number);
    const newC = c >= insertAt ? c + 1 : c;
    const newKey = `${r}-${newC}`;
    const newValue = { ...value };
    if (newValue.isFirst) {
      if (newValue.startCol >= insertAt) newValue.startCol += 1;
      if (newValue.endCol >= insertAt) newValue.endCol += 1;
    }
    updated[newKey] = newValue;
  });
  return updated;
};

/**
 * Rebuild mergedCells map after deleting the row at `deleteAt`.
 * Works from isFirst entries only (source of truth), then re-derives hidden entries.
 *
 * Cases per merged group:
 *   A) entirely above deleteAt  → keep as-is
 *   B) entirely below deleteAt  → shift startRow/endRow up by 1
 *   C) spans deleteAt, isFirst row is NOT deleted → keep key, shrink endRow/rowSpan
 *   D) spans deleteAt, isFirst row IS the deleted row → promote next row to isFirst
 */
const shiftMergedCellsForRowDelete = (mergedCells, deleteAt) => {
  const firstEntries = Object.entries(mergedCells).filter(([, v]) => v.isFirst);
  const updated = {};

  firstEntries.forEach(([key, value]) => {
    const { startRow, startCol, endRow, endCol, colSpan, rowSpan } = value;

    // A) entirely above
    if (endRow < deleteAt) {
      updated[key] = { ...value };
      return;
    }

    // B) entirely below
    if (startRow > deleteAt) {
      const newStart = startRow - 1;
      const newEnd = endRow - 1;
      updated[`${newStart}-${startCol}`] = { ...value, startRow: newStart, endRow: newEnd };
      return;
    }

    // C or D: spans the deleted row
    const newRowSpan = rowSpan - 1;
    if (newRowSpan < 1) return; // group disappears
    if (newRowSpan === 1 && colSpan === 1) return; // collapses to plain cell

    if (startRow < deleteAt) {
      // C: isFirst row is above the deleted row — keep key, shrink endRow
      updated[key] = { ...value, rowSpan: newRowSpan, endRow: endRow - 1 };
    } else {
      // D: isFirst row IS the deleted row — promote the next physical row
      // After deletion, what was row (startRow+1) becomes row (startRow)
      const newStart = startRow; // row startRow+1 shifts to startRow after deletion
      const newEnd = endRow - 1;
      updated[`${newStart}-${startCol}`] = {
        ...value,
        isFirst: true,
        startRow: newStart,
        endRow: newEnd,
        rowSpan: newRowSpan,
      };
    }
  });

  // Re-derive all hidden entries from the rebuilt isFirst entries
  Object.values(updated).forEach((value) => {
    if (!value.isFirst) return;
    const { startRow, startCol, endRow, endCol } = value;
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (i === startRow && j === startCol) continue;
        updated[`${i}-${j}`] = { isFirst: false, hidden: true };
      }
    }
  });

  return updated;
};

/**
 * Rebuild mergedCells map after deleting the column at index `deleteAt`.
 * Works from isFirst entries only, then re-derives hidden entries.
 *
 * Cases per merged group:
 *   A) entirely left of deleteAt  → keep as-is
 *   B) entirely right of deleteAt → shift startCol/endCol left by 1
 *   C) spans deleteAt, isFirst col is NOT deleted → keep key, shrink endCol/colSpan
 *   D) spans deleteAt, isFirst col IS the deleted col → promote next col to isFirst
 */
const shiftMergedCellsForColDelete = (mergedCells, deleteAt) => {
  const firstEntries = Object.entries(mergedCells).filter(([, v]) => v.isFirst);
  const updated = {};

  firstEntries.forEach(([key, value]) => {
    const { startRow, startCol, endRow, endCol, colSpan, rowSpan } = value;

    // A) entirely left
    if (endCol < deleteAt) {
      updated[key] = { ...value };
      return;
    }

    // B) entirely right
    if (startCol > deleteAt) {
      const newStart = startCol - 1;
      const newEnd = endCol - 1;
      updated[`${startRow}-${newStart}`] = { ...value, startCol: newStart, endCol: newEnd };
      return;
    }

    // C or D: spans the deleted column
    const newColSpan = colSpan - 1;
    if (newColSpan < 1) return; // group disappears
    if (newColSpan === 1 && rowSpan === 1) return; // collapses to plain cell

    if (startCol < deleteAt) {
      // C: isFirst col is left of the deleted col — keep key, shrink endCol
      updated[key] = { ...value, colSpan: newColSpan, endCol: endCol - 1 };
    } else {
      // D: isFirst col IS the deleted col — promote next col to isFirst
      const newStart = startCol; // col startCol+1 shifts to startCol after deletion
      const newEnd = endCol - 1;
      updated[`${startRow}-${newStart}`] = {
        ...value,
        isFirst: true,
        startCol: newStart,
        endCol: newEnd,
        colSpan: newColSpan,
      };
    }
  });

  // Re-derive all hidden entries from the rebuilt isFirst entries
  Object.values(updated).forEach((value) => {
    if (!value.isFirst) return;
    const { startRow, startCol, endRow, endCol } = value;
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        if (i === startRow && j === startCol) continue;
        updated[`${i}-${j}`] = { isFirst: false, hidden: true };
      }
    }
  });

  return updated;
};

/**
 * Given a column accessor and the columns array, find the outermost col index
 * to use when adding before/after a merged cell group.
 * Returns { insertBefore, insertAfter } — the correct split points.
 */
const getMergeAwareColBounds = (colIndex, mergedCells) => {
  // Check if this colIndex is inside a merged group (hidden cell points to isFirst)
  // Walk all isFirst entries to see if colIndex falls within any span
  let spanStart = colIndex;
  let spanEnd = colIndex;
  Object.values(mergedCells).forEach((value) => {
    if (value.isFirst && value.startCol <= colIndex && value.endCol >= colIndex) {
      spanStart = value.startCol;
      spanEnd = value.endCol;
    }
  });
  return { spanStart, spanEnd };
};

// ─────────────────────────────────────────────────────────────────────────────

function App() {
    const classes = AudioTranscriptionLandingStyle();
  
  const dispatch = useDispatch();
  const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const annotationNotesRef = useRef(null);
    const reviewNotesRef = useRef(null);
  
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newTableRows, setNewTableRows] = useState(5);
  const [newTableCols, setNewTableCols] = useState(5);
  const [originalHtmlTable, setOriginalHtmlTable] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcriptionMode, setTranscriptionMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
    const [loadtime, setloadtime] = useState(new Date());
    let labellingMode = localStorage.getItem("labellingMode");
const [selectedRange, setSelectedRange] = useState(null);
const [headerSelectionRange, setHeaderSelectionRange] = useState(null);
const [isSelecting, setIsSelecting] = useState(false);
const [selectionStart, setSelectionStart] = useState(null);
const [selectionEnd, setSelectionEnd] = useState(null);

// Lifted mergedCells state
const [mergedCells, setMergedCells] = useState({});
const [mergedHeaders, setMergedHeaders] = useState({});

  const [annotationsTaskDetails, setAnnotationsTaskDetails] = useState([]);
    const [isActive, setIsActive] = useState(true);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const inactivityThreshold = 120000; 
  const ref = useRef(0);
  const saveIntervalRef =  useRef(null);
  const timeSpentIntervalRef = useRef(null);
  
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState("");
  const [taskData, setTaskData] = useState(null);
  const [annotationId, setAnnotationId] = useState(null);
  const [NextData, setNextData] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [annotationtext, setannotationtext] = useState('')
  const [reviewtext, setreviewtext] = useState('')
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
    const AnnotationsTaskDetails = useSelector(
      (state) => state.getAnnotationsTask?.data
    );
    const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
    const user = useSelector((state) => state.fetchLoggedInUserData.data);
    const taskDetails = useSelector((state) => state.getTaskDetails?.data);
  
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitterRef = useRef(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);

    const [fontSize, setFontSize] = useState(JSON.parse(localStorage.getItem("OcrTranscriptionSettings"))
    ?.fontSize || "large");
  const [enableTransliteration, setEnableTransliteration] = useState(false);
  const [enableRTL, setEnableRTL] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [alternateRowColor, setAlternateRowColor] = useState(true);
  const [theme, setTheme] = useState({ name: "Default", primary: "#667eea", secondary: "#764ba2" });
  
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'ta', name: 'Tamil' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'pa', name: 'Punjabi' },
  ];

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  const getAnnotationsTaskData = (id) => {
    const userObj = new GetAnnotationsTaskOCRAPI(id);
    dispatch(APITransport(userObj));
  };
  
  useEffect(() => {
  const loadData = async () => {
    setInitialLoading(true);
    setTableData([]);
    setColumns([]);
    setOriginalHtmlTable('');
    setAnnotations([]);
    setAnnotationsTaskDetails([]);
    setAnnotationId(null);
    
    await Promise.all([
      getAnnotationsTaskData(taskId),
      getProjectDetails(),
      getTaskData(taskId)
    ]);
    
    setInitialLoading(false);
  };
  
  loadData();
}, [taskId]);

        useEffect(() => {
  if (!AnnotationsTaskDetails?.length) return;

  if (!annotationNotesRef.current || !reviewNotesRef.current) return;

  const annotationNotes = AnnotationsTaskDetails[0].annotation_notes;
  const reviewNotes = AnnotationsTaskDetails[0].review_notes;

  const annotationEditor = annotationNotesRef.current.getEditor();
  const reviewEditor = reviewNotesRef.current.getEditor();

  try {
    const parsed = annotationNotes ? JSON.parse(annotationNotes) : "";
    annotationEditor.setContents(parsed);
  } catch {
    annotationEditor.setText(annotationNotes || "");
  }

  try {
    const parsed = reviewNotes ? JSON.parse(reviewNotes) : "";
    reviewEditor.setContents(parsed);
  } catch {
    reviewEditor.setText(reviewNotes || "");
  }

  setannotationtext(annotationEditor.getText());
  setreviewtext(reviewEditor.getText());

}, [AnnotationsTaskDetails, showNotes]); 

const resetNotes = () => {
  setShowNotes(false);
  if (annotationNotesRef.current) {
    annotationNotesRef.current.getEditor().setContents([]);
  }
  if (reviewNotesRef.current) {
    reviewNotesRef.current.getEditor().setContents([]);
  }
};

    useEffect(() => {
      resetNotes();
    }, [taskId]);
  
    const modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub' }, { 'script': 'super' }],
      ]
    };
  
    const formats = [
      'bold', 'italic', 'underline', 'strike',
      'script']
  
 const filterAnnotations = (annotations, user) => {
    let disableSkip = false;
    let disableUpdate = false;
    let disableDraft = false;
    let Message = "";
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && !annotation.parent_annotation
      );
    });
    let userAnnotationData = annotations.find(
      (annotation) => annotation.annotation_type === 2
    );

    if (userAnnotation) {
      if (userAnnotation.annotation_status === "labeled") {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3
        );
        let review = annotations.find(
          (annotation) =>
            annotation.parent_annotation === userAnnotation.id &&
            annotation.annotation_type === 2
        );
        if (
          superCheckedAnnotation &&
          ["draft", "skipped", "validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];
          Message = "This is the Super Checker's Annotation in read only mode";
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
        } else if (
          review &&
          ["skipped", "draft", "rejected", "unreviewed"].includes(
            review.annotation_status
          )
        ) {
          filteredAnnotations = [userAnnotation];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message = "This task is being reviewed by the reviewer";
        } else if (
          review &&
          [
            "accepted",
            "accepted_with_minor_changes",
            "accepted_with_major_changes",
          ].includes(review.annotation_status)
        ) {
          filteredAnnotations = [review];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message = "This is the Reviewer's Annotation in read only mode";
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message = "Skip button is disabled, since the task is being reviewed";
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message = "Skip button is disabled, since the task is being reviewed";
      } else {
        filteredAnnotations = [userAnnotation];
      }

    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
      disableDraft = true;
      disableSkip = true;
      disableUpdate = true;
    }
    setAutoSave(!disableUpdate);
    setAnnotations(filteredAnnotations);
    setDisableBtns(disableDraft);
    setDisableUpdateButton(disableUpdate);
    setdisableSkipButton(disableSkip);
    setFilterMessage(Message);
    return [
      filteredAnnotations,
      disableDraft,
      disableSkip,
      disableUpdate,
      Message,
    ];
  };

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, user);
  }, [AnnotationsTaskDetails, user]);

// CHANGED: saveToUndo now accepts current state as parameters to avoid stale closure
const saveToUndo = useCallback((data, cols, mc) => {
  setUndoStack(prev => [...prev, {
    data: JSON.parse(JSON.stringify(data)),
    columns: JSON.parse(JSON.stringify(cols)),
    mergedCells: JSON.parse(JSON.stringify(mc))
  }]);
  setRedoStack([]);
}, []);

const handleBulkDelete = useCallback(() => {
    saveToUndo(tableData, columns, mergedCells);
    setTableData([]);
    setColumns([]);
    setSnackbarInfo({
      open: true,
      message: "All table data has been cleared",
      variant: "success",
    });
    setTimeout(() => {
      setSnackbarInfo({ open: false, message: "", variant: "success" });
    }, 3000);
  
}, [saveToUndo, tableData, columns, mergedCells]);

const handleCreateNewTable = useCallback(() => {
  saveToUndo(tableData, columns, mergedCells);
  
  const initialColumns = [];
  for (let i = 1; i <= newTableCols; i++) {
    initialColumns.push({
      accessor: `col${i}`,
      Header: `Column ${i}`,
      type: 'text',
      width: 150,
      editable: true,
    });
  }
  
  const initialRows = [];
  for (let j = 1; j <= newTableRows; j++) {
    const row = { id: j };
    initialColumns.forEach(col => {
      row[col.accessor] = '';
    });
    initialRows.push(row);
  }
  
  setColumns(initialColumns);
  setTableData(initialRows);
  setMergedCells({});
  setMergedHeaders({});
  setSelectedRange(null);
  setHeaderSelectionRange(null);
  setSelectedCell(null);
  
  setSnackbarInfo({
    open: true,
    message: `Created a new table with ${newTableRows} rows and ${newTableCols} columns`,
    variant: "success",
  });
  setTimeout(() => {
    setSnackbarInfo({ open: false, message: "", variant: "success" });
  }, 3000);
}, [saveToUndo, tableData, columns, mergedCells, newTableRows, newTableCols]);
const handleUnmergeCells = useCallback(() => {
  // Handle header unmerge
  if (headerSelectionRange !== null) {
    const { startCol, endCol } = headerSelectionRange;
    const newMergedHeaders = { ...mergedHeaders };
    // Find the isFirst entry that covers this range and clear it
    Object.keys(newMergedHeaders).forEach(key => {
      const idx = Number(key);
      const cell = newMergedHeaders[key];
      if (cell?.isFirst && cell.startCol <= endCol && cell.endCol >= startCol) {
        for (let i = cell.startCol; i <= cell.endCol; i++) {
          delete newMergedHeaders[i];
        }
      }
    });
    setMergedHeaders(newMergedHeaders);
    setHeaderSelectionRange(null);
    setSnackbarInfo({ open: true, message: "Headers unmerged", variant: "success" });
    setTimeout(() => setSnackbarInfo({ open: false, message: "", variant: "success" }), 3000);
    return;
  }

  if (!selectedCell) {
    setSnackbarInfo({
      open: true,
      message: "Please select a merged cell to unmerge",
      variant: "info",
    });
    return;
  }

  const colIndex = columns.findIndex(c => c.accessor === selectedCell.columnId);
  const cellKey = `${selectedCell.rowIndex}-${colIndex}`;
  const mergedCell = mergedCells[cellKey];

  // Only allow unmerge if this is the first (anchor) cell of a merge
  if (!mergedCell || !mergedCell.isFirst) {
    setSnackbarInfo({
      open: true,
      message: "Selected cell is not a merged cell",
      variant: "info",
    });
    return;
  }

  saveToUndo(tableData, columns, mergedCells);

  // Remove all entries belonging to this merged group
  const newMergedCells = { ...mergedCells };
  const { startRow, startCol, endRow, endCol } = mergedCell;

  for (let i = startRow; i <= endRow; i++) {
    for (let j = startCol; j <= endCol; j++) {
      delete newMergedCells[`${i}-${j}`];
    }
  }

  setMergedCells(newMergedCells);

  setSnackbarInfo({
    open: true,
    message: `Unmerged ${(endRow - startRow + 1) * (endCol - startCol + 1)} cells`,
    variant: "success",
  });
  setTimeout(() => {
    setSnackbarInfo({ open: false, message: "", variant: "success" });
  }, 3000);
}, [selectedCell, columns, mergedCells, mergedHeaders, headerSelectionRange, tableData, saveToUndo]);
  const handleMergeCells = useCallback(() => {
  // Handle header merge
  if (headerSelectionRange !== null) {
    const { startCol, endCol } = headerSelectionRange;
    if (startCol === endCol) {
      setSnackbarInfo({
        open: true,
        message: "Please select multiple headers to merge",
        variant: "info",
      });
      return;
    }
    const newMergedHeaders = { ...mergedHeaders };
    for (let i = startCol; i <= endCol; i++) {
      if (i === startCol) {
        newMergedHeaders[i] = { isFirst: true, colSpan: endCol - startCol + 1, startCol, endCol };
      } else {
        newMergedHeaders[i] = { hidden: true };
      }
    }
    setMergedHeaders(newMergedHeaders);
    setHeaderSelectionRange(null);
    setSnackbarInfo({ open: true, message: `Merged ${endCol - startCol + 1} headers`, variant: "success" });
    setTimeout(() => setSnackbarInfo({ open: false, message: "", variant: "success" }), 3000);
    return;
  }

  if (!selectedRange) {
    setSnackbarInfo({
      open: true,
      message: "Please select cells first (click one cell, then Shift+click another)",
      variant: "info",
    });
    return;
  }

  const { startRow, startCol, endRow, endCol } = selectedRange;

  if (startRow === endRow && startCol === endCol) {
    setSnackbarInfo({
      open: true,
      message: "Please select multiple cells to merge",
      variant: "info",
    });
    return;
  }

  saveToUndo(tableData, columns, mergedCells);

  const newData = JSON.parse(JSON.stringify(tableData));

  // Step 1: Expand the merge range to cover any existing merged groups
  // that overlap with the selected range
  let expandedStartRow = startRow;
  let expandedStartCol = startCol;
  let expandedEndRow = endRow;
  let expandedEndCol = endCol;

  Object.values(mergedCells).forEach((cell) => {
    if (!cell.isFirst) return;
    // Check if this existing merge overlaps with selected range
    const overlaps =
      cell.startRow <= endRow &&
      cell.endRow >= startRow &&
      cell.startCol <= endCol &&
      cell.endCol >= startCol;
    if (overlaps) {
      expandedStartRow = Math.min(expandedStartRow, cell.startRow);
      expandedStartCol = Math.min(expandedStartCol, cell.startCol);
      expandedEndRow = Math.max(expandedEndRow, cell.endRow);
      expandedEndCol = Math.max(expandedEndCol, cell.endCol);
    }
  });

  const finalRange = {
    startRow: expandedStartRow,
    startCol: expandedStartCol,
    endRow: expandedEndRow,
    endCol: expandedEndCol,
  };

  // Step 2: Collect merged value — read only isFirst cells and plain cells
  // (skip hidden cells to avoid double-counting)
  let mergedValue = '';
  for (let i = finalRange.startRow; i <= finalRange.endRow; i++) {
    for (let j = finalRange.startCol; j <= finalRange.endCol; j++) {
      const cellKey = `${i}-${j}`;
      const existing = mergedCells[cellKey];
      if (existing && !existing.isFirst && existing.hidden) continue; // skip hidden
      const cellValue = newData[i]?.[columns[j]?.accessor];
      if (cellValue && String(cellValue).trim()) {
        mergedValue += (mergedValue ? ' ' : '') + String(cellValue).trim();
      }
    }
  }

  // Step 3: Put merged value on anchor, clear all others in expanded range
  newData[finalRange.startRow] = {
    ...newData[finalRange.startRow],
    [columns[finalRange.startCol].accessor]: mergedValue,
  };
  for (let i = finalRange.startRow; i <= finalRange.endRow; i++) {
    for (let j = finalRange.startCol; j <= finalRange.endCol; j++) {
      if (i === finalRange.startRow && j === finalRange.startCol) continue;
      newData[i] = {
        ...newData[i],
        [columns[j].accessor]: '',
      };
    }
  }

  // Step 4: Remove ALL existing merge entries that touch the expanded range
  const cleanedMergedCells = {};
  Object.entries(mergedCells).forEach(([key, value]) => {
    const [r, c] = key.split('-').map(Number);
    const inRange =
      r >= finalRange.startRow &&
      r <= finalRange.endRow &&
      c >= finalRange.startCol &&
      c <= finalRange.endCol;
    if (!inRange) {
      cleanedMergedCells[key] = value;
    }
  });

  setTableData(newData);
  setSelectedRange(null);
  setMergedCells(computeUpdatedMergedCells(finalRange, cleanedMergedCells));

  setSnackbarInfo({
    open: true,
    message: `Merged ${(finalRange.endRow - finalRange.startRow + 1) * (finalRange.endCol - finalRange.startCol + 1)} cells`,
    variant: "success",
  });
  setTimeout(() => {
    setSnackbarInfo({ open: false, message: "", variant: "success" });
  }, 3000);
  }, [tableData, columns, mergedCells, mergedHeaders, headerSelectionRange, saveToUndo, selectedRange]);
const handleCopyCell = useCallback(() => {
  if (!selectedCell) return;
  
  const cellValue = tableData[selectedCell.rowIndex]?.[selectedCell.columnId];
  if (cellValue) {
    navigator.clipboard.writeText(cellValue);
    setSnackbarInfo({
      open: true,
      message: "Cell content copied to clipboard",
      variant: "success",
    });
    setTimeout(() => {
      setSnackbarInfo({ open: false, message: "", variant: "success" });
    }, 2000);
  }
}, [selectedCell, tableData]);

const handleCellSelect = useCallback((cellInfo, isRange = false) => {
  console.log("handleCellSelect called:", { cellInfo, isRange });
  
  if (isRange && cellInfo.range) {
    console.log("Setting range in App:", cellInfo.range);
    setSelectedRange(cellInfo.range);
    setSelectedCell({ 
      rowIndex: cellInfo.range.startRow, 
      columnId: columns[cellInfo.range.startCol]?.accessor, 
      value: tableData[cellInfo.range.startRow]?.[columns[cellInfo.range.startCol]?.accessor] 
    });
  } else {
    console.log("Setting single cell:", cellInfo);
    setSelectedCell(cellInfo);
    setSelectedRange(null);
  }
}, [columns, tableData]);

const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };

const parseHtmlTableToData = (htmlString) => {
  try {
    console.log('Parsing HTML table:', htmlString);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');
    
    if (!table) {
      console.warn('No table found in HTML');
      return { rows: [], columns: [], mergedCells: {} };
    }

    const headers = [];
    const headerRow = table.querySelector('thead tr');
    
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll('th');
      headerCells.forEach((cell, index) => {
        const headerText = cell.textContent?.trim() || `Column ${index + 1}`;
        headers.push({
          accessor: `col${index + 1}`,
          Header: headerText,
          type: 'text',
          width: 150,
          editable: true,
        });
      });
    }

    if (headers.length === 0) {
      const firstRow = table.querySelector('tbody tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td');
        cells.forEach((_, index) => {
          headers.push({
            accessor: `col${index + 1}`,
            Header: `Column ${index + 1}`,
            type: 'text',
            width: 150,
            editable: true,
          });
        });
      }
    }

    const rows = [];
    const mergedCells = {};
    const tbody = table.querySelector('tbody');
    
    if (tbody) {
      const dataRows = tbody.querySelectorAll('tr');
      
      dataRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        let colIndex = 0;
        
        cells.forEach((cell) => {
          const colSpan = parseInt(cell.getAttribute('colSpan') || '1');
          const rowSpan = parseInt(cell.getAttribute('rowSpan') || '1');
          
          if (colSpan > 1 || rowSpan > 1) {
            const cellKey = `${rowIndex}-${colIndex}`;
            mergedCells[cellKey] = {
              isFirst: true,
              colSpan: colSpan,
              rowSpan: rowSpan,
              startRow: rowIndex,
              startCol: colIndex,
              endRow: rowIndex + rowSpan - 1,
              endCol: colIndex + colSpan - 1
            };
            
            for (let i = rowIndex; i < rowIndex + rowSpan; i++) {
              for (let j = colIndex; j < colIndex + colSpan; j++) {
                if (i === rowIndex && j === colIndex) continue;
                const hiddenKey = `${i}-${j}`;
                mergedCells[hiddenKey] = {
                  isFirst: false,
                  hidden: true
                };
              }
            }
          }
          
          colIndex += colSpan;
        });
      });
      
      dataRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        const rowData = { id: rowIndex + 1 };
        
        let colIndex = 0;
        cells.forEach((cell) => {
          const colSpan = parseInt(cell.getAttribute('colSpan') || '1');
          
          if (colIndex < headers.length) {
            const cellContent = cell.innerHTML
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/<[^>]*>/g, '')
              .trim();
            rowData[headers[colIndex].accessor] = cellContent || cell.textContent?.trim() || '';
          }
          
          colIndex += colSpan;
        });
        
        rows.push(rowData);
      });
    }

    console.log('Parsed rows:', rows);
    console.log('Parsed columns:', headers);
    console.log('Detected merged cells:', mergedCells);
    
    return { rows, columns: headers, mergedCells };
    
  } catch (error) {
    console.error('Error parsing HTML table:', error);
    return { rows: [], columns: [], mergedCells: {} };
  }
};

const convertDataToHtmlTable = (data, cols, mc = mergedCells) => {
  let html = '<table>\n';
  
  if (cols && cols.length > 0) {
    html += '  <thead>\n     <tr>\n';
    cols.forEach(col => {
      html += `      <th>${col.Header || col.accessor}</th>\n`;
    });
    html += '     </tr>\n  </thead>\n';
  }
  
  if (data && data.length > 0) {
    html += '  <tbody>\n';
    data.forEach((row, rowIndex) => {
      html += '      <tr>\n';
      
      let colIndex = 0;
      while (colIndex < cols.length) {
        const cellKey = `${rowIndex}-${colIndex}`;
        const mergedCell = mc[cellKey];
        
        if (mergedCell && mergedCell.hidden) {
          colIndex++;
          continue;
        }
        
        const colSpan = mergedCell && mergedCell.colSpan ? mergedCell.colSpan : 1;
        const rowSpan = mergedCell && mergedCell.rowSpan ? mergedCell.rowSpan : 1;
        
        let cellValue = row[cols[colIndex]?.accessor] || '';
        if (mergedCell && mergedCell.isFirst) {
          cellValue = data[mergedCell.startRow]?.[cols[mergedCell.startCol]?.accessor] || '';
        }
        
        if (colSpan > 1 || rowSpan > 1) {
          html += `        <td colSpan="${colSpan}" rowSpan="${rowSpan}">${cellValue}</td>\n`;
        } else {
          html += `        <td>${cellValue}</td>\n`;
        }
        
        colIndex += colSpan;
      }
      
      html += '      </tr>\n';
    });
    html += '  </tbody>\n';
  }
  
  html += '</table>';
  
  return html;
};

const handleAutosave = async () => {
    setAutoSaveTrigger(false);

        if(AnnotationsTaskDetails[0]?.annotation_status != "labeled"&& annotations[0]?.task == taskId){


    if(!autoSave) return;

      const htmlTable = convertDataToHtmlTable(tableData, columns);

    const resultData = {
    text: htmlTable,
  };
    const reqBody = {
      task_id: taskId,
      auto_save: true,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(annotations[0]?.lead_time ?? 0),
      result: resultData,
    };
    if (annotations[0]?.id && taskDetails?.annotation_users?.some((users) => users === user.id)) {

      try{
        const obj = new SaveTranscriptOCRAPI(annotations[0]?.id, reqBody);
        const res = await fetch(obj.apiEndPoint(), {
          method: "PATCH",
          body: JSON.stringify(obj.getBody()),
          headers: obj.getHeaders().headers,
        });
        if (!res.ok) {
          const data = await res.json();
          setSnackbarInfo({
            open: true,
            message: data.message,
            variant: "error",
          });
        }
        return res;
      }
      catch(err) {
        setSnackbarInfo({
          open: true,
          message: "Error in autosaving "+err,
          variant: "error",
        });
      }
    }}
  };
  
  useEffect(() => {
     autoSaveTrigger && handleAutosave();


  }, [autoSaveTrigger, autoSave, handleAutosave,user,tableData, annotations, taskDetails,taskId]);
  

   useEffect(() => {
      if(!autoSave) return;
  
      const handleUpdateTimeSpent = (time = 60) => {
        // const apiObj = new UpdateTimeSpentPerTask(taskId, time);
        // dispatch(APITransport(apiObj));
      };
  
      saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);
      timeSpentIntervalRef.current = setInterval(
        handleUpdateTimeSpent,
        60 * 1000
      );
  
      const handleBeforeUnload = (event) => {
        setAutoSaveTrigger(true);
        handleUpdateTimeSpent(ref.current);
        event.preventDefault();
        event.returnValue = "";
        ref.current = 0;
      };
  
      const handleInteraction = () => {
        setLastInteraction(Date.now());
        setIsActive(true);
      };
  
      const checkInactivity = () => {
        const currentTime = Date.now();
        if (currentTime - lastInteraction >= inactivityThreshold) {
          setIsActive(false);
        }
      };
  
      document.addEventListener('mousemove', handleInteraction);
      document.addEventListener('keydown', handleInteraction);
      const interval = setInterval(checkInactivity, 1000);
  
      if(!isActive){
        handleUpdateTimeSpent(ref.current);
        clearInterval(saveIntervalRef.current);
        clearInterval(timeSpentIntervalRef.current);
        ref.current = 0;
      }
  
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          // Tab is active, restart the autosave interval
          saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);
          timeSpentIntervalRef.current = setInterval(
            handleUpdateTimeSpent,
            60 * 1000
          );
        } else {
          setAutoSaveTrigger(true);
          handleUpdateTimeSpent(ref.current);
          // Tab is inactive, clear the autosave interval
          clearInterval(saveIntervalRef.current);
          clearInterval(timeSpentIntervalRef.current);
          ref.current = 0;
        }
    };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);
  
      return () => {
        document.removeEventListener('mousemove', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        clearInterval(interval);
        clearInterval(saveIntervalRef.current);
        clearInterval(timeSpentIntervalRef.current);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
  
      // eslint-disable-next-line
    }, [autoSave, user, taskId, annotations, taskDetails, isActive]);

useEffect(() => {
  setMergedCells({});
  setMergedHeaders({});
  setUndoStack([]);
  setRedoStack([]);
  setSelectedRange(null);
}, [taskId]);

  const getTaskData = async (id) => {
    setInitialLoading(true);
    try {
      
      const taskObj = new GetTaskDetailsAPI(id);
      dispatch(APITransport(taskObj));
      
      const res = await fetch(taskObj.apiEndPoint(), {
        method: "GET",
        headers: taskObj.getHeaders().headers,
      });
      
      const resp = await res.json();
      
      if (!res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message || "Failed to fetch task data",
          variant: "error",
        });
        setInitialLoading(false);
        return;
      }
      
      setTaskData(resp);
      
      if (resp?.data?.image_url) {
        setImageUrl(resp?.data?.image_url);
      }
      
      const annotationText = AnnotationsTaskDetails?.[0]?.result?.text;

if (
  (!annotationText || annotationText.trim() === "") &&
  resp?.data?.ocr_prediction_json?.text
) {
  const { rows, columns: parsedColumns } =
    parseHtmlTableToData(resp.data.ocr_prediction_json.text);

  setTableData(rows);
  setColumns(parsedColumns);
  setOriginalHtmlTable(resp.data.ocr_prediction_json.text);
}
      
    } catch (error) {
      console.error('Error fetching task data:', error);
      setSnackbarInfo({
        open: true,
        message: "Error loading task data",
        variant: "error",
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const saveAnnotation = useCallback(async (status = 'draft') => {
    if (!annotationId || !taskId) {
      setSnackbarInfo({
        open: true,
        message: "No active annotation to save",
        variant: "error",
      });
      return;
    }

    setLoading(true);
    
    try {
      const htmlTable = convertDataToHtmlTable(tableData, columns);
      
      const patchData = {
        task_id: taskId,
        annotation_status: status,
        result: {
          text: htmlTable,
        },
        lead_time: 0,
      };

      const apiObj = new PatchAnnotationOCRAPI(annotationId, patchData);
      
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      
      const resp = await res.json();
      
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message || `Table ${status === 'labeled' ? 'submitted' : 'saved as draft'} successfully`,
          variant: "success",
        });
        saveToUndo(tableData, columns, mergedCells);
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message || "Failed to save table data",
          variant: "error",
        });
      }
    } catch (error) {
      console.error('Error saving annotation:', error);
      setSnackbarInfo({
        open: true,
        message: "Error saving table data",
        variant: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSnackbarInfo({ open: false, message: "", variant: "success" });
      }, 3000);
    }
  }, [annotationId, taskId, tableData, columns, mergedCells, taskData]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const container = document.querySelector('.main-container');
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      const constrainedWidth = Math.min(Math.max(newLeftWidth, 20), 80);
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSplitterMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

// CHANGED: handleUndo uses functional setter for setUndoStack to avoid stale closure
const handleUndo = useCallback(() => {
  setUndoStack(prev => {
    if (prev.length === 0) return prev;
    const lastState = prev[prev.length - 1];
    setRedoStack(r => [...r, {
      data: JSON.parse(JSON.stringify(tableData)),
      columns: JSON.parse(JSON.stringify(columns)),
      mergedCells: JSON.parse(JSON.stringify(mergedCells))
    }]);
    setTableData(JSON.parse(JSON.stringify(lastState.data)));
    setColumns(JSON.parse(JSON.stringify(lastState.columns)));
    setMergedCells(JSON.parse(JSON.stringify(lastState.mergedCells || {})));
    setMergedHeaders(JSON.parse(JSON.stringify(lastState.mergedHeaders || {})));
    setSelectedRange(null);
    setSelectionStart(null);
    setSelectionEnd(null);
    return prev.slice(0, -1);
  });
}, [tableData, columns, mergedCells]);

// CHANGED: handleRedo uses functional setter for setRedoStack to avoid stale closure
const handleRedo = useCallback(() => {
  setRedoStack(prev => {
    if (prev.length === 0) return prev;
    const nextState = prev[prev.length - 1];
    setUndoStack(u => [...u, {
      data: JSON.parse(JSON.stringify(tableData)),
      columns: JSON.parse(JSON.stringify(columns)),
      mergedCells: JSON.parse(JSON.stringify(mergedCells))
    }]);
    setTableData(JSON.parse(JSON.stringify(nextState.data)));
    setColumns(JSON.parse(JSON.stringify(nextState.columns)));
    setMergedCells(JSON.parse(JSON.stringify(nextState.mergedCells || {})));
    setMergedHeaders(JSON.parse(JSON.stringify(nextState.mergedHeaders || {})));
    setSelectedRange(null);
    setSelectionStart(null);
    setSelectionEnd(null);
    return prev.slice(0, -1);
  });
}, [tableData, columns, mergedCells]);

// CHANGED: pass current state explicitly to saveToUndo
const handleReorderColumns = useCallback((newColumns, newData, newMergedCells) => {
  saveToUndo(tableData, columns, mergedCells);
  setColumns([...newColumns]);
  setTableData([...newData]);
  setMergedCells({...newMergedCells});
}, [saveToUndo, tableData, columns, mergedCells]);

// CHANGED: pass current state explicitly to saveToUndo
const handleReorderRows = useCallback((newData, newMergedCells) => {
  saveToUndo(tableData, columns, mergedCells);
  setTableData([...newData]);
  setMergedCells({...newMergedCells});
}, [saveToUndo, tableData, columns, mergedCells]);

// CHANGED: pass current state explicitly to saveToUndo
const handleCellEdit = useCallback((rowIndex, columnId, value) => {
    saveToUndo(tableData, columns, mergedCells);
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value
      };
      return newData;
    });
  }, [saveToUndo, tableData, columns, mergedCells]);

// CHANGED: pass current state explicitly to saveToUndo
  const handleAddRow = useCallback(() => {
    saveToUndo(tableData, columns, mergedCells);
    const newRow = { id: tableData.length + 1 };
    columns.forEach(col => {
      newRow[col.accessor] = '';
    });
    setTableData(prev => [...prev, newRow]);
  }, [columns, tableData, mergedCells, saveToUndo]);

// CHANGED: pass current state explicitly to saveToUndo
  const handleAddColumn = useCallback(() => {
    saveToUndo(tableData, columns, mergedCells);
    const newColIndex = columns.length + 1;
    const newColumn = {
      accessor: `col${newColIndex}`,
      Header: `Column ${newColIndex}`,
      type: 'text',
      width: 150,
      editable: true,
    };
    
    setColumns(prev => [...prev, newColumn]);
    setTableData(prev => 
      prev.map(row => ({
        ...row,
        [`col${newColIndex}`]: ''
      }))
    );
  }, [columns, tableData, mergedCells, saveToUndo]);

// FIXED: shift mergedCells row indices when inserting a row before the selected cell
  const handleAddRowBefore = useCallback(() => {
    if (!selectedCell) return;
    saveToUndo(tableData, columns, mergedCells);
    const insertAt = selectedCell.rowIndex;
    const newRow = { id: Date.now() };
    columns.forEach(col => { newRow[col.accessor] = ''; });
    setTableData(prev => {
      const next = [...prev];
      next.splice(insertAt, 0, newRow);
      return next;
    });
    // Shift all merged cell indices that are at or below the insertion point
    setMergedCells(prev => shiftMergedCellsForRowInsert(prev, insertAt));
  }, [selectedCell, columns, tableData, mergedCells, saveToUndo]);

// FIXED: shift mergedCells row indices when inserting a row after the selected cell
  const handleAddRowAfter = useCallback(() => {
    if (!selectedCell) return;
    saveToUndo(tableData, columns, mergedCells);
    const insertAt = selectedCell.rowIndex + 1;
    const newRow = { id: Date.now() };
    columns.forEach(col => { newRow[col.accessor] = ''; });
    setTableData(prev => {
      const next = [...prev];
      next.splice(insertAt, 0, newRow);
      return next;
    });
    // Shift all merged cell indices that are at or below the insertion point
    setMergedCells(prev => shiftMergedCellsForRowInsert(prev, insertAt));
  }, [selectedCell, columns, tableData, mergedCells, saveToUndo]);

// FIXED: insert before the outermost start of any merged span covering the selected col
  const handleAddColBefore = useCallback(() => {
    if (!selectedCell) return;
    saveToUndo(tableData, columns, mergedCells);
    const colIndex = columns.findIndex(c => c.accessor === selectedCell.columnId);
    if (colIndex === -1) return;
    // If this cell is part of a merged group, insert before the span's start
    const { spanStart } = getMergeAwareColBounds(colIndex, mergedCells);
    const insertAt = spanStart;
    const newAccessor = `col_${Date.now()}`;
    const newColumn = {
      accessor: newAccessor,
      Header: `Column ${columns.length + 1}`,
      type: 'text',
      width: 150,
      editable: true,
    };
    setColumns(prev => {
      const next = [...prev];
      next.splice(insertAt, 0, newColumn);
      return next;
    });
    setTableData(prev => prev.map(row => ({ ...row, [newAccessor]: '' })));
    setMergedCells(prev => shiftMergedCellsForColInsert(prev, insertAt));
  }, [selectedCell, columns, tableData, mergedCells, saveToUndo]);

// FIXED: insert after the outermost end of any merged span covering the selected col
  const handleAddColAfter = useCallback(() => {
    if (!selectedCell) return;
    saveToUndo(tableData, columns, mergedCells);
    const colIndex = columns.findIndex(c => c.accessor === selectedCell.columnId);
    if (colIndex === -1) return;
    // If this cell is part of a merged group, insert after the span's end
    const { spanEnd } = getMergeAwareColBounds(colIndex, mergedCells);
    const insertAt = spanEnd + 1;
    const newAccessor = `col_${Date.now()}`;
    const newColumn = {
      accessor: newAccessor,
      Header: `Column ${columns.length + 1}`,
      type: 'text',
      width: 150,
      editable: true,
    };
    setColumns(prev => {
      const next = [...prev];
      next.splice(insertAt, 0, newColumn);
      return next;
    });
    setTableData(prev => prev.map(row => ({ ...row, [newAccessor]: '' })));
    setMergedCells(prev => shiftMergedCellsForColInsert(prev, insertAt));
  }, [selectedCell, columns, tableData, mergedCells, saveToUndo]);

// FIXED: update mergedCells when deleting a row
  const handleDeleteRow = useCallback((rowIndex) => {
    saveToUndo(tableData, columns, mergedCells);
    setTableData(prev => prev.filter((_, index) => index !== rowIndex));
    setMergedCells(prev => shiftMergedCellsForRowDelete(prev, rowIndex));
  }, [saveToUndo, tableData, columns, mergedCells]);

// FIXED: update mergedCells when deleting a column
  const handleDeleteColumn = useCallback((columnId) => {
    saveToUndo(tableData, columns, mergedCells);
    const colIndex = columns.findIndex(c => c.accessor === columnId);
    setColumns(prev => prev.filter(col => col.accessor !== columnId));
    setTableData(prev =>
      prev.map(row => {
        const newRow = { ...row };
        delete newRow[columnId];
        return newRow;
      })
    );
    if (colIndex !== -1) {
      setMergedCells(prev => shiftMergedCellsForColDelete(prev, colIndex));
    }
  }, [saveToUndo, tableData, columns, mergedCells]);

// CHANGED: pass current state explicitly to saveToUndo
  const handleClearAll = useCallback(() => {
    saveToUndo(tableData, columns, mergedCells);
    setTableData([]);
    setColumns([]);
  }, [saveToUndo, tableData, columns, mergedCells]);

  const handleSave = useCallback(() => {
    saveAnnotation('labeled');
  }, [saveAnnotation]);

  const handleSaveDraft = useCallback(() => {
    saveAnnotation('draft');
  }, [saveAnnotation]);

  const handleExport = useCallback(() => {
    const htmlTable = convertDataToHtmlTable(tableData, columns);
    const blob = new Blob([htmlTable], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table_export_${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSnackbarInfo({
      open: true,
      message: "Table exported successfully",
      variant: "success",
    });
    setTimeout(() => {
      setSnackbarInfo(prev => ({ ...prev, open: false }));
    }, 3000);
  }, [tableData, columns]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.html') && !fileName.endsWith('.htm')) {
        setSnackbarInfo({
          open: true,
          message: "Unsupported file type. Please upload a .html or .htm file",
          variant: "error",
        });
        setTimeout(() => {
          setSnackbarInfo({ open: false, message: "", variant: "success" });
        }, 3000);
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const htmlContent = event.target.result;
        try {
          const { rows, columns: newColumns } = parseHtmlTableToData(htmlContent);
          
          if (rows.length > 0 && newColumns.length > 0) {
            saveToUndo(tableData, columns, mergedCells);
            setTableData(rows);
            setColumns(newColumns);
            
            setSnackbarInfo({
              open: true,
              message: "Table imported successfully",
              variant: "success",
            });
          } else {
            setSnackbarInfo({
              open: true,
              message: "Invalid file: No HTML table structure (<table> element) found in the file",
              variant: "error",
            });
          }
        } catch (err) {
          console.error("Error parsing imported HTML table:", err);
          setSnackbarInfo({
            open: true,
            message: "Failed to parse file: The HTML structure is malformed or invalid",
            variant: "error",
          });
        }
        
        setTimeout(() => {
          setSnackbarInfo(prev => ({ ...prev, open: false }));
        }, 3000);
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [saveToUndo, tableData, columns, mergedCells]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  const handleImageMouseDown = useCallback((e) => {
    if (zoom <= 1) return; // Only allow panning when zoomed in
    e.preventDefault();
    setIsPanning(true);
    
    const container = document.querySelector('.image-container');
    if (container) {
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        scrollLeft: container.scrollLeft,
        scrollTop: container.scrollTop
      });
    }
  }, [zoom]);

  const handleImageMouseMove = useCallback((e) => {
    if (!isPanning) return;
    const container = document.querySelector('.image-container');
    if (container) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      container.scrollLeft = panStart.scrollLeft - dx;
      container.scrollTop = panStart.scrollTop - dy;
    }
  }, [isPanning, panStart]);

  const handleImageMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleLanguageChange = useCallback((langCode) => {
    setSelectedLanguage(langCode);
  }, []);

  useEffect(() => {
      var Annotation = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 1
      )[0];
  }, [AnnotationsTaskDetails]);

useEffect(() => {
  const annotationText = annotations?.[0]?.result?.text;
  const ocrText = taskData?.data?.ocr_prediction_json?.text;

  const finalText =
    annotationText && annotationText.trim() !== ""
      ? annotationText
      : ocrText;

  if (finalText && finalText !== originalHtmlTable) {
    console.log('Loading table data from:', finalText.substring(0, 100));
    const { rows, columns: parsedColumns, mergedCells: parsedMergedCells } = parseHtmlTableToData(finalText);
    setTableData(rows);
    setColumns(parsedColumns);
    setOriginalHtmlTable(finalText);
    setUndoStack([]);
    setRedoStack([]);
    setMergedCells(parsedMergedCells);
  }
}, [annotations, taskData, taskId]);

const handleTranscribe = useCallback((text) => {
    console.log(`Transcribing to ${selectedLanguage}: ${text}`);
    return `[Translated to ${selectedLanguage}]: ${text}`;
  }, [selectedLanguage]);

  const handleAnnotationClick = async (
    value,
    id,
    lead_time,
  ) => {
   setLoading(true);
    setAutoSave(false);
      const htmlTable = convertDataToHtmlTable(tableData, columns);

    const resultData = {
    text: htmlTable,
  };
  
  const PatchAPIdata = {
    task_id: taskId,
    annotation_notes: JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
    annotation_status: value,
    result: resultData,
    lead_time:(new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
  };
    if (["draft", "skipped","labeled"].includes(value) ) {
      const TaskObj = new PatchAnnotationOCRAPI(id, PatchAPIdata);
      const res = await fetch(TaskObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(TaskObj.getBody()),
        headers: TaskObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        if (localStorage.getItem("labelAll") || value === "skipped") {
          onNextAnnotation(resp.task);
        }
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setAutoSave(true);
        setSnackbarInfo({
          open: true,
          message: resp?.message ? resp?.message : "This task is having duplicate annotation. Please deallocate this task",
          variant: "error",
        });
      }
    } else {
      setAutoSave(true);
       {
        setSnackbarInfo({
          open: true,
          message: "Error in saving annotation",
          variant: "error",
        });
      }
    }
    setLoading(false);
    setShowNotes(false);
  };
  
    const tasksComplete = (id) => {
    if (id) {
      navigate(`/projects/${projectId}/OCRTable/${id}`);
      window.location.reload(true);
    } else {
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
        window.location.reload();
      }, 1000);
    }
  };

  const onNextAnnotation = async (value) => {
    setLoading(true);
    const nextAPIData = {
      id: projectId,
      current_task_id: taskId,
      mode: "annotation",
      annotation_status: labellingMode,
    };

    let apiObj = new GetNextProjectAPI(projectId, nextAPIData);
    var rsp_data = [];
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        rsp_data = await response.json();
        setLoading(false);
        if (response.ok) {
          setNextData(rsp_data);
          tasksComplete(rsp_data?.id || null);
          getAnnotationsTaskData(rsp_data?.id);
          getTaskData(rsp_data?.id)
        }
      })
      .catch((error) => {
        setSnackbarInfo({
          open: true,
          message: "No more tasks to label",
          variant: "info",
        });
        setTimeout(() => {
          localStorage.removeItem("labelAll");
          window.location.replace(`/#/projects/${projectId}`);
        }, 1000);
      });
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigins={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  if (initialLoading) {
    return (
      <div className="loading-container">
        <CircularIndeterminate />
        <p>Loading task data...</p>
      </div>
    );
  }

  return (
    <div className="app" dir="ltr">
      {renderSnackBar()}
      {loading && <div className="loading-overlay"><CircularIndeterminate /></div>}

      <div className="main-container" dir="ltr">
        {/* Left Panel with Navigation and Image */}
        <div className="left-panel" style={{ width: `${leftWidth}%` }}>
          <div className="image-navigation">
            <div className="nav-left">
              <Button
                startIcon={<ArrowBackIcon />}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  minWidth: 'auto',
                  fontSize: '0.7rem',
                  px: 1,
                  py: 0.3
                }}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("labelAll");
                  }
                  navigate(`/projects/${projectId}`, { replace: true, state: { fromBackToProject: true } });
                }}
              >
                Back
              </Button>
              <span className="task-number">Task #{taskId || '12775722'}</span>
              <Button
                endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color={reviewtext.trim().length === 0 ? "primary" : "success"}
                size="small"
                sx={{
                  minWidth: '70px',
                  fontSize: '0.7rem',
                  px: 1,
                  py: 0.3,
                  ml: 0.5,
                  flexShrink: 0,
                }}
                onClick={handleCollapseClick}
              >
                Notes {reviewtext.trim().length === 0 ? "" : "*"}
              </Button>
            </div>
            
            <div className="nav-right">
              <AnnotationStageButtons
                handleAnnotationClick={handleAnnotationClick}
                onNextAnnotation={onNextAnnotation}
                AnnotationsTaskDetails={AnnotationsTaskDetails}
                disableBtns={disableBtns}
                disableUpdateButton={disableUpdateButton}
                disableSkipButton={disableSkipButton}
                filterMessage={filterMessage}
                taskData={taskData}
              />
            </div>
          </div>
          <div
            className={classes.collapse}
            style={{
              display: showNotes ? "block" : "none",
              paddingBottom: "16px",
              height: "175px", overflow: "scroll"
            }}
          >
            <ReactQuill
              ref={annotationNotesRef}
              modules={modules}
              bounds={"#note"}
              formats={formats}
              placeholder="Annotation Notes" />
            <ReactQuill
              ref={reviewNotesRef}
              modules={modules}
              bounds={"#note"}
              readOnly={true}
              formats={formats}
              placeholder="Review Notes" />
          </div>

          <div className="image-container">
            <img
              src={imageUrl || "/api/placeholder/400/600"}
              alt="Table Reference"
              className="reference-image"
              onMouseDown={handleImageMouseDown}
              onMouseMove={handleImageMouseMove}
              onMouseUp={handleImageMouseUp}
              onMouseLeave={handleImageMouseUp}
              style={{
                width: zoom === 1 ? '100%' : `${100 * zoom}%`,
                maxWidth: 'none',
                height: 'auto',
                cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                transition: isPanning ? 'none' : 'width 0.2s ease-out',
              }}
            />
          </div>
          <div className="image-zoom-controls">
            <button onClick={handleZoomIn} title="Zoom In">+</button>
            <button onClick={handleZoomOut} title="Zoom Out">−</button>
            <button onClick={handleZoomReset} title="Reset Zoom">Reset</button>
          </div>
        </div>

        {/* Draggable Splitter */}
        <div 
          className={`splitter ${isDragging ? 'dragging' : ''}`}
          ref={splitterRef}
          onMouseDown={handleSplitterMouseDown}
        >
          <div className="splitter-line"></div>
          <div className="splitter-handle">
            <span className="splitter-dots">⋮⋮</span>
          </div>
          <div className="splitter-line"></div>
        </div>
        
        {/* Right Panel */}
        <div className="right-panel" style={{ width: `${100 - leftWidth}%` }}>
          {/* Table Controls */}
          <TableControls
            totalRows={tableData.length}
            totalColumns={columns.length}
            onAddRow={handleAddRow}
            onAddColumn={handleAddColumn}
            onDeleteRow={handleDeleteRow}
            onDeleteColumn={handleDeleteColumn}
            onUndo={handleUndo}
            onRedo={handleRedo}
            undoStack={undoStack}
            redoStack={redoStack}
            onSave={handleAutosave}
            onSaveDraft={handleSaveDraft}
            onExport={handleExport}
            onImport={handleImport}
            fontSize={fontSize}
            setFontSize={setFontSize}
            enableTransliteration={enableTransliteration}
            setTransliteration={setEnableTransliteration}
            enableRTL={enableRTL}
            setRTL={setEnableRTL}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            alternateRowColor={alternateRowColor}
            setAlternateRowColor={setAlternateRowColor}
            theme={theme}
            setTheme={setTheme}
            onClearAll={handleClearAll}
            selectedCell={selectedCell}
            onBulkDelete={handleBulkDelete}
            onMergeCells={handleMergeCells}
            onCopyCell={handleCopyCell}
           isCellSelected={
  selectedRange !== null ||
  (headerSelectionRange !== null && headerSelectionRange.startCol !== headerSelectionRange.endCol) ||
  (headerSelectionRange !== null && (
    mergedHeaders[headerSelectionRange.startCol]?.isFirst ||
    mergedHeaders[headerSelectionRange.startCol]?.hidden
  )) ||
  (() => {
    if (!selectedCell) return false;
    const colIndex = columns.findIndex(c => c.accessor === selectedCell.columnId);
    const cellKey = `${selectedCell.rowIndex}-${colIndex}`;
    return !!mergedCells[cellKey]?.isFirst;
  })()
}
            onAddRowBefore={handleAddRowBefore}
            onAddRowAfter={handleAddRowAfter}
            onAddColBefore={handleAddColBefore}
            onAddColAfter={handleAddColAfter}
              onUnmergeCells={handleUnmergeCells}

          />
          
          <div className="table-container">
            {columns.length === 0 ? (
              <div className="create-table-placeholder">
                <h3>No table data found</h3>
                <p>Add a new table to start annotating.</p>
                <div className="create-table-inputs">
                  <div className="input-group">
                    <label>Rows</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={newTableRows} 
                      onChange={(e) => setNewTableRows(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Columns</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="20" 
                      value={newTableCols} 
                      onChange={(e) => setNewTableCols(Math.max(1, parseInt(e.target.value) || 1))} 
                    />
                  </div>
                </div>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCreateNewTable}
                >
                  Create Table
                </Button>
              </div>
            ) : (
              <DataTable
                data={tableData}
                columns={columns}
                onCellEdit={handleCellEdit}
                onDeleteRow={handleDeleteRow}
                onDeleteColumn={handleDeleteColumn}
                onCellSelect={handleCellSelect}
                onReorderColumns={handleReorderColumns}
                onReorderRows={handleReorderRows}
                language={selectedLanguage}
                transcriptionMode={transcriptionMode}
                onTranscribe={handleTranscribe}
                fontSize={fontSize}
                enableRTL={enableRTL}
                showGrid={showGrid}
                alternateRowColor={alternateRowColor}
                enableTransliteration={enableTransliteration}
                ProjectDetails={ProjectDetails}
                mergedCells={mergedCells}
                onMergedCellsChange={setMergedCells}
                mergedHeaders={mergedHeaders}
                onMergedHeadersChange={setMergedHeaders}
                headerSelectionRange={headerSelectionRange}
                onHeaderSelectionChange={setHeaderSelectionRange}
              />
            )}
          </div>
          
          {transcriptionMode && (
            <TranslationBar 
              selectedLanguage={selectedLanguage}
              languages={languages}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
