import React, { memo, useState,useEffect } from "react";
import { fontMenu } from "../../../../utils/SubTitlesUtils";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
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
import TagIcon from '@mui/icons-material/Tag';
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Popup from "reactjs-popup";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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
  formatMultiHypothesis,
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
ProjectDetails,
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
    const [autoFormatHypothesis, setAutoFormatHypothesis] = useState(
    JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))
      ?.autoFormatHypothesis || false
  );
  const handleAutoFormatChange = () => {
    const newValue = !autoFormatHypothesis;
    setAutoFormatHypothesis(newValue);
    
    // Save to localStorage
    localStorage.setItem(
      "userCustomTranscriptionSettings",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("userCustomTranscriptionSettings") || "{}"),
        autoFormatHypothesis: newValue,
      })
    );
    
    // If enabling auto-format, format all current subtitles
    if (newValue && formatMultiHypothesis) {
      formatMultiHypothesis();
    }
  };

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect(); 
    const position = {
      top: rect.top + window.scrollY, 
      left: rect.left + window.scrollX,
    };
    handleOpenPopover(position); 
  };
 useEffect(() => {
  let style = document.getElementById("rtl-style");

  if (!style) {
    style = document.createElement("style");
    style.id = "rtl-style";
    document.head.appendChild(style);
  }

  if (enableRTL_Typing) {
    style.innerHTML = `
      /* Base RTL styling */
      input, textarea {
        direction: rtl;
        unicode-bidi: plaintext;
        text-align: right;
      }
      
      /* Force LTR for inputs that typically contain measurements/numbers */
      input[type="number"],
      input.input-number,
      input.input-measurement {
        direction: ltr !important;
        unicode-bidi: plaintext !important;
        text-align: left !important;
      }
      
      /* Special class for mixed content inputs */
      .mixed-content-rtl-fix {
        unicode-bidi: plaintext;
        direction: ltr;
        text-align: left;
      }
    `;
  } else {
    style.innerHTML = `
      input, textarea {
        direction: ltr;
        unicode-bidi: plaintext;
        text-align: left;
      }
    `;
  }
}, [enableRTL_Typing]);


  return (
    <>
      <Box
        style={{
          position:"absolute",
          left:"15px",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          height: "40px",
          width: "40px",
          minWidth:"40px",
          lineHeight: "40px",
          borderRadius: "50%",
          fontSize: "large",
          backgroundColor: "#2C2799",
          color: "white",
          textAlign: "center",
        }}
      >
        {totalSegments}
      </Box>
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
        {ProjectDetails?.title?.toLowerCase()?.includes("yt_transcription")&&<MenuItem>
          <FormControlLabel
            label="Double Hash"
            control={<Checkbox checked={hash} onChange={() => {
              const newValue = !hash;
              sethash(newValue);
              sessionStorage.setItem("hash", JSON.stringify(newValue));
            }} />}
          />
        </MenuItem>}
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
            label="Format Multi-Hypothesis"
            control={
              <Checkbox
                checked={autoFormatHypothesis}
                onChange={handleAutoFormatChange}
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
                sx={{paddingLeft:"48px"}}
                label="Hotkeys Explorer"
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
                <li>Select Text Left - Ctrl + Shift + &lt;</li>
                <li>Select Text Right - Ctrl + Shift + &gt;</li>
                <li>Noise Tags - $$$</li>
                <li>Toggle Transliteration - Alt + 1</li>
                <li>Undo - Ctrl + Z</li>
                <li>Redo - Ctrl + Y</li>
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
{ProjectDetails?.title?.toLowerCase()?.includes("yt_transcription") && hash && (
      
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
            {autoFormatHypothesis && ( <Tooltip title="Format Multi-Hypothesis" placement="bottom">
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
    onClick={() => {
      formatMultiHypothesis();
    }}
  >
    <FormatListBulletedIcon />
  </IconButton>
</Tooltip>)}

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
