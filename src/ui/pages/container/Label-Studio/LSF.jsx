import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import { Tooltip, Button, Alert, Card, TextField, Box, Grid } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CustomizedSnackbars from "../../component/common/Snackbar";
import generateLabelConfig from '../../../../utils/LabelConfig/ConversationTranslation';

import {
  getProjectsandTasks,
  postAnnotation,
  updateTask,
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

import styles from './lsf.module.css'
import "./lsf.css"
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../../../config/localisation';

//used just in postAnnotation to support draft status update.

const LabelStudioWrapper = ({annotationNotesRef, loader, showLoader, hideLoader, resetNotes}) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  const dispatch = useDispatch();
  const ProjectDetails = useSelector(state => state.getProjectDetails.data);
  const task_status = useRef(ProjectDetails.enable_task_reviews ? "labeled": "accepted");
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const navigate = useNavigate();
  const [labelConfig, setLabelConfig] = useState();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [taskData, setTaskData] = useState(undefined);
  const { projectId, taskId } = useParams();
  const userData = useSelector(state=>state.fetchLoggedInUserData.data)
  let loaded = useRef();

  console.log("projectId, taskId", projectId, taskId);
  // debugger

  useEffect(() => {
    localStorage.setItem("labelStudio:settings", JSON.stringify({
      bottomSidePanel: true,
      continuousLabeling: false,
      enableAutoSave: false,
      enableHotkeys: true,
      enableLabelTooltips: true,
      enablePanelHotkeys: true,
      enableTooltips: false,
      fullscreen: false,
      imageFullSize: false,
      selectAfterCreate: false,
      showAnnotationsPanel: true,
      showLabels: false,
      showLineNumbers: false,
      showPredictionsPanel: true,
      sidePanelMode: "SIDEPANEL_MODE_REGIONS"
    }))
  }, [])

  const tasksComplete = (id) => {
    if (id) {
      resetNotes()
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/task/${id}`);
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
        "side-column",
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
        "update",
        "submit",
        "skip",
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
        // "annotations:view-all",
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

        onLabelStudioLoad: function (ls) {
          task_status.current = ProjectDetails.enable_task_reviews ? "labeled": "accepted";
          console.log("task_status", task_status.current, "test", ProjectDetails);
          if (annotations.length === 0) {
            var c = ls.annotationStore.addAnnotation({
              userGenerate: true,
            });
            ls.annotationStore.selectAnnotation(c.id);
          }
          load_time = new Date();
        },
        onSubmitAnnotation: function (ls, annotation) {
          showLoader();
          if (taskData.task_status !== "freezed") {
            postAnnotation(
              annotation.serializeAnnotation(),
              taskData.id,
              userData.id,
              load_time,
              annotation.lead_time,
              task_status.current,
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
        },

        onSkipTask: function () {
        //   message.warning('Notes will not be saved for skipped tasks!');
          showLoader();
          updateTask(taskData.id).then(() => {
            getNextProject(projectId, taskData.id).then((res) => {
              hideLoader();
              tasksComplete(res?.id || null);
            });
          })
        },

        onUpdateAnnotation: function (ls, annotation) {
          if (taskData.task_status !== "freezed") {
            for (let i = 0; i < annotations.length; i++) {
              if (annotation.serializeAnnotation()[0].id === annotations[i].result[0].id) {
                showLoader();
                let temp = annotation.serializeAnnotation()

                for (let i = 0; i < temp.length; i++) {
                  if (temp[i].value.text) {
                    temp[i].value.text = [temp[i].value.text[0]]
                  }
                }
                patchAnnotation(
                  temp,
                  annotations[i].id,
                  load_time,
                  annotations[i].lead_time,
                  task_status.current,
                  annotationNotesRef.current.value
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
        },

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
            let tempLabelConfig = labelConfig.project_type === "ConversationTranslation" || labelConfig.project_type === "ConversationTranslationEditing" ? generateLabelConfig(taskData.data) : labelConfig.label_config;
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
    task_status.current = "draft";
    lsfRef.current.store.submitAnnotation();
  }

  const onNextAnnotation = async () => {
    showLoader();
    getNextProject(projectId, taskId).then((res) => {
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

  return (
    <div>
      {!loader && <div style={{ display: "flex", justifyContent: "space-between" }} className="lsf-controls">
        <div/>
        <Grid container spacing={0}>
        {/* <Grid container spacing={0} sx={{ justifyContent: "end" }}> */}
          <Grid item>
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
          </Grid>
          <Grid item>
          {localStorage.getItem("labelAll") !== "true" ? (
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
          ) : (
            <div style={{minWidth: "160px"}}/>
          )}
          </Grid>
        </Grid>
      </div>}
      <Box
        sx={{border : "1px solid rgb(224 224 224)"}}
      >
        <div className="label-studio-root" ref={rootRef}></div>
      </Box>
      
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
