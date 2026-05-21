import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "./editor.css";
import "quill/dist/quill.snow.css";
import LabelStudio1 from "./lsf-build/static/js/main";
import LabelStudio2 from "@heartexlabs/label-studio";
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
  Menu,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomizedSnackbars from "../../component/common/Snackbar";
import generateLabelConfig from "../../../../utils/LabelConfig/ConversationTranslation";
import conversationVerificationLabelConfig from "../../../../utils/LabelConfig/ConversationVerification";
// import keymap from "@label-studio/keymap";
import keymap from "./keymap";
import {JsonTable} from 'react-json-to-html';
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import getTaskAssignedUsers from "../../../../utils/getTaskAssignedUsers";
import LightTooltip from "../../component/common/Tooltip";
import { addLabelsToBboxes, labelConfigJS } from "./labelConfigJSX";
import DatasetSearchPopupAPI from "../../../../redux/actions/api/Dataset/DatasetSearchPopup";
import { OCRConfigJS } from "../../../../utils/LabelConfig/OCRTranscriptionEditing";

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
    (annotation) => annotation.annotation_type === 2
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
        ["skipped", "draft", "rejected", "unreviewed"].includes(
          review.annotation_status
        )
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
    } else if (
      userAnnotationData &&
      ["draft"].includes(userAnnotation.annotation_status)
    ) {
      filteredAnnotations = [userAnnotation];
      disableSkip = true;
      setDisableButton(true);
      setFilterMessage(
        "Skip button is disabled, since the task is being reviewed"
      );
    } else if (
      userAnnotation &&
      ["to_be_revised"].includes(userAnnotation.annotation_status)
    ) {
      filteredAnnotations = [userAnnotation];
      disableSkip = true;
      setDisableButton(true);
      setFilterMessage(
        "Skip button is disabled, since the task is being reviewed"
      );
    } else {
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
  "AcousticNormalisedTranscriptionEditing",
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
  const filterdataitemsList = useSelector(
    (state) => state.datasetSearchPopup.data
  );
  const annotation_status = useRef(
    ProjectDetails.project_stage == 2 ? "labeled" : "labeled"
  );
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const LabelStudio = useRef();
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
  const [taskData, setTaskData] = useState(undefined);
  const [predictions, setPredictions] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [parentMetadata, setParentMetadata] = useState(undefined);
  const load_time = useRef();
  const [autoSave, setAutoSave] = useState(true);
  let isAudioProject = useRef();
  const { projectId, taskId } = useParams();
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  let loaded = useRef();

  useEffect(() => {
    setPredictions(taskData?.data?.ocr_prediction_json);
  }, [taskData]);

  useEffect(() => {
    if(filterdataitemsList.results !== undefined){
      if ("metadata_json" in filterdataitemsList.results[0]) {
        if(filterdataitemsList.results[0].metadata_json === null){
        if("image_url" in filterdataitemsList.results[0]){
          setParentMetadata(filterdataitemsList.results[0]);
        }
        }else{
        if("image_url" in filterdataitemsList.results[0].metadata_json[0]){
        setParentMetadata(filterdataitemsList.results[0].metadata_json[0]);
      }}}
    }
  }, [filterdataitemsList.results]);

  const [showTagSuggestionsAnchorEl, setShowTagSuggestionsAnchorEl] =
    useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState();
  const [disableBtns, setDisableBtns] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState(null);
  //console.log("projectId, taskId", projectId, taskId);
  // debugger
  // const projectType = ProjectDetails?.project_type?.includes("Audio")

  /* useEffect(() => {
    if(Object.keys(userData).includes("prefer_cl_ui") && (userData.prefer_cl_ui) && ProjectDetails?.project_type?.includes("Acoustic")) {
      autoSaveAnnotation();
      navigate(`/projects/${projectId}/AudioTranscriptionLandingPage/${taskId}`);
    }
  }, [userData]); */

  useEffect(() => {
  getProjectsandTasks(projectId, taskId).then(
    ([labelConfig, taskData, annotations, predictions]) => {
    if(labelConfig?.project_type?.includes("OCRTranscriptionEditing")){
      const inputData = new DatasetSearchPopupAPI({"instance_ids":labelConfig.datasets[0].instance_id,"dataset_type":"OCRDocument","search_keys":{"id":taskData.input_data}});
      dispatch(APITransport(inputData));
    }
    let sidePanel = labelConfig?.project_type?.includes("OCRSegmentCategorization") || labelConfig?.project_type?.includes("OCRTranscriptionEditing");
    let showLabelsOnly = labelConfig?.project_type?.includes("OCRSegmentCategorization");
    let selectAfterCreateOnly = labelConfig?.project_type?.includes("OCRSegmentCategorization");
    let continousLabelingOnly = labelConfig?.project_type?.includes("OCRSegmentCategorization");    
    localStorage.setItem(
      "labelStudio:settings",
      JSON.stringify({
        bottomSidePanel: !sidePanel,
        continuousLabeling: continousLabelingOnly,
        enableAutoSave: true,
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
      }));});
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
    const [filteredAnnotations, disableLSFControls, disableSkip] =
      filterAnnotations(
        annotations,
        userData,
        setDisableBtns,
        setFilterMessage,
        setDisableButton
      );
    isAudioProject.current = AUDIO_PROJECT_SAVE_CHECK.includes(projectType);
    //console.log("labelConfig", labelConfig);
    LabelStudio.current = projectType?.includes("OCR") ? LabelStudio1 : LabelStudio2;

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
        ...(isAudioProject.current || projectType.includes("OCR")
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
        ...(!disableSkip ? ["skip"] : []),
        ...(taskData?.annotation_users?.some(
          (user) => user === userData.id && !disableLSFControls
        )
          ? ["controls"]
          : []),
        "infobar",
        "topbar",
        "instruction",
        ...(isAudioProject.current || projectType.includes("OCR")
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
    if (
      disableLSFControls ||
      !taskData?.annotation_users?.some((user) => user === userData.id)
    )
      setAutoSave(false);

    if (rootRef.current) {
      if (lsfRef.current) {
        lsfRef.current.destroy();
      }
      lsfRef.current = new LabelStudio.current(rootRef.current, {
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
        keymap:  keymap,

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
          if (projectType.includes("OCRTranscriptionEditing")) {
            setTimeout(() => {
              const annotation = ls.annotationStore.selected;
              if (annotation && annotation.regionStore && annotation.regionStore.regions && annotation.regionStore.regions.length > 0) {
                annotation.selectArea(annotation.regionStore.regions[0]);
              }
            }, 500);
          }
          load_time.current = new Date();
        },

        onSubmitAnnotation: function (ls, annotation) {
          let temp = annotation.serializeAnnotation();
          let ids = new Set();
          let countLables = 0;
          if (projectType.includes("OCRTranscriptionEditing")){
            addLabelsToBboxes(temp);
          }
          temp.map((curr) => {
            if(curr.type !== "relation"){
              ids.add(curr.id);
            }
            if(curr.type === "labels"){
              countLables++;
            }
          });
          if (projectType.includes("OCR") && ids.size > countLables) {
            setSnackbarInfo({
              open: true,
              message: "Please select labels for all boxes",
              variant: "error",
            });
          } else {
            if (isAudioProject.current) {
              const counter = temp.reduce((acc, curr) => {
                if (curr.from_name === "labels")
                  acc.labels++;
                else if (["transcribed_json", "verbatim_transcribed_json"].includes(curr.from_name)) {

                if(curr.type !== "relation"){
                if (curr.value.text[0] === "")
                    acc.empty++;
                  acc.textareas++;
                }}
                return acc;
              },
                { labels: 0, textareas: 0, empty: 0 }
              );
              if (counter.labels !== counter.textareas || counter.empty) {
                setSnackbarInfo({
                  open: true,
                  message:
                    "Please fill the annotations for every segment/region",
                  variant: "warning",
                });
                return;
              }
            }
            showLoader();
            if (taskData.annotation_status !== "freezed") {
              postAnnotation(
                temp,
                taskData.id,
                userData.id,
                load_time.current,
                annotation.lead_time,
                annotation_status.current,
                JSON.stringify(
                  annotationNotesRef.current.getEditor().getContents()
                )
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
          }
        },

        onSkipTask: function () {
          //   message.warning('Notes will not be saved for skipped tasks!');
          let annotation = annotations.find(
            (annotation) => !annotation.parentAnnotation
          );
          if (annotation) {
            showLoader();
            patchAnnotation(
              taskId,
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
          let temp = annotation.serializeAnnotation();
          let ids = new Set();
          let countLables = 0;
          if (projectType.includes("OCRTranscriptionEditing")){
            addLabelsToBboxes(temp);
          }
          temp.map((curr) => {
            if(curr.type !== "relation"){
              ids.add(curr.id);
            }
            if(curr.type === "labels"){
              countLables++;
            }
          });
          if (projectType.includes("OCR") && ids.size > countLables) {
            setSnackbarInfo({
              open: true,
              message: "Please select labels for all boxes",
              variant: "error",
            });
          } else {
            if (isAudioProject.current) {
              const counter = temp.reduce((acc, curr) => {
                if (curr.from_name === "labels")
                  acc.labels++;
                else if (["transcribed_json", "verbatim_transcribed_json"].includes(curr.from_name)) {
                  if(curr.type !== "relation"){
                    if (curr.value.text[0] === "")
                      acc.empty++;
                    acc.textareas++;
                  }}
                return acc;
              },
                { labels: 0, textareas: 0, empty: 0 }
              );
              if (counter.labels !== counter.textareas || counter.empty) {
                setSnackbarInfo({
                  open: true,
                  message:
                    "Please fill the annotations for every segment/region",
                  variant: "warning",
                });
                return;
              }
            }
            if (taskData.annotation_status !== "freezed") {
              for (let i = 0; i < annotations.length; i++) {
                if (
                  !annotations[i].result?.length ||
                  !temp.length ||
                  temp[0].id ===
                    annotations[i].result[0].id
                ) {
                  setAutoSave(false);
                  showLoader();
                  for (let i = 0; i < temp.length; i++) {
                    if(temp[i].type === "relation"){
                      continue;
                    }else if (temp[i].value.text) {
                      temp[i].value.text = [temp[i].value.text[0]];
                    }
                  }
                  patchAnnotation(
                    taskId,
                    temp,
                    annotations[i].id,
                    load_time.current,
                    annotations[i].lead_time,
                    annotation_status.current,
                    JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
                    false,
                    selectedLanguages,
                    ocrDomain
                  ).then((res) => {
                    hideLoader();
                    if (res.status !== 200) {
                      setSnackbarInfo({
                        open: true,
                        message: "Error in saving annotation",
                        variant: "error",
                      });
                    } else if (localStorage.getItem("labelAll"))
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
          }
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
            if (
              annotations.message?.includes("not a part of this project") ||
              annotations.detail?.includes("Not found")
            ) {
              if (annotations.detail?.includes("Not found"))
                annotations.message = "Task not found";
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
                : labelConfig.project_type === "OCRTranscriptionEditing"
                ? OCRConfigJS
                : labelConfig.label_config;
            if (labelConfig.project_type.includes("OCRSegmentCategorization")) {
              tempLabelConfig = labelConfigJS;
            }
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

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then((res) => setAssignedUsers(res));
    };
    taskData?.id && showAssignedUsers();
  }, [taskData]);

  const autoSaveAnnotation = () => {
    if (
      autoSave &&
      lsfRef.current?.store?.annotationStore?.selected &&
      taskData.task_status.toLowerCase() !== "labeled"
    ) {
      if (taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        let temp;
        for (let i = 0; i < annotations.length; i++) {
          if (
            !annotations[i].result?.length ||
            annotation.serializeAnnotation()[0].id ===
              annotations[i].result[0].id
          ) {
            temp = annotation.serializeAnnotation();
            if (annotations[i].annotation_type !== 1) continue;
            for (let i = 0; i < temp.length; i++) {
              if(temp[i].type === "relation"){
                continue;
              }else if (temp[i].value.text) {
                temp[i].value.text = [temp[i].value.text[0]];
              }
            }
            patchAnnotation(
              taskId,
              temp,
              annotations[i].id,
              load_time.current,
              annotations[i].lead_time,
              annotations[i].annotation_status,
              JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
              true,
              selectedLanguages,
              ocrDomain
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

  const clearAllChildren = () => {
    if (lsfRef.current?.store?.annotationStore?.selected&&
      taskData.task_status.toLowerCase() !== "labeled") {
      if (taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        let temp;
        for (let i = 0; i < annotations.length; i++) {
          if (
            !annotations[i].result?.length ||
            annotation.serializeAnnotation()[0].id ===
              annotations[i].result[0].id
          ) {
            temp = annotation.serializeAnnotation();
            if (annotations[i].annotation_type !== 1) continue;
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].parentID !== undefined){
                delete temp[i].parentID;
              }
              if(temp[i].type === "relation"){
                continue;
              }else if (temp[i].value.text) {
                temp[i].value.text = [temp[i].value.text[0]];
              }
            }
            patchAnnotation(
              taskId,
              temp,
              annotations[i].id,
              load_time.current,
              annotations[i].lead_time,
              annotations[i].annotation_status,
              JSON.stringify(annotationNotesRef.current.getEditor().getContents()),
              true,
              selectedLanguages,
              ocrDomain
            ).then((res) => {
              if (res.status !== 200) {
                setSnackbarInfo({
                  open: true,
              message: "Error in clearing children bboxes",
                  variant: "error",
                });
              }else{
                window.location.reload();
              }
            });
          }
        }
      }else
      setSnackbarInfo({
        open: true,
        message: "Task is frozen",
        variant: "error",
      });
    }
  };

  let hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  const [visible, setVisibile] = useState(!document[hidden]);

  useEffect(() => {
    const handleVisibilityChange = () => setVisibile(!document[hidden]);
    document.addEventListener(visibilityChange, handleVisibilityChange);
    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    !visible && autoSaveAnnotation();
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      visible && autoSaveAnnotation();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [
    visible,
    autoSave,
    lsfRef.current?.store?.annotationStore?.selected,
    taskData,
  ]);

  const handleDraftAnnotationClick = async () => {
    annotation_status.current = "draft";
    lsfRef.current.store.submitAnnotation();
  };
  const [ocrMenuAnchorEl, setOcrMenuAnchorEl] = useState(null);
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const [focusedEditor, setFocusedEditor] = useState(null);
  const [copiedFormula, setCopiedFormula] = useState('');

  // Handler for button click
  const handleOcrButtonClick = (event) => {
    setOcrMenuAnchorEl(event.currentTarget);
  };

  // Handler for OCR formatting - for menu clicks (copy to clipboard)
  const handleOcrFormatting = (formatType) => {
    setOcrMenuAnchorEl(null);

    let formula = '';

    switch (formatType) {
      case "superscript":
        formula = '${}^{}$';
        break;
      case "subscript":
        formula = '${}_{}$';
        break;
      case "fraction":
        formula = '\\fraction{}{}';
        break;
      case "footnote":
        formula = '\\footnote{}';
        break;
      case "dropcap":
        formula = '\\dropcap{}';
        break;
      case "squareroot":
        formula = '\\sqrt{}';
        break;
      default:
        return;
    }

    copyToClipboard(formula);
  };

  // Function to directly insert formula at cursor position
  const insertFormulaAtCursor = (formula) => {
    const activeEl = document.activeElement;

    if (!activeEl || (!activeEl.isContentEditable && activeEl.tagName !== 'TEXTAREA' && activeEl.tagName !== 'INPUT')) {
      console.log('No editable element focused');
      return false;
    }

    try {
      if (activeEl.isContentEditable) {
        // For contenteditable elements (Label Studio editors)
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          // Create text node with formula
          const textNode = document.createTextNode(formula);
          range.insertNode(textNode);

          // Move cursor after the inserted formula
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          // If no selection, just append at the end
          activeEl.textContent += formula;
        }

        // Trigger input event for Label Studio
        const event = new Event('input', { bubbles: true });
        activeEl.dispatchEvent(event);

      } else {
        // For textarea/input elements
        const start = activeEl.selectionStart;
        const end = activeEl.selectionEnd;
        const text = activeEl.value;

        activeEl.value = text.substring(0, start) + formula + text.substring(end);
        activeEl.selectionStart = activeEl.selectionEnd = start + formula.length;

        // Trigger input event
        const event = new Event('input', { bubbles: true });
        activeEl.dispatchEvent(event);
      }

      console.log('Formula inserted directly:', formula);
      return true;
    } catch (error) {
      console.error('Error inserting formula:', error);
      return false;
    }
  };

  // Copy to clipboard function (for menu clicks)
  const copyToClipboard = (formula) => {
    navigator.clipboard.writeText(formula).then(() => {
      setCopiedFormula(formula);
      setTimeout(() => setCopiedFormula(''), 2000);
    }).catch(err => {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = formula;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedFormula(formula);
      setTimeout(() => setCopiedFormula(''), 2000);
    });
  };

  // Keyboard shortcut handler - DIRECT INSERTION
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      // Check if any editor is focused
      if (!isTextareaFocused) return;

      const key = event.key;
      const isShift = event.shiftKey;
      const isCtrl  = event.ctrlKey || event.metaKey

      console.log('Key pressed:', key, 'Shift:', isShift, 'Focused:', isTextareaFocused);

      // Only process if we're definitely in a text editor
      const activeEl = document.activeElement;
      const isInEditor = activeEl?.isContentEditable ||
        activeEl?.classList?.contains('ant-typography') ||
        activeEl?.closest('[contenteditable="true"]') ||
        activeEl?.closest('.ant-typography') ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'INPUT';

      if (!isInEditor) return;

      let formula = '';

      // Simple key checks
      if (isCtrl && key === '^') {
        formula = '${}^{}$';
      } else if (isCtrl && key === '_') {
        formula = '${}_{}$';
      } else if (isCtrl && key === '/') {
        formula = '\\fraction{}{}';
      } else if (isShift && key === 'F') {
        formula = '\\footnote{}';
      } else if (isShift && key === 'D') {
        formula = '\\dropcap{}';
      }else if (key === '√' || (isShift && key === 'V')) {
      formula = '\\sqrt{}';
    }


      if (formula) {
        console.log('Shortcut matched! Inserting formula:', formula);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // DIRECT INSERTION instead of copy to clipboard
        const success = insertFormulaAtCursor(formula);
        if (success) {
          setCopiedFormula(formula);
          setTimeout(() => setCopiedFormula(''), 1000);
        }
      }
    };

    // Add event listener with high priority
    document.addEventListener('keydown', handleGlobalKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
    };
  }, [isTextareaFocused]);

  // Enhanced editor focus handler
  const handleEditorFocus = (event) => {
    console.log('Editor focus event');

    const target = event.target;
    let editor = null;

    // Find the actual editor element
    if (target.isContentEditable) {
      editor = target;
    } else if (target.closest('[contenteditable="true"]')) {
      editor = target.closest('[contenteditable="true"]');
    } else if (target.closest('.ant-typography')) {
      editor = target.closest('.ant-typography');
    }

    if (editor) {
      setIsTextareaFocused(true);
      setFocusedEditor(editor);
      console.log('✓ Editor focused - shortcuts should work');
    }
  };

  const handleEditorBlur = (event) => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isFocusOnOurUI = activeElement?.closest('.lsf-button') ||
        activeElement?.closest('[role="menu"]') ||
        activeElement?.closest('.MuiMenu-paper');

      if (!isFocusOnOurUI) {
        setIsTextareaFocused(false);
        setFocusedEditor(null);
        console.log('Editor blurred');
      }
    }, 150);
  };

  // Setup editor listeners
  useEffect(() => {
    const setupListeners = () => {
      const editors = document.querySelectorAll('.ant-typography, [contenteditable="true"]');

      editors.forEach(editor => {
        editor.removeEventListener('focus', handleEditorFocus);
        editor.removeEventListener('blur', handleEditorBlur);
        editor.removeEventListener('click', handleEditorFocus);

        editor.addEventListener('focus', handleEditorFocus, true);
        editor.addEventListener('blur', handleEditorBlur, true);
        editor.addEventListener('click', handleEditorFocus, true);
      });

      console.log('Setup focus listeners on', editors.length, 'editors');
    };

    setupListeners();
    const interval = setInterval(setupListeners, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect edit icon clicks
  useEffect(() => {
    const handleEditClick = (event) => {
      if (event.target.closest('.anticon-edit')) {
        console.log('Edit icon clicked');
        setTimeout(() => {
          const editor = document.querySelector('[contenteditable="true"]');
          if (editor) {
            setIsTextareaFocused(true);
            setFocusedEditor(editor);
            console.log('Editor focused via edit icon');
          }
        }, 300);
      }
    };

    document.addEventListener('click', handleEditClick, true);
    return () => document.removeEventListener('click', handleEditClick, true);
  }, []);
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

  const handleSelectChange = (event) => {
    selectedLanguages.current = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedL(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  useEffect(() => {
    if(taskData){
      if(Array.isArray(taskData?.data?.language)){
        taskData?.data?.language?.map((lang)=>{
          if (!selectedLanguages.current.includes(lang)) {
            selectedLanguages.current.push(lang);
          }        
          const newLanguages = new Set([...selectedL, ...taskData?.data?.language]);
          setSelectedL(Array.from(newLanguages));
        });
      }
      if(typeof taskData?.data?.language === 'string' && taskData?.data?.ocr_domain !== ""){
        setSelectedL([taskData?.data?.language]);
        if (!selectedLanguages.current.includes(taskData?.data?.language)) {
          selectedLanguages.current.push(taskData?.data?.language);
        }      
      }
      if(typeof taskData?.data?.ocr_domain === 'string' && taskData?.data?.ocr_domain !== ""){
        ocrDomain.current = taskData?.data?.ocr_domain;
        setOcrD(taskData?.data?.ocr_domain);
      }
    }
  }, [taskData]);
  
useEffect(() => {
  const blockNotesEvents = () => {
    document.querySelectorAll('.ql-editor, .ql-toolbar').forEach(el => {
      el.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation();
      }, true);
    });
  };

  blockNotesEvents();
  const interval = setInterval(blockNotesEvents, 1000);
  
  return () => clearInterval(interval);
}, []);

  return (
    <div>
      {autoSave && (
        <div style={{ textAlign: "left", marginBottom: "15px" }}>
          <Typography variant="body" color="#000000">
            Auto-save enabled for this scenario.
          </Typography>
        </div>
      )}
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
          <Grid container justifyContent="space-between">
            <Grid item>
              <LightTooltip title={assignedUsers ? assignedUsers : ""}>
                <Button
                  type="default"
                  className="lsf-button"
                  style={{
                    minWidth: "40px",
                    border: "1px solid #e6e6e6",
                    color: "grey",
                    pt: 1,
                    pl: 1,
                    pr: 1,
                    borderBottom: "None",
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{ mb: "-3px", ml: "2px", color: "grey" }}
                  />
                </Button>
              </LightTooltip>
            {/* <Grid container spacing={0} sx={{ justifyContent: "end" }}> */}
              {taskData?.annotation_users?.some(
                (user) => user === userData.id
              ) &&
                !disableBtns && (
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

              {ProjectDetails?.project_type?.includes("OCRTranscriptionEditing") &&
                <>
                  {/* OCR Shortcut Button with Dropdown */}
                  <Tooltip title={
                    "OCR Shortcuts: ^ _ / Shift+F Shift+D (direct insert)" }>
                    <Button
                      type="default"
                      onClick={handleOcrButtonClick}
                      endIcon={<ArrowDropDownIcon />}
                      style={{
                        minWidth: "160px",
                        border: "1px solid #e6e6e6",
                        backgroundColor: "#f0f8ff",
                        color: "#09f" ,
                        pt: 3,
                        pb: 3,
                      }}
                      className="lsf-button"
                    >
                      OCR Shortcuts
                      {copiedFormula && " ✨"}
                    </Button>
                  </Tooltip>

                  {/* Material-UI Menu for OCR Formatting Options */}
                  <Menu
                    anchorEl={ocrMenuAnchorEl}
                    open={Boolean(ocrMenuAnchorEl)}
                    onClose={() => setOcrMenuAnchorEl(null)}
                    PaperProps={{
                      style: {
                        width: '320px',
                      },
                    }}
                  >
                    <MenuItem disabled style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                      Menu: Copies to clipboard • Shortcuts: Direct insert
                    </MenuItem>

                    <MenuItem onClick={() => handleOcrFormatting("superscript")}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <div><strong>Superscript</strong></div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>^</kbd> </div>
                        </div>
                        <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>${`{}^{}`}$</span>
                      </div>
                    </MenuItem>

                    <MenuItem onClick={() => handleOcrFormatting("subscript")}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <div><strong>Subscript</strong></div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>_</kbd></div>
                        </div>
                        <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>${`{}_{}`}$</span>
                      </div>
                    </MenuItem>

                    <MenuItem onClick={() => handleOcrFormatting("fraction")}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <div><strong>Fraction</strong></div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Ctrl</kbd>  +<kbd>/</kbd> </div>
                        </div>
                        <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>\fraction{`{}{}`}</span>
                      </div>
                    </MenuItem>

                    <MenuItem onClick={() => handleOcrFormatting("footnote")}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <div><strong>Footnote</strong></div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Shift</kbd> + <kbd>F</kbd></div>
                        </div>
                        <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>\footnote{`{}`}</span>
                      </div>
                    </MenuItem>

                    <MenuItem onClick={() => handleOcrFormatting("dropcap")}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div>
                          <div><strong>Dropcap</strong></div>
                          <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Shift</kbd> + <kbd>D</kbd></div>
                        </div>
                        <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>\dropcap{`{}`}</span>
                      </div>
                    </MenuItem>
                  <MenuItem onClick={() => handleOcrFormatting("squareroot")}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <div><strong>Square Root</strong></div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Shortcut: <kbd>Shift</kbd> + <kbd>V</kbd></div>
                      </div>
                      <span style={{ color: '#999', fontSize: '12px', fontFamily: 'monospace' }}>\sqrt{`{}`}</span>
                    </div>
                  </MenuItem>

                  </Menu>
                </>
              }
     {ProjectDetails?.project_type?.includes("OCR") &&
                <>
                  <Tooltip title="Clear all children bboxes">
                    <Button
                      type="default"
                      onClick={() => { clearAllChildren() }}
                  style={{
                    minWidth: "160px",
                    border: "1px solid #e6e6e6",
                    color: "#09f",
                    pt: 3,
                    pb: 3,
                    borderBottom: "None",
                    color: "#f00",
                  }}
                  className="lsf-button"
                >
                  Clear All Mergings
                </Button>
              </Tooltip>
            </>
            }
            {parentMetadata !== undefined &&
            <>
            <Tooltip title="Show Parent Image">
                <Button
                  type="default"
                  onClick={() => {window.open(parentMetadata.image_url, "_blank")}}
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
                  Parent Image
                </Button>
              </Tooltip>
            </>
            }
            
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
      {parentMetadata !== undefined &&
      <>
        <div style={{textAlign:"center", display:"flex", justifyContent:"center"}}>
          <div>
            <h3>Parent MetaData</h3>
            <JsonTable json={parentMetadata}/>
          </div>
        </div>
      </>
      }
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
  const [showGlossary, setShowGlossary] = useState(false);
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const { taskId } = useParams();
  const [taskData, setTaskData] = useState([]);
  const [annotationtext,setannotationtext] = useState('')
  const [reviewtext,setreviewtext] = useState('')
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
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }],
      [{ script: "sub" }, { script: "super" }],
    ],
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
      (ProjectDetails?.project_type.toLowerCase().includes("audio") ||
        ProjectDetails?.project_type?.includes("Acoustic"))
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
        try {
          const newDelta2 =
            annotationNotesRef.current.value !== ""
              ? JSON.parse(annotationNotesRef.current.value)
              : "";
          console.log(newDelta2);
          annotationNotesRef.current.getEditor().setContents(newDelta2);
        } catch (err) {
          if (err instanceof SyntaxError) {
            const newDelta2 = annotationNotesRef.current.value;
            annotationNotesRef.current.getEditor().setText(newDelta2);
          }
        }
        try {
          const newDelta1 =
            reviewNotesRef.current.value != ""
              ? JSON.parse(reviewNotesRef.current.value)
              : "";
          reviewNotesRef.current.getEditor().setContents(newDelta1);
        } catch (err) {
          if (err instanceof SyntaxError) {
            const newDelta1 = reviewNotesRef.current.value;
            reviewNotesRef.current.getEditor().setText(newDelta1);
          }
        }
        setannotationtext(annotationNotesRef.current.getEditor().getText());
        setreviewtext(reviewNotesRef.current.getEditor().getText());
      }
    });
  }, [taskId]);

  const resetNotes = () => {
    setShowNotes(false);
    annotationNotesRef.current.getEditor().setContents([]);
    reviewNotesRef.current.getEditor().setContents([]);
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
          sx={{ mt: 2 }}
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
              color={reviewtext.trim().length === 0 ? "primary" : "success"}
              onClick={handleCollapseClick}
              // style={{ marginBottom: "20px" }}
            >
              Notes {reviewtext.trim().length === 0 ? "" : "*"}
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
