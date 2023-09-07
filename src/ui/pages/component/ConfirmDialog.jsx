import React from "react";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import Loader from "./common/Spinner";

const ConfirmDialog = ({
  openDialog,
  handleClose,
  submit,
  message,
  loading,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: "20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => submit()}
          autoFocus
          sx={{ lineHeight: "1", borderRadius: "8px" }}
        >
          Complete
          {loading && <Loader size={20} margin="0 0 0 5px" color="secondary" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
