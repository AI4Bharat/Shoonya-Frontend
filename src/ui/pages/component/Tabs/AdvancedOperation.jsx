import {
  Grid,
  ThemeProvider,
  Select,
  Box,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  ListItemIcon,
  Card,
  IconButton,
  Typography,
  Popover
} from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link, useNavigate, useParams } from "react-router-dom";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetExportProjectButtonAPI from "../../../../redux/actions/api/ProjectDetails/GetExportProject";
import GetPublishProjectButtonAPI from "../../../../redux/actions/api/ProjectDetails/GetPublishProject";
import GetLanguageChoicesAPI from "../../../../redux/actions/api/ProjectDetails/GetLanguageChoices";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
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
import ProjectPermission from "../../../../redux/actions/api/ProjectDetails/ProjectPermission";
import EditProjectPermission from "../../../../redux/actions/api/ProjectDetails/editProjectPermission";


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
  const [anchorEl, setAnchorEl] = useState(null);
  const [newDetails, setNewDetails] = useState();
  const [OpenExportProjectDialog, setOpenExportProjectDialog] = useState(false);
  const [category ,setcategory] = useState()
  const [datasetId, setDatasetId] = useState("");
  const [projectType, setProjectType] = useState("");
  const [taskReviews, setTaskReviews] = useState("")
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const permissionList = useSelector((state) => state.ProjectPermission.data);
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
  const [view, setview] = useState();
  const [use, setuse] = useState();

 const viewPermissions = permissionList?.permission?.can_view_supercheck_settings || [];
 const usePermissions = permissionList?.permission?.can_use_supercheck_settings || [];
 const [selectedOptions, setSelectedOptions] = useState({
  view: viewPermissions,
  use: usePermissions
 });
 const [publishPopoverOpen, setPublishPopoverOpen] = useState(false);

const [archivePopoverOpen, setArchivePopoverOpen] = useState(false);

const [exportPopoverOpen, setExportPopoverOpen] = useState(false);

const [stagePopoverOpen, setStagePopoverOpen] = useState(false);

const [PullPopoverOpen, setPullPopoverOpen] = useState(false);

 const [anchorElPublish, setAnchorElPublish] = useState(null);
 const [anchorElArchive, setAnchorElArchive] = useState(null);
 const [anchorElExport, setAnchorElExport] = useState(null);
 const [anchorElProjectStage, setAnchorElProjectStage] = useState(null);
 const [anchorElPull, setAnchorElPull] = useState(null);

 
 const openPublishPopover = Boolean(anchorElPublish);
 const openArchivePopover = Boolean(anchorElArchive);
 const openExportPopover = Boolean(anchorElExport);
 const openPullPopover = Boolean(anchorElPull);
 const openProjectStagePopover = Boolean(anchorElProjectStage);
 
 const publishPopoverId = openPublishPopover ? 'publish-popover' : undefined;
 const archivePopoverId = openArchivePopover ? 'archive-popover' : undefined;
 const exportPopoverId = openExportPopover ? 'export-popover' : undefined;
 const PullPopoverId = openPullPopover ? 'pull-popover' : undefined;
 const projectStagePopoverId = openProjectStagePopover ? 'project-stage-popover' : undefined;
 
 const handlePublishPopoverOpen = (event) => {
  setPublishPopoverOpen(true)
   setAnchorElPublish(event.currentTarget);
 };
 const handlePublishPopoverClose = () => {
  setPublishPopoverOpen(false);
  setAnchorElPublish(null);
  const viewPermissions = permissionList?.permission?.can_view_publish_project || [];
  const usePermissions = permissionList?.permission?.can_use_publish_project || [];    
  setSelectedOptions({  view: viewPermissions,
    use: usePermissions
 });
 };
 
 const handlePullPopoverOpen = (event) => {
  setPullPopoverOpen(true)
   setAnchorElPull(event.currentTarget);
 };
 const handlePullPopoverClose = () => {
  setPullPopoverOpen(false);
  setAnchorElPull(null);
  const viewPermissions = permissionList?.permission?.can_view_publish_project || [];
  const usePermissions = permissionList?.permission?.can_use_publish_project || [];    
  setSelectedOptions({  view: viewPermissions,
    use: usePermissions
 });
 };
 

 const handleArchivePopoverOpen = (event) => {
  setArchivePopoverOpen(true)
   setAnchorElArchive(event.currentTarget);
 };
 const handleArchivePopoverClose = () => {
  setArchivePopoverOpen(false)
  setAnchorElArchive(null);
  const viewPermissions = permissionList?.permission?.can_view_archive_project || [];
  const usePermissions = permissionList?.permission?.can_use_archive_project || [];    
  setSelectedOptions({  view: viewPermissions,
    use: usePermissions
 });
 };
 
 const handleExportPopoverOpen = (event) => {
  setExportPopoverOpen(true)
  setAnchorElExport(event.currentTarget);

 };
 const handleExportPopoverClose = () => {
   setArchivePopoverOpen(false);
   setAnchorElExport(null);
  const viewPermissions = permissionList?.permission?.can_view_export_project_into_dataset || [];
  const usePermissions = permissionList?.permission?.can_use_export_project_into_dataset || [];    
  setSelectedOptions({  view: viewPermissions,
    use: usePermissions
 });
 };
 
 const handleProjectStagePopoverOpen = (event) => {
  setStagePopoverOpen(true)
   setAnchorElProjectStage(event.currentTarget);
 };
 const handleProjectStagePopoverClose = () => {
  setStagePopoverOpen(false)
   setAnchorElProjectStage(null);
   const viewPermissions = permissionList?.permission?.can_view_project_stage || [];
   const usePermissions = permissionList?.permission?.can_use_project_stage || [];    
   setSelectedOptions({  view: viewPermissions,
     use: usePermissions
  });
 };
 
 const handleCheckboxChange = (name, checked, roleNumber) => {
  setSelectedOptions((prevOptions) => {
    const updatedOptions = { ...prevOptions }; 
    if (name === 'view') {
      
      const updatedViewRoles = checked 
        ? updatedOptions[view]?.push(roleNumber)
        : prevOptions?.view?.filter((role) => role !== roleNumber); 
      return {
        ...prevOptions,
        view: updatedViewRoles
      };
    } else if (name === 'use') {
      const updatedUseRoles = checked
        ? updatedOptions[use]?.push(roleNumber)
        : prevOptions?.use?.filter((role) => role !== roleNumber); 
      
      return {
        ...prevOptions,
        use: updatedUseRoles
      };
    }
    return prevOptions;
  });
};


