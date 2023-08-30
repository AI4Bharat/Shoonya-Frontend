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
  disableBtns,
  disableUpdata,
  disableSkip,
  filterMessage,
}) => {
  // const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
  const { taskId } = useParams();

  const TaskDetails = useSelector((state) => state.getTaskDetails?.data);
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  let Annotation = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 1
  )[0];

  return (
    <>
      <Grid container spacing={1} sx={{ mt: 4, mb: 5, ml: 3 }}>
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
