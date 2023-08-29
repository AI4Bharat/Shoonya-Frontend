import React, {
  useRef,
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Typography, Grid, Tooltip, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GetTaskAnnotationsAPI from "../../../../redux/actions/api/Tasks/GetTaskAnnotations";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";
import GetNextProjectAPI from "../../../../redux/actions/CL-Transcription/GetNextProject";
import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";

const AnnotationStageButtons = ({
  handleAnnotationClick,
  onNextAnnotation,
  annotationNotesValue,
  AnnotationsTaskDetails,
}) => {
  // const classes = AudioTranscriptionLandingStyle();
  const [annotations, setAnnotations] = useState([]);
  const [disableSkip, setdisableSkip] = useState(false);
  const [filterMessage, setFilterMessage] = useState(null);
  const [disableBtns, setDisableBtns] = useState(false);
  const [disableUpdata, setDisableUpdata] = useState(false);

  const dispatch = useDispatch();
  const { taskId } = useParams();

  const TaskDetails = useSelector((state) => state.getTaskDetails.data);
  const user = useSelector((state) => state.fetchLoggedInUserData.data);
  const getNextTask = useSelector((state) => state.getnextProject.data);
  let Annotation = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 1
  )[0]

  useEffect(() => {
    const userAnnotation = AnnotationsTaskDetails.find((annotation) => {
      return (
        annotation.completed_by === user.id && !annotation.parent_annotation
      );
    });
    
    const userreview = AnnotationsTaskDetails.find(
      (annotation) => annotation.annotation_type === 2
    );
    if (userAnnotation) {
      const review = AnnotationsTaskDetails.find(
        (annotation) => annotation.annotation_type === 2
      );
      const superCheckedAnnotation = AnnotationsTaskDetails.find(
        (annotation) => annotation.annotation_type === 3
      );
      console.log(userAnnotation,"userAnnotationuserAnnotation",review,superCheckedAnnotation)
      if (
        userAnnotation.annotation_status === "labeled" &&
        localStorage.getItem("labellingMode") === "labeled"
      ) {
        
        if (
          superCheckedAnnotation &&
          ["draft", "skipped", "validated", "validated_with_changes"].includes(
            superCheckedAnnotation.annotation_status
          )
        ) {
          setDisableBtns(true);
          setdisableSkip(true);
          setDisableUpdata(true);
          setFilterMessage(
            "This is the Super Checker's Annotation in read only mode"
          );
        } else if (
          review?.annotation_type === 2  &&
          ["skipped", "draft", "rejected", "unreviewed"].includes(
            review.annotation_status
          )
        ) {
          setDisableBtns(true);
          setdisableSkip(true);
          setDisableUpdata(true);
          setFilterMessage("This task is being reviewed by the reviewer");
        } else if (
          review &&
          [
            "accepted",
            "accepted_with_minor_changes",
            "accepted_with_major_changes",
          ].includes(review.annotation_status)
        ) {
          setDisableBtns(true);
          setdisableSkip(true);
          setDisableUpdata(true);
          setFilterMessage(
            "This is the Reviewer's Annotation in read only mode"
          );
        }
      } else if (
        userreview &&
        ["draft"].includes(userreview.annotation_status) &&
        localStorage.getItem("labellingMode") === "draft"
      ) {
        setdisableSkip(true);
        setFilterMessage(
          "Skip button is disabled, since the task is being reviewed"
        );
      } else if (
        userAnnotation &&
        ["to_be_revised"].includes(userAnnotation.annotation_status) &&
        localStorage.getItem("labellingMode") === "to_be_revised"
      ) {
        setdisableSkip(true);
        setFilterMessage(
          "Skip button is disabled, since the task is being reviewed"
        );
      }
    }
  }, [AnnotationsTaskDetails, user]);



  return (
    <>
      <Grid container spacing={1} sx={{ mt: 4, mb: 5,ml:3 }}>
        {!disableBtns &&
          [4, 5, 6].includes(user.role) &&
          TaskDetails?.annotation_users?.some((users) => users === user.id) && (
            <Grid item>
              <Tooltip title="Save task for later">
                <Button
                  value="Draft"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleAnnotationClick(
                      "draft",
                      Annotation.id,
                      Annotation.lead_time,
                      annotationNotesValue
                    )
                  }
                  style={{
                    minWidth: "120px",
                    border: "1px solid gray",
                    color: "#e80",
                    pt: 2,
                    pb: 2,
                  }}
                  // className="lsf-button"
                >
                  Draft
                </Button>
              </Tooltip>
              {/* )} */}
            </Grid>
          )}
        <Grid item>
          <Tooltip title="Go to next task">
            <Button
              value="Next"
              type="default"
              onClick={() => onNextAnnotation("next", getNextTask?.id)}
              style={{
                minWidth: "120px",
                border: "1px solid gray",
                color: "#09f",
                pt: 2,
                pb: 2,
              }}
            >
              Next
            </Button>
          </Tooltip>
        </Grid>
        {!disableSkip &&
          [4, 5, 6].includes(user.role) &&
          TaskDetails?.annotation_users?.some((users) => users === user.id) && (
            <Grid item>
              <Tooltip title="skip to next task">
                <Button
                  value="Skip"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleAnnotationClick(
                      "skipped",
                      Annotation.id,
                      Annotation.lead_time,
                      annotationNotesValue
                    )
                  }
                  style={{
                    minWidth: "120px",
                    border: "1px solid gray",
                    color: "#d00",
                    pt: 2,
                    pb: 2,
                  }}
                  // className="lsf-button"
                >
                  Skip
                </Button>
              </Tooltip>
            </Grid>
          )}
        {!disableUpdata &&
          [4, 5, 6].includes(user.role) &&
          TaskDetails?.annotation_users?.some((users) => users === user.id) && (
            <Grid item>
              <Tooltip>
                <Button
                  value="Updata"
                  type="default"
                  variant="contained"
                  onClick={() =>
                    handleAnnotationClick(
                      "labeled",
                      Annotation.id,
                      Annotation.lead_time,
                      annotationNotesValue
                    )
                  }
                  style={{
                    minWidth: "120px",
                    border: "1px solid gray",
                    backgroundColor: "rgb(44, 39, 153)",
                    color: "#fff",
                    pt: 2,
                  }}
                >
                  Update
                </Button>
              </Tooltip>
            </Grid>
          )}
      </Grid>
      {filterMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {filterMessage}
        </Alert>
      )}
    </>
  );
};

export default AnnotationStageButtons;
