import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import WFPlayer from "wfplayer";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
import DT from "duration-time-conversion";
import clamp from "lodash/clamp";
import { throttle } from "lodash";
import Metronome from "./Metronome";
import SubtitleBoxes from "./SubtitleBoxes";  
import { useParams } from "react-router-dom";


const WaveForm = (({ setWaveform, setRender, waveformSettings }) => {
  const classes = AudioTranscriptionLandingStyle();
  const $waveform = useRef();

  const player = useSelector((state) => state.commonReducer?.player);
  console.log(waveformSettings);
  useEffect(() => {
    [...WFPlayer.instances].forEach((item) => item.destroy());

    const waveform = new WFPlayer({
      wave: waveformSettings.wave,
      waveColor: waveformSettings.waveColor+"1A",
      backgroundColor: waveformSettings.backgroundColor,
      paddingColor: waveformSettings.paddingColor+"0D",
      cursor:waveformSettings.cursor,
      cursorColor: waveformSettings.cursorColor,
      progress: waveformSettings.progress,
      progressColor: waveformSettings.progressColor+'80',
      grid: waveformSettings.grid,
      gridColor: waveformSettings.gridColor+'0D',
      ruler: waveformSettings.ruler,
      rulerColor: waveformSettings.rulerColor+'80',
      scrollbar: waveformSettings.scrollbar,
      scrollbarColor: waveformSettings.scrollbarColor+'40',
      rulerAtTop: waveformSettings.rulerAtTop,
      scrollable: waveformSettings.scrollable,
      duration: Number(waveformSettings.duration),
      padding: Number(waveformSettings.padding),
      pixelRatio: Number(waveformSettings.pixelRatio),
      waveScale: Number(waveformSettings.waveScale),
      waveSize: Number(waveformSettings.waveSize),

      useWorker: false,
      container: $waveform.current,
      mediaElement: player,
    });

    fetch(player.src)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        const uint8 = new Uint8Array(arrayBuffer);
        waveform.load(uint8);
        setWaveform(waveform);
        waveform.on("update", setRender);
    });
    
      // waveform.load(encodeURIComponent(player?.attributes?.nodeValue?.replace(/&amp;/g, "&")));
  
  }, [player, $waveform, setWaveform, setRender, player.src, waveformSettings]);

  return <div className={classes.waveform} ref={$waveform} />;
});

const Progress = memo(({ waveform, currentTime, subtitle = [] ,taskId}) => {
  const classes = AudioTranscriptionLandingStyle();
  const firstLoaded = useRef(false);
  const dispatch = useDispatch();

  const player = useSelector((state) => state.commonReducer.player);
  const limit = useSelector((state) => state.commonReducer.limit);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);

  const [grabbing, setGrabbing] = useState(false);
console.log(taskId,"taskIdtaskIdtaskId")
  // useEffect(() => {
  //   if (firstLoaded.current && !grabbing) {
  //     const apiObj = new GetAnnotationsTaskAPI(
  //       taskDetails.id,
  //     );
  //     dispatch(APITransport(apiObj));
  //   } else {
  //     firstLoaded.current = true;
  //   }

  //   // eslint-disable-next-line
  // }, [grabbing]);

  const onProgressClick = useCallback(
    (event) => {
      if (event.button !== 0) return;
      const currentTime =
        (event.pageX / document.body.clientWidth) * player.duration;
      player.currentTime = currentTime;
      waveform.seek(currentTime);

      const apiObj = new GetAnnotationsTaskAPI(
        taskDetails.id,
        // taskDetails?.task_type,
        // DT.d2t(currentTime),
        // limit
      );
      dispatch(APITransport(apiObj));
    },

    // eslint-disable-next-line
    [player, waveform, limit]
  );

  const onGrabDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      setGrabbing(true);
    },
    [setGrabbing]
  );

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing) {
        const currentTime =
          (event.pageX / document.body.clientWidth) * player.duration;
        player.currentTime = currentTime;
      }
    },
    [grabbing, player]
  );

  const onDocumentMouseUp = useCallback(() => {
    if (grabbing) {
      setGrabbing(false);
      waveform.seek(player.currentTime);
    }
  }, [grabbing, waveform, player.currentTime]);

  useEffect(() => {
    document.addEventListener("mouseup", onDocumentMouseUp);
    document.addEventListener("mousemove", onGrabMove);
    return () => {
      document.removeEventListener("mouseup", onDocumentMouseUp);
      document.removeEventListener("mousemove", onGrabMove);
    };
  }, [onDocumentMouseUp, onGrabMove]);

  return (
    <Box className={classes.progress} onClick={onProgressClick}>
      <Box
        className={classes.bar}
        style={{
          width: `${(currentTime / player.duration) * 100}%`,
        }}
      >
        <Box className={classes.handle} onMouseDown={onGrabDown}></Box>
      </Box>
      <Box className={classes.timelineSubtitle}>
        {subtitle.length <= 200
          ? subtitle.map((item, index) => {
              const { duration } = player;
              return (
                <span
                  key={index}
                  className={classes.item}
                  style={{
                    left: `${(item.startTime / duration) * 100}%`,
                    width: `${(item.duration / duration) * 100}%`,
                  }}
                />
              );
            })
          : null}
      </Box>
    </Box>
  );
});

