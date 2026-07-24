import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CustomButton from "./Button";
import configs from "../../../../config/config";
import CustomizedSnackbars from "./Snackbar";

const AssignMembersDialog = ({ isOpen, handleDialogClose }) => {
  const [formData, setFormData] = useState({
    project_ids: "",
    user_emails: "",
    user_role: "annotator",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const getWorkspaceId = () => {
    const match = window.location.hash.match(/workspaces\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const dialogCloseHandler = () => {
    handleDialogClose();
    setFormData({ project_ids: "", user_emails: "", user_role: "annotator" });
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() => setSnackbarInfo({ open: false, message: "", variant: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      setSnackbarInfo({ open: true, message: "Workspace ID not found", variant: "error" });
      setLoading(false);
      return;
    }

    const payload = {
      user_emails: formData.user_emails.split(',').map((email) => email.trim()).filter(e => e),
      user_role: formData.user_role,
      project_ids: formData.project_ids.split(',').map((id) => parseInt(id.trim())).filter(id => !isNaN(id)),
    };

    try {
      const response = await fetch(`${configs.BASE_URL_AUTO}/workspaces/${workspaceId}/bulk_add_members_to_projects/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem('shoonya_access_token')}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbarInfo({ open: true, message: data.message || "Users added to projects successfully", variant: "success" });
        setTimeout(() => {
          dialogCloseHandler();
        }, 1500);
      } else {
        setSnackbarInfo({ open: true, message: data.message || "Failed to assign members", variant: "error" });
      }
    } catch (error) {
      setSnackbarInfo({ open: true, message: "An error occurred", variant: "error" });
    }
    setLoading(false);
  };

  return (
    <>
      {renderSnackBar()}
      <Dialog open={isOpen} onClose={dialogCloseHandler} fullWidth maxWidth="sm">
        <DialogTitle>Assign Members to Projects</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Project IDs (comma-separated)"
            name="project_ids"
            fullWidth
            variant="outlined"
            value={formData.project_ids}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="User Emails (comma-separated)"
            name="user_emails"
            fullWidth
            variant="outlined"
            value={formData.user_emails}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="user_role"
              value={formData.user_role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="annotator">Annotator</MenuItem>
              <MenuItem value="reviewer">Reviewer</MenuItem>
              <MenuItem value="super_checker">Super Checker</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={dialogCloseHandler} color="primary">
            Cancel
          </Button>
          <CustomButton
            label="Submit"
            onClick={handleSubmit}
            disabled={loading || !formData.project_ids || !formData.user_emails}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignMembersDialog;
