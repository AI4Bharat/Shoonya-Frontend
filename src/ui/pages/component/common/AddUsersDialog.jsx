import { Add } from "@material-ui/icons";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CustomButton from "./Button";

const AddUsersDialog = ({
  handleDialogClose,
  handleAddUser,
  isOpen,
  users,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const addBtnClickHandler = async () => {
    setLoading(true);
    const res = await handleAddUser(selectedUsers);
    setLoading(false);

    if (res) {
      dialogCloseHandler();
    }
  };

  const dialogCloseHandler = () => {
    setSelectedUsers([]);
    handleDialogClose();
  };

  return (
    <Dialog open={isOpen} onClose={dialogCloseHandler} close>
      <DialogTitle style={{ paddingBottom: 0 }}>Add Users</DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} marginBottom={2}>
          Select users to be added.
        </DialogContentText>
        <Autocomplete
          multiple
          limitTags={3}
          onChange={(e, newVal) => setSelectedUsers(newVal)}
          options={users}
          value={selectedUsers}
          style={{ fontSize: "1rem", paddingTop: 4, paddingBottom: 4 }}
          getOptionLabel={(option) => option.username}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Users..."
              style={{ fontSize: "1rem" }}
              size="small"
              placeholder="Add Users"
            />
          )}
          sx={{ width: "500px" }}
        />
      </DialogContent>
      <DialogActions style={{ padding: 24 }}>
        <Button onClick={dialogCloseHandler} size="small">
          Cancel
        </Button>
        <CustomButton
          startIcon={
            !loading ? (
              <Add />
            ) : (
              <CircularProgress size="0.8rem" color="secondary" />
            )
          }
          onClick={addBtnClickHandler}
          size="small"
          label="Add"
          disabled={loading || selectedUsers.length === 0}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddUsersDialog;
