// Updated App.js with task API integration
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
import AnnotationStageButtons from '../../component/CL-Transcription/AnnotationStageButtons';
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
import SaveTranscriptAPI from '../../../../redux/actions/CL-Transcription/SaveTranscript';
import { Button } from '@mui/material';
import PatchAnnotationOCRAPI from '../../../../redux/actions/CL-Transcription/PatchAnnoationOCR';
import GetAnnotationsTaskOCRAPI from '../../../../redux/actions/CL-Transcription/GetAnnotationsTaskOCR';

function App() {
    const classes = AudioTranscriptionLandingStyle();
    const saveIntervalRef = useRef(null);
    const ref = useRef(0);
  
  const dispatch = useDispatch();
  const { projectId, taskId } = useParams();
    const navigate = useNavigate();
    const annotationNotesRef = useRef(null);
    const reviewNotesRef = useRef(null);
  
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [originalHtmlTable, setOriginalHtmlTable] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcriptionMode, setTranscriptionMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
    const [loadtime, setloadtime] = useState(new Date());
    let labellingMode = localStorage.getItem("labellingMode");
  const timeSpentIntervalRef = useRef(null);

  // Annotation stage states
  const [annotationsTaskDetails, setAnnotationsTaskDetails] = useState([]);
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
    const [isActive, setIsActive] = useState(true);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const inactivityThreshold = 120000; 
  
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
  
  // Splitter state
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const splitterRef = useRef(null);
  const [autoSave, setAutoSave] = useState(true);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);

  // Table settings state
  const [fontSize, setFontSize] = useState(14);
  const [enableTransliteration, setEnableTransliteration] = useState(false);
  const [enableRTL, setEnableRTL] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [alternateRowColor, setAlternateRowColor] = useState(true);
  const [theme, setTheme] = useState({ name: "Default", primary: "#667eea", secondary: "#764ba2" });
  
  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Language options
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


  // Fetch task data on component mount
    const getAnnotationsTaskData = (id) => {
      // setLoading(true);
      const userObj = new GetAnnotationsTaskOCRAPI(id);
      dispatch(APITransport(userObj));
    };
  
    useEffect(() => {
      getAnnotationsTaskData(taskId);
      getProjectDetails();
      getTaskData(taskId);
    }, []);
useEffect(() => {
  if (AnnotationsTaskDetails && AnnotationsTaskDetails.length > 0 && 
      annotationNotesRef.current && reviewNotesRef.current) {
    console.log("notes", AnnotationsTaskDetails);
    
    // Set value for annotation notes
    if (annotationNotesRef.current) {
      annotationNotesRef.current.value = AnnotationsTaskDetails[0].annotation_notes ?? "";
      
      try {
        const newDelta2 = annotationNotesRef.current.value !== "" ? 
          JSON.parse(annotationNotesRef.current.value) : "";
        annotationNotesRef.current.getEditor().setContents(newDelta2);
      } catch (err) {
        if (err && annotationNotesRef.current) {
          const newDelta2 = annotationNotesRef.current.value;
          annotationNotesRef.current.getEditor().setText(newDelta2);
        }
      }
    }
    
    // Set value for review notes
    if (reviewNotesRef.current) {
      reviewNotesRef.current.value = AnnotationsTaskDetails[0].review_notes ?? "";
      
      try {
        const newDelta1 = reviewNotesRef.current.value !== "" ? 
          JSON.parse(reviewNotesRef.current.value) : "";
        reviewNotesRef.current.getEditor().setContents(newDelta1);
      } catch (err) {
        if (err && reviewNotesRef.current) {
          const newDelta1 = reviewNotesRef.current.value;
          reviewNotesRef.current.getEditor().setText(newDelta1);
        }
      }
    }
    
    setannotationtext(annotationNotesRef.current?.getEditor().getText() || "");
    setreviewtext(reviewNotesRef.current?.getEditor().getText() || "");
  }
}, [AnnotationsTaskDetails]);  
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
        // [{ 'color': [] }],
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

          Message =
            "This is the Super Checker's Annotation in read only mode";

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
          Message =
            "This is the Reviewer's Annotation in read only mode";
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;

        Message =
          "Skip button is disabled, since the task is being reviewed";
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message =
          "Skip button is disabled, since the task is being reviewed";
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

  const handleCollapseClick = () => {
    // !showNotes && setShowStdTranscript(false);
        // !showNotes ;
    setShowNotes(!showNotes);
  };

  // Parse HTML table to DataTable format
