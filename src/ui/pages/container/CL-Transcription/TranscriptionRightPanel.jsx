// TranscriptionRightPanel

import React from 'react'
import {
    Box,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    useMediaQuery,
  } from "@mui/material";
  import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
  import TimeBoxes from "../CL-Transcription/TimeBoxes";
  import  ButtonComponent from "./ButtonComponent";

export default function TranscriptionRightPanel() {
    const classes = AudioTranscriptionLandingStyle();
const subtitles =[1,2,3,4,5,6];
  return (
    <Grid sx={{margin:0}}> 
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
        </Grid></Box>
    
        <Box id={"subTitleContainer"} className={classes.subTitleContainer}>
{subtitles?.map((item, index) => {
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
                    // handleTimeChange={handleTimeChange}
                    // time={item.start_time}
                    // index={index}
                    // type={"startTime"}
                  />

                  <ButtonComponent
                    // index={index}
                    // lastItem={index < subtitles.length - 1}
                    // onMergeClick={onMergeClick}
                    // onDelete={onDelete}
                    // addNewSubtitleBox={addNewSubtitleBox}
                  />

                  <TimeBoxes
                    // handleTimeChange={handleTimeChange}
                    // time={item.end_time}
                    // index={index}
                    // type={"endTime"}
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
            //   onChange={(event) => {
            //     changeTranscriptHandler(event, index);
            //   }}
            //   onMouseUp={(e) => onMouseUp(e, index)}
            //   value={item.text}
            //   dir={enableRTL_Typing ? "rtl" : "ltr"}
            //   className={`${classes.customTextarea} ${
            //     currentIndex === index ? classes.boxHighlight : ""
            //   }`}
            className={classes.customTextarea}
              style={{
                // fontSize: fontSize,
                height: "120px",
              }}
              rows={4}
              onBlur={() =>
                setTimeout(() => {
                //   setShowPopOver(false);
                }, 200)
              }
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
         
         
          </Grid>
  )
}
