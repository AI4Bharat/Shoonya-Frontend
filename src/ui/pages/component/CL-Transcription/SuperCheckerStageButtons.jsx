import React, {
    useRef,
    memo,
    useCallback,
    useEffect,
    useState,
    useMemo,
  } from "react";
  import { Typography, Grid, Tooltip, Button, Alert,MenuItem,Menu } from "@mui/material";
  import { useDispatch, useSelector } from "react-redux";
  import GetTaskAnnotationsAPI from "../../../../redux/actions/api/Tasks/GetTaskAnnotations";
  import APITransport from "../../../../redux/actions/apitransport/apitransport";
  import { useParams } from "react-router-dom";
  import GetNextProjectAPI from "../../../../redux/actions/CL-Transcription/GetNextProject";
  import GetAnnotationsTaskAPI from "../../../../redux/actions/CL-Transcription/GetAnnotationsTask";
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
    reviewNotesValue,
    AnnotationsTaskDetails,
  }) => {
    // const classes = AudioTranscriptionLandingStyle();
    const [annotations, setAnnotations] = useState([]);
    const [disableSkip, setdisableSkip] = useState(false);
    const [filterMessage, setFilterMessage] = useState(null);
    const [disableBtns, setDisableBtns] = useState(false);
    const [disableUpdata, setDisableUpdata] = useState(false);
    const [disableButton,setDisableButton]=useState(false)
    const dispatch = useDispatch();
    const { taskId } = useParams();
  
    const TaskDetails = useSelector((state) => state.getTaskDetails.data);
    const user = useSelector((state) => state.fetchLoggedInUserData.data);
    const getNextTask = useSelector((state) => state.getnextProject.data);
    const ProjectsData = localStorage.getItem("projectData");
    const ProjectData = JSON.parse(ProjectsData);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

      let SuperChecker = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 3
      )[0]

   

    return (
      <>
        <Grid container spacing={1} sx={{ mt: 4, mb: 5,ml:3, }}>
              <Grid item>
                {[4, 5, 6].includes(user.role) && TaskDetails?.super_check_user === user?.id && (
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
                        reviewNotesValue
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
              </Grid>
           
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
         
           
              <Grid item>
                {[4, 5, 6].includes(user.role) &&(
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
                        reviewNotesValue
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
                </Tooltip>)}
              </Grid>
              <Grid item>
                {[4, 5, 6].includes(user.role) && TaskDetails?.super_check_user === user?.id && (
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
                        reviewNotesValue,
                        SuperChecker.parent_annotation

                      )
                    }
                    // disabled={
                    //     ProjectData.revision_loop_count >
                    //     TaskDetails?.revision_loop_count?.super_check_count
                    //       ? false
                    //       : true
                    //   }
                    style={{
                      minWidth: "120px",
                      border: "1px solid gray",
                      color: "rgb(245, 34, 45)",
                      pt: 2,
                      pb: 2,
                    }}
                  >
                    Reject
                  </Button>
                </Tooltip>)}
              </Grid>
              <Grid item>
              {[4, 5, 6].includes(user.role) && TaskDetails?.super_check_user === user?.id && (
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
                onClick={() => handleSuperCheckerClick("validated",SuperChecker.id,
                SuperChecker.lead_time,
                reviewNotesValue,SuperChecker.parent_annotation)}
                disableRipple
              >
                Validated No Changes
              </MenuItem>
              <MenuItem
                onClick={() => handleSuperCheckerClick("validated_with_changes",SuperChecker.id,
                SuperChecker.lead_time,
                reviewNotesValue,SuperChecker.parent_annotation)}
                disableRipple
              >
                Validated with Changes
              </MenuItem>
            </StyledMenu>
              </Grid>
        </Grid>
        {filterMessage && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {filterMessage}
          </Alert>
        )}
      </>
    );
  };
  
  export default SuperCheckerStageButtons;
  