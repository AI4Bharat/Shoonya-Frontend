import React, { useState, useEffect } from "react";
import {
    Button,
    Popover,
    Typography,
    Box,
    TextField,
    Grid,
    FormControl,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";
import { useParams } from "react-router-dom";
// import ENDPOINTS from "../../../../config/apiendpoint";
import configs from '../../../../config/config.js';


const langCodes = {
    'Assamese': 'as', 'Bengali': 'bn', 'Bodo': 'brx', 'Dogri': 'doi', 'Gujarati': 'gu',
    'Hindi': 'hi', 'Kannada': 'kn', 'Kashmiri': 'ks', 'Konkani': 'kok', 'Maithili': 'mai',
    'Malayalam': 'ml', 'Manipuri': 'mni', 'Marathi': 'mr', 'Nepali': 'ne', 'Odia': 'or',
    'Punjabi': 'pa', 'Sanskrit': 'sa', 'Santali': 'sat', 'Sindhi': 'sd', 'Tamil': 'ta',
    'Telugu': 'te', 'Urdu': 'ur'
};

const apiEndpoints_pred = {
    default_asr: `${configs.BASE_URL_AUTO}/projects/populate_asr_model_predictions/`,
    youtube: `${configs.BASE_URL_AUTO}/projects/populate_asr_model_predictions_yt/`
};

export default function PopulateModuleOutput() {
    const { id: projectId } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [message, setMessage] = useState("");
    const [modelLanguage, setModelLanguage] = useState("");
    const [projectIds, setProjectIds] = useState(projectId || "default_project_id");
    const [stage, setStage] = useState("l1");
    const [projectType, setProjectType] = useState("");
    const [apiEndpoint, setApiEndpoint] = useState(apiEndpoints_pred.default_asr);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        async function fetchProjectDetails() {
            try {
                const response = await fetch(`${configs.BASE_URL_AUTO}/projects/${projectId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
                    }
                });
                console.log("Response:", response);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setModelLanguage(langCodes[data.tgt_language] || "");
                setProjectType(data.project_type);
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        }

        fetchProjectDetails();
    }, [projectId]);


    useEffect(() => {
        async function fetchroleDetails() {
            try {
                const response1 = await fetch(`${configs.BASE_URL_AUTO}/users/account/me/fetch/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
                    }
                });
                console.log("Response Role:", response1);

                if (!response1.ok) {
                    throw new Error(`HTTP error! Status: ${response1.status}`);
                }

                const data = await response1.json();
                setUserRole(data.role);
            } catch (error) {
                console.error("Error fetching Role details:", error);
            }
        }

        fetchroleDetails();
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubmit = async () => {
        setAnchorEl(null); const payload = {
            model_language: modelLanguage,
            project_ids: projectIds.split(",").map(id => id.trim()),
            stage: stage
        };

        console.log("Submitting payload:", payload);
        try {
            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
                },
                body: JSON.stringify({
                    model_language: modelLanguage,
                    project_ids: projectIds.split(",").map(id => id.trim()),
                    stage: stage
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Success:", data);
            setMessage("Module output populated successfully!");
        } catch (error) {
            console.error("Error:", error);
            setMessage("Failed to populate module output.");
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'simple-popover' : undefined;

    // Hide button if project_type is not "AcousticNormalisedTranscriptionEditing"
    const allowedRoles = [6,5];
    if (projectType !== "AcousticNormalisedTranscriptionEditing" || !allowedRoles.includes(userRole)) {
        return null;
    }


    return (
        <div>
            <Button
                sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2, width: "300px" }}
                variant="contained"
                onClick={handleClick}
            >
                Populate Model Predictions
            </Button>

            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{ style: { padding: '10px', maxWidth: '400px', height: '320px' } }}
            >
                <Box p={2}>
                    <Typography variant="h6">Enter Details</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Typography variant="body1">Model Language</Typography>
                                <Select
                                    value={modelLanguage}
                                    onChange={(e) => setModelLanguage(e.target.value)}
                                    displayEmpty
                                    variant="outlined"
                                >
                                    <MenuItem value="" disabled>Select a language</MenuItem>
                                    {Object.entries(langCodes).map(([language, code]) => (
                                        <MenuItem key={code} value={code}>{language}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project IDs"
                                variant="outlined"
                                value={projectIds}
                                onChange={(e) => setProjectIds(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">Stage</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                >
                                    <FormControlLabel value="l1" control={<Radio />} label="L1" />
                                    <FormControlLabel value="l2" control={<Radio />} label="L2" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1">Select API Endpoint</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    value={apiEndpoint}
                                    onChange={(e) => setApiEndpoint(e.target.value)}
                                >
                                    <FormControlLabel
                                        value={apiEndpoints_pred.default_asr}
                                        control={<Radio />}
                                        label="Default ASR Model Predictions"
                                    />
                                    <FormControlLabel
                                        value={apiEndpoints_pred.youtube}
                                        control={<Radio />}
                                        label="YouTube ASR Model Predictions"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
}
