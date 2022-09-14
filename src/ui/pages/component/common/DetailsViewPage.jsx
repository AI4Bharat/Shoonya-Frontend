import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import componentType from "../../../../config/pageType"
import ProjectTable from "../Tabs/ProjectTable";
import AnnotatorsTable from "../Tabs/Annotators";
import ManagersTable from "../Tabs/ManagersTable";
import Workspaces from "../Tabs/Workspaces";
import CustomButton from "../../component/common/Button";
import { translate } from "../../../../config/localisation";
import MembersTable from "../Project/MembersTable";
import Members from "../Tabs/Members";
import Invites from "../Tabs/Invites";
import OrganizationSettings from "../Tabs/OrganizationSettings";
import OrganizationReports from "../Organization/OrganizationReports"
import WorkspaceReports from "./WorkspaceReports";
import AddUsersDialog from "./AddUsersDialog";
import addUserTypes from "../../../../constants/addUserTypes";
import AddWorkspaceDialog from "../Workspace/AddWorkspaceDialog";
import Spinner from "../../component/common/Spinner";
import {  useSelector,useDispatch } from 'react-redux';
import WorkspaceSetting from "../Tabs/WorkspaceSetting";

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
    const { pageType, title, createdBy ,onArchiveWorkspace} = props;
    const { id,orgId } = useParams();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = useState(false);
    const [addAnnotatorsDialogOpen, setAddAnnotatorsDialogOpen] = React.useState(false);
    const [addManagersDialogOpen, setAddManagersDialogOpen] = React.useState(false);
    const [addWorkspacesDialogOpen, setAddWorkspacesDialogOpen] = React.useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const apiLoading = useSelector(state => state.apiStatus.loading);
    // const workspaceData = useSelector(state=>state.getWorkspaces.data);
    // const getDashboardWorkspaceData = ()=>{
    //     const workspaceObj = new GetWorkspacesAPI(1);
    //     dispatch(APITransport(workspaceObj));
    //   }

    useEffect(() => {
        // getDashboardWorkspaceData();
    }, []);
    
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

    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])
    return (
        <ThemeProvider theme={themeDefault}>
             {loading && <Spinner />}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Card className={classes.workspaceCard}>
                    <Typography variant="h2" gutterBottom component="div">
                        {title}
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        Created by : {createdBy}
                    </Typography>
                    <Box >
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

                            {pageType === componentType.Type_Workspace && <Tab label={translate("label.projects")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label={translate("label.workspaces")} sx={{ fontSize: 16, fontWeight: '700' }} />}

                            {pageType === componentType.Type_Workspace && <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />}


                            {pageType === componentType.Type_Workspace && <Tab label={translate("label.managers")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label={translate("label.invites")} sx={{ fontSize: 16, fontWeight: '700' }} />}

                            {pageType === componentType.Type_Workspace && <Tab label={translate("label.reports")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label={translate("label.reports")} sx={{ fontSize: 16, fontWeight: '700' }} />}


                            <Tab label={translate("label.settings")} sx={{ fontSize: 16, fontWeight: '700' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0} style={{ textAlign: "center", maxWidth: "100%" }}>
                        {pageType === componentType.Type_Workspace && <>
                            <Grid
                                container
                                direction='row'
                                justifyContent='center'
                                alignItems='center'
                                columnSpacing={4}
                                rowSpacing={2}
                            >
                                <Grid item xs={12} sm={6}>
                                    <Link to={`/create-annotation-project/${id}`}>
                                        <Button className={classes.projectButton} label={"Add New Annotation Project"} />
                                    </Link>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Link to={`/create-collection-project/${id}`}>
                                        <Button className={classes.projectButton} label={"Add New Collection Project"} />
                                    </Link>
                                </Grid>
                            </Grid>
                            <div className={classes.workspaceTables} >
                                <ProjectTable />
                            </div>
                        </>}
                        {pageType === componentType.Type_Organization &&
                            <>
                                <CustomButton label={translate("button.addNewWorkspace")} sx={{ width: "100%", mb: 2 }} onClick={handleWorkspaceDialogOpen} />
                                <Workspaces  />
                                <AddWorkspaceDialog
                                    dialogCloseHandler={handleWorkspaceDialogClose}
                                    isOpen={addWorkspacesDialogOpen}
                                    orgId={orgId}
                                />
                            </>
                        }

                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        {pageType === componentType.Type_Workspace &&
                            <>
                                
                                <Button className={classes.annotatorsButton} label={"Add Members to Workspace"}sx={{ width: "100%", mb: 2 }} onClick={handleAnnotatorDialogOpen} />
                                <AnnotatorsTable />
                                <AddUsersDialog
                                    handleDialogClose={handleAnnotatorDialogClose}
                                    isOpen={addAnnotatorsDialogOpen}
                                    userType={addUserTypes.ANNOTATOR}
                                    id={id}
                                />
                            </>
                        }
                        {pageType === componentType.Type_Organization &&
                            <>
                                <Members />
                            </>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        {pageType === componentType.Type_Workspace &&
                            <>
                                <CustomButton label={"Assign Managers"} sx={{ width: "100%", mb: 2 }} onClick={handleManagerDialogOpen} />
                                <ManagersTable />
                                <AddUsersDialog
                                    handleDialogClose={handleManagerDialogClose}
                                    isOpen={addManagersDialogOpen}
                                    userType={addUserTypes.MANAGER}
                                    id={id}
                                />
                            </>
                        }
                        {pageType === componentType.Type_Organization && <Invites hideButton={true} />}
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        {pageType === componentType.Type_Organization && <OrganizationReports />}
                        {pageType === componentType.Type_Workspace && <WorkspaceReports />}
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        {pageType === componentType.Type_Organization && <OrganizationSettings />}
                        {pageType === componentType.Type_Workspace && <WorkspaceSetting  onArchiveWorkspace={onArchiveWorkspace}/> }
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>

    )
}

export default DetailsViewPage;