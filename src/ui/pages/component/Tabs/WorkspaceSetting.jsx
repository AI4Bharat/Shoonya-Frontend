import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import ArchiveWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/ArchiveWorkspace";
import DownloadAllProjects from "../../../../redux/actions/api/WorkspaceDetails/DownloadAllProjects";
import CustomButton from "../common/Button";
import { useParams } from 'react-router-dom';
import DatasetStyle from "../../../styles/Dataset";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";
import Dialog from "@mui/material/Dialog";
import { Button,Grid } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from '@mui/material/TextField';
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";

function WorkspaceSetting(props) {
  const { onArchiveWorkspace } = props
  console.log(props, "props")
  const { id } = useParams();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const workspaceDtails = useSelector(state => state.getWorkspaceDetails.data);

  const handleArchiveWorkspace = async () => {
    const projectObj = new ArchiveWorkspaceAPI(id, id);
    dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
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
      onArchiveWorkspace()
      // window.location.reload();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }

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
        message={[snackbar.message]}
      />
    );
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const handleConfirm = async () => {
    const apiObj = new LoginAPI(emailId, password);
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const rsp_data = await res.json();
    if (res.ok) {
      handleArchiveWorkspace();
    } else {
      window.alert("Invalid credentials, please try again");
      console.log(rsp_data);
    }
  };
  const user = useSelector((state) => state.fetchLoggedInUserData?.data);
  console.log(user);
  const handleDownloadProject = async () => {
    // SetTask([]) //used to clear the selected task statuses
    const projectObj = new DownloadAllProjects(workspaceDtails.id,user.id);
    dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      })

    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }

  };
  return (
    <div>
      {renderSnackBar()}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {workspaceDtails?.is_archived ? "unarchive" : "archive"}{" "}
            this project?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}
            variant="outlined"
            color="error">Cancel</Button>
          <Button onClick={handleConfirm}
            variant="contained"
            color="error"
            autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <CustomButton
        sx={{ backgroundColor: "#cf5959", "&:hover": { backgroundColor: "#cf5959", } }}
        className={classes.settingsButton}
        onClick={handleClickOpen}
        label={"Archive Workspace"}
        buttonVariant="contained"
        disabled={workspaceDtails?.is_archived}
      />
      <Grid
        items
        xs={12}
        sm={12}
        md={12}
        lg={2}
        xl={2}
        mt={2}
      >
        <CustomButton
      sx={{backgroundColor : "#2C2799", "&:hover" : {backgroundColor : "rgba(0, 0, 0, .85)",}}} 
      label={"Download All Projects"}
      className={classes.settingsButton}
        variant="contained"
        onClick={handleDownloadProject}
      />
      </Grid>
    </div>
  )
}
export default WorkspaceSetting;