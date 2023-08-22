import React, { useRef, memo, useCallback, useEffect, useState, useMemo } from "react";
import { Typography, Grid, Tooltip, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import GetTaskAnnotationsAPI from "../../../../redux/actions/api/Tasks/GetTaskAnnotations";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";

const AnnotationStageButtons = memo(
  ({ handleAnnotationClick, onNextAnnotation ,setDisableBtns,disableBtns,filterMessage,setFilterMessage}) => {
    // const classes = AudioTranscriptionLandingStyle();
    const [annotations, setAnnotations] = useState([]);
    const [disableSkip, setdisableSkip] = useState(false);

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

    useEffect(() => {
      getAnnotationsTaskData();
    }, []);

    useEffect(() => {
      if (AnnotationsTaskDetails.length > 0) setAnnotations(AnnotationsTaskDetails);
    }, [AnnotationsTaskDetails]);

    console.log(AnnotationsTaskDetails,"AnnotationsTaskDetails")
    //   let disable = false;
    //   let disableSkip = false;
    //   let filteredAnnotations = annotations;
    //   let userAnnotation = annotations?.find((annotation) => {
    //     return (
    //       annotation.completed_by === user.id && !annotation.parent_annotation
    //     );
    //   });
    //   let userAnnotationData = annotations?.find(
    //     (annotation) => annotation.annotation_type == 2
    //   );
    //   console.log(
    //     userAnnotation,
    //     "userAnnotationuserAnnotation",
    //     userAnnotationData
    //   );
    //   if (userAnnotation) {
    //     if (userAnnotation.annotation_status === "labeled") {
    //       const superCheckedAnnotation = annotations.find(
    //         (annotation) => annotation.annotation_type === 3
    //       );
    //       let review = annotations.find(
    //         (annotation) =>
    //           annotation.parent_annotation === userAnnotation.id &&
    //           annotation.annotation_type === 2
    //       );
    //       if (
    //         superCheckedAnnotation &&
    //         [
    //           "draft",
    //           "skipped",
    //           "validated",
    //           "validated_with_changes",
    //         ].includes(superCheckedAnnotation.annotation_status)
    //       ) {
    //         filteredAnnotations = [superCheckedAnnotation];
    //         setFilterMessage(
    //           "This is the Super Checker's Annotation in read only mode"
    //         );
    //         setDisableBtns(true);
    //         disable = true;
    //       } else if (
    //         review &&
    //         ["skipped", "draft", "rejected", "unreviewed"].includes(
    //           review.annotation_status
    //         )
    //       ) {
    //         filteredAnnotations = [userAnnotation];
    //         disable = true;
    //         setDisableBtns(true);
    //         setFilterMessage("This task is being reviewed by the reviewer");
    //       } else if (
    //         review &&
    //         [
    //           "accepted",
    //           "accepted_with_minor_changes",
    //           "accepted_with_major_changes",
    //         ].includes(review.annotation_status)
    //       ) {
    //         filteredAnnotations = [review];
    //         disable = true;
    //         setDisableBtns(true);
    //         setFilterMessage(
    //           "This is the Reviewer's Annotation in read only mode"
    //         );
    //       } else {
    //         filteredAnnotations = [userAnnotation];
    //       }
    //     } else if (
    //       userAnnotationData &&
    //       ["draft"].includes(userAnnotation.annotation_status)
    //     ) {
    //       filteredAnnotations = [userAnnotation];
    //       disableSkip = true;
    //       // setDisableButton(true);
    //       setFilterMessage(
    //         "Skip button is disabled, since the task is being reviewed"
    //       );
    //     } else if (
    //       userAnnotation &&
    //       ["to_be_revised"].includes(userAnnotation.annotation_status)
    //     ) {
    //       filteredAnnotations = [userAnnotation];
    //       disableSkip = true;
    //       // setDisableButton(true);
    //       setFilterMessage(
    //         "Skip button is disabled, since the task is being reviewed"
    //       );
    //     } else {
    //       filteredAnnotations = [userAnnotation];
    //     }
    //   } else if ([4, 5, 6].includes(user.role)) {
    //     filteredAnnotations = annotations.filter(
    //       (a) => a.annotation_type === 1
    //     );
    //     disable = true;
    //     setDisableBtns(true);
    //     disableSkip = true;
    //   }
    // }, [annotations, user, filterMessage, disableBtns]);

  
    const filterAnnotations = (
      annotations,
      user,
      setDisableBtns,
      setFilterMessage,
      disableSkip,
    ) => {
      console.log(annotations,"useruseruser",user)
      let disable = false;
      // let disableSkip = false;
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
          }else if (
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
          // setDisableButton(true);
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
          // setDisableButton(true);
          setFilterMessage("Skip button is disabled, since the task is being reviewed");
        }
    
         else {
          filteredAnnotations = [userAnnotation];
        }
      } else if([4, 5, 6].includes(user.role)) {
        filteredAnnotations = annotations.filter((a) => a.annotation_type === 1);
        disable = true;
        setDisableBtns(true);
        disableSkip = true;
        console.log("thislaststage")
      }
      return [filteredAnnotations, disable, disableSkip];

    };

 
useEffect(()=>{
  filterAnnotations(annotations,user, setDisableBtns,setFilterMessage,disableSkip )
},[annotations,user, setDisableBtns,setFilterMessage,disableSkip])

   
   
    return (
      <>
        <Grid container spacing={1} sx={{ mt: 4, mb: 5 }}>
          {TaskDetails?.annotation_users?.some((users) => users === user.id) &&
            (!disableBtns)  && (
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
                        AnnotationsTaskDetails[0]?.lead_time
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
                V
                onClick={() => onNextAnnotation("next",TaskDetails?.id,)}
                style={{
                  minWidth: "120px",
                  border: "1px solid gray",
                  color: "#09f",
                  pt: 2,
                  pb: 2,
                }}
                // className="lsf-button"
              >
                Next
              </Button>
            </Tooltip>
          </Grid>
          {(!disableSkip) &&
          <Grid item>
            <Tooltip>
              <Button
                value="Skip"
                type="default"
                variant="outlined"
                onClick={() =>
                  handleAnnotationClick(
                    "skipped",
                    AnnotationsTaskDetails[0]?.id,
                    AnnotationsTaskDetails[0]?.lead_time,
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
         } 
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
                    AnnotationsTaskDetails[0]?.lead_time
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
        </Grid>
        {filterMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterMessage}
          </Alert>
        )}
      </>
    );
  },
  () => true
);

export default AnnotationStageButtons;
