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
import { Box, IconButton, Tooltip, Typography, Grid } from "@mui/material";
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

const AudioTranscriptionLandingPage = () => {
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


  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  let labellingMode = localStorage.getItem("labellingMode");
  const subs = useSelector((state) => state.commonReducer.subtitles);
  const subtitles = useSelector((state) => state.commonReducer.subtitles);

  const AnnotationsTaskDetails = useSelector(
    (state) => state.getAnnotationsTask.data
  );
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const getNextTask = useSelector((state) => state.getnextProject.data);
 

  const player = useSelector((state) => state.commonReducer.player);
  const ref = useRef(0);
  const saveIntervalRef = useRef(null);
  const timeSpentIntervalRef = useRef(null);
  const transcriptPayload = [];
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

  useEffect(() => {
    if (location.pathname === `projects/${projectId}/task/${taskId}`) {
      localStorage.setItem("enableChitrlekhaUI", false);
    } else {
      localStorage.setItem("enableChitrlekhaUI", true);
    }
  });

  const getTaskData = () => {
    // setLoading(true);
    const userObj = new GetTaskDetailsAPI(taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getTaskData();
  }, []);



  useEffect(() => {
    const handleAutosave = (id) => {
      const reqBody = {
        task_id: taskId,
        annotation_status:AnnotationsTaskDetails[0]?.annotation_status,
        cl_format: true,
        // offset: currentPage,
        // limit: limit,
        payload: {
          payload: subs,
        },
      };

      const obj = new SaveTranscriptAPI(AnnotationsTaskDetails[0]?.id, reqBody);
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
  }, [subs, taskId, AnnotationsTaskDetails]);

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
    const sub = AnnotationsTaskDetails[0]?.result.map(
      (item) => new Sub(item)
    );

    console.log("bhjb");
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
  }, [AnnotationsTaskDetails[0]?.result]);

  useMemo(() => {
    const currentIndex = subs?.findIndex(
      (item) => item.startTime <= currentTime && item.endTime > currentTime
    );
    setCurrentIndex(currentIndex);
  }, [currentTime, subs]);

  useMemo(() => {
    subs && setCurrentSubs(subs[currentIndex]);
  }, [subs, currentIndex]);

  const getAnnotationsTaskData = () => {
    setLoading(true);
    const userObj = new GetAnnotationsTaskAPI(taskId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getAnnotationsTaskData();
    getProjectDetails();
  }, []);

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    if (AnnotationsTaskDetails.length > 0) {
      setLoading(false);    }
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
    const ProjectObj = new GetNextProjectAPI(projectId, nextAPIData);
    dispatch(APITransport(ProjectObj));
    const res = await fetch(ProjectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(ProjectObj.getBody()),
      headers: ProjectObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      tasksComplete(resp?.id || null);
      // getAnnotationsTaskData();
      // getTaskData();
      // window.location.reload();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setLoading(false);
  };

  const handleAnnotationClick = async (value, id, lead_time,annotationNotesValue) => {
    setLoading(true);
      const PatchAPIdata = {
      annotation_status: value,
      annotation_notes: annotationNotesValue,
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result: [{}],
    };
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
        onNextAnnotation();
      }
      setSnackbarInfo({
        open: true,
        message:"success",
        variant: "error",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setLoading(false);
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
          <Box
            // style={{ height: videoDetails?.video?.audio_only ? "100%" : "" }}
            className={classes.videoBox}
          >
            {/* <Box
              className={classes.videoNameBox}
              // style={fullscreenVideo ? { width: "60%", margin: "auto" } : {}}
            >
              <Tooltip placement="bottom">
                <Typography
                  variant="h4"
                  className={classes.videoName}
                  // style={fullscreenVideo ? { color: "white" } : {}}
                >
                  Audio Name
                </Typography>
              </Tooltip>

              <Tooltip title="Settings" placement="bottom">
                <IconButton
                  style={{
                    backgroundColor: "#2C2799",
                    borderRadius: "50%",
                    color: "#fff",
                    margin: "auto",
                    "&:hover": {
                      backgroundColor: "#271e4f",
                    },
                  }}
                  // className={classes.settingsIconBtn}
                  // onClick={(event) => setAnchorElSettings(event.currentTarget)}
                >
                  <WidgetsOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box> */}
            <AudioName />

            {/* <VideoPanel
        setCurrentTime={setCurrentTime}
        setPlaying={setPlaying}
      /> */}
            {/* <button onClick={datavalue}>gggggggg</button> */}
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
            />
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
