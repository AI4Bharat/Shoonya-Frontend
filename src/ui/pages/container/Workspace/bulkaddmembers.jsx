import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import configs from '../../../../config/config.js';

const AssignMembersDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('success');
  const [formData, setFormData] = useState({
    project_ids: '',
    user_emails: '',
    user_role: '',
  });

  const getWorkspaceId = () => {
    const match = window.location.hash.match(/workspaces\/(\d+)/);
    return match ? match[1] : null;
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setFormData({
      project_ids: '',
      user_emails: '',
      user_role: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      setResponseMessage('Workspace ID not found in URL.');
      setResponseType('error');
      return;
    }

    const payload = {
      user_emails: formData.user_emails
        .split(',')
        .map((email) => email.trim()),
      user_role: formData.user_role,
      project_ids: formData.project_ids
        .split(',')
        .map((id) => parseInt(id.trim())),
    };

    setLoading(true);

    try {
      const res = await axios.post(
        `${configs.BASE_URL_AUTO}/workspaces/${workspaceId}/bulk_add_members_to_projects/`,
        payload,
        {
          headers: {
            Authorization: `JWT ${localStorage.getItem('anudesh_access_token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setResponseMessage(res.data.message || 'Users assigned successfully');
      setResponseType('success');
      handleClose(); // Close modal
    } catch (err) {
      setResponseMessage(
        err.response?.data?.message || 'Error assigning users'
      );
      setResponseType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#2C2799',
            color: '#fff',
            width: '100%',
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#2C2799',
            },
          }}
        >
          Assign Members to Projects
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Members</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="project_ids"
              label="Project IDs (comma-separated)"
              variant="outlined"
              margin="dense"
              value={formData.project_ids}
              onChange={handleChange}
              required
              InputLabelProps={{ required: false }}
            />
            <TextField
              fullWidth
              name="user_emails"
              label="User Emails (comma-separated)"
              variant="outlined"
              margin="dense"
              value={formData.user_emails}
              onChange={handleChange}
              required
              InputLabelProps={{ required: false }}
            />
            <TextField
              fullWidth
              select
              name="user_role"
              label="Role"
              variant="outlined"
              margin="dense"
              value={formData.user_role}
              onChange={handleChange}
              required
              InputLabelProps={{ required: false }}
            >
              <MenuItem value="annotator">Annotator</MenuItem>
              <MenuItem value="reviewer">Reviewer</MenuItem>
              <MenuItem value="super_checker">Superchecker</MenuItem>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#2C2799', color: '#fff' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!responseMessage}
        autoHideDuration={6000}
        onClose={() => setResponseMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={responseType} onClose={() => setResponseMessage('')} sx={{ width: '100%' }}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AssignMembersDialog;