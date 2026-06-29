// components/TableControls.js
import React, { memo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import CallSplitIcon from '@mui/icons-material/CallSplit';
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TableRowsIcon from "@mui/icons-material/TableRows";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import GridOnIcon from "@mui/icons-material/GridOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TranslateIcon from "@mui/icons-material/Translate";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import "./TableControls.css";

const anchorOrigin = {
  vertical: "top",
  horizontal: "center",
};

const transformOrigin = {
  vertical: "top",
  horizontal: "center",
};

// Font size options for table
const fontSizeMenu = [
  { size: 12, label: "Small" },
  { size: 14, label: "Medium" },
  { size: 16, label: "Large" },
  { size: 18, label: "Extra Large" },
];

// Color themes for table
const colorThemes = [
  { name: "Default", primary: "#667eea", secondary: "#764ba2" },
  { name: "Ocean", primary: "#2196F3", secondary: "#1976D2" },
  { name: "Forest", primary: "#4CAF50", secondary: "#388E3C" },
  { name: "Sunset", primary: "#FF9800", secondary: "#F57C00" },
  { name: "Rose", primary: "#E91E63", secondary: "#C2185B" },
  { name: "Dark", primary: "#424242", secondary: "#212121" },
];

const TableControls = ({
  totalRows,
  totalColumns,
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onUndo,
  onRedo,
  undoStack,
  redoStack,
  onSave,
  onExport,
  onImport,
  fontSize,
  setFontSize,
  enableTransliteration,
  setTransliteration,
  enableRTL,
  setRTL,
  showGrid,
  setShowGrid,
  alternateRowColor,
  setAlternateRowColor,
  theme,
  setTheme,
  onClearAll,
  selectedCell,
  onBulkDelete,
  onMergeCells,
  onCopyCell,
  isCellSelected,
  onAddRowBefore,   // NEW
  onAddRowAfter,    // NEW
  onAddColBefore,   // NEW
  onAddColAfter,    // NEW
  onUnmergeCells
}) => {
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [anchorElTheme, setAnchorElTheme] = useState(null);
  const [anchorElAddRow, setAnchorElAddRow] = useState(null);  // NEW
  const [anchorElAddCol, setAnchorElAddCol] = useState(null);  // NEW
const [anchorElDelete, setAnchorElDelete] = useState(null);

  // Apply theme to CSS variables
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    }
  }, [theme]);

  const hasSelectedCell = !!selectedCell;

  return (
    <div className="table-controls">
      {/* Row Count Badge */}
      <Box className="count-badge">
        <TableRowsIcon className="badge-icon" />
        <span className="badge-count">{totalRows}</span>
      </Box>

      {/* Column Count Badge */}
      <Box className="count-badge" style={{ marginLeft: "5px" }}>
        <ViewColumnIcon className="badge-icon" />
        <span className="badge-count">{totalColumns}</span>
      </Box>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Add Row Button — now opens a dropdown */}
      <Tooltip title="Add Row" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(e) => setAnchorElAddRow(e.currentTarget)}
        >
          <TableRowsIcon />
          <span className="btn-plus">+</span>
        </IconButton>
      </Tooltip>

      {/* Add Row Menu */}
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElAddRow}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElAddRow)}
        onClose={() => setAnchorElAddRow(null)}
      >
        <MenuItem
          disabled={!hasSelectedCell}
          onClick={() => { onAddRowBefore?.(); setAnchorElAddRow(null); }}
        >
          <Typography variant="body2">↑ Add Row Before</Typography>
        </MenuItem>
        <MenuItem
          disabled={!hasSelectedCell}
          onClick={() => { onAddRowAfter?.(); setAnchorElAddRow(null); }}
        >
          <Typography variant="body2">↓ Add Row After</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onAddRow(); setAnchorElAddRow(null); }}>
          <Typography variant="body2">+ Add Row at End</Typography>
        </MenuItem>
      </Menu>

      {/* Add Column Button — now opens a dropdown */}
      <Tooltip title="Add Column" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(e) => setAnchorElAddCol(e.currentTarget)}
        >
          <ViewColumnIcon />
          <span className="btn-plus">+</span>
        </IconButton>
      </Tooltip>

      {/* Add Column Menu */}
      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElAddCol}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElAddCol)}
        onClose={() => setAnchorElAddCol(null)}
      >
        <MenuItem
          disabled={!hasSelectedCell}
          onClick={() => { onAddColBefore?.(); setAnchorElAddCol(null); }}
        >
          <Typography variant="body2">← Add Column Before</Typography>
        </MenuItem>
        <MenuItem
          disabled={!hasSelectedCell}
          onClick={() => { onAddColAfter?.(); setAnchorElAddCol(null); }}
        >
          <Typography variant="body2">→ Add Column After</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { onAddColumn(); setAnchorElAddCol(null); }}>
          <Typography variant="body2">+ Add Column at End</Typography>
        </MenuItem>
      </Menu>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Merge Cells Button */}
      <Tooltip title="Merge Selected Adjacent Cells" placement="bottom">
        <IconButton
  className="control-btn"
  onClick={onMergeCells}
  disabled={!isCellSelected}
>
  <MergeIcon />
