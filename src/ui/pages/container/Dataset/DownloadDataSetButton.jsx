import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {Box, Checkbox, CircularProgress, FormControlLabel, IconButton, Popover, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GetDatasetDownloadCSV from "../../../../redux/actions/api/Dataset/GetDatasetDownloadCSV";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetDatasetDownloadTSV from "../../../../redux/actions/api/Dataset/GetDatasetDownloadTSV";
import GetDatasetDownloadJSON from "../../../../redux/actions/api/Dataset/GetDatasetDownloadJSON";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditProjectPermission from "../../../../redux/actions/api/ProjectDetails/editProjectPermission";
import ProjectPermission from "../../../../redux/actions/api/ProjectDetails/ProjectPermission";

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


function DownloadDatasetButton({permissionList}) {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiLoading = useSelector(state => state.apiStatus.loading);
  const downloadCSV = useSelector((state) => state.getDatasetDownloadCSV.data);
  const downloadJSON = useSelector((state) => state.getDatasetDownloadJSON.data);
  const downloadTSV = useSelector((state) => state.getDatasetDownloadTSV.data);
  const open = Boolean(anchorEl);
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  let csvLink = React.createRef()
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
const [openNewPopover, setOpenNewPopover] = useState(false);
const [view, setview] = useState();
const [use, setuse] = useState();

const viewPermissions = permissionList?.permission?.can_view_download_dataset || [];
const usePermissions = permissionList?.permission?.can_use_download_dataset || [];
const [selectedOptions, setSelectedOptions] = useState({
view: viewPermissions,
use: usePermissions
});

const open1 = Boolean(anchorEl);
const newPopoverOpen = Boolean(newPopoverAnchorEl);
const Id1 = open1 ? 'simple-popover' : undefined;
const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;


  useEffect(() => {
    setLoading(false);
  }, [downloadCSV,downloadJSON,downloadTSV])


 
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleDownloadJSONDataset = async () => {
    setLoading(true);
    const projectObj = new GetDatasetDownloadJSON(datasetId);
    dispatch(APITransport(projectObj));
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVDataset = async () => {
    setLoading(true);
    dispatch(APITransport(new GetDatasetDownloadCSV(datasetId)));
    setAnchorEl(null);
  }

  const handleDownloadTSVDataset = async () => {
    setLoading(true);
    dispatch(APITransport(new GetDatasetDownloadTSV(datasetId)));
    setAnchorEl(null);
  }
 
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
    const projectObj1 = new ProjectPermission();
    dispatch(APITransport(projectObj1))
  }, []);


useEffect(() => {
    if (permissionList && permissionList?.permission) {
        setview(permissionList?.permission?.can_view_download_dataset);
        setuse(permissionList?.permission?.can_use_download_dataset);
        const viewPermissions = permissionList?.permission?.can_view_download_dataset || [];
    const usePermissions = permissionList?.permission?.can_use_download_dataset || [];
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
    const viewPermissions = permissionList?.permission?.can_view_download_dataset || [];
    const usePermissions = permissionList?.permission?.can_use_download_dataset || [];    
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

  return (
    <div>
      {renderSnackBar()}

      {loading ? (
						<CircularProgress />
					) : (<>
           <Box display="flex" alignItems="center">

      <Button
        sx={{  p: 2, borderRadius: loggedInUserData?.role === 6? "8px 0 0 8px" : 3,
          width:"190px" }}
        id="demo-customized-button"
        variant="contained"
        onClick={canUseDownloadButton(loggedInUserData?.role) ? handleClick : null}
        disabled={!( canViewDownloadButton(loggedInUserData?.role))&& loggedInUserData?.role!==6}  
        endIcon={<KeyboardArrowDownIcon />}
      >
        Download DataSet
      </Button>
      <IconButton
                    color="primary"
                    onClick={handleNewPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
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


      <StyledMenu
        sytle={{ width: "px" }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        <MenuItem onClick={handleDownloadCSVDataset}>
          CSV
        </MenuItem>
        <MenuItem onClick={handleDownloadTSVDataset}>
          TSV
        </MenuItem>
        <MenuItem onClick={handleDownloadJSONDataset} >
          JSON
        </MenuItem>
      </StyledMenu>
      </>
      	)}
    </div>
  );
}
export default DownloadDatasetButton;