import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CSVDownload, CSVLink } from "react-csv";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DownloadProjectCsvAPI from '../../../../redux/actions/api/ProjectDetails/DownloadCSVProject';
import DownloadJSONProjectAPI from '../../../../redux/actions/api/ProjectDetails/DownloadJSONProject';
import DownloadProjectTsvAPI from '../../../../redux/actions/api/ProjectDetails/DownloadTSVProject';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";

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
  const { taskStatus,SetTask,downloadMetadataToggle} = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [downloadres, setdownloadres] = useState(false);
  const [loading, setLoading] = useState(false);
 const[taskValue ,setTaskValue]= useState(taskStatus)
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
  return (
    <div>
      {renderSnackBar()}
      <Button
        sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2,width:"300px" }}
        id="demo-customized-button"
        // aria-controls={open ? 'demo-customized-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disabled= {taskStatus.length > 0 ? false: true } 
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Download Project
      </Button>
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
    </div>
  );
}
export default DownloadProjectButton;