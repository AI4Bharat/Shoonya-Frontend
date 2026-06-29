// Updated components/DataTable.js - Add drag-and-drop functionality
import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import './DataTable.css';
import configs from '../../../../config/config';

const DataTable = ({ 
  data, 
  columns, 
  onCellEdit, 
  onDeleteRow, 
  onDeleteColumn,
  onCellSelect,
  onReorderColumns,
  onReorderRows,
  language,
  transcriptionMode,
  onTranscribe,
  fontSize = 14,
  enableRTL = false,
  showGrid = true,
  alternateRowColor = true,
  enableTransliteration = false,
  ProjectDetails,
  mergedCells,
  onMergedCellsChange,
  mergedHeaders = {},
  onMergedHeadersChange,
  headerSelectionRange,
  onHeaderSelectionChange,
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingHeader, setEditingHeader] = useState(null);
const [headerEditValue, setHeaderEditValue] = useState('');
const [activeHeaderIndex, setActiveHeaderIndex] = useState(null);
const [selectedHeaders, setSelectedHeaders] = useState([]);
  const [columnWidths, setColumnWidths] = useState({});
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [selectionStart, setSelectionStart] = useState(null);
  
  // Drag state
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [draggedRow, setDraggedRow] = useState(null);
  const [dragOverRow, setDragOverRow] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const tableRef = useRef(null);
  const editInputRef = useRef(null);
  const topTextareaRef = useRef(null);
  const headerAnchorRef = useRef(null);

  const getTransliterationLang = (langCode) => {
    const langMap = {
      'hi': 'hi',
      'bn': 'bn',
      'te': 'te',
      'ta': 'ta',
      'mr': 'mr',
      'gu': 'gu',
      'kn': 'kn',
      'ml': 'ml',
      'pa': 'pa',
      'or': 'or',
      'as': 'as',
      'ur': 'ur',
    };
    return langMap[langCode] || 'hi';
  };

  useEffect(() => {
    const widths = {};
    columns.forEach(col => {
      widths[col.accessor] = col.width || 150;
    });
    setColumnWidths(widths);
  }, [columns]);

  useEffect(() => {
    if (tableRef.current) {
      if (enableRTL) {
        tableRef.current.setAttribute('dir', 'rtl');
      } else {
        tableRef.current.setAttribute('dir', 'ltr');
      }
    }
  }, [enableRTL]);

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingCell]);

  useEffect(() => {
    if (activeRowIndex !== null && activeColumnId && topTextareaRef.current) {
      topTextareaRef.current.focus();
    }
  }, [activeRowIndex, activeColumnId]);

  const handleHeaderClick = (colIndex) => {
  setActiveHeaderIndex(colIndex);
  setActiveRowIndex(null);
  setActiveColumnId(null);
};


const handleHeaderSelect = (colIndex, e) => {
  e.preventDefault();
  setEditingCell(null);
  
  let startCol = colIndex;
  let endCol = colIndex;
  
  if (e.shiftKey && headerAnchorRef.current !== null) {
    startCol = Math.min(headerAnchorRef.current, colIndex);
    endCol = Math.max(headerAnchorRef.current, colIndex);
    const range = [];
    for (let i = startCol; i <= endCol; i++) range.push(i);
    setSelectedHeaders(range);
    if (typeof onHeaderSelectionChange === 'function') {
      onHeaderSelectionChange({ startCol, endCol });
    }
  } else {
    headerAnchorRef.current = colIndex;
    setSelectedHeaders([colIndex]);
    if (typeof onHeaderSelectionChange === 'function') {
      onHeaderSelectionChange({ startCol, endCol });
    }
  }
  
  // Select entire column cells range
  const range = {
    startRow: 0,
    endRow: data.length - 1,
    startCol,
    endCol,
  };
  setSelectionRange(range);
  setSelectionStart({ rowIndex: 0, columnId: columns[startCol]?.accessor });
  setEditValue('');
  setActiveRowIndex(null);
  setActiveColumnId(null);
  
  onCellSelect({
    range,
    rowIndex: 0,
    columnId: columns[startCol]?.accessor,
    value: data[0]?.[columns[startCol]?.accessor]
  }, true);
};

