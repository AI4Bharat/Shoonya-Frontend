import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import VerifyEmailAPI from "../../../../redux/actions/api/UserManagement/VerifyEmail";
import CustomButton from "../common/Button";
import OutlinedTextField from "../common/OutlinedTextField";
import Snackbar from "../common/Snackbar";

const UpdateEmailDialog = ({isOpen, handleClose, oldEmail, newEmail, onSuccess}) => {
  const [oldEmailCode, setOldEmailCode] = useState("");
  const [newEmailCode, setNewEmailCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});

  const verifyEmail = async () => {
    setLoading(true);
    const apiObj = new VerifyEmailAPI(oldEmailCode, newEmailCode);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      if (!res.ok) throw await res.json();
      else return await res.json();
    }).then((res) => {
      setSnackbarState({ open: true, message: res.message, variant: "success" });
      onSuccess();
      handleClose();
    }).catch((err) => {
        setSnackbarState({ open: true, message: err.message, variant: "error" });
        setLoading(false);
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} close fullWidth={true} maxWidth="sm">
      <DialogTitle style={{ paddingTop: "1.25rem" }}>
        <Typography variant="h4">
          Verify Email
        </Typography>
      </DialogTitle>
      <Grid container direction="column" sx={{ padding: "20px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography gutterBottom sx={{fontSize: "1rem"}}>
            Code received on {oldEmail}:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ pb: "20px" }}>
          <OutlinedTextField
            fullWidth
            value={oldEmailCode}
            onChange={(e) => setOldEmailCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></OutlinedTextField>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography gutterBottom sx={{fontSize: "1rem"}}>
            Code received on {newEmail}:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            value={newEmailCode}
            onChange={(e) => setNewEmailCode(e.target.value)}
            InputLabelProps={{ shrink: true }}
          ></OutlinedTextField>
        </Grid>
      </Grid>
      <DialogActions style={{ padding: 24 }}>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <CustomButton
          startIcon={loading && <CircularProgress size="0.8rem" color="secondary" />}
          onClick={verifyEmail}
          label="Verify"
          disabled={!(oldEmailCode && newEmailCode)}
        />
      </DialogActions>
      <Snackbar 
        {...snackbarState} 
        handleClose={()=> setSnackbarState({...snackbarState, open: false})} 
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        hide={2000}
      />
    </Dialog>
  );
};

export default UpdateEmailDialog;
