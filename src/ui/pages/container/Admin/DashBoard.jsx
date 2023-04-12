import { Box,Grid,Tab, Card,Tabs, Typography, Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import {useSelector} from "react-redux";
import UserDetail from "./UserDetail";



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
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="User Detail" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                     
                </Tabs>
            </Box>
            <Box sx={{ p: 1}}>
                <TabPanel value={tabValue} index={0}>
                <UserDetail  />  
                </TabPanel> 
                 
            </Box>
        </>
       
    )
}

export default DashBoard
