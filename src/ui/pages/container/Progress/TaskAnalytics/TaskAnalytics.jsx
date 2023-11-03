import { Grid } from "@material-ui/core";
import React from "react";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/TaskAnalytics";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import AudioProjects from "./AudioProjects";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";


const TaskAnalytics = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const taskAnalyticsData = useSelector(
    (state) => state.getTaskAnalyticsData.data
  );
  const getTaskAnalyticsdata = () => {
     setLoading(true)
    const userObj = new TaskAnalyticsDataAPI();
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
      {taskAnalyticsData[0]?.length && <Grid style={{marginTop:"15px"}}>
        <ContextualTranslationEditing taskAnalyticsData={taskAnalyticsData} />
      </Grid>}
      {taskAnalyticsData[3]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioProjects
          taskAnalyticsData={taskAnalyticsData[3]}
          projectType={"Audio Transcription Editing"}
        />
      </Grid>}
      {taskAnalyticsData[4]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioProjects
          taskAnalyticsData={taskAnalyticsData[4]}
          projectType={"Audio Transcription"}
        />
      </Grid>}
      {taskAnalyticsData[5]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioProjects
          taskAnalyticsData={taskAnalyticsData[5]}
          projectType={"Audio Segmentation"}
        />
      </Grid>}
      {taskAnalyticsData[6]?.length && <Grid style={{marginTop:"40px"}}>
        <AudioProjects
          taskAnalyticsData={taskAnalyticsData[6]}
          projectType={"Acoustic Normalised Transcription Editing"}
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
