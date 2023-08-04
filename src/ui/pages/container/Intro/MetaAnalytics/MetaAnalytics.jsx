import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Grid ,ThemeProvider} from "@material-ui/core";
import MetaAnalyticsDataAPI from "../../../../../redux/actions/api/Intro/MetaAnalytics"
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarity_Scale5 from "./SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import AudioTranscription from "./AudioTranscription";
import AudioSegmentation from "./AudioSegmentation";
import Spinner from "../../../component/common/Spinner";
import themeDefault from "../../../../theme/theme";

export default function MetaAnalytics() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const metaAnalyticsData = useSelector(
        (state) => state.getMetaAnalyticsData.data
      );
      const getMetaAnalyticsdata = () => {
        setLoading(true);
        const userObj = new MetaAnalyticsDataAPI(1);
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
      {metaAnalyticsData[0]?.length && <Grid style={{marginTop:"15px"}}>
        <ContextualTranslationEditing metaAnalyticsData={metaAnalyticsData}/>
      </Grid>}
      {metaAnalyticsData[1]?.length && <Grid style={{marginTop:"15px"}}>
      <SemanticTextualSimilarity_Scale5 metaAnalyticsData={metaAnalyticsData}/>
      </Grid>}
      {metaAnalyticsData[2]?.length && <Grid style={{marginTop:"15px"}}>
      <SingleSpeakerAudioTranscriptionEditing  metaAnalyticsData={metaAnalyticsData}/>
      </Grid>}
      {metaAnalyticsData[3]?.length && <Grid style={{marginTop:"15px"}}>
      <AudioTranscription  metaAnalyticsData={metaAnalyticsData}/>
      </Grid>}
      {metaAnalyticsData[4]?.length && <Grid style={{marginTop:"15px"}}>
      <AudioSegmentation  metaAnalyticsData={metaAnalyticsData}/>
      </Grid>}
    </div>
  )
}
