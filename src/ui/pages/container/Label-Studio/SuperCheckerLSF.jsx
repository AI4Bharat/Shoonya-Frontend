import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import ReactQuill, { Quill } from "react-quill";
import "./editor.css";
import "quill/dist/quill.snow.css";
import LabelStudio from "@heartexlabs/label-studio";
import {
  Tooltip,
  Button,
  Box,
  Card,
  TextField,
  Grid,
  Typography,
  Popover,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomizedSnackbars from "../../component/common/Snackbar";
import generateLabelConfig from "../../../../utils/LabelConfig/ConversationTranslation";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Glossary from "../Glossary/Glossary";
import { TabsSuggestionData } from "../../../../utils/TabsSuggestionData/TabsSuggestionData";
import InfoIcon from "@mui/icons-material/Info";
import getCaretCoordinates from "textarea-caret";
import conversationVerificationLabelConfig from "../../../../utils/LabelConfig/ConversationVerification";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import getTaskAssignedUsers from "../../../../utils/getTaskAssignedUsers";
import LightTooltip from "../../component/common/Tooltip";
import keymap from "./keymap";
import {
  getProjectsandTasks,
  getNextProject,
  fetchAnnotation,
  fetchTransliteration,
  postReview,
  patchSuperChecker,
} from "../../../../redux/actions/api/LSFAPI/LSFAPI";

import { useParams, useNavigate } from "react-router-dom";
import useFullPageLoader from "../../../../hooks/useFullPageLoader";

import styles from "./lsf.module.css";
import "./lsf.css";
import { useSelector, useDispatch } from "react-redux";
import { translate } from "../../../../config/localisation";
import { labelConfigJS } from "./labelConfigJSX";
import CustomButton from "../../component/common/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LanguageCode from "../../../../utils/LanguageCode";
import PostTransliterationForLogging from "../../../../redux/actions/api/Annotation/PostTransliterationForLogging";
// import RomanisedTransliteration from "../Transliteration/RomanisedTransliteration";
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const filterAnnotations = (annotations, user, taskData) => {
  let disableSkip = false;
  let disableAutoSave = false;
  let filteredAnnotations = annotations;
  let userAnnotation = annotations.find((annotation) => {
    return annotation.completed_by === user.id && annotation.parent_annotation;
  });
  if (userAnnotation) {
    if (userAnnotation.annotation_status === "unvalidated") {
      filteredAnnotations =
        userAnnotation.result.length > 0
          ? !taskData?.revision_loop_count?.super_check_count[userAnnotation]
          : annotations.filter(
              (annotation) =>
                annotation.id === userAnnotation.parent_annotation &&
                annotation.annotation_type === 2
            );
    } else if (
      ["validated", "validated_with_changes", "draft"].includes(
        userAnnotation.annotation_status
      )
    ) {
      filteredAnnotations = [userAnnotation];
    } else if (
      userAnnotation.annotation_status === "skipped" ||
      userAnnotation.annotation_status === "rejected"
    ) {
      filteredAnnotations = annotations.filter(
        (value) => value.annotation_type === 2
      );
      disableAutoSave = filteredAnnotations[0].annotation_status === "rejected";
    }
  } else if ([4, 5, 6].includes(user.role)) {
    filteredAnnotations = annotations.filter((a) => a.annotation_type === 3);
    disableSkip = true;
  }
  return [filteredAnnotations, disableSkip, disableAutoSave];
};

//used just in postAnnotation to support draft status update.

const AUTO_SAVE_INTERVAL = 60000;
const AUDIO_PROJECT_SAVE_CHECK = [
  "AudioTranscription",
  "AudioTranscriptionEditing",
];

const LabelStudioWrapper = ({
  reviewNotesRef,
  annotationNotesRef,
  superCheckerNotesRef,
  loader,
  showLoader,
  hideLoader,
  setreviewtext,
  setsupercheckertext,
  resetNotes,
  getTaskData,
}) => {
  // we need a reference to a DOM node here so LSF knows where to render
  const review_status = useRef();
  const rootRef = useRef();
  // this reference will be populated when LSF initialized and can be used somewhere else
  const lsfRef = useRef();
  const dispatch = useDispatch();
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
  const [annotations, setAnnotations] = useState([]);
  const load_time = useRef();
  const [autoSave, setAutoSave] = useState(true);
  const { projectId, taskId } = useParams();
  const userData = useSelector((state) => state.fetchLoggedInUserData.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  let loaded = useRef();
  const [showTagSuggestionsAnchorEl, setShowTagSuggestionsAnchorEl] =
    useState(null);
  const [tagSuggestionList, setTagSuggestionList] = useState();
  const [assignedUsers, setAssignedUsers] = useState(null);

  // const [romanisedTransliterationData, setRomanisedTransliterationData] = useState({
  //   timestamp: '',
  //   error: '',
  //   input: '',
  //   romanised_transliteration: '',
  //   success: false
  // });
  // const [showRomanisedTransliterationModel, setShowRomanisedTransliterationModel] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  // const [originalRomanisedText, setOriginalRomanisedText] = useState("");
  // const [editedRomanisedText, setEditedRomanisedText] = useState("")
  // const [indicText, setIndicText] = useState("");
  //console.log("projectId, taskId", projectId, taskId);

  useEffect(() => {
    setPredictions(taskData?.data?.ocr_prediction_json);
  }, [taskData]);

  //console.log("projectId, taskId", projectId, taskId);
  // debugger
  /* useEffect(() => {
    if(Object.keys(userData).includes("prefer_cl_ui") && (userData.prefer_cl_ui) && ProjectDetails?.project_type?.includes("Acoustic")) {
      autoSaveSuperCheck();
      navigate(`/projects/${projectId}/SuperCheckerAudioTranscriptionLandingPage/${taskId}`);
    }
  }, [userData]); */

  useEffect(() => {
    getProjectsandTasks(projectId, taskId).then(
      ([labelConfig, taskData, annotations, predictions]) => {
        let sidePanel = labelConfig?.project_type?.includes(
          "OCRSegmentCategorization"
        );
        let showLabelsOnly = labelConfig?.project_type?.includes(
          "OCRSegmentCategorization"
        );
        let selectAfterCreateOnly = labelConfig?.project_type?.includes(
          "OCRSegmentCategorization"
        );
        let continousLabelingOnly = labelConfig?.project_type?.includes(
          "OCRSegmentCategorization"
        );
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
      }
    );
  }, []);

  const tasksComplete = (id) => {
    if (id) {
      resetNotes();
      navigate(`/projects/${projectId}/SuperChecker/${id}`);
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
    reviewNotesRef,
    superCheckerNotesRef,
    projectType
  ) {
    let interfaces = [];
    if (predictions == null) predictions = [];
    const [filteredAnnotations, disableSkip, disableAutoSave] =
      filterAnnotations(annotations, userData);
    if (disableSkip || disableAutoSave) setAutoSave(false);

    if (taskData.task_status === "freezed") {
      interfaces = [
        "panel",
        //"update",
        // "submit",
        "skip",
        "controls",
        "infobar",
        "topbar",
        "instruction",
        ...(projectType === "AudioTranscription" ||
        projectType === "AudioTranscriptionEditing" ||
        projectType.includes("OCR")
          ? ["side-column"]
          : []),
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
    } else {
      interfaces = [
        "panel",
        //"update",
        "submit",
        ...(!disableSkip ? ["skip"] : []),
        "controls",
        "infobar",
        "topbar",
        "instruction",
        ...(projectType === "AudioTranscription" ||
        projectType === "AudioTranscriptionEditing" ||
        projectType.includes("OCR")
          ? ["side-column"]
          : []),
        "annotations:history",
        "annotations:tabs",
        "annotations:menu",
        "annotations:current",
        // "annotations:add-new",
        // "annotations:delete",
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
          // annotations: annotations.filter((annotation) => !annotation.parent_annotation).concat(annotations.filter((annotation) => annotation.id === taskData.correct_annotation)),
          annotations: filteredAnnotations,
          predictions: predictions,
          id: taskData.id,
          data: taskData.data,
        },
        keymap: keymap,

        onLabelStudioLoad: function (ls) {
          // if (taskData.correct_annotation) {
          //   let annotation = annotations.find(
          //     (annotation) =>
          //       annotation.id === taskData.correct_annotation
          //   );
          //   ls.annotationStore.selectAnnotation(annotation.result[0].id);
          // } else {
          // let hasReview = false;
          // for (let i = 0; i < annotations.length; i++) {
          //   console.log(annotations[i], "test");
          //   if (annotations[i].parent_annotation) {
          //     ls.annotationStore.selectAnnotation(annotations[i].result[0].id);
          //     // hasReview = true;
          //     break;
          //   }
          // }
          // if (!hasReview) {
          //   var c = ls.annotationStore.addAnnotation({
          //     userGenerate: true,
          //   });
          //   ls.annotationStore.selectAnnotation(c.id);
          // }
          // }
          load_time.current = new Date();
        },

        onSkipTask: function (annotation) {
          // message.warning('Notes will not be saved for skipped tasks!');
          let review = annotations.find((value) => value.annotation_type === 3);
          if (review) {
            showLoader();
            patchSuperChecker(
              taskId,
              review.id,
              load_time.current,
              review.lead_time,
              "skipped",
              JSON.stringify(
                superCheckerNotesRef.current.getEditor().getContents()
              )
            ).then(() => {
              getNextProject(projectId, taskData.id, "supercheck").then(
                (res) => {
                  hideLoader();
                  tasksComplete(res?.id || null);
                }
              );
            });
          }
        },

        onUpdateAnnotation: function (ls, annotation) {
          let temp = annotation.serializeAnnotation();
          let ids = new Set();
          let countLables = 0;
          temp.map((curr) => {
            if (curr.type !== "relation") {
              ids.add(curr.id);
            }
            if (curr.type === "labels") {
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
            if (AUDIO_PROJECT_SAVE_CHECK.includes(projectType)) {
              const counter = temp.reduce(
                (acc, curr) => {
                  if (curr.from_name === "labels") acc.labels++;
                  else if (curr.from_name === "transcribed_json") {
                    if (curr.type !== "relation") {
                      if (curr.value.text[0] === "") acc.empty++;
                      acc.textareas++;
                    }
                  }
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
              setAutoSave(false);
              showLoader();
              let temp = annotation.serializeAnnotation();

              for (let i = 0; i < temp.length; i++) {
                if (temp[i].type === "relation") {
                  continue;
                } else if (temp[i].value.text) {
                  temp[i].value.text = [temp[i].value.text[0]];
                }
              }

              let superChecker = annotations.filter(
                (value) => value.annotation_type === 3
              )[0];
              // if(originalRomanisedText.length==0  && projectType.includes("ContextualTranslationEditing")){
              //   setSnackbarInfo({
              //     open: true,
              //     message: "Please click on Check Transliteration button first",
              //     variant: "info",
              //   });
              //   // dont allow to move forward
              //   hideLoader();
              // }
              patchSuperChecker(
                taskId,
                superChecker.id,
                load_time.current,
                superChecker.lead_time,
                review_status.current,
                temp,
                superChecker.parent_annotation,
                JSON.stringify(
                  superCheckerNotesRef.current.getEditor().getContents()
                ),
                false,
                selectedLanguages,
                ocrDomain
              ).then(() => {
                if (localStorage.getItem("labelAll"))
                  getNextProject(projectId, taskData.id, "supercheck").then(
                    (res) => {
                      hideLoader();
                      tasksComplete(res?.id || null);
                    }
                  );
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
      });
    }
  }

  const setNotes = (taskData, annotations) => {
    if (annotations && Array.isArray(annotations) && annotations.length > 0) {
      let userAnnotation = annotations.find(
        (annotation) =>
          annotation.completed_by === userData.id &&
          annotation.annotation_type === 3
      );
      if (userAnnotation) {
        let reviewAnnotation = annotations.find(
          (annotation) => annotation.id === userAnnotation.parent_annotation
        );
        reviewNotesRef.current.value = reviewAnnotation?.review_notes ?? "";
        superCheckerNotesRef.current.value =
          userAnnotation?.supercheck_notes ?? "";

        try {
          const newDelta1 =
            reviewNotesRef.current.value != ""
              ? JSON.parse(reviewNotesRef.current.value)
              : "";
          reviewNotesRef.current.getEditor().setContents(newDelta1);
        } catch (err) {
          if (err) {
            const newDelta1 = reviewNotesRef.current.value;
            reviewNotesRef.current.getEditor().setText(newDelta1);
          }
        }
        try {
          const newDelta3 =
            superCheckerNotesRef.current.value != ""
              ? JSON.parse(superCheckerNotesRef.current.value)
              : "";
          superCheckerNotesRef.current.getEditor().setContents(newDelta3);
        } catch (err) {
          if (err) {
            const newDelta3 = superCheckerNotesRef.current.value;
            superCheckerNotesRef.current.getEditor().setText(newDelta3);
          }
        }

        setreviewtext(reviewNotesRef.current.getEditor().getText());
        setsupercheckertext(superCheckerNotesRef.current.getEditor().getText());
      } else {
        let reviewerAnnotations = annotations.filter(
          (value) => value.annotation_type === 2
        );
        if (reviewerAnnotations.length > 0) {
          let correctAnnotation = reviewerAnnotations.find(
            (annotation) => annotation.id === taskData.correct_annotation
          );

          if (correctAnnotation) {
            let superCheckerAnnotation = annotations.find(
              (annotation) =>
                annotation.parent_annotation === correctAnnotation.id
            );
            reviewNotesRef.current.value = correctAnnotation.review_notes ?? "";
            superCheckerNotesRef.current.value =
              superCheckerAnnotation?.supercheck_notes ?? "";

            try {
              const newDelta1 =
                reviewNotesRef.current.value != ""
                  ? JSON.parse(reviewNotesRef.current.value)
                  : "";
              reviewNotesRef.current.getEditor().setContents(newDelta1);
            } catch (err) {
              if (err) {
                const newDelta1 = reviewNotesRef.current.value;
                reviewNotesRef.current.getEditor().setText(newDelta1);
              }
            }
            try {
              const newDelta3 =
                superCheckerNotesRef.current.value != ""
                  ? JSON.parse(superCheckerNotesRef.current.value)
                  : "";
              superCheckerNotesRef.current.getEditor().setContents(newDelta3);
            } catch (err) {
              if (err) {
                const newDelta3 = superCheckerNotesRef.current.value;
                superCheckerNotesRef.current.getEditor().setText(newDelta3);
              }
            }

            setreviewtext(reviewNotesRef.current.getEditor().getText());
            setsupercheckertext(
              superCheckerNotesRef.current.getEditor().getText()
            );
          } else {
            let superCheckerAnnotation = annotations.find(
              (annotation) =>
                annotation.parent_annotation === reviewerAnnotations[0].id
            );
            reviewNotesRef.current.value =
              reviewerAnnotations[0].review_notes ?? "";
            superCheckerNotesRef.current.value =
              superCheckerAnnotation?.supercheck_notes ?? "";

            try {
              const newDelta1 =
                reviewNotesRef.current.value != ""
                  ? JSON.parse(reviewNotesRef.current.value)
                  : "";
              reviewNotesRef.current.getEditor().setContents(newDelta1);
            } catch (err) {
              if (err) {
                const newDelta1 = reviewNotesRef.current.value;
                reviewNotesRef.current.getEditor().setText(newDelta1);
              }
            }
            try {
              const newDelta3 =
                superCheckerNotesRef.current.value != ""
                  ? JSON.parse(superCheckerNotesRef.current.value)
                  : "";
              superCheckerNotesRef.current.getEditor().setContents(newDelta3);
            } catch (err) {
              if (err) {
                const newDelta3 = superCheckerNotesRef.current.value;
                superCheckerNotesRef.current.getEditor().setText(newDelta3);
              }
            }

            setreviewtext(reviewNotesRef.current.getEditor().getText());
            setsupercheckertext(
              superCheckerNotesRef.current.getEditor().getText()
            );
          }
        }
      }
    }
  };

  // we're running an effect on component mount and rendering LSF inside rootRef node
  useEffect(() => {
    if (localStorage.getItem("rtl") === "true") {
      var style = document.createElement("style");
      style.innerHTML = "input, textarea { direction: RTL; }";
      document.head.appendChild(style);
    }
    if (userData?.id && loaded.current !== taskId) {
      loaded.current = taskId;
      getProjectsandTasks(projectId, taskId).then(
        ([labelConfig, taskData, annotations, predictions]) => {
          // both have loaded!
          // console.log("[labelConfig, taskData, annotations, predictions]", [
          //   labelConfig,
          //   taskData,
          //   annotations,
          //   predictions,
          // ]);
          setNotes(taskData, annotations);
          let tempLabelConfig =
            labelConfig.project_type === "ConversationTranslation" ||
            labelConfig.project_type === "ConversationTranslationEditing"
              ? generateLabelConfig(taskData.data)
              : labelConfig.project_type === "ConversationVerification"
              ? conversationVerificationLabelConfig(taskData.data)
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
            reviewNotesRef,
            superCheckerNotesRef,
            labelConfig.project_type
          );
          hideLoader();
        }
      );
    }

    // Traversing and tab formatting --------------------------- end
  }, [
    labelConfig,
    userData,
    annotationNotesRef,
    reviewNotesRef,
    superCheckerNotesRef,
    taskId,
  ]);

  /* useEffect(() => {
    const interval = setInterval(() => {
      if (annotations.length && lsfRef.current?.store?.annotationStore?.selected && taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        //console.log("autoSave", annotation.serializeAnnotation(), annotations);
        for (let i = 0; i < annotations.length; i++) {
          if (
            (!annotations[i].result?.length ||
            annotation.serializeAnnotation()[0].id ===
              annotations[i].result[0].id) &&
              !["labeled", "accepted", "accepted_with_major_changes", "accepted_with_minor_changes"].includes(annotations[i].annotation_status)
          ) {
            let temp = annotation.serializeAnnotation();
            for (let i = 0; i < temp.length; i++) {
              if (temp[i].value.text) {
                temp[i].value.text = [temp[i].value.text[0]];
              }
            }
            let superChecker = annotations.filter(
              (value) => value.annotation_type === 3
            )[0];
            patchSuperChecker(
              superChecker.id,
              load_time.current,
              superChecker.lead_time,
              annotations[i].annotation_status,
              projectType === "SingleSpeakerAudioTranscriptionEditing"
                ? annotation.serializeAnnotation()
                : temp,
              superChecker.parent_annotation,
              superCheckerNotesRef.current.value
            ).then((err) => {
              if (err) {
                setSnackbarInfo({
                  open: true,
                  message: "Error in autosaving annotation",
                  variant: "error",
                });
              }
            });
          }
        }
      }
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [annotations]); */

  useEffect(() => {
    const projectObj = new GetProjectDetailsAPI(projectId);
    dispatch(APITransport(projectObj));
  }, []);

  useEffect(() => {
    showLoader();
  }, [taskId]);

  useEffect(() => {
    const showAssignedUsers = async () => {
      getTaskAssignedUsers(taskData).then((res) => setAssignedUsers(res));
    };
    taskData?.id && showAssignedUsers();
  }, [taskData]);

  const autoSaveSuperCheck = () => {
    if (
      autoSave &&
      lsfRef.current?.store?.annotationStore?.selected &&
      taskData.task_status.toLowerCase() !== "validated" &&
      taskData.task_status.toLowerCase() !== "validated_with_changes"
    ) {
      if (taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        let temp = annotation.serializeAnnotation();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].type === "relation") {
            continue;
          } else if (temp[i].value.text) {
            temp[i].value.text = [temp[i].value.text[0]];
          }
        }
        let superChecker = annotations.filter(
          (value) => value.annotation_type === 3
        )[0];
        patchSuperChecker(
          taskId,
          superChecker.id,
          load_time.current,
          superChecker.lead_time,
          superChecker.annotation_status,
          temp,
          superChecker.parent_annotation,
          JSON.stringify(
            superCheckerNotesRef.current.getEditor().getContents()
          ),
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
      } else
        setSnackbarInfo({
          open: true,
          message: "Task is frozen",
          variant: "error",
        });
    }
  };

  const clearAllChildren = () => {
    if (
      lsfRef.current?.store?.annotationStore?.selected &&
      taskData.task_status.toLowerCase() !== "validated" &&
      taskData.task_status.toLowerCase() !== "validated_with_changes"
    ) {
      if (taskData?.annotation_status !== "freezed") {
        let annotation = lsfRef.current.store.annotationStore.selected;
        let temp = annotation.serializeAnnotation();
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].parentID !== undefined) {
            delete temp[i].parentID;
          }
          if (temp[i].type === "relation") {
            continue;
          } else if (temp[i].value.text) {
            temp[i].value.text = [temp[i].value.text[0]];
          }
        }
        let superChecker = annotations.filter(
          (value) => value.annotation_type === 3
        )[0];
        patchSuperChecker(
          taskId,
          superChecker.id,
          load_time.current,
          superChecker.lead_time,
          superChecker.annotation_status,
          temp,
          superChecker.parent_annotation,
          JSON.stringify(
            superCheckerNotesRef.current.getEditor().getContents()
          ),
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
          } else {
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
    !visible && autoSaveSuperCheck();
  }, [visible]);

  useEffect(() => {
    const interval = setInterval(() => {
      visible && autoSaveSuperCheck();
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [
    visible,
    autoSave,
    lsfRef.current?.store?.annotationStore?.selected,
    taskData,
  ]);

  const onNextAnnotation = async () => {
    showLoader();
    getNextProject(projectId, taskId, "supercheck").then((res) => {
      hideLoader();
      // window.location.href = `/projects/${projectId}/task/${res.id}`;
      tasksComplete(res?.id || null);
    });
  };
  useEffect(() => {
    if (taskId) {
      fetchAnnotationTask();
    }
  }, [taskId]);
  const fetchAnnotationTask = async () => {
    const res = await fetchAnnotation(taskId);
    // console.log(res);
    // if(res[0]?.result[0])
    // {
    //   // setIndicText(res[0]?.result[0]?.value?.text[0]);
    // }
    setTaskData(res);
    setAnnotations(res?.annotations);
  };

  // create a handleSubmitRomanisedText function
  // const handleSubmitRomanisedText = async () => {
  //   if(taskData?.data?.input_text && taskData?.data?.output_language){
  //     const language = LanguageCode.languages
  //     let output_lng_code = ''

  //     language.filter((lang) => {
  //       if(lang.label === taskData?.data?.output_language){
  //         output_lng_code= lang.code
  //       }
  //     });
  //     // Create a new instance of the class
  //     const postTransliterationForLogging = new PostTransliterationForLogging(
  //       taskData?.data?.input_text,
  //       indicText ,
  //       originalRomanisedText,
  //       editedRomanisedText,
  //       output_lng_code
  //     );
  //     const res = await dispatch(APITransport(postTransliterationForLogging));
  //     if(res?.success){
  //       setRomanisedTransliterationData(
  //         {
  //           timestamp: '',
  //           error: '',
  //           input: '',
  //           romanised_transliteration: '',
  //           success: false
  //         }
  //       )
  //       setOriginalRomanisedText("");
  //       setEditedRomanisedText("");
  //       setSnackbarInfo({
  //         open: true,
  //         message: "Transliteration Logged",
  //         variant: "success",
  //       });
  //       setShowSpinner(false)

  //     }else{
  //       setSnackbarInfo({
  //         open: true,
  //         message: "Error in logging transliteration",
  //         variant: "error",
  //       });
  //       setShowSpinner(false)
  //     }
  //   }
  // }

  // const handleTranslitrationOnClick = async () => {
  //   setShowSpinner(true)
  //   const language = LanguageCode.languages
  //   let output_lng_code = ''

  //   language.filter((lang) => {
  //     if(lang.label == taskData?.data?.output_language){
  //       output_lng_code = lang.code
  //     }
  //   })
  //   try {

  //   const res = await fetchTransliteration(indicText, output_lng_code);
  //   if(res?.success && res?.romanised_transliteration) {
  //     setRomanisedTransliterationData(res);
  //     if(res?.romanised_transliteration)
  //     {
  //       setOriginalRomanisedText(res.romanised_transliteration);
  //     }
  //     setSnackbarInfo({
  //       open: true,
  //       message: "Transliteration Done",
  //       variant: "success",
  //     });
  //     setShowSpinner(false)
  //   }
  // }
  // catch (error) {
  //   setSnackbarInfo({
  //     open: true,
  //     message: "Error in fetching romanised text",
  //     variant: "error",
  //   });
  //   setShowSpinner(false)
  // }

  // }
  // useEffect(() => {
  //   if(originalRomanisedText) {
  //     setEditedRomanisedText(originalRomanisedText);
  //   }
  // }, [originalRomanisedText]);

  // useEffect(() => {
  //   let annotation = lsfRef?.current?.store?.annotationStore?.selected;
  //     let temp;
  //     for (let i = 0; i < annotations?.length; i++) {
  //       if (
  //         !annotations[i]?.result?.length ||
  //         annotation.serializeAnnotation()[0].id ===
  //           annotations[i]?.result[0].id
  //       ) {
  //         temp = annotation.serializeAnnotation();
  //         if (annotations[i]?.annotation_type !== 1) continue;
  //         for (let i = 0; i < temp?.length; i++) {
  //           if(temp[i].type === "relation"){
  //             continue;
  //           }else if (temp[i]?.value.text) {
  //             temp[i].value.text = [temp[i].value.text[0]];
  //           }
  //         }
  //         if(temp[0]?.value?.text[0]?.length >0){
  //           setIndicText(temp[0]?.value?.text[0])
  //         }
  //       }
  //       }
  // }, [annotations, fetchTransliteration, handleSubmitRomanisedText]);

  // // call the handleTransliteration for first time if the indic text is present
  // useEffect(() => {
  //   if(indicText){
  //     handleTranslitrationOnClick()
  //   }
  // }, [indicText]);
  // const handleEditableRomanisedText =(e)=>{
  //   setEditedRomanisedText(e.target.value)
  // }
  const [value, setvalue] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRejectClick = async () => {
    review_status.current = "rejected";
    lsfRef.current.store.submitAnnotation();
  };

  const handleAcceptClick = async (status) => {
    review_status.current = status;
    lsfRef.current.store.submitAnnotation();
    handleClose();
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

  const ProjectsData = localStorage.getItem("projectData");
  const ProjectData = JSON.parse(ProjectsData);

  const handleSelectChange = (event) => {
    selectedLanguages.current = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedL(
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  };

  useEffect(() => {
    if (taskData) {
      if (Array.isArray(taskData?.data?.language)) {
        taskData?.data?.language?.map((lang) => {
          if (!selectedLanguages.current.includes(lang)) {
            selectedLanguages.current.push(lang);
          }
          const newLanguages = new Set([
            ...selectedL,
            ...taskData?.data?.language,
          ]);
          setSelectedL(Array.from(newLanguages));
        });
      }
      if (
        typeof taskData?.data?.language === "string" &&
        taskData?.data?.ocr_domain !== ""
      ) {
        setSelectedL([taskData?.data?.language]);
        if (!selectedLanguages.current.includes(taskData?.data?.language)) {
          selectedLanguages.current.push(taskData?.data?.language);
        }
      }
      if (
        typeof taskData?.data?.ocr_domain === "string" &&
        taskData?.data?.ocr_domain !== ""
      ) {
        ocrDomain.current = taskData?.data?.ocr_domain;
        setOcrD(taskData?.data?.ocr_domain);
      }
    }
  }, [taskData]);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {taskData?.super_check_user === userData?.id && (
          <div style={{ textAlign: "left", marginBottom: "15px" }}>
            {autoSave ? (
              <Typography variant="body" color="#000000">
                Auto-save is enabled for this scenario.
              </Typography>
            ) : (
              <Typography variant="body" color="#000000">
                Auto-save is not available for this scenario. Please save your
                task manually.
              </Typography>
            )}
          </div>
        )}
        <div>
          {ProjectData &&
          ProjectData?.revision_loop_count >
            taskData?.revision_loop_count?.super_check_count
            ? false
            : true && (
                <div style={{ textAlign: "right", marginBottom: "15px" }}>
                  <Typography variant="body" color="#f5222d">
                    Note: The 'Revision Loop Count' limit has been reached for
                    this task.
                  </Typography>
                </div>
              )}

          {ProjectData &&
            ProjectData.revision_loop_count -
              taskData?.revision_loop_count?.super_check_count !==
              0 && (
              <div style={{ textAlign: "right", marginBottom: "15px" }}>
                <Typography variant="body" color="#f5222d">
                  Note: This task can be rejected{" "}
                  {ProjectData.revision_loop_count -
                    taskData?.revision_loop_count?.super_check_count}{" "}
                  more times.
                </Typography>
              </div>
            )}
        </div>
      </div>

      {!loader && (
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="lsf-controls"
        >
          <div />
          <div>
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
            <Tooltip title="Go to next task">
              <Button
                type="default"
                onClick={onNextAnnotation}
                style={{
                  minWidth: "160px",
                  border: "1px solid #e6e6e6",
                  color: "#1890ff",
                  pt: 3,
                  pb: 3,
                  borderBottom: "None",
                }}
                className="lsf-button"
              >
                Next
              </Button>
            </Tooltip>
            {taskData?.super_check_user === userData?.id && (
              <Tooltip title="Save task for later">
                <Button
                  type="default"
                  onClick={() => handleAcceptClick("draft")}
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
            {taskData?.super_check_user === userData?.id && (
              <Tooltip title="Reject">
                <Button
                  value="Reject"
                  type="default"
                  onClick={handleRejectClick}
                  disabled={
                    ProjectData?.revision_loop_count >
                    taskData?.revision_loop_count?.super_check_count
                      ? false
                      : true
                  }
                  style={{
                    minWidth: "160px",
                    border: "1px solid #e6e6e6",
                    color: (
                      ProjectData?.revision_loop_count >
                      taskData?.revision_loop_count?.super_check_count
                        ? false
                        : true
                    )
                      ? "#B2BABB"
                      : "#f5222d",
                    pt: 3,
                    pb: 3,
                    borderBottom: "None",
                    borderLeft: "None",
                  }}
                  className="lsf-button"
                >
                  Reject
                </Button>
              </Tooltip>
            )}
            {taskData?.super_check_user === userData?.id && (
              <Tooltip title="Validate">
                <Button
                  id="accept-button"
                  value="Validate"
                  type="default"
                  aria-controls={open ? "accept-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  style={{
                    minWidth: "160px",
                    border: "1px solid #e6e6e6",
                    color: "#52c41a",
                    pt: 3,
                    pb: 3,
                    borderBottom: "None",
                    borderLeft: "None",
                  }}
                  className="lsf-button"
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Validate
                </Button>
              </Tooltip>
            )}
            {ProjectDetails?.project_type?.includes("OCR") && (
              <Tooltip title="Clear all children bboxes">
                <Button
                  type="default"
                  onClick={() => {
                    clearAllChildren();
                  }}
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
            )}
            <StyledMenu
              id="accept-menu"
              MenuListProps={{
                "aria-labelledby": "accept-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => handleAcceptClick("validated")}
                disableRipple
              >
                Validated No Changes
              </MenuItem>
              <MenuItem
                onClick={() => handleAcceptClick("validated_with_changes")}
                disableRipple
              >
                Validated with Changes
              </MenuItem>
            </StyledMenu>
          </div>
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

        {
          // <RomanisedTransliteration
          //   minimizeTextbox = {showRomanisedTransliterationModel}
          //   onClose = {() => {
          //     setShowRomanisedTransliterationModel(!showRomanisedTransliterationModel)
          //   }}
          //   setShowRomanisedTransliterationModel = {setShowRomanisedTransliterationModel}
          //   indicText={indicText}
          //   originalRomanisedText={originalRomanisedText}
          //   editedRomanisedText={editedRomanisedText}
          //   handleEditableRomanisedText={handleEditableRomanisedText}
          //   handleTranslitrationOnClick={handleTranslitrationOnClick}
          //   handleSubmitRomanisedText={handleSubmitRomanisedText}
          //   showSpinner={showSpinner}
          // />
        }
      </Box>
      {!loader &&
        ProjectDetails?.project_type?.includes("OCRSegmentCategorization") && (
          <>
            <div
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#E0E0E0",
                paddingBottom: "1%",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  paddingLeft: "1%",
                  fontSize: "medium",
                  paddingTop: "1%",
                  display: "flex",
                }}
              >
                <div style={{ margin: "auto" }}>Languages :&nbsp;</div>
                <select
                  multiple
                  onChange={handleSelectChange}
                  value={selectedL}
                >
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
              <div
                style={{
                  paddingLeft: "1%",
                  fontSize: "medium",
                  paddingTop: "1%",
                  display: "flex",
                }}
              >
                <div style={{ margin: "auto" }}>Domain :&nbsp;</div>
                <select
                  style={{ margin: "auto" }}
                  onChange={(e) => {
                    setOcrD(e.target.value);
                    ocrDomain.current = e.target.value;
                  }}
                  value={ocrD}
                >
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
            <div
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "#E0E0E0",
                paddingBottom: "1%",
              }}
            >
              <div
                style={{
                  paddingLeft: "1%",
                  fontSize: "medium",
                  paddingTop: "1%",
                  paddingBottom: "1%",
                }}
              >
                Predictions
              </div>
              {predictions?.length > 0 ? (
                (() => {
                  try {
                    return JSON.parse(predictions)?.map((pred, index) => (
                      <div
                        style={{
                          paddingLeft: "2%",
                          display: "flex",
                          paddingRight: "2%",
                          paddingBottom: "1%",
                        }}
                      >
                        <div
                          style={{
                            padding: "1%",
                            margin: "auto",
                            color: "#9E9E9E",
                          }}
                        >
                          {index}
                        </div>
                        <textarea
                          readOnly
                          style={{ width: "100%", borderColor: "#E0E0E0" }}
                          value={pred.text}
                        />
                      </div>
                    ));
                  } catch (error) {
                    console.error("Error parsing predictions:", error);
                    return predictions?.map((pred, index) => (
                      <div
                        style={{
                          paddingLeft: "2%",
                          display: "flex",
                          paddingRight: "2%",
                          paddingBottom: "1%",
                        }}
                      >
                        <div
                          style={{
                            padding: "1%",
                            margin: "auto",
                            color: "#9E9E9E",
                          }}
                        >
                          {index}
                        </div>
                        <textarea
                          readOnly
                          style={{ width: "100%", borderColor: "#E0E0E0" }}
                          value={pred.text}
                        />
                      </div>
                    ));
                  }
                })()
              ) : (
                <div style={{ textAlign: "center" }}>
                  No Predictions Present
                </div>
              )}
            </div>
          </>
        )}
      {loader}
      {renderSnackBar()}
    </div>
  );
};

export default function LSF() {
  const [showNotes, setShowNotes] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [showGlossary, setShowGlossary] = useState(false);
  const annotationNotesRef = useRef(null);
  const reviewNotesRef = useRef(null);
  const superCheckerNotesRef = useRef(null);
  const [reviewtext, setreviewtext] = useState("");
  const [supercheckertext, setsupercheckertext] = useState("");
  const { taskId } = useParams();
  const [showTagsInput, setShowTagsInput] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [alertData, setAlertData] = useState({
    open: false,
    message: "",
    variant: "info",
  });
  // const [notesValue, setNotesValue] = useState('');
  const { projectId } = useParams();
  const modules = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }],
      [{ script: "sub" }, { script: "super" }],
    ],
  };

  const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
  ];

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

  const resetNotes = () => {
    setShowNotes(false);
    superCheckerNotesRef.current.getEditor().setContents([]);
    reviewNotesRef.current.getEditor().setContents([]);
  };

  useEffect(() => {
    resetNotes();
  }, [taskId]);

  const getTaskData = (taskData) => {
    setTaskData(taskData);
  };
  const handleGlossaryClick = () => {
    setShowGlossary(!showGlossary);
  };

  return (
    <div style={{ maxHeight: "100%", maxWidth: "90%", margin: "auto" }}>
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
            window.location.replace(`/#/projects/${projectId}`);
            window.location.reload();
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
            />

            <TextField
              multiline
              placeholder="Place your remarks here ..."
              label="Super Checker Notes"
              // value={notesValue}
              // onChange={event=>setNotesValue(event.target.value)}
              inputRef={superCheckerNotesRef}
              InputLabelProps={{
                shrink: true,
              }}
              rows={2}
              maxRows={4}
              inputProps={{
                style: { fontSize: "1rem" },
              }}
              style={{ width: "99%", marginTop: "1%" }}
              ref={quillRef}
            /> */}
            <ReactQuill
              ref={reviewNotesRef}
              modules={modules}
              formats={formats}
              bounds={"#note"}
              placeholder="Review Notes"
              style={{ marginbottom: "1%", minHeight: "2rem" }}
              readOnly={true}
            ></ReactQuill>
            <ReactQuill
              ref={superCheckerNotesRef}
              modules={modules}
              bounds={"#note"}
              formats={formats}
              placeholder="SuperChecker Notes"
              style={{ marginbottom: "1%", minHeight: "2rem" }}
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
              paddingTop: "10px",
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
            vertical: "bottom",
            horizontal: "right",
          }}
          variant={alertData.variant}
          message={alertData.message}
        />
        <LabelStudioWrapper
          getTaskData={getTaskData}
          resetNotes={() => resetNotes()}
          reviewNotesRef={reviewNotesRef}
          annotationNotesRef={annotationNotesRef}
          superCheckerNotesRef={superCheckerNotesRef}
          loader={loader}
          showLoader={showLoader}
          hideLoader={hideLoader}
          setreviewtext={setreviewtext}
          setsupercheckertext={setsupercheckertext}
        />
      </Card>
    </div>
  );
}

LabelStudioWrapper.propTypes = PropTypes.object;
