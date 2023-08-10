// AudioTranscriptionLandingPage

import React from "react";
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import { Box, IconButton, Tooltip, Typography, Grid } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import Timeline from "./TimeLine";
import AudioPanel from "./AudioPanel";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

export default function AudioTranscriptionLandingPage() {
  const classes = AudioTranscriptionLandingStyle();

  return (
    <>
      <Grid container direction={"row"} className={classes.parentGrid}>
        <Grid md={6} xs={12} id="video" className={classes.videoParent}>
          <Box
            // style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
            className={classes.videoBox}
          >
            <Box
              className={classes.videoNameBox}
              // style={fullscreenVideo ? { width: "60%", margin: "auto" } : {}}
            >
              <Tooltip placement="bottom">
                <Typography
                  variant="h4"
                  className={classes.videoName}
                  // style={fullscreenVideo ? { color: "white" } : {}}
                >
                  Audio Name
                </Typography>
              </Tooltip>

              <Tooltip title="Settings" placement="bottom">
                <IconButton
                  style={{
                    backgroundColor: "#2C2799",
                    borderRadius: "50%",
                    color: "#fff",
                    margin: "auto",
                    "&:hover": {
                      backgroundColor: "#271e4f",
                    },
                  }}
                  // className={classes.settingsIconBtn}
                  // onClick={(event) => setAnchorElSettings(event.currentTarget)}
                >
                  <WidgetsOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            {/* <VideoName
        fontSize={fontSize}
        setFontSize={setFontSize}
        darkAndLightMode={darkAndLightMode}
        setDarkAndLightMode={setDarkAndLightMode}
        subtitlePlacement={subtitlePlacement}
        setSubtitlePlacement={setSubtitlePlacement}
      /> */}

            {/* <VideoPanel
        setCurrentTime={setCurrentTime}
        setPlaying={setPlaying}
      /> */}

            <AudioPanel />
          </Box>
        </Grid>

        <Grid md={6} xs={12} sx={{ width: "100%" }}>
          <TranscriptionRightPanel />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline />
      </Grid>
    </>
  );
}
