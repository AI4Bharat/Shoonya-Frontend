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
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingHeader, setEditingHeader] = useState(null);
const [headerEditValue, setHeaderEditValue] = useState('');
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

  useEffect(() => {
  if (activeRowIndex !== null && activeColumnId) {
    const value = data[activeRowIndex]?.[activeColumnId] || '';
    setEditValue(value);
  }
}, [activeRowIndex, activeColumnId]);
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
    if (event && event.shiftKey && selectionStart) {
      const startColIndex = columns.findIndex(col => col.accessor === selectionStart.columnId);
      const endColIndex = columns.findIndex(col => col.accessor === columnId);
      
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
    const originalValue = data[activeRowIndex]?.[activeColumnId] || '';

    if (editValue !== originalValue) { // ✅ KEY FIX
      onCellEdit(activeRowIndex, activeColumnId, editValue);
    }
  }
};

  const handleCellBlur = () => {
  if (editingCell) {
    const originalValue = data[editingCell.rowIndex]?.[editingCell.columnId] || '';

    if (editValue !== originalValue) { // ✅ KEY FIX
      onCellEdit(editingCell.rowIndex, editingCell.columnId, editValue);
    }

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
    if (activeRowIndex === null || !activeColumnId) return null;

    const activeValue = getActiveCellValue();

    return (
      <div className="top-textarea-container">
        {enableTransliteration ? (
          <IndicTransliterate
            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
            apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
            lang={ProjectDetails?.tgt_language}
            value={activeValue}
            onChange={(e) => handleTopTextareaChange(e.target.value)}
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
                onChange={(e) => handleTopTextareaChange(e.target.value)}
                onBlur={handleTopTextareaBlur}
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
            onChange={(e) => handleTopTextareaChange(e.target.value)}
            onBlur={handleTopTextareaBlur}
          />
        )}
        <div className="top-textarea-info">
          <button className="clear-selection-btn" onClick={() => {
            setActiveRowIndex(null);
            setActiveColumnId(null);
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
    {columns.map((column, colIndex) => (
      <th 
        key={column.accessor}
        style={{ width: columnWidths[column.accessor] }}
        className={`column-header ${draggedColumn === colIndex ? 'dragging' : ''} ${dragOverColumn === colIndex ? 'drag-over' : ''}`}
        draggable={!editingCell}
        onDragStart={(e) => handleColumnDragStart(e, colIndex)}
        onDragOver={(e) => handleColumnDragOver(e, colIndex)}
        onDragEnd={handleColumnDragEnd}
      >
        <div className="header-content">
          <span className="drag-handle" title="Drag to reorder column">⋮⋮</span>
{editingHeader === colIndex ? (
  <input
    autoFocus
    value={headerEditValue}
    onChange={(e) => setHeaderEditValue(e.target.value)}
    onBlur={() => {
      handleHeaderEdit(colIndex, headerEditValue);
      setEditingHeader(null);
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleHeaderEdit(colIndex, headerEditValue);
        setEditingHeader(null);
      } else if (e.key === 'Escape') {
        setEditingHeader(null);
      }
    }}
    style={{
      width: "100%",
      fontSize: `${fontSize}px`,
      padding: "4px",
    }}
  />
) : (
  <span
    style={{ fontSize: `${fontSize}px`, cursor: "pointer" }}
    onDoubleClick={() => {
      setEditingHeader(colIndex);
      setHeaderEditValue(column.Header);
    }}
  >
    {column.Header}
  </span>
)}          <button 
            className="delete-column-btn"
            onClick={() => onDeleteColumn(column.accessor)}
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
    ))}
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
>
  <span className="drag-handle-row" title="Drag to reorder row">⋮⋮</span>
  <span className="row-index">{rowIndex + 1}</span>
  <button 
    className="delete-row-btn"
    onClick={() => onDeleteRow(rowIndex)}
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