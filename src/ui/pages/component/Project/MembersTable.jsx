import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import MUIDataTable from "mui-datatables";
import CustomButton from "../common/Button";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import { PersonAddAlt } from "@mui/icons-material";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddUsersDialog from "../common/AddUsersDialog";
import InviteUsersDialog from "../common/InviteUsersDialog";
import addUserTypes from "../../../../constants/addUserTypes";
import { useNavigate, useParams } from "react-router-dom";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import tableTheme from "../../../theme/tableTheme";
import RemoveProjectMemberAPI from "../../../../redux/actions/api/ProjectDetails/RemoveProjectMember";
import RemoveProjectReviewerAPI from "../../../../redux/actions/api/ProjectDetails/RemoveProjectReviewer";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import ResendUserInviteAPI from "../../../../redux/actions/api/Organization/ResendUserInvite";
import UserRolesList from "../../../../utils/UserMappedByRole/UserRolesList";
import InviteUsersToOrgAPI from "../../../../redux/actions/api/Organization/InviteUsersToOrgAPI";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
import RemoveFrozenUserAPI from "../../../../redux/actions/api/ProjectDetails/RemoveFrozenUser";
import userRoles from "../../../../utils/UserMappedByRole/Roles";
import TextField from '@mui/material/TextField';
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import RejectManagerSuggestionsAPI from "../../../../redux/actions/api/Organization/RejectManagerSuggestions";
import ApproveManagerSuggestionsAPI from "../../../../redux/actions/api/Organization/ApproveManagerSuggestions";
import { getManagerSuggestions } from "../Tabs/Invites";

const addLabel = {
  dataset:"Add Members to Dataset",
  organization: "Invite Users to Organization",
  [addUserTypes.PROJECT_ANNOTATORS]: "Add Annotators to Project",
  [addUserTypes.PROJECT_REVIEWER]: "Add Reviewers to Project",
  [addUserTypes.PROJECT_SUPERCHECKER]: "Add SuperChecker to Project",
};


