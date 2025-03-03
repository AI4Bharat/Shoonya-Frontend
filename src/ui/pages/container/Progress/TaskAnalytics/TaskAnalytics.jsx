// import { Grid } from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography } from "@mui/material";
import React from "react";
// import ContextualTranslationEditing from "./ContextualTranslationEditing";
// import SemanticTextualSimilarityChart from "./SemanticTextualSimilarityChart";
import ContextualSentenceVerificationChart from "./ContextualSentenceVerificationChart";
import TaskAnalyticsDataAPI from "../../../../../redux/actions/api/Progress/TaskAnalytics";
import SingleSpeakerAudioTranscriptionEditing from "./SingleSpeakerAudioTranscriptionEditing";
// import AudioSegmentation from "./AudioSegmentation";
// import AudioTranscription from "./AudioTranscription";
import APITransport from "../../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Spinner from "../../../component/common/Spinner";
import LightTooltip from '../../../component/common/Tooltip';
import { translate } from "../../../../../config/localisation";
import InfoIcon from '@mui/icons-material/Info';
import AudioTaskAnalyticsChart from "./AudioTaskAnalyticsChart";
import TaskCountAnalyticsChart from "./TaskCountAnalyticsChart";
import { MenuProps } from "../../../../../utils/utils";
import CustomButton from "../../../component/common/Button";


const TaskAnalytics = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("ContextualTranslationEditing");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const taskAnalyticsData = useSelector(
    (state) => state.getTaskAnalyticsData.data
  );

  const getTaskAnalyticsdata = () => {
     setLoading(true)
    const userObj = new TaskAnalyticsDataAPI(selectedType);
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
    getTaskAnalyticsdata();
  }, []);

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
      {/* {console.log(taskAnalyticsData[0])} */}
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={1}>
      <Grid
      container
      item
      xs={12}
      sm={12}
      md={12}
      lg={4}
      xl={4}
      spacing={1}
      alignItems="center"
    ><Grid item xs={12} sm={6} md={6} lg={6} xl={6}>      <FormControl  size="small">
            <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px",zIndex: 0 }}>
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
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
      <CustomButton
        label="Submit"
        sx={{ width: "35%", height: "40px" }}
        onClick={handleSubmit}
        size="small"
      />

      {/* Download Button */}
      <Box display="flex" alignItems="center" sx={{ width: "45%" }}>
      <CustomButton
          onClick={handleClick}
          disabled={loading}
          sx={{ width: "100%", height: "40px" }}
          endIcon={<KeyboardArrowDown />}
          label="Download"
        >
          Download
        </CustomButton>
            <StyledMenu
              id="demo-customized-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={downloadCSV}>CSV</MenuItem>
              <MenuItem onClick={downloadPDF}>PDF</MenuItem>
              <MenuItem onClick={downloadJSON}>JSON</MenuItem>
            </StyledMenu>
          </Box>
          </Box>
      </Grid>
        </Grid>
      
      {loading && <Spinner />}
      {taskAnalyticsData.length ?
        taskAnalyticsData.map((analyticsData,_index)=>{
          if (analyticsData.length && audioProjectTypes.includes(analyticsData[0].projectType)){
            return (<Grid key={_index} style={{marginTop:"15px"}}>
            <AudioTaskAnalyticsChart analyticsData={analyticsData}/>
          </Grid>)}
          if(analyticsData.length && 
            (translationProjectTypes.includes(analyticsData[0].projectType) ||
              conversationProjectTypes.includes(analyticsData[0].projectType) ||
              (ocrProjectTypes.includes(analyticsData[0].projectType))
              )
            ){
            return <Grid key={_index} style={{marginTop:"15px"}}>
            <TaskCountAnalyticsChart analyticsData={analyticsData}/>
          </Grid>}
        })
      :''}
    </>
  );
};

export default TaskAnalytics;
