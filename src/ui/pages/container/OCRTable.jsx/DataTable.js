// Updated components/DataTable.js
import React, { useState, useRef, useEffect } from 'react';
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
  language,
  transcriptionMode,
  onTranscribe,
  fontSize = 14,
  enableRTL = false,
  showGrid = true,
  alternateRowColor = true,
  enableTransliteration = false,
  ProjectDetails
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [columnWidths, setColumnWidths] = useState({});
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);
  const tableRef = useRef(null);
  const editInputRef = useRef(null);
  const topTextareaRef = useRef(null);
  
  // Map language codes to IndicTransliterate supported languages
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

  // Focus top textarea when active cell changes
  useEffect(() => {
    if (activeRowIndex !== null && activeColumnId && topTextareaRef.current) {
      topTextareaRef.current.focus();
    }
  }, [activeRowIndex, activeColumnId]);

  const handleCellClick = (rowIndex, columnId, value) => {
    setEditingCell({ rowIndex, columnId });
    setEditValue(value || '');
    setActiveRowIndex(rowIndex);
    setActiveColumnId(columnId);
    onCellSelect({ rowIndex, columnId, value });
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
    // Don't clear active cell on blur, keep it selected
  };

  const handleCellBlur = () => {
    if (editingCell) {
      onCellEdit(editingCell.rowIndex, editingCell.columnId, editValue);
      setEditingCell(null);
      // Keep active cell selected but close inline editor
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

  // Render editable cell with transliteration support (for inline editing)
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

  // Get current active cell value
  const getActiveCellValue = () => {
    if (activeRowIndex !== null && activeColumnId && data[activeRowIndex]) {
      return data[activeRowIndex][activeColumnId] || '';
    }
    return '';
  };

  // Render top textarea editor
  const renderTopTextarea = () => {
    if (activeRowIndex === null || !activeColumnId) return null;

    const activeValue = getActiveCellValue();

    if (enableTransliteration) {
      return (
        <div className="top-textarea-container">
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
            containerStyles={{
              width: "100%",
              position: "relative",
            }}
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
                  border: "2px solid #667eea",
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
          <div className="top-textarea-info">
            <button 
              className="clear-selection-btn"
              onClick={() => {
                setActiveRowIndex(null);
                setActiveColumnId(null);
              }}
            >
              Clear Selection
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="top-textarea-container">
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
            border: "2px solid #667eea",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
          placeholder={`Editing: Row ${activeRowIndex + 1}, Column ${activeColumnId}`}
          value={activeValue}
          onChange={(e) => handleTopTextareaChange(e.target.value)}
          onBlur={handleTopTextareaBlur}
        />
        <div className="top-textarea-info">
          <span>Editing: Row {activeRowIndex + 1}, Column {activeColumnId}</span>
          <button 
            className="clear-selection-btn"
            onClick={() => {
              setActiveRowIndex(null);
              setActiveColumnId(null);
            }}
          >
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
              <th className="row-number-header">#</th>
              {columns.map((column) => (
                <th 
                  key={column.accessor}
                  style={{ width: columnWidths[column.accessor] }}
                  className="column-header"
                >
                  <div className="header-content">
                    <span style={{ fontSize: `${fontSize}px` }}>{column.Header}</span>
                    <button 
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
              >
                <td className="row-number">
                  {rowIndex + 1}
                  <button 
                    className="delete-row-btn"
                    onClick={() => onDeleteRow(rowIndex)}
                    title="Delete row"
                  >
                    ×
                  </button>
                </td>
                {columns.map((column) => {
                  const isEditing = editingCell && 
                    editingCell.rowIndex === rowIndex && 
                    editingCell.columnId === column.accessor;
                  const isActive = activeRowIndex === rowIndex && activeColumnId === column.accessor;
                  
                  return (
                    <td 
                      key={column.accessor}
                      className={`table-cell ${isEditing ? 'editing' : ''} ${isActive ? 'active-cell' : ''}`}
                      onClick={() => !isEditing && handleCellClick(rowIndex, column.accessor, row[column.accessor])}
                      style={{ width: columnWidths[column.accessor] }}
                    >
                      {isEditing ? (
                        renderEditableCell(rowIndex, column.accessor, row[column.accessor])
                      ) : (
                        <div 
                          className="cell-content"
                          dir={enableRTL ? 'rtl' : 'ltr'}
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          <span>{row[column.accessor]}</span>
                          {transcriptionMode && (
                            <button
                              className="transcribe-btn"
                              onClick={() => handleTranscribeClick(
                                rowIndex, 
                                column.accessor, 
                                row[column.accessor]
                              )}
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