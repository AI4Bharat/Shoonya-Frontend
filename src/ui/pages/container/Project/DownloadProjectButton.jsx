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
  const { taskStatus, SetTask, downloadMetadataToggle, buttonType = "download" } = props;
  const [anchorElEmail, setAnchorElEmail] = useState(null);
  const [anchorElDownload, setAnchorElDownload] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );

  const handleClickEmail = (event) => setAnchorElEmail(event.currentTarget);
  const handleCloseEmail = () => setAnchorElEmail(null);

  const handleClickDownload = (event) => setAnchorElDownload(event.currentTarget);
  const handleCloseDownload = () => setAnchorElDownload(null);

  const handleExport = async (exportType, delivery) => {
    if (delivery === "email") {
      handleCloseEmail();
      setLoadingEmail(true);
    } else {
      handleCloseDownload();
      setLoadingDownload(true);
    }

    try {
      const url = `${configs.BASE_URL}${ENDPOINTS.getProjects}${id}/download/?export_type=${exportType}&task_status=${taskStatus}&delivery=${delivery}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`,
        },
        body: JSON.stringify({}),
      });

      if (delivery === "email") {
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
      } else {
        if (res.ok) {
          const blob = await res.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;

          const now = new Date();
          const pad = (n) => n.toString().padStart(2, '0');
          const dateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
          const randomHex = Math.random().toString(16).substring(2, 10);
          let fileName = `project-${id}-at-${dateTime}-${randomHex}.${exportType.toLowerCase()}`;
          const contentDisposition = res.headers.get('Content-Disposition');
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch && fileNameMatch.length === 2) {
              fileName = fileNameMatch[1];
            }
          }
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);

          setSnackbarInfo({
            open: true,
            message: "Download complete.",
            variant: "success",
          });
        } else {
          const resp = await res.json();
          setSnackbarInfo({
            open: true,
            message: resp?.message || "Failed to download the report.",
            variant: "error",
          });
        }
      }
    } catch (err) {
      setSnackbarInfo({
        open: true,
        message: "Request failed. Please try again.",
        variant: "error",
      });
    } finally {
      if (delivery === "email") setLoadingEmail(false);
      else setLoadingDownload(false);
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

  const isDisabled = taskStatus.length > 0 && userRole.WorkspaceManager !== loggedInUserData?.role ? false : true;

  // ... (keeping state and handlers the same)

  if (buttonType === "email") {
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        {renderSnackBar()}
        <div>
          <Button
            sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2, width: "300px" }}
            id="email-customized-button"
            variant="contained"
            disabled={loadingEmail || isDisabled}
            onClick={handleClickEmail}
            endIcon={loadingEmail ? <CircularProgress size={20} color="inherit" /> : <KeyboardArrowDownIcon />}
          >
            {loadingEmail ? "Sending..." : "Email Project Data"}
          </Button>
          <StyledMenu
            id="email-customized-menu"
            anchorEl={anchorElEmail}
            open={Boolean(anchorElEmail)}
            onClose={handleCloseEmail}
          >
            <MenuItem onClick={() => handleExport("CSV", "email")}>CSV</MenuItem>
            <MenuItem onClick={() => handleExport("TSV", "email")}>TSV</MenuItem>
            <MenuItem onClick={() => handleExport("JSON", "email")}>JSON</MenuItem>
          </StyledMenu>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
      {renderSnackBar()}
      <div>
        <Button
          sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2, width: "300px" }}
          id="download-customized-button"
          variant="contained"
          disabled={loadingDownload || isDisabled}
          onClick={handleClickDownload}
          endIcon={loadingDownload ? <CircularProgress size={20} color="inherit" /> : <KeyboardArrowDownIcon />}
        >
          {loadingDownload ? "Downloading..." : "Download Project"}
        </Button>
        <StyledMenu
          id="download-customized-menu"
          anchorEl={anchorElDownload}
          open={Boolean(anchorElDownload)}
          onClose={handleCloseDownload}
        >
          <MenuItem onClick={() => handleExport("CSV", "download")}>CSV</MenuItem>
          <MenuItem onClick={() => handleExport("TSV", "download")}>TSV</MenuItem>
          <MenuItem onClick={() => handleExport("JSON", "download")}>JSON</MenuItem>
        </StyledMenu>
      </div>
    </div>
  );
}
export default DownloadProjectButton;