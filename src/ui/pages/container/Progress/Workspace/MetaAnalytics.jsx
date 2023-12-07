import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Grid ,ThemeProvider} from "@material-ui/core";
import WorkspaceMetaAnalyticsAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetMetaAnalytics"
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import ContextualTranslationEditing from "../MetaAnalytics/ContextualTranslationEditing";
import SemanticTextualSimilarity_Scale5 from "../MetaAnalytics/SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "../MetaAnalytics/SingleSpeakerAudioTranscriptionEditing";
import AudioTranscription from "../MetaAnalytics/AudioTranscription";
import AudioSegmentation from "../MetaAnalytics/AudioSegmentation";
import Spinner from "../../../component/common/Spinner";
import WordCountBarChartForAudioType from '../MetaAnalytics/WordCountBarChartForAudioType';
import WordCountBarChartForTranslationType from '../MetaAnalytics/WordCountBarChartForTranslationType';

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
      const audioProjectTypes=[
        'AudioTranscription',
        'AudioSegmentation',
        'AudioTranscriptionEditing',
        'AcousticNormalisedTranscriptionEditing'
      ]
      const translationProjectTypes=[
        'MonolingualTranslation',
        'TranslationEditing',
        'SemanticTextualSimilarity_Scale5',
        'ContextualTranslationEditing',
        'OCRTranscriptionEditing',
        'SentenceSplitting',
        'ContextualSentenceVerification',
        'ContextualSentenceVerificationAndDomainClassification',
        'ConversationTranslation',
        'ConversationTranslationEditing',
        'ConversationVerification'
      ]

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
      {/* {metaAnalyticsData[0]?.length && <Grid style={{marginTop:"15px"}}>
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
      </Grid>} */}
      {metaAnalyticsData.length && metaAnalyticsData.map((analyticsData,_index)=>{
        if (analyticsData.length && audioProjectTypes.includes(analyticsData[0].projectType)){
          return (<Grid key={_index} style={{marginTop:"15px"}}>
          <WordCountBarChartForAudioType analyticsData={analyticsData}/>
        </Grid>)}
        if(analyticsData.length && translationProjectTypes.includes(analyticsData[0].projectType)){
          return <Grid key={_index} style={{marginTop:"15px"}}>
          <WordCountBarChartForTranslationType analyticsData={analyticsData}/>
        </Grid>
        }
      })}
    </div>
  )
}
