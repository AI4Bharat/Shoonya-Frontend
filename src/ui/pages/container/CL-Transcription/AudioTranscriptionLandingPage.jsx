// AudioTranscriptionLandingPage

import React from "react";
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import { Grid } from "@mui/material";
import Timeline from "./TimeLine";

export default function AudioTranscriptionLandingPage() {
  return (
    <div >
        <Grid container >
        <Grid xs={12} sm={12} md={6} lg={6} xl={6}></Grid>
      <Grid  xs={12} sm={12} md={6} lg={6} xl={6}>
        <TranscriptionRightPanel />
      </Grid>
      </Grid>
      <Grid container>
      <Grid
       xs={12} sm={12} md={12} lg={12} xl={12}
        width={"100%"}
        position="fixed"
        bottom={1}
        // sx={{backgroundColor:"red"}}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline
          />
      </Grid></Grid>
    </div>
  );
}
