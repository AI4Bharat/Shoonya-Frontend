// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import CustomButton from '../common/Button';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box, Tooltip } from "@mui/material";
import DatasetStyle from "../../../styles/Dataset";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterList from "./FilterList";
import PullNewBatchAPI from "../../../../redux/actions/api/Tasks/PullNewBatch";
import CustomizedSnackbars from "../../component/common/Snackbar";

const columns = [
    {
        name: "ID",
        label: "ID",
        options: {
            filter: false,
            sort: false,
            align: "center"
        }
    },
    {
        name: "Context",
        label: "Context",
        options: {
            filter: false,
            sort: false,
            align: "center"
        }
    },
    {
        name: "Input Text",
        label: "Input Text",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Input Language",
        label: "Input Language",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Output Language",
        label: "Output Language",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Machine translation",
        label: "Machine translation",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: false,
            sort: false,
        }
    },
    {
        name: "Actions",
        label: "Actions",
        options: {
            filter: false,
            sort: false,
        }
    }];





const TaskTable = () => {
    const classes = DatasetStyle();
    const { id } = useParams();
    const dispatch = useDispatch();
    const taskList = useSelector(state => state.getTasksByProjectId.data.results);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [anchorEl, setAnchorEl] = useState(null);
    const popoverOpen = Boolean(anchorEl);
    const filterId = popoverOpen ? "simple-popover" : undefined;
    const getProjectUsers = useSelector(state=>state.getProjectDetails.data.users)
    const [selectedFilters, setsSelectedFilters] = useState({task_status: "unlabeled", user_filter: -1});
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
    const [tasks, setTasks] = useState([]);
    const [pullSize, setPullSize] = useState();
    const [pullDisabled, setPullDisabled] = useState("");
    const PullBatchRes = useSelector(state => state.pullNewBatch);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });
    const [pullClicked, setPullClicked] = useState(false);

    const filterData = {
        Status : ["unlabeled", "skipped", "accepted", "draft"],
        Annotators : getProjectUsers?.length > 0 ? getProjectUsers.filter((member) => member.role === 1).map((el,i)=>{
            return {
                label: el.username,
                value: el.id
            }
        }) : []
    }

    const getTaskListData = () => {
        const taskObj = new GetTasksByProjectIdAPI(id, currentPageNumber, currentRowPerPage, selectedFilters);
        dispatch(APITransport(taskObj));
    }

    const fetchNewTasks = () => {
        setPullClicked(true);
        const batchObj = new PullNewBatchAPI(id, currentPageNumber, currentRowPerPage, selectedFilters);
        dispatch(APITransport(batchObj));
    }

    const totalTaskCount = useSelector(state => state.getTasksByProjectId.data.count);

    useEffect(() => {
        getTaskListData();
    }, [currentPageNumber, currentRowPerPage]);

    useEffect(() => {
        if (currentPageNumber !== 1) {
            setCurrentPageNumber(1);
        } else {
            getTaskListData();
        }
    }, [selectedFilters]);

    useEffect(() => {
        if(pullClicked && PullBatchRes.status === 200) {
            getTaskListData();
            setSnackbarInfo({
                open: true,
                message: PullBatchRes.data.message,
                variant: "success",
            })
            if (selectedFilters.task_status === "unlabeled" && currentPageNumber === 1) {
                getTaskListData();
            } else {
                setsSelectedFilters({...selectedFilters, task_status: "unlabeled"});
                setCurrentPageNumber(1);
            }
        }
    }, [PullBatchRes]);

    useEffect(() => {
        const data = taskList && taskList.length > 0 ? taskList.map((el, i) => {
            return [
                el.id,
                el.data.context,
                el.data.input_text,
                el.data.input_language,
                el.data.output_language,
                el.data.machine_translation,
                el.task_status,
                <Link to={`task/${el.id}`} className={classes.link}>
                    <CustomButton
                        onClick={() => console.log("task id === ", el.id)}
                        sx={{ p: 1, borderRadius: 2 }}
                        label={<Typography sx={{color : "#FFFFFF"}} variant="body2">
                            {ProjectDetails.project_mode === "Annotation" ? "Annotate" : "Edit"}
                        </Typography>} />
                </Link>
                ]
        }) : []
        setTasks(data);
    }, [taskList, ProjectDetails.project_mode]);

    useEffect(() => {
        if (ProjectDetails) {
            if (ProjectDetails.unassigned_task_count === 0)
                setPullDisabled("No more unassigned tasks in this project")
            ProjectDetails.frozen_users?.forEach((user) => {
                if (user.id === userDetails?.id) 
                    setPullDisabled("You're no more a part of this project");
            })
            setPullSize(ProjectDetails.tasks_pull_count_per_batch*0.5);
        }
    }, [ProjectDetails, userDetails])

    useEffect(() => {
        if (totalTaskCount && selectedFilters.task_status === "unlabeled" && totalTaskCount >=ProjectDetails?.max_pending_tasks_per_user) {
            setPullDisabled("You have too many unlabeled tasks")
        }
    }, [totalTaskCount, ProjectDetails.max_pending_tasks_per_user, selectedFilters.task_status])

    const handleShowFilter = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const renderToolBar = () => {
        const buttonSXStyle = { borderRadius: 2, margin: 2 }
        return (
            <Grid container spacing={0} md={12}>
                <Grid item xs={8} sm={8} md={12} lg={12} xl={12} className={classes.filterToolbarContainer}>
                    {userDetails?.role!==1 && <FormControl size="small" sx={{width: "30%"}}>
                        <InputLabel id="annotator-filter-label">Filter by Annotator</InputLabel>
                        <Select
                        labelId="annotator-filter-label"
                        id="annotator-filter"
                        value={selectedFilters.user_filter}
                        label="Filter by Annotator"
                        onChange={(e) => setsSelectedFilters({...selectedFilters, user_filter: e.target.value})}
                        >
                        <MenuItem value={-1}>All</MenuItem>
                        {filterData.Annotators.map((el, i) => (
                            <MenuItem value={el.value}>{el.label}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>}
                    <Button onClick={handleShowFilter}>
                        <FilterListIcon />
                    </Button>
                    {/* <Typography variant="caption">Filter by Status:</Typography>
                    <Button variant={filterTypeValue == "unlabeled" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("unlabeled")}>unlabeled</Button>
                    <Button variant={filterTypeValue == "skipped" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("skipped")}>skipped</Button>
                    <Button variant={filterTypeValue == "accepted" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("accepted")}>accepted</Button> */}
                </Grid>
            </Grid>
        )
    }

    const renderSnackBar = () => {
        return (
          <CustomizedSnackbars
            open={snackbar.open}
            handleClose={() =>
              setSnackbarInfo({ open: false, message: "", variant: "" })
            }
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant={snackbar.variant}
            message={snackbar.message}
            autoHideDuration={2000}
          />
        );
      };

    const options = {
        count: totalTaskCount,
        rowsPerPage: currentRowPerPage,
        page: currentPageNumber - 1,
        rowsPerPageOptions: [10, 25, 50, 100],
        textLabels: {
            pagination: {
                next: "Next >",
                previous: "< Previous",
                rowsPerPage: "currentRowPerPage",
                displayRows: "OF"
            }
        },
        onChangePage: (currentPage) => { 
            currentPage + 1 > currentPageNumber && setCurrentPageNumber(currentPage + 1);
        },
        onChangeRowsPerPage: (rowPerPageCount) => { 
            setCurrentPageNumber(1); 
            setCurrentRowPerPage(rowPerPageCount); 
            console.log("rowPerPageCount", rowPerPageCount) 
        },
        filterType: 'checkbox',
        selectableRows: "none",
        download: false,
        filter: false,
        print: false,
        search: false,
        viewColumns: false,
        textLabels: {
            body: {
                noMatch: "No records ",
            },
            toolbar: {
                search: "Search",
                viewColumns: "View Column",
            },
            pagination: {
                rowsPerPage: "Rows per page",
            },
            options: { sortDirection: "desc" },
        },
        customToolbar: renderToolBar,
    };

    return (
        <Fragment>
        {userDetails?.role === 1 && (ProjectDetails.project_mode === "Annotation" ? (
            ProjectDetails.is_published ? (
                <Box
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    marginBottom: "1%",
                    flexWrap: "wrap",
                    alignItems: "flex-end",
                }}
                >
                <FormControl size="small" sx={{width: "18%", ml: "1%", mr:"1%", mb: 3}}>
                    <InputLabel id="pull-select-label">Pull Size</InputLabel>
                    <Select
                    labelId="pull-select-label"
                    id="pull-select"
                    value={pullSize}
                    label="Pull Size"
                    onChange={(e) => setPullSize(e.target.value)}
                    disabled={pullDisabled}
                    >
                    <MenuItem value={ProjectDetails?.tasks_pull_count_per_batch*0.5}>{ProjectDetails?.tasks_pull_count_per_batch*0.5}</MenuItem>
                    <MenuItem value={ProjectDetails?.tasks_pull_count_per_batch}>{ProjectDetails?.tasks_pull_count_per_batch}</MenuItem>
                    <MenuItem value={ProjectDetails?.tasks_pull_count_per_batch*1.5}>{ProjectDetails?.tasks_pull_count_per_batch*1.5}</MenuItem>
                    </Select>
                </FormControl>
                <Tooltip title={pullDisabled}>
                    <Box sx={{width: '38%', ml: "1%", mr:"1%", mb: 3}}>
                        <CustomButton 
                            sx={{ p: 1, width: '100%', borderRadius: 2, margin: "auto" }} 
                            label={"Pull New Batch"} 
                            disabled={pullDisabled} 
                            onClick={fetchNewTasks} 
                        />
                    </Box>
                </Tooltip>
                <CustomButton sx={{ p: 1, width: '38%', borderRadius: 2, mb: 3, ml: "1%", mr:"1%" }} label={"Start Labelling Now"} />
                </Box>
            ) : (
                <Button
                type="primary"
                style={{
                    width: "100%",
                    marginBottom: "1%",
                    marginRight: "1%",
                }}
                >
                Disabled
                </Button>
            )
            ) : ( 
                <CustomButton sx={{ p: 1, width: '98%', borderRadius: 2, mb: 3, ml: "1%", mr:"1%" }} label={"Add New Item"} />
            ))}
            <MUIDataTable
                title={""}
                data={tasks}
                columns={columns}
                options={options}
            // filter={false}
            />
            {popoverOpen && (
                <FilterList
                    id={filterId}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    filterStatusData={filterData}
                    updateFilters={setsSelectedFilters}
                    currentFilters={selectedFilters}
                />
            )}
            {renderSnackBar()}
        </Fragment>
    )
}

export default TaskTable;