const handleApply = (name) => {
    const obj = new EditProjectPermission(`can_${name}_download_project`,selectedOptions?.view);
    dispatch(APITransport(obj));
};


useEffect(() => {
  if (permissionList && permissionList?.permission) {
      setview(permissionList?.permission?.can_view_supercheck_settings);
      setuse(permissionList?.permission?.can_use_supercheck_settings);
      const viewPermissions = permissionList?.permission?.can_view_supercheck_settings || [];
  const usePermissions = permissionList?.permission?.can_use_supercheck_settings || [];
  setSelectedOptions({
    view: viewPermissions,
    use: usePermissions
  });
  }
}, [permissionList]);
const canViewDownloadButton = (roleId) => {
return view && view.includes(roleId);
};
const canUseDownloadButton = (roleId) => {
return use && use.includes(roleId);
};



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
    const projectObj1 = new ProjectPermission();
    dispatch(APITransport(projectObj1))
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
    // 'https://backend.shoonya.ai4bharat.org/projects/606/export_project_tasks/'
    // SetTask([])
    // setLoading(true)
    const projectObj = new getDownloadProjectAnnotationsAPI(id, taskStatus);
    dispatch(APITransport(projectObj));
    // const projectObj = new GetPublishProjectButtonAPI(id);
    // const res = await fetch(projectObj.apiEndPoint(), {
    //   method: "POST",
    //   body: JSON.stringify(projectObj.getBody()),
    //   headers: projectObj.getHeaders().headers,
    // });
    // const resp = await res.json();
    // setLoading(false);
    // if (res.ok) {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "success",
    //   });
    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   });
    // }


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

  // useEffect(() => {
  //     setSnackbarInfo({
  //         open: apiMessage ? true : false,
  //         variant: apiError ? "error" : "success",
  //         message: apiMessage,
  //     });
  //     setSpinner(false);
  // }, [apiMessage, apiError])

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
      console.log(rsp_data);
    }
  };
  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid>{renderSnackBar()}</Grid>

      <div className={classes.rootdiv}>
        <Grid
          container
          // direction="row"
          direction="column"
          xs={12}
          md={12}
          lg={4}
          xl={4}
          sm={12}
          spacing={1}
          rowGap={2}
          sx={{ float: "left" }}
          columnSpacing={2}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" alignItems="center">

            <CustomButton
              sx={{
                inlineSize: "max-content",
                pl: 2,
                borderRadius: loggedInUserData?.role === 6? "8px 0 0 8px" : 3,
                ml: 2,
                width: "300px",
              }}
              onClick={canUseDownloadButton(loggedInUserData?.role) ? handlePublishProject : null}
              disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
              label="Publish Project"
            />
                        {loggedInUserData?.role === 6 ?(
              <IconButton
                    color="primary"
                    onClick={(event) => handlePublishPopoverOpen(event, "publish")}   
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>):null}
            </Box>
          </Grid>
          
