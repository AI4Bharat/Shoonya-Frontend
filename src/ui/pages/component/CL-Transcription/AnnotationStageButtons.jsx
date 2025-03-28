import React from "react";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import {  useSelector } from "react-redux";


const AnnotationStageButtons = ({
  handleAnnotationClick,
  onNextAnnotation,
  AnnotationsTaskDetails,
  disableBtns,
  disableUpdateButton,
  disableSkipButton,
  filterMessage,
}) => {

 
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);

  let Annotation = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 1
  )[0];


  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, mb: 3, ml: 3 }}>
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
        {!disableUpdateButton &&
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
