// AudioTranscriptionLandingPage

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import Timeline from "./TimeLine";
import AudioPanel from "./AudioPanel";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Spinner from "../../component/common/Spinner";
import AudioName from "./AudioName";
import Sub from "../../../../utils/Sub";
import C from "../../../../redux/constants";
import SaveTranscriptAPI from "../../../../redux/actions/CL-Transcription/SaveTranscript";
import { setSubtitles } from "../../../../redux/actions/Common";
import PatchAnnotationAPI from "../../../../redux/actions/CL-Transcription/patchAnnotation";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetNextProjectAPI from "../../../../redux/actions/CL-Transcription/GetNextProject";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import ReviewStageButtons from "../../component/CL-Transcription/ReviewStageButtons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ReviewAudioTranscriptionLandingPage = () => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentSubs, setCurrentSubs] = useState();
  const [loadtime, setloadtime] = useState(new Date());
  const [textBox, settextBox] = useState("");
  const [NextData, setNextData] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [reviewNotesValue, setReviewNotesValue] = useState(null);
  const [annotationNotesValue, setAnnotationNotesValue] = useState(null);
  const [superCheckerNotesValue, setsuperCheckerNotesValue] = useState(null);
  const [disableSkip, setdisableSkip] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [speakerBox, setSpeakerBox] = useState("");


  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  let labellingMode = localStorage.getItem("labellingMode");
  // const subs = useSelector((state) => state.commonReducer.subtitles);
  const result = useSelector((state) => state.commonReducer.subtitles);

  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask.data
  );
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const getNextTask = useSelector((state) => state.getnextProject.data);
  const TaskDetails = useSelector((state) => state.getTaskDetails.data);
  const user = useSelector((state) => state.fetchLoggedInUserData.data);
  const player = useSelector((state) => state.commonReducer.player);
  const ref = useRef(0);
  const saveIntervalRef = useRef(null);
  const timeSpentIntervalRef = useRef(null);

  const resetNotes = () => {
    setShowNotes(false);
    setReviewNotesValue("");
    setAnnotationNotesValue("");
    setsuperCheckerNotesValue("")
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  // useEffect(() => {
  //   let intervalId;

  //   const updateTimer = () => {
  //     ref.current = ref.current + 1;
  //   };

  //   intervalId = setInterval(updateTimer, 1000);

  //   setInterval(() => {
  //     clearInterval(intervalId);
  //     ref.current = 0;

  //     intervalId = setInterval(updateTimer, 1000);
  //   }, 60 * 1000);

  //   return () => {
  //     const apiObj = new UpdateTimeSpentPerTask(taskId, ref.current);
  //     dispatch(APITransport(apiObj));
  //     clearInterval(intervalId);
  //     ref.current = 0;
  //   };
  // }, []);

  const filterAnnotations = (annotations, user, taskData) => {
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && annotation.parent_annotation
      );
    });
    let disable = false;
    let disableSkip = false;
    let disablebtn = false;
    let disableButton = false;
    let filterMessage = "";
    let userAnnotationData = annotations.find(
      (annotation) => annotation.annotation_type === 3
    );
    if (userAnnotation) {
      if (userAnnotation.annotation_status === "unreviewed") {
        filteredAnnotations =
          userAnnotation.result.length > 0 &&
          !taskData?.revision_loop_count?.review_count
            ? [userAnnotation]
            : annotations.filter(
                (annotation) =>
                  annotation.id === userAnnotation.parent_annotation &&
                  annotation.annotation_type === 1
              );
        console.log(
          filteredAnnotations,
          "filteredAnnotationsfilteredAnnotations"
        );
      } else if (
        userAnnotation &&
        ["rejected"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        disableButton = true;
        filterMessage =
          "Revise and Skip buttons are disabled, since the task is being validated by the super checker";
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        disableButton = true;
        filterMessage =
          "Revise and Skip buttons are disabled, since the task is being validated by the super checker";
      } else if (userAnnotation.annotation_status === "draft") {
        filteredAnnotations = [userAnnotation];
      } else if (
        [
          "accepted",
          "accepted_with_minor_changes",
          "accepted_with_major_changes",
        ].includes(userAnnotation.annotation_status)
      ) {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3
        );
        if (
          superCheckedAnnotation &&
          ["validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];
          filterMessage =
            "This is the Super Checker's Annotation in read only mode";

          disablebtn = true;
          disable = true;
          disableSkip = true;
        } else if (
          superCheckedAnnotation &&
          ["draft", "skipped", "unvalidated"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [userAnnotation];
          filterMessage = "This task is being validated by the super checker";

          disablebtn = true;
          disable = true;
          disableSkip = true;
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (userAnnotation.annotation_status === "skipped") {
        filteredAnnotations = annotations.filter(
          (value) => value.annotation_type === 1
        );
      } else if (userAnnotation.annotation_status === "to_be_revised") {
        filteredAnnotations = annotations.filter(
          (annotation) =>
            annotation.id === userAnnotation.parent_annotation &&
            annotation.annotation_type === 1
        );
      } else if (userAnnotation.annotation_status === "rejected") {
        filteredAnnotations = annotations.filter(
          (annotation) => annotation.annotation_type === 2
        );
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 2);
      disable = true;
      disablebtn = true;
      disableSkip = true;
    }
    setdisableSkip(disableSkip);
    setDisableBtns(disablebtn);
    setDisableButton(disableButton);
    setFilterMessage(filterMessage);
    setAnnotations(filteredAnnotations);
    return [
      filteredAnnotations,
      disable,
      disableSkip,
      disablebtn,
      disableButton,
      filterMessage,
    ];
  };

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, user, TaskDetails);
  }, [AnnotationsTaskDetails, user, TaskDetails]);
  console.log(disableSkip, disableBtns, filterMessage, disableButton);

  useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text.trim() === "");
    const hasEmptySpeaker = result?.some(
      (element) => element.speaker_id.trim() === ""
    );
    settextBox(hasEmptyText);
    setSpeakerBox(hasEmptySpeaker);
  }, [result]);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
  useEffect(() => {
    if (AnnotationsTaskDetails.length > 0)
      setAnnotationNotesValue(AnnotationsTaskDetails[0]?.annotation_notes);
    setsuperCheckerNotesValue(AnnotationsTaskDetails[2]?.supercheck_notes);
  }, [AnnotationsTaskDetails]);

  useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text.trim() === "");
    settextBox(hasEmptyText);
  }, [result]);

  const getTaskData = async () => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(taskId);
    // dispatch(APITransport(ProjectObj));
    const res = await fetch(ProjectObj.apiEndPoint(), {
      method: "GET",
      body: JSON.stringify(ProjectObj.getBody()),
      headers: ProjectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (
      !res.ok ||
      resp?.data?.audio_url === "" ||
      resp?.data?.audio_url === null
    ) {
      setLoading(true);
      setSnackbarInfo({
        open: true,
        message: "Audio Server is down, please try after sometime",
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleAutosave = (id) => {
      const reqBody = {
        task_id: taskId,
        annotation_status: AnnotationsTaskDetails[1]?.annotation_status,
        parent_annotation:AnnotationsTaskDetails[1]?.parent_annotation,
        // cl_format: true,
        // offset: currentPage,
        // limit: limit,
        result,
      };

      const obj = new SaveTranscriptAPI(AnnotationsTaskDetails[1]?.id, reqBody);
      dispatch(APITransport(obj));
    };
    const handleUpdateTimeSpent = (time = 60) => {
      // const apiObj = new UpdateTimeSpentPerTask(taskId, time);
      // dispatch(APITransport(apiObj));
    };

    saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
    timeSpentIntervalRef.current = setInterval(
      handleUpdateTimeSpent,
      60 * 1000
    );

    const handleBeforeUnload = (event) => {
      handleAutosave();
      handleUpdateTimeSpent(ref.current);
      event.preventDefault();
      event.returnValue = "";
      ref.current = 0;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Add event listener for visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is active, restart the autosave interval
        saveIntervalRef.current = setInterval(handleAutosave, 60 * 1000);
        timeSpentIntervalRef.current = setInterval(
          handleUpdateTimeSpent,
          60 * 1000
        );
      } else {
        handleAutosave();
        handleUpdateTimeSpent(ref.current);
        // Tab is inactive, clear the autosave interval
        clearInterval(saveIntervalRef.current);
        clearInterval(timeSpentIntervalRef.current);
        ref.current = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(saveIntervalRef.current);
      clearInterval(timeSpentIntervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [result, taskId, AnnotationsTaskDetails]);

  // useEffect(() => {
  //   const apiObj = new FetchTaskDetailsAPI(taskId);
  //   dispatch(APITransport(apiObj));

  //   return () => {
  //     dispatch({ type: C.CLEAR_STATE, payload: [] });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  // useEffect(() => {
  //   if (AnnotationsTaskDetails && AnnotationsTaskDetails?.id) {
  //     const apiObj = new GetAnnotationsTaskAPI(
  //       // encodeURIComponent(AnnotationsTaskDetails.video_url.replace(/&amp;/g, "&")),
  //       // AnnotationsTaskDetails.src_language,
  //       // AnnotationsTaskDetails.project,
  //       // AnnotationsTaskDetails.is_audio_only
  //     );
  //     dispatch(APITransport(apiObj));

  //     (async () => {
  //       const payloadObj = new GetAnnotationsTaskAPI(
  //         AnnotationsTaskDetails.id,
  //         AnnotationsTaskDetails.task_type
  //       );
  //       dispatch(APITransport(payloadObj));
  //     })();
  //   }
  //   // eslint-disable-next-line
  // }, [AnnotationsTaskDetails]);

  useEffect(() => {
    if (
      AnnotationsTaskDetails.some((obj) =>
        obj.result.every((item) => Object.keys(item).length === 0)
      )
    ) {
      const filteredArray = AnnotationsTaskDetails.filter((obj) =>
        obj?.result.some((item) => Object.keys(item).length > 0)
      );
      const sub = filteredArray[0]?.result?.map((item) => new Sub(item));
      dispatch(setSubtitles(sub, C.SUBTITLES));
    } else {
      const sub = annotations[0]?.result?.map((item) => new Sub(item));
      dispatch(setSubtitles(sub, C.SUBTITLES));
    }

    // const newSub = cloneDeep(sub);

    // dispatch(setCurrentPage(transcriptPayload?.current));
    // dispatch(setNextPage(transcriptPayload?.next));      // dispatch(setPreviousPage(transcriptPayload?.previous));
    // dispatch(setTotalPages(transcriptPayload?.count));
    // dispatch(setSubtitlesForCheck(newSub));
    // dispatch(setCompletedCount(transcriptPayload?.completed_count));
    // dispatch(setRangeStart(transcriptPayload?.start));
    // dispatch(setRangeEnd(transcriptPayload?.end));

    // eslint-disable-next-line
  }, [annotations]);

  useMemo(() => {
    const currentIndex = result?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );
    setCurrentIndex(currentIndex);
  }, [currentTime, result]);

  useMemo(() => {
    result && setCurrentSubs(result[currentIndex]);
  }, [result, currentIndex]);

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    const userObj = new GetAnnotationsTaskAPI(id?id:taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getAnnotationsTaskData();
    getProjectDetails();
    getTaskData();
    localStorage.setItem("enableChitrlekhaUI", true);
    console.log(
      localStorage.getItem("Stage") === "review",
      "StageStageStageStage"
    );
  }, []);
  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  const tasksComplete = (id) => {
    if (id) {
      // resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(
        `/projects/${projectId}/ReviewAudioTranscriptionLandingPage/${id}`
      );
    } else {
      // navigate(-1);
      // resetNotes();
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
        window.location.reload();
      }, 1000);
    }
  };

  const onNextAnnotation = async (value) => {
    setLoading(true);
    const nextAPIData = {
      id: projectId,
      current_task_id: taskId,
      mode: "review",
      annotation_status: labellingMode,
    };

    let apiObj = new GetNextProjectAPI(projectId, nextAPIData)
    var rsp_data = []
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      rsp_data = await response.json();
      setLoading(false)
      if (response.ok) {
        setNextData(rsp_data);
        tasksComplete(rsp_data?.id || null);
        getAnnotationsTaskData(rsp_data.id);
       
      } 
    }).catch((error) => {
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
      }, 1000);
    });

  }

  const handleReviewClick = async (
    value,
    id,
    lead_time,
    reviewNotesValue,
    parentannotation
  ) => {
    setLoading(true);
    const PatchAPIdata = {
      annotation_status: value,
      review_notes: reviewNotesValue,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result,
      ...((value === "to_be_revised" ||value === "accepted" ||
        value === "accepted_with_minor_changes" ||
        value === "accepted_with_major_changes") && {
        parent_annotation: parentannotation,
      }),
    };
    if (!textBox && !speakerBox) {
    const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
    // dispatch(APITransport(GlossaryObj));
    const res = await fetch(TaskObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(TaskObj.getBody()),
      headers: TaskObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      if (localStorage.getItem("labelAll") || value === "skipped") {
        onNextAnnotation(resp.task);
      }

      if (
        value === "accepted" ||
        value === "accepted_with_minor_changes" ||
        value === "accepted_with_major_changes"
      ) {
        setSnackbarInfo({
          open: true,
          message: "Task successfully submitted",
          variant: "success",
        });
      } else if (value === "draft") {
        setSnackbarInfo({
          open: true,
          message: "Task saved as draft",
          variant: "success",
        });
      }
    } else {
      setSnackbarInfo({
        open: true,
        message: "Error in saving annotation",
        variant: "error",
      });
    }
  }else {
    if (textBox) {
      setSnackbarInfo({
        open: true,
        message: "Please Enter All The Transcripts",
        variant: "error",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: "Please Select The Speaker",
        variant: "error",
      });
    }
  }
    setLoading(false);
    setShowNotes(false)
    setAnchorEl(null)
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
    <>
      {loading && <Spinner />}
      {renderSnackBar()}
      <Grid container direction={"row"} className={classes.parentGrid}>
        <Grid md={6} xs={12} id="video" className={classes.videoParent}>
        <Button
          value="Back to Project"
          startIcon={<ArrowBackIcon />}
          variant="contained"
          color="primary"
          sx={{ml:1}}
          onClick={() => {
            localStorage.removeItem("labelAll");
            navigate(`/projects/${projectId}`);
            //window.location.replace(`/#/projects/${projectId}`);
            //window.location.reload();
          }}
        >
          Back to Project
        </Button>
          <Box
            // style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
            className={classes.videoBox}
          >
            <AudioName />
            <ReviewStageButtons
              handleReviewClick={handleReviewClick}
              onNextAnnotation={onNextAnnotation}
              reviewNotesValue={reviewNotesValue}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              filterMessage={filterMessage}
              disableSkip={disableSkip}
              disableBtns={disableBtns}
              disableButton={disableButton}
              anchorEl={anchorEl} setAnchorEl={setAnchorEl}
            />
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              // handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              setAnnotationNotesValue={setAnnotationNotesValue}
            />
            <Grid sx={{ ml: 3 }}>
              <Button
                endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color={
                  (annotationNotesValue !== "" &&
                    annotationNotesValue !== null) ||
                  (superCheckerNotesValue !== "" &&
                    superCheckerNotesValue !== null)
                    ? "success"
                    : "primary"
                }
                onClick={handleCollapseClick}
              >
                Notes{" "}
                {(annotationNotesValue !== "" &&
                  annotationNotesValue !== null) ||
                  (superCheckerNotesValue !== null &&
                    superCheckerNotesValue !== "" &&
                    "*")}
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
                  onChange={(event) =>
                    setAnnotationNotesValue(event.target.value)
                  }
                  //   inputRef={annotationNotesRef}
                  rows={1}
                  maxRows={3}
                  inputProps={{
                    style: { fontSize: "1rem" },
                    readOnly: true,
                  }}
                  style={{ width: "99%", marginTop: "1%" }}
                />
                <TextField
                  multiline
                  placeholder="Place your remarks here ..."
                  label="Review Notes"
                  value={reviewNotesValue}
                  onChange={(event) => setReviewNotesValue(event.target.value)}
                  //   inputRef={reviewNotesRef}
                  rows={1}
                  maxRows={3}
                  inputProps={{
                    style: { fontSize: "1rem" },
                  }}
                  style={{ width: "99%", marginTop: "1%" }}
                />
                <TextField
                  multiline
                  placeholder="Place your remarks here ..."
                  label="Super Checker Notes"
                  value={superCheckerNotesValue}
                  onChange={(event) =>
                    setsuperCheckerNotesValue(event.target.value)
                  }
                  //   inputRef={superCheckerNotesRef}
                  rows={1}
                  maxRows={3}
                  inputProps={{
                    style: { fontSize: "1rem" },
                    readOnly: true,
                  }}
                  style={{ width: "99%", marginTop: "1%" }}
                />
              </div>
            </Grid>
          </Box>
        </Grid>

        <Grid md={6} xs={12} sx={{ width: "100%" }}>
          <TranscriptionRightPanel
            currentIndex={currentIndex}
            AnnotationsTaskDetails={AnnotationsTaskDetails}
            player={player}
            ProjectDetails={ProjectDetails}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline currentTime={currentTime} playing={playing} />
      </Grid>
    </>
  );
};
export default ReviewAudioTranscriptionLandingPage;
