import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
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
                    sx={{ 
                        '& .MuiTab-root': { fontSize: 17, fontWeight: '700', marginRight: '32px' },
                        padding:"20px"
                    }}>
                    <Tab label="Task Details"/>
                    <Tab label="Annotation Details"/>
                    <Tab label="User Details"/>
                    <Tab label="Queued Tasks Status"/>
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '16px'}}>
                    <TaskDetails  />  
                </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '16px'}}>
                        <AnnotationDetails  />  
                    </Paper>
                </TabPanel> 
                <TabPanel value={tabValue} index={2}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight'}}>
                        <UserDetail  />  
                    </Paper>
                </TabPanel>
                <TabPanel value={tabValue} index={3}>
                    <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight'}}>
                        <QueuedTasksDetails  /> 
                    </Paper> 
                </TabPanel> 
            </Box>
        </>
       
    )
}

export default DashBoard
