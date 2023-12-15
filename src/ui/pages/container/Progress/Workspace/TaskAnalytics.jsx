// import { Grid } from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography } from "@mui/material";
import React from "react";
// import ContextualTranslationEditing from "../TaskAnalytics/ContextualTranslationEditing";
// import SemanticTextualSimilarityChart from "../TaskAnalytics/SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "../TaskAnalytics/ContextualSentenceVerificationChart";
import WorkspaceTaskAnalyticsAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetTaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "../TaskAnalytics/SingleSpeakerAudioTranscriptionEditing";
// import AudioSegmentation from "../TaskAnalytics/AudioSegmentation";
// import AudioTranscription from "../TaskAnalytics/AudioTranscription";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";
import LightTooltip from '../../../component/common/Tooltip';
import { translate } from "../../../../../config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import { MenuProps } from "../../../../../utils/utils";
import CustomButton from "../../../component/common/Button";
import AudioTaskAnalyticsChart from "../TaskAnalytics/AudioTaskAnalyticsChart";
import TaskCountAnalyticsChart from "../TaskAnalytics/TaskCountAnalyticsChart";


const TaskAnalytics = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("ConversationTranslationEditing");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
  const taskAnalyticsData = useSelector(
    (state) => state.wsTaskAnalytics.data
  );
  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      types.push('AllTypes')
      setProjectTypes(types);
      types?.length && setSelectedType(types[3]);
    }
  }, [ProjectTypes]);
  const getTaskAnalyticsdata = () => {
    setLoading(true)
    const userObj = new WorkspaceTaskAnalyticsAPI(workspaceDetails?.id,selectedType);
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
    getTaskAnalyticsdata();
  }, [workspaceDetails]);

  const handleSubmit = async () => {
    getTaskAnalyticsdata();
  }

  useEffect(() => {
    if(taskAnalyticsData.length > 0){
      setLoading(false);
    }
  }, [taskAnalyticsData]);

  return (
    <>
      {console.log(taskAnalyticsData[0])}
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
      {taskAnalyticsData.length && taskAnalyticsData.map((analyticsData,_index)=>{
        if (analyticsData.length && audioProjectTypes.includes(analyticsData[0].projectType)){
          return (<Grid key={_index} style={{marginTop:"15px"}}>
          <AudioTaskAnalyticsChart analyticsData={analyticsData}/>
        </Grid>)}
        if(analyticsData.length && 
          (translationProjectTypes.includes(analyticsData[0].projectType) ||
            conversationProjectTypes.includes(analyticsData[0].projectType)
            )
          ){
          return <Grid key={_index} style={{marginTop:"15px"}}>
          <TaskCountAnalyticsChart analyticsData={analyticsData}/>
        </Grid>
        }
      })}
    </>
  );
};

export default TaskAnalytics;
