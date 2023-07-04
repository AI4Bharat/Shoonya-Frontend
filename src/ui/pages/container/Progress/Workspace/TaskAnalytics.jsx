import { Grid } from "@material-ui/core";
import React from "react";
import ContextualTranslationEditing from "../TaskAnalytics/ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "../TaskAnalytics/SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "../TaskAnalytics/ContextualSentenceVerificationChart";
import WorkspaceTaskAnalyticsAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetTaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "../TaskAnalytics/SingleSpeakerAudioTranscriptionEditing";
import AudioSegmentation from "../TaskAnalytics/AudioSegmentation";
import AudioTranscription from "../TaskAnalytics/AudioTranscription";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";


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
  }, [workspaceDetails]);

  useEffect(() => {
    if(taskAnalyticsData.length > 0){
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  return (
    <>
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
    </>
  );
};

export default TaskAnalytics;
