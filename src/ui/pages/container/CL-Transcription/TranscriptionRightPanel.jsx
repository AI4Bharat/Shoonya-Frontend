// TranscriptionRightPanel
import React, { useCallback, useEffect, useState, useRef, memo } from "react";
import {
  addSubtitleBox,
  // getSubtitleRangeTranscript,
  onMerge,
  // onSplit,
  onSubtitleChange,
  onSubtitleDelete,
  // timeChange,
  // onUndoAction,
  // onRedoAction,
  getSelectionStart,
  getTimings,
  getItemForDelete,
  // MenuProps,
  // assignSpeakerId,
  // getTagsList,
} from "../../../../utils/SubTitlesUtils";
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
} from "@mui/material";

import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import TimeBoxes from "../CL-Transcription/TimeBoxes";
import ButtonComponent from "./ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setSubtitles,
} from "../../../../redux/actions/Common";
import C from "../../../../redux/constants";



export default function TranscriptionRightPanel({
  AnnotationsTaskDetails,
  player,
}) {
  const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [newDetails, setNewDetails] = useState();
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(1);

  const subtitles = useSelector((state) => state.commonReducer.subtitles);
  const limit = useSelector((state) => state.commonReducer.limit);


  const itemsPerPage = 10;
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

 
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = AnnotationsTaskDetails[0]?.result?.slice(
    startIndex,
    endIndex
  );

  const changeTranscriptHandler = (event, index) => {
    const {
      target: { value },
      currentTarget,
    } = event;
console.log(value,"valuevaluevaluevalue")
    const sub = onSubtitleChange(value, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
  
}

  return (
    <Grid sx={{ margin: 0 }}>
      <Box
        className={classes.rightPanelParentBox}
        style={{ position: "relative" }}
      >
        <Grid className={classes.rightPanelParentGrid}>
          {/* <SettingsButtonComponent
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
          /> */}
        </Grid>
      </Box>

      <Box id={"subTitleContainer"} className={classes.subTitleContainer}>
        {currentPageData?.map((item, index) => {
          return (
            <Box
              key={index}
              id={`sub_${index}`}
              style={{
                padding: "16px",
                borderBottom: "1px solid lightgray",
                backgroundColor:
                  index % 2 === 0 ? "rgb(214, 238, 255)" : "rgb(233, 247, 239)",
              }}
            >
              <Box className={classes.topBox}>
                <TimeBoxes
                  // handleTimeChange={handleTimeChange}
                  time={item.start_time}
                  index={index}
                  type={"startTime"}
                />

                <ButtonComponent
                index={index}
                lastItem={index < subtitles.length - 1}
                onMergeClick={onMergeClick}
                onDelete={onDelete}
                addNewSubtitleBox={addNewSubtitleBox}
                />

                <TimeBoxes
                  // handleTimeChange={handleTimeChange}
                  time={item.end_time}
                  index={index}
                  type={"endTime"}
                />
              </Box>

              <CardContent
                className={classes.cardContent}
                aria-describedby={"suggestionList"}
                // onClick={() => {
                //   if (player) {
                //     player.pause();
                //     if (player.duration >= item.startTime) {
                //       player.currentTime = item.startTime + 0.001;
                //     }
                //   }
                // }}
              >
                {/* {taskData?.src_language !== "en" && enableTransliteration ? (
          <IndicTransliterate
            lang={taskData?.src_language}
            value={item.text}
            onChange={(event) => {
              changeTranscriptHandler(event, index);
            }}
            enabled={enableTransliterationSuggestion}
            onChangeText={() => {}}
            onMouseUp={(e) => onMouseUp(e, index)}
            containerStyles={{}}
            onBlur={() =>
              setTimeout(() => {
                setShowPopOver(false);
              }, 200)

            }
            renderComponent={(props) => (
              <div className={classes.relative}>
                <textarea
                  className={`${classes.customTextarea} ${
                    currentIndex === index ? classes.boxHighlight : ""
                  }`}
                  dir={enableRTL_Typing ? "rtl" : "ltr"}
                  rows={4}
                  onMouseUp={(e) => onMouseUp(e, index)}
                  onBlur={() =>
                    setTimeout(() => {
                      setShowPopOver(false);
                    }, 200)
                  }
                  style={{ fontSize: fontSize, height: "120px" }}
                  {...props}
                />
                <span id="charNum" className={classes.wordCount}>
                  {targetLength(index)}
                </span>
              </div>
            )}
          />
        ) : ( */}
                <div className={classes.relative}>
                  <textarea
                      onChange={(event) => {
                        changeTranscriptHandler(event, index);
                      }}
                      // onMouseUp={(e) => onMouseUp(e, index)}
                    // value={item.text}
                    //   dir={enableRTL_Typing ? "rtl" : "ltr"}
                    // className={`${classes.customTextarea} ${
                    //   currentIndex === index ? classes.boxHighlight : ""
                    // }`}
                    className={classes.customTextarea}
                    style={{
                      // fontSize: fontSize,
                      height: "120px",
                    }}
                    rows={4}
                    // onBlur={() =>
                    //   setTimeout(() => {
                    //       setShowPopOver(false);
                    //   }, 200)
                    // }
                  />
                  <span id="charNum" className={classes.wordCount}>
                    {/* {targetLength(index)} */}
                  </span>
                </div>
                {/* )} */}
              </CardContent>
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
        count={Math.ceil(
          AnnotationsTaskDetails[0]?.result?.length / itemsPerPage
        )}
        page={page}
        onChange={handlePageChange}
      />
       </Box>
    </Grid>
  );
}
