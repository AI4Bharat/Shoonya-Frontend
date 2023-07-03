import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Grid ,ThemeProvider} from "@material-ui/core";
import WorkspaceMetaAnalyticsAPI from "../../../../../../redux/actions/api/WorkspaceDetails/GetMetaAnalytics"
import APITransport from "../../../../../../redux/actions/apitransport/apitransport";
import ContextualTranslationEditing from "./ContextualTranslationEditing";
import SemanticTextualSimilarity_Scale5 from "./SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
import AudioTranscription from "./AudioTranscription";
import AudioSegmentation from "./AudioSegmentation";
import Spinner from "../../../../component/common/Spinner";
import themeDefault from "../../../../../theme/theme";

export default function MetaAnalytics(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
    const metaAnalyticsData = useSelector(
        (state) => state.wsMetaAnalytics.data
      );
      const getMetaAnalyticsdata = () => {
        setLoading(true);
        const userObj = new WorkspaceMetaAnalyticsAPI(workspaceDetails?.id);
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
      <Grid style={{marginTop:"15px"}}>
      <AudioTranscription  metaAnalyticsData={metaAnalyticsData}/>
      </Grid>
      <Grid style={{marginTop:"15px"}}>
      <AudioSegmentation  metaAnalyticsData={metaAnalyticsData}/>
      </Grid>
    </div>
  )
}
