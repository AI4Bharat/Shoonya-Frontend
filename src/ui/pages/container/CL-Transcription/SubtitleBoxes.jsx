import React, {
    useEffect,
    useCallback,
    useState,
    createRef,
    memo,
  } from "react";
  import isEqual from "lodash/isEqual";
  import DT from "duration-time-conversion";
  import { useParams } from "react-router-dom";
  import { useDispatch, useSelector } from "react-redux";
  import {
    copySubs,
    getKeyCode,
    hasSub,
    isPlaying,
    onMerge,
    onSubtitleDelete,
  } from "../../../../utils/SubTitlesUtils";
  
  //Styles
  import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
  
  //Components
  import {
    ContextMenu,
    MenuItem,
    ContextMenuTrigger,
    connectMenu,
  } from "react-contextmenu";
  import  CustomizedSnackbars  from "../../component/common/Snackbar";
  
  //APIs
  import C from "../../../../redux/constants";
  import {
    setSubtitles,
  } from "../../../../redux/actions/Common";

  
  function magnetically(time, closeTime) {
    if (!closeTime) return time;
    if (time > closeTime - 0.02 && closeTime + 0.02 > time) {
      return closeTime;
    }
    return time;
  }
  
  let lastTarget = null;
  let lastSub = null;
  let lastType = "";
  let lastX = 0;
  let lastIndex = -1;
  let lastWidth = 0;
  let lastDiffX = 0;
  let isDroging = false;
  let playUntil = 0;
  
  export default memo(
    function ({ render, currentTime, duration }) {
      const { taskId } = useParams();
      const classes = AudioTranscriptionLandingStyle();
      const dispatch = useDispatch();
  
      const $blockRef = createRef();
      const $subsRef = createRef();
      const result = useSelector((state) => state.commonReducer?.subtitles);
      const player = useSelector((state) => state.commonReducer?.player);
      const AnnotationsTaskDetails = useSelector(
        (state) => state.getAnnotationsTask?.data
      );

      const [taskData, setTaskData] = useState([]);
      const [currentSubs, setCurrentSubs] = useState([]);
      const [textBox, settextBox] = useState("");
      const [speakerBox, setSpeakerBox] = useState("");
      const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });
  
      useEffect(() => {
        if (result) {
          setCurrentSubs(result);
        }
      }, [result]);

  
      const gridGap = document.body.clientWidth / render.gridNum;
      const currentIndex = currentSubs?.findIndex(
        (item) => item.startTime <= currentTime && item.endTime > currentTime
      );
     const AnnotationStage = localStorage.getItem("Stage") === "annotation"
     const SuperCheckerStage = localStorage.getItem("SuperCheckerStage") === "superChecker"

     useEffect(() => {
      const hasEmptyText = result?.some((element) => element.text?.trim() === "");
      const hasEmptySpeaker = result?.some(
        (element) => element.speaker_id?.trim() === ""
      );
      settextBox(hasEmptyText);
      setSpeakerBox(hasEmptySpeaker);
    }, [result]);

     useEffect(()=>{
      if(AnnotationStage){
        let Annotation = AnnotationsTaskDetails.filter(
          (annotation) => annotation.annotation_type === 1
        )[0]
        setTaskData(Annotation)
      }else if(SuperCheckerStage){
        let superchecker = AnnotationsTaskDetails.filter(
          (annotation) => annotation.annotation_type === 3
        )[0]
        setTaskData(superchecker)
       } else{
        let review = AnnotationsTaskDetails.filter(
          (annotation) => annotation.annotation_type === 2
        )[0]
        setTaskData(review)
      }
     },[AnnotationsTaskDetails])

     
      const removeSub = useCallback(
        (sub) => {
          const index = hasSub(sub);
          const res = onSubtitleDelete(index);
          dispatch(setSubtitles(res, C.SUBTITLES));
        },
        // eslint-disable-next-line
        [result]
      );
  
      const mergeSub = useCallback(
        (sub) => {
          const index = hasSub(sub);
          const res = onMerge(index);
          dispatch(setSubtitles(res, C.SUBTITLES));
        },
        // eslint-disable-next-line
        [result]
      );
    
      const updateSub = useCallback(
        (sub, obj) => {
          const index = hasSub(sub);
          const copySub = [...result];
  
          if (index < 0) return;
  
          Object.assign(sub, obj);
  
          copySub[index] = sub;
          dispatch(setSubtitles(copySub, C.SUBTITLES));
        },
        // eslint-disable-next-line
        [result]
      );
  
      const onMouseDown = (sub, event, type) => {
        lastSub = sub;
        if (event.button !== 0) return;
        isDroging = true;
        lastType = type;
        lastX = event.pageX;
        lastIndex = result?.indexOf(sub);
        lastTarget = $subsRef.current.children[lastIndex];
        lastWidth = parseFloat(lastTarget?.style.width);
      };
  
  
      const onDocumentMouseMove = useCallback((event) => {
        if (isDroging && lastTarget) {
          lastDiffX = event.pageX - lastX;
          if (lastType === "left") {
            lastTarget.style.width = `${lastWidth - lastDiffX}px`;
            lastTarget.style.transform = `translate(${lastDiffX}px)`;
          } else if (lastType === "right") {
            lastTarget.style.width = `${lastWidth + lastDiffX}px`;
          } else {
            lastTarget.style.transform = `translate(${lastDiffX}px)`;
          }
        }
      }, []);
  
      const onDocumentMouseUp = useCallback(() => {
        if (isDroging && lastTarget && lastDiffX) {
          const timeDiff = lastDiffX / gridGap / 10;
          const index = hasSub(lastSub);
          const previou = result[index - 1];
          const next = result[index + 1];
  
          const startTime = magnetically(
            lastSub.startTime + timeDiff,
            previou ? previou.endTime : null
          );
          const endTime = magnetically(
            lastSub.endTime + timeDiff,
            next ? next.startTime : null
          );
          const width = (endTime - startTime) * 10 * gridGap;
  
          if (lastType === "left") {
            if (lastSub.endTime - startTime >= 0.2) {
              const start_time = DT.d2t(Math.max(0, startTime));
  
              if (index > 0 && startTime >= DT.t2d(previou.end_time)) {
                updateSub(lastSub, { start_time });
              }
  
              if (index === 0) {
                updateSub(lastSub, { start_time });
              }
            } else {
              lastTarget.style.width = `${width}px`;
            }
          } else if (lastType === "right") {
            if (endTime >= 0 && endTime - lastSub.startTime >= 0.2) {
              const end_time = DT.d2t(Math.min(endTime, duration));
  
              if (index >= 0 && index !== result.length - 1 && endTime <= DT.t2d(next.start_time)) {
                updateSub(lastSub, { end_time });
              }
              
              if(index === result.length - 1) {
                updateSub(lastSub, { end_time });
              }
            } else {
              lastTarget.style.width = `${width}px`;
            }
          } else {
            if (startTime > 0 && endTime > 0 && endTime - startTime >= 0.2) {
              const start_time = DT.d2t(startTime);
              const end_time = DT.d2t(endTime);
              if (result.length > 1 ) {
                if (
                  index > 0  && index !== result.length- 1 &&
                  startTime >= DT.t2d(previou?.end_time) &&
                  endTime <= DT.t2d(next?.start_time) 
                ) {
                  updateSub(lastSub, {
                    start_time,
                    end_time,
                  });
                }
  
                if (index === 0 && endTime <= DT.t2d(next.start_time)) {
                  updateSub(lastSub, {
                    start_time,
                    end_time,
                  });
                }
                if (index === result.length- 1 && startTime >= DT.t2d(previou?.end_time) ) {
                  updateSub(lastSub, {
                    start_time,
                    end_time,
                  });
                }
              } 
              else {
                updateSub(lastSub, {
                  start_time,
                  end_time,
                });
              }
            } 
          }
          lastTarget.style.transform = `translate(0)`;
          lastTarget.style.width = `${width}px`;
        }
  
        lastType = "";
        lastX = 0;
        lastWidth = 0;
        lastDiffX = 0;
        isDroging = false;
      }, [gridGap, result, updateSub]);
  
      const onKeyDown = useCallback(
        (event) => {
          const copySub = copySubs();
  
          const sub = copySub[lastIndex];
          if (sub && lastTarget) {
            const keyCode = getKeyCode(event);
  
            switch (keyCode) {
              case 37:
                updateSub(sub, {
                  start_time: DT.d2t(sub?.startTime - 0.1),
                  end_time: DT.d2t(sub?.endTime - 0.1),
                });
                // player.currentTime = sub.startTime - 0.1;
                break;
              case 39:
                updateSub(sub, {
                  start_time: DT.d2t(sub?.startTime + 0.1),
                  end_time: DT.d2t(sub?.endTime + 0.1),
                });
                // player.currentTime = sub.startTime + 0.1;
                break;
              case 8:
              case 46:
                removeSub(sub);
                break;
              default:
                break;
            }
          }
        },
        // eslint-disable-next-line
        [player, removeSub, updateSub]
      );
 
      const DynamicMenu = (props) => {
        const { id, trigger } = props;
        return (
          <ContextMenu id={id} className={classes.menuItemNav}>
              <MenuItem
                className={classes.menuItem}
                onClick={() => removeSub(lastSub)}
              >
                Delete Subtitle
              </MenuItem>
            {trigger &&
              trigger.parentSub !== result[result.length - 1] && (
                <MenuItem
                  className={classes.menuItem}
                  onClick={() => mergeSub(lastSub)}
                >
                  Merge Next
                </MenuItem>
              )}
          </ContextMenu>
        );
      };
  
      const ConnectedMenu = connectMenu("contextmenu")(DynamicMenu);
  
      useEffect(() => {
        document.addEventListener("mousemove", onDocumentMouseMove);
        document.addEventListener("mouseup", onDocumentMouseUp);
        window.addEventListener("keydown", onKeyDown);
        return () => {
          document.removeEventListener("mousemove", onDocumentMouseMove);
          document.removeEventListener("mouseup", onDocumentMouseUp);
          window.removeEventListener("keydown", onKeyDown);
        };
      }, [onDocumentMouseMove, onDocumentMouseUp, onKeyDown]);
  
      const attributes = {
        className: classes.contextMenu,
      };

      const handleDoubleClick = (sub) => {
        if (!player) return;
        playUntil = sub.endTime;
        player.currentTime = sub.startTime;
        player.play();
        player.addEventListener("timeupdate", onTimeUpdate);
        player.addEventListener("pause", onPause);
        return () => {
          player.removeEventListener("timeupdate", onTimeUpdate);
          player.removeEventListener("pause", onPause);
        };
      };

      const onTimeUpdate = () => {
        if(playUntil && player.currentTime >= playUntil) {
          playUntil = 0;
          player.pause();
          player.removeEventListener("timeupdate", onTimeUpdate);
          player.removeEventListener("pause", onPause);
        }
      };
      const onPause = () => {
        playUntil = 0;
        player.removeEventListener("timeupdate", onTimeUpdate);
        player.removeEventListener("pause", onPause);
      };
  
      const renderSnackBar = () => {
        return (
          <CustomizedSnackbars
            open={snackbar.open}
            handleClose={() =>
              setSnackbarInfo({ open: false, message: "", variant: "" })
            }
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            variant={snackbar.variant}
            message={snackbar.message}
          />
        );
      };

      return (
        <div className={classes.parentSubtitleBox} ref={$blockRef}>
          {renderSnackBar()}
          <div ref={$subsRef}>
            {currentSubs?.map((sub, key) => {
              return (
                <div
                  className={`${classes.subItem} ${
                    key === currentIndex ? classes.subHighlight : ""
                  } `}
                  key={key}
                  style={{
                    left:
                      render.padding * gridGap +
                      (sub.startTime - render.beginTime) * gridGap * 10,
                    width: (sub.endTime - sub.startTime) * gridGap * 10,
                  }}
                  onDoubleClick={() => handleDoubleClick(sub)}
                >
                  
                  <ContextMenuTrigger
                    id="contextmenu"
                    holdToDisplay={-1}
                    parentSub={sub}
                    collect={(props) => props}
                    attributes={attributes}
                  >
                    <div
                      className={classes.subHandle}
                      style={{
                        left: 0,
                        width: 10,
                      }}
                      onMouseDown={(event) => onMouseDown(sub, event, "left")}
                    ></div>
  
                    <div
                      className={classes.subText}
                      title={sub.text}
                      style = {{
                        backgroundColor: sub.speaker_id === "Speaker 1"
                        ? "rgb(0, 87, 158, 0.2)"
                        : sub.speaker_id === "Speaker 0"
                        ? "rgb(123, 29, 0, 0.2)"
                        : "rgb(0, 0, 0, 0.6)",
                        border: sub.speaker_id === "Speaker 1"
                        ? "0.5px solid rgb(0, 87, 158, 1)"
                        : sub.speaker_id === "Speaker 0"
                        ? "0.5px solid rgb(123, 29, 0, 1)"
                        : "0.5px solid rgb(0, 0, 0, 1)",
                      }
                    }
                      onMouseDown={(event) => onMouseDown(sub, event)}
                    >
                      <p className={classes.subTextP}>
                        {sub.text}
                      </p>
                     
                    </div>
  
                    <div
                      className={classes.subHandle}
                      style={{
                        right: 0,
                        width: 10,
                      }}
                      onMouseDown={(event) => onMouseDown(sub, event, "right")}
                    ></div>
                    <div className={classes.subDuration}>{sub.duration}</div>
                  </ContextMenuTrigger>
                </div>
              );
            })}
          </div>
          <ConnectedMenu />
        </div>
      );
    },
    (prevProps, nextProps) => {
      return (
        isEqual(prevProps.result, nextProps.result) &&
        isEqual(prevProps.render, nextProps.render) &&
        prevProps.currentTime === nextProps.currentTime
      );
    }
  );
  