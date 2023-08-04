import { Grid } from "@material-ui/core";
import React from "react";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Intro/TaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import AudioSegmentation from "./AudioSegmentation";
import AudioTranscription from "./AudioTranscription";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";


const TaskAnalytics = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const taskAnalyticsData = useSelector(
    (state) => state.getTaskAnalyticsData.data
  );
  const getTaskAnalyticsdata = () => {
     setLoading(true)
    const userObj = new TaskAnalyticsDataAPI(1);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getTaskAnalyticsdata();
  }, []);

  useEffect(() => {
    if(taskAnalyticsData.length > 0){
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  return (
    <div >
      {loading && <Spinner />}
      {taskAnalyticsData[0]?.length && <Grid style={{marginTop:"15px"}}>
        <ContextualTranslationEditing taskAnalyticsData={taskAnalyticsData} />
      </Grid>}
      {taskAnalyticsData[3]?.length && <Grid style={{marginTop:"40px"}}>
        <SingleSpeakerAudioTranscriptionEditing
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>}
      {taskAnalyticsData[4]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioTranscription
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>}
      {taskAnalyticsData[5]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioSegmentation
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>}
      {taskAnalyticsData[2]?.length && <Grid style={{marginTop:"40px"}}>
        <SemanticTextualSimilarityChart taskAnalyticsData={taskAnalyticsData} />
      </Grid>}
      {taskAnalyticsData[1]?.length && <Grid style={{marginTop:"40px"}}>
        <ContextualSentenceVerificationChart
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>}
    </div>
  );
};

export default TaskAnalytics;
