import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSelector } from "react-redux";
import "./AnnotationStageButtons.css";

const AnnotationStageButtons = ({
  handleAnnotationClick,
  onNextAnnotation,
  AnnotationsTaskDetails,
  disableBtns,
  disableUpdateButton,
  disableSkipButton,
  filterMessage,
  taskData,
}) => {
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);

  let Annotation = AnnotationsTaskDetails?.filter(
    (annotation) => annotation.annotation_type === 1
  )[0];

  return (
    <div className="annotation-controls">
      <div className="annotation-buttons">
        {!disableBtns &&
          taskData?.annotation_users?.some((users) => users === user?.id) && (
            <Tooltip title="Save task for later" placement="bottom">
              <Button
                value="Draft"
                variant="outlined"
                onClick={() =>
                  handleAnnotationClick(
                    "draft",
                    Annotation?.id,
                    Annotation?.lead_time
                  )
                }
                className="control-btn draft-btn"
              >
                Draft
              </Button>
            </Tooltip>
          )}

        <Tooltip title="Go to next task" placement="bottom">
          <Button
            value="Next"
            variant="outlined"
            onClick={() => onNextAnnotation("next", getNextTask?.id)}
            className="control-btn next-btn"
          >
            Next
          </Button>
        </Tooltip>

        {!disableSkipButton &&
          taskData?.annotation_users?.some((users) => users === user?.id) && (
            <Tooltip title="Skip to next task" placement="bottom">
              <Button
                value="Skip"
                variant="outlined"
                onClick={() =>
                  handleAnnotationClick(
                    "skipped",
                    Annotation?.id,
                    Annotation?.lead_time
                  )
                }
                className="control-btn skip-btn"
              >
                Skip
              </Button>
            </Tooltip>
          )}

        {!disableUpdateButton &&
          taskData?.annotation_users?.some((users) => users === user?.id) && (
            <Tooltip title="Submit task" placement="bottom">
              <Button
                value="Update"
                variant="contained"
                onClick={() =>
                  handleAnnotationClick(
                    "labeled",
                    Annotation?.id,
                    Annotation?.lead_time,
                    taskData?.project_type
                  )
                }
                className="control-btn update-btn"
              >
                Submit
              </Button>
            </Tooltip>
          )}
      </div>

      {filterMessage && (
        <Alert severity="info" sx={{ mt: 1, width: "100%" }}>
          {filterMessage}
        </Alert>
      )}
    </div>
  );
};

export default AnnotationStageButtons;