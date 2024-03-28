import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import { Tooltip, Button, Alert, Card, TextField, Box, Grid } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CustomizedSnackbars from "../../component/common/Snackbar";
import generateLabelConfig from '../../../../utils/LabelConfig/ConversationTranslation';
import conversationVerificationLabelConfig from "../../../../utils/LabelConfig/ConversationVerification"
import LightTooltip from "../../component/common/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers';

import {
  getProjectsandTasks,
  postAnnotation,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation
} from "../../../../redux/actions/api/LSFAPI/LSFAPI";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';

import { useParams, useNavigate } from "react-router-dom";
import useFullPageLoader from "../../../../hooks/useFullPageLoader";
import { snakeToTitleCase } from '../../../../utils/utils';
import keymap from './keymap';
import styles from './lsf.module.css'
import "./lsf.css"
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../config/localisation';
import { labelConfigJS } from './labelConfigJSX';

//used just in postAnnotation to support draft status update.

const LabelStudioWrapper = ({annotationNotesRef, loader, showLoader, hideLoader, resetNotes}) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  const dispatch = useDispatch();
  const ProjectDetails = useSelector(state => state.getProjectDetails.data);
  const annotation_status = useRef(ProjectDetails.project_stage == 2 ? "labeled": "accepted");
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const navigate = useNavigate();
  const [labelConfig, setLabelConfig] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const ocrDomain = useRef();
  const [ocrD, setOcrD] = useState("");
  const selectedLanguages = useRef([]);
  const [selectedL, setSelectedL] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [taskData, setTaskData] = useState(undefined);
  const { projectId, taskId } = useParams();
  const userData = useSelector(state=>state.fetchLoggedInUserData.data)
  const [assignedUsers, setAssignedUsers] = useState(null);
  let loaded = useRef();

  useEffect(() => {
    setPredictions(taskData?.data?.ocr_prediction_json);
  }, [taskData]);

  console.log("projectId, taskId", projectId, taskId);
  // debugger

