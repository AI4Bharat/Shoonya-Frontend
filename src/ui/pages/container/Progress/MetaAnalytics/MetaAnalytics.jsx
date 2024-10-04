import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButton from "../../../component/common/Button";
// import { Grid ,ThemeProvider} from "@material-ui/core";
import { Button, Grid, ThemeProvider, Select, Box, MenuItem,Radio, InputLabel, FormControl, Card, Typography, Menu, styled } from "@mui/material";
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
import SentanceCountMetaAnalyticsChart from './SentanceCountMetaAnalyticsChart';
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
      const metaAnalyticsDataJson = useSelector((state) => state.getMetaAnalyticsData.originalData);

      const [anchorEl, setAnchorEl] = useState(null);
      const open = Boolean(anchorEl);
    
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
        'OCRSegmentCategorizationEditing '
      ]

      useEffect(() => {
        let types=[...audioProjectTypes,...translationProjectTypes,...conversationProjectTypes,...ocrProjectTypes,'AllTypes']
        setProjectTypes(types);
      }, []);

      useEffect(() => {
        const handler = setTimeout(() => {
          if(!metaAnalyticsData.length){
            getMetaAnalyticsdata();
          }
        }, 500); 
        return () => {
            clearTimeout(handler);
        };
    }, []);      const handleSubmit = async () => {
        getMetaAnalyticsdata();
      }

      useEffect(() => {
        if(metaAnalyticsData.length > 0){
          setLoading(false);

        }
      }, [metaAnalyticsData]);
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const downloadCSV = () => {
        if (metaAnalyticsDataJson) {
          const transformedData = Object.keys(metaAnalyticsDataJson).flatMap(projectType => {
            return metaAnalyticsDataJson[projectType].map(data => ({
              projectType,
              language: data.language,
              Ann_Cumulative_sentence_Count: data.annotation_cumulative_sentance_count,
              Rew_Cumulative_sentence_Count: data.review_cumulative_sentance_count,
              Ann_Cumulative_word_Count:data.ann_cumulative_word_count,
              Rew_Cumulative_word_Count:data.rew_cumulative_word_count
            }));
          });
    
          const fileName = 'meta_analytics';
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
      
        metaAnalyticsData.forEach((dataArray, index) => {
          if (dataArray.length) {
            const projectType = dataArray[0].projectType;
            doc.setFontSize(14);
            doc.text(`Project Type: ${projectType}`, 10, yOffset);
            yOffset += 10;
      
            doc.setFontSize(12);
            dataArray.forEach((data, i) => {
              doc.text(`Language: ${data.languages || 'N/A'}`, 10, yOffset);
              doc.text(`Ann Cumulative word Count: ${data.annotation_cumulative_word_count || 'N/A'}`, 10, yOffset + 5);
              doc.text(`Rew Cumulative word Count: ${data.review_cumulative_word_count || 'N/A'}`, 10, yOffset + 10);
              yOffset += 25;
      
              if (yOffset > pageHeight - 30) { 
                doc.addPage();
                yOffset = 10;
              }
            });
      
            yOffset += 10; 
          }
        });
      
        doc.save('meta_analytics.pdf');
      };
      const downloadJSON = () => {
        if (metaAnalyticsDataJson) {
          const transformedData = Object.keys(metaAnalyticsDataJson).flatMap(projectType => {
            return metaAnalyticsDataJson[projectType].map(data => ({
              projectType,
              language: data.language,
              Ann_Cumulative_sentence_Count: data.annotation_cumulative_sentance_count,
              Rew_Cumulative_sentence_Count: data.review_cumulative_sentance_count,
              Ann_Cumulative_word_Count:data.ann_cumulative_word_count,
              Rew_Cumulative_word_Count:data.rew_cumulative_word_count

            }));
          });
    
          const fileName = 'meta_analytics';
          const exportType = exportFromJSON.types.json;
          exportFromJSON({ data: transformedData, fileName, exportType });
        }
      };  const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    
      };
  return (
    <div>
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
{/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} container justifyContent="space-between" alignItems="center"> */}
<CustomButton label="Submit" sx={{ width: { xs: "100px", md: "120px" }, height: "40px" }} onClick={handleSubmit}  />
          <Box display="flex"   sx={{ width: { xs: "100px", md: "120px" }, height: "40px", marginRight: 1 }}alignItems="center">
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
      :''}
    </div>
  )
}
