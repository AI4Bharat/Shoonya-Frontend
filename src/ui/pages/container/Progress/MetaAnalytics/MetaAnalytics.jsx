import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Grid ,ThemeProvider} from "@material-ui/core";
import MetaAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/MetaAnalytics"
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarity_Scale5 from "./SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import Spinner from "../../../component/common/Spinner";
import themeDefault from "../../../../theme/theme";

export default function MetaAnalytics(props) {
    const dispatch = useDispatch();
    const {loggedInUserData} = props
    const [loading, setLoading] = useState(true);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const metaAnalyticsData = useSelector(
        (state) => state.getMetaAnalyticsData.data
      );
      const getMetaAnalyticsdata = () => {
        setLoading(true);
        const userObj = new MetaAnalyticsDataAPI(loggedInUserData?.organization?.id);
        dispatch(APITransport(userObj));
      };

      useEffect(() => {
        getMetaAnalyticsdata();
      }, []);

      useEffect(() => {
        if(metaAnalyticsData.length > 0){
          setLoading(false);

        }
      }, [metaAnalyticsData]);
  return (
    <div>
        {loading && <Spinner />}
      <Grid style={{marginTop:"15px"}}>
      <ContextualTranslationEditing metaAnalyticsData={metaAnalyticsData}/>
      </Grid>
      <Grid style={{marginTop:"15px"}}>
      <SemanticTextualSimilarity_Scale5 metaAnalyticsData={metaAnalyticsData}/>
      </Grid>
      <Grid style={{marginTop:"15px"}}>
      <SingleSpeakerAudioTranscriptionEditing  metaAnalyticsData={metaAnalyticsData}/>

      </Grid>
    </div>
  )
}
