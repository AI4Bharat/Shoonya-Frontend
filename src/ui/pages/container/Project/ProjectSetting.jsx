import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import React from 'react'
import { useState ,useEffect} from 'react'
import BasicSettings from '../../component/Tabs/BasicSettings';
import ReadonlyConfigurations from '../../component/Tabs/ReadonlyConfigurations'
import AdvancedOperation from '../../component/Tabs/AdvancedOperation';
import ProjectLogs from './ProjectLogs';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';


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
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const ProjectSetting = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    const ProjectDetails = useSelector((state) => state.getProjectDetails.data);

    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        getProjectDetails();
    }, [])
    return (
        <Card
        sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            overflowX: "hidden",
            padding: 5,
            boxSizing: "border-box"
        }}
    >
      
        <Box >
              <Grid
                        item
                        xs={12}
                        sx = {{
                            mb : 3
                        }}
                    >
                        <Typography variant="h3" gutterBottom component="div"sx={{fontWeight: '1.6875rem'}}>
                            Project Settings
                        </Typography>
               </Grid>
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Basic " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label=" Advanced " sx={{ fontSize: 17, fontWeight: '700' }} />
                    <Tab label=" Read-only " sx={{ fontSize: 17, fontWeight: '700' }} />
                    <Tab label=" Logs " sx={{ fontSize: 17, fontWeight: '700' }} />
                </Tabs>
            </Box>
            <Divider/>
            <Box sx={{ p: 0 }}>
                <TabPanel value={tabValue} index={0}>
                <BasicSettings   ProjectDetails={ProjectDetails}/>  
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <AdvancedOperation />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                <ReadonlyConfigurations />
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <ProjectLogs />
                </TabPanel>
            </Box>
        </Box>
        </Card>
    )
}

export default ProjectSetting