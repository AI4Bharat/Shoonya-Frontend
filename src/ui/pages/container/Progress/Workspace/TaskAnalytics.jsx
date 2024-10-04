// import { Grid } from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography, Menu, styled } from "@mui/material";
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
import exportFromJSON from 'export-from-json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { KeyboardArrowDown } from "@material-ui/icons";
const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,


  },
}));



const TaskAnalytics = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("ContextualTranslationEditing");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
  const taskAnalyticsData = useSelector(
    (state) => state.wsTaskAnalytics.data
  );
  const taskAnalyticsDataJson = useSelector((state) => state.wsTaskAnalytics.originalData);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
    'OCRSegmentCategorizationEditing'
  ]

  useEffect(() => {
    let types=[...audioProjectTypes,...translationProjectTypes,...conversationProjectTypes,...ocrProjectTypes,'AllTypes']
    setProjectTypes(types);
  }, []);

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
  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadCSV = () => {
    if (taskAnalyticsDataJson) {
      const transformedData = Object.keys(taskAnalyticsDataJson).flatMap(projectType => {
        return taskAnalyticsDataJson[projectType].map(data => ({
          projectType,
          language: data.language,
          ann_cumulative_tasks_count: data.ann_cumulative_tasks_count,
          rew_cumulative_tasks_count: data.rew_cumulative_tasks_count,
        }));
      });

      const fileName = 'task_analytics';
      const exportType = exportFromJSON.types.csv;
      exportFromJSON({ data: transformedData, fileName, exportType });
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    const pageHeight = doc.internal.pageSize.height;
  
    doc.setFontSize(18);
    doc.text("Task Analytics Report", 10, yOffset);
    yOffset += 20;
  
    taskAnalyticsData.forEach((dataArray, index) => {
      if (dataArray.length) {
        const projectType = dataArray[0].projectType;
        doc.setFontSize(14);
        doc.text(`Project Type: ${projectType}`, 10, yOffset);
        yOffset += 10;
  
        doc.setFontSize(12);
        dataArray.forEach((data, i) => {
          doc.text(`Language: ${data.languages || 'N/A'}`, 10, yOffset);
          doc.text(`Ann Cumulative Tasks Count: ${data.annotation_cumulative_tasks_count || 'N/A'}`, 10, yOffset + 5);
          doc.text(`Rew Cumulative Tasks Count: ${data.review_cumulative_tasks_count || 'N/A'}`, 10, yOffset + 10);
          yOffset += 25;
  
          if (yOffset > pageHeight - 30) { 
            doc.addPage();
            yOffset = 10;
          }
        });
  
        yOffset += 10; 
      }
    });
  
    doc.save('task_analytics.pdf');
  };
  const downloadJSON = () => {
    if (taskAnalyticsDataJson) {
      const transformedData = Object.keys(taskAnalyticsDataJson).flatMap(projectType => {
        return taskAnalyticsDataJson[projectType].map(data => ({
          projectType,
          language: data.language,
          ann_cumulative_tasks_count: data.ann_cumulative_tasks_count,
          rew_cumulative_tasks_count: data.rew_cumulative_tasks_count,
        }));
      });

      const fileName = 'task_analytics';
      const exportType = exportFromJSON.types.json;
      exportFromJSON({ data: transformedData, fileName, exportType });
    }
  };  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };


  return (
    <>
      {console.log(taskAnalyticsData[0])}
      <Grid container columnSpacing={3} rowSpacing={2}  mb={1} gap={3}>
      <Grid item xs={6} sm={6} md={6} lg={6} xl={6} display={"flex"} justifyContent="space-between" >
      <FormControl  size="small">
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
  <CustomButton label="Submit" sx={{ width: "120px" }} onClick={handleSubmit} disabled={loading} />
          <Box display="flex" alignItems="center">
            <CustomButton
              onClick={handleClick}
              disabled={loading}
              sx={{ marginRight: 1 }}
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
        {/* </Grid> */}
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
          </Grid>
          }
        })
        :''
      }
    </>
  );
};

export default TaskAnalytics;
