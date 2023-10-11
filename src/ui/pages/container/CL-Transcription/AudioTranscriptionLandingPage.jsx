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
import { parse, stringify } from 'flatted';
import TranscriptionRightPanel from "./TranscriptionRightPanel";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  Grid,
  Button,
  Slider, Stack
} from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Timeline from "./TimeLine";
import AudioPanel from "./AudioPanel";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import {isPlaying} from '../../../../utils/utils';
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
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';
import LightTooltip from "../../component/common/Tooltip";

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
  // const [annotationtext,setannotationtext] = useState('')
  // const [reviewtext,setreviewtext] = useState('')
  const [speakerBox, setSpeakerBox] = useState("");
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
  const [disableSkipButton, setdisableSkipButton] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);
  const [annotationtext, setannotationtext] = useState('')
  const [reviewtext, setreviewtext] = useState('')
  const [taskData, setTaskData] = useState()
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
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([{ DisplayName: "data" }]);
  const [selectedLang, setSelectedLang] = useState("");
  const [prev, setprev] = useState(false);
  const keystrokesRef = useRef([]);
  const suggestionRef = useRef([null]);
  const newKeystrokesRef = useRef();
  const [flag, setflag] = useState();
  const [debouncedText, setDebouncedText] = useState("");
  const debouncedTextRef = useRef("");
  const [isSpaceClicked, setIsSpaceClicked] = useState(false); 
  const taskDetails = useSelector((state) => state.getTaskDetails?.data);
  const [advancedWaveformSettings, setAdvancedWaveformSettings] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState(null);
  const [autoSave, setAutoSave] = useState(true);

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
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        setIsSpaceClicked(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " ") {
        setIsSpaceClicked(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    console.log("nnn","useEffect is running",prev);
    // const processConsoleLog = (args) => {
    //   const msg = stringify(args);
  
    //   if (msg.includes('library data')) {
    //     const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
    //     setflag(dataMatch.result);
    //     return dataMatch.result;
    //   }
    //   return;
    // };
    const decircularize = (obj, seen = new WeakSet()) => {
      if (typeof obj === 'object' && obj !== null) {
        if (seen.has(obj)) {
          return '[Circular Reference]';
        }
        seen.add(obj);
      }
      return obj;
    };
  
    const processConsoleLog = (args) => {
      // Modify args to remove circular references
      const cleanedArgs = args.map((arg) => decircularize(arg));
  
      const msg = stringify(cleanedArgs);
  
      if (msg.includes('library data')) {
        const dataMatch = parse(msg.match(/{[^}]*}/));
        setflag(dataMatch.result);
        return dataMatch.result;
      }
      return;
    };
  
  
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const newSuggestions = processConsoleLog(args);
      if (newSuggestions!=null) {
        suggestionRef.current  = prev==true?flag:newSuggestions
        // if (debouncedTextRef.current.trim()!="") {
        //   console.log("nnn",suggestionRef.current);
        //   console.log("nnn",debouncedTextRef.current,text);
        //     const newKeystroke = {
        //       keystrokes: debouncedTextRef.current,
        //       results: suggestionRef.current,
        //       opted: suggestionRef.current.find((item) => item === debouncedTextRef.current) || debouncedTextRef.current,
        //       created_at: new Date().toISOString(),
        //     };
        //     newKeystrokesRef.current = newKeystroke
        //     if(newKeystrokesRef.current!=undefined){
        //       keystrokesRef.current = [...keystrokesRef.current, newKeystrokesRef.current];
        //     }
        //     console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
        //     const finalJson = {
        //       word: debouncedTextRef.current,
        //       steps: keystrokesRef.current,
        //     };
        //     localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
        // }
      }
      originalConsoleLog(...args);
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, [debouncedTextRef.current,prev,selectedLang.LangCode]);
  

  useEffect(() => { 
    if (debouncedTextRef.current.trim()!="" && suggestionRef.current.length>1) {
      console.log("nnn",suggestionRef.current);
      console.log("nnn",debouncedTextRef.current,text);
      const words = debouncedTextRef.current.split(/\s+/).filter(word => word.trim() !== "");

        const optedWord = suggestionRef.current.find((item) => item === words[words.length-1]) || "";

        const newKeystroke = {
          keystrokes: debouncedTextRef.current,
          results: suggestionRef.current,
          opted:optedWord,
          created_at: new Date().toISOString(),
        };
        newKeystrokesRef.current = newKeystroke
        if (
          keystrokesRef.current.length > 0 &&
          keystrokesRef.current[keystrokesRef.current.length - 1].keystrokes === newKeystroke.keystrokes
        ) {
          keystrokesRef.current[keystrokesRef.current.length - 1] = newKeystroke;
        } else {
          keystrokesRef.current = [...keystrokesRef.current, newKeystroke];
        }
        console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
        const finalJson = {
          word: debouncedTextRef.current,
          steps: keystrokesRef.current,
          language: selectedLang.LangCode!=undefined?selectedLang.LangCode:"hi",
        };
        localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
    }
  }, [suggestionRef.current,prev,selectedLang.LangCode]);

