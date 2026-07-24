import React, { useCallback, useEffect, useLayoutEffect, useState, useRef, memo } from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Resizable } from "re-resizable";
import {
  addSubtitleBox,
  getSubtitleRangeTranscript,
  onMerge,
  onSplit,
  onSubtitleChange,
  onSubtitleDelete,
  timeChange,
  onUndoAction,
  onRedoAction,
  getSelectionStart,
  getTimings,
  getItemForDelete,
  MenuProps,
  assignSpeakerId,
  // getTagsList,
} from "../../../../utils/SubTitlesUtils";
import { langDict } from "./langDict";

//Styles
// import "../../../styles/scrollbarStyle.css";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import LanguageCode from "../../../../utils/LanguageCode";
import { TabsSuggestionData } from "../../../../utils/TabsSuggestionData/TabsSuggestionData";
import Spinner from "../../component/common/Spinner";

//Components
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
// import {
//   ConfirmDialog,
//   CustomizedSnackbars,
//   TagsSuggestionList,
//   TimeBoxes,
// } from "common";
import ConfirmDialog from "../../component/ConfirmDialog";
import ButtonComponent from "../../component/CL-Transcription/ButtonComponent";
import TimeBoxes from "./TimeBoxes";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
import TagsSuggestionList from "../../component/CL-Transcription/TagsSuggestionList";

// import SettingsButtonComponent from "./components/SettingsButtonComponent";

//APIs
import { setSubtitles } from "../../../../redux/actions/Common";
import C from "../../../../redux/constants";
import SettingsButtonComponent from "../../component/CL-Transcription/SettingsButtonComponent";
import SaveTranscriptAPI from "../../../../redux/actions/CL-Transcription/SaveTranscript";
import CustomizedSnackbars from "../../component/common/Snackbar";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
// import {
//   APITransport,
//   FetchTranscriptPayloadAPI,
//   SaveTranscriptAPI,
//   setSubtitles,
// } from "redux/actions";
import { IconButton, Tooltip } from "@mui/material";
import { Add, MoreVert, Remove } from "@material-ui/icons";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import configs from "../../../../config/config";

const languageTagMappings = {
  'ta': {
    'க': ['k-kh', 'k-g', 'k-gh', 'kh-k', 'kh-g', 'kh-gh', 'g-k', 'g-kh', 'g-gh', 'gh-k', 'gh-kh', 'gh-g'], // velar stops
    'ப': ['p-ph', 'p-b', 'p-bh', 'ph-p', 'ph-b', 'ph-bh', 'b-p', 'b-ph', 'b-bh', 'bh-p', 'bh-ph', 'bh-b'], // bilabial stops
    'த': ['t-th', 't-d', 't-dh', 'th-t', 'th-d', 'th-dh', 'd-t', 'd-th', 'd-dh', 'dh-t', 'dh-th', 'dh-d'], // dental stops
    'ட': ['T-TH', 'T-D', 'T-DH', 'TH-T', 'TH-D', 'TH-DH', 'D-T', 'D-TH', 'D-DH', 'DH-T', 'DH-TH', 'DH-D'], // retroflex stops
    'ச': ['s-ch', 's-cch', 'ch-s', 'ch-cch', 'cch-s', 'cch-ch'], // alveolar fricatives and affricate
    'ஜ': ['j-jh', 'jh-j'] // palatal affricate
  },
  'ml': {
    'ഫ': ['ph-f', 'f-ph'] // f vs ph
  },
  'mr': {
    'ज': ['z-j'],   // j vs z
    'झ': ['zh-jh'], // jh vs zh
    'च': ['ts-ch'], // ch vs ts
    'ஃப' /* not used */: undefined, // placeholder removed below
    'फ': ['ph-f']   // f vs ph
  },
  'en': {
    'ज़': ['zh-z', 'zh-j'] // zh vs z / j context-based
  }
};

const TAMIL_PULLI = "\u0BCD";
const tamilSeries = {
  'க': { nasal: 'ங', pair: ['k', 'g'], posSound: { init: 'k', gem: 'k', nas: 'g', vow: 'gh' } },
  'ப': { nasal: 'ம', pair: ['p', 'b'], posSound: { init: 'p', gem: 'p', nas: 'b', vow: 'b' } },
  'த': { nasal: 'ந', pair: ['t', 'd'], posSound: { init: 't', gem: 't', nas: 'd', vow: 'd' } },
  'ட': { nasal: 'ண', pair: ['T', 'D'], posSound: { init: 'T', gem: 'T', nas: 'D', vow: 'D' } },
  'ச': { nasal: 'ஞ', pair: ['s', 'ch'], posSound: { init: 's', gem: 'cch', nas: 'ch', vow: 's' } },
};

const detectCharPosition = (text, charIndex, baseChar) => {
  const prevChar = charIndex > 0 ? text[charIndex - 1] : null;
  if (prevChar === null || /\s/.test(prevChar) || /[.,!?;:]/.test(prevChar)) return 'init';
  if (prevChar === TAMIL_PULLI) {
    const beforePulli = charIndex > 1 ? text[charIndex - 2] : null;
    const series = tamilSeries[baseChar];
    if (beforePulli === baseChar) return 'gem';
    if (series && beforePulli === series.nasal) return 'nas';
  }
  return 'vow';
};

const getSuggestedTag = (baseChar, pos) => {
  const s = tamilSeries[baseChar];
  if (!s) return null;
  const likely = s.posSound[pos];
  const [a, b] = s.pair;
  if (likely === b) return `${b}-${a}`;
  if (likely === a) return `${a}-${b}`;
  return `${likely}-${a}`;
};
const getWordTagInfo = (text, coreWordStart, coreWordEnd, mappings) => {
  const taggableCharIndexes = [];
  for (let i = coreWordStart; i < coreWordEnd; i++) {
    if (mappings[text[i]]) taggableCharIndexes.push(i);
  }
  const tagZoneMatch = text.slice(coreWordEnd).match(/^(?:\s*<[^>]*>)*/);
  const tagZoneStr = tagZoneMatch[0];
  const tagZoneEnd = coreWordEnd + tagZoneStr.length;
  const tokens = tagZoneStr.match(/<[^>]+>/g) || [];
  return { taggableCharIndexes, tagZoneStr, tagZoneEnd, tokens };
};

const VIRAMA_CHARS = new Set([
  '\u094D', // Devanagari virama
  '\u0BCD', // Tamil pulli
  '\u0D4D', // Malayalam chandrakkala
  '\u0C4D', // Telugu virama
  '\u0CCD', // Kannada virama
  '\u09CD', // Bengali virama
  '\u0ACD', // Gujarati virama
  '\u0A4D', // Gurmukhi virama
  '\u0B4D', // Oriya virama
]);

const getSyllableClusterLength = (text, startIndex, mappings) => {
  let i = startIndex + 1;
  while (i < text.length) {
    let marksEnd = i;
    while (marksEnd < text.length && /\p{M}/u.test(text[marksEnd])) {
      marksEnd++;
    }
    if (marksEnd === i) break; // no combining marks here - cluster is done

    const endedOnVirama = VIRAMA_CHARS.has(text[marksEnd - 1]);
    const nextChar = text[marksEnd];
    const nextIsLetter = marksEnd < text.length && /\p{L}/u.test(nextChar);
    const nextIsIndependentlyTaggable = nextIsLetter && !!mappings[nextChar];

    if (endedOnVirama && nextIsLetter && !nextIsIndependentlyTaggable) {
      i = marksEnd + 1;
      continue;
    }

    i = marksEnd;
    break;
  }
  return i - startIndex;
};

const getCharIndexAtPoint = (textarea, clientX, clientY) => {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");

  const propsToCopy = [
    "boxSizing", "width",
    "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
    "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
    "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing",
    "lineHeight", "textTransform", "wordSpacing", "tabSize",
  ];
  propsToCopy.forEach((p) => { mirror.style[p] = style[p]; });

  const rect = textarea.getBoundingClientRect();
  mirror.style.position = "fixed";
  mirror.style.top = `${rect.top}px`;
  mirror.style.left = `${rect.left}px`;
  mirror.style.height = `${textarea.clientHeight}px`;
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "hidden";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.margin = "0";
  mirror.style.zIndex = "-1";

  const text = textarea.value || "";
  const spans = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "\n") {
      mirror.appendChild(document.createElement("br"));
      spans.push(null);
      continue;
    }
    const span = document.createElement("span");
    span.textContent = ch;
    mirror.appendChild(span);
    spans.push(span);
  }

  document.body.appendChild(mirror);
  mirror.scrollTop = textarea.scrollTop;
  mirror.scrollLeft = textarea.scrollLeft;

  let foundIndex = -1;
  for (let i = 0; i < spans.length; i++) {
    const span = spans[i];
    if (!span) continue;
    const r = span.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
      foundIndex = i;
      break;
    }
  }

  document.body.removeChild(mirror);
  return foundIndex;
};

