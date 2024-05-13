import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Resizable } from 're-resizable';
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

//Styles
// import "../../../styles/scrollbarStyle.css";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import LanguageCode from "../../../../utils/LanguageCode";
import { TabsSuggestionData } from "../../../../utils/TabsSuggestionData/TabsSuggestionData";
import Spinner from "../../component/common/Spinner";

//Components
import {
  Box,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  Pagination,
  Typography
} from "@mui/material";
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
import UnfoldMoreOutlinedIcon from '@mui/icons-material/UnfoldMoreOutlined';
// import {
//   APITransport,
//   FetchTranscriptPayloadAPI,
//   SaveTranscriptAPI,
//   setSubtitles,
// } from "redux/actions";
import { IconButton, Tooltip } from "@mui/material";
import { Add, MoreVert, Remove } from "@material-ui/icons";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";

const StandarisedisedTranscriptionEditing = ({
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
  const idxOffset = (itemsPerPage * (page - 1));
  const showAcousticText = ProjectDetails?.project_type === "AcousticNormalisedTranscriptionEditing" && ProjectDetails?.metadata_json?.acoustic_enabled_stage <= stage;
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [showPopOver, setShowPopOver] = useState(false);
  const [selectionStart, setSelectionStart] = useState();
  const [currentIndexToSplitTextBlock, setCurrentIndexToSplitTextBlock] =
    useState();
  const [enableTransliteration, setTransliteration] = useState(JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))?.enableTransliteration || false);
  const [enableRTL_Typing, setRTL_Typing] = useState(JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))?.enableRTL_Typing || false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(JSON.parse(localStorage.getItem("userCustomTranscriptionSettings"))?.fontSize || "large");
  const [currentOffset, setCurrentOffset] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showSpeakerIdDropdown, setShowSpeakerIdDropdown] = useState([]);
  const [speakerIdList, setSpeakerIdList] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
  const [tagSuggestionsAnchorEl, setTagSuggestionsAnchorEl] = useState(null);
  const [tagSuggestionsAcoustic, setTagSuggestionsAcoustic] = useState(false);
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

  useEffect(() => {
    currentPageData?.length && (textRefs.current = textRefs.current.slice(0, (showAcousticText ? 2 : 1) * currentPageData.length));
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
    if(currentIndex >= startIndex) {
      // if(currentIndex >= startIndex && currentIndex <= endIndex) {
      const subtitleScrollEle = document.getElementById("subTitleContainer");
      subtitleScrollEle
        .querySelector(`#sub_${currentIndex}`)
        ?.scrollIntoView(true, { block: "start" });
    }
  }, [currentIndex]);

  useEffect(() => {
    if(showAcousticText) {
      handleStdTranscriptionSettings({
        //set enable:true to enable standardised_transcription
        enable: false,
        showAcoustic: true,
        rtl: enableRTL_Typing,
        enableTransliteration: ProjectDetails?.tgt_language !== "en" && enableTransliteration,
        enableTransliterationSuggestion,
        targetlang,
        fontSize,
      });
    }
  }, [showAcousticText, ProjectDetails, enableRTL_Typing, enableTransliteration, enableTransliterationSuggestion, targetlang, fontSize]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "1") {
        event.preventDefault();
        localStorage.setItem("userCustomTranscriptionSettings",JSON.stringify({...JSON.parse(localStorage.getItem("userCustomTranscriptionSettings")),"enableTransliteration":!enableTransliteration}))
        setTransliteration(!enableTransliteration);
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableTransliteration, setTransliteration]);  

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

  const changeTranscriptHandler = (event, index, updateAcoustic = false) => {
    const {
      target: { value },
      currentTarget,
    } = event;

    const containsTripleDollar = value.includes("$$$");

    // setEnableTransliterationSuggestion(true);
    if (value.includes("$$")) {
      setEnableTransliterationSuggestion(false);
    }
    else {
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
      setCurrentTextRefIdx(index + (updateAcoustic ? currentPageData?.length : 0));
      setCurrentSelection(event.target.selectionEnd);
      setTagSuggestionsAcoustic(updateAcoustic);
    }
    const sub = onSubtitleChange(value, index, updateAcoustic, false);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);
  };

  const populateAcoustic = (index) => {
    const sub = onSubtitleChange("", index, false, true);
    dispatch(setSubtitles(sub, C.SUBTITLES));
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
      //getting last last action performed by user
      const lastAction = undoStack[undoStack?.length - 1];

      // modifing subtitles based on last action
      const sub = onUndoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));

      //removing the last action from undo and putting in redo stack
      setUndoStack(undoStack.slice(0, undoStack?.length - 1));
      setRedoStack((prevState) => [...prevState, lastAction]);
    }

    // eslint-disable-next-line
  }, [undoStack, redoStack]);

  const onRedo = useCallback(() => {
    if (redoStack?.length > 0) {
      //getting last last action performed by user
      const lastAction = redoStack[redoStack?.length - 1];

      // modifing subtitles based on last action
      const sub = onRedoAction(lastAction);
      dispatch(setSubtitles(sub, C.SUBTITLES));

      //removing the last action from redo and putting in undo stack
      setRedoStack(redoStack.slice(0, redoStack?.length - 1));
      setUndoStack((prevState) => [...prevState, lastAction]);
    }

    // eslint-disable-next-line
  }, [undoStack, redoStack]);

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
    if(subtitles !== undefined)
    setTotalSegments(subtitles.length);
  }, [subtitles]);

  const toggleAdditionalOptions = () => {
    setShowAdditionalOptions(!showAdditionalOptions);
  };

  useEffect(() => {
    const autoGrowTextareas = (className) => {
      const textareas = document.querySelectorAll(`.${className}`);
      textareas.forEach((textarea, index) => {
        document.getElementById(`${index}_resizable`).style.height=`${textarea.scrollHeight+99}px`;
      });
    };

    const delay = 1500;
    const timer = setTimeout(() => {
      autoGrowTextareas('auto-resizable-textarea');
    }, delay);

    return () => clearTimeout(timer);
  }, []);

