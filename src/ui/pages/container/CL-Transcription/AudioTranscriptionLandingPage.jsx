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
import Sub from "../../../../utils/Sub";
import C from "../../../../redux/constants";
import SaveTranscriptAPI from "../../../../redux/actions/CL-Transcription/SaveTranscript";
import { setSubtitles } from "../../../../redux/actions/Common";
import PatchAnnotationAPI from "../../../../redux/actions/CL-Transcription/patchAnnotation";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetNextProjectAPI from "../../../../redux/actions/CL-Transcription/GetNextProject";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import AnnotationStageButtons from "../../component/CL-Transcription/AnnotationStageButtons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AudioTranscriptionLandingPage = () => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let location = useLocation();
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
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
  const [speakerBox, setSpeakerBox] = useState("");
  const [annotations, setAnnotations] = useState([]);
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdataButton, setDisableUpdataButton] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,   
    message: "",      
    variant: "success",
  });
  let labellingMode = localStorage.getItem("labellingMode");
  // const subs = useSelector((state) => state.commonReducer.subtitles);
  const result = useSelector((state) => state.commonReducer.subtitles);

  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask?.data
  );
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const player = useSelector((state) => state.commonReducer.player);
  const ref = useRef(0);
  const saveIntervalRef = useRef(null);
  const timeSpentIntervalRef = useRef(null);
  const user = useSelector((state) => state.fetchLoggedInUserData.data);

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

  const filterAnnotations = (annotations, user) => {
    let disableSkip = false;
    let disableUpdate = false;
    let disableDraft = false;
    let Message = "";
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && !annotation.parent_annotation
      );
    });
    let userAnnotationData = annotations.find(
      (annotation) => annotation.annotation_type === 2
    );

    if (userAnnotation) {
      if (userAnnotation.annotation_status === "labeled") {
        const superCheckedAnnotation = annotations.find(
          (annotation) => annotation.annotation_type === 3
        );
        let review = annotations.find(
          (annotation) =>
            annotation.parent_annotation === userAnnotation.id &&
            annotation.annotation_type === 2
        );
        if (
          superCheckedAnnotation &&
          ["draft", "skipped", "validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          filteredAnnotations = [superCheckedAnnotation];

          Message =
            "This is the Super Checker's Annotation in read only mode";

          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
        } else if (
          review &&
          ["skipped", "draft", "rejected", "unreviewed"].includes(
            review.annotation_status
          )
        ) {
          filteredAnnotations = [userAnnotation];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message = "This task is being reviewed by the reviewer";
        } else if (
          review &&
          [
            "accepted",
            "accepted_with_minor_changes",
            "accepted_with_major_changes",
          ].includes(review.annotation_status)
        ) {
          filteredAnnotations = [review];
          disableDraft = true;
          disableSkip = true;
          disableUpdate = true;
          Message =
            "This is the Reviewer's Annotation in read only mode";
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (
        userAnnotationData &&
        ["draft"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;

        Message =
          "Skip button is disabled, since the task is being reviewed";
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disableSkip = true;
        Message =
          "Skip button is disabled, since the task is being reviewed";
      } else {
        filteredAnnotations = [userAnnotation];
      }
      
    }else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
      disableDraft = true;
      disableSkip = true;
      disableUpdate = true;
    }

    setAnnotations(filteredAnnotations);
    setDisableBtns(disableDraft);
    setDisableUpdataButton(disableUpdate);
    setdisableSkipButton(disableSkip);
    setFilterMessage(Message);
    return [
      filteredAnnotations,
      disableDraft,
      disableSkip,
      disableUpdate,
      Message,
    ];
  };

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, user);
  }, [AnnotationsTaskDetails, user]);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
 

  useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text.trim() === "");
    const hasEmptySpeaker = result?.some(
      (element) => element.speaker_id.trim() === ""
    );
    settextBox(hasEmptyText);
    setSpeakerBox(hasEmptySpeaker);
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
    const handleAutosave = async(id) => {
      const reqBody = {
        task_id: taskId,
        annotation_status: AnnotationsTaskDetails[0]?.annotation_status,
        // cl_format: true,
        // offset: currentPage,
        // limit: limit,
        result,
      };

      const obj = new SaveTranscriptAPI(AnnotationsTaskDetails[0]?.id,reqBody);
      // dispatch(APITransport(obj));
     const res = await fetch(obj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(obj.getBody()),
        headers: obj.getHeaders().headers,
      });
      const resp = await res.json();
      if (!res.ok) {
        setSnackbarInfo({
          open: true,
          message: "Error in autosaving annotation",
          variant: "error",
        });
      } 
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
    const sub = annotations[0]?.result.map((item) => new Sub(item));

    // const newSub = cloneDeep(sub);

    // dispatch(setCurrentPage(transcriptPayload?.current));
    // dispatch(setNextPage(transcriptPayload?.next));
    // dispatch(setPreviousPage(transcriptPayload?.previous));
    // dispatch(setTotalPages(transcriptPayload?.count));
    // dispatch(setSubtitlesForCheck(newSub));
    // dispatch(setCompletedCount(transcriptPayload?.completed_count));
    // dispatch(setRangeStart(transcriptPayload?.start));
    // dispatch(setRangeEnd(transcriptPayload?.end));
    dispatch(setSubtitles(sub, C.SUBTITLES));

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
    const userObj = new GetAnnotationsTaskAPI(id ? id : taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getAnnotationsTaskData();
    getProjectDetails();
    getTaskData();
    localStorage.setItem("enableChitrlekhaUI", true);
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
      navigate(`/projects/${projectId}/AudioTranscriptionLandingPage/${id}`);
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
      mode: "annotation",
      annotation_status: labellingMode,
    };

    let apiObj = new GetNextProjectAPI(projectId, nextAPIData);
    var rsp_data = [];
    fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        rsp_data = await response.json();
        setLoading(false);
        if (response.ok) {
          setNextData(rsp_data);
          tasksComplete(rsp_data?.id || null);
          getAnnotationsTaskData(rsp_data.id);
        }
      })
      .catch((error) => {
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
  };

  const handleAnnotationClick = async (
    value,
    id,
    lead_time,
  ) => {
    setLoading(true);
    const PatchAPIdata = {
      annotation_status: value,
      annotation_notes: annotationNotesRef.current.value,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result: result,
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

        if (value === "labeled") {
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
    } else {
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
    setShowNotes(false);
  };


  useEffect(() => {
      if (AnnotationsTaskDetails &&  AnnotationsTaskDetails.length > 0) {
        annotationNotesRef.current.value = AnnotationsTaskDetails[0].annotation_notes ?? "";
        reviewNotesRef.current.value = AnnotationsTaskDetails[0].review_notes ?? "";
      }
  }, [AnnotationsTaskDetails]);

  const resetNotes = () => {
    setShowNotes(false);
    annotationNotesRef.current.value = "";
    reviewNotesRef.current.value = "";
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);

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
            sx={{ ml: 1 }}
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
            <AnnotationStageButtons
              handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              disableBtns={disableBtns}
              disableUpdataButton={disableUpdataButton}
              disableSkipButton={disableSkipButton}   
              filterMessage={filterMessage}
            />
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
            />

            <Grid sx={{ ml: 3 }}>
            <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color={
                reviewNotesRef.current?.value !== "" ? "success" : "primary"
              }
              onClick={handleCollapseClick}
            // style={{ marginBottom: "20px" }}
            >
              Notes {reviewNotesRef.current?.value !== "" && "*"}
            </Button>
          

          <div
              className={classes.collapse}    
              style={{
              display: showNotes ? "block" : "none",
              paddingBottom: "16px",
               
            }}
          >
                 <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Annotation Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={annotationNotesRef}
              rows={1}
              maxRows={3}
              inputProps={{
                style: { fontSize: "1rem" },
              }}
              style={{ width: "99%" }}
              // ref={quillRef}
            />

            <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Review Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={reviewNotesRef}
              rows={1}
              maxRows={3}
              inputProps={{
                style: { fontSize: "1rem" },
                readOnly: true,
              }}
              style={{ width: "99%", marginTop: "1%" }}
              // ref={quillRef}
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
export default AudioTranscriptionLandingPage;