// Enhanced parseHtmlTableToData function
const parseHtmlTableToData = (htmlString) => {
  try {
    console.log('Parsing HTML table:', htmlString);
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const table = doc.querySelector('table');
    
    if (!table) {
      console.warn('No table found in HTML');
      return { rows: [], columns: [] };
    }

    // Extract headers
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

    // If no headers found, create default columns based on first row
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

    // Extract data rows
    const rows = [];
    const tbody = table.querySelector('tbody');
    if (tbody) {
      const dataRows = tbody.querySelectorAll('tr');
      dataRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        const rowData = { id: rowIndex + 1 };
        
        cells.forEach((cell, cellIndex) => {
          if (cellIndex < headers.length) {
            // Handle HTML content inside cells (like <br/> tags)
            const cellContent = cell.innerHTML
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/<[^>]*>/g, '') // Remove any other HTML tags
              .trim();
            rowData[headers[cellIndex].accessor] = cellContent || cell.textContent?.trim() || '';
          }
        });
        
        rows.push(rowData);
      });
    }

    console.log('Parsed rows:', rows);
    console.log('Parsed columns:', headers);
    
    return { rows, columns: headers };
    
  } catch (error) {
    console.error('Error parsing HTML table:', error);
    return { rows: [], columns: [] };
  }
};
  // Convert DataTable format back to HTML table