const Grab = memo(({ waveform , taskId,}) => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const firstLoaded = useRef(false);

  const player = useSelector((state) => state.commonReducer.player);
  const limit = useSelector((state) => state.commonReducer.limit);
  const taskDetails = useSelector((state) => state.getTaskDetails.data);
// console.log(taskDetails.id,"taskDetailstaskDetails")

  const [grabStartX, setGrabStartX] = useState(0);
  const [grabStartTime, setGrabStartTime] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const onGrabDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      setGrabStartX(event.pageX);
      setGrabStartTime(player.currentTime);
      setGrabbing(true);
    },
    [player]
  );

  // useEffect(() => {
  //   if (firstLoaded.current && !grabbing) {
  //     const apiObj = new GetAnnotationsTaskAPI(
  //       taskDetails.id,
        
  //       // taskDetails?.task_type,
  //       // DT.d2t(player.currentTime),
  //       // limit
  //     );
  //     dispatch(APITransport(apiObj));
  //   } else {
  //     firstLoaded.current = true;
  //   }

  //   // eslint-disable-next-line
  // }, [grabbing]);

  const onGrabUp = () => {
    setGrabStartX(0);
    setGrabStartTime(0);
    setGrabbing(false);
  };

  const onGrabMove = useCallback(
    (event) => {
      if (grabbing && player && waveform) {
        const currentTime = clamp(
          grabStartTime -
            ((event.pageX - grabStartX) / document.body.clientWidth) * 10,
          0,
          player.duration
        );
        player.currentTime = currentTime;
        waveform.seek(currentTime);
      }
    },
    [grabbing, player, waveform, grabStartX, grabStartTime]
  );

  useEffect(() => {
    document.addEventListener("mouseup", onGrabUp);
    return () => document.removeEventListener("mouseup", onGrabUp);
  }, []);

  return (
    <div
      className={`${classes.grab} ${grabbing ? classes.grabbing : ""}`}
      onMouseDown={onGrabDown}
      onMouseMove={onGrabMove}
    />
  );
});

const Duration = memo(({ currentTime }) => {
  const classes = AudioTranscriptionLandingStyle();
  const player = useSelector((state) => state.commonReducer.player);

  const getDuration = useCallback((time) => {
    time = time === Infinity ? 0 : time;
    return DT.d2t(time).split(".")[0];
  }, []);

  return (
    <div className={classes.duration}>
      {currentTime > 0 && (
        <span className={classes.durationSpan}>
          {getDuration(currentTime)} / {getDuration(player.duration || 0)}
        </span>
      )}
    </div>
  );
});

const Timeline = ({ currentTime, playing ,taskID, waveformSettings }) => {
  const $footer = useRef();
  const classes = AudioTranscriptionLandingStyle();
console.log(taskID,"taskDatataskData")
  const player = useSelector((state) => state.commonReducer.player);

  const [waveform, setWaveform] = useState();
  const [render, setRender] = useState({
    padding: 2,
    duration: 10,
    gridGap: 10,
    gridNum: 110,
    beginTime: -5,
  });

  const onWheel = useCallback(
    (event) => {
      if (
        !player ||
        !waveform ||
        player.playing ||
        !$footer.current ||
        !$footer.current.contains(event.target)
      ) {
        return;
      }

      const deltaY = Math.sign(event.deltaY) / 5;
      const currentTime = clamp(
        player.currentTime + deltaY,
        0,
        player.duration
      );
      player.currentTime = currentTime;
      waveform.seek(currentTime);
    },
    [waveform, player, $footer]
  );

  useEffect(() => {
    const onWheelThrottle = throttle(onWheel, 100);
    window.addEventListener("wheel", onWheelThrottle);
    return () => window.removeEventListener("wheel", onWheelThrottle);
  }, [onWheel]);

  return (
    <Box className={classes.timeLineParent} ref={$footer}>
      {player &&
          (
          <>
            <Progress waveform={waveform} currentTime={currentTime} taskId={taskID}/>
            <Duration currentTime={currentTime} />
            <WaveForm setWaveform={setWaveform} setRender={setRender} waveformSettings={waveformSettings} />
            <Grab waveform={waveform} />
            <Metronome render={render} playing={playing} />
            <SubtitleBoxes
              render={render}
              playing={playing}
              currentTime={currentTime}
            />
          </>
        )}
    </Box>
  );
};

export default memo(Timeline);
