import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import configs from "../../../../config/config";


const CreateProjectDropdown = ({ workspaceData }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = async (event) => {
        setAnchorEl(event.currentTarget);

        try {
            // Direct API call instead of GetWorkspaceAPI
            const res = await fetch(`${configs.BASE_URL_AUTO}/workspaces/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setWorkspaces(data || []);
        } catch (error) {
            console.error("❌ Error fetching workspaces", error);
            setWorkspaces([]);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (workspace) => {
        navigate(`/create-annotation-project/${workspace.id}`, {
            state: { workspace },
        });
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
                sx={{ borderRadius: 2, mb: 2 }}
            >
                Create Project
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {workspaces.length > 0 ? (
                    workspaces.map((ws) => (
                        <MenuItem key={ws.id} onClick={() => handleSelect(ws)}>
                            {ws.workspace_name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No workspaces found</MenuItem>
                )}
            </Menu>
        </>
    );
};

export default CreateProjectDropdown;