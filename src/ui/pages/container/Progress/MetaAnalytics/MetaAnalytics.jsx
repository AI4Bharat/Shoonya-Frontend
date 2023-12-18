import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "../../../component/common/Button";
// import { Grid ,ThemeProvider} from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography } from "@mui/material";
import MetaAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/MetaAnalytics"
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import AudioDurationChart from './AudioDurationMetaAnalyticsChart';
// import ContextualTranslationEditing from "./ContextualTranslationEditing";
// import SemanticTextualSimilarity_Scale5 from "./SemanticTextualSimilarity_Scale5";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
// import AudioTranscription from "./AudioTranscription";
// import AudioSegmentation from "./AudioSegmentation";
import Spinner from "../../../component/common/Spinner";
import themeDefault from "../../../../theme/theme";
import LightTooltip from '../../../component/common/Tooltip';
import { translate } from "../../../../../config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "../../../../../utils/utils";
import WordCountMetaAnalyticsChart from './WordCountMetaAnalyticsChart';

export default function MetaAnalytics(props) {
    const dispatch = useDispatch();
    const {loggedInUserData} = props
    const [loading, setLoading] = useState(false);
    const apiLoading = useSelector((state) => state.apiStatus.loading);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("ContextualTranslationEditing");
    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    const metaAnalyticsData = useSelector(
        (state) => state.getMetaAnalyticsData.data
      );

      const getMetaAnalyticsdata = () => {
        setLoading(true);
        const userObj = new MetaAnalyticsDataAPI(loggedInUserData?.organization?.id,selectedType);
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
          </Grid>)}
          if(analyticsData.length && 
            (translationProjectTypes.includes(analyticsData[0].projectType) ||
              conversationProjectTypes.includes(analyticsData[0].projectType)
              )
            ){
            return <Grid key={_index} style={{marginTop:"15px"}}>
            <WordCountMetaAnalyticsChart analyticsData={analyticsData}/>
          </Grid>
          }
        })
      :''}
    </div>
  )
}
