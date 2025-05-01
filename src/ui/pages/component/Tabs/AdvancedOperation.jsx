import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import {  useParams } from "react-router-dom";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetExportProjectButtonAPI from "../../../../redux/actions/api/ProjectDetails/GetExportProject";
import GetPublishProjectButtonAPI from "../../../../redux/actions/api/ProjectDetails/GetPublishProject";
import GetPullNewDataAPI from "../../../../redux/actions/api/ProjectDetails/PullNewData";
import GetArchiveProjectAPI from "../../../../redux/actions/api/ProjectDetails/ArchiveProject";
import CustomButton from "../../component/common/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DownloadProjectButton from "../../container/Project/DownloadProjectButton";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Spinner from "../../component/common/Spinner";
import TaskReviewsAPI from "../../../../redux/actions/api/ProjectDetails/TaskReviews";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import DeleteProjectTasks from "../../container/Project/DeleteProjectTasks";
import { snakeToTitleCase } from "../../../../utils/utils";
import ExportProjectDialog from "../../component/common/ExportProjectDialog";
import GetProjectTypeDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectTypeDetails";
import getDownloadProjectAnnotationsAPI from "../../../../redux/actions/api/ProjectDetails/getDownloadProjectAnnotations";
import DeallocationAnnotatorsAndReviewers from "../../container/Project/DeallocationAnnotatorsAndReviewers";
import SuperCheckSettings from "../../container/Project/SuperCheckSettings";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import TextField from '@mui/material/TextField';
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";


