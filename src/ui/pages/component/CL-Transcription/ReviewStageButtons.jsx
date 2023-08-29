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

  const ReviewStageButtons = ({
    handleReviewClick,
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
  const[disableButton,setDisableButton]=useState(false)
    const dispatch = useDispatch();
    const { taskId } = useParams();
  
    const TaskDetails = useSelector((state) => state.getTaskDetails.data);
    const user = useSelector((state) => state.fetchLoggedInUserData.data);
    const getNextTask = useSelector((state) => state.getnextProject.data);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

      let review = AnnotationsTaskDetails.filter(
        (annotation) => annotation.annotation_type === 2
      )[0]


      
   
    
      const filterAnnotations = (
        annotations,
        user,
        setDisableBtns,
        setFilterMessage,
        setDisableButton,
        taskData,
      ) => {
        let filteredAnnotations = annotations;
        let userAnnotation = annotations?.find((annotation) => {
          return annotation.completed_by === user.id && annotation.parent_annotation;
        });
        let disable = false;
        let disableSkip = false;
        let userAnnotationData = annotations?.find(
          (annotation) =>
            annotation.annotation_type === 3
        );
        if (userAnnotation) {
          if (userAnnotation.annotation_status === "unreviewed" &&  localStorage.getItem("labellingMode") === "unreviewed") {
            filteredAnnotations = userAnnotation.result.length > 0 && !taskData?.revision_loop_count?.review_count
              ? [userAnnotation]
              : annotations.filter((annotation) => annotation.id === userAnnotation.parent_annotation && annotation.annotation_type === 1);
          } else if (
            userAnnotation &&
            [
              "rejected"
            ].includes(userAnnotation.annotation_status)
          ) {
            filteredAnnotations = [userAnnotation];
            disableSkip = true;
            setDisableButton(true);
            setFilterMessage("Revise and Skip buttons are disabled, since the task is being validated by the super checker");
          }
          else if (
            userAnnotationData &&
            [
              "draft"
            ].includes(userAnnotation.annotation_status)
          ) {
            filteredAnnotations = [userAnnotation];
            disableSkip = true;
            setDisableButton(true);
            setFilterMessage("Revise and Skip buttons are disabled, since the task is being validated by the super checker");
          }
          else if (userAnnotation.annotation_status === "draft") {
            filteredAnnotations = [userAnnotation];
          } else if (
            [
              "accepted",
              "accepted_with_minor_changes",
              "accepted_with_major_changes",
            ].includes(userAnnotation.annotation_status)
          ) {
            const superCheckedAnnotation = annotations.find(
              (annotation) => annotation.annotation_type === 3
            );
            if (
              superCheckedAnnotation &&
              ["validated", "validated_with_changes"].includes(
                superCheckedAnnotation.annotation_status
              )
            ) {
              filteredAnnotations = [superCheckedAnnotation];
              setFilterMessage(
                "This is the Super Checker's Annotation in read only mode"
              );
              setDisableBtns(true);
              disable = true;
            } else if (
              superCheckedAnnotation &&
              ["draft", "skipped", "unvalidated"].includes(
                superCheckedAnnotation.annotation_status
              )
            ) {
              filteredAnnotations = [userAnnotation];
              setFilterMessage(
                "This task is being validated by the super checker"
              );
              setDisableBtns(true);
              disable = true;
            } else {
              filteredAnnotations = [userAnnotation];
            }
          } else if (userAnnotation.annotation_status === "skipped") {
            filteredAnnotations = annotations.filter(
              (value) => value.annotation_type === 1
            );
          } else if (userAnnotation.annotation_status === "to_be_revised") {
            filteredAnnotations = annotations.filter(
              (annotation) =>
                annotation.id === userAnnotation.parent_annotation &&
                annotation.annotation_type === 1
            );
          } else if (userAnnotation.annotation_status === "rejected") {
            filteredAnnotations = annotations.filter(
              (annotation) => annotation.annotation_type === 2
            );
          }
        } else if ([4, 5, 6].includes(user?.role)) {
          filteredAnnotations = annotations.filter((a) => a.annotation_type === 2);
          disable = true;
          setDisableBtns(true);
          disableSkip = true;
        }
       
        return [filteredAnnotations, disable, disableSkip];
      };
      

useEffect(()=>{
    filterAnnotations(AnnotationsTaskDetails,user,setDisableBtns,setFilterMessage,setDisableButton,TaskDetails)
},[AnnotationsTaskDetails,user,TaskDetails])
    return (
      <>
        <Grid container spacing={1} sx={{ mt: 4, mb: 5,ml:3, }}>
         {!disableBtns && TaskDetails?.review_user === user?.id && (
              <Grid item>
                <Tooltip title="Save task for later">
                  <Button
                    value="Draft"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                        handleReviewClick(
                        "draft",
                        review.id,
                        review.lead_time,
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
                {/* )} */}
              </Grid>)}
           
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
                <Tooltip title="skip to next task">
                  <Button
                    value="Skip"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                        handleReviewClick(
                        "skipped",
                        review.id,
                        review.lead_time,
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
                </Tooltip>
              </Grid>
             { !disableBtns && TaskDetails?.review_user === user?.id && (
              <Grid item>
                <Tooltip title="Revise Annotation">
                  <Button
                    value="to_be_revised"
                    type="default"
                    variant="outlined"
                    onClick={() =>
                        handleReviewClick(
                        "to_be_revised",
                        review.id,
                        review.lead_time,
                        reviewNotesValue
                      )
                    }
                    style={{
                      minWidth: "120px",
                      border: "1px solid gray",
                      color: "rgb(245, 34, 45)",
                      pt: 2,
                      pb: 2,
                    }}
                  >
                    Revise
                  </Button>
                </Tooltip>
              </Grid>)}
              <Grid item>
              {!disableBtns && TaskDetails?.review_user === user?.id && (

              <Tooltip title="Accept Annotation">
                <Button
                  id="accept-button"
                  value="Accept"
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
                  Accept
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
                onClick={() => handleReviewClick("accepted",review.id,
                AnnotationsTaskDetails[1]?.lead_time,
                reviewNotesValue,review.parent_annotation)}
                disableRipple
              >
                with No Changes
              </MenuItem>
              <MenuItem
                onClick={() => handleReviewClick("accepted_with_minor_changes",review.id,
                review.lead_time,
                reviewNotesValue,review.parent_annotation)}
                disableRipple
              >
                with Minor Changes
              </MenuItem>
              <MenuItem
                onClick={() => handleReviewClick("accepted_with_major_changes",review.id,
                review.lead_time,
                reviewNotesValue,review.parent_annotation)}
                disableRipple
              >
                with Major Changes
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
  
  export default ReviewStageButtons;
  