import { useEffect, useRef, memo, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "../../../../../node_modules/wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from '../../../../../node_modules/wavesurfer.js/dist/plugins/timeline.esm.js';
import { useSelector, useDispatch } from "react-redux";
import { setSubtitles } from "../../../../redux/actions/Common";
import C from "../../../../redux/constants";
import DT from "duration-time-conversion";

const Timeline2 = ({ key, details, waveformSettings, repeatCount }) => {
  const repeatCountRef = useRef(repeatCount);
  useEffect(() => {
    repeatCountRef.current = repeatCount;
  }, [repeatCount]);
  const waveSurf = useRef(null);
  const miniMap = useRef(null);
  const regions = useRef(null);
  const miniMapRegions = useRef(null);
  const result = useSelector((state) => state.commonReducer?.subtitles);
  const player = useSelector((state) => state.commonReducer?.player);
  const [currentSubs, setCurrentSubs] = useState([]);
  const [currentSubsCopy, setCurrentSubsCopy] = useState([]);
  const dispatch = useDispatch();
  const [regionsInit, setRegionsInit] = useState(false);
  const [waveSurfInstance, setWaveSurfInstance] = useState(null);
  const [regionsPluginInstance, setRegionsPluginInstance] = useState(null);

  const updateRegions = (currentSubs) => {
    if (details?.data !== undefined && waveSurf.current !== null && miniMap.current !== null && regions.current !== null && miniMapRegions.current !== null && currentSubs.length > 0) {
      regions.current.clearRegions();
      miniMapRegions.current.clearRegions();
      currentSubs?.map((sub) => {
        regions.current.addRegion({
          id: sub.id,
          start: sub.startTime,
          end: sub.endTime,
          content: sub.text,
          drag: true,
          resize: true,
          contentEditable: true,
          color: sub.speaker_id === "Speaker 1"
            ? "rgb(0, 87, 158, 0.2)"
            : sub.speaker_id === "Speaker 0"
              ? "rgb(123, 29, 0, 0.2)"
              : "rgb(0, 0, 0, 0.6)",
        });
        miniMapRegions.current.addRegion({
          start: sub.startTime,
          end: sub.endTime,
          color: sub.text === ""
            ? "rgb(255, 0, 0, 0.5)"
            : "rgb(0, 255, 0, 0.5)",
          drag: false,
          resize: false,
        });
      })
    }
  };

  useEffect(() => {
    if (result) {
      if (!regionsInit) {
        if (waveSurf.current !== null) {
          waveSurf.current.once('decode', () => {
            setRegionsInit(true);
            setTimeout(() => {
              updateRegions(result);
            }, 500);
          });
        }
      }
      setCurrentSubs(result);
      setCurrentSubsCopy(result);
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
        hideScrollbar: true,
        autoCenter: true,
        autoScroll: true,
        cursorWidth: 2,
        media: document.querySelector('audio'),
        plugins: [
          // Minimap.create({
          //   height: 20,
          //   waveColor: '#ddd',
          //   progressColor: '#999',
          //   insertPosition: 'beforeBegin',
          // }),
          TimelinePlugin.create({
            insertPosition: 'beforebegin',
            timeInterval: 0.2,
            primaryLabelInterval: 5,
            secondaryLabelInterval: 1,
            style: {
              fontSize: '10px',
              color: '#2D5B88',
            },
          }),
        ],
      });
      regions.current = waveSurf.current.registerPlugin(RegionsPlugin.create());
      setWaveSurfInstance(waveSurf.current);
      setRegionsPluginInstance(regions.current);
    }
    if (details?.data?.audio_url !== undefined && miniMap.current === null) {
      miniMap.current = WaveSurfer.create({
        container: document.querySelector('#minimap'),
        height: '20',
        hideScrollbar: true,
        mediaControls: true,
        media: document.querySelector('audio'),
      });
      miniMapRegions.current = miniMap.current.registerPlugin(RegionsPlugin.create());
    }
    return () => {
      if (waveSurf.current) {
        waveSurf.current.destroy();
        waveSurf.current = null;
        setWaveSurfInstance(null);
        setRegionsPluginInstance(null);
      }
      if (miniMap.current) {
        miniMap.current.destroy();
        miniMap.current = null;
      }
    };
  }, [details]);

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
        hideScrollbar: true,
        autoCenter: true,
        autoScroll: true,
        cursorWidth: 2,
        media: document.querySelector('audio'),
        plugins: [
          // Minimap.create({
          //   height: 20,
          //   waveColor: '#ddd',
          //   progressColor: '#999',
          //   insertPosition: 'beforeBegin',
          // }),
          TimelinePlugin.create({
            insertPosition: 'beforebegin',
            timeInterval: 0.2,
            primaryLabelInterval: 5,
            secondaryLabelInterval: 1,
            style: {
              fontSize: '10px',
              color: '#2D5B88',
            },
          }),
        ],
      });
      regions.current = waveSurf.current.registerPlugin(RegionsPlugin.create());
      setWaveSurfInstance(waveSurf.current);
      setRegionsPluginInstance(regions.current);
      waveSurf.current.on('decode', () => {
        currentSubs?.map((sub) => {
          regions.current.addRegion({
            id: sub.id,
            start: sub.startTime,
            end: sub.endTime,
            content: sub.text,
            drag: true,
            resize: true,
            contentEditable: true,
            color: sub.speaker_id === "Speaker 1"
              ? "rgb(0, 87, 158, 0.2)"
              : sub.speaker_id === "Speaker 0"
                ? "rgb(123, 29, 0, 0.2)"
                : "rgb(0, 0, 0, 0.6)",
          })
        })
      })
    }
    if (details?.data?.audio_url !== undefined && miniMap.current === null) {
      miniMap.current.destroy();
      miniMap.current = WaveSurfer.create({
        container: document.querySelector('#minimap'),
        height: '20',
        mediaControls: true,
        media: document.querySelector('audio'),
        hideScrollbar: true,
      });
      miniMapRegions.current = miniMap.current.registerPlugin(RegionsPlugin.create());
      miniMap.current.on('decode', () => {
        currentSubs?.map((sub) => {
          miniMapRegions.current.addRegion({
            start: sub.startTime,
            end: sub.endTime,
            color: sub.text === ""
              ? "rgb(255, 0, 0, 0.5)"
              : "rgb(0, 255, 0, 0.5)",
            drag: false,
            resize: false,
          })
        })
      })
    }
  }, [waveformSettings])

  useEffect(() => {
    updateRegions(currentSubs);
  }, [details, currentSubs])

  const updateSub = useCallback((currentSubsCopy) => {
    dispatch(setSubtitles(currentSubsCopy, C.SUBTITLES));
  }, [dispatch]);

  useEffect(() => {
    if (!regionsPluginInstance || !waveSurfInstance) return;

    let activeRegion = null;
    let playCount = 0;

    const onRegionOut = (region) => {
      if (activeRegion === region) {
        playCount++;
        if (repeatCountRef.current === -1 || playCount <= repeatCountRef.current) {
          region.play();
        } else {
          waveSurfInstance.pause();
          activeRegion = null;
          playCount = 0;
        }
      }
    };

    const onRegionDoubleClicked = (region, e) => {
      e.stopPropagation();
      activeRegion = region;
      playCount = 0;
      region.play();
    };

    const onInteraction = () => {
      activeRegion = null;
      playCount = 0;
    };

    const onRegionUpdated = (region) => {
      if (currentSubsCopy.length > 0) {
        if (region?.content?.innerHTML) {
          currentSubsCopy[region.id - 1].text = region?.content?.innerHTML;
        }
        currentSubsCopy[region.id - 1].start_time = DT.d2t(region.start);
        currentSubsCopy[region.id - 1].end_time = DT.d2t(region.end);
        if (region.id > 1) {
          if (DT.t2d(currentSubsCopy[region.id - 1].start_time) < DT.t2d(currentSubsCopy[region.id - 2]?.end_time)) {
            currentSubsCopy[region.id - 1].start_time = currentSubs[region.id - 2].end_time;
            currentSubsCopy[region.id - 1].end_time = currentSubs[region.id - 1].end_time;
          }
        }
        if (region.id < currentSubsCopy.length) {
          if (DT.t2d(currentSubsCopy[region.id - 1].end_time) > DT.t2d(currentSubsCopy[region.id]?.start_time)) {
            currentSubsCopy[region.id - 1].end_time = currentSubs[region.id].start_time;
            currentSubsCopy[region.id - 1].start_time = currentSubs[region.id - 1].start_time;
          }
        }
        updateSub(currentSubsCopy);
        if (region.start.toFixed(3) === parseFloat(DT.t2d(currentSubsCopy[region.id - 1].start_time))) {
          player.currentTime = region.end;
        } else {
          player.currentTime = region.start;
        }
        updateRegions(currentSubsCopy);
      }
    };

    regionsPluginInstance.on('region-out', onRegionOut);
    regionsPluginInstance.on('region-double-clicked', onRegionDoubleClicked);
    regionsPluginInstance.on('region-updated', onRegionUpdated);
    waveSurfInstance.on('interaction', onInteraction);

    return () => {
      regionsPluginInstance.un('region-out', onRegionOut);
      regionsPluginInstance.un('region-double-clicked', onRegionDoubleClicked);
      regionsPluginInstance.un('region-updated', onRegionUpdated);
      waveSurfInstance.un('interaction', onInteraction);
    };
  }, [regionsPluginInstance, waveSurfInstance, currentSubsCopy, currentSubs, player]);

  return (
    <>
      <div style={{ paddingLeft: "20px", paddingRight: "20px", backgroundColor: "#ffffff" }} id="minimap"></div>
      <div style={{ paddingLeft: "20px", paddingRight: "20px", backgroundColor: "#ffffff" }} id="waveform"></div>
    </>
  );
};


export default memo(Timeline2);