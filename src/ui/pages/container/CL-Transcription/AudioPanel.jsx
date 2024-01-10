import React, { useRef, useEffect, useState ,memo} from "react";
import { useDispatch, useSelector } from "react-redux";
import { isPlaying } from "../../../../utils/utils";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//APIs
import { setPlayer } from "../../../../redux/actions/Common";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";

const AudioPanel = memo( ({
  setCurrentTime,
  setPlaying,
  taskData
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

  //   const onClick = useCallback(() => {
  //     if ($video.current) {
  //       if (isPlaying($video.current)) {
  //         $video.current.pause();
  //         setPoster("play.png");
  //       } else {
  //         $video.current.play();
  //         setPoster("pause.png");
  //       }
  //     }
  //   }, [$video]);

//console.log(TaskDetails?.data?.audio_url,"TaskDetailsTaskDetailsTaskDetails")
  return (
    <Grid style={{ padding: "0px 20px 0px 20px" }}>
     
      {/* <div className={classes.videoPlayerParent} style={{ display: "flex" }}> */}
        <audio
          controls
          controlsList="nodownload"
          src={TaskDetails?.data?.audio_url}
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
