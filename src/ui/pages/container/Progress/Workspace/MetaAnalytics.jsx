import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import { Grid ,ThemeProvider} from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography } from "@mui/material";
import WorkspaceMetaAnalyticsAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetMetaAnalytics"
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
// import ContextualTranslationEditing from "../MetaAnalytics/ContextualTranslationEditing";
// import SemanticTextualSimilarity_Scale5 from "../MetaAnalytics/SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "../MetaAnalytics/SingleSpeakerAudioTranscriptionEditing";
// import AudioTranscription from "../MetaAnalytics/AudioTranscription";
// import AudioSegmentation from "../MetaAnalytics/AudioSegmentation";
import Spinner from "../../../component/common/Spinner";
import themeDefault from "../../../../theme/theme";
import LightTooltip from '../../../component/common/Tooltip';
import { translate } from "../../../../../config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "../../../../../utils/utils";
import CustomButton from "../../../component/common/Button";
import AudioDurationChart from '../MetaAnalytics/AudioDurationMetaAnalyticsChart';
import WordCountMetaAnalyticsChart from '../MetaAnalytics/WordCountMetaAnalyticsChart';
import SentanceCountMetaAnalyticsChart from '../MetaAnalytics/SentanceCountMetaAnalyticsChart';

export default function MetaAnalytics(props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("ContextualTranslationEditing");
    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
    const metaAnalyticsData = useSelector(
        (state) => state.wsMetaAnalytics.data
      );

      const getMetaAnalyticsdata = () => {
        setLoading(true);
        const userObj = new WorkspaceMetaAnalyticsAPI(workspaceDetails?.id,selectedType);
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
        'SentenceSplitting',
        'ContextualSentenceVerification',
        'ContextualSentenceVerificationAndDomainClassification',
      ]

      const conversationProjectTypes=[
        'ConversationTranslation',
        'ConversationTranslationEditing',
        'ConversationVerification'
      ]

      const ocrProjectTypes=[
        'OCRTranscriptionEditing',
      ]

      useEffect(() => {
        let types=[...audioProjectTypes,...translationProjectTypes,...conversationProjectTypes,...ocrProjectTypes,'AllTypes']
        setProjectTypes(types);
      }, []);

      useEffect(() => {
        getMetaAnalyticsdata();
      }, []);

      const handleSubmit = async () => {
        getMetaAnalyticsdata();
      }

      useEffect(() => {
        if(metaAnalyticsData.length > 0){
          setLoading(false);

        }
      }, [metaAnalyticsData]);
  return (
    <div>
      {console.log(metaAnalyticsData[0])}
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={3}>
        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px" }}>
              Project Type {" "}
              {
                <LightTooltip
                  arrow
                  placement="top"
                  title={translate("tooltip.ProjectType")}>
                  <InfoIcon
                    fontSize="medium"
                  />
                </LightTooltip>
              }
            </InputLabel>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedType}
              label="Project Type"
              sx={{padding:"1px"}}
              onChange={(e) => setSelectedType(e.target.value)}
              MenuProps={MenuProps}
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <CustomButton label="Submit" sx={{ width:"120px", mt: 3 }} onClick={handleSubmit}
              disabled={loading} />

      </Grid>
      {loading && <Spinner />}
      {metaAnalyticsData.length ?
        metaAnalyticsData.map((analyticsData,_index)=>{
          if (analyticsData.length && audioProjectTypes.includes(analyticsData[0].projectType)){
            return (<Grid key={_index} style={{marginTop:"15px"}}>
            <AudioDurationChart analyticsData={analyticsData}/>
            <AudioDurationChart analyticsData={analyticsData} graphCategory='rawAudioDuration'/>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData} graphCategory='audioWordCount'/>
          </Grid>)}
          if(analyticsData.length && 
            (translationProjectTypes.includes(analyticsData[0].projectType) ||
              conversationProjectTypes.includes(analyticsData[0].projectType)
              )
            ){
            return <Grid key={_index} style={{marginTop:"15px"}}>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData}/>
            {analyticsData[0].projectType.includes("Conversation") && <SentanceCountMetaAnalyticsChart analyticsData={analyticsData}/>}
          </Grid>}
          if (analyticsData.length && ocrProjectTypes.includes(analyticsData[0].projectType)){
            return (<Grid key={_index} style={{marginTop:"15px"}}>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData} graphCategory='ocrWordCount'/>
          </Grid>)}
        })
        :''
      }
    </div>
  )
}
