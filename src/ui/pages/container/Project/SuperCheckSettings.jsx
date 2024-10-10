import React, { useState ,useEffect} from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography, Radio, Dialog, DialogActions, DialogContent, DialogContentText,
    Checkbox,
    IconButton
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import SuperCheckSettingsAPI from "../../../../redux/actions/api/ProjectDetails/SuperCheckSettings";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";
import EditProjectPermission from "../../../../redux/actions/api/ProjectDetails/editProjectPermission";


export default function SuperCheckSettings(props) {
    const{ProjectDetails,permissionList}=props
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [supercheckLoopCount, setSupercheckLoopCount] = useState(ProjectDetails.revision_loop_count);
    const [supercheckvalue, setSupercheckvalue] = useState(ProjectDetails.k_value);
    const [loading, setLoading] = useState(false);
    const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
    const [openNewPopover, setOpenNewPopover] = useState(false);
    const [view, setview] = useState();
  const [use, setuse] = useState();

 const viewPermissions = permissionList?.permission?.can_view_supercheck_settings || [];
 const usePermissions = permissionList?.permission?.can_use_supercheck_settings || [];
 const [selectedOptions, setSelectedOptions] = useState({
  view: viewPermissions,
  use: usePermissions
 });

    const open1 = Boolean(anchorEl);
    const newPopoverOpen = Boolean(newPopoverAnchorEl);
    const Id1 = open1 ? 'simple-popover' : undefined;
    const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;
   
  
  

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = async () => {
        const data = {
            revision_loop_count: supercheckLoopCount,
            k_value: supercheckvalue
        }
        setAnchorEl(null);
        setSupercheckLoopCount();
        setSupercheckvalue();
        let projectObj = new SuperCheckSettingsAPI(id, data)
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "PATCH",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
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
    const handleNewPopoverOpen = (event) => {
        setOpenNewPopover(true);
        setNewPopoverAnchorEl(event.currentTarget);
    };
    const loggedInUserData = useSelector(
        (state) => state.fetchLoggedInUserData.data
      );
    

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
    

    
    const handleNewPopoverClose = () => {
        setOpenNewPopover(false);
        setNewPopoverAnchorEl(null);
        const viewPermissions = permissionList?.permission?.can_view_supercheck_settings || [];
        const usePermissions = permissionList?.permission?.can_use_supercheck_settings || [];    
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
    
    // console.log(permissionList?.permission?.can_view_supercheck_settings,selectedOptions.view);
    
    const handleApply = (name) => {
        const obj = new EditProjectPermission(`can_${name}_download_project`,selectedOptions?.view);
        dispatch(APITransport(obj));
    };
    
        return (
        <div >
            {renderSnackBar()}
            <Box display="flex" alignItems="center">
            <Button
                sx={{
                    inlineSize: "max-content",
                    p: 2,
                    borderRadius: loggedInUserData?.role === 6? "8px 0 0 8px" : 3,
                    ml: 2,
                    width: "300px"
                }}
                aria-describedby={Id}
                variant="contained"
                disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
                onClick={canUseDownloadButton(loggedInUserData?.role) ? handleClick : null}
            >
                Super Check Settings
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

            </Box>
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

            <Popover
                Id={Id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                PaperProps={{
                    style: { width: '330px' },
                  }}
            >


                <Grid
                    container
                    direction="row"
                    sx={{
                        alignItems: "center",
                        p: 1,
                        mt:2

                    }}
                >
                    <Grid items xs={12} sm={12} md={9} lg={9} xl={9}>
                        <Typography variant="body2" fontWeight="700" label="Required">
                            Super Checking K% value:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9} xl={9} sm={12}>
                        <TextField
                            size="small"
                            variant="outlined"
                            value={supercheckvalue}
                            onChange={(e) => setSupercheckvalue(e.target.value)}
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
                    direction="row"
                    sx={{
                        alignItems: "center",
                        p: 1,

                    }}
                >
                    <Grid items xs={12} sm={12} md={9} lg={9} xl={9}>
                        <Typography variant="body2" fontWeight="700" label="Required">
                            Super Check Revision Loop Count :
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9} xl={9} sm={12}>
                        <TextField
                            size="small"
                            variant="outlined"
                            value={supercheckLoopCount}
                            onChange={(e) => setSupercheckLoopCount(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"

                                }
                            }}
                        />

                    </Grid>
                </Grid>


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

        </div>
    );
}
