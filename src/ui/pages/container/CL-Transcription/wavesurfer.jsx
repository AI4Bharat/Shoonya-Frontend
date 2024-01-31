import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import { useEffect, useRef, memo } from "react";
import { Box } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
// import { setPlayer } from "../../../../redux/actions/Common";
// import { useDispatch } from "react-redux";

const Timeline2 = ({details}) => {
    const $footer = useRef();
    const classes = AudioTranscriptionLandingStyle();
    console.log(details);
    let waveSurf = useRef();

    useEffect(() => {
        if(details?.data?.audio_url !== undefined){
          waveSurf.current = WaveSurfer.create({
              container: document.querySelector('#waveform'),
              waveColor: '#A8DBA8',
              progressColor: '#3B8686',
              mediaControls: true,
              url: details?.data?.audio_url,
              media: document.querySelector('audio')
          });
      }  
    }, [details])

    return (
      <Box className={classes.timeLineParent} ref={$footer}>
            <>
              <div id="waveform"></div>
            </>
      </Box>
    );
  };
  

export default memo(Timeline2);