<Popover
  id={publishPopoverId}
  open={openPublishPopover}
  anchorEl={anchorElPublish}
  onClose={handlePublishPopoverClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
  <Box sx={{ p: 2 }}>
        <Typography variant="h6">View</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handlePublishPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("view")}>
                Apply View
            </Button>
        </Box>

        {/* Use Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handlePublishPopoverOpen}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
    </Box>

</Popover>

          

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Box display="flex" alignItems="center">
            <CustomButton
              sx={{
                inlineSize: "max-content",
                p: 2,
                borderRadius: loggedInUserData?.role === 6? "8px 0 0 8px" : 3,
                ml: 2,
                width: "300px",
              }}
              color="error"
              onClick={canUseDownloadButton(loggedInUserData?.role) ? handleClickOpen : null}
              label={isArchived ? "Archived" : "Archive"}
              disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}             />
                         {loggedInUserData?.role === 6 ?(
                          <IconButton
                    color="primary"
                    onClick={handleArchivePopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>):null}
            </Box>
          </Grid>
          <Popover
   id={archivePopoverId}
   open={openArchivePopover}
   anchorEl={anchorElArchive}
   onClose={handleArchivePopoverClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
<Box sx={{ p: 2 }}>
        {/* View Section */}
        <Typography variant="h6">View</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleArchivePopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("view")}>
                Apply View
            </Button>
        </Box>

        {/* Use Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleArchivePopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
    </Box>

</Popover>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ ml: 2, height: "20px", mb: 2 }}
          >
                        {userRole.WorkspaceManager === loggedInUserData?.role ? null :
<FormControl size="small" className={classes.formControl}>
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
          // direction="row"
          xs={12}
          md={12}
          lg={4}
          xl={4}
          sm={12}
          spacing={1}
          rowGap={2}
          sx={{ float: "left" }}
          columnSpacing={2}
        >
          {ProjectDetails.project_type == 'ContextualTranslationEditing' ? (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}

            >
              <CustomButton
                sx={{
                  inlineSize: "max-content",
                  p: 2,
                  borderRadius: "8px 0 0 8px",
                  ml: 2,
                  width: "300px",

                }}
                onClick={handleDownloadProjectAnnotations}
                label="Downoload Project Annotations" />
            </Grid>) : " "}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectTypes?.output_dataset?.save_type === "new_record" ? (
                        <Box display="flex" alignItems="center">

              <CustomButton
                sx={{
                  inlineSize: "max-content",
                  p: 2,
                  borderRadius: loggedInUserData?.role === 6? "8px 0 0 8px" : 3,
                  ml: 2,
                  width: "300px",
                }}
                disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
                onClick={canUseDownloadButton(loggedInUserData?.role) ? handleOpenExportProjectDialog : null}
                label="Export Project into Dataset"

              />
               <IconButton
                    color="primary"
                    onClick={handleExportPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            ) : (
              <Box display="flex" alignItems="center">

              <CustomButton
                sx={{
                  inlineSize: "max-content",
                  p: 2,
                  borderRadius: "8px 0 0 8px",
                  ml: 2,
                  width: "300px",
                }}
                onClick={handleExportProject}
                label="Export Project into Dataset"
                disabled={userRole.WorkspaceManager === loggedInUserData?.role ? true : false}

              />
               <IconButton
                    color="primary"
                    onClick={handleExportPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            )}
            <Popover
 id={exportPopoverId}
 open={openExportPopover}
 anchorEl={anchorElExport}
 onClose={handleExportPopoverClose}
   anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
<Box sx={{ p: 2 }}>
        {/* View Section */}
        <Typography variant="h6">View</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleExportPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("view")}>
                Apply View
            </Button>
        </Box>

        {/* Use Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleExportPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
    </Box>
</Popover>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {ProjectDetails.sampling_mode == "f" || ProjectDetails.sampling_mode == "b" ? (
            <Box display="flex" alignItems="center">

              <CustomButton
                sx={{
                  inlineSize: "max-content",
                  p: 2,
                  borderRadius: "8px 0 0 8px",
                  ml: 2,
                  width: "300px",
                }}
                onClick={canUseDownloadButton(loggedInUserData?.role) ? handlePullNewData : null}
                label="Pull New Data Items from Source Dataset"
                disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
              />
              {loggedInUserData?.role === 6 ?(
              <IconButton
                    color="primary"
                    onClick={handlePullPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>)
                :null}
            </Box>
            ) : (
              " "
            )}
            
          </Grid>
          <Popover
    id={PullPopoverId}
    open={PullPopoverOpen}
    anchorEl={anchorElPull}
    onClose={handlePullPopoverClose}
    anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}
>
    <Box sx={{ p: 2 }}>
        {/* View Section */}
        <Typography variant="h6">View</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handlePullPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("view")}>
                Apply View
            </Button>
        </Box>

        {/* Use Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handlePullPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
    </Box>
</Popover>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DownloadProjectButton
              taskStatus={taskStatus}
              SetTask={setTaskStatus}
              downloadMetadataToggle={downloadMetadataToggle}
              permissionList={permissionList}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeleteProjectTasks permissionList={permissionList}/>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <DeallocationAnnotatorsAndReviewers permissionList={permissionList}/>
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
          sx={{ mb: "10px" }}
        >
          {/* <div className={classes.divider} ></div> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Task Reviews"
              labelPlacement="start"
              checked={ProjectDetails.enable_task_reviews}
              onChange={handleReviewToggle}
            />
          </Grid> */}
           {userRole.Admin === loggedInUserData?.role  ||
            userRole.OrganizationOwner === loggedInUserData?.role?<Grid item xs={12} sm={12} md={12} lg={12} xl={12}
            sx={{ ml: 2 }}
          >
                                        <Box display="flex" alignItems="center">

              <FormControl size="small" className={classes.formControl}>
                <InputLabel id="task-Reviews-label" sx={{ fontSize: "16px" }}>
                  Project Stage
                </InputLabel>
                <Select
                  labelId="task-Reviews-label"
                  id="task-Reviews-select"
                  value={taskReviews}
                  label="Task Reviews"
                  onChange={handleReviewToggle}
                // getOptionDisabled={(option) => option.disabled}
                >
                  {projectStage.map((type, index) => (
                    <MenuItem value={type.value} key={index} disabled={type.disabled} >
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                    color="primary"
                    onClick={handleProjectStagePopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
          </Grid>:null}
          <Popover
 id={projectStagePopoverId}
 open={openProjectStagePopover}
 anchorEl={anchorElProjectStage}
 onClose={handleProjectStagePopoverClose}  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
>
<Box sx={{ p: 2 }}>
        {/* View Section */}
        <Typography variant="h6">View</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleProjectStagePopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("view")}>
                Apply View
            </Button>
        </Box>

        {/* Use Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.flat(Infinity).includes(4)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 4)}
                />
            }
            label="Manager"
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleProjectStagePopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
    </Box>

</Popover>

          {((userRole.WorkspaceManager === loggedInUserData?.role ||
            userRole.OrganizationOwner === loggedInUserData?.role ||
            userRole.Admin === loggedInUserData?.role) ? ProjectDetails?.project_stage == 3 : false ||
          ProjectDetails?.review_supercheckers?.some(
            (superchecker) => superchecker.id === loggedInUserData?.id
          )) &&
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}
            >
              <SuperCheckSettings ProjectDetails={ProjectDetails} permissionList={permissionList}/>
            </Grid>}
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
          {/* <div className={classes.divider} ></div> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Download Metadata"
              labelPlacement="start"
              checked={downloadMetadataToggle}
              onChange={handleDownoadMetadataToggle}
              disabled ={userRole.WorkspaceManager === loggedInUserData?.role?true:false}

            />
          </Grid> */}
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