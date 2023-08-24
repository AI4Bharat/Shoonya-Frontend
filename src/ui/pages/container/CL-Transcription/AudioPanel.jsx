import React, { useRef, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isPlaying } from "../../../../utils/utils";
import { useParams } from "react-router-dom";
import { Typography, Grid, Button, TextField } from "@mui/material";
import AnnotationStageButtons from "../../component/CL-Transcription/AnnotationStageButtons";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//APIs
import { setPlayer } from "../../../../redux/actions/Common";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const AudioPanel = ({
  setCurrentTime,
  setPlaying,
  handleAnnotationClick,
  onNextAnnotation,
}) => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const $audio = useRef();
  const { taskId } = useParams();

  const [poster, setPoster] = useState(false);
  const [disableBtns, setDisableBtns] = useState(false);
  const [filterMessage, setFilterMessage] = useState("testing");
  const [showNotes, setShowNotes] = useState(false);
  const [annotationNotesValue, setAnnotationNotesValue] = useState("");
  const [reviewNotesValue, setReviewNotesValue] = useState("");
  const [value, setvalue] = useState("");
  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask.data
  );

  // const [currentTime, setCurrentTime] = useState([]);
  // const [playing, setPlaying] = useState([]);
  //   const videoDetails = useSelector((state) => state.getVideoDetails.data);
  //   const fullscreenVideo = useSelector(
  //     (state) => state.commonReducer.fullscreenVideo
  //   );
  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
  const TaskDetails = useSelector((state) => state.getTaskDetails.data);
  const getTaskData = () => {
    // setLoading(true);
    const userObj = new GetTaskDetailsAPI(taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getTaskData();
  }, []);

  useEffect(() => {
    if (AnnotationsTaskDetails.length > 0)
      setReviewNotesValue(AnnotationsTaskDetails[0]?.review_notes);
  }, [AnnotationsTaskDetails]);

  useEffect(() => {
    setvalue(annotationNotesValue);
  }, [annotationNotesValue]);

  useEffect(() => {
    dispatch(setPlayer($audio.current));
    (function loop() {
      window.requestAnimationFrame(() => {
        if ($audio.current) {
          setPlaying(isPlaying($audio.current));
          setCurrentTime($audio.current.currentTime || 0);
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

  console.log(
    reviewNotesValue,
    
    
  );
  return (
    <div style={{ padding: "0px 20px 0px 20px" }}>
      <AnnotationStageButtons
        handleAnnotationClick={handleAnnotationClick}
        onNextAnnotation={onNextAnnotation}
        disableBtns={disableBtns}
        setDisableBtns={setDisableBtns}
        filterMessage={filterMessage}
        setFilterMessage={setFilterMessage}
        annotationNotesValue={annotationNotesValue}
        value={value}
      />
      {/* <Typography variant="h5" sx={{ pb: 1, pl: 2 }}>
          Speaker Details
        </Typography>

        <Typography variant="body2" sx={{ pl: 2 }}>
          {TaskDetails?.data?.speaker_1_details}
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          {TaskDetails?.data?.speaker_0_details}
        </Typography> */}
      <div className={classes.videoPlayerParent} style={{ display: "flex" }}>
        <audio
          // onClick={onClick}
          controls
          src={TaskDetails?.data?.audio_url}
          type="audio"
          // style={{
          //   width: videoDetails?.video?.audio_only ? "20%" : "",
          //   margin:
          //     videoDetails?.video?.audio_only || fullscreenVideo ? "auto" : "",
          // }}
          // poster={videoDetails?.video?.audio_only ? poster : ""}
          ref={$audio}
          className={classes.videoPlayer}
        />
      </div>
      <Button
        endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        variant="contained"
        color={
          reviewNotesValue !== null && reviewNotesValue !== ""
            ? "success"
            : "primary"
        }
        onClick={handleCollapseClick}
        style={{ marginBottom: "10px" }}
      >
        Notes
        {reviewNotesValue !== null && reviewNotesValue !== "" && "*"}
      </Button>
      <div
        className={classes.collapse}
        style={{
          display: showNotes ? "block" : "none",
          paddingBottom: "16px",
        }}
      >
        {/* <Alert severity="warning" showIcon style={{marginBottom: '1%'}}>
              {translate("alert.notes")}
          </Alert> */}
        <TextField
          multiline
          placeholder="Place your remarks here ..."
          label="Annotation Notes"
          value={annotationNotesValue}
          onChange={(event) => setAnnotationNotesValue(event.target.value)}
          // inputRef={annotationNotesRef}
          rows={1}
          maxRows={3}
          inputProps={{
            style: { fontSize: "1rem" },
          }}
          style={{ width: "99%" }}
        />
        <TextField
          multiline
          placeholder="Place your remarks here ..."
          label="Review Notes"
          value={reviewNotesValue}
          // onChange={(event) => setReviewNotesValue(event.target.value)}
          // inputRef={reviewNotesRef}
          rows={1}
          maxRows={3}
          inputProps={{
            style: { fontSize: "1rem" },
            readOnly: true,
          }}
          style={{ width: "99%", marginTop: "2%" }}
        />
      </div>
    </div>
  );
};

export default AudioPanel;
