// AudioTranscriptionLandingPage
import ReactQuill, { Quill } from 'react-quill';
import "../../../../ui/pages/container/Label-Studio/cl_ui.css"
import 'quill/dist/quill.bubble.css';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Portal from "@mui/material/Portal";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Timeline from "./TimeLine";
import Timeline2 from './wavesurfer';
import AudioPanel from "./AudioPanel";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {isPlaying} from '../../../../utils/utils';
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
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';
import LightTooltip from "../../component/common/Tooltip";
import configs from '../../../../config/config';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CloseIcon from "@mui/icons-material/Close";

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
  const [annotationtext,setannotationtext] = useState('');
  const [currentSubs, setCurrentSubs] = useState();
  const [loadtime, setloadtime] = useState(new Date());
  const [textBox, settextBox] = useState("");
  const [L2Check, setL2Check] = useState(true);
  const [NextData, setNextData] = useState("");
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
  const [disableSkip, setdisableSkip] = useState(false);
  const [disableBtns, setDisableBtns] = useState(false);
  const [filterMessage, setFilterMessage] = useState("");
  const [reviewtext,setreviewtext] = useState('');
  const [supercheckertext,setsupercheckertext] = useState('');
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
  const taskDetails = useSelector((state) => state.getTaskDetails?.data);
  const player = useSelector((state) => state.commonReducer.player);
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  const ref = useRef(0);
  const saveIntervalRef = useRef(null);
  const timeSpentIntervalRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const superCheckerNotesRef = useRef(null);
  const [advancedWaveformSettings, setAdvancedWaveformSettings] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [waveSurfer, setWaveSurfer] = useState(false);
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
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
 
  const filterAnnotations = (annotations, user) => {
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
        filteredAnnotations = userAnnotation.result.length > 0 ?
          [userAnnotation] : annotations.filter(
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
        if(filteredAnnotations[0].annotation_status === "rejected")
          setAutoSave(false);
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
    filterAnnotations(AnnotationsTaskDetails, userData);
  }, [AnnotationsTaskDetails, userData]);

  const handleCollapseClick = () => {
    !showNotes && setShowStdTranscript(false);
    setShowNotes(!showNotes);
  };


   useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text?.trim() === "");
    const hasEmptySpeaker = result?.some(
      (element) => element.speaker_id?.trim() === ""
    );
    const hasEmptyTextL2 = (stdTranscriptionSettings.showAcoustic && result?.some((element) => element.acoustic_normalised_text?.trim() === ""));
    settextBox(hasEmptyText);
    setSpeakerBox(hasEmptySpeaker);
    setL2Check(!hasEmptyTextL2);
  }, [result, stdTranscriptionSettings]);

  const getTaskData = async (id) => {
    setLoading(true);
    const ProjectObj = new GetTaskDetailsAPI(id?id:taskId);
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
    }else{setTaskDetailList(resp);
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

  const [isActive, setIsActive] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const inactivityThreshold = 120000; 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAutosave = async () => {
    setAutoSaveTrigger(false);
    if(AnnotationsTaskDetails[0]?.annotation_status !== "validated" && AnnotationsTaskDetails[0]?.annotation_status !== "validated_with_changes"){
    if(!autoSave) return;
    const currentAnnotation = AnnotationsTaskDetails?.find((a) => a.completed_by === userData.id && a.annotation_type === 3);
    if(!currentAnnotation) return;
    const reqBody = {
      task_id: taskId,
      auto_save: true,
      lead_time:
      (new Date() - loadtime) / 1000 + Number(currentAnnotation?.lead_time ?? 0),
      result: (stdTranscriptionSettings.enable ? [...result, { standardised_transcription: stdTranscription }] : result),
    };
    if(result.length && taskDetails?.super_check_user === userData.id) {
    try{ 
      const obj = new SaveTranscriptAPI(currentAnnotation?.id, reqBody);
      const res = await fetch(obj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(obj.getBody()),
        headers: obj.getHeaders().headers,
      });
      if (!res.ok) {
          const data = await res.json();
          setSnackbarInfo({
          open: true,
          message: data.message,
          variant: "error",
        });
      } 
      return res;
    }
      catch(err) {
        setSnackbarInfo({
          open: true,
          message: "Error in autosaving "+err,
          variant: "error",
        });
      }
    }
  }
  };
  
  useEffect(() => {
    autoSaveTrigger && handleAutosave();
  }, [autoSaveTrigger, autoSave, handleAutosave, userData, result, taskId, annotations, taskDetails, stdTranscription, stdTranscriptionSettings]);
  
  useEffect(() => {
    if(!autoSave) return;

    const handleUpdateTimeSpent = (time = 60) => {
      // const apiObj = new UpdateTimeSpentPerTask(taskId, time);
      // dispatch(APITransport(apiObj));
    };

    saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);
    timeSpentIntervalRef.current = setInterval(
      handleUpdateTimeSpent,
      60 * 1000
    );

    const handleBeforeUnload = (event) => {
      setAutoSaveTrigger(true);
      handleUpdateTimeSpent(ref.current);
      event.preventDefault();
      event.returnValue = "";
      ref.current = 0;
    };

    const handleInteraction = () => {
      setLastInteraction(Date.now());
      setIsActive(true);
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastInteraction >= inactivityThreshold) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousemove', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    const interval = setInterval(checkInactivity, 1000);

    if(!isActive){
      handleUpdateTimeSpent(ref.current);
      clearInterval(saveIntervalRef.current);
      clearInterval(timeSpentIntervalRef.current);
      ref.current = 0;
    }
  
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is active, restart the autosave interval
        saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);
        timeSpentIntervalRef.current = setInterval(
          handleUpdateTimeSpent,
          60 * 1000
        );
      } else {
        setAutoSaveTrigger(true);
        handleUpdateTimeSpent(ref.current);
        // Tab is inactive, clear the autosave interval
        clearInterval(saveIntervalRef.current);
        clearInterval(timeSpentIntervalRef.current);
        ref.current = 0;
      }
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      clearInterval(interval);
      clearInterval(saveIntervalRef.current);
      clearInterval(timeSpentIntervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [autoSave, userData, taskId, annotations, taskDetails, isActive]);

  useEffect(() => {
    let standardisedTranscription = "";
    const sub = annotations[0]?.result?.filter((item) => {
      if ("standardised_transcription" in item) {
        standardisedTranscription = item.standardised_transcription;
        return false;
      } else return true;
    }).map((item) => new Sub(item));
    dispatch(setSubtitles(sub, C.SUBTITLES));

    setStdTranscription(standardisedTranscription);
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
    getAnnotationsTaskData(taskId);
    getProjectDetails();
    getTaskData(taskId);
  }, []);
  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskDetails).then(res => setAssignedUsers(res));
    }
    taskDetails?.id && showAssignedUsers();
  }, [taskDetails]);

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  /* useEffect(() => {
    if(Object.keys(userData).includes("prefer_cl_ui") && !(userData.prefer_cl_ui) && ProjectDetails?.project_type.includes("AudioTranscription")) {
      const changeUI = async() => {
        handleAutosave().then(navigate(`/projects/${projectId}/SuperChecker/${taskId}`))
      };
      changeUI();
    }
  }, [userData]); */
  
  const tasksComplete = (id) => {
    if (id) {
      // resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(
        `/projects/${projectId}/SuperCheckerAudioTranscriptionLandingPage/${id}`
      );
      window.location.reload(true);
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
    setAutoSave(false);
    const PatchAPIdata = {
      task_id: taskId,
      annotation_status: value,
      supercheck_notes: JSON.stringify(superCheckerNotesRef.current.getEditor().getContents()),
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result: (stdTranscriptionSettings.enable ? [...result, { standardised_transcription: stdTranscription }] : result),
      ...((value === "rejected" ||
        value === "validated" ||
        value === "validated_with_changes") && {
        parent_annotation: parentannotation,
      }),
    };
    const L1Check = !textBox && !speakerBox && result?.length > 0;
    if (
      ["draft", "skipped", "rejected"].includes(value) ||
      (["validated", "validated_with_changes"].includes(value) && L1Check && L2Check)
    ) {
      //if(value === "rejected") PatchAPIdata["result"] = [];
      const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
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
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "success",
          });
      } else {
        setAutoSave(true);
        setSnackbarInfo({
          open: true,
          message: resp?.message ? resp?.message : "This task is having duplicate annotation. Please deallocate this task",          variant: "error",
        });
      }
    } else {
      setAutoSave(true);
      if (textBox || !L2Check) {
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
      } else {
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

        try {
          const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
          reviewNotesRef.current.getEditor().setContents(newDelta1);
        } catch (err) {
          if(err){
            const newDelta1 = reviewNotesRef.current.value;
            reviewNotesRef.current.getEditor().setText(newDelta1); 
          }
        }
        try {
          const newDelta3 = superCheckerNotesRef.current.value!=""?JSON.parse(superCheckerNotesRef.current.value):"";
          superCheckerNotesRef.current.getEditor().setContents(newDelta3);
        } catch (err) {
          if(err){
            const newDelta3 = superCheckerNotesRef.current.value;
            superCheckerNotesRef.current.getEditor().setText(newDelta3); 
          }
        }

        setreviewtext(reviewNotesRef.current.getEditor().getText())
        setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())
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
              
              try {
                const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if(err){
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1); 
                }
              }
              try {
                const newDelta3 = superCheckerNotesRef.current.value!=""?JSON.parse(superCheckerNotesRef.current.value):"";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if(err){
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3); 
                }
              }
      
        setreviewtext(reviewNotesRef.current.getEditor().getText())
        setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())
          } else {
            let superCheckerAnnotation = annotations.find(
              (annotation) =>
                annotation.parent_annotation === reviewerAnnotations[0]?.id
            );
            reviewNotesRef.current.value =
              reviewerAnnotations[0]?.review_notes ?? "";
            superCheckerNotesRef.current.value =
              superCheckerAnnotation[0]?.supercheck_notes ?? "";

              try {
                const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
                reviewNotesRef.current.getEditor().setContents(newDelta1);
              } catch (err) {
                if(err){
                  const newDelta1 = reviewNotesRef.current.value;
                  reviewNotesRef.current.getEditor().setText(newDelta1); 
                }
              }
              try {
                const newDelta3 = superCheckerNotesRef.current.value!=""?JSON.parse(superCheckerNotesRef.current.value):"";
                superCheckerNotesRef.current.getEditor().setContents(newDelta3);
              } catch (err) {
                if(err){
                  const newDelta3 = superCheckerNotesRef.current.value;
                  superCheckerNotesRef.current.getEditor().setText(newDelta3); 
                }
              }
      
        setreviewtext(reviewNotesRef.current.getEditor().getText())
        setsupercheckertext(superCheckerNotesRef.current.getEditor().getText())
          }
        }
      }
    }
  };

  useEffect(()=>{
    setNotes(taskDetailList, AnnotationsTaskDetails);

  },[taskDetailList, AnnotationsTaskDetails]);

  const resetNotes = () => {
    setShowNotes(false);
    reviewNotesRef.current.getEditor().setContents([]);
    superCheckerNotesRef.current.getEditor().setContents([]);
  };
  const modules = {
    toolbar: [

      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
    ]
  };

  const formats = [
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color',
    'script']

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
    "wave": wave, 
    "waveColor": waveColor, 
    "backgroundColor": backgroundColor, 
    "paddingColor": paddingColor,
    "cursor": cursor, 
    "cursorColor": cursorColor, 
    "progress": progress, 
    "progressColor": progressColor, 
    "grid": grid, "gridColor": gridColor, 
    "ruler": ruler,
    "rulerColor": rulerColor, 
    "scrollbar": scrollbar, 
    "scrollbarColor": scrollbarColor, 
    "rulerAtTop": rulerAtTop, 
    "scrollable": scrollable, 
    "duration": duration, 
    "padding": padding,
    "pixelRatio": pixelRatio, 
    "waveScale": waveScale, 
    "waveSize": waveSize,
    "worker" : wavWorker
  });

