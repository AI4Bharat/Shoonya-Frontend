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


function DownloadDatasetButton(props) {
  
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
const [selectedOptions, setSelectedOptions] = useState({
    view: false,
    use: false,
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
  
  const handleNewPopoverClose = () => {
    setOpenNewPopover(false);
    setNewPopoverAnchorEl(null);
    setSelectedOptions({ view: false, use: false });
  };
  
  const handleCheckboxChange = (name,checked) => {
    
    setSelectedOptions({
        ...selectedOptions,
        [name]: checked,
    });
  };
  
  const handleApply = () => {
    console.log("Selected Options:", selectedOptions);
    handleNewPopoverClose();
  };
  
  return (
    <div>
      {renderSnackBar()}

      {loading ? (
						<CircularProgress />
					) : (<>
           <Box display="flex" alignItems="center">

      <Button
        sx={{  p: 2, borderRadius: "8px 0 0 8px",width:"190px" }}
        id="demo-customized-button"
        // aria-controls={open ? 'demo-customized-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        variant="contained"
        onClick={handleClick}
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
                    <Typography variant="h6">View</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.orgOwner}
                                onChange={() => handleCheckboxChange("view", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.manager}
                                onChange={() => handleCheckboxChange("view", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.orgOwner}
                                onChange={() => handleCheckboxChange("use", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.manager}
                                onChange={() => handleCheckboxChange("use", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="error" onClick={handleNewPopoverClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleApply}>
                            Apply
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