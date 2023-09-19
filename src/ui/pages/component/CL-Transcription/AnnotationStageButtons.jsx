import React from "react";
import {Grid, Tooltip, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


const AnnotationStageButtons = ({
  handleAnnotationClick,
  onNextAnnotation,
  AnnotationsTaskDetails,
  disableBtns,
  disableUpdataButton,
  disableSkipButton,
  filterMessage,
  // taskData
}) => {
  // const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const { taskId } = useParams();

 
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);

  let Annotation = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 1
  )[0];
console.log(taskData);

  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, mb: 3, ml: 3 }}>
      {!disableSkipButton &&
          taskData?.annotation_users?.some((users) => users === user.id) && (
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
        {!disableBtns &&
          taskData?.annotation_users?.some((users) => users === user.id) && (
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
        {!disableUpdataButton &&
          taskData?.annotation_users?.some((users) => users === user.id) && (
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
        <Alert severity="info" sx={{ ml:2,mb: 2,width:"95%"}}>
          {filterMessage}
        </Alert>
      )}
    </>
  );
};

export default AnnotationStageButtons;
