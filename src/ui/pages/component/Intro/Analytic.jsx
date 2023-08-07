import { Box,Grid,Tab, Card,Tabs, Typography, Divider, ThemeProvider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
// import ProgressAnalytics from './ProgressAnalytics';

import {useSelector} from "react-redux";
import introTheme from '../../../theme/introTheme';
import MetaAnalytics from '../../container/Progress/MetaAnalytics/MetaAnalytics';
import TaskAnalytics from '../../container/Progress/TaskAnalytics/TaskAnalytics';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{padding:" 0px 140px 0px 140px"}}
        >
            {value === index && (
                <Box p={2}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Analytic = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    
    return (
      
        <>
            <Box sx={{mb:2,ml:"5px"}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs" sx={{mb:2,mt:11,ml:3}}>
                    <Tab label="Task Analytics " sx={{ fontSize: 16, fontWeight: '700',marginRight: '28px !important' }} />
                    <Tab label="Meta Analytics " sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} />
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0} >
                <TaskAnalytics/>  
                </TabPanel> 
                <TabPanel value={tabValue} index={1}>
                <MetaAnalytics/>
                </TabPanel>  
            </Box>
        </>
       
    )
}

export default Analytic