useEffect(() => {
  setWaveformSettings({
    "wave":wave, 
    "waveColor":waveColor, 
    "backgroundColor":backgroundColor, 
    "paddingColor":paddingColor,
    "cursor":cursor, 
    "cursorColor":cursorColor, 
    "progress":progress, 
    "progressColor":progressColor, 
    "grid":grid, 
    "gridColor":gridColor, 
    "ruler":ruler,
    "rulerColor":rulerColor, 
    "scrollbar":scrollbar, 
    "scrollbarColor":scrollbarColor, 
    "rulerAtTop": rulerAtTop, 
    "scrollable":scrollable, 
    "duration":duration, 
    "padding":padding,
    "pixelRatio":pixelRatio, 
    "waveScale":waveScale, 
    "waveSize":waveSize,
    "worker" : wavWorker
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
  if(showNotes === true){
    setAdvancedWaveformSettings(false);
  }
}, [showNotes]);


useEffect(() => {
  if(advancedWaveformSettings === true){
    setShowNotes(false);
  }
}, [advancedWaveformSettings]);

useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === ' ') {
      event.preventDefault();
      if(player){
        if(isPlaying(player)){
          player.pause();
        }else{
          player.play();
        }
      }
    }
    
    if (event.shiftKey && event.key === 'ArrowLeft') {
      event.preventDefault();
      if(player){
        player.currentTime = player.currentTime - 1.25;
      }
    }
    if (event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault();
      if(player){
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
            <Typography sx={{mt: 2, ml: 4, color: "grey"}}>
              Task #{taskDetails?.id}
              <LightTooltip
                title={assignedUsers ? assignedUsers : ""}
              >
                <InfoOutlinedIcon sx={{mb: "-4px", ml: "2px", color: "grey"}}/>
              </LightTooltip>
            </Typography>
            <SuperCheckerStageButtons
              handleSuperCheckerClick={handleSuperCheckerClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              disableSkip={disableSkip}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
            />
            {audioURL ?
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              // handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              taskData={taskDetailList}
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
                  // style={{ marginBottom: "20px" }}
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
              {/* <Alert severity="warning" showIcon style={{marginBottom: '1%'}}>
                {translate("alert.notes")}
            </Alert> */}
              {/* <TextField
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
              /> */}
              <ReactQuill
                ref={reviewNotesRef}
                modules={modules}
                bounds={"#note"}
                formats={formats}
                theme="bubble"
                placeholder="Review Notes"
                readOnly={true}
              ></ReactQuill>
              <ReactQuill
                ref={superCheckerNotesRef}
                modules={modules}
                bounds={"#note"}
                theme="bubble"
                formats={formats}
                placeholder="SuperChecker Notes"
              ></ReactQuill>
            </div>
            <div
              className={classes.collapse}
              style={{
                display: showStdTranscript ? "block" : "none",
                paddingBottom: "16px",
                overflow: "auto",
                height: "100px"
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
            TaskDetails={taskDetailList}
            handleStdTranscriptionSettings={setStdTranscriptionSettings}
            advancedWaveformSettings={advancedWaveformSettings}
            setAdvancedWaveformSettings={setAdvancedWaveformSettings}
            waveSurfer={waveSurfer}
            setWaveSurfer={setWaveSurfer}
            stage={3}
            annotationId={annotations[0]?.id}
            handleOpenPopover={handleOpenPopover}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        {audioURL ? (waveSurfer ? <Timeline2 key={taskDetails?.data?.audio_url} details={taskDetails} waveformSettings={waveSurferWaveformSettings}/> : <Timeline currentTime={currentTime} playing={playing} taskID={taskDetailList} waveformSettings={waveformSettings} />) : <div style={{marginLeft:"49%", marginBottom:"2%"}}><CircularProgress/></div>}
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
export default SuperCheckerAudioTranscriptionLandingPage;
