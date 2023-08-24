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

const AnnotationStageButtons =
  ({ handleAnnotationClick, onNextAnnotation, annotationNotesValue ,value}) => {
    // const classes = AudioTranscriptionLandingStyle();
    const [annotations, setAnnotations] = useState([]);
    const [disableSkip, setdisableSkip] = useState(false);
    const [testing, setTesting] = useState(false);
    const [filterMessage, setFilterMessage] = useState(null);
    const [disableBtns, setDisableBtns] = useState(false);
    const [disableUpdata, setDisableUpdata] = useState(false);

    const dispatch = useDispatch();
    const { taskId } = useParams();

    const TaskDetails = useSelector((state) => state.getTaskDetails.data);
    const AnnotationsTaskDetails = useSelector(
      (state) => state.getAnnotationsTask.data
    );
    const user = useSelector((state) => state.fetchLoggedInUserData.data);
    const getAnnotationsTaskData = () => {
      const userObj = new GetTaskAnnotationsAPI(taskId);
      dispatch(APITransport(userObj));
    };
    const getNextTask = useSelector((state) => state.getnextProject.data);
    const ProjectDetails = useSelector((state) => state.getProjectDetails.data);


    useEffect(() => {
      getAnnotationsTaskData();
      filterAnnotations();
    }, []);

    useEffect(() => {
      if (AnnotationsTaskDetails?.length > 0)
        setAnnotations(AnnotationsTaskDetails);
    }, [AnnotationsTaskDetails]);


   
    useEffect(() => {
      filterAnnotations(annotations, user,setDisableBtns,setDisableUpdata,setdisableSkip,setFilterMessage,TaskDetails);
    }, [annotations, user, disableBtns, filterMessage, disableSkip,disableUpdata,TaskDetails]);


    const filterAnnotations = (
      annotations, user,setDisableBtns,setDisableUpdata,setdisableSkip,setFilterMessage,TaskDetails
    ) => {
      // let disable = false;
      // let disableSkip = false;
      let filteredAnnotations = annotations;
      let userAnnotation = annotations?.find((annotation) => {
        return annotation.completed_by === user.id && !annotation.parent_annotation;
      });
      let userAnnotationData = annotations?.find(
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
            [
              // "draft",
              // "skipped",
              "validated",
              "validated_with_changes",
            ].includes(superCheckedAnnotation.annotation_status)
          ) {
            filteredAnnotations = [superCheckedAnnotation];
            setFilterMessage(
              "This is the Super Checker's Annotation in read only mode"
            );
            setDisableBtns(true);
            // disable = true;
          } else if (
            review &&
            [ "rejected", "unreviewed"].includes(
              review.annotation_status
            )
          ) {
            filteredAnnotations = [userAnnotation];
            // disable = true;
            setDisableBtns(true);
            setdisableSkip(true);
            setDisableUpdata(true)
            setFilterMessage("This task is being reviewed by the reviewer");
          } else if (
            review &&
            [
              // "draft",
              // "skipped",
              "accepted",
              "accepted_with_minor_changes",
              "accepted_with_major_changes",
            ].includes(review.annotation_status)
          ) {
            filteredAnnotations = [review];
            // disable = true;
            setDisableBtns(true);
            setFilterMessage(
              "This is the Reviewer's Annotation in read only mode"
            );
          } else {
            filteredAnnotations = [userAnnotation];
          }
        } else if (
          userAnnotationData &&
          ["draft"].includes(userAnnotation.annotation_status)
        ) {
          filteredAnnotations = [userAnnotation];
          setdisableSkip(true);
          // setDisableButton(true);
          setFilterMessage(
            "Skip button is disabled, since the task is being reviewed"
          );
        } else if (
          userAnnotation &&
          ["to_be_revised"].includes(userAnnotation.annotation_status)
        ) {
          filteredAnnotations = [userAnnotation];
          setdisableSkip(true);
          // setDisableButton(true);
          setFilterMessage(
            "Skip button is disabled, since the task is being reviewed"
          );
        } else {
          filteredAnnotations = [userAnnotation];
        }
      } else if (([4, 5, 6].includes(user?.role) && !TaskDetails?.annotation_users?.some((users) => users === user?.id))) {
        filteredAnnotations = annotations.filter(
          (a) => a.annotation_type === 1 
        )
        // disable = true;
        setDisableBtns(true);
        setdisableSkip(true);
        setDisableUpdata(true);
      }
    
     
      return [filteredAnnotations];
    };


    return (
      <>
        <Grid container spacing={1} sx={{ mt: 4, mb: 5 }}>
          {TaskDetails?.annotation_users?.some((users) => users === user.id) &&
            !disableBtns && (
              <Grid item>
                <Tooltip title="Save task for later">
                  <Button
                    value="Draft"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                      handleAnnotationClick(
                        "draft",
                        AnnotationsTaskDetails[0]?.id,
                        AnnotationsTaskDetails[0]?.lead_time,
                        annotationNotesValue,
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
          {  !disableSkip && (
            <Grid item>
              <Tooltip title="skip to next task">
                <Button
                  value="Skip"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleAnnotationClick(
                      "skipped",
                      AnnotationsTaskDetails[0]?.id,
                      AnnotationsTaskDetails[0]?.lead_time,
                      annotationNotesValue,
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
         {  !disableUpdata &&
          <Grid item>
            <Tooltip>
              <Button
                value="Updata"
                type="default"
                variant="contained"
                onClick={() =>
                  handleAnnotationClick(
                    "labeled",
                    AnnotationsTaskDetails[0]?.id,
                    AnnotationsTaskDetails[0]?.lead_time,
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
          </Grid>}
        </Grid>
        {filterMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterMessage}
          </Alert>
        )}


      </>
    )
  }
 


export default AnnotationStageButtons;
