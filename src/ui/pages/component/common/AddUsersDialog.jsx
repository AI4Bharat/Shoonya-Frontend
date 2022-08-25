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
import id from "date-fns/esm/locale/id/index.js";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import addUserTypes from "../../../../constants/addUserTypes";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
import AddMembersToProjectAPI from "../../../../redux/actions/api/ProjectDetails/AddMembersToProject";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import AddAnnotatorsToWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/AddAnnotatorsToWorkspace";
import AssignManagerToWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/AssignManagerToWorkspace";
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
import AddProjectReviewersAPI from "../../../../redux/actions/api/ProjectDetails/AddProjectReviewers";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import CustomButton from "./Button";

const DialogHeading = {
  [addUserTypes.ANNOTATOR]: 'Add Annotators',
  [addUserTypes.MANAGER]: 'Assign Manager',
  [addUserTypes.PROJECT_ANNOTATORS]: 'Add Project Annotators',
  [addUserTypes.PROJECT_REVIEWER]: 'Add Project Reviewers',
}

// fetch all users in the current organization/workspace
const fetchAllUsers = (userType, id, dispatch) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
    case addUserTypes.PROJECT_REVIEWER:
      const workspaceAnnotatorsObj = new GetWorkspacesAnnotatorsDataAPI(id);
      dispatch(APITransport(workspaceAnnotatorsObj));
      break;
    case addUserTypes.ANNOTATOR:
    case addUserTypes.MANAGER:
      const organizationUsersObj = new GetOragnizationUsersAPI(id);
      dispatch(APITransport(organizationUsersObj));
      break;
    default:
      break;
  }
}

const getAvailableUsers = (userType, projectDetails, workspaceAnnotators, workspaceManagers, orgUsers) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
      return workspaceAnnotators
        .filter(
          (workspaceAnnotator) =>
            projectDetails?.annotators.findIndex(
              (projectUser) => projectUser?.id === workspaceAnnotator?.id
            ) === -1
        )
        .map((user) => ({ id: user.id, email: user.email, username: user.username }));
      break;
      case addUserTypes.PROJECT_REVIEWER:
        return workspaceAnnotators
          .filter(
            (workspaceAnnotator) =>
              projectDetails?.annotation_reviewers.findIndex(
                (projectUser) => projectUser?.id === workspaceAnnotator?.id
              ) === -1
          )
          .map((user) => ({ id: user.id, email: user.email, username: user.username }));
        break;
    case addUserTypes.ANNOTATOR:
      return orgUsers
        ?.filter(
          (orgUser) =>
            workspaceAnnotators.findIndex(
              (annotator) => annotator?.id === orgUser?.id
            ) === -1
        )
        .map((user) => ({ email: user.email, username: user.username, id: user.id }));
      break;
    case addUserTypes.MANAGER:
      return orgUsers
        ?.filter(
          (orgUser) =>
            workspaceManagers.findIndex(
              (manager) => manager?.id === orgUser?.id
            ) === -1
        )
        .map((user) => ({ id: user.id, email: user.email, username: user.username }));
      break;
    default:
      break;
  }
}

