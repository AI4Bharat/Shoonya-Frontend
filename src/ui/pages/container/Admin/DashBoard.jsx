import { Box, Tab, Tabs, Typography, Paper } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import UserDetail from "./UserDetail";
import TaskDetails from './TaskDetails';
import AnnotationDetails from './AnnotationDetails';
import QueuedTasksDetails from './QueuedTasksDetails';

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

const DashBoard = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (e, v) => {
        setTabValue(v)
    }

    return (
      
        < >
            <Box>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="admin-tabs" 
                    variant='scrollable' 
                    scrollButtons='auto'
                    sx = {{ 
                        padding : {
                            xs:"16px", 
                            sm:"32px"
                    }}}>
                    <Tab label="Task Details"/>
                    <Tab label="Annotation Details"/>
                    <Tab label="User Details"/>
                    <Tab label="Queued Tasks Status"/>
                </Tabs>
            </Box>
            <Box sx={{ p: 2}}>
                <TabPanel value={tabValue} index={0}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '24px'}}>
                    <TaskDetails  />  
                </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '24px'}}>
                        <AnnotationDetails  />  
                    </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={2}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '24px'}}>
                        <UserDetail  />  
                    </Paper>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '24px'}}>
                        <QueuedTasksDetails  /> 
                    </Paper> 
                </TabPanel> 
            </Box>
        </>
       
    )
}

export default DashBoard
