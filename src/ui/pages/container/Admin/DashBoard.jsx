import { Box, Tab, Tabs, Typography, Paper, CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';
import UserDetail from "./UserDetail";
import TaskDetails from './TaskDetails';
import AnnotationDetails from './AnnotationDetails';
import QueuedTasksDetails from './QueuedTasksDetails';
import Spinner from "../../component/common/Spinner";

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
    const [loading, setLoading] = useState(false);

    const handleTabChange = (e, v) => {
        setLoading(true); // Start loading
        setTabValue(v);

        // Simulate a loading delay (e.g., data fetching)
        setTimeout(() => {
            setLoading(false); // Stop loading
        }, 2000); // Adjust time as needed
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin-tabs">
                    <Tab label="Task Details" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Annotation Details" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="User Details" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                    <Tab label="Queued Tasks Status" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                </Tabs>
            </Box>
            <Box sx={{ p: 1 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px',
                        }}
                    >
                        <Spinner />
                    </Box>
                ) : (
                    <>
                        <TabPanel value={tabValue} index={0}>
                            <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '32px' }}>
                                <TaskDetails />
                            </Paper>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Paper variant="outlined" sx={{ borderRadius: "5px", backgroundColor: 'ButtonHighlight', padding: '32px' }}>
                                <AnnotationDetails />
                            </Paper>
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            <UserDetail />
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                            <QueuedTasksDetails />
                        </TabPanel>
                    </>
                )}
            </Box>
        </>
    );
};

export default DashBoard;
