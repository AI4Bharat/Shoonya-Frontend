// Updated components/Sidebar.js with responsive improvements
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onAddRow, onAddColumn, selectedCell, isMobile }) => {
  return (
    <div className={`sidebar ${isMobile ? 'mobile' : ''}`}>
      <div className="sidebar-header">
        <h3>{isMobile ? 'Controls' : 'Table Controls'}</h3>
      </div>
      
      <div className="sidebar-content">
        <div className="control-group">
          <h4>Add</h4>
          <button onClick={onAddRow} className="control-btn" title="Add new row">
            <span className="btn-icon">➕</span>
            {!isMobile && 'Add Row'}
          </button>
          <button onClick={onAddColumn} className="control-btn" title="Add new column">
            <span className="btn-icon">➕</span>
            {!isMobile && 'Add Column'}
          </button>
        </div>

        {selectedCell && !isMobile && (
          <div className="control-group">
            <h4>Selected</h4>
            <div className="cell-info">
              <p><strong>R:</strong> {selectedCell.rowIndex + 1}</p>
              <p><strong>C:</strong> {selectedCell.columnId}</p>
              <p className="cell-value" title={selectedCell.value}>
                <strong>V:</strong> {selectedCell.value?.substring(0, 15)}
                {selectedCell.value?.length > 15 ? '...' : ''}
              </p>
            </div>
          </div>
        )}

        <div className="control-group">
          <h4>Actions</h4>
          <button className="control-btn secondary" title="Copy">
            <span className="btn-icon">📋</span>
            {!isMobile && 'Copy'}
          </button>
          <button className="control-btn secondary" title="Paste">
            <span className="btn-icon">📌</span>
            {!isMobile && 'Paste'}
          </button>
          <button className="control-btn secondary" title="Export">
            <span className="btn-icon">📊</span>
            {!isMobile && 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;