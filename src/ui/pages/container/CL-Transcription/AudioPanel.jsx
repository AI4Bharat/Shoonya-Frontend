import React, { useRef, useEffect,memo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { isPlaying } from "../../../../utils/utils";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import { setPlayer } from "../../../../redux/actions/Common";

const AudioPanel = memo( ({
  setCurrentTime,
  setPlaying,
  taskData,
  audioUrl
}) => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const $audio = useRef();
  const { taskId } = useParams();
  const TaskDetails = useSelector((state) => state.getTaskDetails?.data);

  useEffect(() => {
    dispatch(setPlayer($audio.current));
    (function loop() {
      window.requestAnimationFrame(() => {
        if ($audio.current) {
          setPlaying(isPlaying($audio.current));
          setCurrentTime($audio.current.currentTime || 0);
          $audio.current.defaultPlaybackRate = 1.0;
        }
        loop();
      });
    })();
    // eslint-disable-next-line
  }, [setPlayer, setCurrentTime, setPlaying, $audio]);

  useEffect(() => {
    const audio = document.getElementById('audio-panel');
    audio.oncontextmenu = function (e) {
      e.preventDefault();
    };
  }, [])

  return (
    <Grid style={{ padding: "0px 20px 0px 20px" }}>
     
      {/* <div className={classes.videoPlayerParent} style={{ display: "flex" }}> */}
        <audio
          id ="audio-panel"
          controls
          controlsList="nodownload"
          src={audioUrl}
          preload="metadata"
          type="audio"
          // style={{
          //   width: videoDetails?.video?.audio_only ? "20%" : "",
          //   margin:
          //     videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
          // }}
          // poster={taskData ? poster : ""}
          ref={$audio}
          className={classes.videoPlayer}
        />
      {/* </div> */}
    
    </Grid>
  );
  
}, 
() => true
)

export default AudioPanel;
