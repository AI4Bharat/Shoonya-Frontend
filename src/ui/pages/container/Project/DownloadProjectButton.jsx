import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CSVDownload,CSVLink } from "react-csv";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DownloadProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/DownloadProject'
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
  const open = Boolean(anchorEl);
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const DownloadProject = useSelector(state => state.downloadProjectButton.data);

  const getDownloadProject = () => {
      const projectObj = new DownloadProjectButtonAPI(id);

      dispatch(APITransport(projectObj));
  }

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getDownloadProject();
  };
  const handleDownloadProject = () => {
   
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(DownloadProject)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "data.json";
  
      link.click();
    setAnchorEl(null);
   
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  

  return (
    <div>
      <Button
      sx={{ inlineSize: "max-content", p: 2, borderRadius: 3 , ml:2}}
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
      sytle={{width:"20px"}}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
         onClose={handleClose}
       
      >
      <MenuItem>
         < CSVLink 
       filename={"Data.csv"}
       data={DownloadProject}
       style={{textDecoration:"none",color:"black"}}
      >  CSV</CSVLink>
        </MenuItem>
        <MenuItem onClick={handleDownloadProject} >
          JSON
        </MenuItem>
      </StyledMenu>     
    </div>
  );
}
export default DownloadProjectButton;