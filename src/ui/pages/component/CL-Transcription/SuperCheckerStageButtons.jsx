import React from "react";
import {
  Typography,
  Grid,
  Tooltip,
  Button,
  Alert,
  MenuItem,
  Menu,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled, alpha } from "@mui/material/styles";

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

const SuperCheckerStageButtons = ({
  handleSuperCheckerClick,
  onNextAnnotation,
  AnnotationsTaskDetails,
  disableSkip,
  anchorEl,
  setAnchorEl,
  filterMessage,
  disableBtns,
  // taskData,
}) => {
  // const classes = AudioTranscriptionLandingStyle();
  const dispatch = useDispatch();
 

  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const ProjectsData = localStorage.getItem("projectData");
  const ProjectData = JSON.parse(ProjectsData);
  const taskData = useSelector((state) => state.getTaskDetails?.data);


  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let SuperChecker = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 3
  )[0];

  return (
    <>
      <div>
        {ProjectData.revision_loop_count >
        taskData?.revision_loop_count?.super_check_count
          ? false
          : true && (
              <div
                style={{
                  textAlign: "left",
                  marginBottom: "5px",
                  marginLeft: "40px",
                  marginTop: "5px",
                }}
              >
                <Typography variant="body" color="#f5222d">
                  Note: The 'Revision Loop Count' limit has been reached for
                  this task.
                </Typography>
              </div>
            )}

        {ProjectData.revision_loop_count -
          taskData?.revision_loop_count?.super_check_count !==
          0 && (
          <div
            style={{ textAlign: "left", marginLeft: "40px", marginTop: "8px" }}
          >
            <Typography variant="body" color="#f5222d">
              Note: This task can be rejected{" "}
              {ProjectData.revision_loop_count -
                taskData?.revision_loop_count?.super_check_count}{" "}
              more times.
            </Typography>
          </div>
        )}
      </div>

      <Grid container spacing={1} sx={{ mt: 2, mb: 5, ml: 3 }}>
       {!disableBtns && <Grid item>
          {taskData?.super_check_user === user?.id && (
            <Tooltip title="Save task for later">
              <Button
                value="Draft"
                type="default"
                variant="outlined"
                onClick={() =>
                  handleSuperCheckerClick(
                    "draft",
                    SuperChecker.id,
                    SuperChecker.lead_time,
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
          )}
        </Grid>}

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

        {!disableBtns && <>
          <Grid item>
            {!disableSkip && taskData?.super_check_user === user?.id && (
              <Tooltip title="skip to next task">
                <Button
                  value="Skip"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleSuperCheckerClick(
                      "skipped",
                      SuperChecker.id,
                      SuperChecker.lead_time,
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
            )}
          </Grid>
          <Grid item>
            {taskData?.super_check_user === user?.id && (
              <Tooltip title="Reject">
                <Button
                  value="rejected"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleSuperCheckerClick(
                      "rejected",
                      SuperChecker.id,
                      SuperChecker.lead_time,
                      SuperChecker.parent_annotation
                    )
                  }
                  disabled={
                    ProjectData.revision_loop_count >
                    taskData?.revision_loop_count?.super_check_count
                      ? false
                      : true
                  }
                  style={{
                    minWidth: "120px",
                    border: "1px solid gray",
                    color: (
                      ProjectData.revision_loop_count >
                      taskData?.revision_loop_count?.super_check_count
                        ? false
                        : true
                    )
                      ? "#B2BABB"
                      : "#f5222d",
                    pt: 2,
                    pb: 2,
                  }}
                >
                  Reject
                </Button>
              </Tooltip>
            )}
          </Grid>
          <Grid item>
            {taskData?.super_check_user === user?.id && (
              <Tooltip title="Validate">
                <Button
                  id="accept-button"
                  value="Validate"
                  type="default"
                  aria-controls={open ? "accept-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  style={{
                    minWidth: "120px",
                    border: "1px solid gray",
                    color: "#52c41a",
                    pt: 3,
                    pb: 3,
                  }}
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                >
                  Validate
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
                onClick={() =>
                  handleSuperCheckerClick(
                    "validated",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                    SuperChecker.parent_annotation
                  )
                }
                disableRipple
              >
                Validated No Changes
              </MenuItem>
              <MenuItem
                onClick={() =>
                  handleSuperCheckerClick(
                    "validated_with_changes",
                    SuperChecker.id,
                    SuperChecker.lead_time,
                    SuperChecker.parent_annotation
                  )
                }
                disableRipple
              >
                Validated with Changes
              </MenuItem>
            </StyledMenu>
          </Grid>
        </>}
      </Grid>
      {filterMessage && (
        <Alert severity="info" sx={{ ml:2,mb: 2,width:"95%" }}>
          {filterMessage}
        </Alert>
      )}
    </>
  );
};

export default SuperCheckerStageButtons;