useEffect(()=>{
  if (isSpaceClicked) {
    json()
  }
},[isSpaceClicked])
const json=()=>{
  const api = localStorage.getItem('TransliterateLogging');
  const transliterateObj = new TransliterationAPI(JSON.parse(api));
  fetch(transliterateObj.apiEndPoint(), {
    method: "POST",
    body: JSON.stringify(transliterateObj.getBody()),
    headers: transliterateObj.getHeaders().headers,
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      else return await res.json();
    })
    .then((res) => {
      setSnackbarInfo({ open: true, message: res.message, variant: "success" });
      console.log("success");
    })
    .catch((err) => {
      setSnackbarInfo({ open: true, message: err.message, variant: "error" });
      console.log("error", err);
    });
}
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

    } else if ([4, 5, 6].includes(user.role)) {
      filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
      disableDraft = true;
      disableSkip = true;
      disableUpdate = true;
    }
    setAutoSave(!disableUpdate);
    setAnnotations(filteredAnnotations);
    setDisableBtns(disableDraft);
    setDisableUpdateButton(disableUpdate);
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
    !showNotes && setShowStdTranscript(false);
    setShowNotes(!showNotes);
  };


  useEffect(() => {
    const hasEmptyText = result?.some((element) => element.text?.trim() === "") || (stdTranscriptionSettings.showAcoustic && result?.some((element) => element.acoustic_normalised_text?.trim() === ""))
    const hasEmptySpeaker = result?.some(
      (element) => element.speaker_id?.trim() === ""
    );
    settextBox(hasEmptyText);
    setSpeakerBox(hasEmptySpeaker);
  }, [result]);

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

  const [isActive, setIsActive] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const inactivityThreshold = 120000; 

  useEffect(() => {
    if(!autoSave) return;
    const handleAutosave = async () => {
      const reqBody = {
        task_id: taskId,
        annotation_status: annotations[0]?.annotation_status,
        auto_save: true,
        lead_time:
          (new Date() - loadtime) / 1000 + Number(annotations[0]?.lead_time ?? 0),
        result: (stdTranscriptionSettings.enable ? [...result, { standardised_transcription: stdTranscription }] : result),
      };
      if (result.length && taskDetails?.annotation_users?.some((users) => users === user.id)) {
        const obj = new SaveTranscriptAPI(annotations[0]?.id, reqBody);
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
  }, [autoSave, user, result, taskId, annotations, taskDetails, stdTranscription, stdTranscriptionSettings, disableUpdateButton, isActive]);

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

    const sub = annotations[0]?.result.filter((item) => {
      if ("standardised_transcription" in item) {
        standardisedTranscription = item.standardised_transcription;
        return false;
      } else return true;
    }).map((item) => new Sub(item));

    setStdTranscription(standardisedTranscription);

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
      (item) => item?.startTime <= currentTime && item?.endTime > currentTime
    );
    setCurrentIndex(currentIndex);
  }, [currentTime, result]);

  useMemo(() => {
    result && setCurrentSubs(result[currentIndex]);
  }, [result, currentIndex]);

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
    }
  }, [AnnotationsTaskDetails]);

  /* useEffect(() => {
    if(Object.keys(user).includes("prefer_cl_ui") && !(user.prefer_cl_ui) && ProjectDetails?.metadata_json?.acoustic_enabled_stage > 1) {
      const changeUI = async() => {
        handleAutosave().then(navigate(`/projects/${projectId}/task/${taskId}`))
      };
      changeUI();
    }
  }, [user]); */

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
          getAnnotationsTaskData(rsp_data?.id);
          getTaskData(rsp_data?.id)
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
      annotation_notes: JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
      lead_time:
        (new Date() - loadtime) / 1000 + Number(lead_time?.lead_time ?? 0),
      result: (stdTranscriptionSettings.enable ? [...result, { standardised_transcription: stdTranscription }] : result),
    };
    if (["draft", "skipped"].includes(value) || (!textBox && !speakerBox && result?.length > 0)) {
      const TaskObj = new PatchAnnotationAPI(id, PatchAPIdata);
      // dispatch(APITransport(GlossaryObj));
      const res = await fetch(TaskObj.apiEndPoint(), {
        method: "PATCH",
        body: JSON.stringify(TaskObj.getBody()),
        headers: TaskObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        setAutoSave(false);
        if (localStorage.getItem("labelAll") || value === "skipped") {
          onNextAnnotation(resp.task);
        }
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
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
  };

  useEffect(() => {
    if (AnnotationsTaskDetails && AnnotationsTaskDetails.length > 0) {
      annotationNotesRef.current.value = AnnotationsTaskDetails[0].annotation_notes ?? "";
      reviewNotesRef.current.value = AnnotationsTaskDetails[0].review_notes ?? "";
      try {
        const newDelta2 = annotationNotesRef.current.value !== "" ? JSON.parse(annotationNotesRef.current.value) : "";
        annotationNotesRef.current.getEditor().setContents(newDelta2);
      } catch (err) {
        if(err){
          const newDelta2 = annotationNotesRef.current.value;
          annotationNotesRef.current.getEditor().setText(newDelta2);
        }
      }
      
      try {
        const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
        reviewNotesRef.current.getEditor().setContents(newDelta1);
      } catch (err) {
        if(err){
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
        // console.log(isPlaying(player));
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
            <Typography sx={{mt: 2, ml: 4, color: "grey"}}>
              Task #{taskDetails?.id}
              <LightTooltip
                title={assignedUsers ? assignedUsers : ""}
              >
                <InfoOutlinedIcon sx={{mb: "-4px", ml: "2px", color: "grey"}}/>
              </LightTooltip>
            </Typography>
            <AnnotationStageButtons
              handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
              disableBtns={disableBtns}
              disableUpdateButton={disableUpdateButton}
              disableSkipButton={disableSkipButton}
              filterMessage={filterMessage}
              taskData={taskData}
            />
            <AudioPanel
              setCurrentTime={setCurrentTime}
              setPlaying={setPlaying}
              handleAnnotationClick={handleAnnotationClick}
              onNextAnnotation={onNextAnnotation}
              AnnotationsTaskDetails={AnnotationsTaskDetails}
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
                // style={{ marginBottom: "20px" }}
                >
                  Notes {reviewtext.trim().length === 0 ? "" : "*"}
                </Button>


                {/*<div
                  className={classes.collapse}
                  style={{
                    display: showNotes ? "block" : "none",
                    paddingBottom: "16px",
                    overflow:"auto",
                    height: "100px"
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
              /> */}

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
                  
                </div>*/}
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
                  // onChangeText={() => { }}
                  onChangeText={(val) => {  setText(val)
                    setDebouncedText(val);
                    debouncedTextRef.current=val
                    if(!debouncedTextRef.current.toString().includes(debouncedText)){
                      setprev(true)
                    }
                    else{
                      setprev(false)
                    }
                    console.log("nnn",text,debouncedText,debouncedTextRef.current);
                    setIsSpaceClicked(text.endsWith(" "));
                  }}
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
            stage={1}
            handleStdTranscriptionSettings={setStdTranscriptionSettings}
            advancedWaveformSettings={advancedWaveformSettings}
            setAdvancedWaveformSettings={setAdvancedWaveformSettings}
          />
        </Grid>
      </Grid>

      <Grid
        width={"100%"}
        position="fixed"
        bottom={1}
      // style={fullscreen ? { visibility: "hidden" } : {}}
      >
        <Timeline currentTime={currentTime} playing={playing} taskID={taskData?.id} waveformSettings={waveformSettings}/>
      </Grid>
    </>
  );
};
export default AudioTranscriptionLandingPage;
