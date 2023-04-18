import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import GetAllTasksAPI from "../../../../redux/actions/api/Tasks/GetAllTasks";
import PullNewSuperCheckerBatchAPI from "../../../../redux/actions/api/Tasks/PullNewSuperCheckerBatch";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import DeallocateSuperCheckerTasksAPI from "../../../../redux/actions/api/Tasks/DeAllocateSuperCheckerTasks";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetTasksByProjectIdAPI from "../../../../redux/actions/api/Tasks/GetTasksByProjectId";
import {
  ThemeProvider,
  Grid,
  Box,
  Tooltip,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import ColumnList from "../common/ColumnList";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import AllTasksFilterList from "./AllTasksFilter";
import CustomButton from '../common/Button';
import SearchIcon from '@mui/icons-material/Search';
import AllTaskSearchPopup from './AllTaskSearchPopup';
import SuperCheckerFilter from './SuperCheckerFilter'

const excludeCols = [
  "context",
  "input_language",
  "output_language",
  "conversation_json",
  "source_conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "language",
];
const excludeSearch = ["status", "actions"];
const SuperCheckerTasks = (props) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [deallocateDialog, setDeallocateDialog] = useState(false);
  const [deallocateDisabled, setDeallocateDisabled] = useState("");
  const [pullDisabled, setPullDisabled] = useState("");


  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const totalTaskCount = useSelector((state) => state.getAllTasksdata.data.total_count);
  const filterData = {
    Status: ["unvalidated","validated","validated with Changes","skipped","draft","rejected"],
  };
  const [selectedFilters, setsSelectedFilters] = useState({
    supercheck_status: filterData.Status[0]
  });
  const [pullSize, setPullSize] = useState(
    ProjectDetails.tasks_pull_count_per_batch * 0.5
  );

  const taskList = useSelector(
    (state) => state.getTasksByProjectId.data.result
  );

  console.log(taskList,"taskListtaskList")

  const getTaskListData = () => {
    const taskObj = new GetTasksByProjectIdAPI(
      id,
      currentPageNumber,
      currentRowPerPage,
      selectedFilters,
      props.type
    );
    dispatch(APITransport(taskObj));
  };

  useEffect(() => {
    getTaskListData();
  }, [currentPageNumber, currentRowPerPage]);

  useEffect(() => {
    if (
      (
        (props.type === "superChecker" &&
          selectedFilters.task_status === "unvalidated")) &&
      totalTaskCount === 0
    ) {
      setDeallocateDisabled("No more tasks to deallocate");
    } else if (deallocateDisabled === "No more tasks to deallocate") {
      setDeallocateDisabled("");
    }
  }, [totalTaskCount, selectedFilters]);

  useEffect(() => {
    if (ProjectDetails) {
      if (props.type === "superChecker" && ProjectDetails.labeled_task_count === 0)
        setPullDisabled("No more unassigned tasks in this project");
      else if (pullDisabled === "No more unassigned tasks in this project")
        setPullDisabled("");
    }
  }, [ProjectDetails.labeled_task_count]);


  useEffect(() => {
    if (taskList?.length > 0 && taskList[0]?.data) {
      const data = taskList.map((el) => {
        let row = [el.id];
        row.push(
          ...Object.keys(el.data)
            .filter((key) => !excludeCols.includes(key))
            .map((key) => el.data[key])
        );
        taskList[0].task_status && row.push(el.task_status);
        row.push( <>
          <Link to={`SuperChecker/${el.id}`} className={classes.link}>
          <CustomButton
              onClick={() => { console.log("task id === ", el.id); localStorage.removeItem("labelAll") }}
              sx={{ p: 1, borderRadius: 2 }}
              label={<Typography sx={{ color: "#FFFFFF" }} variant="body2">
                  review
              </Typography>} />
      </Link>

        </>)
        return row;
        
      });
      let colList = ["id"];
      colList.push(
        ...Object.keys(taskList[0].data).filter(
          (el) => !excludeCols.includes(el)
        )
      );
      taskList[0].task_status && colList.push("status");
      colList.push("actions");
      const cols = colList.map((col) => {
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            customHeadLabelRender: customColumnHead,
          },
        };
      });
      console.log("colss", cols);
      setColumns(cols);
      setSelectedColumns(colList);
      setTasks(data);
    } else {
      setTasks([]);
    }
  }, [taskList]);

  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
    console.log("columnss", newCols);
  }, [selectedColumns]);


  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  
}
const handleSearchClose = () => {
  setSearchAnchor(null);
}


const unassignTasks = async () => {
  setDeallocateDialog(false);
  const deallocateObj = new DeallocateSuperCheckerTasksAPI(id, selectedFilters.task_status);
  const res = await fetch(deallocateObj.apiEndPoint(), {
    method: "GET",
    body: JSON.stringify(deallocateObj.getBody()),
    headers: deallocateObj.getHeaders().headers,
  });
  const resp = await res.json();
  if (res.ok) {
    setSnackbarInfo({
      open: true,
      message: resp?.message,
      variant: "success",
    });
    getTaskListData();
  } else {
    setSnackbarInfo({
      open: true,
      message: resp?.message,
      variant: "error",
    });
  }
};


