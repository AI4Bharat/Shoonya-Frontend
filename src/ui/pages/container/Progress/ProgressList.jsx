import { Box,Grid,Tab, Card,Tabs, Typography, Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import ProgressAnalytics from './ProgressAnalytics';
import TaskAnalytics from "./TaskAnalytics";
import {useSelector} from "react-redux";



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

const ProgressList = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    const loggedInUserData = useSelector(
        (state) => state.fetchLoggedInUserData.data
      );
    return (
      
        < >
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Advance Analytics " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Task Analytics " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Meta Analytics " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />

                   
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                <ProgressAnalytics />  
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                <TaskAnalytics loggedInUserData ={loggedInUserData} />  
                </TabPanel>    
            </Box>
        </>
       
    )
}

export default ProgressList
