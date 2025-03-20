import React from "react";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
  AnnotationsTaskDetails,
  disableSkip,
  disableBtns,
  filterMessage,
  disableButton,
  anchorEl,
  setAnchorEl,
  // taskData,
}) => {
  // const classes = AudioTranscriptionLandingStyle();
  const { taskId } = useParams();
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  const getNextTask = useSelector((state) => state.getnextProject?.data);
  const taskData = useSelector((state) => state.getTaskDetails?.data);


  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let review = AnnotationsTaskDetails.filter(
    (annotation) => annotation.annotation_type === 2
  )[0];
 

  return (
    <>
      <Grid container spacing={1} sx={{ mt: 2, mb: 3, ml: 3 }}>
        {!disableBtns && taskData?.review_user === user?.id && (
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

        <Grid item>
          {!disableSkip && taskData?.review_user === user?.id && (
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
        {!disableBtns &&
          !disableButton &&
          taskData?.review_user === user?.id && (
            <Grid item>
              <Tooltip title="Revise Annotation">
                <Button
                  value="to_be_revised"
                  type="default"
                  variant="outlined"
                  onClick={() =>
                    handleReviewClick(
                      "to_be_revised",
                      review?.id,
                      review?.lead_time,
                      review?.parent_annotation,
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
            </Grid>
          )}
        <Grid item>
          {!disableBtns && taskData?.review_user === user?.id && (
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
              onClick={() =>
                handleReviewClick(
                  "accepted",
                  review.id,
                  AnnotationsTaskDetails[1]?.lead_time,
                  review?.parent_annotation,
                )
              }
              disableRipple
            >
              with No Changes
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleReviewClick(
                  "accepted_with_minor_changes",
                  review.id,
                  review.lead_time,
                  review?.parent_annotation
                )
              }
              disableRipple
            >
              with Minor Changes
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleReviewClick(
                  "accepted_with_major_changes",
                  review.id,
                  review.lead_time,
                  review?.parent_annotation,
                )
              }
              disableRipple
            >
              with Major Changes
            </MenuItem>
          </StyledMenu>
        </Grid>
      </Grid>
      {filterMessage && (
        <Alert severity="info" sx={{ ml:2,mb: 2,width:"95%" }}>
          {filterMessage}
        </Alert>
      )}
    </>
  );
};

export default ReviewStageButtons;
