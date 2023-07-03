import { Grid } from "@material-ui/core";
import React from "react";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import WorkspaceTaskAnalyticsAPI from "../../../../../../redux/actions/api/WorkspaceDetails/GetTaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import AudioSegmentation from "./AudioSegmentation";
import AudioTranscription from "./AudioTranscription";
import APITransport from "../../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../../component/common/Spinner";


const TaskAnalytics = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
  const taskAnalyticsData = useSelector(
    (state) => state.wsTaskAnalytics.data
  );
  const getTaskAnalyticsdata = () => {
    setLoading(true)
    const userObj = new WorkspaceTaskAnalyticsAPI(workspaceDetails?.id);
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
    <>
      {loading && <Spinner />}
      <Grid style={{marginTop:"15px"}}>
        <ContextualTranslationEditing taskAnalyticsData={taskAnalyticsData} />
      </Grid>
      <Grid style={{marginTop:"40px"}}>
        <SingleSpeakerAudioTranscriptionEditing
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>
      <Grid style={{marginTop:"40px"}}>
        <AudioTranscription
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>
      <Grid style={{marginTop:"40px"}}>
        <AudioSegmentation
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>
      <Grid style={{marginTop:"40px"}}>
        <SemanticTextualSimilarityChart taskAnalyticsData={taskAnalyticsData} />
      </Grid>
      <Grid style={{marginTop:"40px"}}>
        <ContextualSentenceVerificationChart
          taskAnalyticsData={taskAnalyticsData}
        />
      </Grid>
    </>
  );
};

export default TaskAnalytics;
