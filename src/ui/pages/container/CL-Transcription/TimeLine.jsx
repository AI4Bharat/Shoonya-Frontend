import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import WFPlayer from "wfplayer";



const WaveForm = memo(({ setWaveform, setRender }) => {
    const classes = AudioTranscriptionLandingStyle();
    const $waveform = useRef();
  
    const player = useSelector((state) => state.commonReducer.player);

    useEffect(() => {
      [...WFPlayer.instances].forEach((item) => item.destroy());
  
      const waveform = new WFPlayer({
        scrollable: true,
        useWorker: false,
        duration: 10,
        padding: 1,
        wave: true,
        pixelRatio: 2,
        container: $waveform.current,
        mediaElement: player,
        backgroundColor: "rgb(28, 32, 34)",
        waveColor: "rgb(255, 255, 255, 0.5)",
        progressColor: "rgb(255, 255, 255, 0.5)",
        gridColor: "rgba(255, 255, 255, 0.05)",
        rulerColor: "rgba(255, 255, 255, 0.5)",
        paddingColor: "rgba(0, 0, 0, 0)",
      });
  
      setWaveform(waveform);
      waveform.on("update", setRender);
  
      if (player?.src !== "") {
        waveform.load(encodeURIComponent(player?.src.replace(/&amp;/g, "&")));
      }
    }, [player, $waveform, setWaveform, setRender,player?.src]);
  
    return <div className={classes.waveform} ref={$waveform} />;
  });
export default function TimeLine() {
    const classes = AudioTranscriptionLandingStyle();
    const [waveform, setWaveform] = useState([]);

   

  return (
    <Box className={classes.timeLineParent} >
    {/* {player && */}
       {/* (videoDetails.direct_video_url || videoDetails.direct_audio_url) && ( */}
        <>
          {/* <Progress waveform={waveform} currentTime={currentTime} />
          <Duration currentTime={currentTime} /> */}
          <WaveForm 
          setWaveform={setWaveform} 
        //   setRender={setRender}
           />
          {/* <Grab waveform={waveform} />
          <Metronome render={render} playing={playing} />
          <SubtitleBoxes
            render={render}
            playing={playing}
            currentTime={currentTime}
          /> */}
        </>
      {/* )} */}
  </Box>
  )
}