const fetchNewTasks = async () => {
  const taskObj = new PullNewSuperCheckerBatchAPI(
    id,Math.round(pullSize)
  );
  dispatch(APITransport(taskObj));
 
};

const labelAllTasks = () =>{

}

  const customColumnHead = (col) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                columnGap: "5px",
                flexGrow: "1",
                alignItems: "center",
            }}
        >
               {col.label}
                {!excludeSearch.includes(col.name) && <IconButton sx={{ borderRadius: "100%" }} onClick={(e) => handleShowSearch(col.name, e)}>
                    <SearchIcon id={col.name + "_btn"} />
                </IconButton>}
        </Box>
    );
}


  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        <ColumnList
                columns={columns}
                setColumns={setSelectedColumns}
                selectedColumns={selectedColumns}
            />
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
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
        setCurrentPageNumber(currentPage + 1);
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
    jumpToPage: true,
    serverSide: true,
    customToolbar: renderToolBar,
};
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
    <div>
         <Grid container direction="row" spacing={2} sx={{ mb: 2 }}>
         <Grid item xs={12} sm={12} md={3}>
                  <Tooltip title={deallocateDisabled }>
                    <Box>
                      <CustomButton
                        sx={{
                          p: 1,
                          width: "100%",
                          borderRadius: 2,
                          margin: "auto",
                        }}
                        label={"De-allocate Tasks"}
                        onClick={() => setDeallocateDialog(true)}
                        disabled={deallocateDisabled }
                        color={"warning"}
                      />
                    </Box>
                  </Tooltip>
                </Grid>

                <Dialog
                open={deallocateDialog}
                onClose={() => setDeallocateDialog(false)}
                aria-labelledby="deallocate-dialog-title"
                aria-describedby="deallocate-dialog-description"
              >
                <DialogTitle id="deallocate-dialog-title">
                  {"De-allocate Tasks?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    All{" "}
                    <snap style={{ color: "#1DA3CE" }}>
                      {selectedFilters.task_status}{" "}
                      tasks
                    </snap>{" "}
                    will be de-allocated from this project. Please be careful as
                    this action cannot be undone.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setDeallocateDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={unassignTasks}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>

              <Grid
                item
                xs={4}
                sm={4}
                md={2}
              >
                 <FormControl size="small" sx={{ width: "100%" }}>
                  <InputLabel id="pull-select-label" sx={{ fontSize: "16px" }}>
                    Pull Size
                  </InputLabel>
                  <Select
                    labelId="pull-select-label"
                    id="pull-select"
                    value={pullSize}
                    // defaultValue={5}
                    label="Pull Size"
                    onChange={(e) => setPullSize(e.target.value)}
                    disabled={pullDisabled}
                    sx={{ fontSize: "16px" }}
                  >
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 0.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 0.5
                      )}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch}
                    >
                      {ProjectDetails?.tasks_pull_count_per_batch}
                    </MenuItem>
                    <MenuItem
                      value={ProjectDetails?.tasks_pull_count_per_batch * 1.5}
                    >
                      {Math.round(
                        ProjectDetails?.tasks_pull_count_per_batch * 1.5
                      )}
                    </MenuItem>
                  </Select>
                </FormControl> 
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={3}
              >
                 <Tooltip title={pullDisabled}>
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        width: "100%",
                        borderRadius: 2,
                        margin: "auto",
                      }}
                      label={"Pull New Batch"}
                      disabled={pullDisabled}
                      onClick={fetchNewTasks}
                    />
                  </Box>
                </Tooltip>
                 </Grid>
                 <Grid
                item
                xs={12}
                sm={12}
                md={4}
              >
                 <Tooltip
                  title={
                    totalTaskCount === 0 ? "No more tasks to review": ""
                  }
                >
                  <Box>
                    <CustomButton
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        margin: "auto",
                        width: "100%",
                      }}
                      label={"Start reviewing now"}
                      onClick={labelAllTasks}
                      disabled={totalTaskCount === 0 }
                    />
                  </Box>
                </Tooltip>
                </Grid>
         </Grid>
      
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          // title={""}
          data={tasks}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
      {popoverOpen && (
        <SuperCheckerFilter
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          onchange={getTaskListData}
        />
      )}
       {searchOpen && <AllTaskSearchPopup
                    open={searchOpen}
                    anchorEl={searchAnchor}
                     handleClose={handleSearchClose}
                    updateFilters={setsSelectedFilters}
                    //filterStatusData={filterData}
                    currentFilters={selectedFilters}
                    searchedCol={searchedCol}
                    onchange={getTaskListData}
                />}
              {renderSnackBar()}
    </div>
  );
};

export default SuperCheckerTasks;
