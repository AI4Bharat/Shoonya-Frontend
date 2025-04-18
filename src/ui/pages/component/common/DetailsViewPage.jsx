import {

  ThemeProvider,
} from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState, useEffect } from "react";
import themeDefault from "../../../theme/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../component/common/Button";
import DatasetStyle from "../../../styles/Dataset";
import componentType from "../../../../config/pageType";
import ProjectTable from "../Tabs/ProjectTable";
import AnnotatorsTable from "../Tabs/Annotators";
import ManagersTable from "../Tabs/ManagersTable";
import Workspaces from "../Tabs/Workspaces";
import CustomButton from "../../component/common/Button";
import { translate } from "../../../../config/localisation";
import Members from "../Tabs/Members";
import Invites from "../Tabs/Invites";
import OrganizationSettings from "../Tabs/OrganizationSettings";
import OrganizationReports from "../Organization/OrganizationReports";
import WorkspaceReports from "./WorkspaceReports";
import AddUsersDialog from "./AddUsersDialog";
import addUserTypes from "../../../../constants/addUserTypes";
import AddWorkspaceDialog from "../Workspace/AddWorkspaceDialog";
import Spinner from "../../component/common/Spinner";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useSelector, useDispatch } from "react-redux";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TaskAnalytics from "../../container/Progress/Workspace/TaskAnalytics";
import MetaAnalytics from "../../container/Progress/Workspace/MetaAnalytics";
import ProgressAnalytics from "../../container/Progress/Workspace/ProgressAnalytics";
import PerformanceAnalytics from "../../container/Progress/Workspace/PerformanceAnalytics";
import InviteUsersDialog from "./InviteUsersDialog";
import UserRolesList from "../../../../utils/UserMappedByRole/UserRolesList";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers"
import InviteManagerSuggestions from "../../../../redux/actions/api/Organization/InviteManagerSuggestions";
import InviteUsersToOrgAPI from "../../../../redux/actions/api/Organization/InviteUsersToOrgAPI"
import CustomizedSnackbars from "./Snackbar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const DetailsViewPage = (props) => {
  const { pageType, title, createdBy, onArchiveWorkspace } = props;
  const { id, orgId } = useParams();
  const classes = DatasetStyle();
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [addAnnotatorsDialogOpen, setAddAnnotatorsDialogOpen] =
    React.useState(false);
  const [addManagersDialogOpen, setAddManagersDialogOpen] =
    React.useState(false);
  const [addWorkspacesDialogOpen, setAddWorkspacesDialogOpen] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectmenu, setSelectmenu] = useState("TaskAnalytics");
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userType, setUserType] = useState(Object.keys(UserRolesList)[0]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [btn,setbtn] = useState(null);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  // const workspaceData = useSelector(state=>state.getWorkspaces.data);
  // const getDashboardWorkspaceData = ()=>{
  //     const workspaceObj = new GetWorkspacesAPI(1);
  //     dispatch(APITransport(workspaceObj));
  //   }


  useEffect(() => {
    // getDashboardWorkspaceData();
  }, []);
  const getWorkspaceDetails = () => {
    const workspaceObj = new GetWorkspacesDetailsAPI(orgId);
    dispatch(APITransport(workspaceObj));
  };

   useEffect(() => {
    if( pageType === "organization"){
      getWorkspaceDetails();
    }
    
  }, []);
  const organisation_id = useSelector(state => state.getWorkspacesProjectData?.data?.[0]?.organization_id);

  let navigate = useNavigate();

  const handleAnnotatorDialogClose = () => {
    setAddAnnotatorsDialogOpen(false);
  };

  const handleAnnotatorDialogOpen = () => {
    setAddAnnotatorsDialogOpen(true);
  };

  const handleManagerDialogClose = () => {
    setAddManagersDialogOpen(false);
  };

  const handleManagerDialogOpen = () => {
    setAddManagersDialogOpen(true);
  };

  const handleWorkspaceDialogClose = () => {
    setAddWorkspacesDialogOpen(false);
  };

  const handleWorkspaceDialogOpen = () => {
    setAddWorkspacesDialogOpen(true);
  };

  const handleUserDialogOpen = () => {
    setAddUserDialogOpen(true);
  };
  const handleUserDialogClose = () => {
    setAddUserDialogOpen(false);
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const addBtnClickHandler = async () => {
    setLoading(true);
    if(userDetails?.role === userRole.WorkspaceManager)
    {
      const addUsesrsObj = new InviteManagerSuggestions(
        organisation_id,
        selectedUsers,
        userType
      );
      const res = await fetch(addUsesrsObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(addUsesrsObj.getBody()),
        headers: addUsesrsObj.getHeaders().headers,
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

      }else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    }
    else 
    {

    const addMembersObj = new InviteUsersToOrgAPI(
        organisation_id,
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
      }else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        });
      }
    }
    handleUserDialogClose();
    setLoading(false);
    setSelectedUsers([ ]);
    setSelectedEmails([]);
    setCsvFile(null);
    setbtn(null)
    setUserType(Object.keys(UserRolesList)[0])
  };
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);
  const handleOpenSettings = () => {
    navigate(`/workspaces/${id}/workspacesetting`);
  };

  const handleClickMenu = (data)  =>{
  setSelectmenu(data)
  handleMenuClose()
  }
  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      {renderSnackBar()}
      <Grid container direction="row" sx={{ maxWidth: "100%" }}>
        <Card className={classes.workspaceCard}>
          {pageType === componentType.Type_Organization && (
            <Typography
              variant="h2"
              gutterBottom
              component="div"
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {title}
            </Typography>
          )}
          {pageType === componentType.Type_Workspace && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Box flex="1" textAlign="center" sx={{ marginLeft: "3rem" }}>
                <Typography variant="h2">{title}</Typography>
              </Box>

              {(userRole.Annotator !== userDetails?.role ||
                userRole.Reviewer !== userDetails?.role ||
                userRole.SuperChecker !== userDetails?.role) && (
                <Tooltip title={translate("label.showProjectSettings")}>
                  <IconButton onClick={handleOpenSettings}>
                    <SettingsOutlinedIcon
                      color="primary.dark"
                      fontSize="large"
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
          <Typography
            variant="body1"
            gutterBottom
            component="div"
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            Created by : {createdBy}
          </Typography>
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="fullWidth"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
              sx={{
                "@media (min-width: 600px)": {
                  flexDirection: "row",
                  borderBottom: "1px solid #ddd",
                  borderRight: "none",
                },
              }}
            >
              {pageType === componentType.Type_Workspace && (
                <Tab
                  label={translate("label.projects")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 0 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 0 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}
              {pageType === componentType.Type_Organization && (
                <Tab
                  label={translate("label.workspaces")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 0 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 0 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}

              {pageType === componentType.Type_Workspace && (
                <Tab
                  label={translate("label.members")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 1 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 1 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}
              {pageType === componentType.Type_Organization && (
                <Tab
                  label={translate("label.members")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 1 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 1 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}

              {pageType === componentType.Type_Workspace && (
                <Tab
                  label={translate("label.managers")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 2 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 2 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}
              {pageType === componentType.Type_Organization && (
                <Tab
                  label={translate("label.invites")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 2 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 2 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}

              {pageType === componentType.Type_Workspace && (
                <Tab
                  label={translate("label.reports")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 3 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 3 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}
              {pageType === componentType.Type_Organization && (
                <Tab
                  label={translate("label.reports")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 3 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 3 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}

              {pageType === componentType.Type_Workspace && (
                <Tab
                  label={
                    <div style={{ display: "flex", marginTop: "5px" }}>
                      {" "}
                      {translate("label.analytics")}{" "}
                      <KeyboardArrowDownIcon style={{ paddingBottom: "1px" }} />{" "}
                    </div>
                  }
                  aria-controls="menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 4 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 4 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}

              {pageType === componentType.Type_Organization && (
                <Tab
                  label={"Organization " + translate("label.settings")}
                  sx={{
                    fontSize: 16,
                    fontWeight: "700",
                    bgcolor: value === 4 ? "#d3d3d3" : "#F5F5F5",
                    color: value === 4 ? "black" : "text.primary",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                />
              )}
            </Tabs>
          </Box>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              selected={selectmenu === "TaskAnalytics"}
              onClick={() => handleClickMenu("TaskAnalytics")}
            >
              {" "}
              Task Analytics{" "}
            </MenuItem>
            <MenuItem
              selected={selectmenu === "MetaAnalytics"}
              onClick={() => handleClickMenu("MetaAnalytics")}
            >
              Meta Analytics
            </MenuItem>
            <MenuItem
              selected={selectmenu === "AdvanceAnalytics"}
              onClick={() => handleClickMenu("AdvanceAnalytics")}
            >
              Advance Analytics
            </MenuItem>
            <MenuItem
              selected={selectmenu === "PerformanceAnalytics"}
              onClick={() => handleClickMenu("PerformanceAnalytics")}
            >
              Performance Analytics
            </MenuItem>
          </Menu>
          <TabPanel
            value={value}
            index={0}
            style={{ textAlign: "center", maxWidth: "100%" }}
          >
            {pageType === componentType.Type_Workspace && (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  columnSpacing={4}
                  rowSpacing={2}
                >
                  <Grid item xs={12} sm={12}>
                    <Link to={`/create-annotation-project/${id}`}>
                      <Button
                        className={classes.projectButton}
                        label={"Add New Annotation Project"}
                      />
                    </Link>
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <Link to={`/create-collection-project/${id}`}>
                      <Button
                        className={classes.projectButton}
                        label={"Add New Collection Project"}
                      />
                    </Link>
                  </Grid> */}
                </Grid>
                <div className={classes.workspaceTables}>
                  <ProjectTable />
                </div>
              </>
            )}
            {pageType === componentType.Type_Organization && (
              <>
                <CustomButton
                  label={translate("button.addNewWorkspace")}
                  sx={{ width: "100%", mb: 2 }}
                  onClick={handleWorkspaceDialogOpen}
                />
                <Workspaces />
                <AddWorkspaceDialog
                  dialogCloseHandler={handleWorkspaceDialogClose}
                  isOpen={addWorkspacesDialogOpen}
                  orgId={orgId}
                />
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {pageType === componentType.Type_Workspace && (
              <>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  columnSpacing={4}
                  rowSpacing={2}
                >
                  <Grid item xs={12} sm={6}>
                    <CustomButton
                      className={classes.annotatorsButton}
                      label={"Add Members to Workspace"}
                      sx={{ width: "100%", mb: 2 }}
                      onClick={handleAnnotatorDialogOpen}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomButton
                      className={classes.annotatorsButton}
                      label={"Invite Users to Organisation"}
                      sx={{ width: "100%", mb: 2 }}
                      onClick={handleUserDialogOpen}
                    />
                  </Grid>
                </Grid>
                <AnnotatorsTable
                  onRemoveSuccessGetUpdatedMembers={() => getWorkspaceDetails()}
                />
                <AddUsersDialog
                  handleDialogClose={handleAnnotatorDialogClose}
                  isOpen={addAnnotatorsDialogOpen}
                  userType={addUserTypes.ANNOTATOR}
                  id={id}
                />
                <InviteUsersDialog
                  handleDialogClose={handleUserDialogClose}
                  isOpen={addUserDialogOpen}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  userType={userType}
                  setUserType={setUserType}
                  addBtnClickHandler={() => addBtnClickHandler()}
                  loading={loading}
                  selectedEmails={selectedEmails}
                  setSelectedEmails={setSelectedEmails}
                  csvFile={csvFile}
                  setCsvFile={setCsvFile}
                  btn={btn}
                  setbtn={setbtn}
                  value={value}
                  setvalue={setValue}
                  popUpLabel={
                    userDetails?.role === userRole.WorkspaceManager
                      ? "Request admin to add users to organization"
                      : "Invite users to organization"
                  }
                />
              </>
            )}
            {pageType === componentType.Type_Organization && (
              <>
                <Members />
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {pageType === componentType.Type_Workspace && (
              <>
                <CustomButton
                  label={"Assign Managers"}
                  sx={{ width: "100%", mb: 2 }}
                  onClick={handleManagerDialogOpen}
                />
                <ManagersTable />
                <AddUsersDialog
                  handleDialogClose={handleManagerDialogClose}
                  isOpen={addManagersDialogOpen}
                  userType={addUserTypes.MANAGER}
                  id={id}
                />
              </>
            )}
            {pageType === componentType.Type_Organization && (
              <Invites hideButton={true} reSendButton={true} />
            )}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {pageType === componentType.Type_Organization && (
              <OrganizationReports />
            )}
            {pageType === componentType.Type_Workspace && <WorkspaceReports />}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {pageType === componentType.Type_Workspace &&
              selectmenu === "TaskAnalytics" && <TaskAnalytics />}
            {pageType === componentType.Type_Workspace &&
              selectmenu === "MetaAnalytics" && <MetaAnalytics />}
            {pageType === componentType.Type_Workspace &&
              selectmenu === "AdvanceAnalytics" && <ProgressAnalytics />}
            {pageType === componentType.Type_Workspace &&
              selectmenu === "PerformanceAnalytics" && <PerformanceAnalytics />}
            {pageType === componentType.Type_Organization && (
              <OrganizationSettings />
            )}
          </TabPanel>
        </Card>
      </Grid>
    </ThemeProvider>
  );
};

export default DetailsViewPage;