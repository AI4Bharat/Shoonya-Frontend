import { Card, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import GetPublishProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetPublishProject';
import GetLanguageChoicesAPI from "../../../../redux/actions/api/ProjectDetails/GetLanguageChoices";
import GetPullNewDataAPI from '../../../../redux/actions/api/ProjectDetails/PullNewData';
import GetArchiveProjectAPI from '../../../../redux/actions/api/ProjectDetails/ArchiveProject'
import CustomButton from "../../component/common/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DownloadProjectButton from '../../container/Project/DownloadProjectButton';
import CustomizedSnackbars from "../../component/common/Snackbar"
import Spinner from "../../component/common/Spinner";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EnableTaskReviewsAPI from "../../../../redux/actions/api/ProjectDetails/EnableTaskReviews";
import DisableTaskReviewsAPI from "../../../../redux/actions/api/ProjectDetails/DisableTaskReviews";


const AdvancedOperation = (props) => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { id } = useParams();

    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiMessage = useSelector(state => state.apiStatus.message);
    const apiError = useSelector(state => state.apiStatus.error);
    console.log(apiMessage, "apiMessage")
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    console.log(ProjectDetails, "ProjectDetails")
    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);
        dispatch(APITransport(projectObj));
    }

    

    useEffect(() => {
        getProjectDetails();
    }, []);


    


    useEffect(() => {
        setNewDetails({
            title: ProjectDetails.title,
            description: ProjectDetails.description,

        });

    }, [ProjectDetails]);

    const getExportProjectButton = async () => {
        const projectObj = new GetExportProjectButtonAPI(id);
        dispatch(APITransport(projectObj));
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

    const handleReviewToggle = async () => {
        setLoading(true);
        const reviewObj = ProjectDetails.enable_task_reviews ? new DisableTaskReviewsAPI(id) : new EnableTaskReviewsAPI(id);
        const res = await fetch(reviewObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(reviewObj.getBody()),
            headers: reviewObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "success",
            })
            const projectObj = new GetProjectDetailsAPI(id);
            dispatch(APITransport(projectObj));
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }



    const getPublishProjectButton = async () => {
        const projectObj = new GetPublishProjectButtonAPI(id);
        dispatch(APITransport(projectObj));
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

    // useEffect(() => {
    //     setSnackbarInfo({
    //         open: apiMessage ? true : false,
    //         variant: apiError ? "error" : "success",
    //         message: apiMessage,
    //     });
    //     setSpinner(false);
    // }, [apiMessage, apiError])


    const getPullNewDataAPI = async () => {
        const projectObj = new GetPullNewDataAPI(id);
        dispatch(APITransport(projectObj));
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

    const ArchiveProject = useSelector(state => state.getArchiveProject.data);
    const [isArchived, setIsArchived] = useState(false);
    console.log(ProjectDetails.is_archived, "is_archived", isArchived)
    const getArchiveProjectAPI = () => {
        const projectObj = new GetArchiveProjectAPI(id);
        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        setIsArchived(ProjectDetails?.is_archived)
    }, [ProjectDetails])

    const handleExportProject = () => {
        getExportProjectButton();
    }
    const handlePublishProject = () => {
        getPublishProjectButton()

    }

    const handlePullNewData = () => {
        getPullNewDataAPI()

    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleok = () => {
        getArchiveProjectAPI()
        setIsArchived(!isArchived)
        setOpen(false);
    }

    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

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
        <ThemeProvider theme={themeDefault}>
            {loading && <Spinner />}
            <Grid>
                {renderSnackBar()}

            </Grid>

            <Grid
                container
                direction='row'
            

            >
                    <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        style={{ margin: "38px 0px 30px 0px", }}
                    >
                        <Typography variant="h5" gutterBottom component="div"  sx={{  pl:2 , ml: 2 }}>
                            Advanced Operation
                        </Typography>
                    </Grid>

                    <Grid
                        container
                        direction="row"
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        spacing={1}
                        rowGap={2}
                        // columnSpacing={2}
                        sx={{
                            // direction : "row",
                            mb: 2,
                            justifyContent: "flex-start",

                        }}
                    >
                         <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                    >
                  <CustomButton sx={{ inlineSize: "max-content", pl:2 , borderRadius: 3, ml: 2,width:"300px" }} onClick={handlePublishProject} label="Publish Project" />

                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        
                    >
                        <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2,width:"300px"  }} onClick={handleExportProject} label="Export Project into Dataset" />
                        </Grid>
                       
                        <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                       
                    >
                        {ProjectDetails.sampling_mode == "f" ? <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 ,width:"300px" }} onClick={handlePullNewData} label="Pull New Data Items from Source Dataset" /> : " "}
                        </Grid>
                        <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        
                    >
                        <DownloadProjectButton />
                        </Grid>
                        <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                       
                    >
                        <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2,width:"300px"  }} color="error" onClick={handleClickOpen} label={isArchived ? "Archived" : "Archive"} />
                        </Grid>
                        <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                       
                    >
                        <FormControlLabel
                            control={<Switch color="primary" />}
                            label="Task Reviews"
                            labelPlacement="start"
                            checked={ProjectDetails.enable_task_reviews}
                            onChange={handleReviewToggle}
                        />
                         </Grid>
                    </Grid>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to {!isArchived ? "archive" : "unarchive"} this project?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} label="Cancel" />
                    <Button onClick={handleok} label="Ok" autoFocus />
                </DialogActions>
            </Dialog>

        </ThemeProvider>
    )
}

export default AdvancedOperation;