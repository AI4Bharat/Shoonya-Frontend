import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
  import React from "react";
  
  const FindAndReplaceDialog = ({ OpenFindAndReplaceDialog, handleCloseFindAndReplace, submit, find,replace,selectedFilters,Type }) => {
    return (
      <Dialog
        open={OpenFindAndReplaceDialog}
        onClose={handleCloseFindAndReplace}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { borderRadius: "10px" } }}
      >
         <DialogTitle id="deallocate-dialog-title">
                  {"Find And Replace"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                  This will change<snap style={{ color: "#1DA3CE" }}> {find}</snap> to <snap style={{ color: "#1DA3CE" }}>{replace}</snap> in all <snap style={{ color: "#1DA3CE" }}> {Type === "annotation"
                        ? selectedFilters.annotation_status
                        : selectedFilters.review_status} tasks </snap> in this project. Are you sure you want to proceed ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseFindAndReplace}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={submit}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
       
      </Dialog>
    );
  };
  
  export default FindAndReplaceDialog;
  