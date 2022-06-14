// DetailsViewPage

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
// import { useDispatch, useSelector } from 'react-redux';



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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const DetailsViewPage = (props) => {
    const { pageType, title, createdBy } = props;

    const classes = DatasetStyle();
    // const dispatch = useDispatch();



    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // const workspaceData = useSelector(state=>state.getWorkspaces.data);
    // const getDashboardWorkspaceData = ()=>{
    //     const workspaceObj = new GetWorkspacesAPI(1);
    //     dispatch(APITransport(workspaceObj));
    //   }

    useEffect(() => {
        // getDashboardWorkspaceData();
    }, []);


    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            // width={window.innerWidth}
            >
                <Card className={classes.workspaceCard}>
                    <Typography variant="h2" gutterBottom component="div">
                        {title}
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        Created_by : {createdBy}
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

                            {pageType === componentType.Type_Workspace && <Tab label="Projects" sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label="Workspaces" sx={{ fontSize: 16, fontWeight: '700' }} />}

                            {pageType === componentType.Type_Workspace && <Tab label="Annotators" sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label="Members" sx={{ fontSize: 16, fontWeight: '700' }} />}


                            {pageType === componentType.Type_Workspace && <Tab label="Managers" sx={{ fontSize: 16, fontWeight: '700' }} />}
                            {pageType === componentType.Type_Organization && <Tab label="Invites" sx={{ fontSize: 16, fontWeight: '700' }} />}

                            <Tab label="Settings" sx={{ fontSize: 16, fontWeight: '700' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0} style={{ textAlign: "center" }}>
                        {pageType === componentType.Type_Workspace && <>
                            <Link to={`/create-annotation-project/1`} style={{ textDecoration: "none", marginRight: "200px" }}>
                                <Button className={classes.projectButton} label={"Add New Annotation Project"} />
                            </Link>
                            <Button className={classes.projectButton} label={"Add New Collection Project"} />
                            <div className={classes.workspaceTables} >
                                <ProjectTable />
                            </div>
                        </>}
                        {/* if pagetype === organization add another component with it's condition */}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Button className={classes.annotatorsButton} label={"Add Annotators to Workspace"} />
                        <div className={classes.workspaceTables}>
                            {pageType === componentType.Type_Workspace && <AnnotatorsTable />}
                            {/* if pagetype === organization add another component with it's condition */}
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Button className={classes.managersButton} label={"Assign Managers"} />
                        <div className={classes.workspaceTables}>
                            {pageType === componentType.Type_Workspace && <ManagersTable />}
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Button className={classes.settingsButton} label={"Archive Workspace"} />
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>

    )
}

export default DetailsViewPage;