import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ProjectTable from './Tabs/ProjectTable';
import AnnotatorsTable from "./Tabs/Annotators";
import ManagersTable from "./Tabs/ManagersTable";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";


import { useDispatch, useSelector } from 'react-redux';
import DetailsViewPage from "../../component/common/DetailsViewPage";



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


const Workspace = (props) => {

    const classes = DatasetStyle();
    const dispatch = useDispatch();
   

    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
   
    const workspaceData = useSelector(state=>state.getWorkspaces.data);
    console.log( workspaceData," workspaceData")
    const getDashboardWorkspaceData = ()=>{
        const workspaceObj = new GetWorkspacesAPI(1);
        dispatch(APITransport(workspaceObj));
      }
      
      useEffect(()=>{
        getDashboardWorkspaceData();
      },[]);
        

    return (
        <ThemeProvider theme={themeDefault}>
            <DetailsViewPage 
                title={workspaceData.length > 0 && workspaceData[0].workspace_name} 
                createdBy={workspaceData.length > 0 && workspaceData[0].created_by.email}
            />

            {/* <Header /> */}
            {/* <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
                // width={window.innerWidth}
            >
                <Card className={classes.workspaceCard}>
                    <Typography variant="h2" gutterBottom component="div">
                       
                       {workspaceData.length > 0 && workspaceData[0].workspace_name} 
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                    Created_by:  {workspaceData.length > 0 && workspaceData[0].created_by.email}
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Projects" {...a11yProps(0)} />
                            <Tab label="Annotators" {...a11yProps(1)} />
                            <Tab label="Managers" {...a11yProps(2)} />
                            <Tab label="Settings" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0} style={{ textAlign:"center"}}>
                        <Link to={`/create-annotation-project/1`} style={{ textDecoration: "none",marginRight:"200px" }}>
                            <Button className={classes.projectButton}  label={"Add New Annotation Project"} />
                        </Link>
                             <Button className={classes.projectButton} label={"Add New Collection Project"} />
                             <div className={classes.workspaceTables} >
                        <ProjectTable />
                        </div>
                   </TabPanel>
                    <TabPanel value={value} index={1}>
                          <Button className={classes.annotatorsButton}  label={"Add Annotators to Workspace"} />
                          <div className={classes.workspaceTables}>
                     <AnnotatorsTable />
                     </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                           <Button className={classes.managersButton} label={"Assign Managers"} />
                           <div className={classes.workspaceTables}>
                        <ManagersTable />
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                    <Button className={classes.settingsButton}  label={"Archive Workspace"} />
                    </TabPanel>


                </Card>
            </Grid> */}
        </ThemeProvider>

    )
}

export default Workspace;