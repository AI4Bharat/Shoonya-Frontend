// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import CustomButton from '../common/Button';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DatasetStyle from "../../../styles/Dataset";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterList from "./FilterList";

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

    const filterData = {
        Status : ["unlabeled", "skipped", "accepted", "draft"],
        Annotators : getProjectUsers && getProjectUsers.length > 0 ? getProjectUsers.map((el,i)=>{
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
                        <InputLabel id="demo-simple-select-label">Filter by Annotator</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
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
            <CustomButton sx={{ p: 1, width: '100%', borderRadius: 2, mb: 3 }} label={"Disabled"} />
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
        </Fragment>
    )
}

export default TaskTable;