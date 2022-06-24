import { Box, Card, Divider, Grid, Tab, Tabs, ThemeProvider, Typography, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetSaveButtonAPI from '../../../../redux/actions/api/ProjectDetails/EditUpdate'
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import GetPublishProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetPublishProject';
import GetPullNewDataAPI from '../../../../redux/actions/api/ProjectDetails/PullNewData';
import GetArchiveProjectAPI from '../../../../redux/actions/api/ProjectDetails/ArchiveProject'
import CustomButton from "../../component/common/Button";
import BackButton from "../../component/common/Button"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DownloadProjectButton from './DownloadProjectButton';


const ProjectSetting = (props) => {
    const [projectData, setProjectData] = useState([
        { name: "Project ID", value: null },
        { name: "Description", value: null },
        { name: "Project Type", value: null },
        { name: "Status", value: null },
    ])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState();
    const { id } = useParams();

    const classes = DatasetStyle();
    const dispatch = useDispatch();


    const ProjectDetails = useSelector(state => state.getProjectDetails.data);

    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        getProjectDetails();

    }, []);
    console.log(ProjectDetails, "ProjectDetails")


    const getSaveButtonAPI = () => {
        const projectObj = new GetSaveButtonAPI(id, ProjectDetails);

        dispatch(APITransport(projectObj));
    }



    const getExportProjectButton = () => {
        const projectObj = new GetExportProjectButtonAPI(id);

        dispatch(APITransport(projectObj));
    }




    const getPublishProjectButton = () => {
        const projectObj = new GetPublishProjectButtonAPI(id);

        dispatch(APITransport(projectObj));
    }


    const getPullNewDataAPI = () => {
        const projectObj = new GetPullNewDataAPI(id);

        dispatch(APITransport(projectObj));
    }


    const ArchiveProject = useSelector(state => state.getArchiveProject.data);
    const [isArchived, setIsArchived] = useState(ArchiveProject.is_archived);
    const getArchiveProjectAPI = () => {
        const projectObj = new GetArchiveProjectAPI(id);

        dispatch(APITransport(projectObj));
    }

    console.log(ArchiveProject, "ArchiveProject")

    const handleSave = () => {
        getSaveButtonAPI()
    }
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
    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }

    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'

            >

                <Card
                    sx={{
                        // width: window.innerWidth * 0.8,
                        width: "100%",
                        minHeight: 500,
                        padding: 5
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
                        <Typography variant="h3" gutterBottom component="div">
                            Project Settings
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ margin: "38px 0px 30px 0px" }}
                    >
                        <Typography variant="h4" gutterBottom component="div"  >
                            Basic Settings
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >
                            <Typography gutterBottom component="div" label="Required">
                                Project Name :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField fullWidth value={ProjectDetails.title} onChange={(e) => setValue(e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            justifyContent: "space-between",
                            mt: 2
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >

                            <Typography gutterBottom component="div">
                                Project Description :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField
                                fullWidth
                                value={ProjectDetails.description}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        sx={{
                            mt: 5,
                            mb: 2,
                            justifyContent: "flex-end"
                        }}
                    >
                        <CustomButton sx={{ inlineSize: "max-content" }}
                            style={{ padding: "0px 25px 0px 25px" }}
                            onClick={handleSave}
                            label="Save" />

                    </Grid>

                    <Divider />

                    <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        sx={{
                            mt: 3,
                            mb: 3,
                            // justifyContent: "flex-end"
                        }}
                    >
                        <Typography variant="h4" gutterBottom component="div">
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
                        <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 }} onClick={handlePublishProject} label="Publish Project" />
                        {ProjectDetails.sampling_mode == "f" ? <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 }} onClick={handleExportProject} label="Export Project into Dataset" /> : " "}

                        <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 }} onClick={handleClickOpen} label={isArchived ? "unArchived" : "Archived"} />

                        <CustomButton sx={{ inlineSize: "max-content", p: 2, borderRadius: 3, ml: 2 }} onClick={handlePullNewData} label="Pull New Data Items from Source Dataset" />

                        <DownloadProjectButton />

                    </Grid>
                    <Divider />
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h4" gutterBottom component="div" style={{ margin: "30px 0px 10px 0px", }}>
                            Read-only Configurations
                        </Typography>
                    </Grid>
                    {ProjectDetails && ProjectDetails.sampling_mode && (
                        <div>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                xl={12}
                                sm={12}
                            >

                                <Typography variant="h5" gutterBottom component="div" style={{ margin: "15px 0px 10px 0px", }}>
                                    Sampling Parameters
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                xl={12}
                                sm={12}
                            >
                                <Typography gutterBottom component="div" style={{ float: "left", marginRight: "150px" }} >
                                    Sampling Mode :
                                </Typography>

                                <Typography  >
                                    {ProjectDetails.sampling_mode == "f" && "Full"}
                                    {ProjectDetails.sampling_mode == "b" && "Batch"}
                                    {ProjectDetails.sampling_mode == "r" && "Random"}

                                </Typography>

                            </Grid>
                        </div>
                    )}
                </Card>
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to {!isArchived ? "unarchive" : "archive"} this project?
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

export default ProjectSetting;