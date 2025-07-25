import React, { useState } from 'react';
import {
    TextField, Button, Grid, MenuItem,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // ✅ React Router hook

// 🔁 Replace this with correct import if not using alias
import configs from '../../../../config/config'; // adjust path if needed

const AssignTasksDialog = () => {
    const { id } = useParams(); // ✅ Get project_id from URL
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('success');
    const [formData, setFormData] = useState({
        user_id: '',
        task_ids: '',
        annotation_type: '',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({
            user_id: '',
            task_ids: '',
            annotation_type: '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user_id: parseInt(formData.user_id.trim()),
            task_ids: formData.task_ids
                .split(',')
                .map((id) => parseInt(id.trim()))
                .filter((id) => !isNaN(id)),
            annotation_type: parseInt(formData.annotation_type),
        };

        setLoading(true);
        try {
            const res = await axios.post(
                `${configs.BASE_URL_AUTO}/projects/${id}/assign_tasks_to_user/`,
                payload,
                {
                    headers: {
                        Authorization: `JWT ${localStorage.getItem('shoonya_access_token')}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            setResponseMessage(res.data.message || 'Tasks assigned successfully.');
            setResponseType('success');
            handleClose();
        } catch (err) {
            setResponseMessage(err.response?.data?.message || 'Error assigning tasks.');
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
                        '&:hover': { backgroundColor: '#2C2799' },
                    }}
                >
                    Assign Tasks to User
                </Button>
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Assign Tasks</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            name="user_id"
                            label="User ID"
                            variant="outlined"
                            margin="dense"
                            value={formData.user_id}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            name="task_ids"
                            label="Task IDs (comma-separated)"
                            variant="outlined"
                            margin="dense"
                            value={formData.task_ids}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            select
                            name="annotation_type"
                            label="Annotation Type"
                            variant="outlined"
                            margin="dense"
                            value={formData.annotation_type}
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value={1}>Annotator</MenuItem>
                            <MenuItem value={2}>Reviewer</MenuItem>
                            <MenuItem value={3}>Superchecker</MenuItem>
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
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ top: '30% !important', left: '50% !important', transform: 'translate(-50%, -50%)' }}
            >
                <Alert
                    severity={responseType}
                    onClose={() => setResponseMessage('')}
                    sx={{
                        width: '100%',
                        backgroundColor: responseType === 'success' ? '#2C2799' : '#2C2799',
                        color: '#fff',
                        fontWeight: 'bold',

                    }}
                >
                    {responseMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AssignTasksDialog;
