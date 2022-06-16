// MembersTable

import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddUsersDialog from "../common/AddUsersDialog";
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import AddMembersToProjectAPI from "../../../../redux/actions/api/ProjectDetails/AddMembersToProject";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";

const columns = [
  {
    name: "Name",
    label: "Name",
    options: {
      filter: false,
      sort: false,
      align: "center",
    },
  },
  {
    name: "Email",
    label: "Email",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Role",
    label: "Role",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "Actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
    },
  },
];

const options = {
  filterType: "checkbox",
  selectableRows: "none",
  download: false,
  filter: false,
  print: false,
  search: false,
  viewColumns: false,
};

const MembersTable = (props) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = React.useState(false);
  const projectDetails = useSelector((state) => state.getProjectDetails?.data);
  const workspaceUsers = useSelector(
    (state) => state.getWorkspacesAnnotatorsData?.data
  );
  const [usersToBeAdded, setUsersToBeAdded] = React.useState([]);

  const dispatch = useDispatch();
  const { dataSource } = props;

  const handleUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const handleUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleAddUsers = async (users) => {
    const userEmails = users.map((user) => user.email);
    const addMembersObj = new AddMembersToProjectAPI(
      projectDetails?.id,
      userEmails
    );

    const res = await fetch(addMembersObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(addMembersObj.getBody()),
      headers: addMembersObj.getHeaders().headers,
    });

    const resp_data = await res.json();

    if (res.ok) {
      const projectObj = new GetProjectDetailsAPI(projectDetails?.id);
      dispatch(APITransport(projectObj));
      return resp_data;
    }
  };

  const getWorkspaceUsers = async (id) => {
    const workspaceAnnotatorsObj = new GetWorkspacesAnnotatorsDataAPI(id);
    await dispatch(APITransport(workspaceAnnotatorsObj));
  };

  React.useEffect(() => {
    if (projectDetails) getWorkspaceUsers(projectDetails?.workspace_id);
  }, [projectDetails]);

  React.useEffect(() => {
    if (workspaceUsers.length > 0) {
      const availableUsers = workspaceUsers
        .filter(
          (workspaceUser) =>
            projectDetails.users.findIndex(
              (projectUser) => projectUser.id === workspaceUser.id
            ) === -1
        )
        .map((user) => ({ email: user.email, username: user.username }));
      setUsersToBeAdded(availableUsers);
    }
  }, [workspaceUsers]);

  const data =
    dataSource && dataSource.length > 0
      ? dataSource.map((el, i) => {
          const userRole = el.role && UserMappedByRole(el.role).element;
          return [
            el.username,
            el.email,
            userRole ? userRole : el.role,
            <CustomButton
              sx={{ p: 1, borderRadius: 2 }}
              onClick={() => {
                console.log(el.id);
              }}
              label={"View"}
            />,
          ];
        })
      : [];

  return (
    <React.Fragment>
      <CustomButton
        sx={{ borderRadius: 2, mb: 3, whiteSpace: "nowrap" }}
        startIcon={<PersonAddAlt />}
        label="Add Users to Project"
        fullWidth
        onClick={handleUserDialogOpen}
      />
      <AddUsersDialog
        handleDialogClose={handleUserDialogClose}
        isOpen={addUserDialogOpen}
        users={usersToBeAdded}
        handleAddUser={handleAddUsers}
      />
      <MUIDataTable
        title={""}
        data={data}
        columns={columns}
        options={options}
        // filter={false}
      />
    </React.Fragment>
  );
};

export default MembersTable;