const ProgressType = [
  "incomplete",
  "annotated",
  "reviewed",
  "super_checked",
  "exported",
];
const projectStage = [{ name: "Annotation Stage", value: 1, disabled: false }, { name: "Review Stage", value: 2, disabled: false }, { name: "Super Check Stage", value: 3, disabled: false }]
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
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const AdvancedOperation = (props) => {
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDetails, setNewDetails] = useState();
  const [OpenExportProjectDialog, setOpenExportProjectDialog] = useState(false);
  const [datasetId, setDatasetId] = useState("");
  const [projectType, setProjectType] = useState("");
  const [taskReviews, setTaskReviews] = useState("")
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const apiMessage = useSelector((state) => state.apiStatus.message);
  const apiError = useSelector((state) => state.apiStatus.error);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const ProjectTypes = useSelector(
    (state) => state.getProjectTypeDetails?.data
  );
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );

  const isSuperChecker =
    ((userRole.WorkspaceManager === loggedInUserData?.role ||
      userRole.OrganizationOwner === loggedInUserData?.role ||
      userRole.Admin === loggedInUserData?.role) ? ProjectDetails?.project_stage == 3 : false ||
    ProjectDetails?.review_supercheckers?.some(
      (superchecker) => superchecker.id === loggedInUserData?.id
    ));

  const [taskStatus, setTaskStatus] = useState(isSuperChecker ? ["incomplete", "annotated", "reviewed", "super_checked", "exported",] : ["incomplete", "annotated", "reviewed", "super_checked", "exported",]);

  let ProgressTypeValue = "super_checked"
  const filterdata = ProgressType.filter(item => item !== ProgressTypeValue)
  const FilterProgressType = isSuperChecker ? ProgressType : filterdata

  const getProjectDetails = () => {
    const projectObj = new GetProjectDetailsAPI(id);
    dispatch(APITransport(projectObj));
  };
  useEffect(() => {
    setProjectType(ProjectTypes.input_dataset?.class)
  }, [ProjectTypes])

  useEffect(() => {
    getProjectDetails();
  }, []);

  useEffect(() => {
    setNewDetails({
      title: ProjectDetails.title,
      description: ProjectDetails.description,
    });
    setTaskReviews(ProjectDetails.project_stage)
  }, [ProjectDetails]);

  useEffect(() => {
    const typesObj = new GetProjectTypeDetailsAPI(ProjectDetails?.project_type);
    dispatch(APITransport(typesObj));
  }, []);


  const getExportProjectButton = async () => {
    setOpenExportProjectDialog(false);
    const projectObj =
      ProjectTypes?.output_dataset?.save_type === "new_record"
        ? new GetExportProjectButtonAPI(
          id,
          ProjectDetails?.datasets[0].instance_id,
          datasetId,
          ProjectTypes?.output_dataset?.save_type
        )
        : new GetExportProjectButtonAPI(id);
    //dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getDownloadProjectAnnotations = async () => {
    const projectObj = new getDownloadProjectAnnotationsAPI(id, taskStatus);
    dispatch(APITransport(projectObj));
  }

  const handleReviewToggle = async (e) => {
    let ProjectStageValue = e.target.value
    setTaskReviews(e.target.value)

    if (ProjectStageValue === 1) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 3) opt.disabled = true;
        else opt.disabled = false;
        return opt;
      })

      setTaskReviews(disableSuperchecker);
    }
    else if (ProjectStageValue === 2) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 3) opt.disabled = false;
        else opt.disabled = false;
        return opt;

      });

      setTaskReviews(disableSuperchecker);
    }
    else if (ProjectStageValue === 3) {
      const disableSuperchecker = [...projectStage].map((opt) => {
        if (opt.value === 1) opt.disabled = true;
        else opt.disabled = false;
        return opt;

      });

      setTaskReviews(disableSuperchecker);
    }

    setLoading(true);
    const reviewObj = new TaskReviewsAPI(id, e.target.value);
    const res = await fetch(reviewObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(reviewObj.getBody()),
      headers: reviewObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      const projectObj = new GetProjectDetailsAPI(id);
      dispatch(APITransport(projectObj));
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleDownoadMetadataToggle = async () => {
    // setLoading(true);
    setDownloadMetadataToggle((downloadMetadataToggle) => !downloadMetadataToggle)
  };

  const getPublishProjectButton = async () => {
    const projectObj = new GetPublishProjectButtonAPI(id);
    //dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getPullNewDataAPI = async () => {
    const projectObj = new GetPullNewDataAPI(id);
    //dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const ArchiveProject = useSelector((state) => state.getArchiveProject.data);
  const [isArchived, setIsArchived] = useState(false);
  const [downloadMetadataToggle, setDownloadMetadataToggle] = useState(true)
  const getArchiveProjectAPI = () => {
    const projectObj = new GetArchiveProjectAPI(id);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    setIsArchived(ProjectDetails?.is_archived);
  }, [ProjectDetails]);

  const handleDownloadProjectAnnotations = () => {
    getDownloadProjectAnnotations();
  };
  const handleExportProject = () => {
    getExportProjectButton();
  };
  const handlePublishProject = () => {
    getPublishProjectButton();
  };

  const handlePullNewData = () => {
    getPullNewDataAPI();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenExportProjectDialog(false);
  };

  const handleok = () => {
    getArchiveProjectAPI();
    getProjectDetails()
    setIsArchived(!isArchived);
    setOpen(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setTaskStatus(value);
  };

  const handleOpenExportProjectDialog = () => {
    setOpenExportProjectDialog(true);
  };

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);


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

  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      handleok();
    } else {
      window.alert("Invalid credentials, please try again");
    }
  };
  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid>{renderSnackBar()}</Grid>

      <div className={classes.rootdiv}>
        <Grid
          container
          columns={16}
          justifyContent="space-between"
          alignItems="flex-start"
        >
        <Grid
          container
          xs={12}
          sm={3}
          gap={4}
        >
          <Grid item xs={12}>
            <CustomButton
              sx={{
                borderRadius: 3,
                width: "100%",
              }}
              onClick={handlePublishProject}
              label="Publish Project"
            />
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              sx={{
                borderRadius: 3,
                width: "100%",
              }}
              color="error"
              onClick={handleClickOpen}
              label={isArchived ? "Archived" : "Archive"}
              disabled ={userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role?true:false}
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
          {userRole.WorkspaceManager === loggedInUserData?.role ? null :
            <FormControl size="small" sx={{ width : "100%" }}>
              <InputLabel
                id="Select-Task-Statuses"
                sx={{ fontSize: "16px", padding: "3px" }}
              >
                Select Task Statuses
              </InputLabel>
              <Select
                labelId="Select-Task-Statuses"
                label="Select Task Statuses"
                multiple
                value={taskStatus}
                onChange={handleChange}
                renderValue={(taskStatus) => taskStatus.join(", ")}
                MenuProps={MenuProps}
              >
                {FilterProgressType.map((option) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={option}
                    value={option}
                  >
                    <ListItemIcon>
                      <Checkbox checked={taskStatus.indexOf(option) > -1} />
                    </ListItemIcon>
                    <ListItemText primary={snakeToTitleCase(option)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>}
          </Grid>
        </Grid>

        <Grid
          container
          xs={12}
          sm={4}
          gap={4}
          sx={{
            mt:{ 
              xs : 4, 
              sm : 0
            },
          }}
        >
          {ProjectDetails.project_type == 'ContextualTranslationEditing' ? (
            <Grid
              item
              xs={12}
            >
              <CustomButton
                sx={{
                  borderRadius: 3,
                  width: "100%",
                }}
                onClick={handleDownloadProjectAnnotations}
                label="Downoload Project Annotations" />
            </Grid>) : " "}
          <Grid item xs={12}>
            {ProjectTypes?.output_dataset?.save_type === "new_record" ? (
              <CustomButton
                sx={{
                  borderRadius: 3,
                  width: "100%",
                }}
                onClick={handleOpenExportProjectDialog}
                label="Export Project into Dataset"
                disabled={userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role  ? true : false}

              />
            ) : (
              <CustomButton
                sx={{
                  borderRadius: 3,
                  width: "100%",
                }}
                onClick={handleExportProject}
                label="Export Project into Dataset"
                disabled={userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role  ? true : false}

              />
            )}
          </Grid>

          <Grid item xs={12}>
            {ProjectDetails.sampling_mode == "f" || ProjectDetails.sampling_mode == "b" ? (
              <CustomButton
                sx={{
                  borderRadius: 3,
                  width: "100%",
                }}
                onClick={handlePullNewData}
                label="Pull New Data Items from Source Dataset"
                disabled={userRole.WorkspaceManager === loggedInUserData?.role ? true : false}
              />
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12}>
            <DownloadProjectButton
              taskStatus={taskStatus}
              SetTask={setTaskStatus}
              downloadMetadataToggle={downloadMetadataToggle}
            />
          </Grid>
          <Grid item xs={12}>
            <DeleteProjectTasks />
          </Grid>
          <Grid item xs={12}>
            <DeallocationAnnotatorsAndReviewers />
          </Grid>

        </Grid>

        <Grid
          container
          xs={12}
          sm={3}
          gap={4}
          sx={{
            marginTop:{
              xs : 4,
              sm : 0
            }
          }}
        >
          <Grid item xs={12}>
              <FormControl size="small" sx={{ width : "100%" }}>
                <InputLabel id="task-Reviews-label" sx={{ fontSize: "16px" }}>
                  Project Stage
                </InputLabel>
                <Select
                  labelId="task-Reviews-label"
                  id="task-Reviews-select"
                  value={taskReviews}
                  label="Task Reviews"
                  onChange={handleReviewToggle}
                  disabled ={userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role ?true:false}
                >
                  {projectStage.map((type, index) => (
                    <MenuItem value={type.value} key={index} disabled={type.disabled} >
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
          </Grid>

          {((userRole.WorkspaceManager === loggedInUserData?.role ||
            userRole.OrganizationOwner === loggedInUserData?.role ||
            userRole.Admin === loggedInUserData?.role) ? ProjectDetails?.project_stage == 3 : false ||
          ProjectDetails?.review_supercheckers?.some(
            (superchecker) => superchecker.id === loggedInUserData?.id
          )) &&
            <Grid item xs={12}>
              <SuperCheckSettings ProjectDetails={ProjectDetails} />
            </Grid>}
        </Grid>
        </Grid>




        <Grid
          container
          // direction="row"
          xs={12}
          md={12}
          lg={4}
          xl={4}
          sm={12}
          spacing={1}
          rowGap={2}
          columnSpacing={2}
          sx={{ mt: 1 }}
        >
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to {!isArchived ? "archive" : "unarchive"}{" "}
              this project?
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}
              variant="outlined"
              color="error">Cancel</Button>
            <Button onClick={handleConfirm}
              variant="contained"
              color="error"
              autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
        {OpenExportProjectDialog && (
          <ExportProjectDialog
            OpenExportProjectDialog={OpenExportProjectDialog}
            datavalue={getExportProjectButton}
            datasetId={datasetId}
            setDatasetId={setDatasetId}
            projectType={projectType}
            handleClose={handleClose}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default AdvancedOperation;