if(currentPageData)
  {
    console.log("currentPageData", currentPageData)
  }

let updatedProjectData = []
if (currentPageData?.length) {
  updatedProjectData = [{
    start_time: currentPageData[0].start_time,
    end_time: currentPageData[currentPageData.length - 1].end_time,
    text: currentPageData.map((item) => item.text)
  }]
}
  if(currentPageData)
    {
      console.log("updatedPageData", updatedProjectData)
    }
 
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
              setTransliteration={setTransliteration}
              enableTransliteration={enableTransliteration}
              setRTL_Typing={setRTL_Typing}
              enableRTL_Typing={enableRTL_Typing}
              setFontSize={setFontSize}
              fontSize={fontSize}
              saveTranscriptHandler={saveTranscriptHandler}
              setOpenConfirmDialog={setOpenConfirmDialog}
              onUndo={onUndo}
              onRedo={onRedo}
              undoStack={undoStack}
              redoStack={redoStack}
              onSplitClick={onSplitClick}
              showPopOver={showPopOver}
              showSplit={true}
              advancedWaveformSettings={advancedWaveformSettings}
              setAdvancedWaveformSettings={setAdvancedWaveformSettings}
              waveSurfer={waveSurfer}
              setWaveSurfer={setWaveSurfer}
              pauseOnType={pauseOnType}
              setPauseOnType={setPauseOnType}
              annotationId={annotationId}
            />
          </Grid>
          {showAcousticText && <Grid
            style={{
              display: "flex",
              direction: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              backgroundColor: "rgb(44, 39, 153, 0.2)"}}>
            <Typography
              variant="caption"
              sx={{p:1, color:"rgb(44, 39, 153)", borderRadius : 2, fontWeight: 600, fontSize: "0.85rem" }}>
                Verbatim Transcription
              </Typography>
            <Typography
              variant="caption"
              sx={{p:1, color:"rgb(44, 39, 153)", borderRadius : 2, fontWeight: 600, fontSize: "0.85rem" }}>
                Semantic (L2) Transcription 
            </Typography>
          </Grid>}
          </Box>

          <Box id={"subTitleContainer"} className={classes.subTitleContainer} sx={{
            height: showAcousticText ? "calc(102vh - 380px)" : "calc(102vh - 385px)",
            alignItems: "center",
          }}>

          
          {updatedProjectData?.map((item, index) => {
            return (
              <React.Fragment>
                <Resizable
                  bounds="parent"
                  default={{ height: "240px" }}
                  minHeight="240px"
                  id={`${index}_resizable`}
                  enable={{ top:false, right:false, bottom:true, left:false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                  style={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: index === 0 ? "0px" : "-16px" }}
                  onResizeStart={(e, dir, ref) => {
                    parentScrollOffsetX.current = ref.parentElement?.scrollLeft || 0
                    parentScrollOffsetY.current = ref.parentElement?.scrollTop || 0
                  }}
                  onResize={(e, dir, ref, d) => {
                    ref.parentElement.scrollTo(parentScrollOffsetX.current, parentScrollOffsetY.current)
                  }}
                  handleStyles={{ bottom: {height: "24px"}}}
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
                    <Box className={classes.topBox} style={{paddingLeft: "16px", paddingRight: "16px", paddingTop: "14px", paddingBottom: "10px"}}>
                      <div style={{display:"block", height:"30px", width:"90px", lineHeight:"30px", borderRadius:"50%", fontSize:"medium", backgroundColor:"#2C2799", color:"white", marginRight:"20px", marginLeft:"5px"}}>
                        {index+1}
                      </div>

                      <TimeBoxes
                        handleTimeChange={handleTimeChange}
                        time={item.start_time}
                        index={index + idxOffset}
                        type={"startTime"}
                      />

                      <FormControl
                        sx={{ width: "50%", mr: "auto", float: "left", marginRight:"10px" }}
                        size="small"
                      >
                        <InputLabel id="select-speaker">Select Speaker</InputLabel>
                        <Select
                          fullWidth
                          labelId="select-speaker"
                          label="Select Speaker"
                          value={item.speaker_id}
                          onChange={(event) =>
                            handleSpeakerChange(event.target.value, index + idxOffset)
                          }
                          style={{
                            backgroundColor: "#fff",
                            textAlign: "left",
                            height: "32px"
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

                      {showAdditionalOptions ? <Tooltip title="Hide Additional Options" placement="bottom">
                        <IconButton
                          className={classes.optionIconBtn}
                          style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        onClick={() => {toggleAdditionalOptions()}}
                        >
                          <Remove/>
                        </IconButton>
                      </Tooltip> :
                      <Tooltip title="Show Additional Options" placement="bottom">
                      <IconButton
                        className={classes.optionIconBtn}
                        style={{
                          color: "#000",
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                        onClick={() => {toggleAdditionalOptions()}}
                      >
                        <Add/>
                      </IconButton>
                    </Tooltip>}
                      
                      {showAdditionalOptions && 
                        <ButtonComponent
                          index={index + idxOffset}
                          lastItem={(index + idxOffset) < subtitles?.length - 1}
                          onMergeClick={onMergeClick}
                          onDelete={onDelete}
                          addNewSubtitleBox={addNewSubtitleBox}
                        />
                      }

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
                        gap:"8px"
                      }}
                      className={classes.cardContent}
                      aria-describedby={"suggestionList"}
                      onClick={() => {
                        if (pauseOnType && player) {
                          player.pause();
                          if (player.currentTime < item.startTime || player.currentTime > item.endTime) {
                            player.currentTime = item.startTime + 0.001;
                          }
                        }
                      }}
                    >
                      {ProjectDetails?.tgt_language !== "en" &&
                        enableTransliteration ? (
                        <IndicTransliterate
                          lang={targetlang}
                          value={item.text}
                          onChange={(event) => {
                            changeTranscriptHandler(event, index + idxOffset, false);
                          }}
                          enabled={enableTransliterationSuggestion}
                          onChangeText={() => { }}
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
                              <div className={classes.relative} style={{ width: "100%", height: "100%" }}>
                                <textarea
                                  className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                                    }`}
                                  dir={enableRTL_Typing ? "rtl" : "ltr"}
                                  onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                                  onBlur={() => {
                                    setTimeout(() => {
                                      setShowPopOver(false);
                                    }, 200);
                                  }}
                                  {...props}
                                />
                                {/* <span id="charNum" className={classes.wordCount}>
                        {targetLength(index)}
                      </span> */}
                              </div>
                            )}}

                        />
                      ) : (
                        <div className={classes.relative} style={{ width: "100%", height: "100%" }}>
                          <textarea
                            ref={el => textRefs.current[index] = el}
                            // onChange={(event) => {
                            onInput={(event) => {
                              changeTranscriptHandler(event, index + idxOffset, false);
                            }}
                            onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                            value={item.text}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            className={`auto-resizable-textarea ${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                              }`}
                            style={{ fontSize: fontSize, height: "100%"}}
                            onBlur={() => {
                              setTimeout(() => {
                                setShowPopOver(false);
                              }, 200);
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
                            lang={targetlang}
                            value={item.acoustic_normalised_text}
                            onChange={(event) => {
                              changeTranscriptHandler(event, index + idxOffset, true);
                            }}
                            enabled={enableTransliterationSuggestion}
                            onChangeText={() => { }}
                            containerStyles={{ width: "100%", height: "100%" }}
                            style={{ fontSize: fontSize, height: "100%" }}
                            renderComponent={(props) => {
                              textRefs.current[index + currentPageData?.length] = props.ref.current;
                              return (
                              <div className={classes.relative} style={{ width: "100%", height: "100%" }}>
                                <textarea
                                  className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                                    }`}
                                  dir={enableRTL_Typing ? "rtl" : "ltr"}
                                  onFocus={() => showAcousticText && populateAcoustic(index + idxOffset)}
                                  {...props}
                                />
                              </div>
                            )}}

                          />
                        ) : (
                          <div className={classes.relative} style={{ width: "100%", height: "100%" }}>
                            <textarea
                              ref={el => textRefs.current[index + currentPageData?.length] = el}
                              onChange={(event) => {
                                changeTranscriptHandler(event, index + idxOffset, true);
                              }}
                              onFocus={() => showAcousticText && populateAcoustic(index + idxOffset)}
                              value={item.acoustic_normalised_text}
                              dir={enableRTL_Typing ? "rtl" : "ltr"}
                              className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                                }`}
                              style={{ fontSize: fontSize, height: "100%" }}
                            />
                          </div>
                        ))}
                    </CardContent>
                  </Box>
                </Resizable>
                <div style={{
                  color: "grey",
                  zIndex: 100,
                  marginTop: "-16px",
                  borderRadius: "100%",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                  backgroundColor: "white",
                  height: "32px", width: "32px",
                  pointerEvents: "none",
                }}>
                  <UnfoldMoreOutlinedIcon sx={{mt: "3px"}}/> 
                </div>
              </React.Fragment>
            );
          })}
        </Box>
        {/* <Box
          className={classes.paginationBox}
        // style={{
        //   ...(!xl && {
        //     bottom: "-11%",
        //   }),
        // }}
        >
          <Pagination
            color="primary"
            // count={Math.ceil(subtitles?.length / itemsPerPage)}
            count={1}
            page={page}
            onChange={handlePageChange}
          />
        </Box> */}
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
            // saveTranscriptHandler={saveTranscriptHandler}
            setEnableTransliterationSuggestion={
              setEnableTransliterationSuggestion
            }
            tagSuggestionsAcoustic={tagSuggestionsAcoustic}
            currentSelection={currentSelection}
            ref={textRefs.current[currentTextRefIdx]}
          />
        )}
      </Grid>
    </>
  );
};

export default memo(StandarisedisedTranscriptionEditing);
