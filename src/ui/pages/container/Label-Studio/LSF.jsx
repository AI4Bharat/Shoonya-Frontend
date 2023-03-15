import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
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
import { snakeToTitleCase } from "../../../../utils/utils";

import styles from "./lsf.module.css";
import "./lsf.css";
import { useDispatch, useSelector } from "react-redux";
import { translate } from "../../../../config/localisation";
import Glossary from "../Glossary/Glossary";
import { TabsSuggestionData } from "../../../../utils/TabsSuggestionData/TabsSuggestionData";
import InfoIcon from "@mui/icons-material/Info";
import getCaretCoordinates from "textarea-caret";
import CloseIcon from "@mui/icons-material/Close";

const filterAnnotations = (annotations, user_id) => {
  let flag = false;
  let filteredAnnotations = annotations;
  let userAnnotation = annotations.find((annotation) => {
    return annotation.completed_by === user_id && !annotation.parent_annotation;
  });
  if (userAnnotation) {
    filteredAnnotations = [userAnnotation];
    if (userAnnotation.annotation_status === "labeled") {
      let review = annotations.find(
        (annotation) => annotation.parent_annotation === userAnnotation.id
      );
      if (review) {
        if (
          [
            "accepted",
            "accepted_with_minor_changes",
            "accepted_with_major_changes",
          ].includes(review.annotation_status)
        ) {
          filteredAnnotations = [review];
          flag = true;
        }
      }
    }
  }
  return [filteredAnnotations, flag];
};

//used just in postAnnotation to support draft status update.

const AUTO_SAVE_INTERVAL = 20000;
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
    ProjectDetails.enable_task_reviews ? "labeled" : "labeled"
  );
  const autoSaveFlag = useRef(false);
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
  const [isAccepted, setIsAccepted] = useState(false);
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  let loaded = useRef();

  const [showTagSuggestionsAnchorEl, setShowTagSuggestionsAnchorEl] =
    useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState();

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
    projectType,
    setIsAccepted
  ) {
    let load_time;
    let interfaces = [];
    if (predictions == null) predictions = [];
    const [filteredAnnotations, isAccepted] = filterAnnotations(
      annotations,
      userData.id
    );
    setIsAccepted(isAccepted);
    console.log("labelConfig", labelConfig);

    if (taskData.task_status === "freezed") {
      interfaces = [
        "panel",
        // "update",
        // "submit",
        "skip",
        ...(!isAccepted && ["controls"]),
        "infobar",
        "topbar",
        "instruction",
        ...(projectType === "AudioTranscription" ||
        projectType === "AudioTranscriptionEditing"
          ? ["side-column"]
          : []),
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
        "skip",
        ...(taskData?.annotation_users?.some(
          (user) => user === userData.id && !isAccepted
        )
          ? ["controls"]
          : []),
        "infobar",
        "topbar",
        "instruction",
        ...(projectType === "AudioTranscription" ||
        projectType === "AudioTranscriptionEditing"
          ? ["side-column"]
          : []),
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
          annotation_status.current = ProjectDetails.enable_task_reviews
            ? "labeled"
            : "labeled";
          //console.log("annotation_status", annotation_status.current, "test", ProjectDetails);
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
                });
              else {
                hideLoader();
                // window.location.reload();
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
          let isAutoSave = autoSaveFlag.current;
          autoSaveFlag.current = false;
          if (AUDIO_PROJECT_SAVE_CHECK.includes(projectType)) {
            let temp = annotation.serializeAnnotation();
            console.log("temp", temp);
            const counter = temp.reduce(
              function (acc, curr) {
                if (curr.from_name === "labels") {
                  acc.labels++;
                } else if (curr.from_name === "transcribed_json") {
                  acc.textareas++;
                }
                return acc;
              },
              { labels: 0, textareas: 0 }
            );
            if (counter.labels !== counter.textareas) {
              if (isAutoSave) return;
              setSnackbarInfo({
                open: true,
                message: "Please fill the annotations for every label selected",
                variant: "warning",
              });
              return;
            }
            if (
              temp.find(
                (curr) =>
                  curr.from_name === "transcribed_json" &&
                  /\d/.test(curr.value.text)
              )
            ) {
              if (isAutoSave) return;
              setSnackbarInfo({
                open: true,
                message: "Please remove numeric text from the annotations",
                variant: "warning",
              });
              return;
            }
          }
          if (taskData.annotation_status !== "freezed") {
            for (let i = 0; i < annotations.length; i++) {
              if (
                !annotations[i].result?.length ||
                annotation.serializeAnnotation()[0].id ===
                  annotations[i].result[0].id
              ) {
                !isAutoSave && showLoader();
                let temp = annotation.serializeAnnotation();

                for (let i = 0; i < temp.length; i++) {
                  if (temp[i].value.text) {
                    temp[i].value.text = [temp[i].value.text[0]];
                  }
                }
                patchAnnotation(
                  temp,
                  annotations[i].id,
                  load_time,
                  annotations[i].lead_time,
                  isAutoSave
                    ? annotations[i].annotation_status
                    : annotation_status.current,
                  annotationNotesRef.current.value
                ).then((err) => {
                  if (err) {
                    setSnackbarInfo({
                      open: true,
                      message: "Error in saving annotation",
                      variant: "error",
                    });
                  }
                  if (!isAutoSave) {
                    if (localStorage.getItem("labelAll"))
                      getNextProject(projectId, taskData.id).then((res) => {
                        hideLoader();
                        tasksComplete(res?.id || null);
                      });
                    else {
                      hideLoader();
                      window.location.reload();
                    }
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
            // both have loaded!
            // console.log("[labelConfig, taskData, annotations, predictions]", [labelConfig, taskData, annotations, predictions]);
            let tempLabelConfig =
              labelConfig.project_type === "ConversationTranslation" ||
              labelConfig.project_type === "ConversationTranslationEditing"
                ? generateLabelConfig(taskData.data)
                : labelConfig.label_config;
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
              labelConfig.project_type,
              setIsAccepted
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!ProjectDetails?.project_type.includes("Audio")) {
  //       autoSaveFlag.current = true;
  //       lsfRef.current.store.submitAnnotation();
  //     }
  //   }, AUTO_SAVE_INTERVAL);
  //   return () => clearInterval(interval);
  // }, [ProjectDetails]);

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
        autoHideDuration={2000}
      />
    );
  };

  return (
    <div>
      {!loader && isAccepted && (
        <Alert severity="success" sx={{ mb: 3 }}>
          This annotation has already been accepted by the reviewer.
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
                !isAccepted && (
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
  // const [notesValue, setNotesValue] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);

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
        annotationNotesRef.current.value = data[0].annotation_notes ?? "";
        reviewNotesRef.current.value = data[0].review_notes ?? "";
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
        {!loader && (
          <Button
            endIcon={showNotes ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
            variant="contained"
            color={reviewNotesRef.current?.value !== "" ? "success" : "primary"}
            onClick={handleCollapseClick}
            style={{ marginBottom: "20px" }}
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
              style: { fontSize: "1rem" },
            }}
            style={{ width: "99%" }}
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
              style: { fontSize: "1rem" },
              readOnly: true,
            }}
            style={{ width: "99%", marginTop: "1%" }}
          />
        </div>
        <Button
          variant="contained"
          style={{ marginBottom: "20px", marginLeft: "10px" }}
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
              marginBottom: "30px",
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
                width: 300,
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
            <Tooltip title="Lorem ipsum dolor sit amet" placement="right">
              <InfoIcon color="primary" />
            </Tooltip>
          </div>
        )}
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
