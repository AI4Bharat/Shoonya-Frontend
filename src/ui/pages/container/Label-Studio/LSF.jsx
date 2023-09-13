import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from 'react-quill';
import "./editor.css"
import 'quill/dist/quill.snow.css';
import LabelStudio from "@heartexlabs/label-studio";
import {
  Tooltip,
  Button,
  Alert,
  Card,
  TextField,
  Box,
  Grid,
  Typography,
  Popover,
  IconButton,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomizedSnackbars from "../../component/common/Snackbar";
import generateLabelConfig from "../../../../utils/LabelConfig/ConversationTranslation";
import conversationVerificationLabelConfig from "../../../../utils/LabelConfig/ConversationVerification";

import {
  getProjectsandTasks,
  postAnnotation,
  getNextProject,
  patchAnnotation,
  deleteAnnotation,
  fetchAnnotation,
} from "../../../../redux/actions/api/LSFAPI/LSFAPI";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";

import { useParams, useNavigate } from "react-router-dom";
import useFullPageLoader from "../../../../hooks/useFullPageLoader";

import styles from "./lsf.module.css";
import "./lsf.css";
import { useDispatch, useSelector } from "react-redux";
import Glossary from "../Glossary/Glossary";
import { TabsSuggestionData } from "../../../../utils/TabsSuggestionData/TabsSuggestionData";
import InfoIcon from "@mui/icons-material/Info";

const filterAnnotations = (
  annotations,
  user,
  setDisableBtns,
  setFilterMessage,
  setDisableButton
) => {
  let disable = false;
  let disableSkip = false;
  let filteredAnnotations = annotations;
  let userAnnotation = annotations.find((annotation) => {
    return annotation.completed_by === user.id && !annotation.parent_annotation;
  });
  let userAnnotationData = annotations.find(
    (annotation) =>
      annotation.annotation_type === 2
  );

  if (userAnnotation) {

    if (userAnnotation.annotation_status === "labeled") {
      const superCheckedAnnotation = annotations.find(
        (annotation) => annotation.annotation_type === 3
      );
      let review = annotations.find(
        (annotation) =>
          annotation.parent_annotation === userAnnotation.id &&
          annotation.annotation_type === 2
      );
      if (
        superCheckedAnnotation &&
        ["draft", "skipped", "validated", "validated_with_changes"].includes(
          superCheckedAnnotation.annotation_status
        )
      ) {
        filteredAnnotations = [superCheckedAnnotation];
        setFilterMessage(
          "This is the Super Checker's Annotation in read only mode"
        );
        setDisableBtns(true);
        disable = true;
      } else if (
        review &&
        [
          "skipped",
          "draft",
          "rejected",
          "unreviewed",
        ].includes(review.annotation_status)
      ) {
        filteredAnnotations = [userAnnotation];
        disable = true;
        setDisableBtns(true);
        setFilterMessage("This task is being reviewed by the reviewer");
      } else if (
        review &&
        [
          "accepted",
          "accepted_with_minor_changes",
          "accepted_with_major_changes",
        ].includes(review.annotation_status)
      ) {
        filteredAnnotations = [review];
        disable = true;
        setDisableBtns(true);
        setFilterMessage("This is the Reviewer's Annotation in read only mode");
      } else {
        filteredAnnotations = [userAnnotation];
      }
    }
    else if (
      userAnnotationData &&
      [
        "draft",
      ].includes(userAnnotation.annotation_status)
    ) {
      filteredAnnotations = [userAnnotation];
      disableSkip = true;
      setDisableButton(true);
      setFilterMessage("Skip button is disabled, since the task is being reviewed");
    }
    else if (
      userAnnotation &&
      [
        "to_be_revised"
      ].includes(userAnnotation.annotation_status)
    ) {
      filteredAnnotations = [userAnnotation];
      disableSkip = true;
      setDisableButton(true);
      setFilterMessage("Skip button is disabled, since the task is being reviewed");
    }

    else {
      filteredAnnotations = [userAnnotation];
    }
  } else if ([4, 5, 6].includes(user.role)) {
    filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
    disable = true;
    setDisableBtns(true);
    disableSkip = true;
  }
  return [filteredAnnotations, disable, disableSkip];
};

//used just in postAnnotation to support draft status update.

const AUTO_SAVE_INTERVAL = 30000; //1 minute
const AUDIO_PROJECT_SAVE_CHECK = [
  "AudioTranscription",
  "AudioTranscriptionEditing",
];

const LabelStudioWrapper = ({
  annotationNotesRef,
  loader,
  showLoader,
  hideLoader,
  resetNotes,
  getTaskData,
}) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const rootRef = useRef();
  const dispatch = useDispatch();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const annotation_status = useRef(
    ProjectDetails.project_stage == 2 ? "labeled" : "labeled"
  );
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
  const [annotations, setAnnotations] = useState([]);
  const load_time = useRef();
  const [autoSave, setAutoSave] = useState(true);
  let isAudioProject = useRef();
  const { projectId, taskId } = useParams();
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  let loaded = useRef();

  const [showTagSuggestionsAnchorEl, setShowTagSuggestionsAnchorEl] =
    useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState();
  const [disableBtns, setDisableBtns] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  //console.log("projectId, taskId", projectId, taskId);
  // debugger
  // const projectType = ProjectDetails?.project_type?.includes("Audio")
  
  useEffect(() => {
    localStorage.setItem(
      "labelStudio:settings",
      JSON.stringify({
        bottomSidePanel: ProjectDetails?.project_type?.includes("Audio")
          ? false
          : true,
        continuousLabeling: false,
        enableAutoSave: true,
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
        sidePanelMode: "SIDEPANEL_MODE_REGIONS",
      })
    );
  }, []);

  const tasksComplete = (id) => {
    if (id) {
      resetNotes();
      // navigate(`/projects/${projectId}/task/${id}`, {replace: true});
      navigate(`/projects/${projectId}/task/${id}`);
    } else {
      // navigate(-1);
      resetNotes();
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
  };

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
    projectType
  ) {
    let interfaces = [];

    if (predictions == null) predictions = [];
    const [filteredAnnotations, disableLSFControls, disableSkip] = filterAnnotations(
      annotations,
      userData,
      setDisableBtns,
      setFilterMessage,
      setDisableButton
    );
    isAudioProject.current = AUDIO_PROJECT_SAVE_CHECK.includes(projectType);
    //console.log("labelConfig", labelConfig);

    if (taskData.task_status === "freezed") {
      interfaces = [
        "panel",
        // "update",
        // "submit",
        "skip",
        ...(!disableLSFControls && ["controls"]),
        "infobar",
        "topbar",
        "instruction",
        ...(isAudioProject.current ? ["side-column"] : []),
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        // "annotations:delete",
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
        ...(!disableSkip ? ["skip"] : []),
        ...(taskData?.annotation_users?.some(
          (user) => user === userData.id && !disableLSFControls
        )
          ? ["controls"]
          : []),
        "infobar",
        "topbar",
        "instruction",
        ...(isAudioProject.current ? ["side-column"] : []),
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        // "annotations:delete",
        // "annotations:view-all",
        "predictions:tabs",
        "predictions:menu",
        // "auto-annotation",
        "edit-history",
      ];
    }
    if (disableLSFControls || !taskData?.annotation_users?.some(
      (user) => user === userData.id)) setAutoSave(false);

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
          annotations: filteredAnnotations,
          predictions: predictions,
          id: taskData.id,
          data: taskData.data,
        },

        onLabelStudioLoad: function (ls) {
          annotation_status.current =
            ProjectDetails.project_stage == 2 ? "labeled" : "labeled";
          //console.log("annotation_status", annotation_status.current, "test", ProjectDetails);
          if (annotations.length === 0) {
            var c = ls.annotationStore.addAnnotation({
              userGenerate: true,
            });
            ls.annotationStore.selectAnnotation(c.id);
          }
          load_time.current = new Date();
        },

        onSubmitAnnotation: function (ls, annotation) {
          if (isAudioProject.current) {
            let temp = annotation.serializeAnnotation();
            const counter = temp.reduce((acc, curr) => {
              if (curr.from_name === "labels")
                acc.labels++;
              else if (curr.from_name === "transcribed_json") {
                if (curr.value.text[0] === "")
                  acc.empty++;
                acc.textareas++;
              }
              return acc;
            },
              { labels: 0, textareas: 0, empty: 0 }
            );
            if (counter.labels !== counter.textareas || counter.empty) {
              setSnackbarInfo({
                open: true,
                message: "Please fill the annotations for every segment/region",
                variant: "warning",
              });
              return;
            }
          }
          showLoader();
          if (taskData.annotation_status !== "freezed") {
            postAnnotation(
              annotation.serializeAnnotation(),
              taskData.id,
              userData.id,
              load_time.current,
              annotation.lead_time,
              annotation_status.current,
              JSON.stringify(annotationNotesRef.current.getEditor().getContents())
            ).then((res) => {
              if (localStorage.getItem("labelAll"))
                getNextProject(projectId, taskData.id).then((res) => {
                  hideLoader();
                  // window.location.href = `/projects/${projectId}/task/${res.id}`;
                  tasksComplete(res?.id || null);
                });
              else {
                hideLoader();
                window.location.reload();
              }
            });
          } else
            setSnackbarInfo({
              open: true,
              message: "Task is frozen",
              variant: "error",
            });
        },

        onSkipTask: function () {
          //   message.warning('Notes will not be saved for skipped tasks!');
          let annotation = annotations.find(
            (annotation) => !annotation.parentAnnotation
          );
          if (annotation) {
            showLoader();
            patchAnnotation(
              null,
              annotation.id,
              load_time.current,
              annotation.lead_time,
              "skipped",
              JSON.stringify(annotationNotesRef.current.getEditor().getContents())
            ).then(() => {
              getNextProject(projectId, taskData.id).then((res) => {
                hideLoader();
                tasksComplete(res?.id || null);
              });
            });
          }
        },

        onUpdateAnnotation: function (ls, annotation) {
          if (isAudioProject.current) {
            let temp = annotation.serializeAnnotation();
            const counter = temp.reduce((acc, curr) => {
              if (curr.from_name === "labels")
                acc.labels++;
              else if (curr.from_name === "transcribed_json") {
                if (curr.value.text[0] === "")
                  acc.empty++;
                acc.textareas++;
              }
              return acc;
            },
              { labels: 0, textareas: 0, empty: 0 }
            );
            if (counter.labels !== counter.textareas || counter.empty) {
              setSnackbarInfo({
                open: true,
                message: "Please fill the annotations for every segment/region",
                variant: "warning",
              });
              return;
            }
          }
          if (taskData.annotation_status !== "freezed") {
            for (let i = 0; i < annotations.length; i++) {
              if (
                !annotations[i].result?.length || !annotation.serializeAnnotation().length ||
                annotation.serializeAnnotation()[0].id ===
                annotations[i].result[0].id
              ) {
                setAutoSave(false);
                showLoader();
                let temp = annotation.serializeAnnotation();
                for (let i = 0; i < temp.length; i++) {
                  if (temp[i].value.text) {
                    temp[i].value.text = [temp[i].value.text[0]];
                  }
                }
                patchAnnotation(
                  temp,
                  annotations[i].id,
                  load_time.current,
                  annotations[i].lead_time,
                  annotation_status.current,
                  JSON.stringify(annotationNotesRef.current.getEditor().getContents())
                ).then((res) => {
                  hideLoader();
                  if (res.status !== 200) {
                    setSnackbarInfo({
                      open: true,
                      message: "Error in saving annotation",
                      variant: "error",
                    });
                  }
                  else if (localStorage.getItem("labelAll"))
                    getNextProject(projectId, taskData.id).then((res) => {
                      tasksComplete(res?.id || null);
                    });
                  else {
                    window.location.reload();
                  }
                });
              }
            }
          } else
            setSnackbarInfo({
              open: true,
              message: "Task is frozen",
              variant: "error",
            });
        },

        onDeleteAnnotation: function (ls, annotation) {
          for (let i = 0; i < annotations.length; i++) {
            if (
              annotation.serializeAnnotation()[0].id ===
              annotations[i].result[0].id
            ) {
              deleteAnnotation(annotations[i].id);
              var c = ls.annotationStore.addAnnotation({
                userGenerate: true,
              });
              ls.annotationStore.selectAnnotation(c.id);
            }
          }
        },
      });
    }
  }

  // we're running an effect on component mount and rendering LSF inside rootRef node
  localStorage.setItem("TaskData", JSON.stringify(taskData));
  useEffect(() => {
    if (localStorage.getItem("rtl") === "true") {
      var style = document.createElement("style");
      style.innerHTML = "input, textarea { direction: RTL; }";
      document.head.appendChild(style);
    }
    if (userData?.id && loaded.current !== taskId) {
      if (Object.keys(ProjectDetails).length === 0) {
        const projectObj = new GetProjectDetailsAPI(projectId);
        dispatch(APITransport(projectObj));
      } else {
        loaded.current = taskId;
        getProjectsandTasks(projectId, taskId).then(
          ([labelConfig, taskData, annotations, predictions]) => {
            if (annotations.message?.includes("not a part of this project") || annotations.detail?.includes("Not found")) {
              if (annotations.detail?.includes("Not found")) annotations.message = "Task not found";
              setSnackbarInfo({
                open: true,
                message: annotations.message,
                variant: "error",
              });
              hideLoader();
              return;
            }
            // both have loaded!
            // console.log("[labelConfig, taskData, annotations, predictions]", [labelConfig, taskData, annotations, predictions]);
            let tempLabelConfig =
              labelConfig.project_type === "ConversationTranslation" ||
                labelConfig.project_type === "ConversationTranslationEditing"
                ? generateLabelConfig(taskData.data)
                : labelConfig.project_type === "ConversationVerification"
                  ? conversationVerificationLabelConfig(taskData.data)
                  : labelConfig.label_config;
            setAnnotations(annotations);
            setLabelConfig(tempLabelConfig);
            setTaskData(taskData);
            getTaskData(taskData);
            LSFRoot(
              rootRef,
              lsfRef,
              userData,
              projectId,
              taskData,
              tempLabelConfig,
              annotations,
              predictions,
              annotationNotesRef,
              labelConfig.project_type
            );
            hideLoader();
          }
        );
      }
    }

    // Traversing and tab formatting --------------------------- start
    // const outputTextareaHTMLEleArr =
    //   document.getElementsByName("transcribed_json");
    // if (outputTextareaHTMLEleArr.length > 0) {
    //   const targetElement = outputTextareaHTMLEleArr[0];
    //   if (targetElement) {
    //     targetElement.oninput = function (e) {
    //       let textAreaInnerText = e.target.value;

    //       // console.log("e ---------------------- ", e.currentTarget);

    //       let lastInputChar =
    //         textAreaInnerText[targetElement.selectionStart - 1];
    //       if (
    //         lastInputChar === "\\" &&
    //         localStorage.getItem("enableTags") === "true"
    //       ) {
    //         let indexOfLastSpace =
    //           textAreaInnerText.lastIndexOf(
    //             " ",
    //             targetElement.selectionStart - 1
    //           ) <
    //             textAreaInnerText.lastIndexOf(
    //               "\n",
    //               targetElement.selectionStart - 1
    //             )
    //             ? textAreaInnerText.lastIndexOf(
    //               "\n",
    //               targetElement.selectionStart - 1
    //             )
    //             : textAreaInnerText.lastIndexOf(
    //               " ",
    //               targetElement.selectionStart - 1
    //             );

    //         let currentSelectionRangeStart = indexOfLastSpace + 1;
    //         let currentSelectionRangeEnd = targetElement.selectionStart - 1;

    //         let currentTargetWord = textAreaInnerText.slice(
    //           currentSelectionRangeStart,
    //           currentSelectionRangeEnd
    //         );
    //         let filteredSuggestionByInput = TabsSuggestionData.filter((el) =>
    //           el.toLowerCase().includes(currentTargetWord.toLowerCase())
    //         );
    //         if (
    //           filteredSuggestionByInput &&
    //           filteredSuggestionByInput.length > 0
    //         ) {
    //           const suggestionTagsContainer = (
    //             <Grid width={150}>
    //               <Grid
    //                 position="fixed"
    //                 backgroundColor="#ffffff"
    //                 width="inherit"
    //                 textAlign={"end"}
    //               >
    //                 <Tooltip title="close suggestions">
    //                   <IconButton
    //                     onClick={() => {
    //                       setShowTagSuggestionsAnchorEl(null);
    //                       targetElement.focus();
    //                     }}
    //                   >
    //                     <CloseIcon />
    //                   </IconButton>
    //                 </Tooltip>
    //               </Grid>
    //               <Grid
    //                 sx={{
    //                   width: "max-content",
    //                   maxHeight: 250,
    //                   padding: 1,
    //                 }}
    //               >
    //                 {filteredSuggestionByInput?.map((suggestion, index) => {
    //                   return (
    //                     <Typography
    //                       onClick={() => {
    //                         let modifiedValue = textAreaInnerText.replace(
    //                           currentTargetWord + "\\",
    //                           `[${suggestion}]`
    //                         );
    //                         targetElement.value = modifiedValue;
    //                         setShowTagSuggestionsAnchorEl(null);
    //                       }}
    //                       variant="body2"
    //                       sx={{
    //                         backgroundColor: "#ffffff",
    //                         color: "#000",
    //                         padding: 2,
    //                         paddingTop: index === 0 ? 6 : 2,
    //                         "&:hover": {
    //                           color: "white",
    //                           backgroundColor: "#1890ff",
    //                         },
    //                       }}
    //                     >
    //                       {suggestion}
    //                     </Typography>
    //                   );
    //                 })}
    //               </Grid>
    //             </Grid>
    //           );
    //           setShowTagSuggestionsAnchorEl(e.currentTarget);
    //           setTagSuggestionList(suggestionTagsContainer);
    //         }
    //       } else {
    //         setShowTagSuggestionsAnchorEl(false);
    //       }
    //     };
    //   }
    // }

    // Traversing and tab formatting --------------------------- end
  }, [labelConfig, userData, annotationNotesRef, taskId, ProjectDetails]);

  useEffect(() => {
    showLoader();
  }, [taskId]);

  const autoSaveAnnotation = () => {
    if (autoSave && lsfRef.current?.store?.annotationStore?.selected) {
      if (taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        for (let i = 0; i < annotations.length; i++) {
          if (
            !annotations[i].result?.length ||
            annotation.serializeAnnotation()[0].id ===
            annotations[i].result[0].id
          ) {
            let temp = annotation.serializeAnnotation();
            if (annotations[i].annotation_type !== 1) continue;
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].value.text) {
                temp[i].value.text = [temp[i].value.text[0]];
              }
            }
            patchAnnotation(
              temp,
              annotations[i].id,
              load_time.current,
              annotations[i].lead_time,
              annotations[i].annotation_status,
              JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
              true
            ).then((res) => {
              if (res.status !== 200) {
                setSnackbarInfo({
                  open: true,
                  message: "Error in autosaving annotation",
                  variant: "error",
                });
              }
            });
          }
        }
      } else
        setSnackbarInfo({
          open: true,
          message: "Task is frozen",
          variant: "error",
        });
    }
  };

  let hidden, visibilityChange;
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
  }

  const [visible, setVisibile] = useState(!document[hidden]);

  useEffect(() => {
    const handleVisibilityChange = () => setVisibile(!document[hidden]);
    document.addEventListener(visibilityChange, handleVisibilityChange);
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    }
  }, []);

  useEffect(() => {
    !visible && autoSaveAnnotation();
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      visible && autoSaveAnnotation();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [visible, autoSave, lsfRef.current?.store?.annotationStore?.selected, taskData]);

  const handleDraftAnnotationClick = async () => {
    annotation_status.current = "draft";
    lsfRef.current.store.submitAnnotation();
  };

  const onNextAnnotation = async () => {
    showLoader();
    getNextProject(projectId, taskId).then((res) => {
      hideLoader();
      // window.location.href = `/projects/${projectId}/task/${res.id}`;
      tasksComplete(res?.id || null);
    });
  };

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
        autoHideDuration={3000}
      />
    );
  };
  return (
    <div>
      {autoSave &&
        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <Typography variant="body" color="#000000">
            Auto-save enabled for this scenario.
          </Typography>
        </div>}
      {filterMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {filterMessage}
        </Alert>
      )}
      {!loader && (
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="lsf-controls"
        >
          <div />
          <Grid container spacing={0}>
            {/* <Grid container spacing={0} sx={{ justifyContent: "end" }}> */}
            <Grid item>
              {taskData?.annotation_users?.some(
                (user) => user === userData.id
              ) &&
                (!disableBtns) && (
                  <Tooltip title="Save task for later">
                    <Button
                      value="Draft"
                      type="default"
                      onClick={handleDraftAnnotationClick}
                      style={{
                        minWidth: "160px",
                        border: "1px solid #e6e6e6",
                        color: "#e80",
                        pt: 3,
                        pb: 3,
                        borderBottom: "None",
                      }}
                      className="lsf-button"
                    >
                      Draft
                    </Button>
                  </Tooltip>
                )}
            </Grid>
            <Grid item>
              {/* {localStorage.getItem("labelAll") === "true" ? ( */}
              <Tooltip title="Go to next task">
                <Button
                  value="Next"
                  type="default"
                  onClick={onNextAnnotation}
                  style={{
                    minWidth: "160px",
                    border: "1px solid #e6e6e6",
                    color: "#09f",
                    pt: 3,
                    pb: 3,
                    borderBottom: "None",
                  }}
                  className="lsf-button"
                >
                  Next
                </Button>
              </Tooltip>
              {/* ) : (
              <div style={{ minWidth: "160px" }} />
            )} */}
            </Grid>
          </Grid>
        </div>
      )}
      <Box sx={{ border: "1px solid rgb(224 224 224)" }}>
        <div className="label-studio-root" ref={rootRef}></div>
        <Popover
          id={"'simple-popover'"}
          open={Boolean(showTagSuggestionsAnchorEl)}
          anchorEl={showTagSuggestionsAnchorEl}
          onClose={() => {
            setShowTagSuggestionsAnchorEl(null);
            setTagSuggestionList(null);
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          {tagSuggestionList}
        </Popover>
      </Box>

      {loader}
      {renderSnackBar()}
    </div>
  );
};

