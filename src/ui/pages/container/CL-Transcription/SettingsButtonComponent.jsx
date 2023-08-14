import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
// import { fontMenu } from "utils";

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
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
// import { FindAndReplace } from "common";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const anchorOrigin = {
  vertical: "top",
  horizontal: "center",
};

const transformOrigin = {
  vertical: "top",
  horizontal: "center",
};

const SettingsButtonComponent = ({
  setTransliteration,
  enableTransliteration,
  setRTL_Typing,
  enableRTL_Typing,
  setFontSize,
  fontSize,
  saveTranscriptHandler,
  setOpenConfirmDialog,
  durationError,
  onUndo,
  onRedo,
  undoStack,
  redoStack,
  onSplitClick,
  showPopOver,
  showSplit,
  handleInfoButtonClick,
}) => {
  const classes = AudioTranscriptionLandingStyle();
  // const dispatch = useDispatch();

  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElFont, setAnchorElFont] = useState(null);
  // const [anchorElLimit, setAnchorElLimit] = useState(null);

//   const taskData = useSelector((state) => state.getTaskDetails.data);
//   const transcriptPayload = useSelector(
//     (state) => state.getTranscriptPayload.data
//   );
//   const totalPages = useSelector((state) => state.commonReducer.totalPages);
//   const completedCount = useSelector(
//     (state) => state.commonReducer.completedCount
//   );
  // const limit = useSelector((state) => state.commonReducer.limit);

//   const getDisbled = (flag) => {
//     if (
//       taskData?.task_type?.includes("VOICEOVER") &&
//       transcriptPayload?.source_type !== "MACHINE_GENERATED"
//     ) {
//       if (durationError?.some((item) => item === true)) {
//         return true;
//       }

//       if (flag && completedCount !== totalPages + 2) {
//         return true;
//       }
//     }

//     if (
//       !taskData?.task_type?.includes("VOICEOVER") &&
//       transcriptPayload?.source_type === "MACHINE_GENERATED"
//     ) {
//       if (!transcriptPayload?.payload?.payload.length) {
//         return true;
//       }
//     }

//     return false;
//   };

  return (
    <>
      {/* {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Number of Rows" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={(event) => setAnchorElLimit(event.currentTarget)}
          >
            <FormatLineSpacingIcon />
          </IconButton>
        </Tooltip>
      )}

      <Menu
        sx={{ mt: "45px" }}
        id="limit-menu"
        anchorEl={anchorElLimit}
        anchorOrigin={anchorOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorElLimit)}
        onClose={() => setAnchorElLimit(null)}
      >
        {[10, 25, 50, 100].map((item, index) => {
          return (
            <MenuItem key={index}>
              <FormControlLabel
                label={item}
                control={
                  <Checkbox
                    checked={limit === item}
                    onChange={() => {
                      setAnchorElLimit(null);
                      dispatch(setLimitInStore(item));
                    }}
                  />
                }
              />
            </MenuItem>
          );
        })}
      </Menu>

      <Divider orientation="vertical" className={classes.rightPanelDivider} /> */}

      {/* {!taskData?.task_type?.includes("VOICEOVER") && showSplit && (
        <Tooltip title="Split Subtitle" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onSplitClick}
            disabled={!showPopOver}
            sx={{
              marginRight: "5px",
              "&.Mui-disabled": { backgroundColor: "lightgray" },
            }}
          >
            <SplitscreenIcon />
          </IconButton>
        </Tooltip>
      )} */}
{/* 
      {(taskData?.task_type?.includes("TRANSLATION_EDIT") ||
        taskData?.task_type?.includes("VOICEOVER")) && (
        <Tooltip title="Incorrect Subtitles Info" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={handleInfoButtonClick}
            sx={{
              marginRight: "5px",
            }}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </Tooltip>
      )} */}

      {/* <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip> */}

      {/* <Menu
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
          <FormControlLabel
            label="Transliteration"
            control={
              <Checkbox
                checked={enableTransliteration}
                onChange={() => {
                  setAnchorElSettings(null);
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
                  setRTL_Typing(!enableRTL_Typing);
                }}
              />
            }
          />
        </MenuItem>
      </Menu> */}

      {/* <Divider orientation="vertical" className={classes.rightPanelDivider} /> */}

      {/* <Tooltip title="Font Size" placement="bottom">
        <IconButton
          className={classes.rightPanelBtnGrp}
          onClick={(event) => setAnchorElFont(event.currentTarget)}
        >
          <FormatSizeIcon />
        </IconButton>
      </Tooltip> */}

      {/* <Menu
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
      </Menu> */}

      {/* <Menu
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
      </Menu> */}

      {/* <FindAndReplace
        subtitleDataKey={
          taskData?.task_type?.includes("TRANSLATION") ? "target_text" : "text"
        }
        taskType={taskData?.task_type}
      /> */}

      <Divider orientation="vertical" className={classes.rightPanelDivider} />

      <Tooltip title="Save" placement="bottom">
        <IconButton
        style={{backgroundColor: "#2C2799",
        borderRadius: "50%",
        color: "#fff",
        marginX: "5px",
        "&:hover": {
          backgroundColor: "#271e4f",
        },}}
          className={classes.rightPanelBtnGrp}
        //   disabled={getDisbled()}
          onClick={() => saveTranscriptHandler(false)}
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Complete" placement="bottom">
        <IconButton
        style={{backgroundColor: "#2C2799",
    borderRadius: "50%",
    color: "#fff",
    marginX: "5px",
    "&:hover": {
      backgroundColor: "#271e4f",
    },}}
          className={classes.rightPanelBtnGrp}
          sx={{ marginLeft: "5px" }}
        //   disabled={getDisbled("complete")}
        //   onClick={() => setOpenConfirmDialog(true)}
        >
          <VerifiedIcon />
        </IconButton>
      </Tooltip>

      {/* <Divider orientation="vertical" className={classes.rightPanelDivider} />

      {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Undo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            onClick={onUndo}
            disabled={undoStack?.length === 0}
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
      )} */}

      {/* {!taskData?.task_type?.includes("VOICEOVER") && (
        <Tooltip title="Redo" placement="bottom">
          <IconButton
            className={classes.rightPanelBtnGrp}
            sx={{ marginLeft: "5px" }}
            onClick={onRedo}
            disabled={redoStack?.length === 0}
          >
            <RedoIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </>
  );
};

export default memo(SettingsButtonComponent);
