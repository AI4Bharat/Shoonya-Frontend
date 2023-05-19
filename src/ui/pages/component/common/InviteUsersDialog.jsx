import { Add } from "@material-ui/icons";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import CustomButton from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import UserRolesList from "../../../../utils/UserMappedByRole/UserRolesList";

const InviteUsersDialog = ({
    handleDialogClose,
    isOpen,
    selectedUsers,
    setSelectedUsers,
    userType,
    setUserType,
    addBtnClickHandler,
    loading
}) => {


      const dialogCloseHandler = () => {
        handleDialogClose();
      };

    return (
        <Dialog open={isOpen} onClose={dialogCloseHandler} close>
          <DialogTitle style={{ paddingBottom: 0 }}>Invite users to organization</DialogTitle>
          <DialogContent>
            <Autocomplete
                fullWidth
                multiple
                id="tags-filled"
                options={[]}
                freeSolo
                value={selectedUsers}
                onChange={(e, newVal) => setSelectedUsers(newVal)}
                renderTags={(value, getTagProps) =>
                value?.map((option, index) => (
                    <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    />
                ))
                }
                sx={{mt: 3, mb: 3}}
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Enter email ids of users to invite        "
                    placeholder="Email ids"
                />
                )}
            />
            <FormControl 
                variant="outlined" 
                fullwidth
                sx={{width: "100%"}}
            >
                <InputLabel id="role-label">Select user role</InputLabel>
                <Select
                    labelId="role-label"
                    id="role-select"
                    fullWidth
                    variant="outlined"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    label="Select user role"
                >
                    {Object.keys(UserRolesList).map((el) => (
                        <MenuItem key={el} value={el}>
                            {UserRolesList[el]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
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
              disabled={loading || selectedUsers === null || selectedUsers?.length === 0}
            />
          </DialogActions>
        </Dialog>
      );
}

export default InviteUsersDialog;