const handleAddUsers = async (userType, users, id, dispatch) => {
  switch (userType) {
    case addUserTypes.PROJECT_ANNOTATORS:
      const addMembersObj = new AddMembersToProjectAPI(
        id,
        users.map((user) => user.id),
      );
      const res = await fetch(addMembersObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addMembersObj.getBody()),
        headers: addMembersObj.getHeaders().headers,
      });

      const resp_data = await res.json();

      if (res.ok) {
        const projectObj = new GetProjectDetailsAPI(id);
        dispatch(APITransport(projectObj));
        return resp_data;
      }
      break;

      case addUserTypes.PROJECT_REVIEWER:
        const addReviewersObj = new AddProjectReviewersAPI(
          id,
          users.map((user) => user.id),
        );
        const reviewerRes = await fetch(addReviewersObj.apiEndPoint(), {
          method: "POST",
          body: JSON.stringify(addReviewersObj.getBody()),
          headers: addReviewersObj.getHeaders().headers,
        });
  
        const reviewerRespData = await reviewerRes.json();
  
        if (reviewerRes.ok) {
          const projectObj = new GetProjectDetailsAPI(id);
          dispatch(APITransport(projectObj));
          return reviewerRespData;
        }
        break;

    case addUserTypes.ANNOTATOR:
      const addAnnotatorsObj = new AddAnnotatorsToWorkspaceAPI(
        id,
        users.map((user) => user.id).join(','),
      );
      const addAnnotatorsRes = await fetch(addAnnotatorsObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addAnnotatorsObj.getBody()),
        headers: addAnnotatorsObj.getHeaders().headers,
      });

      const addAnnotatorsRespData = await addAnnotatorsRes.json();

      if (addAnnotatorsRes.ok) {
        const workspaceAnnotatorsObj = new GetWorkspacesAnnotatorsDataAPI(id);
        dispatch(APITransport(workspaceAnnotatorsObj));
        return addAnnotatorsRespData;
      }
      break;

    case addUserTypes.MANAGER:
      const addManagerObj = new AssignManagerToWorkspaceAPI(
        id,
        [users.id],
      );
      const assignManagerRes = await fetch(addManagerObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addManagerObj.getBody()),
        headers: addManagerObj.getHeaders().headers,
      });

      const assignManagerRespData = await assignManagerRes.json();

      if (assignManagerRes.ok) {
        const workspaceDetailsObj = new GetWorkspacesDetailsAPI(id);
        dispatch(APITransport(workspaceDetailsObj));
        return assignManagerRespData;
      }
      break;
    default:
      break;
  }
};

const AddUsersDialog = ({
  handleDialogClose,
  isOpen,
  userType,
  id,
}) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(userType === addUserTypes.MANAGER ? null : []);
  const [loading, setLoading] = useState(false);
  const projectDetails = useSelector((state) => state.getProjectDetails?.data);
  const workspaceAnnotators = useSelector((state) => state.getWorkspacesAnnotatorsData?.data);
  // const workspaceManagers = useSelector((state) => state.getWorkspacesManagersData?.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails?.data);
  const orgUsers = useSelector((state) => state.getOrganizationUsers?.data);
  const dispatch = useDispatch();

  useEffect(() => {
    let id = '';
    switch (userType) {
      case addUserTypes.PROJECT_ANNOTATORS:
      case addUserTypes.PROJECT_REVIEWER:
        id = projectDetails?.workspace_id;
        break;
      case addUserTypes.ANNOTATOR:
      case addUserTypes.MANAGER:
        id = workspaceDetails?.organization;
        break;
      default:
        break;
    }
    if (id) fetchAllUsers(userType, id, dispatch);
  }, [userType, id, projectDetails])

  useEffect(() => {
    setAvailableUsers(getAvailableUsers(userType, projectDetails, workspaceAnnotators, workspaceDetails?.managers, orgUsers));
    console.log(getAvailableUsers(userType, projectDetails, workspaceAnnotators, orgUsers));
  }, [projectDetails, workspaceAnnotators, workspaceDetails, orgUsers])

  const addBtnClickHandler = async () => {
    setLoading(true);
    const res = await handleAddUsers(userType, selectedUsers, id, dispatch);
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
      <DialogTitle style={{ paddingBottom: 0 }}>{DialogHeading[userType]}</DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16} marginBottom={2}>
          Select users to be added.
        </DialogContentText>
        <Autocomplete
          multiple={userType !== addUserTypes.MANAGER}
          limitTags={3}
          onChange={(e, newVal) => setSelectedUsers(newVal)}
          options={availableUsers}
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
          sx={{ width: "100%" }}
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
          disabled={loading || selectedUsers === null || selectedUsers?.length === 0}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddUsersDialog;
