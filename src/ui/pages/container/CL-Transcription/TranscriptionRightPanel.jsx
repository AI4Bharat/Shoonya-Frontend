import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
// import {
//   APITransport,
//   FetchTranscriptPayloadAPI,
//   SaveTranscriptAPI,
//   setSubtitles,
// } from "redux/actions";

const TranscriptionRightPanel = ({
  currentIndex,
  AnnotationsTaskDetails,
  ProjectDetails,
  TaskDetails,
  stage,
  handleStdTranscriptionSettings,
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
  console.log(subtitles);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = subtitles?.slice(startIndex, endIndex);
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
  const [enableTransliteration, setTransliteration] = useState(true);
  const [enableRTL_Typing, setRTL_Typing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState("large");
  const [currentOffset, setCurrentOffset] = useState(1);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showSpeakerIdDropdown, setShowSpeakerIdDropdown] = useState([]);
  const [speakerIdList, setSpeakerIdList] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(0);
  const [tagSuggestionsAnchorEl, setTagSuggestionsAnchorEl] = useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState([]);
  const [textWithoutBackSlash, setTextWithoutBackSlash] = useState("");
  const [textAfterBackSlash, setTextAfterBackSlash] = useState("");
  const [enableTransliterationSuggestion, setEnableTransliterationSuggestion] =
    useState(true);
  const [taskData, setTaskData] = useState([]);
  const AnnotationStage = localStorage.getItem("Stage") === "annotation";
  const SuperCheckerStage =
    localStorage.getItem("SuperCheckerStage") === "superChecker";

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
    if(currentIndex >= startIndex && currentIndex <= endIndex) {
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

    const containsBackslash = value.includes("\\");

    setEnableTransliterationSuggestion(true);

    if (containsBackslash && !updateAcoustic) {
      setEnableTransliterationSuggestion(false);

      const textBeforeSlash = value.split("\\")[0];
      const textAfterSlash = value.split("\\")[1].split("").slice(1).join("");
      setCurrentSelectedIndex(index);
      setTagSuggestionsAnchorEl(currentTarget);
      setTextWithoutBackSlash(textBeforeSlash);
      setTextAfterBackSlash(textAfterSlash);
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
            height: showAcousticText ? "calc(100vh - 422px)" : "calc(100vh - 385px)",
          }}>
          {currentPageData?.map((item, index) => {
            return (
              <Box
                key={index}
                id={`sub_${index}`}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid lightgray",
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(214, 238, 255)"
                      : "rgb(233, 247, 239)",
                }}
              >
                <Box className={classes.topBox}>
                  <TimeBoxes
                    handleTimeChange={handleTimeChange}
                    time={item.start_time}
                    index={index + idxOffset}
                    type={"startTime"}
                  />

                  <ButtonComponent
                    index={index + idxOffset}
                    lastItem={(index + idxOffset) < subtitles?.length - 1}
                    onMergeClick={onMergeClick}
                    onDelete={onDelete}
                    addNewSubtitleBox={addNewSubtitleBox}
                  />

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
                    padding: "5px 0",
                  }}
                  className={classes.cardContent}
                  aria-describedby={"suggestionList"}
                  onClick={() => {
                    if (player) {
                      player.pause();
                      if (player.duration >= item.startTime) {
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
                        changeTranscriptHandler(event, index + idxOffset);
                      }}
                      enabled={enableTransliterationSuggestion}
                      onChangeText={() => { }}
                      onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                      containerStyles={{
                        width: "100%",
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowPopOver(false);
                        }, 200);
                      }}
                      style={{ fontSize: fontSize, height: "120px" }}
                      renderComponent={(props) => (
                        <div className={classes.relative} style={{ width: "100%" }}>
                          <textarea
                            className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                              }`}
                            dir={enableRTL_Typing ? "rtl" : "ltr"}
                            rows={4}
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
                      )}
                    />
                  ) : (
                    <div className={classes.relative} style={{ width: "100%" }}>
                      <textarea
                        onChange={(event) => {
                          changeTranscriptHandler(event, index + idxOffset);
                        }}
                        onMouseUp={(e) => onMouseUp(e, index + idxOffset)}
                        value={item.text}
                        dir={enableRTL_Typing ? "rtl" : "ltr"}
                        className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                          }`}
                        // className={classes.customTextarea}
                        style={{
                          fontSize: fontSize,
                          height: "120px",
                        }}
                        rows={4}
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
                        containerStyles={{
                          width: "100%",
                        }}
                        style={{ fontSize: fontSize, height: "120px" }}
                        renderComponent={(props) => (
                          <div className={classes.relative} style={{ width: "100%" }}>
                            <textarea
                              className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                                }`}
                              dir={enableRTL_Typing ? "rtl" : "ltr"}
                              rows={4}
                              onFocus={() => showAcousticText && populateAcoustic(index + idxOffset)}
                              style={{ fontSize: fontSize, height: "120px" }}
                              {...props}
                            />
                          </div>
                        )}
                      />
                    ) : (
                      <div className={classes.relative} style={{ width: "100%" }}>
                        <textarea
                          onChange={(event) => {
                            changeTranscriptHandler(event, index + idxOffset, true);
                          }}
                          onFocus={() => showAcousticText && populateAcoustic(index + idxOffset)}
                          value={item.acoustic_normalised_text}
                          dir={enableRTL_Typing ? "rtl" : "ltr"}
                          className={`${classes.customTextarea} ${currentIndex === (idxOffset + index) ? classes.boxHighlight : ""
                            }`}
                          style={{
                            fontSize: fontSize,
                            height: "120px",
                          }}
                          rows={4}
                        />
                      </div>
                    ))}
                </CardContent>

                <FormControl
                  sx={{ width: "50%", mr: "auto", float: "left" }}
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
              </Box>
            );
          })}
        </Box>
        <Box
          className={classes.paginationBox}
        // style={{
        //   ...(!xl && {
        //     bottom: "-11%",
        //   }),
        // }}
        >
          <Pagination
            color="primary"
            count={Math.ceil(subtitles?.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
          />
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
            textWithoutBackslash={textWithoutBackSlash}
            textAfterBackSlash={textAfterBackSlash}
            // saveTranscriptHandler={saveTranscriptHandler}
            setEnableTransliterationSuggestion={
              setEnableTransliterationSuggestion
            }
          />
        )}
      </Grid>
    </>
  );
};

export default TranscriptionRightPanel;