const handleRowHeaderSelect = (rowIndex, e) => {
  e.preventDefault();
  setEditingCell(null);
  if (typeof onHeaderSelectionChange === 'function') onHeaderSelectionChange(null);
  setSelectedHeaders([]);
  
  const range = {
    startRow: rowIndex,
    endRow: rowIndex,
    startCol: 0,
    endCol: columns.length - 1,
  };
  setSelectionRange(range);
  setSelectionStart({ rowIndex, columnId: columns[0]?.accessor });
  setEditValue('');
  setActiveRowIndex(null);
  setActiveColumnId(null);
  
  onCellSelect({
    range,
    rowIndex,
    columnId: columns[0]?.accessor,
    value: data[rowIndex]?.[columns[0]?.accessor]
  }, true);
};

const handleMergeHeaders = () => {
  if (selectedHeaders.length < 2) return;
  const sorted = [...selectedHeaders].sort((a, b) => a - b);
  const startCol = sorted[0];
  const endCol = sorted[sorted.length - 1];
  const newMergedHeaders = { ...mergedHeaders };

  sorted.forEach((colIndex, i) => {
    if (i === 0) {
      newMergedHeaders[colIndex] = {
        isFirst: true,
        colSpan: sorted.length,
        startCol,
        endCol,
      };
    } else {
      newMergedHeaders[colIndex] = { hidden: true };
    }
  });

  onMergedHeadersChange(newMergedHeaders);
setSelectedHeaders([]);
};

