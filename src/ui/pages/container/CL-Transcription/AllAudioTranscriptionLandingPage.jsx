// AllAudioTranscriptionLandingPage
import ReactQuill from 'react-quill';
import "../../../../ui/pages/container/Label-Studio/cl_ui.css"
import 'quill/dist/quill.bubble.css';
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Button,
  Slider, Stack
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Timeline from "./TimeLine";
import AudioPanel from "./AudioPanel";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { isPlaying } from '../../../../utils/utils';
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../component/common/Spinner";
import Sub from "../../../../utils/Sub";
import C from "../../../../redux/constants";
import { setSubtitles } from "../../../../redux/actions/Common";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetNextProjectAPI from "../../../../redux/actions/CL-Transcription/GetNextProject";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';
import LightTooltip from "../../component/common/Tooltip";

const AllAudioTranscriptionLandingPage = () => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showNotes, setShowNotes] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [stdTranscription, setStdTranscription] = useState("");
  const [showStdTranscript, setShowStdTranscript] = useState(false);
  const [stdTranscriptionSettings, setStdTranscriptionSettings] = useState({
    enable: false,
    showAcoustic: false,
    rtl: false,
    enableTransliteration: false,
    enableTransliterationSuggestion: false,
    targetlang: "en",
    fontSize: "Normal"
  });
  const [annotationtext, setannotationtext] = useState('')
  const [reviewtext, setreviewtext] = useState('')
  const [taskData, setTaskData] = useState()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const result = useSelector((state) => state.commonReducer.subtitles);
  const AnnotationsTaskDetails = useSelector((state) => state.getAnnotationsTask?.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails?.data);
  const player = useSelector((state) => state.commonReducer.player);
  const user = useSelector((state) => state.fetchLoggedInUserData.data);
  const taskDetails = useSelector((state) => state.getTaskDetails?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const [advancedWaveformSettings, setAdvancedWaveformSettings] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(-2);

  const handleCollapseClick = () => {
    !showNotes && setShowStdTranscript(false);
    setShowNotes(!showNotes);
  };

  const getTaskData = async (id) => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(id);
    dispatch(APITransport(ProjectObj));
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
    } else {
      setTaskData(resp)
    }
    setLoading(false);
  };

  useEffect(() => {
    let standardisedTranscription = "";

    const sub = annotations[0]?.result.filter((item) => {
      if ("standardised_transcription" in item) {
        standardisedTranscription = item.standardised_transcription;
        return false;
      } else return true;
    }).map((item) => new Sub(item));

    setStdTranscription(standardisedTranscription);
    dispatch(setSubtitles(sub, C.SUBTITLES));
  }, [annotations]);

  useMemo(() => {
    const currentIndex = result?.findIndex(
      (item) => item?.startTime <= currentTime && item?.endTime > currentTime
    );
    setCurrentIndex(currentIndex);
  }, [currentTime, result]);

  const getAnnotationsTaskData = (id) => {
    setLoading(true);
    const userObj = new GetAnnotationsTaskAPI(id);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
  }, []);

  useEffect(() => {
    if (selectedUserId && [4, 5, 6].includes(user?.role)) {
      const userAnnotations = AnnotationsTaskDetails?.filter((item) => item.completed_by === selectedUserId);
      userAnnotations.length && setAnnotations(userAnnotations);
    }
  }, [selectedUserId]);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskDetails).then(res => {
        setAssignedUsers(res);
        setSelectedUserId(res[0]?.id);
      });
    }
    AnnotationsTaskDetails && taskDetails?.id && user?.id && showAssignedUsers();
  }, [taskDetails, user, AnnotationsTaskDetails]);

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
      setAnnotations(AnnotationsTaskDetails?.filter((item) => item.annotation_type === 1));
    }
  }, [AnnotationsTaskDetails]);

  /* useEffect(() => {
    if (Object.keys(user).includes("prefer_cl_ui") && !(user.prefer_cl_ui)) {
      navigate(`/projects/${projectId}/Alltask/${taskId}`);
    }
  }, [user]); */

  const tasksComplete = (id) => {
    if (id) {
      navigate(`/projects/${projectId}/AllAudioTranscriptionLandingPage/${id}`);
    } else {
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
          tasksComplete(rsp_data?.id || null);
          getAnnotationsTaskData(rsp_data?.id);
          getTaskData(rsp_data?.id)
        }
      })
      .catch((error) => {
        setSnackbarInfo({
          open: true,
          message: "No more tasks",
          variant: "info",
        });
        setTimeout(() => {
          localStorage.removeItem("labelAll");
          window.location.replace(`/#/projects/${projectId}`);
        }, 1000);
      });
  };

  useEffect(() => {
    if (AnnotationsTaskDetails && AnnotationsTaskDetails.length > 0) {
      annotationNotesRef.current.value = AnnotationsTaskDetails[0].annotation_notes ?? "";
      reviewNotesRef.current.value = AnnotationsTaskDetails[0].review_notes ?? "";
      try {
        const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
        annotationNotesRef.current.getEditor().setContents(newDelta2);
      } catch (err) {
        if (err) {
          const newDelta2 = annotationNotesRef.current.value;
          annotationNotesRef.current.getEditor().setText(newDelta2);
        }
      }

      try {
        const newDelta1 = reviewNotesRef.current.value != "" ? JSON.parse(reviewNotesRef.current.value) : "";
        reviewNotesRef.current.getEditor().setContents(newDelta1);
      } catch (err) {
        if (err) {
          const newDelta1 = reviewNotesRef.current.value;
          reviewNotesRef.current.getEditor().setText(newDelta1);
        }
      }
      setannotationtext(annotationNotesRef.current.getEditor().getText())
      setreviewtext(reviewNotesRef.current.getEditor().getText())
    }
  }, [AnnotationsTaskDetails]);

  const resetNotes = () => {
    setShowNotes(false);
    annotationNotesRef.current.getEditor().setContents([]);
    reviewNotesRef.current.getEditor().setContents([]);
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      // [{ 'color': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
    ]
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'script']


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
  }

  const [wave, setWave] = useState(true);
  const [waveColor, setWaveColor] = useState('rgba(156, 39, 176, 1)');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [paddingColor, setPaddingColor] = useState('#f2f2f2');
  const [cursor, setCursor] = useState(true);
  const [cursorColor, setCursorColor] = useState('#ff0000');
  const [progress, setProgress] = useState(true);
  const [progressColor, setProgressColor] = useState('rgba(0, 150, 136, 1)');
  const [grid, setGrid] = useState(false);
  const [gridColor, setGridColor] = useState('rgba(255, 255, 255, 0.05)');
  const [ruler, setRuler] = useState(true);
  const [rulerColor, setRulerColor] = useState('rgba(0, 0, 0, 1)');
  const [scrollbar, setScrollbar] = useState(true);
  const [scrollbarColor, setScrollbarColor] = useState('rgba(255, 255, 255, 0.25)');
  const [rulerAtTop, setRulerAtTop] = useState(true);
  const [scrollable, setScrollable] = useState(true);
  const [duration, setDuration] = useState(10);
  const [padding, setPadding] = useState(1);
  // const [pixelRatio, setPixelRatio] = useState(window.devicePixelRatio + 1);
  const [pixelRatio, setPixelRatio] = useState(Number(Math.ceil(window.devicePixelRatio)))
  const [waveScale, setWaveScale] = useState(1);
  const [waveSize, setWaveSize] = useState(1);
  const [wavWorker, setWavWorker] = useState(true);

  const [waveformSettings, setWaveformSettings] = useState({
    "wave": wave, "waveColor": waveColor, "backgroundColor": backgroundColor, "paddingColor": paddingColor,
    "cursor": cursor, "cursorColor": cursorColor, "progress": progress, "progressColor": progressColor, "grid": grid, "gridColor": gridColor, "ruler": ruler,
    "rulerColor": rulerColor, "scrollbar": scrollbar, "scrollbarColor": scrollbarColor, "rulerAtTop": rulerAtTop, "scrollable": scrollable, "duration": duration, "padding": padding,
    "pixelRatio": pixelRatio, "waveScale": waveScale, "waveSize": waveSize, "worker" : wavWorker
  });

  useEffect(() => {
    setWaveformSettings({
      "wave": wave, "waveColor": waveColor, "backgroundColor": backgroundColor, "paddingColor": paddingColor,
      "cursor": cursor, "cursorColor": cursorColor, "progress": progress, "progressColor": progressColor, "grid": grid, "gridColor": gridColor, "ruler": ruler,
      "rulerColor": rulerColor, "scrollbar": scrollbar, "scrollbarColor": scrollbarColor, "rulerAtTop": rulerAtTop, "scrollable": scrollable, "duration": duration, "padding": padding,
      "pixelRatio": pixelRatio, "waveScale": waveScale, "waveSize": waveSize, "worker" : wavWorker
  })
  }, [wave, waveColor, backgroundColor, paddingColor, cursor, cursorColor, progress, progressColor, grid, gridColor, ruler, rulerColor, scrollbar, scrollbarColor, rulerAtTop, scrollable, duration, padding, pixelRatio, waveScale, waveSize, wavWorker]);

  useEffect(() => {
    if (showNotes === true) {
      setAdvancedWaveformSettings(false);
    }
  }, [showNotes]);


  useEffect(() => {
    if (advancedWaveformSettings === true) {
      setShowNotes(false);
    }
  }, [advancedWaveformSettings]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key === ' ') {
        event.preventDefault();
        if (player) {
          if (isPlaying(player)) {
            player.pause();
          } else {
            player.play();
          }
        }
      }
      if (event.shiftKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        if (player) {
          player.currentTime = player.currentTime - 0.05;
        }
      }
      if (event.shiftKey && event.key === 'ArrowRight') {
        event.preventDefault();
        if (player) {
          player.currentTime = player.currentTime + 0.05;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player]);

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
            sx={{ ml: 1 ,mt:2}}
            onClick={() => {
              localStorage.removeItem("labelAll");
              navigate(`/projects/${projectId}`);
            }}
          >
            Back to Project
          </Button>
          <Box className={classes.videoBox}>
            <Typography sx={{ mt: 2, ml: 4, color: "grey" }}>
              Task #{taskDetails?.id}
              <LightTooltip
                disableFocusListener={true}
                title={assignedUsers ? 
                  <div style={{
                    display: "flex",
                    padding: "8px 0px",
                    flexDirection: "column",
                    gap: "4px",
                    alignItems: "flex-start"
                  }}>
                    {assignedUsers.map((u, idx) => u && 
                      <Button
                        style={{display: "inline", fontSize: 12, color: "black", border: selectedUserId === u.id ? "1px solid rgba(0, 0, 0, 0.2)" : "none"}}
                        onClick={() => setSelectedUserId(u.id)}>
                        {UserMappedByRole(idx + 1).element} {u.email}
                      </Button>
                    )}
                  </div>
                : ""}
              >
                <InfoOutlinedIcon sx={{ mb: "-4px", ml: "2px", color: "grey" }} />
              </LightTooltip>
            </Typography>
            <Grid container spacing={1} sx={{ mt: 2, mb: 3, ml: 3 }}>
              <Grid item>
                <Tooltip title="Go to next task">
                  <Button
                    value="Next"
                    type="default"
                    onClick={() => onNextAnnotation("next", getNextTask?.id)}
                    style={{
                      minWidth: "120px",
                      border: "1px solid gray",
                      color: "#09f",
                      pt: 2,
                      pb: 2,
                    }}
                  >
                    Next
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              taskData={taskData}
            />
            <Grid container spacing={1} sx={{ pt: 1, pl: 2, pr : 3}} justifyContent="flex-end">
             <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" justifyContent="flex-end" width="fit-content">
                <Typography fontSize={14} fontWeight={"medium"} color="#555">
                  Timeline Scale:
                </Typography>
                <Slider
                  sx={{
                    width: 140,
                  }}
                  color="primary"
                  aria-label="Scale"
                  min={2} max={player ? Math.floor(player.duration * 2) : 100} step={1}
                  value={duration}
                  onChange={(e) => {
                    setDuration(e.target.value);
                    player.currentTime += 0.01;
                    player.currentTime -= 0.01;
                  }}/>
              </Stack>
              <Stack spacing={2} direction="row" sx={{ mb: 1, ml: 3 }} alignItems="center" justifyContent="flex-end" width="fit-content">
                <Typography fontSize={14} fontWeight={"medium"} color="#555">
                  Playback Speed:
                </Typography>
                <Slider
                  sx={{
                    width: 140,
                  }}
                  color="primary"
                  aria-label="Playback Spped"
                  marks
                  min={0.25} max={2.0} step={0.25}
                  defaultValue={1.0}
                  valueLabelDisplay="auto"
                  onChange={(e) => {
                    player.playbackRate = e.target.value;
                  }}/>
              </Stack>
            </Grid>
            <Grid container spacing={1} sx={{ ml: 3 }}>
              <Grid item>
                <Button
                  endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                  variant="contained"
                  color={
                    reviewtext.trim().length === 0 ? "primary" : "success"
                  }
                  onClick={handleCollapseClick}
                >
                  Notes {reviewtext.trim().length === 0 ? "" : "*"}
                </Button>
              </Grid>
              {stdTranscriptionSettings.enable &&
                <Grid item>
                  <Button
                    endIcon={showStdTranscript ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setShowStdTranscript(!showStdTranscript);
                      setShowNotes(false);
                    }}
                  >
                    Standardised Transcription
                  </Button>
                </Grid>}
            </Grid>
            <div
              className={classes.collapse}
              style={{
                display: showNotes ? "block" : "none",
                paddingBottom: "16px",
                height: "175px", overflow: "scroll"
              }}
            >
              <ReactQuill
                ref={annotationNotesRef}
                modules={modules}
                bounds={"#note"}
                theme="bubble"
                formats={formats}
                placeholder="Annotation Notes" />
              <ReactQuill
                ref={reviewNotesRef}
                modules={modules}
                theme="bubble"
                bounds={"#note"}
                readOnly={true}
                formats={formats}
                placeholder="Review Notes" />
            </div>
            <div
              className={classes.collapse}
              style={{
                display: showStdTranscript ? "block" : "none",
                paddingBottom: "16px",
                overflow: "auto",
                height: "max-content"
              }}
            >
              {stdTranscriptionSettings.enableTransliteration ? (
                <IndicTransliterate
                  lang={stdTranscriptionSettings.targetlang}
                  value={stdTranscription}
                  onChange={(e) => {
                    setStdTranscription(e.target.value);
                  }}
                  onChangeText={() => { }}
                  enabled={stdTranscriptionSettings.enableTransliterationSuggestion}
                  containerStyles={{
                    width: "100%",
                  }}
                  renderComponent={(props) => (
                    <div className={classes.relative} style={{ width: "100%" }}>
                      <textarea
                        className={classes.customTextarea}
                        dir={stdTranscriptionSettings.rtl ? "rtl" : "ltr"}
                        rows={4}
                        style={{ fontSize: stdTranscriptionSettings.fontSize, height: "120px" }}
                        {...props}
                      />
                    </div>
                  )}
                />
              ) : (
                <div className={classes.relative} style={{ width: "100%" }}>
                  <textarea
                    onChange={(e) => {
                      setStdTranscription(e.target.value);
                    }}
                    value={stdTranscription}
                    dir={stdTranscriptionSettings.rtl ? "rtl" : "ltr"}
                    className={classes.customTextarea}
                    style={{
                      fontSize: stdTranscriptionSettings.fontSize,
                      height: "120px",
                    }}
                    rows={4}
                  />
                </div>
              )}
            </div>
            <div
              className={classes.collapse}
              style={{
                display: advancedWaveformSettings ? "block" : "none",
                marginTop: "15%",
                overflow: "auto",
                height: "max-content"
              }}
            >
              <table style={{ width: "100%", textAlign: 'center', fontSize: 'large' }}>
                <tr>
                  <td>Wave:&nbsp;&nbsp;<input type='checkbox' checked={wave} onChange={() => { setWave(!wave) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={waveColor} onChange={(e) => { setWaveColor(e.target.value) }}></input></td>
                  <td>Background:&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={backgroundColor} onChange={(e) => { setBackgroundColor(e.target.value) }}></input></td>
                  <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={paddingColor} onChange={(e) => { setPaddingColor(e.target.value) }}></input></td>
                  <td>Cursor:&nbsp;&nbsp;<input type='checkbox' checked={cursor} onChange={() => { setCursor(!cursor) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={cursorColor} onChange={(e) => { setCursorColor(e.target.value) }}></input></td>
                  <td>Progress:&nbsp;&nbsp;<input type='checkbox' checked={progress} onChange={() => { setProgress(!progress) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={progressColor} onChange={(e) => { setProgressColor(e.target.value) }}></input></td>
                </tr>
                <tr>
                  <td>Grid:&nbsp;&nbsp;<input type='checkbox' checked={grid} onChange={() => { setGrid(!grid) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={gridColor} onChange={(e) => { setGridColor(e.target.value) }}></input></td>
                  <td>Ruler:&nbsp;&nbsp;<input type='checkbox' checked={ruler} onChange={() => { setRuler(!ruler) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={rulerColor} onChange={(e) => { setRulerColor(e.target.value) }}></input></td>
                  <td colSpan={2}>Scrollbar:&nbsp;&nbsp;<input type='checkbox' checked={scrollbar} onChange={() => { setScrollbar(!scrollbar) }}></input>&nbsp;&nbsp;<input type='color' style={{ width: "25px", padding: "0px" }} value={scrollbarColor} onChange={(e) => { setScrollbarColor(e.target.value) }}></input></td>
                  <td>Ruler At Top:&nbsp;&nbsp;<input type='checkbox' checked={rulerAtTop} onChange={() => { setRulerAtTop(!rulerAtTop) }}></input></td>
                  <td>Scrollable:&nbsp;&nbsp;<input type='checkbox' checked={scrollable} onChange={() => { setScrollable(!scrollable) }}></input></td>
                  <td>Wav worker:&nbsp;&nbsp;<input type='checkbox' checked={wavWorker} onChange={() => {setWavWorker(!wavWorker)}}></input></td>
                </tr>
                <tr>
                  <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='range' min={0} max={20} step={1} value={padding} onChange={(e) => { setPadding(e.target.value) }}></input>&nbsp;{padding}</td>
                  <td colSpan={2}>Pixel Ratio:&nbsp;&nbsp;<input type='range' min={1} max={2} step={1} value={pixelRatio} onChange={(e) => { setPixelRatio(e.target.value) }}></input>&nbsp;{pixelRatio}</td>
                </tr>
                <tr>
                  <td colSpan={3}>Wave Scale:&nbsp;&nbsp;<input type='range' min={0.1} max={2} step={0.1} value={waveScale} onChange={(e) => { setWaveScale(e.target.value) }}></input>&nbsp;{waveScale}</td>
                  <td colSpan={3}>Wave Size:&nbsp;&nbsp;<input type='range' min={1} max={10} step={1} value={waveSize} onChange={(e) => { setWaveSize(e.target.value) }}></input>&nbsp;{waveSize}</td>
                </tr>
              </table>
            </div>
          </Box>
        </Grid>

        <Grid md={6} xs={12} sx={{ width: "100%" }}>
          <TranscriptionRightPanel
            currentIndex={currentIndex}
            AnnotationsTaskDetails={AnnotationsTaskDetails}
            player={player}
            ProjectDetails={ProjectDetails}
            TaskDetails={taskData}
            stage={3}
            handleStdTranscriptionSettings={setStdTranscriptionSettings}
            advancedWaveformSettings={advancedWaveformSettings}
            setAdvancedWaveformSettings={setAdvancedWaveformSettings}
            annotationId={annotations[0]?.id}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
      >
        <Timeline currentTime={currentTime} playing={playing} taskID={taskData?.id} waveformSettings={waveformSettings} />
      </Grid>
    </>
  );
};
export default AllAudioTranscriptionLandingPage;