useEffect(() => {
    let sidePanel = ProjectDetails?.project_type?.includes("OCRSegmentCategorization");
    let showLabelsOnly = ProjectDetails?.project_type?.includes("OCRSegmentCategorization");
    let selectAfterCreateOnly = ProjectDetails?.project_type?.includes("OCRSegmentCategorization");
    let continousLabelingOnly = ProjectDetails?.project_type?.includes("OCRSegmentCategorization");
    localStorage.setItem(
      "labelStudio:settings",
      JSON.stringify({
        bottomSidePanel: !sidePanel,
        continuousLabeling: continousLabelingOnly,
        enableAutoSave: false,
        enableHotkeys: true,
        enableLabelTooltips: true,
        enablePanelHotkeys: true,
        enableTooltips: false,
        fullscreen: false,
        imageFullSize: false,
        selectAfterCreate: selectAfterCreateOnly,
        showAnnotationsPanel: true,
        showLabels: showLabelsOnly,
        showLineNumbers: false,
        showPredictionsPanel: true,
        sidePanelMode: "SIDEPANEL_MODE_REGIONS",
      })
    );
  }, []);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then(res => setAssignedUsers(res));
    }
    taskData?.id && showAssignedUsers();
  }, [taskData]);

  /* useEffect(() => {
    if (Object.keys(userData).includes("prefer_cl_ui") && userData.prefer_cl_ui) {
      navigate(`/projects/${projectId}/AllAudioTranscriptionLandingPage/${taskId}`);
    }
  }, [userData]); */

  const tasksComplete = (id) => {
    if (id) {
      resetNotes()
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/Alltask/${id}`);
    } else {
      // navigate(-1);
      resetNotes()
      setSnackbarInfo({
        open: true,
        message: "No more tasks to label",
        variant: "info",
      });
      setTimeout(() => {
        localStorage.removeItem("labelAll");
        window.location.replace(`/#/projects/${projectId}`);
        window.location.reload();
      }, 1000);
    }
  }

  function LSFRoot(
    rootRef,
    lsfRef,
    userData,
    projectId,
    taskData,
    labelConfig,
    annotations,
    predictions,
    annotationNotesRef,
  ) {
    let load_time;
    let interfaces = [];
    if (predictions == null) predictions = [];

    if (taskData.task_status === "freezed") {
      interfaces = [
        "panel",
        // "update",
        // "submit",
        "skip",
        "controls",
        "infobar",
        "topbar",
        "instruction",
        // "side-column",
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        "annotations:delete",
        // "annotations:view-all",
        "predictions:tabs",
        "predictions:menu",
        // "auto-annotation",
        "edit-history",
      ];
    } else {
      interfaces = [
        "panel",
       // "update",
//"submit",
       // "skip",
        ...taskData?.annotation_users?.some((user) => user === userData.id) ? ["controls"] : [],
        "infobar",
        "topbar",
        "instruction",
         "side-column",
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        "annotations:delete",
        "annotations:view-all",
        "predictions:tabs",
        "predictions:menu",
        // "auto-annotation",
        "edit-history",
      ];
    }

    if (rootRef.current) {
      if (lsfRef.current) {
        lsfRef.current.destroy();
      }
      lsfRef.current = new LabelStudio(rootRef.current, {
        /* all the options according to the docs */
        config: labelConfig,

        interfaces: interfaces,

        user: {
          pk: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
        },

        task: {
          annotations: annotations,
          predictions: predictions,
          id: taskData.id,
          data: taskData.data,
        },
        keymap: keymap,

        onLabelStudioLoad: function (ls) {
          annotation_status.current = ProjectDetails.project_stage == 2 ? "labeled": "accepted";
          console.log("annotation_status", annotation_status.current, "test", ProjectDetails);
          if (annotations.length === 0) {
            var c = ls.annotationStore.addAnnotation({
              userGenerate: true,
            });
            ls.annotationStore.selectAnnotation(c.id);
          }
          load_time = new Date();
        },
        onSubmitAnnotation: function (ls, annotation) {
          let temp = annotation.serializeAnnotation();
          let ids = new Set();
          let countLables = 0;         
          temp.map((curr) => {
            ids.add(curr.id);
            if(curr.type === "labels"){
              countLables++;
            }
          });
          if (ids.size>countLables) {
            setSnackbarInfo({
              open: true,
              message: "Please select labels for all boxes",
              variant: "error",
            });
          }
          else {
            showLoader();
            if (taskData.annotation_status !== "freezed") {
              postAnnotation(
                annotation.serializeAnnotation(),
                taskData.id,
                userData.id,
                load_time,
                annotation.lead_time,
                annotation_status.current,
                annotationNotesRef.current.value
              ).then((res) => {
                if (localStorage.getItem("labelAll"))
                  getNextProject(projectId, taskData.id).then((res) => {
                    hideLoader();
                    // window.location.href = `/projects/${projectId}/task/${res.id}`;
                    tasksComplete(res?.id || null);
                  })
                else {
                  hideLoader();
                  window.location.reload();
                }
              })
            }
            else
            setSnackbarInfo({
              open: true,
              message: "Task is frozen",
              variant: "error",
            });
        }},

        onSkipTask: function () {
        //   message.warning('Notes will not be saved for skipped tasks!');
          let annotation = annotations.find((annotation) => !annotation.parentAnnotation);
          console.log("onSkip", annotation)
          if (annotation) {
            showLoader();
            patchAnnotation(
              null,
              annotation.id,
              load_time,
              annotation.lead_time,
              "skipped",
              annotationNotesRef.current.value
            ).then(() => {
              getNextProject(projectId, taskData.id).then((res) => {
                hideLoader();
                tasksComplete(res?.id || null);
              });
            });
          }
        },

        onUpdateAnnotation: function (ls, annotation) {
          let temp = annotation.serializeAnnotation();
          let ids = new Set();
          let countLables = 0;   
          temp.map((curr) => {
            ids.add(curr.id);
            if(curr.type === "labels"){
              countLables++;
            }
          });
          if (ids.size>countLables) {
            setSnackbarInfo({
              open: true,
              message: "Please select labels for all boxes",
              variant: "error",
            });
          }
          else {
            if (taskData.annotation_status !== "freezed") {
              for (let i = 0; i < annotations.length; i++) {
                if (!annotations[i].result?.length || annotation.serializeAnnotation()[0].id === annotations[i].result[0].id) {
                  showLoader();

                  for (let i = 0; i < temp.length; i++) {
                    if(temp[i].type === "relation"){
                      continue;
                    }else if (temp[i].value.text) {
                      temp[i].value.text = [temp[i].value.text[0]]
                    }
                  }
                  patchAnnotation(
                    temp,
                    annotations[i].id,
                    load_time,
                    annotations[i].lead_time,
                    annotation_status.current,
                    annotationNotesRef.current.value,
                    {},
                    false,
                    selectedLanguages,
                    ocrDomain
                    ).then(() => {
                      if (localStorage.getItem("labelAll"))
                        getNextProject(projectId, taskData.id).then((res) => {
                          hideLoader();
                          tasksComplete(res?.id || null);
                        })
                      else{
                        hideLoader();
                        window.location.reload();
                      }
                    });
                }
              }
            } 
            else
            setSnackbarInfo({
              open: true,
              message: "Task is frozen",
              variant: "error",
            });
        }},

        onDeleteAnnotation: function (ls, annotation) {
          for (let i = 0; i < annotations.length; i++) {
            if (annotation.serializeAnnotation()[0].id === annotations[i].result[0].id) {
              deleteAnnotation(
                annotations[i].id
              );
              var c = ls.annotationStore.addAnnotation({
                userGenerate: true,
              });
              ls.annotationStore.selectAnnotation(c.id);
            }
          }
        }
      });
    }
  }

  // we're running an effect on component mount and rendering LSF inside rootRef node
  localStorage.setItem("TaskData", JSON.stringify(taskData));
  useEffect(() => {
    if (localStorage.getItem('rtl') === "true") {
      var style = document.createElement('style');
      style.innerHTML = 'input, textarea { direction: RTL; }'
      document.head.appendChild(style);
    }
    if (
      userData?.id && loaded.current !== taskId
    ) {
      if (Object.keys(ProjectDetails).length === 0) {
        const projectObj = new GetProjectDetailsAPI(projectId);
        dispatch(APITransport(projectObj));
      } else {
        loaded.current = taskId;
        getProjectsandTasks(projectId, taskId).then(
          ([labelConfig, taskData, annotations, predictions]) => {
            // both have loaded!
            console.log("[labelConfig, taskData, annotations, predictions]", [labelConfig, taskData, annotations, predictions]);
            let tempLabelConfig = labelConfig.project_type === "ConversationTranslation" || labelConfig.project_type === "ConversationTranslationEditing" ? generateLabelConfig(taskData.data) : labelConfig.project_type === "ConversationVerification" ? conversationVerificationLabelConfig(taskData.data) : labelConfig.label_config;
            if (labelConfig.project_type.includes("OCRSegmentCategorization")){
              tempLabelConfig = labelConfigJS;
            }
            setLabelConfig(tempLabelConfig);
            setTaskData(taskData);
            LSFRoot(
              rootRef,
              lsfRef,
              userData,
              projectId,
              taskData,
              tempLabelConfig,
              annotations,
              predictions,
              annotationNotesRef
            );
            hideLoader();
          }
        );
      }
    }
  }, [labelConfig, userData, annotationNotesRef, taskId, ProjectDetails]);

  useEffect(() => {
    showLoader();
  }, [taskId]);

  const handleDraftAnnotationClick = async () => {
    annotation_status.current = "draft";
    lsfRef.current.store.submitAnnotation();
  }

  const onNextAnnotation = async () => {
    showLoader();
    getNextProject(projectId, taskId,"Alltask").then((res) => {
        console.log(taskId,"taskId")
      hideLoader();
      // window.location.href = `/projects/${projectId}/task/${res.id}`;
     tasksComplete(res?.id || null);
    });
  }

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
        autoHideDuration={2000}
      />
    );
  };

  const handleSelectChange = (event) => {
    selectedLanguages.current = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedL(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  useEffect(() => {
    if(taskData){
      if(Array.isArray(taskData?.data?.language)){
        taskData?.data?.language?.map((lang)=>{
          selectedLanguages.current?.push(lang);
          const newLanguages = [...selectedL, ...taskData?.data?.language];
          setSelectedL(newLanguages);
        });
      }
      if(typeof taskData?.data?.language === 'string' && taskData?.data?.ocr_domain !== ""){
        setSelectedL([taskData?.data?.language]);
        selectedLanguages.current?.push(taskData?.data?.language);
      }
      if(typeof taskData?.data?.ocr_domain === 'string' && taskData?.data?.ocr_domain !== ""){
        ocrDomain.current = taskData?.data?.ocr_domain;
        setOcrD(taskData?.data?.ocr_domain);
      }
    }
  }, [taskData]);

  return (
    <div>
      {!loader && <div style={{ display: "flex", justifyContent: "space-between" }} className="lsf-controls">
      <Grid container spacing={0}>
        <Grid container spacing={0} sx={{ justifyContent: "end" }}>
          {/* <Grid item>
          {taskData?.annotation_users?.some((user) => user === userData.id) && <Tooltip title="Save task for later">
            <Button
              value="Draft"
              type="default"
              onClick={handleDraftAnnotationClick}
              style={{minWidth: "160px", border:"1px solid #e6e6e6", color: "#e80", pt: 3, pb: 3, borderBottom: "None"}}
              className="lsf-button"
            >
              Draft
            </Button>
          </Tooltip>}
          </Grid> */}
            <Grid item>
              <LightTooltip title={assignedUsers ? assignedUsers : ""} >
                <Button
                  type="default"
                  className="lsf-button"
                  style={{
                    minWidth: "40px",
                    border: "1px solid #e6e6e6",
                    color: "grey",
                    pt: 1, pl: 1, pr: 1,
                    borderBottom: "None",
                  }}
                  > 
                    <InfoOutlinedIcon sx={{mb: "-3px", ml: "2px", color: "grey"}}/>
                </Button>
              </LightTooltip>
            </Grid>
            <Grid item>

            <>
            <Tooltip title="Go to next task">
              <Button
                value="Next"
                type="default"
                onClick={onNextAnnotation}
                style={{minWidth: "160px", border:"1px solid #e6e6e6", color: "#09f", pt: 3, pb: 3, borderBottom: "None",}}
                className="lsf-button"
              >
                Next
              </Button>
            </Tooltip>

        </>

          </Grid>


        </Grid>
        </Grid>
        <div/>

      </div>}
      <Box
        sx={{border : "1px solid rgb(224 224 224)"}}
      >
        <div className="label-studio-root" ref={rootRef}></div>
      </Box>
      {!loader && ProjectDetails?.project_type?.includes("OCRSegmentCategorization") && 
          <>
            <div style={{borderStyle:"solid", borderWidth:"1px", borderColor:"#E0E0E0", paddingBottom:"1%", display:"flex", justifyContent:"space-around"}}>
              <div style={{paddingLeft:"1%", fontSize:"medium", paddingTop:"1%", display:"flex"}}><div style={{margin:"auto"}}>Languages :&nbsp;</div>
              <select multiple onChange={handleSelectChange} value={selectedL}>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Bengali">Bengali</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Assamese">Assamese</option>
                <option value="Bodo">Bodo</option>
                <option value="Dogri">Dogri</option>
                <option value="Kashmiri">Kashmiri</option>
                <option value="Maithili">Maithili</option>
                <option value="Manipuri">Manipuri</option>
                <option value="Nepali">Nepali</option>
                <option value="Odia">Odia</option>
                <option value="Sindhi">Sindhi</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Urdu">Urdu</option>
                <option value="Santali">Santali</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Goan Konkani">Goan Konkani</option>
              </select>
              </div>
              <div style={{paddingLeft:"1%", fontSize:"medium", paddingTop:"1%", display:"flex"}}><div style={{margin:"auto"}}>Domain :&nbsp;</div>
              <select style={{margin:"auto"}} onChange={(e) => {setOcrD(e.target.value); ocrDomain.current = e.target.value;}} value={ocrD}>
                <option disabled selected></option>
                <option value="BO">Books</option>
                <option value="FO">Forms</option>
                <option value="OT">Others</option>
                <option value="TB">Textbooks</option>
                <option value="NV">Novels</option>
                <option value="NP">Newspapers</option>
                <option value="MG">Magazines</option>
                <option value="RP">Research_Papers</option>
                <option value="FM">Form</option>
                <option value="BR">Brochure_Posters_Leaflets</option>
                <option value="AR">Acts_Rules</option>
                <option value="PB">Publication</option>
                <option value="NT">Notice</option>
                <option value="SY">Syllabus</option>
                <option value="QP">Question_Papers</option>
                <option value="MN">Manual</option>
              </select>
              </div>
            </div>
            <div style={{borderStyle:"solid", borderWidth:"1px", borderColor:"#E0E0E0", paddingBottom:"1%"}}>
              <div style={{paddingLeft:"1%", fontSize:"medium", paddingTop:"1%", paddingBottom:"1%"}}>Predictions</div>
              {predictions?.length > 0 ?
                (() => {
                  try {
                    return JSON.parse(predictions)?.map((pred, index) => (
                      <div style={{paddingLeft:"2%", display:"flex", paddingRight:"2%", paddingBottom:"1%"}}>
                        <div style={{padding:"1%", margin:"auto", color:"#9E9E9E"}}>{index}</div>
                        <textarea readOnly style={{width:"100%", borderColor:"#E0E0E0"}} value={pred.text}/>
                      </div>
                    ));
                  } catch (error) {
                    console.error("Error parsing predictions:", error);
                    return predictions?.map((pred, index) => (
                      <div style={{paddingLeft:"2%", display:"flex", paddingRight:"2%", paddingBottom:"1%"}}>
                        <div style={{padding:"1%", margin:"auto", color:"#9E9E9E"}}>{index}</div>
                        <textarea readOnly style={{width:"100%", borderColor:"#E0E0E0"}} value={pred.text}/>
                      </div>
                    ));
                  }
                })()
              :
              <div style={{textAlign:"center"}}>No Predictions Present</div>}
            </div>
          </>
        }

      {loader}
      {renderSnackBar()}
    </div>
  );
};

export default function LSF() {
  const [showNotes, setShowNotes] = useState(false);
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const {taskId} = useParams()
  // const [notesValue, setNotesValue] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  }

  useEffect(()=>{
    fetchAnnotation(taskId).then((data)=>{
      if(data && Array.isArray(data) && data.length > 0) {
        annotationNotesRef.current.value = data[0].annotation_notes?? '';
        reviewNotesRef.current.value = data[0].review_notes?? '';
      }
    })
  }, [taskId]);

  const resetNotes = () => {
    setShowNotes(false);
    annotationNotesRef.current.value = "";
    reviewNotesRef.current.value = "";
  }

  useEffect(()=>{
    resetNotes();
  }, [taskId]);

  return (
    <div style={{ maxHeight: "100%", maxWidth: "100%", margin: "auto" }}>
      {!loader && <Button
        value="Back to Project"
        startIcon={<  ArrowBackIcon />}
        variant="contained" 
        color="primary"
        sx={{mt:2}} 
        onClick={() => {
          localStorage.removeItem("labelAll");
          navigate(`/projects/${projectId}`);
          //window.location.replace(`/#/projects/${projectId}`);
          //window.location.reload();
        }}
      >
        Back to Project
      </Button>}
      <Card
        sx={{
            minHeight: 500,
            padding: 5,
            mt: 3,
            pt: 3,
        }}
      >
        {!loader && <Button 
          endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
          variant="contained"
          color={reviewNotesRef.current?.value !== "" ? "success" : "primary"}
          onClick={handleCollapseClick}
          style={{marginBottom:'20px'}}
        >
          Notes {reviewNotesRef.current?.value !== "" && "*"}
        </Button>}
        <div className={styles.collapse} style={{display: showNotes? "block" : "none",paddingBottom: "16px"}}>
          <Alert severity="warning" showIcon style={{marginBottom: '1%'}}>
              {translate("alert.notes")}
          </Alert>
          <TextField
            multiline 
            placeholder="Place your remarks here ..." 
            label="Annotation Notes"
            // value={notesValue} 
            // onChange={event=>setNotesValue(event.target.value)} 
            inputRef={annotationNotesRef}
            rows={2}
            maxRows={4}
            inputProps={{
              style: {fontSize: "1rem",},
            }}
            style={{width: '99%'}}
          />
          <TextField
            multiline 
            placeholder="Place your remarks here ..." 
            label="Review Notes"
            // value={notesValue} 
            // onChange={event=>setNotesValue(event.target.value)} 
            inputRef={reviewNotesRef}
            rows={2}
            maxRows={4}
            inputProps={{
              style: {fontSize: "1rem",},
              readOnly: true,
            }}
            style={{width: '99%', marginTop: '1%'}}
          />
        </div>
        <LabelStudioWrapper resetNotes={()=>resetNotes()} annotationNotesRef={annotationNotesRef} loader={loader} showLoader={showLoader} hideLoader={hideLoader}/>
      </Card>
    </div>
  );
}

LabelStudioWrapper.propTypes = PropTypes.object;
