import React, { useState } from "react";
import CustomButton from "../../component/common/Button";
import {
  Button, Popover,Box,Grid,Typography,Radio,Select,MenuItem,Dialog, DialogActions, DialogContent, DialogContentText,  Checkbox,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import DatasetStyle from "../../../styles/Dataset";
import { translate } from "../../../../config/localisation";
import { useDispatch, useSelector } from "react-redux";
import {useParams } from 'react-router-dom';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { snakeToTitleCase } from "../../../../utils/utils";
import DeallocationAnnotatorsAndReviewersAPI from "../../../../redux/actions/api/ProjectDetails/DeallocationAnnotatorsAndReviewers";
import CustomizedSnackbars from "../../component/common/Snackbar";



let AnnotationStatus = [
  "unlabeled",
  "skipped",
  "draft",
  "labeled",
  "to_be_revised",
];

let ReviewStatus =  [
    "unreviewed",
    "accepted",
    "accepted_with_minor_changes",
    "accepted_with_major_changes",
    "to_be_revised",
    "draft",
    "skipped",
  ];

  let SuperChecker = ["unvalidated","validated","validated_with_changes","skipped","draft","rejected"];
  const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};
export default function DeallocationAnnotatorsAndReviewers() {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const {id} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [radiobutton, setRadiobutton] = useState("annotation");
  const [openDialog, setOpenDialog] = useState(false);
  const[annotatorsUser,setAnnotatorsUser] = useState("")
  const[annotationStatus,setAnnotationStatus] = useState([])
  const[reviewerssUser,setReviewersUser] = useState("")
  const[superCheckersUser,setSuperCheckersUser] = useState("")
  const[reviewStatus,setReviewStatus] = useState([])
  const[superCheckStatus,setSuperCheckStatus] = useState([])
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
});




  const open = Boolean(anchorEl);
  const Id = open ? "simple-popover" : undefined;

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);
  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  console.log(radiobutton,"radiobuttonradiobutton")

  const handleClose = () => {
    setAnchorEl(null);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
  };

  const handleAnnotation = () => {
    setRadiobutton("annotation");
  };
  const handleReview = () => {
    setRadiobutton("review");
  };
  const handlesuperChecker = () => {
    setRadiobutton("superChecker");
  };

  const handleSubmit = () => {
    setAnchorEl(null);
    setOpenDialog(true);
}

const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
};

const handleChangeAnnotationStatus = (event) => {
    const value = event.target.value;
    setAnnotationStatus(value);
  };

  const handleChangeReviewStatus = (event) =>{
    const value = event.target.value;
    setReviewStatus(value);
  }
  const handleChangeSuperCheckerStatus = (event) =>{
    const value = event.target.value;
    setSuperCheckStatus(value);
  }

  

const handleok = async() => {
    setAnchorEl(null);
    setOpenDialog(false);
    setAnnotatorsUser("")
    setAnnotationStatus([])
    setReviewersUser("")
    setReviewStatus([])
    setSuperCheckersUser("")
    setSuperCheckStatus([])
    const projectObj = new DeallocationAnnotatorsAndReviewersAPI(id,radiobutton,annotatorsUser,reviewerssUser,annotationStatus,reviewStatus,superCheckersUser,superCheckStatus);
    // dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
        method: "GET",
        body: JSON.stringify(projectObj.getBody()),
        headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    // setLoading(false);
    if (res.ok) {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "success",
        })
       
    } else {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
        })
    }
}

console.log(ProjectDetails,"ProjectDetailsProjectDetails")

const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <div>
        {renderSnackBar()}
      <CustomButton
        sx={{
          inlineSize: "max-content",
          p: 2,
          borderRadius: 3,
          ml: 2,
          width: "300px",
          mb: 2,
        }}
        onClick={handleClickOpen}
        label="Deallocate User Tasks"
        color="error"
      />

      <Popover
        Id={Id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid container className={classes.root}>
          <Grid item style={{ flexGrow: "1", padding: "10px" }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                defaultValue="annotation"
              >
                <FormControlLabel
                  value="annotation"
                  control={<Radio />}
                  label="Annotators"
                  onClick={handleAnnotation}
                />
                <FormControlLabel
                  value="review"
                  control={<Radio />}
                  label="Reviewers"
                  onClick={handleReview}
                />
                <FormControlLabel
                  value="superChecker"
                  control={<Radio />}
                  label="Super Check"
                  onClick={handlesuperChecker}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {radiobutton === "annotation" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={annotatorsUser}
                    onChange={(e) => setAnnotatorsUser(e.target.value)}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    {ProjectDetails?.annotators?.map((el, i) => {
                      return <MenuItem value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select Annotation Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small">

                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={annotationStatus}
                onChange={handleChangeAnnotationStatus}
                renderValue={(annotationStatus) => annotationStatus.join(", ")}
                MenuProps={MenuProps}
               
              >
                {AnnotationStatus.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                  
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        {radiobutton === "review" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={reviewerssUser}
                     onChange={(e) => setReviewersUser(e.target.value)}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    {ProjectDetails?.annotation_reviewers.map((el, i) => {
                      return <MenuItem value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select Review Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small">
                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={reviewStatus}
                onChange={handleChangeReviewStatus}
                renderValue={(reviewStatus) => reviewStatus.join(", ")}
                MenuProps={MenuProps}
               
              >
                {ReviewStatus.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}

   {radiobutton === "superChecker" && (
          <>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select User:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small">
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={superCheckersUser}
                     onChange={(e) => setSuperCheckersUser(e.target.value)}
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    {ProjectDetails?.review_supercheckers.map((el, i) => {
                      return <MenuItem value={el.id}>{el.username}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              sx={{
                alignItems: "center",
                p: 1,
                width:"350px"
              }}
            >
              <Grid items xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body2" fontWeight="700" label="Required">
                  Select Super Check Status :
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth size="small">
                <Select
                labelId="Select-Task-Statuses"
                multiple
                value={superCheckStatus}
                onChange={handleChangeSuperCheckerStatus}
                renderValue={(superCheckStatus) => superCheckStatus.join(", ")}
                MenuProps={MenuProps}
               
              >
                {SuperChecker.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    {/* <ListItemIcon>
                      <Checkbox checked={annotationStatus.indexOf(option) > -1} />
                    </ListItemIcon> */}
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            {translate("button.clear")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            {translate("button.submit")}
          </Button>
        </Box>
      </Popover>

      <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                    Are you sure want to Deallocate User Tasks ? 
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn} > {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button onClick={handleok}
                        variant="contained"
                        color="primary"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
    </div>
  );
}
