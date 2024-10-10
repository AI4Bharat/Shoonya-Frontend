import { Box,Grid,Tab, Card,Tabs, Typography,Popover,Checkbox,FormControlLabel,Button, Divider,IconButton } from '@mui/material'
import React from 'react'
import { useState ,useEffect} from 'react'
import BasicSettings from '../../component/Tabs/BasicSettings';
import ReadonlyConfigurations from '../../component/Tabs/ReadonlyConfigurations'
import AdvancedOperation from '../../component/Tabs/AdvancedOperation';
import ProjectLogs from './ProjectLogs';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditProjectPermission from '../../../../redux/actions/api/ProjectDetails/editProjectPermission';
import ProjectPermission from '../../../../redux/actions/api/ProjectDetails/ProjectPermission';
import { vi } from 'date-fns/locale';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={4}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const ProjectSetting = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        console.log("hello",v);
        
        setTabValue(v)
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const permissionList = useSelector((state) => state.ProjectPermission.data);

    const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
    const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
    const [openNewPopover, setOpenNewPopover] = useState(false);
    const [view, setview] = useState();
  const [use, setuse] = useState();

 const viewPermissions = permissionList?.permission?.can_view_basic_project_settings || [];
 const usePermissions = permissionList?.permission?.can_use_basic_project_settings || [];
 const [selectedOptions, setSelectedOptions] = useState({
  view: viewPermissions,
  use: usePermissions
 });
    const open1 = Boolean(anchorEl);
    const newPopoverOpen = Boolean(newPopoverAnchorEl);
    const Id1 = open1 ? 'simple-popover' : undefined;
    const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;
  
    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        getProjectDetails();
    }, [])
    const handleNewPopoverOpen = (event) => {
        setOpenNewPopover(true);
        setNewPopoverAnchorEl(event.currentTarget);
    };
    
    const loggedInUserData = useSelector(
        (state) => state.fetchLoggedInUserData.data
      );
    
      useEffect(() => {
        const projectObj1 = new ProjectPermission();
        dispatch(APITransport(projectObj1))
      }, []);
    

    useEffect(() => {
        if (permissionList && permissionList?.permission) {
            setview(permissionList?.permission?.can_view_basic_project_settings);
            setuse(permissionList?.permission?.can_use_basic_project_settings);
            const viewPermissions = permissionList?.permission?.can_view_basic_project_settings || [];
        const usePermissions = permissionList?.permission?.can_use_basic_project_settings || [];
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
    
console.log(canViewDownloadButton(loggedInUserData?.role),view);

    
    const handleNewPopoverClose = () => {
        setOpenNewPopover(false);
        setNewPopoverAnchorEl(null);
        const viewPermissions = permissionList?.permission?.can_view_basic_project_settings || [];
        const usePermissions = permissionList?.permission?.can_use_basic_project_settings || [];    
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
    
    // console.log(permissionList?.permission?.can_view_basic_project_settings,selectedOptions.view);
    
    const handleApply = (name) => {
        const obj = new EditProjectPermission(`can_${name}_download_project`,selectedOptions?.view);
        dispatch(APITransport(obj));
    };
  
    return (
        <Card
        sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            padding: 5
        }}
    >
      
        <Box >
              <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{mb:3,}}
                    >
                        <Typography variant="h3" gutterBottom component="div"sx={{fontWeight: '1.6875rem'}}>
                            Project Settings
                        </Typography>
                    </Grid>
                    
                    <Box sx={{ mb: 2, position: 'relative' }}>
  <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
  {(!canViewDownloadButton(loggedInUserData?.role) || loggedInUserData?.role === 6) && (
      <Tab label="Basic" sx={{ fontSize: 17, fontWeight: '700', paddingRight: '20px' }} />
    )}
    <Tab label="Advanced" sx={{ fontSize: 17, fontWeight: '700' }} />
    <Tab label="Read-only" sx={{ fontSize: 17, fontWeight: '700' }} />
    <Tab label="Logs" sx={{ fontSize: 17, fontWeight: '700' }} />
  </Tabs>

  {loggedInUserData?.role === 6 ?(<IconButton
    color="primary"
    onClick={(e) => {
      e.stopPropagation();
      handleNewPopoverOpen(e);
    }}
    sx={{
      color: "black",
      position: 'absolute',
      left: '40px',
      top: '4px',  
    }}
  >
    <PlayArrowIcon />
  </IconButton>):null}
</Box>
           
            <Divider/>
            <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                <BasicSettings   ProjectDetails={ProjectDetails}/>  
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <AdvancedOperation />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                <ReadonlyConfigurations />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <ProjectLogs />
                </TabPanel>
            </Box>
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


        </Card>
    )
}

export default ProjectSetting