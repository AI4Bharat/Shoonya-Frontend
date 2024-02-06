import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import { useEffect, useRef, memo, useState } from "react";
import { Box } from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "../../../../../node_modules/wavesurfer.js/dist/plugins/regions.esm.js";
import Minimap from "../../../../../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js";
import { useSelector } from "react-redux";

const Timeline2 = ({ details, waveformSettings }) => {
  const $footer = useRef();
  const classes = AudioTranscriptionLandingStyle();
  const waveSurf = useRef(null);
  const regions = useRef(null);
  const result = useSelector((state) => state.commonReducer?.subtitles);
  const [currentSubs, setCurrentSubs] = useState([]);
  console.log(result);

  useEffect(() => {
    if (result) {
      setCurrentSubs(result);
    }
  }, [result]);

  useEffect(() => {
    if (details?.data?.audio_url !== undefined && waveSurf.current === null) {
      waveSurf.current = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        height: waveformSettings.height,
        width: waveformSettings.width,
        waveColor: waveformSettings.waveColor,
        progressColor: waveformSettings.progressColor,
        barWidth: waveformSettings.barWidth,
        minPxPerSec: waveformSettings.minPxPerSec,
        cursorColor: waveformSettings.cursorColor,
        cursorWidth: waveformSettings.cursorWidth,
        barGap: waveformSettings.barGap,
        barRadius: waveformSettings.barRadius,
        barHeight: waveformSettings.barHeight,
        mediaControls: true,
        url: details?.data?.audio_url,
        media: document.querySelector('audio'),
        plugins: [
          Minimap.create({
            height: 20,
            waveColor: '#ddd',
            progressColor: '#999',
          }),
        ],
      });
      regions.current = waveSurf.current.registerPlugin(RegionsPlugin.create());
    }
  }, [details])

  useEffect(() => {
    if (details?.data?.audio_url !== undefined && waveSurf.current !== null) {
      waveSurf.current.destroy();
      waveSurf.current = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        height: waveformSettings.height,
        waveColor: waveformSettings.waveColor,
        progressColor: waveformSettings.progressColor,
        barWidth: waveformSettings.barWidth,
        minPxPerSec: waveformSettings.minPxPerSec,
        cursorColor: waveformSettings.cursorColor,
        cursorWidth: waveformSettings.cursorWidth,
        barGap: waveformSettings.barGap,
        barRadius: waveformSettings.barRadius,
        barHeight: waveformSettings.barHeight,
        mediaControls: true,
        url: details?.data?.audio_url,
        media: document.querySelector('audio'),
        plugins: [
          Minimap.create({
            height: 20,
            waveColor: '#ddd',
            progressColor: '#999',
          }),
        ],
      });
      regions.current = waveSurf.current.registerPlugin(RegionsPlugin.create());
      if (currentSubs){
        waveSurf.current.on('decode', () => {
          {
            currentSubs?.map((sub, key) => {
              regions.current.addRegion({
                start: sub.startTime,
                end: sub.endTime,
                content: sub.text,
                drag: false,
                resize: true,
              })
            })
          }
        })
      }
    }
  }, [waveformSettings])

  useEffect(() => {
    if (details?.data !== undefined && waveSurf.current !== null) {
      regions.current.clearRegions();
      currentSubs?.map((sub, key) => {
        regions.current.addRegion({
          start: sub.startTime,
          end: sub.endTime,
          content: sub.text,
          drag: false,
          resize: true,
        })
      })
    }
  }, [details, waveSurf.current, currentSubs])

  if (waveSurf !== null && regions.current !== null) {
    let activeRegion = null
    regions.current.on('region-out', (region) => {
      if (activeRegion === region) {
        waveSurf.current.pause();
        activeRegion = null;
      }
    })
    regions.current.on('region-double-clicked', (region, e) => {
      e.stopPropagation();
      activeRegion = region;
      region.play();
    })
    waveSurf.current.on('interaction', () => {
      activeRegion = null;
    })
  }

  return (
    <Box className={classes.timeLineParent} ref={$footer}>
      <>
        <div style={{ paddingLeft: "20px", paddingRight: "20px" }} id="waveform"></div>
      </>
    </Box>
  );
};


export default memo(Timeline2);