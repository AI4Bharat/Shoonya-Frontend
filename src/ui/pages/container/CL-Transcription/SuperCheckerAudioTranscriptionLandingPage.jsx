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
import SuperCheckerStageButtons from "../../component/CL-Transcription/SuperCheckerStageButtons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SuperCheckerAudioTranscriptionLandingPage = () => {
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
  const [annotations, setAnnotations] = useState([]);
  const [disableSkip, setdisableSkip] = useState(false);
  const[taskDetailList,setTaskDetailList] = useState("")
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [speakerBox, setSpeakerBox] = useState("");

  let labellingMode = localStorage.getItem("labellingMode");
  // const subs = useSelector((state) => state.commonReducer.subtitles);
  const result = useSelector((state) => state.commonReducer.subtitles);

  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask.data
  );
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const TaskDetails = useSelector((state) => state.getTaskDetails?.data);
  const player = useSelector((state) => state.commonReducer.player);
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  const ref = useRef(0);
  const saveIntervalRef = useRef(null);
  const timeSpentIntervalRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const superCheckerNotesRef = useRef(null);


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
    let disableSkip = false;
    let disableAutoSave = false;
    let filteredAnnotations = annotations;
    let userAnnotation = annotations.find((annotation) => {
      return (
        annotation.completed_by === user.id && annotation.parent_annotation
      );
    });
    if (userAnnotation) {
      if (userAnnotation.annotation_status === "unvalidated") {
        filteredAnnotations =
          userAnnotation.result.length > 0 &&
          !taskData?.revision_loop_count?.super_check_count
            ? [userAnnotation]
            : annotations.filter(
                (annotation) =>
                  annotation.id === userAnnotation.parent_annotation &&
                  annotation.annotation_type === 2
              );
      } else if (
        ["validated", "validated_with_changes", "draft"].includes(
          userAnnotation.annotation_status
        )
      ) {
        filteredAnnotations = [userAnnotation];
      } else if (
        userAnnotation.annotation_status === "skipped" ||
        userAnnotation.annotation_status === "rejected"
      ) {
        filteredAnnotations = annotations.filter(
          (value) => value.annotation_type === 2
        );
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 3);
      disableSkip = true;
    }
    setAnnotations(filteredAnnotations);
    setdisableSkip(disableSkip);
    return [filteredAnnotations, disableSkip, disableAutoSave];
  };

  useEffect(() => {
    filterAnnotations(AnnotationsTaskDetails, userData, TaskDetails);
  }, [AnnotationsTaskDetails, userData, TaskDetails]);
  console.log(disableSkip);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };


   useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text?.trim() === "");
    const hasEmptySpeaker = result?.some(
      (element) => element.speaker_id?.trim() === ""
    );
    settextBox(hasEmptyText);
    setSpeakerBox(hasEmptySpeaker);
  }, [result]);

  const getTaskData = async (id) => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(id?id:taskId);
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
    }else{setTaskDetailList(resp)}
    setLoading(false);
  };

  useEffect(() => {
    const handleAutosave = async(id) => {
      const reqBody = {
        task_id: taskId,
        annotation_status: AnnotationsTaskDetails[2]?.annotation_status,
        parent_annotation: AnnotationsTaskDetails[2]?.parent_annotation,
        auto_save :true,
        lead_time:
        (new Date() - loadtime) / 1000 + Number(AnnotationsTaskDetails[2]?.lead_time?.lead_time ?? 0),
        result,
      };

      const obj = new SaveTranscriptAPI(AnnotationsTaskDetails[2]?.id, reqBody);
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
    if (
      AnnotationsTaskDetails.some((obj) =>
        obj.result.every((item) => Object.keys(item).length === 0)
      )
    ) {
      const filteredArray = AnnotationsTaskDetails.filter((obj) =>
        obj?.result.some((item) => Object.keys(item).length > 0)
      );
      const sub = filteredArray[1]?.result?.map((item) => new Sub(item));
      dispatch(setSubtitles(sub, C.SUBTITLES));
    } else {
      const filteredArray = AnnotationsTaskDetails?.filter(
        (annotation) => annotation?.annotation_type === 3
      );
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
    const userObj = new GetAnnotationsTaskAPI(id ? id : taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
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
        `/projects/${projectId}/SuperCheckerAudioTranscriptionLandingPage/${id}`
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
      mode: "supercheck",
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
          getTaskData(rsp_data.id)
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

  const handleSuperCheckerClick = async (
    value,
    id,
    lead_time,
    parentannotation,
    reviewNotesValue,
  ) => {
    setLoading(true);
    const PatchAPIdata = {
      annotation_status: value,
      supercheck_notes: superCheckerNotesRef.current.value,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result,
      ...((value === "rejected" ||
        value === "validated" ||
        value === "avalidated_with_changes") && {
        parent_annotation: parentannotation,
      }),
    };
    if (!textBox && !speakerBox && result?.length>0) {
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

      if (value === "validated" || value === "validated_with_changes") {
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
      } else if(speakerBox) {
        setSnackbarInfo({
          open: true,
          message: "Please Select The Speaker",
          variant: "error",
        });
      }else{
        setSnackbarInfo({
          open: true,
          message: "Error in saving annotation",
          variant: "error",
        });
      }
    }
  
    setLoading(false);
    setShowNotes(false);
    setAnchorEl(null);
  };


  const setNotes = (taskData, annotations) => {
    if (annotations && annotations.length > 0) {
      let userAnnotation = annotations.find(
        (annotation) =>
          annotation?.completed_by === userData?.id &&
          annotation?.annotation_type === 3
      );
      if (userAnnotation) {
        let reviewAnnotation = annotations.find(
          (annotation) => annotation.id === userAnnotation?.parent_annotation
        );
        reviewNotesRef.current.value = reviewAnnotation?.review_notes ?? "";
        superCheckerNotesRef.current.value = userAnnotation?.supercheck_notes ?? "";
      } else {
        let reviewerAnnotations = annotations.filter(
          (value) => value?.annotation_type === 2
        );
        if (reviewerAnnotations.length > 0) {
          let correctAnnotation = reviewerAnnotations.find(
            (annotation) => annotation.id === taskData?.correct_annotation
          );

          if (correctAnnotation) {
            let superCheckerAnnotation = annotations.find(
              (annotation) =>
                annotation.parent_annotation === correctAnnotation.id
            );
            reviewNotesRef.current.value = correctAnnotation.review_notes ?? "";
            superCheckerNotesRef.current.value =
              superCheckerAnnotation.supercheck_notes ?? "";
          } else {
            let superCheckerAnnotation = annotations.find(
              (annotation) =>
                annotation.parent_annotation === reviewerAnnotations[0]?.id
            );
            reviewNotesRef.current.value =
              reviewerAnnotations[0]?.review_notes ?? "";
            superCheckerNotesRef.current.value =
              superCheckerAnnotation[0]?.supercheck_notes ?? "";
          }
        }
      }
    }
  };

  useEffect(()=>{
    setNotes(TaskDetails, AnnotationsTaskDetails);

  },[TaskDetails, AnnotationsTaskDetails]);

  const resetNotes = () => {
    setShowNotes(false);
    superCheckerNotesRef.current.value = "";
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
            <SuperCheckerStageButtons
              handleSuperCheckerClick={handleSuperCheckerClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              disableSkip={disableSkip}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              // handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              taskData={taskDetailList}
            />
            <Grid sx={{ ml: 3 }}>
            <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color={
                reviewNotesRef.current?.value !== "" ? "success" : "primary"
              }
              onClick={handleCollapseClick}
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
            {/* <Alert severity="warning" showIcon style={{marginBottom: '1%'}}>
              {translate("alert.notes")}
          </Alert> */}
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

            <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Super Checker Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={superCheckerNotesRef}
              InputLabelProps={{
                shrink: true,
              }}
              rows={1}
              maxRows={3}
              inputProps={{
                style: { fontSize: "1rem" },
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
            TaskDetails={taskDetailList}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline currentTime={currentTime} playing={playing} taskData={taskDetailList} />
      </Grid>
    </>
  );
};
export default SuperCheckerAudioTranscriptionLandingPage;
