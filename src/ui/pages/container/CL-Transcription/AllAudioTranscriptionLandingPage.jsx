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
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Portal from "@mui/material/Portal";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Timeline from "./TimeLine";
import Timeline2 from './wavesurfer';
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
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';
import LightTooltip from "../../component/common/Tooltip";
import configs from '../../../../config/config';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CloseIcon from "@mui/icons-material/Close";

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
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [waveSurfer, setWaveSurfer] = useState(true);
  const [audioURL, setAudioURL] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef(null);

  const type1 = AnnotationsTaskDetails.filter(
    (item) => item.annotation_type === 1
  );
  const type2 = AnnotationsTaskDetails.filter(
    (item) => item.annotation_type === 2
  );
  const type3 = AnnotationsTaskDetails.filter(
    (item) => item.annotation_type === 3
  );
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

  const handleOpenPopover = (position) => {
    const offsetPosition = {
      top: position.top - 0,
      left: position.left - 1000,
    };
    setPopoverPosition(offsetPosition);
    setPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleFullscreenToggle = () => {
    const elem = dialogRef.current;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };
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
      setTaskData(resp);
      if (resp?.data?.audio_duration < 1000){
        setWaveSurfer(false);
      }else{
        setWaveSurfer(true);
      }
      const fetchAudioData = await fetch(
    (String(resp?.data?.audio_url).includes("https://asr-transcription.objectstore.e2enetworks.net/") 
        ? String(resp?.data?.audio_url).replace("https://asr-transcription.objectstore.e2enetworks.net/", `${configs.BASE_URL_AUTO}/task/get_audio_file/?audio_url=asr-transcription/`)
        : String(resp?.data?.audio_url).includes("https://indic-asr-public.objectstore.e2enetworks.net/") 
        ? String(resp?.data?.audio_url).replace("https://indic-asr-public.objectstore.e2enetworks.net/", `${configs.BASE_URL_AUTO}/task/get_audio_file/?audio_url=speechteam/`)
        : String(resp?.data?.audio_url)),
    {
        method: "GET",
        headers: ProjectObj.getHeaders().headers
      })
      if (!fetchAudioData.ok){
        setAudioURL(resp?.data?.audio_url)
      }else{
        try {
          var base64data = await fetchAudioData.json();
          var binaryData = atob(base64data);
          var buffer = new ArrayBuffer(binaryData.length);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < binaryData.length; i++) {
              view[i] = binaryData.charCodeAt(i);
          }
          var blob = new Blob([view], { type: 'audio/mpeg' });
          setAudioURL(URL.createObjectURL(blob));
        } catch {
          setAudioURL(resp?.data?.audio_url)
        }
      }
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
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskDetails).then(res => setAssignedUsers(res));
    }
    taskDetails?.id && showAssignedUsers();
  }, [taskDetails]);

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
      setAnnotations(AnnotationsTaskDetails);
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
      window.location.reload(true);
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

  const [waveSurferHeight, setWaveSurferHeigth] = useState(140);
  const [waveSurferMinPxPerSec, setWaveSurferMinPxPerSec] = useState(100);
  const [waveSurferWaveColor, setWaveSurferWaveColor] = useState('#ff4e00');
  const [waveSurferProgressColor, setWaveSurferProgressColor] = useState("#dd5e98");
  const [waveSurferCursorColor, setWaveSurferCursorColor] = useState("#935ae8");
  const [waveSurferCursorWidth, setWaveSurferCursorWidth] = useState(1);
  const [waveSurferBarWidth, setWaveSurferBarWidth] = useState(2);
  const [waveSurferBarGap, setWaveSurferBarGap] = useState(0);
  const [waveSurferBarRadius, setWaveSurferBarRadius] = useState(0);
  const [waveSurferBarHeight, setWaveSurferBarHeight] = useState(1.5);
    
  const [waveSurferWaveformSettings, setWaveSurferWaveformSettings] = useState({
    "height": waveSurferHeight,
    "minPxPerSec": waveSurferMinPxPerSec,
    "waveColor": waveSurferWaveColor,
    "progressColor": waveSurferProgressColor,
    "cursorColor": waveSurferCursorColor,
    "cursorWidth": waveSurferCursorWidth,
    "barWidth": waveSurferBarWidth,
    "barGap": waveSurferBarGap,
    "barRadius": waveSurferBarRadius,
    "barHeight": waveSurferBarHeight
  });

  useEffect(() => {
    setWaveSurferWaveformSettings({
      "height": waveSurferHeight,
      "minPxPerSec": waveSurferMinPxPerSec,
      "waveColor": waveSurferWaveColor,
      "progressColor": waveSurferProgressColor,
      "cursorColor": waveSurferCursorColor,
      "cursorWidth": waveSurferCursorWidth,
      "barWidth": waveSurferBarWidth,
      "barGap": waveSurferBarGap,
      "barRadius": waveSurferBarRadius,
      "barHeight": waveSurferBarHeight
    })
  }, [waveSurferHeight, waveSurferMinPxPerSec, waveSurferWaveColor, waveSurferProgressColor, waveSurferCursorColor, waveSurferCursorWidth, waveSurferBarWidth, waveSurferBarGap, waveSurferBarRadius, waveSurferBarHeight])

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
          player.currentTime = player.currentTime - 1.25;
        }
      }
      if (event.shiftKey && event.key === 'ArrowRight') {
        event.preventDefault();
        if (player) {
          player.currentTime = player.currentTime + 1.25;
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
                title={assignedUsers ? assignedUsers : ""}
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
            {audioURL ?
             <AudioPanel
               setCurrentTime={setCurrentTime}
               setPlaying={setPlaying}
               taskData={taskData}
               audioUrl={audioURL}
              /> : <Grid style={{ padding: "0px 20px 0px 20px" }}><audio controls preload='none' className={classes.videoPlayer}/></Grid>}
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
                  customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                  apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
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
                <table style={{width: "100%", textAlign: 'center', fontSize: 'large'}}>
                  { waveSurfer ? 
                  <>
                  <tr>
                    <td colSpan={2}>Height:&nbsp;&nbsp;<input type='range' min={10} max={512} step={1} value={waveSurferHeight} onChange={(e) => {setWaveSurferHeigth(e.target.value)}}></input></td>
                    {/* <td>Width:&nbsp;&nbsp;<input type='range' min={10} max={2000} step={1} value={waveSurferWidth} onChange={(e) => {setWaveSurferWidth(e.target.value)}}></input></td> */}
                    <td colSpan={2}>Min PX Per Sec:&nbsp;&nbsp;<input type='range' min={1} max={1000} step={1} value={waveSurferMinPxPerSec} onChange={(e) => {setWaveSurferMinPxPerSec(e.target.value)}}></input></td>
                  </tr>
                  <tr>
                    <td>Wave Color:&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={waveSurferWaveColor} onChange={(e) => {setWaveSurferWaveColor(e.target.value)}}></input></td>
                    <td>Progress Color:&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={waveSurferProgressColor} onChange={(e) => {setWaveSurferProgressColor(e.target.value)}}></input></td>
                    <td>Cursor Color:&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={waveSurferCursorColor} onChange={(e) => {setWaveSurferCursorColor(e.target.value)}}></input></td>
                    <td>Cursor Width:&nbsp;&nbsp;<input type='range' min={0} max={10} step={1} value={waveSurferCursorWidth} onChange={(e) => {setWaveSurferCursorWidth(e.target.value)}}></input></td>
                  </tr>
                  <tr>
                    <td>Bar Width:&nbsp;&nbsp;<input type='range' min={1} max={30} step={1} value={waveSurferBarWidth} onChange={(e) => {setWaveSurferBarWidth(e.target.value)}}></input></td>
                    <td>Bar Gap:&nbsp;&nbsp;<input type='range' min={1} max={30} step={1} value={waveSurferBarGap} onChange={(e) => {setWaveSurferBarGap(e.target.value)}}></input></td>
                    <td>Bar Radius:&nbsp;&nbsp;<input type='range' min={1} max={30} step={1} value={waveSurferBarRadius} onChange={(e) => {setWaveSurferBarRadius(e.target.value)}}></input></td>
                    <td>Bar Height:&nbsp;&nbsp;<input type='range' min={0.1} max={4} step={0.1} value={waveSurferBarHeight} onChange={(e) => {setWaveSurferBarHeight(e.target.value)}}></input></td>
                  </tr>
                  </>
                  :
                  <>
                  <tr>
                    <td>Wave:&nbsp;&nbsp;<input type='checkbox' checked={wave} onChange={() => {setWave(!wave)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={waveColor} onChange={(e) => {setWaveColor(e.target.value)}}></input></td>
                    <td>Background:&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={backgroundColor} onChange={(e) => {setBackgroundColor(e.target.value)}}></input></td>
                    <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={paddingColor} onChange={(e) => {setPaddingColor(e.target.value)}}></input></td>
                    <td>Cursor:&nbsp;&nbsp;<input type='checkbox' checked={cursor} onChange={() => {setCursor(!cursor)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={cursorColor} onChange={(e) => {setCursorColor(e.target.value)}}></input></td>
                    <td>Progress:&nbsp;&nbsp;<input type='checkbox' checked={progress} onChange={() => {setProgress(!progress)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={progressColor} onChange={(e) => {setProgressColor(e.target.value)}}></input></td>
                  </tr>
                  <tr>
                    <td>Grid:&nbsp;&nbsp;<input type='checkbox' checked={grid} onChange={() => {setGrid(!grid)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={gridColor} onChange={(e) => {setGridColor(e.target.value)}}></input></td>
                    <td>Ruler:&nbsp;&nbsp;<input type='checkbox' checked={ruler} onChange={() => {setRuler(!ruler)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={rulerColor} onChange={(e) => {setRulerColor(e.target.value)}}></input></td>
                    <td colSpan={2}>Scrollbar:&nbsp;&nbsp;<input type='checkbox' checked={scrollbar} onChange={() => {setScrollbar(!scrollbar)}}></input>&nbsp;&nbsp;<input type='color' style={{width: "25px", padding: "0px"}} value={scrollbarColor} onChange={(e) => {setScrollbarColor(e.target.value)}}></input></td>
                    <td>Ruler At Top:&nbsp;&nbsp;<input type='checkbox' checked={rulerAtTop} onChange={() => {setRulerAtTop(!rulerAtTop)}}></input></td>
                    <td>Scrollable:&nbsp;&nbsp;<input type='checkbox' checked={scrollable} onChange={() => {setScrollable(!scrollable)}}></input></td>
                    <td>Wav worker:&nbsp;&nbsp;<input type='checkbox' checked={wavWorker} onChange={() => {setWavWorker(!wavWorker)}}></input></td>

                  </tr>
                  <tr>
                    <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='range' min={0} max={20} step={1} value={padding} onChange={(e) => {setPadding(e.target.value)}}></input>&nbsp;{padding}</td>
                    <td colSpan={2}>Pixel Ratio:&nbsp;&nbsp;<input type='range' min={1} max={2} step={1} value={pixelRatio} onChange={(e) => {setPixelRatio(e.target.value)}}></input>&nbsp;{pixelRatio}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Wave Scale:&nbsp;&nbsp;<input type='range' min={0.1} max={2} step={0.1} value={waveScale} onChange={(e) => {setWaveScale(e.target.value)}}></input>&nbsp;{waveScale}</td>
                    <td colSpan={3}>Wave Size:&nbsp;&nbsp;<input type='range' min={1} max={10} step={1} value={waveSize} onChange={(e) => {setWaveSize(e.target.value)}}></input>&nbsp;{waveSize}</td>
                  </tr>
                  </>
                  }
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
            waveSurfer={waveSurfer}
            setWaveSurfer={setWaveSurfer}
            annotationId={annotations[0]?.id}
            handleOpenPopover={handleOpenPopover}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
      >
        {audioURL ? (waveSurfer ? <Timeline2 key={taskDetails?.data?.audio_url} details={taskDetails} waveformSettings={waveSurferWaveformSettings}/> : <Timeline currentTime={currentTime} playing={playing} taskID={taskData?.id} waveformSettings={waveformSettings} />) : <div style={{marginLeft:"49%", marginBottom:"2%"}}><CircularProgress/></div>}
      </Grid>
      {popoverOpen && (
        <Portal>
          <Box
            ref={dialogRef}
            sx={{
              position: "fixed",
              top: popoverPosition.top,
              left: popoverPosition.left,
              backgroundColor: "white",
              boxShadow: 3,
              padding: 2,
              borderRadius: "8px",
              minWidth: isFullscreen ? "100%" : "400px",
              width: isFullscreen ? "100%" : "500px",
              height: isFullscreen ? "100%" : "450px",
              maxWidth: isFullscreen ? "100%" : "600px",
              zIndex: 1300,
              overflow: "auto",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h4" flexGrow={1}>
                Subtitles
              </Typography>
              <IconButton onClick={handleFullscreenToggle}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
              <IconButton onClick={handleClosePopover}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ height: "410px", overflowY: "auto" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {type1.length > 0 && (
                        <th>
                          <Typography variant="h6">Annotation</Typography>
                        </th>
                      )}
                      {type2.length > 0 && (
                        <th>
                          <Typography variant="h6">Review</Typography>
                        </th>
                      )}
                      {type3.length > 0 && (
                        <th>
                          <Typography variant="h6">SuperCheck</Typography>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* Render different types */}
                      <td>
                        {type1.length > 0 &&
                          type1[0].result.map((el, index) => (
                            <Box
                              key={index}
                              p={1}
                              border="1px solid #000"
                              borderRadius="4px"
                              mb={1}
                            >
                              {el.text}
                            </Box>
                          ))}
                      </td>
                      <td>
                        {type2.length > 0 &&
                          type2[0].result.map((el, index) => (
                            <Box
                              key={index}
                              p={1}
                              border="1px solid #000"
                              borderRadius="4px"
                              mb={1}
                            >
                              {el.text}
                            </Box>
                          ))}
                      </td>
                      <td>
                        {type3.length > 0 &&
                          type3[0].result.map((el, index) => (
                            <Box
                              key={index}
                              p={1}
                              border="1px solid #000"
                              borderRadius="4px"
                              mb={1}
                            >
                              {el.text}
                            </Box>
                          ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
};
export default AllAudioTranscriptionLandingPage;
