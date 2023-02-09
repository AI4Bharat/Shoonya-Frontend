import { Grid } from "@material-ui/core";
import React from "react";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/TaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";


const Shoonya = (props) => {
  const dispatch = useDispatch();
const {loggedInUserData} = props
const [loading, setLoading] = useState(false);
const apiLoading = useSelector((state) => state.apiStatus.loading);
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
    setLoading(apiLoading);
  }, [apiLoading]);

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

export default Shoonya;
