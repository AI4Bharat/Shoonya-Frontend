import React, { memo, useState } from "react";
import { useSelector } from "react-redux";

//Styles
import  AudioTranscriptionLandingStyle  from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import  CustomMenuComponent  from "../../component/CL-Transcription/CustomMenuComponent";

const VideoName = ({
  fontSize,
  setFontSize,
  darkAndLightMode,
  setDarkAndLightMode,
  subtitlePlacement,
  setSubtitlePlacement,
}) => {
  const classes = AudioTranscriptionLandingStyle();

  const [anchorElSettings, setAnchorElSettings] = useState(null);

  const fullscreenVideo = useSelector(
    (state) => state.commonReducer.fullscreenVideo
  );
//   const videoDetails = useSelector((state) => state.getVideoDetails.data);

  return (
    <Box
      className={classes.videoNameBox}
    //   style={fullscreenVideo ? { width: "60%", margin: "auto" } : {}}
    >
      <Tooltip  placement="bottom">
        <Typography
          variant="h4"
          className={classes.videoName}
        //   style={fullscreenVideo ? { color: "white" } : {}}
        >
            Audio Name
        </Typography>
      </Tooltip>

      <Tooltip title="Settings" placement="bottom">
        <IconButton
          className={classes.settingsIconBtn}
          style={{
            backgroundColor: "#2C2799",
            borderRadius: "50%",
            color: "#fff",
            margin: "auto",
            "&:hover": {
              backgroundColor: "#271e4f",
            },
          }}
          onClick={(event) => setAnchorElSettings(event.currentTarget)}
        >
          <WidgetsOutlinedIcon />
        </IconButton>
      </Tooltip>

      <CustomMenuComponent
        anchorElSettings={anchorElSettings}
        handleClose={() => setAnchorElSettings(null)}
        contianer={document.getElementById("audio")}
      />
    </Box>
  );
};

export default memo(VideoName);