const handleUnmergeHeaders = () => {
  if (selectedHeaders.length === 0) return;
  const newMergedHeaders = { ...mergedHeaders };

  selectedHeaders.forEach(colIndex => {
    const cell = newMergedHeaders[colIndex];
    if (cell?.isFirst) {
      for (let i = cell.startCol; i <= cell.endCol; i++) {
        delete newMergedHeaders[i];
      }
    } else if (cell?.hidden) {
      // find the parent and unmerge all
      Object.keys(newMergedHeaders).forEach(key => {
        const c = newMergedHeaders[key];
        if (c?.isFirst && c.startCol <= colIndex && c.endCol >= colIndex) {
          for (let i = c.startCol; i <= c.endCol; i++) {
            delete newMergedHeaders[i];
          }
        }
      });
    }
  });

 onMergedHeadersChange(newMergedHeaders);
setSelectedHeaders([]);
};

  // Column drag handlers
  const handleColumnDragStart = (e, colIndex) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colIndex);
    setDraggedColumn(colIndex);
    setIsDragging(true);
  };

  const handleColumnDragOver = (e, colIndex) => {
    e.preventDefault();
    if (draggedColumn !== null && draggedColumn !== colIndex) {
      setDragOverColumn(colIndex);
    }
  };
  const handleHeaderEdit = (colIndex, newValue) => {
  const updatedColumns = [...columns];
  updatedColumns[colIndex] = {
    ...updatedColumns[colIndex],
    Header: newValue,
  };

  onReorderColumns(updatedColumns, data, mergedCells); 
  // reuse existing function to update columns
};

 const handleColumnDragEnd = () => {
  if (draggedColumn !== null && dragOverColumn !== null && draggedColumn !== dragOverColumn) {
    // Reorder columns
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(draggedColumn, 1);
    newColumns.splice(dragOverColumn, 0, movedColumn);
    
    // Reorder data for each row
    const newData = data.map(row => {
      const newRow = {};
      newColumns.forEach((col, newIndex) => {
        const oldIndex = columns.findIndex(c => c.accessor === col.accessor);
        newRow[col.accessor] = row[columns[oldIndex]?.accessor] || '';
      });
      return { ...row, ...newRow };
    });
    
    // Update merged cells column positions
    const newMergedCells = {};
    Object.keys(mergedCells).forEach(key => {
      const [row, col] = key.split('-').map(Number);
      let newCol = col;
      
      if (col === draggedColumn) {
        newCol = dragOverColumn;
      } else if (col > draggedColumn && col <= dragOverColumn) {
        newCol = col - 1;
      } else if (col < draggedColumn && col >= dragOverColumn) {
        newCol = col + 1;
      }
      
      const newKey = `${row}-${newCol}`;
      newMergedCells[newKey] = { ...mergedCells[key] };
      
      if (mergedCells[key].isFirst) {
        newMergedCells[newKey].startCol = newCol;
        newMergedCells[newKey].endCol = newCol + (mergedCells[key].colSpan - 1);
      }
    });
    
    onReorderColumns(newColumns, newData, newMergedCells);
  }
  setDraggedColumn(null);
  setDragOverColumn(null);
  setIsDragging(false);
};

  // Row drag handlers
  const handleRowDragStart = (e, rowIndex) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rowIndex);
    setDraggedRow(rowIndex);
    setIsDragging(true);
  };

  const handleRowDragOver = (e, rowIndex) => {
    e.preventDefault();
    if (draggedRow !== null && draggedRow !== rowIndex) {
      setDragOverRow(rowIndex);
    }
  };

  const handleRowDragEnd = () => {
  if (draggedRow !== null && dragOverRow !== null && draggedRow !== dragOverRow) {
    // Reorder the data
    const newData = [...data];
    const [movedRow] = newData.splice(draggedRow, 1);
    newData.splice(dragOverRow, 0, movedRow);
    
    // Also update merged cells positions
    const newMergedCells = {};
    Object.keys(mergedCells).forEach(key => {
      const [row, col] = key.split('-').map(Number);
      let newRow = row;
      
      if (row === draggedRow) {
        newRow = dragOverRow;
      } else if (row > draggedRow && row <= dragOverRow) {
        newRow = row - 1;
      } else if (row < draggedRow && row >= dragOverRow) {
        newRow = row + 1;
      }
      
      const newKey = `${newRow}-${col}`;
      newMergedCells[newKey] = { ...mergedCells[key] };
      
      // Update startRow and endRow in merged cell info
      if (mergedCells[key].isFirst) {
        newMergedCells[newKey].startRow = newRow;
        newMergedCells[newKey].endRow = newRow + (mergedCells[key].rowSpan - 1);
      }
    });
    
    onReorderRows(newData, newMergedCells);
  }
  setDraggedRow(null);
  setDragOverRow(null);
  setIsDragging(false);
};

  const handleCellClick = (rowIndex, columnId, value, event) => {
    if (typeof onHeaderSelectionChange === 'function') onHeaderSelectionChange(null);
setSelectedHeaders([]);
    if (event && event.shiftKey && selectionStart) {
      const startColIndex = columns.findIndex(col => col.accessor === selectionStart.columnId);
      const endColIndex = columns.findIndex(col => col.accessor === columnId);
      headerAnchorRef.current = null;
      
      const range = {
        startRow: Math.min(selectionStart.rowIndex, rowIndex),
        endRow: Math.max(selectionStart.rowIndex, rowIndex),
        startCol: Math.min(startColIndex, endColIndex),
        endCol: Math.max(startColIndex, endColIndex),
      };
      
      setSelectionRange(range);
      onCellSelect({ range, rowIndex, columnId, value }, true);
    } else {
      setSelectionStart({ rowIndex, columnId });
      setSelectionRange(null);
      setEditingCell({ rowIndex, columnId });
      setEditValue(value || '');
      setActiveRowIndex(rowIndex);
      setActiveColumnId(columnId);
      onCellSelect({ rowIndex, columnId, value });
    }
  };

  const handleTopTextareaChange = (newValue) => {
    setEditValue(newValue);
    if (activeRowIndex !== null && activeColumnId) {
      onCellEdit(activeRowIndex, activeColumnId, newValue);
    }
  };

  const handleTopTextareaBlur = () => {
    if (activeRowIndex !== null && activeColumnId) {
      onCellEdit(activeRowIndex, activeColumnId, editValue);
    }
  };

  const handleCellBlur = () => {
    if (editingCell) {
      onCellEdit(editingCell.rowIndex, editingCell.columnId, editValue);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleColumnResize = (columnId, newWidth) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: newWidth
    }));
  };

  const startResize = (e, columnId) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[columnId];

    const handleMouseMove = (e) => {
      const newWidth = Math.max(100, startWidth + (e.clientX - startX));
      handleColumnResize(columnId, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTranscribeClick = async (rowIndex, columnId, value) => {
    const transcribedText = onTranscribe(value);
    onCellEdit(rowIndex, columnId, transcribedText);
    if (activeRowIndex === rowIndex && activeColumnId === columnId) {
      setEditValue(transcribedText);
    }
  };

  const renderEditableCell = (rowIndex, columnId, value) => {
    if (enableTransliteration) {
      return (
        <IndicTransliterate
          customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
          apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
          lang={ProjectDetails?.tgt_language}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onChangeText={() => {}}
          enabled={true}
          enableSuggestion={true}
          suggestionLimit={5}
          suggestionPosition="bottom"
          containerStyles={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "block",
          }}
          renderComponent={(props) => (
            <textarea
              ref={editInputRef}
              className="cell-edit-textarea"
              dir={enableRTL ? "rtl" : "ltr"}
              style={{ 
                fontSize: `${fontSize}px`,
                height: "100%",
                width: "100%",
                resize: "both",
                outline: "none",
                padding: "8px",
                background: "white",
                color: "#333",
                fontFamily: "inherit",
                lineHeight: "1.5",
                boxSizing: "border-box",
              }}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCellBlur}
              onKeyDown={handleKeyDown}
              {...props}
            />
          )}
        />
      );
    }

    return (
      <textarea
        ref={editInputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleCellBlur}
        onKeyDown={handleKeyDown}
        className="cell-edit-textarea"
        dir={enableRTL ? 'rtl' : 'ltr'}
        style={{
          fontSize: `${fontSize}px`,
          height: "100%",
          width: "100%",
          resize: "both",
          outline: "none",
          padding: "8px",
          background: "white",
          color: "#333",
          fontFamily: "inherit",
          lineHeight: "1.5",
          boxSizing: "border-box",
          border: "2px solid #667eea",
          borderRadius: "4px",
        }}
      />
    );
  };

  const getActiveCellValue = () => {
    if (activeRowIndex !== null && activeColumnId && data[activeRowIndex]) {
      return data[activeRowIndex][activeColumnId] || '';
    }
    return '';
  };

  const renderTopTextarea = () => {
    if (activeRowIndex === null && !activeColumnId && activeHeaderIndex === null) return null;

    const activeValue = activeHeaderIndex !== null
      ? (columns[activeHeaderIndex]?.Header || '')
      : getActiveCellValue();

    const handleChange = (val) => {
      if (activeHeaderIndex !== null) {
        handleHeaderEdit(activeHeaderIndex, val);
      } else {
        handleTopTextareaChange(val);
      }
    };

    const handleBlur = () => {
      if (activeHeaderIndex !== null) {
        setActiveHeaderIndex(null);
      } else {
        handleTopTextareaBlur();
      }
    };

    return (
      <div className="top-textarea-container">
        {enableTransliteration ? (
          <IndicTransliterate
            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
            apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
            lang={ProjectDetails?.tgt_language}
            value={activeValue}
            onChange={(e) => handleChange(e.target.value)}
            onChangeText={() => {}}
            enabled={true}
            enableSuggestion={true}
            suggestionLimit={5}
            suggestionPosition="bottom"
            containerStyles={{ width: "100%", position: "relative" }}
            renderComponent={(props) => (
              <textarea
                ref={topTextareaRef}
                className="top-editor-textarea"
                dir={enableRTL ? "rtl" : "ltr"}
                style={{ 
                  fontSize: `${fontSize}px`,
                  width: "100%",
                  minHeight: "80px",
                  resize: "vertical",
                  outline: "none",
                  padding: "12px",
                  background: "white",
                  color: "#333",
                  fontFamily: "inherit",
                  lineHeight: "1.5",
                  boxSizing: "border-box",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
               value={activeValue}
               onChange={(e) => handleChange(e.target.value)}
               onBlur={handleBlur}
                {...props}
              />
            )}
          />
        ) : (
          <textarea
            ref={topTextareaRef}
            className="top-editor-textarea"
            dir={enableRTL ? 'rtl' : 'ltr'}
            style={{
              fontSize: `${fontSize}px`,
              width: "100%",
              minHeight: "80px",
              resize: "vertical",
              outline: "none",
              padding: "12px",
              background: "white",
              color: "#333",
              fontFamily: "inherit",
              lineHeight: "1.5",
              boxSizing: "border-box",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
            value={activeValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
        )}
        <div className="top-textarea-info">
         <button className="clear-selection-btn" onClick={() => {
          setActiveRowIndex(null);
          setActiveColumnId(null);
          setActiveHeaderIndex(null);
        }}>
          Clear Selection
        </button>
        </div>
      </div>
    );
  };

  return (
    <div className="data-table-wrapper-container">
      {renderTopTextarea()}
      
      <div className={`data-table-wrapper ${showGrid ? 'show-grid' : 'hide-grid'}`} ref={tableRef}>
        <table className={`data-table ${alternateRowColor ? 'alternate-rows' : ''}`}>
          <thead>
  <tr>
    <th className="row-number-header">
      <span className="drag-handle-column-title" title="Drag to reorder column">⋮⋮</span>
      #
    </th>
   {columns.map((column, colIndex) => {
  if (mergedHeaders[colIndex]?.hidden) return null;
  return (
    <th 
      key={column.accessor}
      colSpan={mergedHeaders[colIndex]?.colSpan || 1}
      style={{ width: columnWidths[column.accessor] }}
      className={`column-header 
        ${draggedColumn === colIndex ? 'dragging' : ''} 
        ${dragOverColumn === colIndex ? 'drag-over' : ''}
        ${selectedHeaders.length === 1 && selectedHeaders.includes(colIndex) ? 'header-selected' : ''}
        ${selectedHeaders.length > 1 && selectedHeaders.includes(colIndex) ? 'header-range-selected' : ''}
        ${mergedHeaders[colIndex]?.isFirst ? 'merged-header' : ''}`}
      draggable={!editingCell}
      onDragStart={(e) => handleColumnDragStart(e, colIndex)}
      onDragOver={(e) => handleColumnDragOver(e, colIndex)}
      onDragEnd={handleColumnDragEnd}
      onClick={(e) => { e.preventDefault(); handleHeaderSelect(colIndex, e); }}
    >
      <div className="header-content">
        <span className="drag-handle" title="Drag to reorder column">⋮⋮</span>
        <span
          style={{ fontSize: `${fontSize}px`, cursor: "pointer" }}
          onDoubleClick={() => handleHeaderClick(colIndex)}
        >
          {column.Header}
        </span>
        <button 
          className="delete-column-btn"
          onClick={(e) => { e.stopPropagation(); onDeleteColumn(column.accessor); }}
          title="Delete column"
        >
          ×
        </button>
        <div 
          className="resize-handle"
          onMouseDown={(e) => startResize(e, column.accessor)}
        />
      </div>
    </th>
  );
})}
  </tr>
</thead>
          <tbody>
            {data.map((row, rowIndex) => (
<tr 
  key={row.id || rowIndex} 
  className={activeRowIndex === rowIndex ? 'active-row' : ''}
                draggable={!editingCell}
                onDragStart={(e) => handleRowDragStart(e, rowIndex)}
                onDragOver={(e) => handleRowDragOver(e, rowIndex)}
                onDragEnd={handleRowDragEnd}
              >
<td className="row-number" 
  draggable={!editingCell}
  onDragStart={(e) => handleRowDragStart(e, rowIndex)}
  onDragOver={(e) => handleRowDragOver(e, rowIndex)}
  onDragEnd={handleRowDragEnd}
  onClick={(e) => handleRowHeaderSelect(rowIndex, e)}
>
  <span className="drag-handle-row" title="Drag to reorder row">⋮⋮</span>
  <span className="row-index">{rowIndex + 1}</span>
  <button 
    className="delete-row-btn"
    onClick={(e) => { e.stopPropagation(); onDeleteRow(rowIndex); }}
    title="Delete row"
  >
    ×
  </button>
</td>
                {columns.map((column, colIndex) => {
                  const cellKey = `${rowIndex}-${colIndex}`;
                  const mergedCell = mergedCells[cellKey];
                  
                  if (mergedCell && mergedCell.hidden) {
                    return null;
                  }
                  
                  const colSpan = mergedCell && mergedCell.colSpan ? mergedCell.colSpan : 1;
                  const rowSpan = mergedCell && mergedCell.rowSpan ? mergedCell.rowSpan : 1;
                  
                  let displayValue = row[column.accessor];
                  if (mergedCell && mergedCell.isFirst) {
                    displayValue = data[mergedCell.startRow]?.[columns[mergedCell.startCol]?.accessor] || '';
                  }
                  
                  const isEditing = editingCell && 
                    editingCell.rowIndex === rowIndex && 
                    editingCell.columnId === column.accessor;
                  const isActive = activeRowIndex === rowIndex && activeColumnId === column.accessor;
                  const isInRange = selectionRange && 
                    rowIndex >= selectionRange.startRow && 
                    rowIndex <= selectionRange.endRow &&
                    colIndex >= selectionRange.startCol && 
                    colIndex <= selectionRange.endCol;
                  
                  return (
                    <td 
                      key={column.accessor}
                      colSpan={colSpan}
                      rowSpan={rowSpan}
                      className={`table-cell ${isEditing ? 'editing' : ''} ${isActive ? 'active-cell' : ''} ${isInRange ? 'range-selected' : ''}`}
                      onClick={(e) => !isEditing && handleCellClick(rowIndex, column.accessor, displayValue, e)}
                      style={{ width: colSpan > 1 ? (columnWidths[column.accessor] || 150) * colSpan : (columnWidths[column.accessor] || 150) }}
                    >
                      {isEditing ? (
                        renderEditableCell(rowIndex, column.accessor, displayValue)
                      ) : (
                        <div 
                          className="cell-content"
                          dir={enableRTL ? 'rtl' : 'ltr'}
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          <span>{displayValue}</span>
                          {transcriptionMode && (
                            <button
                              className="transcribe-btn"
                              onClick={() => handleTranscribeClick(rowIndex, column.accessor, displayValue)}
                              title="Transcribe to selected language"
                            >
                              🔄
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;