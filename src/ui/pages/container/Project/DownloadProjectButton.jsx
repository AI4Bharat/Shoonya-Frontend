import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CSVDownload, CSVLink } from "react-csv";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DownloadProjectCsvAPI from '../../../../redux/actions/api/ProjectDetails/DownloadCSVProject'
import DownloadJSONProjectAPI from '../../../../redux/actions/api/ProjectDetails/DownloadJSONProject'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from 'react-router-dom';

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


function DownloadProjectButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [downloadres, setdownloadres] = useState(false);

  
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const dispatch = useDispatch();
  let csvLink = React.createRef()
  


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
  const handleDownloadJSONProject = () => {
    dispatch(APITransport(new DownloadJSONProjectAPI(id)));
    

  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCSVProject =()=>{
    dispatch(APITransport(new DownloadProjectCsvAPI(id)));
  }
  return (
    <div>
      <Button
        sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 }}
        id="demo-customized-button"
        // aria-controls={open ? 'demo-customized-menu' : undefined}
        // aria-haspopup="true"
        // aria-expanded={open ? 'true' : undefined}
        variant="contained"

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
       

        <MenuItem onClick={handleDownloadJSONProject} >
          JSON
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
export default DownloadProjectButton;