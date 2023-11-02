import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Tab, Tabs, Box, Typography } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails.js";
import { snakeToTitleCase } from '../../../../utils/utils.js';
import GetTaskAnnotationsAPI from '../../../../redux/actions/api/Tasks/GetTaskAnnotations.js';
import FetchUserByIdAPI from "../../../../redux/actions/api/UserManagement/FetchUserById";
import DeleteAnnotationAPI from '../../../../redux/actions/api/Annotation/DeleteAnnotation.js';

function AnnotationDetails() {
    const [annotationId, setAnnotationId] = useState('');
    const [annotationDetails, setAnnotationDetails] = useState(null);

    const fetchAnnotationDetails = async () => {
        setAnnotationDetails(null);
        //not actually deleting the annotation, just fetching the details
        const apiObj = new DeleteAnnotationAPI(annotationId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(response => response.json())
            .then(data => {
                setAnnotationDetails(data);
            });
    };

    const getUserEmail = async (userId) => {
        const apiObj = new FetchUserByIdAPI(userId);
        return fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(res => res.json())
            .then(res => res.email);
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
        base09: '#fd971f', //orange
        base0A: '#f4bf75',
        base0B: '#a6e22e', //green
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box sx={{display: 'flex', gap: '2em', alignItems: 'center'}}>
                    <TextField
                        id="annotation-id"
                        label="Annotation ID"
                        variant="outlined"
                        value={annotationId}
                        onChange={(event) => setAnnotationId(event.target.value)}
                    />
                    <Button variant="contained" onClick={fetchAnnotationDetails}>
                        Fetch Annotation Details
                    </Button>
                </Box>
            </Grid>
            {annotationDetails && 
                <Grid item xs={12}>
                    <JSONTree
                        data={annotationDetails}
                        hideRoot={true}
                        invertTheme={true}
                        labelRenderer={([key]) => <strong>{typeof key === "string" ? snakeToTitleCase(key) : key}</strong>}
                        valueRenderer={(raw) => <span>{typeof raw === "string" && raw.match(/^"(.*)"$/) ? raw.slice(1, -1) :  raw}</span>}
                        theme={theme}
                    />
                </Grid>
            }
        </Grid>
    );
}

export default AnnotationDetails;
