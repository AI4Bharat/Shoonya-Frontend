import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import { useDispatch, useSelector } from "react-redux";
import GetAllTasksAPI from "../../../../redux/actions/api/Tasks/GetAllTasks";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import {
  ThemeProvider,
  Grid,
  Box,
  Tooltip,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import ColumnList from "../common/ColumnList";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";
import FilterListIcon from "@mui/icons-material/FilterList";
import AllTasksFilterList from "./AllTasksFilter";
import CustomButton from '../common/Button';

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
const AllTaskTable = (props) => {
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

  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const AllTaskData = useSelector((state) => state.getAllTasksdata.data);

  const filterData = {
    Status: ["incomplete", "annotated", "reviewed", "exported"],
  };
  const [selectedFilters, setsSelectedFilters] = useState({
    task_status: [filterData.Status[0]],
  });

  const GetAllTasksdata = () => {
    const taskObjs = new GetAllTasksAPI(id, selectedFilters);
    dispatch(APITransport(taskObjs));
  };

  useEffect(() => {
    GetAllTasksdata();
  }, []);

  
  useEffect(() => {
    if (AllTaskData?.length > 0 && AllTaskData[0]?.data) {
      const data = AllTaskData.map((el) => {
        let row = [el.id];
        row.push(
          ...Object.keys(el.data)
            .filter((key) => !excludeCols.includes(key))
            .map((key) => el.data[key])
        );
        AllTaskData[0].task_status && row.push(el.task_status);
        <CustomButton
        label={<Typography sx={{ color: "#FFFFFF" }} variant="body2">
            View
        </Typography>} />
        return row;
        
      });
     
      let colList = ["id"];
      colList.push(
        ...Object.keys(AllTaskData[0].data).filter(
          (el) => !excludeCols.includes(el)
        )
      );
      AllTaskData[0].task_status && colList.push("status");
      colList.push("actions");
      console.log("colList", colList);
      const cols = colList.map((col) => {
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            //customHeadLabelRender: customColumnHead,
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
  }, [AllTaskData]);

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

  const renderToolBar = () => {
    // const buttonSXStyle = { borderRadius: 2, margin: 2 }
    return (
      <Box className={classes.filterToolbarContainer} sx={{ height: "80px" }}>
        {/* <ColumnList
                columns={columns}
                setColumns={setSelectedColumns}
                selectedColumns={selectedColumns}
            /> */}
        <Tooltip title="Filter Table">
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
        </Tooltip>
      </Box>
    );
  };
  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    // customToolbar: fetchHeaderButton,
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    // rowsPerPage: PageInfo.count,
    filter: false,
    // page: PageInfo.page,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };

  return (
    <div>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          // title={""}
          data={tasks}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
      {popoverOpen && (
        <AllTasksFilterList
          id={filterId}
          open={popoverOpen}
          anchorEl={anchorEl}
          handleClose={handleClose}
          filterStatusData={filterData}
          updateFilters={setsSelectedFilters}
          currentFilters={selectedFilters}
          onchange={GetAllTasksdata}
        />
      )}
    </div>
  );
};

export default AllTaskTable;
