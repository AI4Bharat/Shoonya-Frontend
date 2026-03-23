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
  const tableRef = useRef(null);
  const editInputRef = useRef(null);
  console.log(data);
  
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
    // Initialize column widths
    const widths = {};
    columns.forEach(col => {
      widths[col.accessor] = col.width || 150;
    });
    setColumnWidths(widths);
  }, [columns]);

  useEffect(() => {
    // Apply RTL direction to the entire table if enabled
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

  const handleCellClick = (rowIndex, columnId, value) => {
    setEditingCell({ rowIndex, columnId });
    setEditValue(value || '');
    onCellSelect({ rowIndex, columnId, value });
  };

  const handleCellBlur = () => {
    if (editingCell) {
      onCellEdit(editingCell.rowIndex, editingCell.columnId, editValue);
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
  };

  // Render editable cell with transliteration support
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
          containerStyles={{
            width: "100%",
            height: "100%",
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
                resize: "none",
                border: "none",
                outline: "none",
                padding: "8px",
                background: "transparent",
                color: "inherit",
                fontFamily: "inherit",
                lineHeight: "1.5",
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

    // Regular input without transliteration
    return (
      <input
        ref={editInputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleCellBlur}
        onKeyDown={handleKeyDown}
        className="cell-edit-input"
        dir={enableRTL ? 'rtl' : 'ltr'}
        style={{ fontSize: `${fontSize}px` }}
      />
    );
  };

  return (
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
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
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
                
                return (
                  <td 
                    key={column.accessor}
                    className={`table-cell ${isEditing ? 'editing' : ''}`}
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
              <td className="actions-cell">
                {/* Additional actions can be added here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;