</IconButton>
      </Tooltip>
     

      {/* Unmerge Cells Button */}
      <Tooltip title="Unmerge Selected Merged Cell" placement="bottom">
        <IconButton
  className="control-btn"
  onClick={onUnmergeCells}
  disabled={!isCellSelected}
>
  <CallSplitIcon />
</IconButton>
      </Tooltip>

      {/* Delete Table Button */}
     <Tooltip title="Delete Options" placement="bottom">
  <IconButton
    className="control-btn delete-table-btn"
    onClick={(e) => setAnchorElDelete(e.currentTarget)}
  >
    <DeleteSweepIcon />
  </IconButton>
</Tooltip>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Settings Button */}
      <Tooltip title="Table Settings" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
<Menu
  sx={{ mt: "45px" }}
  anchorEl={anchorElDelete}
  anchorOrigin={anchorOrigin}
  keepMounted
  transformOrigin={transformOrigin}
  open={Boolean(anchorElDelete)}
  onClose={() => setAnchorElDelete(null)}
>
  <MenuItem 
    onClick={() => {
      onBulkDelete?.();
      setAnchorElDelete(null);
    }}
    sx={{ color: "#d32f2f" }}
  >
    <DeleteSweepIcon sx={{ mr: 1, fontSize: 20 }} />
    <Typography variant="body2">Delete Entire Table</Typography>
  </MenuItem>
  
  <MenuItem 
    onClick={() => {
      setAnchorElDelete(null);
    }}
    sx={{ color: "#f57c00" }}
  >
    <DeleteSweepIcon sx={{ mr: 1, fontSize: 20 }} />
    <Typography variant="body2">Cancel</Typography>
  </MenuItem>
</Menu>
      {/* Settings Menu */}
      <Menu
        sx={{ mt: "45px" }}
        id="settings-menu"
        anchorEl={anchorElSettings}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElSettings)}
        onClose={() => setAnchorElSettings(null)}
      >
        {selectedCell && (
          <MenuItem>
            <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
              Selected: Row {selectedCell.rowIndex + 1}, Col {selectedCell.columnId}
            </Typography>
          </MenuItem>
        )}

        <MenuItem>
          <FormControlLabel
            label="Show Grid Lines"
            control={
              <Checkbox
                checked={showGrid}
                onChange={() => setShowGrid(!showGrid)}
              />
            }
          />
        </MenuItem>

        <MenuItem>
          <FormControlLabel
            label="Alternate Row Color"
            control={
              <Checkbox
                checked={alternateRowColor}
                onChange={() => setAlternateRowColor(!alternateRowColor)}
              />
            }
          />
        </MenuItem>

        <MenuItem>
          <FormControlLabel
            label="Transliteration"
            control={
              <Checkbox
                checked={enableTransliteration}
                onChange={() => {
                  setTransliteration(!enableTransliteration);
                  setAnchorElSettings(null);
                }}
              />
            }
          />
        </MenuItem>

        <MenuItem>
          <FormControlLabel
            label="RTL Mode"
            control={
              <Checkbox
                checked={enableRTL}
                onChange={() => {
                  setRTL(!enableRTL);
                  setAnchorElSettings(null);
                }}
              />
            }
          />
        </MenuItem>

        <MenuItem onClick={() => {
          setAnchorElSettings(null);
          onClearAll?.();
        }}>
          <Typography color="error">Clear All Data</Typography>
        </MenuItem>
      </Menu>

      {/* Font Size Button */}
      <Tooltip title="Font Size" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(event) => setAnchorElFont(event.currentTarget)}
        >
          <FormatSizeIcon />
        </IconButton>
      </Tooltip>

      {/* Font Size Menu */}
      <Menu
        sx={{ mt: "45px" }}
        id="font-menu"
        anchorEl={anchorElFont}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {fontSizeMenu.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
                localStorage.setItem(
                "OcrTranscriptionSettings",
                JSON.stringify({
                  ...JSON.parse(
                    localStorage.getItem("OcrTranscriptionSettings")
                  ),
                  fontSize: item.size,
                })
              );
              setFontSize(item.size);
              setAnchorElFont(null);
            }}
          >
            <CheckIcon
              style={{
                visibility: fontSize === item.size ? "visible" : "hidden",
              }}
            />
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ fontSize: item.size, marginLeft: "10px" }}
            >
              {item.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Undo Button */}
      <Tooltip title="Undo" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onUndo}
          disabled={undoStack?.length === 0}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      {/* Redo Button */}
      <Tooltip title="Redo" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onRedo}
          disabled={redoStack?.length === 0}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Import Button */}
      <Tooltip title="Import HTML Table" placement="bottom">
        <IconButton className="control-btn" onClick={onImport}>
          <CloudUploadIcon />
        </IconButton>
      </Tooltip>

      {/* Export Button */}
      <Tooltip title="Export HTML Table" placement="bottom">
        <IconButton className="control-btn" onClick={onExport}>
          <CloudDownloadIcon />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" className="controls-divider" />

      {/* Save Button */}
      <Tooltip title="Save" placement="bottom">
        <IconButton className="control-btn" onClick={onSave}>
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default memo(TableControls);