// Enhanced convertDataToHtmlTable function
const convertDataToHtmlTable = (data, cols) => {
  let html = '<table>\n';
  
  // Create header if columns exist
  if (cols && cols.length > 0) {
    html += '  <thead>\n    <tr>\n';
    cols.forEach(col => {
      html += `      <th>${col.Header || col.accessor}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';
  }
  
  // Create body
  if (data && data.length > 0) {
    html += '  <tbody>\n';
    data.forEach(row => {
      html += '    <tr>\n';
      cols.forEach(col => {
        const cellValue = row[col.accessor] || '';
        // Handle potential line breaks in cell content
        const formattedValue = cellValue.toString().replace(/\n/g, '<br/>');
        html += `      <td>${formattedValue}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n';
  }
  
  html += '</table>';
  
  // Log the generated HTML for debugging
  console.log('Generated HTML table:', html);
  
  return html;
};    

const handleAutosave = async () => {
    setAutoSaveTrigger(false);
    if(AnnotationsTaskDetails[0]?.annotation_status !== "labeled"){
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
    if (AnnotationsTaskDetails[0]?.result.length && taskDetails?.annotation_users?.some((users) => users === user.id)) {
      try{
        const obj = new SaveTranscriptAPI(annotations[0]?.id, reqBody);
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
  }, [autoSaveTrigger, autoSave, handleAutosave, user, tableData, taskId, annotations, taskDetails]);
  

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
      
      // Get image URL from task data
      if (resp?.data?.image_url) {
        setImageUrl(resp?.data?.image_url);
      }
      
      if (tableData.length === 0 && resp?.data?.ocr_prediction_json?.text) {
        const { rows, columns: parsedColumns } = parseHtmlTableToData(resp.data.ocr_prediction_json.text);
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

  // Save annotation to API
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
          text: htmlTable,        },
        lead_time: 0, // You can calculate actual lead time
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
        
        // Save current state to undo stack
        saveToUndo();
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
  }, [annotationId, taskId, tableData, columns, taskData]);

  // Handle splitter drag
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

  // Save current state for undo
  const saveToUndo = useCallback(() => {
    setUndoStack(prev => [...prev, { data: tableData, columns }]);
    setRedoStack([]);
  }, [tableData, columns]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { data: tableData, columns }]);
    setTableData(lastState.data);
    setColumns(lastState.columns);
    setUndoStack(prev => prev.slice(0, -1));
  }, [undoStack, tableData, columns]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { data: tableData, columns }]);
    setTableData(nextState.data);
    setColumns(nextState.columns);
    setRedoStack(prev => prev.slice(0, -1));
  }, [redoStack, tableData, columns]);

  const handleCellEdit = useCallback((rowIndex, columnId, value) => {
    saveToUndo();
    setTableData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value
      };
      return newData;
    });
  }, [saveToUndo]);

  const handleAddRow = useCallback(() => {
    saveToUndo();
    const newRow = { id: tableData.length + 1 };
    columns.forEach(col => {
      newRow[col.accessor] = '';
    });
    setTableData(prev => [...prev, newRow]);
  }, [columns, tableData.length, saveToUndo]);

  const handleAddColumn = useCallback(() => {
    saveToUndo();
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
  }, [columns.length, saveToUndo]);

  const handleDeleteRow = useCallback((rowIndex) => {
    saveToUndo();
    setTableData(prev => prev.filter((_, index) => index !== rowIndex));
  }, [saveToUndo]);

  const handleDeleteColumn = useCallback((columnId) => {
    saveToUndo();
    setColumns(prev => prev.filter(col => col.accessor !== columnId));
    setTableData(prev => 
      prev.map(row => {
        const newRow = { ...row };
        delete newRow[columnId];
        return newRow;
      })
    );
  }, [saveToUndo]);

  const handleClearAll = useCallback(() => {
    saveToUndo();
    setTableData([]);
    setColumns([]);
  }, [saveToUndo]);

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
      setSnackbarInfo({ open: false, message: "", variant: "success" });
    }, 3000);
  }, [tableData, columns]);

  const handleImport = useCallback(() => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html,.htm';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const htmlContent = event.target.result;
        const { rows, columns: newColumns } = parseHtmlTableToData(htmlContent);
        
        if (rows.length > 0) {
          saveToUndo();
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
            message: "No valid table found in file",
            variant: "error",
          });
        }
        
        setTimeout(() => {
          setSnackbarInfo({ open: false, message: "", variant: "success" });
        }, 3000);
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  }, [saveToUndo]);

  const handleLanguageChange = useCallback((langCode) => {
    setSelectedLanguage(langCode);
  }, []);
  useEffect(() => {
      var Annotation = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 1
      )[0];
      setTaskData(Annotation);
       if ( taskData?.result?.text) {
        const { rows, columns: parsedColumns } = parseHtmlTableToData(taskData?.result.text);
        setTableData(rows);
        setColumns(parsedColumns);
        setOriginalHtmlTable(taskData?.result.text);
      }
  }, [AnnotationsTaskDetails]);

  const handleTranscribe = useCallback((text) => {
    console.log(`Transcribing to ${selectedLanguage}: ${text}`);
    return `[Translated to ${selectedLanguage}]: ${text}`;
  }, [selectedLanguage]);

  // Annotation stage functions
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
      // dispatch(APITransport(GlossaryObj));
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
          message: resp?.message ? resp?.message : "This task is having duplicate annotation. Please deallocate this task",          variant: "error",
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
  console.log(annotationsTaskDetails,"log");
  
    const tasksComplete = (id) => {
    if (id) {
      // resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/OCRTable/${id}`);
      window.location.reload(true);
    } else {
      // navigate(-1);
      // resetNotes();
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
    <div className="app">
      {renderSnackBar()}
      {loading && <div className="loading-overlay"><CircularIndeterminate /></div>}
      
      <div className="main-container">
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
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.2
              }}
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("labelAll");
                }
                navigate(`/projects/${projectId}`,  { replace : true, state: { fromBackToProject: true } } );
              }}
            >
              Back
            </Button>
              <span className="task-number">Task #{taskId || '12775722'}</span>
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
          
        
          </div>
           <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color={
                reviewtext.trim().length === 0 ? "primary" : "success"
              }
              sx={{ 
                width:"10%",
                minWidth: '90px',
                fontSize: '0.75rem',
                px: 1.5,
                py: 0.2,                
              }}
              onClick={handleCollapseClick}
            // style={{ marginBottom: "20px" }}
            >
              Notes {reviewtext.trim().length === 0 ? "" : "*"}
            </Button>
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
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Table Reference"
                className="reference-image"
              />
            ) : (
              <img 
                src="/api/placeholder/400/600" 
                alt="Table Reference" 
                className="reference-image"
              />
            )}
            
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
            onSave={handleSave}
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
          />
          
          <div className="table-container">
            <DataTable
              data={tableData}
              columns={columns}
              onCellEdit={handleCellEdit}
              onDeleteRow={handleDeleteRow}
              onDeleteColumn={handleDeleteColumn}
              onCellSelect={setSelectedCell}
              language={selectedLanguage}
              transcriptionMode={transcriptionMode}
              onTranscribe={handleTranscribe}
              fontSize={fontSize}
              enableRTL={enableRTL}
              showGrid={showGrid}
              alternateRowColor={alternateRowColor}
              enableTransliteration={enableTransliteration}
            />
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
