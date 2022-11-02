import React, { useState } from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography, Radio,
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import DeleteProjectTasksAPI from "../../../../redux/actions/api/ProjectDetails/DeleteProjectTasks";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";


export default function DeleteProjectTasks() {
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [projectTaskStartId, setProjectTaskStartId] = useState("");
    const [projectTaskEndId, setProjectTaskEndId] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();
    };
    const handleSearchSubmit = async () => {
        setAnchorEl(null);
        setProjectTaskStartId();
        setProjectTaskEndId();

        const DeleteDataItems = {
            project_task_start_id: parseInt(projectTaskStartId),
            project_task_end_id: parseInt(projectTaskEndId)
        }
        const projectObj = new DeleteProjectTasksAPI(id, DeleteDataItems)
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }


    }


    const open = Boolean(anchorEl);
    const Id = open ? 'simple-popover' : undefined;

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    return (
        <div >
            {renderSnackBar()}
            <Button
                sx={{
                    inlineSize: "max-content",
                    p: 2,
                    borderRadius: 3,
                    ml: 2,
                    mb: 2,
                    width: "300px"
                }}
                aria-describedby={Id}
                variant="contained"
                onClick={handleClick}>
                Delete Project Tasks
            </Button>

            <Popover
                Id={Id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >

                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Task Start Id:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskStartId}
                            onChange={(e) => setProjectTaskStartId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"
                                }
                            }}
                        />

                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        p: 1
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={5}
                        xl={5}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Project Task End Id:
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={6}
                        sm={6}
                    >
                        <TextField
                            size="small"
                            variant="outlined"
                            value={projectTaskEndId}
                            onChange={(e) => setProjectTaskEndId(e.target.value)}
                            inputProps={{
                                style: {
                                    fontSize: "16px"
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClearSearch}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSearchSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.submit")}
                    </Button>
                </Box>
            </Popover>
        </div>
    );
}