const MembersTable = (props) => {
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const { orgId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState();
  const [loading, setLoading] = useState(false);
  const {
    dataSource,
    hideButton,
    showInvitedBy,
    onRemoveSuccessGetUpdatedMembers,
    reSendButton,
    approveButton,
    rejectButton,
    hideViewButton,
  } = props;

 
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [btn,setbtn] = useState(null);
  const [value,setvalue] = useState();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userType, setUserType] = useState(Object.keys(UserRolesList)[0]);
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const SearchWorkspaceMembers = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector('.MuiDataTable-responsiveBase');
        if (tableWrapper) {
          tableWrapper.classList.add('MuiDataTable-vertical');
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);
  const columns = [
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" ,            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
},
        }),
      },
    },
    {
      name: "Email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        setCellProps: () => ({ 
          style: {
            height: "70px", fontSize: "16px",
          padding: "16px",
          whiteSpace: "normal", 
          overflowWrap: "break-word",
          wordBreak: "break-word",  
        } 
        }),
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
  
  if(showInvitedBy){
      columns.splice(3, 0, {
        name: "Invited By",
        label: "Invited By",
        options: {
          filter: false,
          sort: false,
        },
      });
  }
  const pageSearch = () => {
    return dataSource.filter((el) => {
      if (SearchWorkspaceMembers == "") {
        return el;
      } else if (
        el.username
          ?.toLowerCase()
          .includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchWorkspaceMembers?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  useEffect(() => {
    userDetails && setUserRole(userDetails.role);
  }, []);

  const handleApproveUser=(userId)=>{
    const projectObj = new ApproveManagerSuggestionsAPI(userId);
    dispatch(APITransport(projectObj));
    getManagerSuggestions(dispatch,orgId);
  }

  const handleRejectUser=(userId)=>{
    const projectObj = new RejectManagerSuggestionsAPI(userId);
    dispatch(APITransport(projectObj));
    getManagerSuggestions(dispatch,orgId);

  }
  const handleUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const handleUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };

  const handleProjectMember = async (userid) => {
    const projectObj = new RemoveProjectMemberAPI(id, { ids: [userid] });
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
      });
      onRemoveSuccessGetUpdatedMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };
  const handleProjectReviewer = async (Projectid) => {
    let projectObj 
    if(props.type === addUserTypes.PROJECT_REVIEWER){
      projectObj = new RemoveProjectReviewerAPI(id, { ids: [Projectid] },props.type);
    }else if(props.type === addUserTypes.PROJECT_SUPERCHECKER){
       projectObj = new RemoveProjectReviewerAPI(id, { ids: [Projectid] },props.type);
    }


   
    // dispatch(APITransport(projectObj));
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
      });
      onRemoveSuccessGetUpdatedMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const handleResendUser = async(email) => {
    const projectObj = new ResendUserInviteAPI(email=[email]);
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
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }

  };

  const addBtnClickHandler = async () => {
    setLoading(true);
  
    try {
        const addMembersObj = new InviteUsersToOrgAPI(
        orgId,
        selectedUsers,
        userType
      );
      const res = await fetch(addMembersObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addMembersObj.getBody()),
        headers: addMembersObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "success",
        });
        const orgObj = new GetOragnizationUsersAPI(id);
        dispatch(APITransport(orgObj));
      } else {
        throw new Error(resp?.message || "Something went wrong!");
      }
    } catch (error) {
      setSnackbarInfo({
        open: true,
        message: error.message,
        variant: "error",
      });
    } finally {
      handleUserDialogClose();
    setLoading(false);
    setSelectedUsers([ ]);
    setSelectedEmails([]);
    setCsvFile(null);
    setbtn(null)
    setUserType(Object.keys(UserRolesList)[0])
    }
  };

  const handleRemoveFrozenUsers = async (FrozenUserId) => {
    const projectObj = new RemoveFrozenUserAPI(id, { ids: [FrozenUserId] });
    //dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    // setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
      onRemoveSuccessGetUpdatedMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };


  
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

 
  const projectlist = (el) => {
    let temp = false;
    ProjectDetails?.frozen_users?.forEach((em) => {
      if (el == em.id) {
        temp = true;
      }
    });
    return temp;
  };
  const data =
    dataSource && dataSource.length > 0
      ? pageSearch().map((el, i) => {
          const userRole = el.role && UserMappedByRole(el.role).element;

          return [
            el.username,
            el.email,
            userRole ? userRole : el.role,
            ...(showInvitedBy ? [el.invited_by] : []),

            <>  
                 {!hideViewButton && (
                <CustomButton
                  sx={{ m: 1, borderRadius: 2 }}
                  onClick={() => {
                    navigate(`/profile/${el.id}`);
                  }}
                  label={"View"}
                />
              )}
              {(userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && props.type === addUserTypes.PROJECT_ANNOTATORS) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("member");}}
                  disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}
              {userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && (props.type === addUserTypes.PROJECT_REVIEWER) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("reviewer");}}
                  disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}
              {userRoles.WorkspaceManager === loggedInUserData?.role || userRoles.OrganizationOwner === loggedInUserData?.role || userRoles.Admin === loggedInUserData?.role && (props.type === addUserTypes.PROJECT_SUPERCHECKER) && (
                <CustomButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#cf5959",
                    m: 1,
                    height: "40px",
                  }}
                  label="Remove"
                  onClick={() => {setElId(el.id); setElEmail(el.email); setConfirmationDialog(true); setMemberOrReviewer("superchecker");}}
                  disabled={projectlist(el.id)|| ProjectDetails.is_archived}
                />
              )}
              

           {projectlist(el.id) &&(
                <CustomButton
                    sx={{ m:1, borderRadius: 2}}
                    label="Add"
                    onClick={() => handleRemoveFrozenUsers(el.id)}
                    disabled = {ProjectDetails.is_archived}
                  />
                )} 

              {reSendButton && (
                <CustomButton
                  sx={{  m: 1, borderRadius: 2 }}
                  onClick={() => handleResendUser(el.email)}
                  label={"Resend"}
                />
              )}
              {
                approveButton && (
                  <CustomButton
                    sx={{  m: 1, borderRadius: 2 }}
                    onClick={() => handleApproveUser(el.id)}
                    label={"Approve"}
                  />
                )
              }
              {
                rejectButton && (
                  <CustomButton
                    sx={{  m: 1, borderRadius: 2, backgroundColor: "#cf5959"}}
                    color="error"
                    onClick={() => handleRejectUser(el.id)}
                    label={"Reject"}
                  />
                )
              }

              
            </>,
          ];
        })
      : [];

      const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", 
              justifyContent: { 
                xs: "space-between", 
                md: "flex-end" 
              }, 
              alignItems: "center",
              padding: "10px",
              gap: { 
                xs: "10px", 
                md: "20px" 
              }, 
            }}
          >

            {/* Pagination Controls */}
            <TablePagination
              component="div"
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => changePage(newPage)}
              onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
              sx={{
                "& .MuiTablePagination-actions": {
                marginLeft: "0px",
              },
              "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
                marginRight: "10px",
              },
              }}
            />

            {/* Jump to Page */}
            <div>
              <label style={{ 
                marginRight: "5px", 
                fontSize:"0.83rem", 
              }}>
              Jump to Page:
              </label>
              <Select
                value={page + 1}
                onChange={(e) => changePage(Number(e.target.value) - 1)}
                sx={{
                  fontSize: "0.8rem",
                  padding: "4px",
                  height: "32px",
                }}
              >
                {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
                  <MenuItem key={i} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Box>
        );
      };

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
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
    responsive: "vertical",
    enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [elEmail, setElEmail] = useState("");
  const [elId, setElId] = useState("");
  const emailId = localStorage.getItem("email_id");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [memberOrReviewer, setMemberOrReviewer] = useState("");
  const handleConfirm = async () => {
    if (memberOrReviewer === "member" || memberOrReviewer === "reviewer"){
      const apiObj = new LoginAPI(emailId, password);
      const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
      });
      if (res.ok) {
        if(memberOrReviewer === "member"){
        handleProjectMember(elId);
      }else if(memberOrReviewer === "reviewer"){
        handleProjectReviewer(elId);
      }
        setConfirmationDialog(false);
      }else{
        window.alert("Invalid credentials, please try again");
      }}
    else if(memberOrReviewer === "superchecker"){
      if(pin === "0104"){
        handleProjectReviewer(elId);
        setConfirmationDialog(false);
      }else{
        window.alert("Incorrect pin entered");
      }
    }
  };
  return (
    <React.Fragment>
      {userRole !== 1 && !hideButton ? (
        <CustomButton
          sx={{ borderRadius: 2, whiteSpace: "nowrap" }}
          startIcon={<PersonAddAlt />}
          label={props.type ? addLabel[props.type] : "Add Users"}
          fullWidth
          onClick={handleUserDialogOpen}
          disabled={props.type === addUserTypes.PROJECT_ANNOTATORS||props.type === addUserTypes.PROJECT_REVIEWER  || props.type === addUserTypes.PROJECT_SUPERCHECKER ?ProjectDetails.is_archived:""}
        />
      ) : null}

              <Dialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
              >
                <DialogTitle id="dialog-title">
                  {"Remove Member from Project?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {elEmail} will be removed from this project. Please be careful as
                    this action cannot be undone.
                  </DialogContentText>
                {(memberOrReviewer === "member" || memberOrReviewer === "reviewer") &&
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPassword(e.target.value)}
                  />}
                  {memberOrReviewer === "superchecker" &&
                  <TextField
                    autoFocus
                    margin="dense"
                    id="pin"
                    label="Pin"
                    type="pin"
                    fullWidth
                    variant="standard"
                    onChange={(e) => setPin(e.target.value)}
                  />}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setConfirmationDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
  
      {props.type === "organization" ? (
        <InviteUsersDialog
          handleDialogClose={handleUserDialogClose}
          isOpen={addUserDialogOpen}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          userType={userType}
          setUserType={setUserType}
          addBtnClickHandler={()=>addBtnClickHandler()}
          loading={loading}
          selectedEmails={selectedEmails}
          setSelectedEmails={setSelectedEmails}
          csvFile={csvFile}
          setCsvFile={setCsvFile}
          btn={btn}
          setbtn={setbtn}
          value={value}
          setvalue={setvalue}
        />
      ) : (
        <AddUsersDialog
          handleDialogClose={handleUserDialogClose}
          isOpen={addUserDialogOpen}
          userType={props.type}
          id={id}
        />
      )}
      {renderSnackBar()}
        <Grid sx={{ mb: 1 }}>
          <Search />
        </Grid>

      <ThemeProvider theme={tableTheme} sx={{ marginTop: "20px" }}>
      <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={data}
              columns={columns}
              options={options}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                mx: 2,
                my: 3,
                borderRadius: '4px',
                transform: 'none'
              }}
            />
          )}
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default MembersTable;
