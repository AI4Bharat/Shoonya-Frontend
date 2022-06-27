// MembersTable

import React, { useEffect, useState } from "react";
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
import addUserTypes from "../../../../constants/addUserTypes";

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
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const projectDetails = useSelector((state) => state.getProjectDetails?.data);
    const [userRole, setUserRole] = useState();

    const { dataSource, hideButton } = props;

    const userDetails = useSelector(state=>state.fetchLoggedInUserData.data);

    useEffect(() => {
        userDetails && setUserRole(userDetails.role);
    }, [])

    const handleUserDialogClose = () => {
        setAddUserDialogOpen(false);
    };

    const handleUserDialogOpen = () => {
        setAddUserDialogOpen(true);
    };

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
            {userRole !== 1 || hideButton === true && <CustomButton
                sx={{ borderRadius: 2, mb: 3, whiteSpace: "nowrap" }}
                startIcon={<PersonAddAlt />}
                label="Add Users to Project"
                fullWidth
                onClick={handleUserDialogOpen}
            />}
            <AddUsersDialog
                handleDialogClose={handleUserDialogClose}
                isOpen={addUserDialogOpen}
                userType={addUserTypes.PROJECT_MEMBER}
                id={projectDetails?.id}
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
