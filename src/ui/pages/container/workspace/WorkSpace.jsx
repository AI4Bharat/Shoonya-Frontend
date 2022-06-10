import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ProjectTable from '../../component/WorkspaceTables/ProjectTable';
import AnnotatorsTable from "../../component/WorkspaceTables/AnnotatorsTable";
import ManagersTable from "../../component/WorkspaceTables/ManagersTable";


import { useDispatch, useSelector } from 'react-redux';



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


const ProjectSetting = (props) => {

    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const  {workspaceData} = props;

    console.log("workspaceData", workspaceData);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
   

    return (
        <ThemeProvider theme={themeDefault}>

            <Header />
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
                width={window.innerWidth}
            >
                <Card
                    sx={{
                        width: window.innerWidth * 0.8,
                        minHeight: 500,
                        padding: 5
                    }}

                >
                    <Typography variant="h2" gutterBottom component="div">
                       demo
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        Created by: example123@gmail.com
                    </Typography>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Projects" {...a11yProps(0)} />
                            <Tab label="Annotators" {...a11yProps(1)} />
                            <Tab label="Managers" {...a11yProps(2)} />
                            <Tab label="Settings" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Link to={`/create-annotation-project/1`} style={{ textDecoration: "none" }}>
                            <Button sx={{ width: "50%" }} label={"Add New Annotation Project"} />
                        </Link>
                             <Button sx={{ width: "50%" }} label={"Add New Collection Project"} />
                             <div style={{marginTop:"20px"}}>
                        <ProjectTable />
                        </div>
                   </TabPanel>
                    <TabPanel value={value} index={1}>
                          <Button sx={{ width: "100%" }} label={"Add Annotators to Workspace"} />
                          <div style={{marginTop:"20px"}}>
                     <AnnotatorsTable />
                     </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                           <Button sx={{ width: "100%" }} label={"Assign Managers"} />
                           <div style={{marginTop:"20px"}}>
                        <ManagersTable />
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                    <Button sx={{ width: "100%",backgroundColor:"red" }} label={"Archive Workspace"} />
                    </TabPanel>


                </Card>
            </Grid>
        </ThemeProvider>

    )
}

export default ProjectSetting;