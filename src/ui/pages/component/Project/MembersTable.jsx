// MembersTable

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddUsersDialog from "../common/AddUsersDialog";
import InviteUsersDialog from "../common/InviteUsersDialog";
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import AddMembersToProjectAPI from "../../../../redux/actions/api/ProjectDetails/AddMembersToProject";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import addUserTypes from "../../../../constants/addUserTypes";
import { useNavigate, useParams } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import RemoveProjectMemberAPI from '../../../../redux/actions/api/ProjectDetails/RemoveProjectMember';
import RemoveProjectReviewerAPI from '../../../../redux/actions/api/ProjectDetails/RemoveProjectReviewer';
import CustomizedSnackbars from "../../component/common/Snackbar";


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
    jumpToPage: true,
};

const addLabel = {
    organization: "Invite Users to Organization",
    [addUserTypes.PROJECT_ANNOTATORS]: "Add Annotators to Project",
    [addUserTypes.PROJECT_REVIEWER]: "Add Reviewers to Project",
}

const MembersTable = (props) => {
    const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
    const { orgId, id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userRole, setUserRole] = useState();
    const [loading, setLoading] = useState(false);
    const { dataSource, hideButton, onRemoveSuccessGetUpdatedMembers } = props;
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });
    const userDetails = useSelector(state=>state.fetchLoggedInUserData.data);
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const apiLoading = useSelector(state => state.apiStatus.loading);
    
    useEffect(() => {
        userDetails && setUserRole(userDetails.role);
    }, [])

    const handleUserDialogClose = () => {
        setAddUserDialogOpen(false);
    };

    const handleUserDialogOpen = () => {
        setAddUserDialogOpen(true);
    };
    // const Projectdata = ProjectDetails && ProjectDetails.filter((el,i)=>{
    //     return [
    //                 el.email, 
                  
    //             ]
    // });
    const handleProjectMember = async(email) =>{
        const projectObj = new RemoveProjectMemberAPI(id,{email:email});
        dispatch(APITransport(projectObj));
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
            })
            onRemoveSuccessGetUpdatedMembers()
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
      
    }
    const handleProjectReviewer=async(Projectid)=>{
      const projectReviewer={
        id:Projectid,
      }
        const projectObj = new RemoveProjectReviewerAPI(id,projectReviewer);
        dispatch(APITransport(projectObj));
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
            })
            onRemoveSuccessGetUpdatedMembers()
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }
    useEffect(() => {
        setLoading(apiLoading);
      }, [apiLoading])

    const projectlist=(el)=>{
        let temp=false;
        ProjectDetails?.frozen_users.forEach((em)=>{
        if(el==em.id){
           temp=true
        }
      })
         return temp;
    }
    const data =
        dataSource && dataSource.length > 0
            ? dataSource.map((el, i) => {
                const userRole = el.role && UserMappedByRole(el.role).element;
                
            
                
                return [
                    el.username,
                    el.email,
                    userRole ? userRole : el.role,
                    <> 
                    <CustomButton
                        sx={{ p: 1, borderRadius: 2 }}
                        onClick={() => {
                            navigate(`/profile/${el.id}`);
                        }}
                        label={"View"}
                    />
                   
                            {props.type === addUserTypes.PROJECT_ANNOTATORS &&
                             <CustomButton
                                sx={{borderRadius : 2,backgroundColor:"#cf5959",m:1}}
                                label = "Remove"
                                onClick={()=>handleProjectMember(el.email)}
                                disabled={projectlist(el.id)}
                            
                            />}
                             {props.type === addUserTypes.PROJECT_REVIEWER &&
                             <CustomButton
                                sx={{borderRadius : 2,backgroundColor:"#cf5959",m:1}}
                                label = "Remove"
                                onClick={()=>handleProjectReviewer(el.id)}
                                disabled={projectlist(el.id)}
                            />}
                            </>

                ];
            })
            : [];
            const options = {
                textLabels: {
                  body: {
                    noMatch: "No records",
                  },
                  toolbar: {
                    search: "Search",
                    viewColumns: "View Column",
                  },
                  pagination: { rowsPerPage: "Rows per page" },
                  options: { sortDirection: "desc" },
                },
                // customToolbar: fetchHeaderButton,
                displaySelectToolbar: false,
                fixedHeader: false,
                filterType: "checkbox",
                download: false,
                print: false,
                rowsPerPageOptions: [10, 25, 50, 100],
                // rowsPerPage: PageInfo.count,
                filter: false,
                // page: PageInfo.page,
                viewColumns: false,
                selectableRows: "none",
                search: false,
                jumpToPage: true,
              };
              const renderSnackBar = () => {
                return (
                    <CustomizedSnackbars
                        open={snackbar.open}
                        handleClose={() =>
                            setSnackbarInfo({ open: false, message: "", variant: "" })
                        }
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        variant={snackbar.variant}
                        message={snackbar.message}
                    />
                );
            };

    return (
        <React.Fragment>
            {userRole !== 1 && !hideButton ?
            <CustomButton
                sx={{ borderRadius: 2, mb: 3, whiteSpace: "nowrap" }}
                startIcon={<PersonAddAlt />}
                label={props.type ? addLabel[props.type] : "Add Users"}
                fullWidth
                onClick={handleUserDialogOpen}
            /> : null
            }
            {props.type === "organization" ?  
                <InviteUsersDialog
                    handleDialogClose={handleUserDialogClose}
                    isOpen={addUserDialogOpen}
                    id={orgId}
                />
                : 
                <AddUsersDialog
                    handleDialogClose={handleUserDialogClose}
                    isOpen={addUserDialogOpen}
                    userType={props.type}
                    id={id}
                />
            }
            {renderSnackBar()}
            <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                    // filter={false}
                />
            </ThemeProvider>
        </React.Fragment>
    );
};

export default MembersTable;
