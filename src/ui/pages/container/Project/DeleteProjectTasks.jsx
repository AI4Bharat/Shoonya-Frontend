import React, { useState,useEffect } from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography,Radio, Dialog, DialogActions, DialogContent, DialogContentText,Checkbox,
    IconButton
} from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import DeleteProjectTasksAPI from "../../../../redux/actions/api/ProjectDetails/DeleteProjectTasks";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import EditProjectPermission from "../../../../redux/actions/api/ProjectDetails/editProjectPermission";
export default function DeleteProjectTasks({permissionList}) {
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
    const [projectTaskStartId, setProjectTaskStartId] = useState("");
    const [projectTaskEndId, setProjectTaskEndId] = useState("");
    const [openNewPopover, setOpenNewPopover] = useState(false);
    const [view, setview] = useState();
    const [use, setuse] = useState();
  
   const viewPermissions = permissionList?.permission?.can_view_delete_project_tasks || [];
   const usePermissions = permissionList?.permission?.can_use_delete_project_tasks || [];
   const [selectedOptions, setSelectedOptions] = useState({
    view: viewPermissions,
    use: usePermissions
   });
  
    const open1 = Boolean(anchorEl);
    const newPopoverOpen = Boolean(newPopoverAnchorEl);
    const Id1 = open1 ? 'simple-popover' : undefined;
    const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [radiobutton, setRadiobutton] = useState(true)
    const [dataIds, setDataIds] = useState("")
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const loggedInUserData = useSelector(
        (state) => state.fetchLoggedInUserData.data
      );
    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();
    };

    const handleDeletebyids = () => {
        setRadiobutton(true)

    }
    const handleDeletebyrange = () => {
        setRadiobutton(false)
    }
    const handledataIds = (e,) => {
        setDataIds(e.target.value);


    }

    let datasetitem = dataIds.split(",")
    var value = datasetitem.map(function (str) {
        return parseInt(str);
    });

    const handleok = async() => {
        setOpenDialog(false);
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();
        let projectObj
        const ProjectTaskStartAndEndID = {
            project_task_start_id: parseInt(projectTaskStartId),
            project_task_end_id: parseInt(projectTaskEndId)
        }
        

        const  ProjectTaskIDs = {
            project_task_ids: value
        }

        if (radiobutton === true) {
             projectObj = new DeleteProjectTasksAPI(id, ProjectTaskStartAndEndID)


        } else {
             projectObj = new DeleteProjectTasksAPI(id, ProjectTaskIDs)
        }
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
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }

    const handleSearchSubmit = () => {
        setOpenDialog(true);

    }


    const open = Boolean(anchorEl);
    const Id = open ? 'simple-popover' : undefined;

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
        }else{
        window.alert("Invalid credentials, please try again");
        console.log(rsp_data);
        }
    };
    const handleNewPopoverOpen = (event) => {
        setOpenNewPopover(true);
        setNewPopoverAnchorEl(event.currentTarget);
    };
   

    useEffect(() => {
        if (permissionList && permissionList?.permission) {
            setview(permissionList?.permission?.can_view_delete_project_tasks);
            setuse(permissionList?.permission?.can_use_delete_project_tasks);
            const viewPermissions = permissionList?.permission?.can_view_delete_project_tasks || [];
        const usePermissions = permissionList?.permission?.can_use_delete_project_tasks || [];
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
    

    
    const handleNewPopoverClose = () => {
        setOpenNewPopover(false);
        setNewPopoverAnchorEl(null);
        const viewPermissions = permissionList?.permission?.can_view_delete_project_tasks || [];
        const usePermissions = permissionList?.permission?.can_use_delete_project_tasks || [];    
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
    
    // console.log(permissionList?.permission?.can_view_delete_project_tasks,selectedOptions.view);
    
    const handleApply = (name) => {
        const obj = new EditProjectPermission(`can_${name}_download_project`,selectedOptions?.view);
        dispatch(APITransport(obj));
    };
    
    return (
        <div >
            {renderSnackBar()}
            {userRole.Admin === loggedInUserData?.role ?
            <Box display="flex" alignItems="center">
                <Button
                sx={{
                    inlineSize: "max-content",
                    p: 2,
                    borderRadius: "8px 0 0 8px",
                    ml: 2,
                    width: "300px"
                }}
                aria-describedby={Id}
                variant="contained"
                onClick={canUseDownloadButton(loggedInUserData?.role) ? handleClick : null}
                disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
                color="error"
                >
                Delete Project Tasks
            </Button>
            {loggedInUserData?.role === 6 ?(
      <IconButton
        color="primary"
        onClick={handleNewPopoverOpen} 
        sx={{ borderRadius: "0 8px 8px 0", backgroundColor: "#B00020", color: "white" }} 
      >
        <ArrowForwardIosIcon />
      </IconButton>
    ):null}
            </Box>:null}

            <Popover
                Id={Id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >

                  <Grid container className={classes.root} >
                    <Grid item style={{ flexGrow: "1", padding: "10px" }}>
                        <FormControl >
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue="deletebyrange"

                            >

                                <FormControlLabel value="deletebyrange" control={<Radio />} label="Delete by Range" onClick={handleDeletebyids} />
                                <FormControlLabel value="deletebyids" control={<Radio />} label="Delete by IDs" onClick={handleDeletebyrange} />

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
              {radiobutton === true &&
              <>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >

                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Task Start ID:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskStartId}
                            onChange={(e) => setProjectTaskStartId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"
                                }
                            }}
                        />

                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Task End ID:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskEndId}
                            onChange={(e) => setProjectTaskEndId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"
                                }
                            }}
                        />
                    </Grid>
   
                </Grid>
                </>}
                {radiobutton === false &&
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            p: 1
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={5}
                            xl={5}
                        >
                            <Typography variant="body2" fontWeight='700' label="Required">
                            Project Task IDs:
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            xl={6}
                            sm={6}
                        >

                            <TextField
                                size="small"
                                variant="outlined"
                                value={dataIds}
                                onChange={handledataIds}
                                inputProps={{
                                    style: {
                                        fontSize: "16px"
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                }

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClearSearch}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSearchSubmit}
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
            <Popover
    id={newPopoverId}
    open={newPopoverOpen}
    anchorEl={newPopoverAnchorEl}
    onClose={handleNewPopoverClose}
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
            <Button variant="outlined" color="error" onClick={handleNewPopoverClose}>
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
            <Button variant="outlined" color="error" onClick={handleNewPopoverClose}>
                Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleApply("use")}>
                Apply Use
            </Button>
        </Box>
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
                    Are you  sure want to delete these tasks? Please note this action cannot be undone.
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
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="error"
                        size="small"
                        className={classes.clearAllBtn} >
                            Cancel
                    </Button>
                    <Button onClick={handleConfirm}
                        variant="contained"
                        color="error"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
