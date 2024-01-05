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
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';
import LightTooltip from "../../component/common/Tooltip";

const SuperCheckerAudioTranscriptionLandingPage = () => {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId, taskId } = useParams();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
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
  const [autoSaveTrigger, setAutoSaveTrigger] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(-1);

  const filterAnnotations = (annotations, user) => {
    let disableSkip = false;
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
        if (filteredAnnotations[0].annotation_status === "rejected")
          setAutoSave(false);
      }
    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 3);
      setAutoSave(false);
      disableSkip = true;
    }
    setAnnotations(filteredAnnotations);
    setdisableSkip(disableSkip);
    // return [filteredAnnotations, disableSkip];
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
    }else{setTaskDetailList(resp)}
    setLoading(false);
  };

  const [isActive, setIsActive] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const inactivityThreshold = 120000; 

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAutosave = async () => {
    setAutoSaveTrigger(false);
    if (!autoSave) return;
    const currentAnnotation = AnnotationsTaskDetails?.find((a) => a.completed_by === userData.id && a.annotation_type === 3);
    if (!currentAnnotation) return;
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
        setSnackbarInfo({
          open: true,
          message: "Error in autosaving annotation",
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
  };
  
  useEffect(() => {
    autoSaveTrigger && handleAutosave();
  }, [autoSaveTrigger, autoSave, handleAutosave, userData, result, taskId, annotations, taskDetails, stdTranscription, stdTranscriptionSettings]);
  
  useEffect(() => {
    if(!autoSave) return;

    saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);

    const handleBeforeUnload = (event) => {
      setAutoSaveTrigger(true);
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

    if (!isActive) {
      clearInterval(saveIntervalRef.current);
      ref.current = 0;
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is active, restart the autosave interval
        saveIntervalRef.current = setInterval(() => setAutoSaveTrigger(true), 60 * 1000);
      } else {
        setAutoSaveTrigger(true);
        // Tab is inactive, clear the autosave interval
        clearInterval(saveIntervalRef.current)
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
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

    // eslint-disable-next-line
  }, [autoSave, userData, taskId, annotations, taskDetails, isActive]);

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
    let standardisedTranscription = "";
    const sub = annotations[0]?.result?.filter((item) => {
      if ("standardised_transcription" in item) {
        standardisedTranscription = item.standardised_transcription;
        return false;
      } else return true;
    }).map((item) => new Sub(item));
    dispatch(setSubtitles(sub, C.SUBTITLES));

    setStdTranscription(standardisedTranscription);
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
    if (selectedUserId === -1) return;
    if (selectedUserId === userData?.id) {
      setFilterMessage("");
      setDisableBtns(false);
      setAutoSave(true);
      getAnnotationsTaskData(taskId);
      return;
    }
    const userAnnotations = AnnotationsTaskDetails?.filter((item) => item.completed_by === selectedUserId);
    if (userAnnotations.length) {
      setAutoSave(false);
      setDisableBtns(true);
      setFilterMessage(`This is the ${["Annotator", "Reviewer", "Super Checker"][userAnnotations[0].annotation_type - 1]}'s Annotation in read only mode`);
      setAnnotations(userAnnotations);
    }
  }, [selectedUserId, userData, taskId]);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskDetails).then(res => {
        setAssignedUsers(res);
      });
    }
    taskDetails?.id && showAssignedUsers();
  }, [taskDetails]);

  useEffect(() => {
    if (AnnotationsTaskDetails?.length > 0) {
      setLoading(false);
    }
  }, [AnnotationsTaskDetails]);

  const tasksComplete = (id) => {
    if (id) {
      navigate(
        `/projects/${projectId}/SuperCheckerAudioTranscriptionLandingPage/${id}`
      );
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
  ) => {
    setLoading(true);
    setAutoSave(false);
    const PatchAPIdata = {
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
      if (value === "rejected") PatchAPIdata["result"] = [];
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
          message: resp?.message,
          variant: "error",
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
      } else if (speakerBox) {
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
        console.log(isPlaying(player));
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
        player.currentTime = player.currentTime - 0.05;
      }
    }
    if (event.shiftKey && event.key === 'ArrowRight') {
      event.preventDefault();
      if(player){
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
          <Box
            className={classes.videoBox}
          >
            <Typography sx={{mt: 2, ml: 4, color: "grey"}}>
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
                    {/* <Button
                      style={{ display: "inline", fontSize: 12, color: "black", border: selectedUserId < 0 ? "1px solid rgba(0, 0, 0, 0.2)" : "none" }}
                      onClick={() => setSelectedUserId(-1)}>
                      Default (Reset filters)
                    </Button> */}
                    {assignedUsers.map((u, idx) => u &&
                      <Button
                        style={{
                          display: "inline",
                          fontSize: 12,
                          color: "black",
                          border: (selectedUserId === u.id || (selectedUserId === -1 && userData?.id === u.id))
                            ? "1px solid rgba(0, 0, 0, 0.2)" : "none"
                        }}
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
            <SuperCheckerStageButtons
              handleSuperCheckerClick={handleSuperCheckerClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              disableSkip={disableSkip}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              filterMessage={filterMessage}
              disableBtns={disableBtns}
            />
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              // handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              taskData={taskDetailList}
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
                  }} />
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
                  }} />
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
                    <td>Wave:&nbsp;&nbsp;<input type='checkbox' checked={wave} onChange={() => {setWave(!wave)}}></input> <input type='color' value={waveColor} onChange={(e) => {setWaveColor(e.target.value)}}></input></td>
                    <td>Background:&nbsp;&nbsp;<input type='color' value={backgroundColor} onChange={(e) => {setBackgroundColor(e.target.value)}}></input></td>
                    <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='color' value={paddingColor} onChange={(e) => {setPaddingColor(e.target.value)}}></input></td>
                    <td>Cursor:&nbsp;&nbsp;<input type='checkbox' checked={cursor} onChange={() => {setCursor(!cursor)}}></input> <input type='color' value={cursorColor} onChange={(e) => {setCursorColor(e.target.value)}}></input></td>
                    <td>Progress:&nbsp;&nbsp;<input type='checkbox' checked={progress} onChange={() => {setProgress(!progress)}}></input> <input type='color' value={progressColor} onChange={(e) => {setProgressColor(e.target.value)}}></input></td>
                  </tr>
                  <tr>
                    <td>Grid:&nbsp;&nbsp;<input type='checkbox' checked={grid} onChange={() => {setGrid(!grid)}}></input> <input type='color' value={gridColor} onChange={(e) => {setGridColor(e.target.value)}}></input></td>
                    <td>Ruler:&nbsp;&nbsp;<input type='checkbox' checked={ruler} onChange={() => {setRuler(!ruler)}}></input> <input type='color' value={rulerColor} onChange={(e) => {setRulerColor(e.target.value)}}></input></td>
                    <td colSpan={2}>Scrollbar:&nbsp;&nbsp;<input type='checkbox' checked={scrollbar} onChange={() => {setScrollbar(!scrollbar)}}></input> <input type='color' value={scrollbarColor} onChange={(e) => {setScrollbarColor(e.target.value)}}></input></td>
                    <td>Ruler At Top:&nbsp;&nbsp;<input type='checkbox' checked={rulerAtTop} onChange={() => {setRulerAtTop(!rulerAtTop)}}></input></td>
                    <td>Scrollable:&nbsp;&nbsp;<input type='checkbox' checked={scrollable} onChange={() => {setScrollable(!scrollable)}}></input></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>Padding:&nbsp;&nbsp;<input type='range' min={0} max={20} step={1} value={padding} onChange={(e) => {setPadding(e.target.value)}}></input>&nbsp;{padding}</td>
                    <td colSpan={2}>Pixel Ratio:&nbsp;&nbsp;<input type='range' min={1} max={2} step={1} value={pixelRatio} onChange={(e) => {setPixelRatio(e.target.value)}}></input>&nbsp;{pixelRatio}</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Wave Scale:&nbsp;&nbsp;<input type='range' min={0.1} max={2} step={0.1} value={waveScale} onChange={(e) => {setWaveScale(e.target.value)}}></input>&nbsp;{waveScale}</td>
                    <td colSpan={3}>Wave Size:&nbsp;&nbsp;<input type='range' min={1} max={10} step={1} value={waveSize} onChange={(e) => {setWaveSize(e.target.value)}}></input>&nbsp;{waveSize}</td>
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
            TaskDetails={taskDetailList}
            handleStdTranscriptionSettings={setStdTranscriptionSettings}
            advancedWaveformSettings={advancedWaveformSettings}
            setAdvancedWaveformSettings={setAdvancedWaveformSettings}
            stage={3}
            annotationId={annotations[0]?.id}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
        // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline currentTime={currentTime} playing={playing} taskID={taskDetailList} waveformSettings={waveformSettings} />
      </Grid>
    </>
  );
};
export default SuperCheckerAudioTranscriptionLandingPage;
