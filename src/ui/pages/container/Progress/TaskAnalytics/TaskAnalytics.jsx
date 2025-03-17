// import { Grid } from "@material-ui/core";
// import React from "react";
// import ContextualTranslationEditing from "./ContextualTranslationEditing";
// import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
// import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
// import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/TaskAnalytics";
// import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
// import AudioSegmentation from "./AudioSegmentation";
// import AudioTranscription from "./AudioTranscription";
// import APITransport from "../../../../../redux/actions/apitransport/apitransport";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import Spinner from "../../../component/common/Spinner";


// const TaskAnalytics = (props) => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const taskAnalyticsData = useSelector(
//     (state) => state.getTaskAnalyticsData.data
//   );
//   const getTaskAnalyticsdata = () => {
//      setLoading(true)
//     const userObj = new TaskAnalyticsDataAPI();
//     dispatch(APITransport(userObj));
//   };

//   useEffect(() => {
//     getTaskAnalyticsdata();
//   }, []);

//   useEffect(() => {
//     if(taskAnalyticsData.length > 0){
//       setLoading(false);
//     }
//   }, [taskAnalyticsData]);

//   return (
//     <>
//       {loading && <Spinner />}
//       {taskAnalyticsData[0]?.length && <Grid style={{marginTop:"15px"}}>
//         <ContextualTranslationEditing taskAnalyticsData={taskAnalyticsData} />
//       </Grid>}
//       {taskAnalyticsData[3]?.length && <Grid style={{marginTop:"40px"}}>
//         <SingleSpeakerAudioTranscriptionEditing
//           taskAnalyticsData={taskAnalyticsData}
//         />
//       </Grid>}
//       {taskAnalyticsData[4]?.length && <Grid style={{marginTop:"40px"}}>
//         <AudioTranscription
//           taskAnalyticsData={taskAnalyticsData}
//         />
//       </Grid>}
//       {taskAnalyticsData[5]?.length && <Grid style={{marginTop:"40px"}}>
//         <AudioSegmentation
//           taskAnalyticsData={taskAnalyticsData}
//         />
//       </Grid>}
//       {taskAnalyticsData[2]?.length && <Grid style={{marginTop:"40px"}}>
//         <SemanticTextualSimilarityChart taskAnalyticsData={taskAnalyticsData} />
//       </Grid>}
//       {taskAnalyticsData[1]?.length && <Grid style={{marginTop:"40px"}}>
//         <ContextualSentenceVerificationChart
//           taskAnalyticsData={taskAnalyticsData}
//         />
//       </Grid>}
//     </>
//   );
// };

// export default TaskAnalytics;



import { Grid, FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/TaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import AudioSegmentation from "./AudioSegmentation";
import AudioTranscription from "./AudioTranscription";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import Spinner from "../../../component/common/Spinner";

const TaskAnalytics = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  const taskAnalyticsData = useSelector(
    (state) => state.getTaskAnalyticsData.data
  );

  const getTaskAnalyticsdata = () => {
    setLoading(true);
    const userObj = new TaskAnalyticsDataAPI();
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getTaskAnalyticsdata();
  }, []);

  useEffect(() => {
    if (taskAnalyticsData.length > 0) {
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  return (
    <>
      {loading && <Spinner />}
      <FormControl component="fieldset" style={{ marginBottom: "20px", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <RadioGroup
          row
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          {taskAnalyticsData[0]?.length && (
            <FormControlLabel
              value="contextual_translation"
              control={<Radio />}
              label="Contextual Translation Editing"
            />
          )}
          {taskAnalyticsData[3]?.length && (
            <FormControlLabel
              value="single_speaker_transcription"
              control={<Radio />}
              label="Single Speaker Audio Transcription Editing"
            />
          )}
          {/* {taskAnalyticsData[4]?.length && (
            <FormControlLabel
              value="audio_transcription"
              control={<Radio />}
              label="Audio Transcription"
            />
          )} */}
          {taskAnalyticsData[5]?.length && (
            <FormControlLabel
              value="audio_segmentation"
              control={<Radio />}
              label="Audio Segmentation"
            />
          )}
          {taskAnalyticsData[2]?.length && (
            <FormControlLabel
              value="semantic_similarity"
              control={<Radio />}
              label="Semantic Textual Similarity Chart"
            />
          )}
          {taskAnalyticsData[1]?.length && (
            <FormControlLabel
              value="contextual_sentence_verification"
              control={<Radio />}
              label="Contextual Sentence Verification Chart"
            />
          )}
        </RadioGroup>
      </FormControl>
      {selectedTask === "contextual_translation" && taskAnalyticsData[0]?.length && (
        <Grid style={{ marginTop: "15px" }}>
          <ContextualTranslationEditing taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
      {selectedTask === "single_speaker_transcription" && taskAnalyticsData[3]?.length && (
        <Grid style={{ marginTop: "40px" }}>
          <SingleSpeakerAudioTranscriptionEditing taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
      {selectedTask === "audio_transcription" && taskAnalyticsData[4]?.length && (
        <Grid style={{ marginTop: "40px" }}>
          <AudioTranscription taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
      {selectedTask === "audio_segmentation" && taskAnalyticsData[5]?.length && (
        <Grid style={{ marginTop: "40px" }}>
          <AudioSegmentation taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
      {selectedTask === "semantic_similarity" && taskAnalyticsData[2]?.length && (
        <Grid style={{ marginTop: "40px" }}>
          <SemanticTextualSimilarityChart taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
      {selectedTask === "contextual_sentence_verification" && taskAnalyticsData[1]?.length && (
        <Grid style={{ marginTop: "40px" }}>
          <ContextualSentenceVerificationChart taskAnalyticsData={taskAnalyticsData} />
        </Grid>
      )}
    </>
  );
};

export default TaskAnalytics;