export default function LSF() {
  const [showNotes, setShowNotes] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState([]);
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [alertData, setAlertData] = useState({
    open: false,
    message: "",
    variant: "info",
  });
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const modules = {
    toolbar:[
      
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ]
  };

  const formats = [
    'size',
    'bold','italic','underline','strike',
    'color','background',
    'script']



  const handleTagChange = (event, value, reason) => {
    if (reason === "selectOption") {
      setSelectedTag(value);
      let copyValue = `[${value}]`;
      navigator.clipboard.writeText(copyValue);
      setAlertData({
        open: true,
        message: `Tag ${copyValue} copied to clipboard`,
        variant: "info",
      });
    }
  };


  useEffect(() => {
    if (
      ProjectDetails?.project_type &&
      ProjectDetails?.project_type.toLowerCase().includes("audio")
    ) {
      setShowTagsInput(true);
    }
  }, [ProjectDetails]);

  const handleCollapseClick = () => {
    setShowNotes(!showNotes);
  };
  const handleGlossaryClick = () => {
    setShowGlossary(!showGlossary);
  };

  useEffect(() => {
    fetchAnnotation(taskId).then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log(annotationNotesRef);
        annotationNotesRef.current.value = data[0].annotation_notes ?? "";
        reviewNotesRef.current.value = data[0].review_notes ?? "";
        const newDelta = annotationNotesRef.current.value!=""?JSON.parse(annotationNotesRef.current.value):"";
        const newDelta1 = reviewNotesRef.current.value!=""?JSON.parse(reviewNotesRef.current.value):"";
        annotationNotesRef.current.getEditor().setContents(newDelta);
        reviewNotesRef.current.getEditor().setContents(newDelta1);
      }
    });
  }, [taskId]);

  const resetNotes = () => {
    setShowNotes(false);
    annotationNotesRef.current.value = "";
    reviewNotesRef.current.value = "";
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  const getTaskData = (taskData) => {
    setTaskData(taskData);
  };



  return (
    <div style={{ maxHeight: "100%", maxWidth: "100%", margin: "auto" }}>
      {!loader && (
        <Button
          value="Back to Project"
          startIcon={<ArrowBackIcon />}
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
        </Button>
      )}
      <Card
        sx={{
          minHeight: 500,
          padding: 5,
          mt: 3,
          pt: 3,
        }}
      >
        <div
          style={{
            display: "flow-root",
            marginBottom: "30px",
          }}
        >
          {!loader && (
            <Button
              endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color={
                reviewNotesRef.current?.value !== "" ? "success" : "primary"
              }
              onClick={handleCollapseClick}
            // style={{ marginBottom: "20px" }}
            >
              Notes {reviewNotesRef.current?.value !== "" && "*"}
            </Button>
          )}

          <div
            className={styles.collapse}
            style={{
              display: showNotes ? "block" : "none",
              paddingBottom: "16px",
               
            }}
          >
            {/* <Alert severity="warning" showIcon style={{marginBottom: '1%'}}>
              {translate("alert.notes")}
          </Alert> */}
            {/* <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Annotation Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={annotationNotesRef}
              rows={2}
              maxRows={4}
              inputProps={{
                style: { fontSize: "1rem" },
              }}
              style={{ width: "99%" }}
              ref={quillRef}
            /> */}

            {/* <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Review Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={reviewNotesRef}
              rows={2}
              maxRows={4}
              inputProps={{
                style: { fontSize: "1rem" },
                readOnly: true,
              }}
              style={{ width: "99%", marginTop: "1%" }}
              // ref={quillRef}
            /> */}
            <ReactQuill
              ref={annotationNotesRef}
              modules={modules}
              formats={formats}
              bounds={"#note"}
              placeholder="Annotation Notes"
            ></ReactQuill>
            <ReactQuill
              ref={reviewNotesRef}
              modules={modules}
              formats={formats}
              bounds={"#note"}
              placeholder="Review Notes"
              style={{ marginbottom: "1%", minHeight: "2rem" }}
              readOnly={true}
            ></ReactQuill>
          </div>
          <Button
            variant="contained"
            style={{ marginLeft: "10px" }}
            endIcon={showGlossary ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            onClick={handleGlossaryClick}
          >
            Glossary
          </Button>
          <div
            style={{
              display: showGlossary ? "block" : "none",
              paddingBottom: "16px",
            }}
          >
            <Glossary taskData={taskData} />
          </div>

          {showTagsInput && (
            <div
              style={{
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Autocomplete
                id="demo"
                value={selectedTag}
                onChange={handleTagChange}
                options={TabsSuggestionData}
                size={"small"}
                getOptionLabel={(option) => option}
                sx={{
                  width: 200,
                  display: "inline-flex",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Noise Tag"
                    placeholder="Select Noise Tag"
                    style={{ fontSize: "14px" }}
                  />
                )}
                renderOption={(props, option, state) => {
                  return <MenuItem {...props}>{option}</MenuItem>;
                }}
              />
              <Tooltip
                title="Select the appropriate noise tag which can be linked to a selected audio region. Selecting the tag copies the value, which can be pasted in respective location of the transcription."
                placement="right"
              >
                <InfoIcon color="primary" />
              </Tooltip>
            </div>
          )}
        </div>
        <CustomizedSnackbars
          open={alertData.open}
          handleClose={() => setAlertData({ ...alertData, open: false })}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          variant={alertData.variant}
          message={alertData.message}
        />
        <LabelStudioWrapper
          getTaskData={getTaskData}
          resetNotes={() => resetNotes()}
          annotationNotesRef={annotationNotesRef}
          loader={loader}
          showLoader={showLoader}
          hideLoader={hideLoader}
        />
      </Card>
    </div>
  );
}

LabelStudioWrapper.propTypes = PropTypes.object;
