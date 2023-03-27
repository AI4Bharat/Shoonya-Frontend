import { Box, Button, Card, Grid, Tab, Tabs, ThemeProvider, Typography, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams, useHistory } from 'react-router-dom';
import TaskTable from "../../component/Project/TaskTable"
import MembersTable from "../../component/Project/MembersTable"
import ReportsTable from "../../component/Project/ReportsTable"
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { translate } from "../../../../config/localisation";
// import TabPanel from "../../component/common/TabPanel";
import addUserTypes from "../../../../constants/addUserTypes";
import Spinner from "../../component/common/Spinner";
import Menu from '@mui/material/Menu';
import { styled, alpha } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DatasetStyle from "../../../styles/Dataset";
import ProjectDescription from "./ProjectDescription";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AllTaskTable from "../../component/Project/AllTaskTable";
import roles from "../../../../utils/UserMappedByRole/UserRoles";



const menuOptions = [
    { name: "Tasks", isChecked: false, component: () => null },
    { name: "Members", isChecked: false, component: () => null },
    { name: "Reports", isChecked: true, component: () => null }
]

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
                <Box sx={{ p: 3 }} >
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));
const Projects = () => {
    // console.log("props", props)
    const { id } = useParams();
    const classes = DatasetStyle();
    const [projectData, setProjectData] = useState([
        { name: "Project ID", value: null },
        { name: "Description", value: null },
        { name: "Project Type", value: null },
        { name: "Status", value: null },
        { name: "Unassigned Task", value: null },
        { name: "Total Labeled Task", value: null },
    ])
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const dispatch = useDispatch();
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
    const loggedInUserData = useSelector(
        (state) => state.fetchLoggedInUserData.data
      );
 
    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }
    useEffect(() => {
        getProjectDetails();
        const projectStatus = ProjectDetails.is_published ? "Published" : ProjectDetails.is_archived ? "Archived" : "Draft";
        setProjectData([
            {
                name: "Project ID",
                value: ProjectDetails.id
            },
            {
                name: "Description",
                value: ProjectDetails.description
            },
            {
                name: "Project Type",
                value: ProjectDetails.project_type
            },
            {
                name: "Status",
                value: projectStatus
            },
            {
                name: "Unassigned Annotation Tasks",
                value: ProjectDetails.unassigned_task_count
            },
            {
                name: "Unassigned Review Tasks",
                value: ProjectDetails.labeled_task_count
            },
        ])
    }, [ProjectDetails.id]);
    const [loading, setLoading] = useState(false);
    const [annotationreviewertype, setAnnotationreviewertype] = useState()
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const isAnnotators = roles.filter((role) => role.role === userDetails?.role)[0]?.isAnnotators  || ProjectDetails?.annotators?.some((user) => user.id === userDetails.id);
    const isReviewer = ProjectDetails?.project_stage == 2 && (roles.filter((role) => role.role === userDetails?.role)[0]?.isReviewer || ProjectDetails?.annotation_reviewers?.some((reviewer) => reviewer.id === userDetails?.id));
    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

    let projectdata = ProjectDetails?.annotators?.filter((x) => {
        return (ProjectDetails?.annotation_reviewers?.find((choice) => choice.id === x.id));
    });

    let data = projectdata?.filter((x) => {
        return (userDetails.id == x.id);
    })

    let annotationdata = ProjectDetails?.annotators?.filter((x) => x.id == userDetails.id);
    let reviewerdata = ProjectDetails?.annotation_reviewers?.filter((x) => x.id == userDetails.id);
    useEffect(() => {

        if (annotationdata?.length && !reviewerdata?.length) {
            setAnnotationreviewertype("Annotation Reports")
        } else if (reviewerdata?.length && !annotationdata?.length) {
            setAnnotationreviewertype("Reviewer Reports")

        }
    }, [annotationdata, reviewerdata])

    const handleOpenSettings = () => {
        navigate(`/projects/${id}/projectsetting`);
    }
 
    return (
        <ThemeProvider theme={themeDefault}>
            {/* <Header /> */}
            {loading && <Spinner />}
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
                        container
                        direction='row'
                        justifyContent='center'
                        alignItems='center'
                        sx={{ mb: 3 }}
                    >
                        <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                            <Typography  variant="h3">{ProjectDetails.title}</Typography>
                        </Grid>

                        {roles.filter((role) => role.role === loggedInUserData?.role)[0]?.projectSettingsIconButton && <Grid item  xs={12} sm={12} md={2} lg={2} xl={2}>
                            <Tooltip title={translate("label.showProjectSettings")}>
                                <IconButton onClick={handleOpenSettings} sx={{marginLeft:"140px"}}>
                                    <SettingsOutlinedIcon
                                        color="primary.dark"
                                        fontSize="large"
                                    />
                                </IconButton>
                            </Tooltip>
                        </Grid>}

                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  sx={{ mb: 2 }}>
                        <Grid container spacing={2}>
                            {projectData?.map((des, i) => (
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <ProjectDescription
                                        name={des.name}
                                        value={des.value}
                                        index={i}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid>

                        <Box >
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

                                {isAnnotators && <Tab label={translate("label.annotationTasks")} sx={{ fontSize: 16, fontWeight: '700' }} />}
                                {isReviewer && <Tab label={translate("label.reviewTasks")} sx={{ fontSize: 16, fontWeight: '700', }} />}
                                {isAnnotators && <Tab label={translate("label.annotators")} sx={{ fontSize: 16, fontWeight: '700', }} />}
                                {isReviewer && <Tab label={translate("label.reviewers")} sx={{ fontSize: 16, fontWeight: '700', }} />}
                                <Tab label={translate("label.reports")} sx={{ fontSize: 16, fontWeight: '700', flexDirection: "row-reverse" }} onClick={handleClick} />
                                {(roles.filter((role) => role.role === loggedInUserData?.role)[0]?.allTaskTab) && <Tab label="All Tasks" sx={{ fontSize: 16, fontWeight: '700'}}  />}      </Tabs>
                        </Box>

                    </Grid>
                    {isAnnotators && <TabPanel value={value} index={0} >
                        <TaskTable type="annotation"  ProjectDetails={ProjectDetails}/>
                    </TabPanel>}
                    {isReviewer && <TabPanel value={value} index={isAnnotators ? 1 : 0}>
                        <TaskTable type="review" />
                    </TabPanel>}
                    {isAnnotators && <TabPanel value={value} index={isAnnotators ? isReviewer ? 2 : 1 : 1} >
                        <MembersTable onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()} dataSource={ProjectDetails.annotators} type={addUserTypes.PROJECT_ANNOTATORS} />
                    </TabPanel>}
                    {isReviewer && <TabPanel value={value} index={isAnnotators ? 3 : 1}>
                        <MembersTable onRemoveSuccessGetUpdatedMembers={() => getProjectDetails()} dataSource={ProjectDetails.annotation_reviewers} type={addUserTypes.PROJECT_REVIEWER} />
                    </TabPanel>}
                    <TabPanel value={value} index={isAnnotators ? isReviewer ? 4 : 2 : 2}>
                        <ReportsTable annotationreviewertype={annotationreviewertype} />
                    </TabPanel>
               {(roles.filter((role) => role.role === loggedInUserData?.role)[0]?.allTaskTab) && ( <TabPanel value={value} index={isAnnotators ? isReviewer ? 5 : 3 : 3}>
                        <AllTaskTable  />
                    </TabPanel>)}
                </Card>
            </Grid>
        </ThemeProvider>
    )
}

export default Projects;
