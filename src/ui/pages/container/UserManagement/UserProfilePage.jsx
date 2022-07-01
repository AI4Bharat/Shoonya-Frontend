import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import MyProfile from '../../component/Tabs/MyProfile';
import MyProgress from '../../component/Tabs/MyProgress';

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
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const UserProfilePage = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="My Profile" sx={{ fontSize: 16, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="My Progress" sx={{ fontSize: 16, fontWeight: '700' }} />
                </Tabs>
            </Box>
            <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                    <MyProfile />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <MyProgress />
                </TabPanel>
            </Box>
        </Box>
    )
}

export default UserProfilePage