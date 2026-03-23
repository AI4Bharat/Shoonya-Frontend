// components/TableControls.js
import React, { memo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
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
import ImportExportIcon from "@mui/icons-material/ImportExport";
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
}) => {
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [anchorElTheme, setAnchorElTheme] = useState(null);

  // Apply theme to CSS variables
  useEffect(() => {
    if (theme) {
      document.documentElement.style.setProperty('--primary-color', theme.primary);
      document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    }
  }, [theme]);

  return (
    <div className="table-controls">
      {/* Row Count Badge */}
      <Box
      style={{ backgroundColor: "black" }}
        className="count-badge"
      >
        <TableRowsIcon className="badge-icon" />
        <span  className="badge-count">
          {totalRows}
        </span>
      </Box>

      {/* Column Count Badge */}
      <Box
        className="count-badge"
        style={{ marginLeft: "5px",backgroundColor: "black"  }}
      >
        <ViewColumnIcon className="badge-icon" />
        <span className="badge-count">{totalColumns}</span>
      </Box>

      <Divider
        orientation="vertical"
        className="controls-divider"
      />

      {/* Add Row Button */}
      <Tooltip title="Add Row" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onAddRow}
        >
          <TableRowsIcon />
          <span className="btn-plus">+</span>
        </IconButton>
      </Tooltip>

      {/* Add Column Button */}
      <Tooltip title="Add Column" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onAddColumn}
        >
          <ViewColumnIcon />
          <span className="btn-plus">+</span>
        </IconButton>
      </Tooltip>

      <Divider
        orientation="vertical"
        className="controls-divider"
      />

      {/* Settings Button */}
      <Tooltip title="Table Settings" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

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

      {/* Theme Button */}
      {/* <Tooltip title="Color Theme" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={(event) => setAnchorElTheme(event.currentTarget)}
        >
          <ColorLensIcon />
        </IconButton>
      </Tooltip> */}

      {/* Theme Menu */}
      {/* <Menu
        sx={{ mt: "45px" }}
        id="theme-menu"
        anchorEl={anchorElTheme}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElTheme)}
        onClose={() => setAnchorElTheme(null)}
      >
        {colorThemes.map((themeOption, index) => (
          <MenuItem 
            key={index} 
            onClick={() => {
              setTheme(themeOption);
              setAnchorElTheme(null);
            }}
          >
            <CheckIcon
              style={{
                visibility: theme?.name === themeOption.name ? "visible" : "hidden",
                color: themeOption.primary,
              }}
            />
            <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  borderRadius: "50%", 
                  background: `linear-gradient(135deg, ${themeOption.primary} 0%, ${themeOption.secondary} 100%)`,
                  mr: 1
                }} 
              />
              <Typography>{themeOption.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu> */}

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

      <Divider
        orientation="vertical"
        className="controls-divider"
      />

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

      <Divider
        orientation="vertical"
        className="controls-divider"
      />

      {/* Save Button */}
      <Tooltip title="Save" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onSave}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>

      {/* Export Button */}
      {/* <Tooltip title="Export" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onExport}
        >
          <ImportExportIcon />
        </IconButton>
      </Tooltip> */}

      {/* Import Button */}
      {/* <Tooltip title="Import" placement="bottom">
        <IconButton
          className="control-btn"
          onClick={onImport}
        >
          <TextFieldsIcon />
        </IconButton>
      </Tooltip> */}
    </div>
  );
};

export default memo(TableControls);