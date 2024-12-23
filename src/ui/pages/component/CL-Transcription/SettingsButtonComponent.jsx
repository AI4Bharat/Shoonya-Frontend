import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { fontMenu } from "../../../../utils/SubTitlesUtils";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import {
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  Tooltip,
  Typography,
  MenuItem,
} from "@mui/material";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SaveIcon from "@mui/icons-material/Save";
import VerifiedIcon from "@mui/icons-material/Verified";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TagIcon from '@mui/icons-material/Tag';
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
// import { FindAndReplace } from "common";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PreviewDialog from "./PreviewDialog";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
// import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacingIcon";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const anchorOrigin = {
  vertical: "top",
  horizontal: "center",
};

const transformOrigin = {
  vertical: "top",
  horizontal: "center",
};

const SettingsButtonComponent = ({
  totalSegments,
  setTransliteration,
  enableTransliteration,
  setRTL_Typing,
  enableRTL_Typing,
  setFontSize,
  fontSize,
  saveTranscriptHandler,
  setOpenConfirmDialog,
  durationError,
  handleDoubleHashes,
  sethash,
hash,
  onUndo,
  onRedo,
  undoStack,
  redoStack,
  onSplitClick,
  showPopOver,
  showSplit,
  subtitles,
  handleInfoButtonClick,
  advancedWaveformSettings,
  setAdvancedWaveformSettings,
  waveSurfer,
  setWaveSurfer,
  pauseOnType,
  setPauseOnType,
  annotationId,
  handleOpenPopover,
}) => {
  const classes = AudioTranscriptionLandingStyle();
  // const dispatch = useDispatch();

  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  const [anchorElLimit, setAnchorElLimit] = useState(null);
  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect(); 
    const position = {
      top: rect.top + window.scrollY, 
      left: rect.left + window.scrollX,
    };
    handleOpenPopover(position); 
  };
  return (
    <>
      <div
        style={{
          marginLeft: "15px",
          position: "absolute",
          left: "0",
          display: "block",
          height: "40px",
          width: "40px",
          lineHeight: "40px",
          borderRadius: "50%",
          fontSize: "large",
          backgroundColor: "#2C2799",
          color: "white",
          textAlign: "center",
        }}
      >
        {totalSegments}
      </div>

      {showSplit && (
        <Tooltip title="Split Subtitle" placement="bottom">
          <IconButton
            sx={{
              backgroundColor: "#2C2799",
              borderRadius: "50%",
              color: "#fff",
              marginX: "5px",
              marginRight: "5px",
              "&.Mui-disabled": { backgroundColor: "lightgray" },
              "&:hover": {
                backgroundColor: "#271e4f",
              },
            }}
            onClick={onSplitClick}
            // disabled={!showPopOver}
          >
            <SplitscreenIcon />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          style={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            marginX: "5px",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElSettings}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElSettings)}
        onClose={() => setAnchorElSettings(null)}
      >
        <MenuItem>
          <Typography sx={{ fontSize: 14 }}>
            Annotation ID: {annotationId}
          </Typography>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="Transliteration"
            control={
              <Checkbox
                checked={enableTransliteration}
                onChange={() => {
                  setAnchorElSettings(null);
                  localStorage.setItem(
                    "userCustomTranscriptionSettings",
                    JSON.stringify({
                      ...JSON.parse(
                        localStorage.getItem("userCustomTranscriptionSettings")
                      ),
                      enableTransliteration: !enableTransliteration,
                    })
                  );
                  setTransliteration(!enableTransliteration);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="RTL Typing"
            control={
              <Checkbox
                checked={enableRTL_Typing}
                onChange={() => {
                  setAnchorElSettings(null);
                  localStorage.setItem(
                    "userCustomTranscriptionSettings",
                    JSON.stringify({
                      ...JSON.parse(
                        localStorage.getItem("userCustomTranscriptionSettings")
                      ),
                      enableRTL_Typing: !enableRTL_Typing,
                    })
                  );
                  setRTL_Typing(!enableRTL_Typing);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="Pause when typing"
            control={
              <Checkbox
                checked={pauseOnType}
                onChange={() => {
                  setPauseOnType(!pauseOnType);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="Double Hash"
            control={<Checkbox checked={hash} onChange={() => {
              const newValue = !hash;
              sethash(newValue);
              sessionStorage.setItem("hash", JSON.stringify(newValue));
            }} />}
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="Advanced Settings"
            control={
              <Checkbox
                checked={advancedWaveformSettings}
                onChange={() => {
                  setAdvancedWaveformSettings(!advancedWaveformSettings);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            label="WaveSurfer"
            control={
              <Checkbox
                checked={waveSurfer}
                onChange={() => {
                  setWaveSurfer(!waveSurfer);
                }}
              />
            }
          />
        </MenuItem>
        <MenuItem>
          <Popup
            contentStyle={{
              width: "300px",
            }}
            trigger={
              <FormControlLabel
                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hotkeys Explorer"
                control={<div></div>}
              />
            }
            position="left center"
            on={["hover", "focus"]}
          >
            <div style={{ padding: "2px" }}>
              <div
                style={{
                  fontSize: "large",
                  textAlign: "center",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                Hotkeys
              </div>
              <ul
                style={{
                  fontSize: "medium",
                  paddingLeft: "20px",
                  marginBottom: "1px",
                }}
              >
                <li>Play/Pause - Shift + Space</li>
                <li>Seek Left - Shift + &#8592;</li>
                <li>Seek Right - Shift + &#8594;</li>
                <li>Noise Tags - $$$</li>
                <li>Toggle Transliteration - Alt + 1</li>
                {/* <li>Color Schema set</li> */}
              </ul>
            </div>
          </Popup>
        </MenuItem>
      </Menu>

      <Divider
        orientation="vertical"
        className={classes.rightPanelDivider}
        style={{ border: "1px solid grey", height: "auto", margin: "0 5px" }}
      />
{hash && (
      
        <Tooltip title="Double Hash" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            style={{
              backgroundColor: "#2C2799",
              borderRadius: "50%",
              color: "#fff",
              marginLeft: "5px",
              "&:hover": {
                backgroundColor: "#271e4f",
              },
            }}
            onClick={() => handleDoubleHashes()}
          >
            <TagIcon className={classes.rightPanelSvg} />
          </IconButton>
        </Tooltip>

      )}
      <Tooltip title="Font Size" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          style={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            marginLeft: "5px",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
          onClick={(event) => setAnchorElFont(event.currentTarget)}
        >
          <FormatSizeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Subtitle Preview" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={handleClick}
          style={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            marginLeft: "5px",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
        >
          <VisibilityIcon className={classes.rightPanelSvg} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElFont}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {fontMenu.map((item, index) => (
          <MenuItem key={index} onClick={(event) => setFontSize(item.size)}>
            <CheckIcon
              style={{
                visibility: fontSize === item.size ? "" : "hidden",
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

      <Menu
        sx={{ mt: "45px" }}
        anchorEl={anchorElFont}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElFont)}
        onClose={() => setAnchorElFont(null)}
      >
        {fontMenu.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              localStorage.setItem(
                "userCustomTranscriptionSettings",
                JSON.stringify({
                  ...JSON.parse(
                    localStorage.getItem("userCustomTranscriptionSettings")
                  ),
                  fontSize: item.size,
                })
              );
              setFontSize(item.size);
            }}
          >
            <CheckIcon
              style={{
                visibility: fontSize === item.size ? "" : "hidden",
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
        style={{ border: "1px solid grey", height: "auto", margin: "0 5px" }}
      />

      <Tooltip title="Undo" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            marginX: "5px",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
          onClick={onUndo}
          disabled={undoStack?.length === 0}
        >
          <UndoIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Redo" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          sx={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            marginX: "5px",
            marginLeft: "5px",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
          onClick={onRedo}
          disabled={redoStack?.length === 0}
        >
          <RedoIcon />
        </IconButton>
      </Tooltip>

    </>
  );
};

export default memo(SettingsButtonComponent);
