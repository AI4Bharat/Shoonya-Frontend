import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CSVDownload, CSVLink } from "react-csv";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DownloadProjectCsvAPI from '../../../../redux/actions/api/ProjectDetails/DownloadCSVProject';
import DownloadJSONProjectAPI from '../../../../redux/actions/api/ProjectDetails/DownloadJSONProject';
import DownloadProjectTsvAPI from '../../../../redux/actions/api/ProjectDetails/DownloadTSVProject';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import { Box, Checkbox, FormControlLabel, IconButton, Popover, Typography } from "@mui/material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,


  },
}));


function DownloadProjectButton(props) {
  const { taskStatus,SetTask,downloadMetadataToggle,permissionList} = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [downloadres, setdownloadres] = useState(false);
  const [view, setview] = useState();
  const [use, setuse] = useState();

  const [loading, setLoading] = useState(false);
 const[taskValue ,setTaskValue]= useState(taskStatus)
 const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
 const [openNewPopover, setOpenNewPopover] = useState(false);
 const [selectedOptions, setSelectedOptions] = useState({
  view: permissionList?.permission?.canViewDownloadButton || [],
  use: permissionList?.permission?.canUseDownloadButton || []
 });
 const open1 = Boolean(anchorEl);
 const newPopoverOpen = Boolean(newPopoverAnchorEl);
 const Id1 = open1 ? 'simple-popover' : undefined;
 const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;
  const apiLoading = useSelector(state => state.apiStatus.loading);
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const dispatch = useDispatch();
  let csvLink = React.createRef()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );


  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading])


  // const getDownloadProject = async () => {
  //   const projectObj = new DownloadProjectButtonAPI(id);

  //   dispatch(APITransport(projectObj));

  // }
  // let DownloadProject =  useSelector(state => state.downloadProjectButton.data);


  // const DownloadJSONProject = async () => {
  //   const projectObj = new DownloadJSONProjectAPI(id);

  //   dispatch(APITransport(projectObj));

  // }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleDownloadJSONProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    const projectObj = new DownloadJSONProjectAPI(id,taskStatus,downloadMetadataToggle);
    dispatch(APITransport(projectObj));
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
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
   
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    setLoading(true)
    const projectObj = new DownloadProjectCsvAPI(id,taskStatus,downloadMetadataToggle);
    dispatch(APITransport(projectObj));
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
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
   
  };
  useEffect(() => {
    if (permissionList) {
        setview(permissionList?.permission?.can_view_download_project);
        setuse(permissionList?.permission?.can_use_download_project);
        const viewPermissions = permissionList?.permission?.can_view_download_project || [];
    const usePermissions = permissionList?.permission?.can_use_download_project || [];
    
    // Initialize selected options based on permissions
    setSelectedOptions({
      view: viewPermissions,
      use: usePermissions
    });
    }
}, []);
const canViewDownloadButton = (roleId) => {
  return view && view.includes(roleId);
};
const canUseDownloadButton = (roleId) => {
  return use && use.includes(roleId);
};

  const handleDownloadTSVProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    setLoading(true)
    const projectObj = new DownloadProjectTsvAPI(id,taskStatus,downloadMetadataToggle);
    dispatch(APITransport(projectObj));
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
    //     message: "success",
    //     variant: "success",
    //   })

    // } else {
    //   setSnackbarInfo({
    //     open: true,
    //     message: resp?.message,
    //     variant: "error",
    //   })
    // }
    
  };
 
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

const handleNewPopoverClose = () => {
    setOpenNewPopover(false);
    setNewPopoverAnchorEl(null);
    setSelectedOptions({ view: false, use: false });
};
const handleCheckboxChange = (name, checked, roleNumber) => {
  setSelectedOptions((prevOptions) => {
    if (name === 'view') {
      const updatedViewRoles = checked 
        ? [...prevOptions.view, roleNumber] 
        : prevOptions?.view?.filter((role) => role !== roleNumber); 
      return {
        ...prevOptions,
        view: updatedViewRoles
      };
    } else if (name === 'use') {
      const updatedUseRoles = checked
        ? [...prevOptions.use, roleNumber] 
        : prevOptions?.use?.filter((role) => role !== roleNumber); 
      
      return {
        ...prevOptions,
        use: updatedUseRoles
      };
    }
    return prevOptions;
  });
};

console.log(selectedOptions);

const handleApply = (name) => {
    console.log("Selected Options:", selectedOptions);
    handleNewPopoverClose();
};

console.log(view && view?.includes(4),view,canViewDownloadButton(loggedInUserData?.role));
  return (
    <div>
      {renderSnackBar()}
      <Box display="flex" alignItems="center">
      <Button
        sx={{ inlineSize: "max-content", p: 2, borderRadius: "8px 0 0 8px", ml: 2,width:"300px" }}
        id="demo-customized-button"
        variant="contained"
        disabled={!(taskStatus.length > 0 && canViewDownloadButton(loggedInUserData?.role))}  
        onClick={canUseDownloadButton(loggedInUserData?.role) ? handleClick : null}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Download Project
      </Button>
      <IconButton
                    color="primary"
                    onClick={handleNewPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
      <StyledMenu
        sytle={{ width: "20px" }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItem onClick={handleDownloadCSVProject}>
          CSV
        </MenuItem>
        <MenuItem onClick={handleDownloadTSVProject}>
          TSV
        </MenuItem>
        <MenuItem onClick={handleDownloadJSONProject} >
          JSON
        </MenuItem>
      </StyledMenu>
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
                    checked={selectedOptions.view.includes(5)} 
                    onChange={(event) => handleCheckboxChange('view', event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.view.includes(4)} 
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
                    checked={selectedOptions.use.includes(5)} 
                    onChange={(event) => handleCheckboxChange("use", event.target.checked, 5)}
                />
            }
            label="Org Owner"
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={selectedOptions.use.includes(4)} 
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

    </div>
  );
}
export default DownloadProjectButton;