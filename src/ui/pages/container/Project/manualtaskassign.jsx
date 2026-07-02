import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import configs from '../../../../config/config';

const TasksassignDialog = () => {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_ids: '',
    user_id: '',
    annotation_type: '',
  });
  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fetch users when dialog is opened
  useEffect(() => {
    if (open) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `${configs.BASE_URL_AUTO}/projects/${id}/`,
            {
              headers: {
                Authorization: `JWT ${localStorage.getItem('shoonya_access_token')}`,
              },
            }
          );

          const { annotation_reviewers, annotators, review_supercheckers } =
            response.data;

          // Merge all users into a single array (unique by id)
          const combinedUsers = [
            ...(annotation_reviewers || []),
            ...(annotators || []),
            ...(review_supercheckers || []),
          ];

          const uniqueUsers = Array.from(
            new Map(combinedUsers.map((u) => [u.id, u])).values()
          );

          setUsers(uniqueUsers);
        } catch (error) {
          console.error('Error fetching project users:', error);
        }
      };

      fetchUsers();
    }
  }, [open, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose();
    try {
      const payload = {
        task_ids: formData.task_ids.split(',').map((t) => Number(t.trim())),
        user_id: Number(formData.user_id),
        annotation_type: Number(formData.annotation_type),
      };

      const response = await axios.post(
        `${configs.BASE_URL_AUTO}/projects/${id}/assign_tasks_to_user2/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('shoonya_access_token')}`,
          },
        }
      );

      setSnackbarMessage(response.data.message || 'Tasks allocated successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setFormData({ task_ids: '', user_id: '', annotation_type: '' });
    } catch (error) {
      console.error(error.response?.data);
      setSnackbarMessage(error.response?.data?.error || 'Error allocating tasks');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Grid>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            backgroundColor: '#2C2799',
            color: '#fff',
            inlineSize: 'max-content',
            width: '100%',
            borderRadius: 2,
          }}
        >
          Manual Assign Tasks
        </Button>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Manual Tasks Assign</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="task_ids"
              label="Task IDs (comma-separated) *"
              variant="outlined"
              margin="dense"
              value={formData.task_ids}
              onChange={handleChange}
              required
            />

            {/* User dropdown instead of free text */}
            <TextField
              select
              fullWidth
              name="user_id"
              label="Select User *"
              variant="outlined"
              margin="dense"
              value={formData.user_id}
              onChange={handleChange}
              required
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username || user.email || `User ${user.id}`}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              name="annotation_type"
              label="Annotation Type *"
              variant="outlined"
              margin="dense"
              value={formData.annotation_type}
              onChange={handleChange}
              required
            >
              <MenuItem value={1}>Annotation</MenuItem>
              <MenuItem value={2}>Review</MenuItem>
              <MenuItem value={3}>Supercheck</MenuItem>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: '#2C2799', color: '#fff' }}
          >
            Allocate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TasksassignDialog;
