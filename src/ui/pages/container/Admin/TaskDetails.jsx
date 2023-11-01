import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Tab, Tabs, Box, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { JSONTree } from 'react-json-tree';
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails.js";
import { snakeToTitleCase } from '../../../../utils/utils.js';
import getTaskAssignedUsers from '../../../../utils/getTaskAssignedUsers.js';
import GetTaskAnnotationsAPI from '../../../../redux/actions/api/Tasks/GetTaskAnnotations.js';

function TaskDetails() {
    const [taskId, setTaskId] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [taskDetails, setTaskDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [annotations, setAnnotations] = useState(null);

    const fetchTaskDetails = async () => {
        setTaskDetails(null);
        setUserDetails(null);
        setAnnotations(null);
        fetchTaskAnnotations();
        const apiObj = new GetTaskDetailsAPI(taskId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(response => response.json())
            .then(data =>  {
                setTaskDetails(data);
                return data;
            })
            // .then(data => getTaskAssignedUsers(data))
            // .then(userData => setUserDetails(userData))
    };

    const fetchTaskAnnotations = async () => {
        const apiObj = new GetTaskAnnotationsAPI(taskId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(response => response.json())
            .then(data => setAnnotations(data));
    };

    const theme = {
        base00: '#000',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
      };

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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{display: 'flex', gap: '2em', alignItems: 'center'}}>
                    <TextField
                        id="task-id"
                        label="Task ID"
                        variant="outlined"
                        value={taskId}
                        onChange={(event) => setTaskId(event.target.value)}
                    />
                    <Button variant="contained" onClick={fetchTaskDetails}>
                        Fetch Task Details
                    </Button>
                </Box>
            </Grid>
            {taskDetails && <>
                <Grid item xs={12}>
                    <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="task-details-tabs">
                        <Tab label="Details" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                        <Tab label="Annotations" sx={{ fontSize: 17, fontWeight: '400', marginRight: '28px !important' }} />
                    </Tabs>
                </Grid>

                <Grid item xs={12}>
                    <TabPanel value={tabValue} index={0}>
                        <JSONTree
                            data={taskDetails}
                            hideRoot={true}
                            invertTheme={true}
                            labelRenderer={([key]) => <strong>{key}</strong>}
                            valueRenderer={(raw) => <em>{raw}</em>}
                            theme={theme}
                            /* theme={{
                                extend: theme,
                                // underline keys for literal values
                                valueLabel: {
                                textTransform: 'uppercase',
                                },
                                // switch key for objects to uppercase when object is expanded.
                                // `nestedNodeLabel` receives additional argument `expandable`
                                nestedNodeLabel: ({ style }, keyPath, nodeType, expanded) => ({
                                style: {
                                    ...style,
                                    textTransform: 'uppercase',
                                },
                                }),
                            }}  */
                        />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <JSONTree
                            data={annotations}
                            hideRoot={true}
                            invertTheme={true}
                            labelRenderer={([key]) => <strong>{key}</strong>}
                            valueRenderer={(raw) => <em>{raw}</em>}
                            theme={theme}
                        />
                    </TabPanel>
                </Grid>
            </>}
        </Grid>
    );
}

export default TaskDetails;
