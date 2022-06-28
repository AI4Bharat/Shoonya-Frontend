import PropTypes from 'prop-types'
import React, { useContext, useState, useEffect, useRef } from "react";
import LabelStudio from "@heartexlabs/label-studio";
import { Tooltip, Button, Alert, TextareaAutosize } from "@mui/material";

import {
  getProjectsandTasks,
  postAnnotation,
  updateTask,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation
} from "../../../../redux/actions/api/LSFAPI/LSFAPI";


import { useParams, useNavigate } from "react-router-dom";
import useFullPageLoader from "../../../../hooks/useFullPageLoader";

import styles from './lsf.module.css'
import "./lsf.css"
import { useSelector } from 'react-redux';

//used just in postAnnotation to support draft status update.
let task_status = "accepted";
let loaded = false;

const LabelStudioWrapper = ({notesRef}) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const [labelConfig, setLabelConfig] = useState();
  const [taskData, setTaskData] = useState(undefined);
  const { projectId, taskId } = useParams();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const userData = useSelector(state=>state.fetchLoggedInUserData.data)

  console.log("projectId, taskId", projectId, taskId);
  // debugger

  function LSFRoot(
    rootRef,
    lsfRef,
    userData,
    projectId,
    taskData,
    labelConfig,
    annotations,
    predictions,
    notesRef
  ) {
    let load_time;
    let interfaces = [];
    if (predictions == null) predictions = [];

    if (taskData.task_status == "freezed") {
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
        "update",
        "submit",
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
    }

    if (rootRef.current) {
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
          var c = ls.annotationStore.addAnnotation({
            userGenerate: true,
          });
          ls.annotationStore.selectAnnotation(c.id);
          load_time = new Date();
        },
        onSubmitAnnotation: function (ls, annotation) {
          showLoader();
          if (taskData.task_status != "freezed") {
            postAnnotation(
              annotation.serializeAnnotation(),
              taskData.id,
              userData.id,
              load_time,
              annotation.lead_time,
              task_status,
              notesRef.current
            )
          }
        //   else message.error("Task is freezed");

          if (localStorage.getItem("labelAll"))
            getNextProject(projectId, taskData.id).then((res) => {
              hideLoader();
              window.location.href = `/projects/${projectId}/task/${res.id}`;
            })
          else {
            hideLoader();
            window.location.reload();
          }
        },

        onSkipTask: function () {
        //   message.warning('Notes will not be saved for skipped tasks!');
          showLoader();
          updateTask(taskData.id).then(() => {
            getNextProject(projectId, taskData.id).then((res) => {
              hideLoader();
              window.location.href = `/projects/${projectId}/task/${res.id}`;
            });
          })
        },

        onUpdateAnnotation: function (ls, annotation) {
          if (taskData.task_status != "freezed") {
            showLoader();
            for (let i = 0; i < annotations.length; i++) {
              if (annotation.serializeAnnotation().id == annotations[i].result.id) {
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
                  task_status,
                  notesRef.current
                  ).then(() => {
                    if (localStorage.getItem("labelAll"))
                      getNextProject(projectId, taskData.id).then((res) => {
                        hideLoader();
                        window.location.href = `/projects/${projectId}/task/${res.id}`;
                      })
                    else{
                      hideLoader();
                      window.location.reload();
                    }
                  });
              }
            }
          } 
        //   else message.error("Task is freezed");
        },

        onDeleteAnnotation: function (ls, annotation) {
          for (let i = 0; i < annotations.length; i++) {
            if (annotation.serializeAnnotation().id == annotations[i].result.id)
              deleteAnnotation(
                annotations[i].id
              );
          }
        }
      });
    }
  }

  // we're running an effect on component mount and rendering LSF inside rootRef node
  useEffect(() => {
    if (localStorage.getItem('rtl') === "true") {
      var style = document.createElement('style');
      style.innerHTML = 'input, textarea { direction: RTL; }'
      document.head.appendChild(style);
    }
    if (
      typeof labelConfig === "undefined" &&
      typeof taskData === "undefined" &&
      userData && !loaded
    ) {
      loaded = true;
      getProjectsandTasks(projectId, taskId).then(
        ([labelConfig, taskData, annotations, predictions]) => {
          // both have loaded!
          showLoader();
          console.log("[labelConfig, taskData, annotations, predictions]", [labelConfig, taskData, annotations, predictions]);
          setLabelConfig(labelConfig.label_config);
          setTaskData(taskData.data);
          LSFRoot(
            rootRef,
            lsfRef,
            userData,
            projectId,
            taskData,
            labelConfig.label_config,
            annotations,
            predictions,
            notesRef
          );
          hideLoader();
        }
      );
    }
  }, [labelConfig, userData, notesRef]);

  const handleDraftAnnotationClick = async () => {
    task_status = "draft";
    lsfRef.current.store.submitAnnotation();
  }

  const onNextAnnotation = async () => {
    showLoader();
    getNextProject(projectId, taskId).then((res) => {
      hideLoader();
      window.location.href = `/projects/${projectId}/task/${res.id}`;
    });
  }

  return (
    <div>
      {!loader && <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div/>
        <div>
          <Tooltip title="Save task for later">
            <Button
              value="Draft"
              type="default"
              onClick={handleDraftAnnotationClick}
              style={{minWidth: "160px", borderColor:"#e5e5e5", color: "#e80", fontWeight: "500"}}
            >
              Draft
            </Button>
          </Tooltip>
          {localStorage.getItem("labelAll") != "true" ? (
            <Tooltip title="Go to next task">
              <Button
                value="Next"
                type="default"
                onClick={onNextAnnotation}
                style={{minWidth: "160px", borderColor:"#e5e5e5", color: "#09f", fontWeight: "500"}}
              >
                Next
              </Button>
            </Tooltip>
          ) : (
            <div style={{minWidth: "160px"}}/>
          )}
        </div>
      </div>}
      <div className="label-studio-root" ref={rootRef}></div>
      {loader}
    </div>
  );
};

export default function LSF() {
  const [collapseHeight, setCollapseHeight] = useState('0');
  const notesRef = useRef('');
  const {taskId} = useParams()
  const [notesValue, setNotesValue] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const handleCollapseClick = () => {
    if(collapseHeight === '0') {
      setCollapseHeight('auto')
    } else {
      setCollapseHeight('0');
    }
  }

  useEffect(()=>{
    fetchAnnotation(taskId).then((data)=>{
      if(data && Array.isArray(data) && data.length > 0) {
        setNotesValue(data[0].notes);
      }
    })
  }, [setNotesValue, taskId]);

  useEffect(()=>{
    notesRef.current = notesValue;
  }, [notesValue])
  
  return (
    <div style={{ maxHeight: "100%", maxWidth: "90%" }}>
      <div style={{ maxWidth: "100%", display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>
          <Button
            value="Back to Project"
            onClick={() => {
              localStorage.removeItem("labelAll");
              navigate(`/projects/${projectId}`);
            }}
          >
            Back to Project
          </Button>
          <Button style={{marginLeft:'20%'}} onClick={handleCollapseClick}>
            Notes
          </Button>
        </div>
      </div>
      <div className={styles.collapse} style={{height:collapseHeight}}>
        <Alert message="Please do not add notes if you are going to skip the task!" severity="warning" showIcon style={{marginBottom: '1%'}} />
        <TextareaAutosize placeholder="Place your remarks here ..." value={notesValue} onChange={event=>setNotesValue(event.target.value)} />
      </div>
      <LabelStudioWrapper notesRef={notesRef}/>
    </div>
  );
}

LabelStudioWrapper.propTypes = PropTypes.object;