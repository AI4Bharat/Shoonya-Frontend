import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import configs from "../../../../config/config";
import ENDPOINTS from "../../../../config/apiendpoint";

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
  const { taskStatus, SetTask, downloadMetadataToggle } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
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

  const handleDownload = async (exportType) => {
    handleClose();
    setLoading(true);

    try {
      const url = `${configs.BASE_URL}${ENDPOINTS.getProjects}${id}/download/?export_type=${exportType}&task_status=${taskStatus}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`,
        },
        body: JSON.stringify({}),
      });

      const resp = await res.json();

      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message || "The report has been generated and sent to your email.",
          variant: "success",
        });
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message || "Failed to generate the report.",
          variant: "error",
        });
      }
    } catch (err) {
      setSnackbarInfo({
        open: true,
        message: "Request failed. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
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
        sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2, width: "300px" }}
        id="demo-customized-button"
        variant="contained"
        disabled={loading || (taskStatus.length > 0 && userRole.WorkspaceManager !== loggedInUserData?.role ? false : true)}
        onClick={handleClick}
        endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <KeyboardArrowDownIcon />}
      >
        {loading ? "Generating Report..." : "Download Project"}
      </Button>
      <StyledMenu
        style={{ width: "20px" }}
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleDownload("CSV")}>
          CSV
        </MenuItem>
        <MenuItem onClick={() => handleDownload("TSV")}>
          TSV
        </MenuItem>
        <MenuItem onClick={() => handleDownload("JSON")}>
          JSON
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
export default DownloadProjectButton;