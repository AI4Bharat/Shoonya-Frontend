import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DT from "duration-time-conversion";
import isEqual from "lodash/isEqual";
import { newSub } from "../../../../utils/SubTitlesUtils";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import { Box } from "@mui/material";

//APIs
import C from "../../../../redux/constants";
import {
    setSubtitles,
  } from "../../../../redux/actions/Common";

const findIndex = (subs, startTime) => {
  return subs.findIndex((item, index) => {
    return (
      (startTime >= item.endTime && !subs[index + 1]) ||
      (item.startTime <= startTime && item.endTime > startTime) ||
      (startTime >= item.endTime &&
        subs[index + 1] &&
        startTime < subs[index + 1].startTime)
    );
  });
};

export default React.memo(
  function Component({ render, playing }) {
    const classes = AudioTranscriptionLandingStyle();
    const dispatch = useDispatch();

    const [isDroging, setIsDroging] = useState(false);
    const [drogStartTime, setDrogStartTime] = useState(0);
    const [drogEndTime, setDrogEndTime] = useState(0);
    const gridGap = document.body.clientWidth / render.gridNum;

    const subtitles = useSelector((state) => state.commonReducer?.subtitles);
    const player = useSelector((state) => state.commonReducer?.player);

    const getEventTime = useCallback(
      (event) => {
        return (
          (event.pageX - render.padding * gridGap) / gridGap / 10 +
          render.beginTime
        );
      },
      [gridGap, render]
    );

    const onMouseDown = useCallback(
      (event) => {
        if (event.button !== 0) return;
        const clickTime = getEventTime(event);
        setIsDroging(true);
        setDrogStartTime(clickTime);
      },
      [getEventTime]
    );

    const onMouseMove = useCallback(
      (event) => {
        if (isDroging) {
          if (playing) player.pause();
          setDrogEndTime(getEventTime(event));
        }
      },
      [isDroging, playing, player, getEventTime]
    );

    const onDocumentMouseUp = useCallback(() => {
      if (isDroging) {
        if (
          drogStartTime > 0 &&
          drogEndTime > 0 &&
          drogEndTime - drogStartTime >= 0.2
        ) {
          let index;

          if (subtitles && subtitles.length) {
            index = findIndex(subtitles, drogStartTime) + 1;
          } else {
            index = 0;
          }

          const start_time = DT.d2t(drogStartTime);
          const end_time = DT.d2t(drogEndTime);

          const copySub = [...subtitles];

          copySub.splice(
            index,
            0,
            newSub({
              start_time,
              end_time,
              text: "",
              target_text: "",
              speaker_id: "",
            })
          );

          dispatch(setSubtitles(copySub, C.SUBTITLES));
        }
      }
      setIsDroging(false);
      setDrogStartTime(0);
      setDrogEndTime(0);

      // eslint-disable-next-line
    }, [isDroging, drogStartTime, drogEndTime, subtitles, newSub]);

    useEffect(() => {
      document.addEventListener("mouseup", onDocumentMouseUp);
      return () => document.removeEventListener("mouseup", onDocumentMouseUp);
    }, [onDocumentMouseUp]);

    return (
      <Box
        className={classes.Metronome}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        {player &&
        !playing &&
        drogStartTime &&
        drogEndTime &&
        drogEndTime > drogStartTime ? (
          <Box
            className={classes.template}
            style={{
              left:
                render.padding * gridGap +
                (drogStartTime - render.beginTime) * gridGap * 10,
              width: (drogEndTime - drogStartTime) * gridGap * 10,
            }}
          ></Box>
        ) : null}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.subtitle, nextProps.subtitle) &&
      isEqual(prevProps.render, nextProps.render)
    );
  }
);