const TranscriptionRightPanel = ({
  currentIndex,
  AnnotationsTaskDetails,
  ProjectDetails,
  TaskDetails,
  stage,
  handleStdTranscriptionSettings,
  advancedWaveformSettings,
  setAdvancedWaveformSettings,
  waveSurfer,
  setWaveSurfer,
  annotationId,
  handleOpenPopover
}) => {
  const { taskId } = useParams();

  const classes = AudioTranscriptionLandingStyle();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const xl = useMediaQuery("(min-width:1800px)");

  // const taskData = useSelector((state) => state.getTaskDetails.data);
  const assignedOrgId = JSON.parse(localStorage.getItem("userData"))
    ?.organization?.id;
  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const player = useSelector((state) => state.commonReducer.player);
  const currentPage = useSelector((state) => state.commonReducer.currentPage);

  const limit = useSelector((state) => state.commonReducer.limit);
  // const videoDetails = useSelector((state) => state.getVideoDetails.data);
  const [targetlang, settargetlang] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  //console.log(subtitles);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = subtitles;
  // const currentPageData = subtitles?.slice(startIndex, endIndex);
  const idxOffset = itemsPerPage * (page - 1);
  const showAcousticText =
    (ProjectDetails?.project_type === "AcousticNormalisedTranscriptionEditing"  ||
    ProjectDetails?.project_type == 'VerbatimTranscriptionCharacterTagging') &&
    ProjectDetails?.metadata_json?.acoustic_enabled_stage <= stage;
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [showPopOver, setShowPopOver] = useState(false);
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(
    JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))
      ?.enableTransliteration || false
  );
  const [enableRTL_Typing, setRTL_Typing] = useState(
    JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))
      ?.enableRTL_Typing || false
  );
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(
    JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))
      ?.fontSize || "large"
  );
  const [currentOffset, setCurrentOffset] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showSpeakerIdDropdown, setShowSpeakerIdDropdown] = useState([]);
  const [speakerIdList, setSpeakerIdList] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
  const [tagSuggestionsAnchorEl, setTagSuggestionsAnchorEl] = useState(null);
  const [tagSuggestionsAcoustic, setTagSuggestionsAcoustic] = useState(false);
  const [hash, sethash] = useState(() => JSON.parse(sessionStorage.getItem("hash")) || false);
  const [tagSuggestionList, setTagSuggestionList] = useState([]);
  const [textWithoutTripleDollar, setTextWithoutTripleDollar] = useState("");
  const [textAfterTripleDollar, setTextAfterTripleDollar] = useState("");
  
  const [enableTransliterationSuggestion, setEnableTransliterationSuggestion] =
    useState(true);
  const [taskData, setTaskData] = useState([]);
  const AnnotationStage = localStorage.getItem("Stage") === "annotation";
  const SuperCheckerStage =
    localStorage.getItem("SuperCheckerStage") === "superChecker";
  const parentScrollOffsetX = useRef(0);
  const parentScrollOffsetY = useRef(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState(false);
  const [pauseOnType, setPauseOnType] = useState(true);
  const textRefs = useRef([]);
  const [currentTextRefIdx, setCurrentTextRefIdx] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const langDictSet = new Set(langDict[targetlang]);
  const [charTagMappings, setCharTagMappings] = useState({});
  const [isVCTCProject, setIsVCTCProject] = useState(false);
  const [charTagPopoverOpen, setCharTagPopoverOpen] = useState(false);
  const [charTagAnchorEl, setCharTagAnchorEl] = useState(null);
  const [charTagMappingsData, setCharTagMappingsData] = useState([]);
  const [charTagSelectedText, setCharTagSelectedText] = useState('');
  const [charTagIndex, setCharTagIndex] = useState(null);
  const [charTagOnSelect, setCharTagOnSelect] = useState(null);
  const [charTagSuggested, setCharTagSuggested] = useState(null);
  const [charTagCurrentSelected, setCharTagCurrentSelected] = useState(null);
  const [charTagAssignments, setCharTagAssignments] = useState({});
  const [charTagClickPos, setCharTagClickPos] = useState(null);
  const [charTagPopoverStyle, setCharTagPopoverStyle] = useState(null);
  const charTagPopoverRef = useRef(null);

  useEffect(() => {
    currentPageData?.length &&
      (textRefs.current = textRefs.current.slice(
        0,
        (showAcousticText ? 2 : 1) * currentPageData.length
      ));
  }, [showAcousticText, currentPageData]);

  useEffect(() => {
    if (AnnotationStage) {
      let Annotation = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 1
      )[0];
      setTaskData(Annotation);
    } else if (SuperCheckerStage) {
      let superchecker = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 3
      )[0];
      setTaskData(superchecker);
    } else {
      let review = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 2
      )[0];
      setTaskData(review);
    }
  }, [AnnotationsTaskDetails]);

  useEffect(() => {
    if (TaskDetails) {
      const speakerList = TaskDetails?.data?.speakers_json?.map((speaker) => {
        return speaker;
      });
      setSpeakerIdList(speakerList);
      // setShowSpeakerIdDropdown(videoDetails?.video?.multiple_speaker);
    }
  }, [TaskDetails]);

  useEffect(() => {
    if (currentPage) {
      setCurrentOffset(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (currentIndex >= startIndex) {
      // if(currentIndex >= startIndex && currentIndex <= endIndex) {
      const subtitleScrollEle = document.getElementById("subTitleContainer");
      subtitleScrollEle
        .querySelector(`#sub_${currentIndex}`)
        ?.scrollIntoView(true, { block: "start" });
    }

    // if (currentIndex > startIndex) {
    //   const copySub = [...subtitles];
    //   let sub = copySub[currentIndex - 1]
    //   let replacedValue = sub.text.replace(/\[[a-zA-Z_-]+\]/g, '');
    //   let splitText = replacedValue.split(" ");
    //   let invalidCharFlag = 0;
    //   let invalidWords = [];
    //   splitText.forEach((e) => {
    //     if (RegExp("\<[a-zA-Z\s,_-]+\>").test(e)) {
    //       if (e.length > 2) {
    //         if (!TabsSuggestionData.includes(e.slice(1, -1))) {
    //           invalidCharFlag = 1;
    //           invalidWords.push(e);
    //       }
    //       } else {
    //         invalidCharFlag = 1;
    //         invalidWords.push(e);
    //       }
    //     }else{
    //       let wordSet = new Set(e);
    //       if (([...wordSet].every(char => langDictSet.has(char))) === false) {
    //         invalidCharFlag = 1;
    //         invalidWords.push(e);
    //       }
    //     }
    //   });
    //   if(sub.acoustic_normalised_text.length > 0){
    //     let replacedANValue = sub.acoustic_normalised_text.replace(/\[[a-zA-Z]\]/g, '');
    //     let splitANText = replacedANValue.split(" ");
    //     splitANText.forEach((e) => {
    //       if (RegExp("\<[a-zA-Z\s,_-]+\>").test(e)) {
    //         if (e.length > 2) {
    //           if (!TabsSuggestionData.includes(e.slice(1, -1))) {
    //             invalidCharFlag = 1;
    //             invalidWords.push(e);
    //       }
    //         } else {
    //           invalidCharFlag = 1;
    //           invalidWords.push(e);
    //       }
    //       } else {
    //         let wordSet = new Set(e);
    //         if (([...wordSet].every(char => langDictSet.has(char))) === false) {
    //           invalidCharFlag = 1;
    //           invalidWords.push(e);
    //       }
    //       }
    //     });
    //   }
    //   if (invalidCharFlag) {
    //     setSnackbarInfo({
    //       open: true,
    //       message: "Characters belonging to other language are used: "+invalidWords.join(", "),
    //       variant: "error",
    //     });
    //   }
    // }
  }, [currentIndex]);

  useEffect(() => {
    if (showAcousticText) {
      handleStdTranscriptionSettings({
        //set enable:true to enable standardised_transcription
        enable: false,
        showAcoustic: true,
        rtl: enableRTL_Typing,
        enableTransliteration:
          ProjectDetails?.tgt_language !== "en" && enableTransliteration,
        enableTransliterationSuggestion,
        targetlang,
        fontSize,
      });
    }
  }, [
    showAcousticText,
    ProjectDetails,
    enableRTL_Typing,
    enableTransliteration,
    enableTransliterationSuggestion,
    targetlang,
    fontSize,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "1") {
        event.preventDefault();
        localStorage.setItem(
          "userCustomTranscriptionSettings",
          JSON.stringify({
            ...JSON.parse(
              localStorage.getItem("userCustomTranscriptionSettings")
            ),
            enableTransliteration: !enableTransliteration,
          })
        );
        setTransliteration(!enableTransliteration);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enableTransliteration, setTransliteration]);

  // Check for VCTC project and load character tag mappings
  useEffect(() => {

    if (ProjectDetails?.project_type === 'VerbatimTranscriptionCharacterTagging') {
      setIsVCTCProject(true);
      
      const matchedLang = LanguageCode.languages.find(
        (lang) => lang.active && lang.label === ProjectDetails?.tgt_language
      );
      const langCode = matchedLang?.code;

      if (langCode && languageTagMappings[langCode]) {
        setCharTagMappings(languageTagMappings[langCode]);
      }
    } else {
      setIsVCTCProject(false);
      setCharTagMappings({});
    }
  }, [ProjectDetails]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (charTagPopoverOpen && charTagAnchorEl) {
        const popover = document.querySelector('.char-tag-popover');
        if (popover && !popover.contains(event.target) && event.target !== charTagAnchorEl) {
          setCharTagPopoverOpen(false);
          setCharTagAnchorEl(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [charTagPopoverOpen, charTagAnchorEl]);

  // Local handler for character tagging popover
  const charTagTimeoutRef = useRef(null);

  const handleCharTagPopover = (data) => {
    // Clear any pending timeout
    if (charTagTimeoutRef.current) {
      clearTimeout(charTagTimeoutRef.current);
      charTagTimeoutRef.current = null;
    }

    // If data is null, close the popover after a delay
    if (!data) {
      charTagTimeoutRef.current = setTimeout(() => {
        setCharTagPopoverOpen(false);
        setCharTagAnchorEl(null);
        charTagTimeoutRef.current = null;
      }, 300);
      return;
    }

    // Check if anchorEl exists
    if (!data.anchorEl) return;

    // Store the data in state
    setCharTagAnchorEl(data.anchorEl);
    setCharTagMappingsData(data.mappings || []);
    setCharTagSelectedText(data.selectedText || '');
    setCharTagIndex(data.index || 0);
    setCharTagOnSelect(() => data.onTagSelect || null);
    setCharTagSuggested(data.suggestedTag || null);
    setCharTagCurrentSelected(data.currentTag || null);
    setCharTagClickPos(data.position || null);
    setCharTagPopoverOpen(true);
  };

  // Re-measures the popover's actual rendered size and clamps it to the
  // viewport, flipping above the click point if there's no room below.
  useLayoutEffect(() => {
    if (!charTagPopoverOpen || !charTagClickPos || !charTagPopoverRef.current) return;
    const popEl = charTagPopoverRef.current;
    const pw = popEl.offsetWidth;
    const ph = popEl.offsetHeight;
    const margin = 8;

    let left = charTagClickPos.x - pw / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - pw - margin));

    let top = charTagClickPos.y + 18;
    if (top + ph > window.innerHeight - margin) {
      top = charTagClickPos.y - ph - 12;
    }
    top = Math.max(margin, top);

    setCharTagPopoverStyle({ top, left });
  }, [charTagPopoverOpen, charTagClickPos, charTagMappingsData]);

  const getPayload = (offset = currentOffset, lim = limit) => {
    const payloadObj = new GetAnnotationsTaskAPI(
      taskId
      // taskData.task_type,
      // offset,
      // lim
    );
    dispatch(APITransport(payloadObj));
  };

  const prevOffsetRef = useRef(currentOffset);
  useEffect(() => {
    if (prevOffsetRef.current !== currentOffset) {
      setUndoStack([]);
      setRedoStack([]);
      prevOffsetRef.current = currentOffset;
    }
    getPayload(currentOffset, limit);
    // eslint-disable-next-line
  }, [limit, currentOffset]);

  const onMergeClick = useCallback(
    (index) => {
      const selectionStart = getSelectionStart(index);
      const timings = getTimings(index);

      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "merge",
          index: index,
          timings,
          selectionStart,
        },
      ]);
      setRedoStack([]);

      const sub = onMerge(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, true, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onMouseUp = (e, blockIdx) => {
    if (e.target.selectionStart < e.target.value?.length) {
      e.preventDefault();
      setShowPopOver(true);
      setCurrentIndexToSplitTextBlock(blockIdx);
      setSelectionStart(e.target.selectionStart);
    }
  };

  const onSplitClick = useCallback(() => {
    setUndoStack((prevState) => [
      ...prevState,
      {
        type: "split",
        index: currentIndexToSplitTextBlock,
        selectionStart,
      },
    ]);
    setRedoStack([]);
    const sub = onSplit(currentIndexToSplitTextBlock, selectionStart);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, true, sub);

    // eslint-disable-next-line
  }, [currentIndexToSplitTextBlock, selectionStart, limit, currentOffset]);
// Add this helper function for multi-hypothesis processing
const processMultiHypothesisText = (value) => {
  // match word|word ... ONLY when followed by a space or end of line
  const pattern = /(?<!{)(\b[^<>{}\s]+\s*\|\s*[^<>{}\s]+\b(?:\s*\|\s*[^<>{}\s]+\b)*)(?=\s)/g;

  return value?.replace(pattern, (match) => {
    // already wrapped or noise-tagged -> leave as-is
    if (match.startsWith("{") || match.includes("<")) return match;

    return `{${match}}`;
  });
};


const processNoiseTags = (value) => {
  if (!value) return value;
   console.log(value);
   
  value = value.replace(/<+\s*([^<>]+?)\s*>+/g, (match, inner) => {
    return `<${inner.trim()}>`;
  });

  // 2) Auto-wrap valid noise words from tagSuggestionList
  const noiseList = TabsSuggestionData.map(tag => tag.toLowerCase());

  // word boundary safe for multilingual text
  const noiseRegex = new RegExp(`\\b(${noiseList.join("|")})\\b`, "gi");

  value = value.replace(noiseRegex, (m) => `<${m.toLowerCase()}>`);

  // 3) Collapse duplicates again to guarantee single pair
  value = value.replace(/<+\s*([^<>]+?)\s*>+/g, (match, inner) => {
    return `<${inner.trim().toLowerCase()}>`;
  });

  return value;
};
    const formatMultiHypothesis = () => {
  const elementsWithBoxHighlightClass = document.getElementsByClassName(
    classes.boxHighlight
  );

  for (let i = 0; i < elementsWithBoxHighlightClass.length; i++) {
    const textArea = elementsWithBoxHighlightClass[i];
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = textArea.value.substring(start, end);

    if (selectedText.trim() !== "") {
      // Check if it already contains |
      if (selectedText.includes('|')) {
        const parts = selectedText.split('|').map(part => part.trim());
        const formattedText = `{${parts.join(' | ')}}`;
        
        // Replace the selected text with formatted version
        replaceSelectedText(formattedText, currentIndexToSplitTextBlock, i);
        
        setUndoStack((prevState) => [
          ...prevState,
          {
            type: "multiHypothesisFormat",
            index: i,
            originalText: selectedText,
            formattedText: formattedText,
          },
        ]);
        setRedoStack([]);
      }
    }
  }
};
  const handleCharacterTagSelection = (subIndex, charIndex, tag, isL1 = false) => {
    const sub = [...subtitles];
    const fieldKey = isL1 ? 'text' : 'acoustic_normalised_text';
    const text = sub[subIndex]?.[fieldKey] || '';

    if (charIndex === null || charIndex < 0 || charIndex >= text.length) {
      console.warn("Invalid character index for tagging:", charIndex);
      return;
    }

    let coreWordStart = charIndex;
    while (
      coreWordStart > 0 &&
      !/\s/.test(text[coreWordStart - 1]) &&
      text[coreWordStart - 1] !== '>'
    ) coreWordStart--;
    let coreWordEnd = charIndex;
    while (
      coreWordEnd < text.length &&
      !/\s/.test(text[coreWordEnd]) &&
      text[coreWordEnd] !== '<'
    ) coreWordEnd++;

    const { taggableCharIndexes, tagZoneEnd, tokens } = getWordTagInfo(
      text,
      coreWordStart,
      coreWordEnd,
      charTagMappings
    );

    // This character's position among ALL taggable characters of the word,
    // in left-to-right order. The K-th tag in the group belongs to the
    // K-th taggable character, so this character already has a tag exactly
    // when its rank falls within the tokens already present.
    const rank = taggableCharIndexes.indexOf(charIndex);
    const alreadyTagged = rank !== -1 && rank < tokens.length;

    // Determine if the clicked character/syllable is already wrapped in braces
    let openBraceIndex = -1;
    let closeBraceIndex = -1;
    for (let i = charIndex - 1; i >= coreWordStart; i--) {
      if (text[i] === '{') { openBraceIndex = i; break; }
      if (text[i] === '}' || text[i] === '<' || text[i] === '>') break;
    }
    for (let i = charIndex; i < coreWordEnd; i++) {
      if (text[i] === '}') { closeBraceIndex = i; break; }
      if (text[i] === '{' || text[i] === '<' || text[i] === '>') break;
    }
    const alreadyWrapped = openBraceIndex !== -1 && closeBraceIndex !== -1 && openBraceIndex < closeBraceIndex;

    const currentTagClean = alreadyTagged ? tokens[rank].replace(/^<|>$/g, '').trim().toLowerCase() : '';
    const targetTagClean = (tag || '').trim().toLowerCase();

    // Deselect feature: Clicking the tag that is already assigned removes it
    if (alreadyTagged && currentTagClean === targetTagClean) {
      tokens.splice(rank, 1);

      let workingText = text;
      let workingCoreWordEnd = coreWordEnd;
      let workingTagZoneEnd = tagZoneEnd;

      if (alreadyWrapped) {
        workingText =
          workingText.slice(0, openBraceIndex) +
          workingText.slice(openBraceIndex + 1, closeBraceIndex) +
          workingText.slice(closeBraceIndex + 1);
        workingCoreWordEnd -= 2;
        workingTagZoneEnd -= 2;
      }

      const newTagZone = tokens.length > 0 ? tokens.map((t) => ` ${t}`).join('') : '';
      const newText =
        workingText.slice(0, workingCoreWordEnd) +
        newTagZone +
        workingText.slice(workingTagZoneEnd);

      // Record state in undoStack for Ctrl+Z / Undo support
      setUndoStack((prevState) => [
        ...prevState,
        {
          type: isL1 ? "textChange" : "textChangeAcoustic",
          index: subIndex,
          previousText: text,
          updateAcoustic: !isL1,
        },
      ]);
      setRedoStack([]);

      sub[subIndex] = { ...sub[subIndex], [fieldKey]: newText };
      dispatch(setSubtitles(sub, C.SUBTITLES));

      setCharTagPopoverOpen(false);
      setCharTagAnchorEl(null);
      if (charTagTimeoutRef.current) {
        clearTimeout(charTagTimeoutRef.current);
        charTagTimeoutRef.current = null;
      }
      return;
    }

    const clusterLength = getSyllableClusterLength(text, charIndex, charTagMappings);
    let workingText = text;
    let workingCoreWordEnd = coreWordEnd;
    let workingTagZoneEnd = tagZoneEnd;

    if (rank !== -1 && !alreadyWrapped) {
      workingText =
        workingText.slice(0, charIndex) +
        '{' + workingText.slice(charIndex, charIndex + clusterLength) + '}' +
        workingText.slice(charIndex + clusterLength);
      workingCoreWordEnd += 2;
      workingTagZoneEnd += 2;
    }

    if (alreadyTagged) {
      // Replace this character's existing tag in place.
      tokens[rank] = `<${tag}>`;
    } else if (rank !== -1) {
      if (rank < tokens.length) {
        // Replace tag at rank so only one tag per syllable exists
        tokens[rank] = `<${tag}>`;
      } else {
        // Insert new tag at rank
        tokens.splice(rank, 0, `<${tag}>`);
      }
    } else {
      tokens.push(`<${tag}>`);
    }
    const newTagZone = tokens.map((t) => ` ${t}`).join('');

    const newText = workingText.slice(0, workingCoreWordEnd) + newTagZone + workingText.slice(workingTagZoneEnd);

    // Record state in undoStack for Ctrl+Z / Undo support
    setUndoStack((prevState) => [
      ...prevState,
      {
        type: isL1 ? "textChange" : "textChangeAcoustic",
        index: subIndex,
        previousText: text,
        updateAcoustic: !isL1,
      },
    ]);
    setRedoStack([]);

    sub[subIndex] = { ...sub[subIndex], [fieldKey]: newText };
    dispatch(setSubtitles(sub, C.SUBTITLES));

    // Close popover
    setCharTagPopoverOpen(false);
    setCharTagAnchorEl(null);
    if (charTagTimeoutRef.current) {
      clearTimeout(charTagTimeoutRef.current);
      charTagTimeoutRef.current = null;
    }
  };

  const handleTextareaClick = (event, subIndex, isL1) => {
    if (!isVCTCProject) return;

    const textarea = event.target;
    const charIndex = getCharIndexAtPoint(textarea, event.clientX, event.clientY);

    if (charIndex === -1) {
      handleCharTagPopover(null);
      return;
    }

    const charAtCursor = textarea.value[charIndex] || '';

    if (charAtCursor && charTagMappings[charAtCursor]) {
      // Select exactly that character so the native selection highlight
      // gives visual feedback for which letter was picked.
      textarea.setSelectionRange(charIndex, charIndex + 1);
      const mappings = charTagMappings[charAtCursor];

      // Clear any pending timeout
      if (charTagTimeoutRef.current) {
        clearTimeout(charTagTimeoutRef.current);
        charTagTimeoutRef.current = null;
      }

      const pos = detectCharPosition(textarea.value, charIndex, charAtCursor);
      const suggested = getSuggestedTag(charAtCursor, pos);

      // Look up whether this character already has a tag, derived fresh
      // from the current text (see getWordTagInfo) so it's correct even
      // right after a page refresh, when there is no in-memory record of
      // previous tagging left to consult.
      let coreWordStart = charIndex;
      while (
        coreWordStart > 0 &&
        !/\s/.test(textarea.value[coreWordStart - 1]) &&
        textarea.value[coreWordStart - 1] !== '>'
      ) coreWordStart--;
      let coreWordEnd = charIndex;
      while (
        coreWordEnd < textarea.value.length &&
        !/\s/.test(textarea.value[coreWordEnd]) &&
        textarea.value[coreWordEnd] !== '<'
      ) coreWordEnd++;
      const { taggableCharIndexes, tokens } = getWordTagInfo(
        textarea.value,
        coreWordStart,
        coreWordEnd,
        charTagMappings
      );
      const rank = taggableCharIndexes.indexOf(charIndex);
      const currentTag =
        rank !== -1 && rank < tokens.length ? tokens[rank].replace(/^<|>$/g, '') : null;

      handleCharTagPopover({
        anchorEl: textarea,
        mappings: mappings,
        selectedText: charAtCursor,
        index: subIndex,
        position: { x: event.clientX, y: event.clientY },
        suggestedTag: suggested,
        currentTag: currentTag,
        onTagSelect: (tag) => {
          handleCharacterTagSelection(subIndex, charIndex, tag, isL1);
        }
      });
    } else {
      handleCharTagPopover(null);
    }
  };

const changeTranscriptHandler = (event, index, updateAcoustic = false) => {
  const { value: eventValue } = event.target;
  const { currentTarget } = event;

  let value = eventValue;
  const oldText = updateAcoustic
    ? subtitles[index]?.acoustic_normalised_text || ""
    : subtitles[index]?.text || "";

  // value = processMultiHypothesisText(value);
  
  // Apply noise tag processing

  if (updateAcoustic && !(ProjectDetails?.metadata_json?.copy_l1_to_l2 ?? true)) {
    const verbatimText = subtitles[index]?.text || "";
    const verbatimNoiseTags = (verbatimText.match(/<[^>]+>/g) || []).length;
    const acousticNoiseTags = (value.match(/<[^>]+>/g) || []).length;
    if (verbatimNoiseTags > 0 && acousticNoiseTags !== verbatimNoiseTags) {
      setSnackbarInfo({
        open: true,
        message: `Validation Error: L1 has ${verbatimNoiseTags} noise tag(s) but L2 has ${acousticNoiseTags}. All noise tags from L1 must be copied to L2.`,
        variant: "error",
      });
    }
  }

  if (oldText !== value) {
    setUndoStack((prevState) => [
      ...prevState,
      {
        type: updateAcoustic ? "textChangeAcoustic" : "textChange",
        index: index,
        previousText: oldText,
        updateAcoustic: updateAcoustic,
      },
    ]);
    setRedoStack([]);
  }

    const containsTripleDollar = value.includes("$$$");

    // setEnableTransliterationSuggestion(true);
    if (value.includes("$$")) {
      setEnableTransliterationSuggestion(false);
    } else {
      setEnableTransliterationSuggestion(true);
    }

    if (containsTripleDollar) {
      // setEnableTransliterationSuggestion(false);

      const textBeforeTab = value.split("$$$")[0];
      const textAfterTab = value.split("$$$")[1].split("").join("");
      setCurrentSelectedIndex(index);
      setTagSuggestionsAnchorEl(currentTarget);
      setTextWithoutTripleDollar(textBeforeTab);
      setTextAfterTripleDollar(textAfterTab);
      setCurrentTextRefIdx(
        index + (updateAcoustic ? currentPageData?.length : 0)
      );
      setCurrentSelection(event.target.selectionEnd);
      setTagSuggestionsAcoustic(updateAcoustic);
    }
    const sub = onSubtitleChange(value, index, updateAcoustic, false);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);
  };

  const populateAcoustic = (index) => {
    if( ProjectDetails?.metadata_json?.copy_l1_to_l2 ?? true){
      const sub = onSubtitleChange("", index, false, true);
      dispatch(setSubtitles(sub, C.SUBTITLES));
    };
  };

  const saveTranscriptHandler = async (isFinal) => {
    setLoading(true);

    const reqBody = {
      task_id: taskId,
      annotation_status: taskData?.annotation_status,
      // offset: currentOffset,
      // limit: limit,
      result: [{ subtitles }],
    };
    const obj = new SaveTranscriptAPI(taskData?.id, reqBody);
    const res = await fetch(obj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });

      setLoading(false);
    } else {
      setLoading(false);
      setSnackbarInfo({
        open: true,
        message: "Failed",
        variant: "error",
      });
    }
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

  const handleTimeChange = useCallback(
    (value, index, type, time) => {
      const sub = timeChange(value, index, type, time);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, true, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onDelete = useCallback(
    (index) => {
      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "delete",
          index: index,
          data: getItemForDelete(index),
        },
      ]);
      setRedoStack([]);

      const sub = onSubtitleDelete(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, false, sub);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );
  const replaceSelectedText = (text, index, id) => {
    const textarea = document.getElementsByClassName(classes.boxHighlight)[id];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeSelection = textarea.value.substring(0, start);
    const afterSelection = textarea.value.substring(end, textarea.value.length);

    textarea.value = beforeSelection + text + afterSelection;
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;

    textarea.focus();

    const sub = onSubtitleChange(textarea.value, index, id);
    dispatch(setSubtitles(sub, C.SUBTITLES));
  };

  const handleDoubleHashes = () => {
     
    const elementsWithBoxHighlightClass = document.getElementsByClassName(
      classes.boxHighlight
    );

    let index = "";
    for (let i = 0; i < elementsWithBoxHighlightClass.length; i++) {
      const textVal = elementsWithBoxHighlightClass[i];
      const cursorStart = textVal.selectionStart;
      const cursorEnd = textVal.selectionEnd;
      const selectedText = textVal.value.substring(cursorStart, cursorEnd);

      if (selectedText !== "") {
        index = i;
        const doubleHashedText = `##${selectedText}##`;

        replaceSelectedText(doubleHashedText, currentIndexToSplitTextBlock, index);
        setUndoStack((prevState) => [
          ...prevState,
          {
            type: "doubleHash",
            index: i,
            originalText: selectedText,
            hashedText: doubleHashedText,
          },
        ]);
        setRedoStack([]);
      }
    }

  };


  const addNewSubtitleBox = useCallback(
    (index) => {
      const sub = addSubtitleBox(index);
      dispatch(setSubtitles(sub, C.SUBTITLES));
      // saveTranscriptHandler(false, false, sub);

      setUndoStack((prevState) => [
        ...prevState,
        {
          type: "add",
          index: index,
        },
      ]);
      setRedoStack([]);
    },
    // eslint-disable-next-line
    [limit, currentOffset]
  );

  const onUndo = useCallback(() => {
    if (undoStack?.length > 0) {
      const lastAction = undoStack[undoStack.length - 1];

      if (lastAction.type === "textChange") {
        // Handle verbatim text undo
        const currentText = subtitles[lastAction.index]?.text || "";

        const sub = onSubtitleChange(
          lastAction.previousText,
          lastAction.index,
          false // updateAcoustic flag
        );
        dispatch(setSubtitles(sub, C.SUBTITLES));

        setRedoStack((prevState) => [
          ...prevState,
          {
            type: "textChange",
            index: lastAction.index,
            previousText: currentText,
            updateAcoustic: false,
          },
        ]);
      } else if (lastAction.type === "textChangeAcoustic") {
        // Handle acoustic text undo
        const currentText =
          subtitles[lastAction.index]?.acoustic_normalised_text || "";

        const sub = onSubtitleChange(
          lastAction.previousText,
          lastAction.index,
          true // updateAcoustic flag
        );
        dispatch(setSubtitles(sub, C.SUBTITLES));

        setRedoStack((prevState) => [
          ...prevState,
          {
            type: "textChangeAcoustic",
            index: lastAction.index,
            previousText: currentText,
            updateAcoustic: true,
          },
        ]);
      } else if (lastAction.type === "doubleHash") {
        // Undo double-hash action
        const elementsWithBoxHighlightClass = document.getElementsByClassName(
          classes.boxHighlight
        );
        const textArea = elementsWithBoxHighlightClass[lastAction.index];
        if (textArea) {
          textArea.value = textArea.value.replace(
            lastAction.hashedText,
            lastAction.originalText
          );

          const sub = onSubtitleChange(
            textArea.value,
            currentIndexToSplitTextBlock,
            lastAction.index
          );
          dispatch(setSubtitles(sub, C.SUBTITLES));
        }

        setRedoStack((prevState) => [...prevState, lastAction]);
      } else {
        // Handle other action types
        const sub = onUndoAction(lastAction);
        dispatch(setSubtitles(sub, C.SUBTITLES));
        setRedoStack((prevState) => [...prevState, lastAction]);
      }

      // Always pop from undo stack
      setUndoStack((prev) => prev.slice(0, prev.length - 1));
    }
  }, [
    undoStack,
    subtitles,
    dispatch,
    currentIndexToSplitTextBlock,
    classes.boxHighlight,
  ]);

  const onRedo = useCallback(() => {
    if (redoStack?.length > 0) {
      const lastAction = redoStack[redoStack.length - 1];

      if (lastAction.type === "textChange") {
        // Handle verbatim text redo
        const currentText = subtitles[lastAction.index]?.text || "";

        // Redo text change
        const sub = onSubtitleChange(
          lastAction.previousText,
          lastAction.index,
          false
        );
        dispatch(setSubtitles(sub, C.SUBTITLES));

        // Push undo version of this action
        setUndoStack((prevState) => [
          ...prevState,
          {
            type: "textChange",
            index: lastAction.index,
            previousText: currentText,
            updateAcoustic: false
          },
        ]);
      }
      else if (lastAction.type === "textChangeAcoustic") {
        // Handle acoustic text redo
        const currentText = subtitles[lastAction.index]?.acoustic_normalised_text || "";

        const sub = onSubtitleChange(
          lastAction.previousText,
          lastAction.index,
          true // updateAcoustic flag
        );
        dispatch(setSubtitles(sub, C.SUBTITLES));

        setUndoStack((prevState) => [
          ...prevState,
          {
            type: "textChangeAcoustic",
            index: lastAction.index,
            previousText: currentText,
            updateAcoustic: true
          },
        ]);
      }

      else if (lastAction.type === "doubleHash") {
        // Redo double-hash action
        const elementsWithBoxHighlightClass = document.getElementsByClassName(
          classes.boxHighlight
        );
        const textArea = elementsWithBoxHighlightClass[lastAction.index];
        if (textArea) {
          textArea.value = textArea.value.replace(
            lastAction.originalText,
            lastAction.hashedText
          );

          const sub = onSubtitleChange(
            textArea.value,
            currentIndexToSplitTextBlock,
            lastAction.index
          );
          dispatch(setSubtitles(sub, C.SUBTITLES));
        }

        setUndoStack((prevState) => [...prevState, lastAction]);
      }

      else {
        // Redo other actions
        const sub = onRedoAction(lastAction);
        dispatch(setSubtitles(sub, C.SUBTITLES));
        setUndoStack((prevState) => [...prevState, lastAction]);
      }

      // Remove from redo stack
      setRedoStack((prev) => prev.slice(0, prev.length - 1));
    }
  }, [redoStack, subtitles, dispatch, currentIndexToSplitTextBlock, classes.boxHighlight]);

  useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "z") {
          event.preventDefault();
          onUndo();
        } else if (event.ctrlKey && event.key === "y") {
          event.preventDefault();
          onRedo();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [onUndo, onRedo]);

  const targetLength = (index) => {
    if (subtitles[index]?.text?.trim() !== "")
      return subtitles[index]?.text?.trim()?.split(" ")?.length;
    return 0;
  };

  const onNavigationClick = (value) => {
    getPayload(value, limit);
  };

  const handleSpeakerChange = (id, index) => {
    const sub = assignSpeakerId(id, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);
  };

  useEffect(() => {
    const language = LanguageCode.languages;

    if (ProjectDetails) {
      const filtereddata = language.filter(
        (el) => el.label === ProjectDetails?.tgt_language
      );
      settargetlang(filtereddata[0]?.code);
    }
  }, [ProjectDetails]);

  useEffect(() => {
    if (taskData?.result?.length > 0) {
      setLoading(false);
    }
  }, [taskData]);

  useEffect(() => {
    if (subtitles !== undefined) setTotalSegments(subtitles.length);
  }, [subtitles]);

  const toggleAdditionalOptions = () => {
    setShowAdditionalOptions(!showAdditionalOptions);
  };

  useEffect(() => {
    const autoGrowTextareas = (className) => {
      const textareas = document.querySelectorAll(`.${className}`);
      textareas.forEach((textarea, index) => {
        document.getElementById(`${index}_resizable`).style.height = `${
          textarea.scrollHeight + 99
        }px`;
      });
    };

    const delay = 1500;
    const timer = setTimeout(() => {
      autoGrowTextareas("auto-resizable-textarea");
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {" "}
      {loading && <Spinner />}
      {renderSnackBar()}
      <Grid sx={{ margin: 0 }}>
        <Box
          className={classes.rightPanelParentBox}
          style={{ position: "relative" }}
        >
          <Grid className={classes.rightPanelParentGrid}>
            <SettingsButtonComponent
              totalSegments={totalSegments}
              formatMultiHypothesis={formatMultiHypothesis}
              setTransliteration={setTransliteration}
              enableTransliteration={enableTransliteration}
              setRTL_Typing={setRTL_Typing}
              enableRTL_Typing={enableRTL_Typing}
              setFontSize={setFontSize}
              fontSize={fontSize}
              handleDoubleHashes={handleDoubleHashes}
              sethash={sethash}
              hash={hash}
              ProjectDetails={ProjectDetails}
              saveTranscriptHandler={saveTranscriptHandler}
              setOpenConfirmDialog={setOpenConfirmDialog}
              onUndo={onUndo}
              onRedo={onRedo}
              undoStack={undoStack}
              redoStack={redoStack}
              onSplitClick={onSplitClick}
              showPopOver={showPopOver}
              showSplit={true}
              subtitles={subtitles}
              advancedWaveformSettings={advancedWaveformSettings}
              setAdvancedWaveformSettings={setAdvancedWaveformSettings}
              waveSurfer={waveSurfer}
              setWaveSurfer={setWaveSurfer}
              pauseOnType={pauseOnType}
              setPauseOnType={setPauseOnType}
              annotationId={annotationId}
              handleOpenPopover={handleOpenPopover}
            />
          </Grid>
          {showAcousticText && (
            <Grid
              style={{
                display: "flex",
                direction: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                backgroundColor: "rgb(44, 39, 153, 0.2)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  p: 1,
                  color: "rgb(44, 39, 153)",
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Verbatim Transcription
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  p: 1,
                  color: "rgb(44, 39, 153)",
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Semantic (L2) Transcription
              </Typography>
            </Grid>
          )}
        </Box>

        <Box
          id={"subTitleContainer"}
          className={classes.subTitleContainer}
          sx={{
            height: showAcousticText
              ? "calc(102vh - 380px)"
              : "calc(102vh - 385px)",
            alignItems: "center",
          }}
        >
          {currentPageData?.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Resizable
                  bounds="parent"
                  default={{ height: "240px" }}
                  minHeight="240px"
                  id={`${index}_resizable`}
                  enable={{
                    top: false,
                    right: false,
                    bottom: true,
                    left: false,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                  }}
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    marginTop: index === 0 ? "0px" : "-16px",
                  }}
                  onResizeStart={(e, dir, ref) => {
                    parentScrollOffsetX.current =
                      ref.parentElement?.scrollLeft || 0;
                    parentScrollOffsetY.current =
                      ref.parentElement?.scrollTop || 0;
                  }}
                  onResize={(e, dir, ref, d) => {
                    ref.parentElement.scrollTo(
                      parentScrollOffsetX.current,
                      parentScrollOffsetY.current
                    );
                  }}
                  handleStyles={{ bottom: { height: "24px" } }}
                >
                  <Box
                    key={index}
                    id={`sub_${index}`}
                    style={{
                      borderBottom: "1px solid lightgray",
                      backgroundColor:
                        index % 2 === 0
                          ? "rgb(214, 238, 255)"
                          : "rgb(233, 247, 239)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                    }}
                  >
                    <Box
                      className={classes.topBox}
                      style={{
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingTop: "14px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "block",
                          height: "30px",
                          width: "90px",
                          lineHeight: "30px",
                          borderRadius: "50%",
                          fontSize: "medium",
                          backgroundColor: "#2C2799",
                          color: "white",
                          marginRight: "20px",
                          marginLeft: "5px",
                        }}
                      >
                        {index + 1}
                      </div>

                      <TimeBoxes
                        handleTimeChange={handleTimeChange}
                        time={item.start_time}
                        index={index + idxOffset}
                        type={"startTime"}
                      />

                      <FormControl
                        sx={{
                          width: "50%",
                          mr: "auto",
                          float: "left",
                          marginRight: "10px",
                        }}
                        size="small"
                      >
                        <InputLabel id="select-speaker">
                          Select Speaker
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="select-speaker"
                          label="Select Speaker"
                          value={item.speaker_id}
                          onChange={(event) =>
                            handleSpeakerChange(
                              event.target.value,
                              index + idxOffset
                            )
                          }
                          style={{
                            backgroundColor: "#fff",
                            textAlign: "left",
                            height: "32px",
                          }}
                          inputProps={{
                            "aria-label": "Without label",
                            style: { textAlign: "left" },
                          }}
                          MenuProps={MenuProps}
                        >
                          {speakerIdList?.map((speaker, index) => (
                            <MenuItem key={index} value={speaker.name}>
                              {speaker.name} ({speaker.gender})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {showAdditionalOptions ? (
                        <Tooltip
                          title="Hide Additional Options"
                          placement="bottom"
                        >
                          <IconButton
                            className={classes.optionIconBtn}
                            style={{
                              color: "#000",
                              backgroundColor: "#fff",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              toggleAdditionalOptions();
                            }}
                          >
                            <Remove />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title="Show Additional Options"
                          placement="bottom"
                        >
                          <IconButton
                            className={classes.optionIconBtn}
                            style={{
                              color: "#000",
                              backgroundColor: "#fff",
                              borderRadius: "50%",
                              marginRight: "10px",
                            }}
                            onClick={() => {
                              toggleAdditionalOptions();
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      )}

                      {showAdditionalOptions && (
                        <ButtonComponent
                          index={index + idxOffset}
                          lastItem={index + idxOffset < subtitles?.length - 1}
                          onMergeClick={onMergeClick}
                          onDelete={onDelete}
                          addNewSubtitleBox={addNewSubtitleBox}
                        />
                      )}

                      <TimeBoxes
                        handleTimeChange={handleTimeChange}
                        time={item.end_time}
                        index={index + idxOffset}
                        type={"endTime"}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        display: "flex",
                        padding: "8px 10px",
                        height: "100%",
                        gap: "8px",
                      }}
                      className={classes.cardContent}
                      aria-describedby={"suggestionList"}
                      onClick={() => {
                        if (pauseOnType && player) {
                          player.pause();
                          if (
                            player.currentTime < item.startTime ||
                            player.currentTime > item.endTime
                          ) {
                            player.currentTime = item.startTime + 0.001;
                          }
                        }
                      }}
                    >
                      {ProjectDetails?.tgt_language !== "en" &&
                      enableTransliteration ? (
                        <IndicTransliterate
                          customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                          apiKey={`JWT ${localStorage.getItem(
                            "shoonya_access_token"
                          )}`}
                          lang={targetlang}
                          value={item.text}
                          onChange={(event) => {
                            changeTranscriptHandler(
                              event,
                              index + idxOffset,
                              false
                            );
                          }}
                          enabled={enableTransliterationSuggestion}
                          onChangeText={() => {}}
                          onDoubleClick={(event)=>{
                            const textarea = textRefs.current[index]
                            console.log(textarea);
                            if(textarea){
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const selectedText = textarea.value.substring(start,end)

                              if (selectedText.trim().length > 0) {
                                const trimmedText = selectedText.trim();
                                if (trimmedText !== selectedText) {
                                  const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                  const newStart = start + leadingSpaces;
                                  const newEnd = newStart + trimmedText.length;

                                  textarea.setSelectionRange(newStart, newEnd);
                                }
                              }

                            }


                          }}

                          onKeyDown={(event) => {
                            console.log(event,"log",document.activeElement);

                            if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                              const textArea = textRefs.current[index];
                              console.log("helo");

                              if (textArea) {
                                const start = textArea.selectionStart;
                                const end = textArea.selectionEnd;

                                const newStart = Math.max(start - 1, 0);
                                textArea.setSelectionRange(newStart, end);
                                event.preventDefault(); 
                              }
                            }
                            else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                              const textArea = textRefs.current[index];
                              if (textArea) {
                                const start = textArea.selectionStart;
                                const end = textArea.selectionEnd;

                                const newEnd = Math.min(end + 1, textArea.value.length);
                                textArea.setSelectionRange(start, newEnd);


                                event.preventDefault(); 
                              }
                            }
                          }}

                          onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                          containerStyles={{ width: "100%", height: "100%" }}
                          onBlur={() => {
                            setTimeout(() => {
                              setShowPopOver(false);
                            }, 200);
                          }}
                          style={{ fontSize: fontSize, height: "100%" }}
                          renderComponent={(props) => {
                            textRefs.current[index] = props.ref.current;
                            return (
                              <div
                                className={classes.relative}
                                style={{ width: "100%", height: "100%" }}
                              >
                                <textarea
                                  className={`${classes.customTextarea} ${
                                    currentIndex === idxOffset + index
                                      ? classes.boxHighlight
                                      : ""
                                  }`}
                                  dir={enableRTL_Typing ? "rtl" : "ltr"}
                                  onDoubleClick={(event)=>{
                                    const textarea = textRefs.current[index]
                                    console.log(textarea);
                                    if(textarea){
                                      const start = textarea.selectionStart
                                      const end = textarea.selectionEnd
                                      const selectedText = textarea.value.substring(start,end)
        
                                      if (selectedText.trim().length > 0) {
                                        const trimmedText = selectedText.trim();
                                        if (trimmedText !== selectedText) {
                                          const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                          const newStart = start + leadingSpaces;
                                          const newEnd = newStart + trimmedText.length;
        
                                          textarea.setSelectionRange(newStart, newEnd);
                                        }
                                      }
        
                                    }
        
        
                                  }}
        
                                  onKeyDown={(event) => {
                                    console.log(event,"log",document.activeElement);
        
                                    if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                                      const textArea = textRefs.current[index];
                                      console.log("helo");
        
                                      if (textArea) {
                                        const start = textArea.selectionStart;
                                        const end = textArea.selectionEnd;
        
                                        const newStart = Math.max(start - 1, 0);
                                        textArea.setSelectionRange(newStart, end);
                                        event.preventDefault(); 
                                      }
                                    }
                                    else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                                      const textArea = textRefs.current[index];
                                      if (textArea) {
                                        const start = textArea.selectionStart;
                                        const end = textArea.selectionEnd;
        
                                        const newEnd = Math.min(end + 1, textArea.value.length);
                                        textArea.setSelectionRange(start, newEnd);
        
        
                                        event.preventDefault(); 
                                      }
                                    }
                                  }}
        
                                  onMouseUp={(e) =>
                                    onMouseUp(e, index + idxOffset)
                                  }
                                  onBlur={() => {
                                    setTimeout(() => {
                                      setShowPopOver(false);
                                    }, 200);
                                  }}
                                  {...props}
                                  onClick={(event) => {
                                    if (props.onClick) props.onClick(event);
                                    handleTextareaClick(event, index + idxOffset, true);
                                  }}
                                />
                                {/* <span id="charNum" className={classes.wordCount}>
                        {targetLength(index)}
                      </span> */}
                              </div>
                            );
                          }}
                        />
                      ) : (
                        <div
                          className={classes.relative}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <textarea
                            ref={(el) => (textRefs.current[index] = el)}
                            // onChange={(event) => {
                            onInput={(event) => {
                              changeTranscriptHandler(
                                event,
                                index + idxOffset,
                                false
                              );
                            }}
                            onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                            onDoubleClick={(event)=>{
                              const textarea = textRefs.current[index]
                              console.log(textarea);
                              if(textarea){
                                const start = textarea.selectionStart
                                const end = textarea.selectionEnd
                                const selectedText = textarea.value.substring(start,end)
  
                                if (selectedText.trim().length > 0) {
                                  const trimmedText = selectedText.trim();
                                  if (trimmedText !== selectedText) {
                                    const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                    const newStart = start + leadingSpaces;
                                    const newEnd = newStart + trimmedText.length;
  
                                    textarea.setSelectionRange(newStart, newEnd);
                                  }
                                }
  
                              }
  
  
                            }}
  
                            onKeyDown={(event) => {
                              console.log(event,"log",document.activeElement);
  
                              if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                                const textArea = textRefs.current[index];
                                console.log("helo");
  
                                if (textArea) {
                                  const start = textArea.selectionStart;
                                  const end = textArea.selectionEnd;
  
                                  const newStart = Math.max(start - 1, 0);
                                  textArea.setSelectionRange(newStart, end);
                                  event.preventDefault(); 
                                }
                              }
                              else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                                const textArea = textRefs.current[index];
                                if (textArea) {
                                  const start = textArea.selectionStart;
                                  const end = textArea.selectionEnd;
  
                                  const newEnd = Math.min(end + 1, textArea.value.length);
                                  textArea.setSelectionRange(start, newEnd);
  
  
                                  event.preventDefault(); 
                                }
                              }
                            }}
  
                            value={item.text}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            className={`auto-resizable-textarea ${
                              classes.customTextarea
                            } ${
                              currentIndex === idxOffset + index
                                ? classes.boxHighlight
                                : ""
                            }`}
                            style={{ fontSize: fontSize, height: "100%" }}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200);
                            }}
                             onClick={(event) => {
                               handleTextareaClick(event, index + idxOffset, true);
                             }}
                          />
                          {/* <span id="charNum" className={classes.wordCount}>
                        {targetLength(index)}
                      </span> */}
                        </div>
                      )}
                      {showAcousticText &&
                        (ProjectDetails?.tgt_language !== "en" &&
                        enableTransliteration ? (
                          <IndicTransliterate
                            customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                            apiKey={`JWT ${localStorage.getItem(
                              "shoonya_access_token"
                            )}`}
                            lang={targetlang}
                            value={item.acoustic_normalised_text}
                            onDoubleClick={(event)=>{
                              const textarea = textRefs.current[index]
                              console.log(textarea);
                              if(textarea){
                                const start = textarea.selectionStart
                                const end = textarea.selectionEnd
                                const selectedText = textarea.value.substring(start,end)
  
                                if (selectedText.trim().length > 0) {
                                  const trimmedText = selectedText.trim();
                                  if (trimmedText !== selectedText) {
                                    const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                    const newStart = start + leadingSpaces;
                                    const newEnd = newStart + trimmedText.length;
  
                                    textarea.setSelectionRange(newStart, newEnd);
                                  }
                                }
  
                              }
  
  
                            }}
  
                            onKeyDown={(event) => {
                              console.log(event,"log",document.activeElement);
  
                              if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                                const textArea = textRefs.current[index];
                                console.log("helo");
  
                                if (textArea) {
                                  const start = textArea.selectionStart;
                                  const end = textArea.selectionEnd;
  
                                  const newStart = Math.max(start - 1, 0);
                                  textArea.setSelectionRange(newStart, end);
                                  event.preventDefault(); 
                                }
                              }
                              else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                                const textArea = textRefs.current[index];
                                if (textArea) {
                                  const start = textArea.selectionStart;
                                  const end = textArea.selectionEnd;
  
                                  const newEnd = Math.min(end + 1, textArea.value.length);
                                  textArea.setSelectionRange(start, newEnd);
  
  
                                  event.preventDefault(); 
                                }
                              }
                            }}
  
                            onChange={(event) => {
                              changeTranscriptHandler(
                                event,
                                index + idxOffset,
                                true
                              );
                            }}
                            enabled={enableTransliterationSuggestion}
                            onChangeText={() => {}}
                            containerStyles={{ width: "100%", height: "100%" }}
                            style={{ fontSize: fontSize, height: "100%" }}
                            renderComponent={(props) => {
                              textRefs.current[
                                index + currentPageData?.length
                              ] = props.ref.current;
                              return (
                                <div
                                  className={classes.relative}
                                  style={{ width: "100%", height: "100%" }}
                                >
                                  <textarea
                                    className={`${classes.customTextarea} ${
                                      currentIndex === idxOffset + index
                                        ? classes.boxHighlight
                                        : ""
                                    }`}
                                    dir={enableRTL_Typing ? "rtl" : "ltr"}
                                    onDoubleClick={(event)=>{
                                      const textarea = textRefs.current[index]
                                      console.log(textarea);
                                      if(textarea){
                                        const start = textarea.selectionStart
                                        const end = textarea.selectionEnd
                                        const selectedText = textarea.value.substring(start,end)
          
                                        if (selectedText.trim().length > 0) {
                                          const trimmedText = selectedText.trim();
                                          if (trimmedText !== selectedText) {
                                            const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                            const newStart = start + leadingSpaces;
                                            const newEnd = newStart + trimmedText.length;
          
                                            textarea.setSelectionRange(newStart, newEnd);
                                          }
                                        }
          
                                      }
          
          
                                    }}
          
                                    onKeyDown={(event) => {
                                      console.log(event,"log",document.activeElement);
          
                                      if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                                        const textArea = textRefs.current[index];
                                        console.log("helo");
          
                                        if (textArea) {
                                          const start = textArea.selectionStart;
                                          const end = textArea.selectionEnd;
          
                                          const newStart = Math.max(start - 1, 0);
                                          textArea.setSelectionRange(newStart, end);
                                          event.preventDefault(); 
                                        }
                                      }
                                      else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                                        const textArea = textRefs.current[index];
                                        if (textArea) {
                                          const start = textArea.selectionStart;
                                          const end = textArea.selectionEnd;
          
                                          const newEnd = Math.min(end + 1, textArea.value.length);
                                          textArea.setSelectionRange(start, newEnd);
          
          
                                          event.preventDefault(); 
                                        }
                                      }
                                    }}
          
                                    onFocus={() =>
                                      showAcousticText &&
                                      populateAcoustic(index + idxOffset)
                                    }
                                     {...props}
                                     onClick={(event) => {
                                       handleTextareaClick(event, index + idxOffset, false);
                                     }}
                                     onMouseLeave={() => {
                                      if (handleCharTagPopover) {
                                        handleCharTagPopover(null);
                                      }
                                    }}
                                  />
                                </div>
                              );
                            }}
                          />
                        ) : (
                          <div
                            className={classes.relative}
                            style={{ width: "100%", height: "100%" }}
                          >
                            <textarea
                              ref={(el) =>
                                (textRefs.current[
                                  index + currentPageData?.length
                                ] = el)
                              }
                              onChange={(event) => {
                                changeTranscriptHandler(
                                  event,
                                  index + idxOffset,
                                  true
                                );
                              }}
                              onDoubleClick={(event)=>{
                                const textarea = textRefs.current[index]
                                console.log(textarea);
                                if(textarea){
                                  const start = textarea.selectionStart
                                  const end = textarea.selectionEnd
                                  const selectedText = textarea.value.substring(start,end)
    
                                  if (selectedText.trim().length > 0) {
                                    const trimmedText = selectedText.trim();
                                    if (trimmedText !== selectedText) {
                                      const leadingSpaces = selectedText.length - selectedText.trimStart().length;
                                      const newStart = start + leadingSpaces;
                                      const newEnd = newStart + trimmedText.length;
    
                                      textarea.setSelectionRange(newStart, newEnd);
                                    }
                                  }
    
                                }
    
    
                              }}
    
                              onKeyDown={(event) => {
                                console.log(event,"log",document.activeElement);
    
                                if ( event.ctrlKey && event.shiftKey && event.key === "<") {
                                  const textArea = textRefs.current[index];
                                  console.log("helo");
    
                                  if (textArea) {
                                    const start = textArea.selectionStart;
                                    const end = textArea.selectionEnd;
    
                                    const newStart = Math.max(start - 1, 0);
                                    textArea.setSelectionRange(newStart, end);
                                    event.preventDefault(); 
                                  }
                                }
                                else if (event.ctrlKey && event.shiftKey && event.key === ">") {
                                  const textArea = textRefs.current[index];
                                  if (textArea) {
                                    const start = textArea.selectionStart;
                                    const end = textArea.selectionEnd;
    
                                    const newEnd = Math.min(end + 1, textArea.value.length);
                                    textArea.setSelectionRange(start, newEnd);
    
    
                                    event.preventDefault(); 
                                  }
                                }
                              }}
    
                              onFocus={() =>
                                      showAcousticText &&
                                      populateAcoustic(index + idxOffset)
                                    }
                              value={item.acoustic_normalised_text}
                              dir={enableRTL_Typing ? "rtl" : "ltr"}
                              className={`${classes.customTextarea} ${
                                currentIndex === idxOffset + index
                                  ? classes.boxHighlight
                                  : ""
                              }`}
                              style={{ fontSize: fontSize, height: "100%" }}
                                       onClick={(event) => {
                                handleTextareaClick(event, index + idxOffset, false);
                              }}
                            />
                          </div>
                        ))}
                    </CardContent>
                  </Box>
                </Resizable>
                <div
                  style={{
                    color: "grey",
                    zIndex: 100,
                    marginTop: "-16px",
                    borderRadius: "100%",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                    backgroundColor: "white",
                    height: "32px",
                    width: "32px",
                    pointerEvents: "none",
                  }}
                >
                  <UnfoldMoreOutlinedIcon sx={{ mt: "3px" }} />
                </div>
              </React.Fragment>
            );
          })}
        </Box>
        {openConfirmDialog && (
          <ConfirmDialog
            openDialog={openConfirmDialog}
            handleClose={() => setOpenConfirmDialog(false)}
            submit={() => saveTranscriptHandler(true)}
            message={"Do you want to submit the transcript?"}
            loading={loading}
          />
        )}
        {Boolean(tagSuggestionsAnchorEl) && (
          <TagsSuggestionList
            TabsSuggestionData={TabsSuggestionData}
            tagSuggestionsAnchorEl={tagSuggestionsAnchorEl}
            setTagSuggestionList={setTagSuggestionList}
            index={currentSelectedIndex}
            filteredSuggestionByInput={tagSuggestionList}
            setTagSuggestionsAnchorEl={setTagSuggestionsAnchorEl}
            textWithoutTripleDollar={textWithoutTripleDollar}
            textAfterTripleDollar={textAfterTripleDollar}
            setEnableTransliterationSuggestion={
              setEnableTransliterationSuggestion
            }
            tagSuggestionsAcoustic={tagSuggestionsAcoustic}
            currentSelection={currentSelection}
            ref={textRefs.current[currentTextRefIdx]}
          />
        )}
        {/* Character Tagging Popover */}
{/* Character Tagging Popover */}
{charTagPopoverOpen && charTagAnchorEl && charTagMappingsData.length > 0 && (
  <div
    ref={charTagPopoverRef}
    className="char-tag-popover"
    style={{
      position: 'fixed',
      top: charTagPopoverStyle?.top ?? (charTagClickPos?.y ?? 0) + 18,
      left: charTagPopoverStyle?.left ?? (charTagClickPos?.x ?? 0),
      visibility: charTagPopoverStyle ? 'visible' : 'hidden',
      backgroundColor: 'white',
      border: '2px solid #2C2799',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      padding: '8px',
      zIndex: 99999,
      minWidth: '180px',
      maxWidth: '260px',
      maxHeight: '260px',
      overflowY: 'auto',
    }}
    onMouseEnter={() => {
      // Clear close timeout when mouse enters popover
      if (charTagTimeoutRef.current) {
        clearTimeout(charTagTimeoutRef.current);
        charTagTimeoutRef.current = null;
      }
    }}
    onMouseLeave={() => {
      // Close popover when mouse leaves popover
      setCharTagPopoverOpen(false);
      setCharTagAnchorEl(null);
    }}
  >
    <div style={{ 
      padding: '6px 12px', 
      fontWeight: 'bold', 
      borderBottom: '2px solid #2C2799',
      color: '#2C2799',
      fontSize: '14px',
      marginBottom: '4px',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
    }}>
      Tag for "{charTagSelectedText}"
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {charTagMappingsData.map((tag, idx) => {
        const isSelected = tag === charTagCurrentSelected;
        const isSuggested = !charTagCurrentSelected && tag === charTagSuggested;
        return (
          <div
            key={idx}
            title={isSelected ? 'Currently selected tag (click to deselect)' : (isSuggested ? 'Suggested for this position' : undefined)}
            style={{
              padding: '6px 10px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'all 0.2s',
              fontSize: '13px',
              fontFamily: 'monospace',
              backgroundColor: isSelected ? '#d6336c' : (isSuggested ? '#e8e0ff' : '#f8f8f8'),
              color: isSelected ? '#fff' : 'inherit',
              border: isSelected ? '1.5px solid #d6336c' : (isSuggested ? '1.5px solid #2C2799' : '1px solid transparent'),
            }}
            onMouseEnter={(e) => {
              if (isSelected) return;
              e.currentTarget.style.backgroundColor = '#e8e0ff';
              e.currentTarget.style.borderColor = '#2C2799';
            }}
            onMouseLeave={(e) => {
              if (isSelected) return;
              e.currentTarget.style.backgroundColor = isSuggested ? '#e8e0ff' : '#f8f8f8';
              e.currentTarget.style.borderColor = isSuggested ? '#2C2799' : 'transparent';
            }}
            onClick={() => {
              console.log("Tag clicked:", tag);
              if (charTagOnSelect) {
                charTagOnSelect(tag);
              }
              setCharTagPopoverOpen(false);
              setCharTagAnchorEl(null);
              if (charTagTimeoutRef.current) {
                clearTimeout(charTagTimeoutRef.current);
                charTagTimeoutRef.current = null;
              }
            }}
          >
            <code style={{ fontSize: '14px' }}>{tag}</code>
            {isSelected ? (
              <span style={{ marginLeft: 4, fontSize: 10 }}>●</span>
            ) : isSuggested ? (
              <span style={{ marginLeft: 4, fontSize: 10, color: '#2C2799' }}>●</span>
            ) : null}
          </div>
        );
      })}
    </div>
  </div>
)}
      </Grid>
    </>
  );
};

export default memo(TranscriptionRightPanel);
