import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Box, CircularProgress } from '@mui/material';
import { JSONTree } from 'react-json-tree';
import { snakeToTitleCase } from '../../../../utils/utils.js';
import FetchUserByIdAPI from "../../../../redux/actions/api/UserManagement/FetchUserById";
import DeleteAnnotationAPI from '../../../../redux/actions/api/Annotation/DeleteAnnotation.js';
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails.js";
import { Link } from 'react-router-dom';

function AnnotationDetails() {
    const [annotationId, setAnnotationId] = useState('');
    const [annotationDetails, setAnnotationDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAnnotationDetails = async () => {
        setLoading(true);
        setAnnotationDetails(null);
        //not actually deleting the annotation, just fetching the details
        const apiObj = new DeleteAnnotationAPI(annotationId);
        fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(async (res) => {
                if(res.status === 200) {
                    const data = await res.json();
                    return data;
                }
                else if(res.status === 404)
                    return { error: 'Annotation not found' };
                else {
                    return { error: 'Something went wrong' };
                }
            })
            .then(async (data) => {
                if(data.error) {
                    setLoading(false);
                    setAnnotationDetails(data);
                }
                else {
                    const projectId = await getProjectId(data['task']);
                    data['project_id'] = projectId;
                    if(data['completed_by']) {
                        const userEmail = await getUserEmail(data['completed_by']);
                        data['completed_by'] = `${data['completed_by']} (${userEmail})`;
                        setLoading(false);
                        setAnnotationDetails(data);
                    }
                    else {
                        setLoading(false);
                        setAnnotationDetails(data);
                    }
                }
            });
    };

    const getUserEmail = async (userId) => {
        const apiObj = new FetchUserByIdAPI(userId);
        return fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(res => res.json())
            .then(res => res?.email);
    };

    const getProjectId = async (taskId) => {
        const apiObj = new GetTaskDetailsAPI(taskId);
        return fetch(apiObj.apiEndPoint(), apiObj.getHeaders())
            .then(res => res.json())
            .then(res => res?.project_id);
    };

    const theme = {
        extend: {
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
          },
        value: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: '1.375em',
                paddingLeft: '2em',
            },
        }),
        nestedNode: ({ style }, nodeType, keyPath) => ({
            style: {
                ...style,
                borderLeft: '2px solid #ccc',
                marginLeft: keyPath.length > 1 ? '1.375em' : 0,
                textIndent: '-0.375em',
            },
            
        }),
        arrowContainer: ({ style }, arrowStyle) => ({
            style: {
                ...style,
                paddingRight: '1.375rem',
                textIndent: '0rem',
                backgroundColor: 'white',
            },
        }),
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
            {loading && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
                    <CircularProgress color="primary" size={50} />
                </Grid>
            )}
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
                    {annotationDetails &&(
                        <Link to ={`/projects/${annotationDetails.project_id}`}>
                            <Button variant="contained">Project Page</Button>
                        </Link>
                    )}
                </Grid>
            }
        </Grid>
    );
}

export default AnnotationDetails;
