import {
  ThemeProvider,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from 'react-router-dom';
import FetchRecentTasksAPI from "../../../../redux/actions/api/UserManagement/FetchRecentTasks";
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../config/localisation";

const TASK_TYPES = ["annotation", "review","supercheck"]

const RecentTasks = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [columns, setColumns] = useState([]);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const RecentTasks = useSelector((state) => state.getRecentTasks.data)

  useEffect(() => {
    const taskObj = new FetchRecentTasksAPI(id, taskType, currentPageNumber, currentRowPerPage);
    dispatch(APITransport(taskObj));
  }, [id, taskType, currentPageNumber, currentRowPerPage])

  useEffect(() => {
    if (RecentTasks?.results?.length > 0) {
      let tempColumns = []
      Object.keys(RecentTasks.results[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: false,
            align: "center",
          },
        })
      })
      setColumns(tempColumns)
    } else {
      setColumns([])
    }
  }, [RecentTasks])

  const tableOptions = {
    count: RecentTasks?.count,
      rowsPerPage: currentRowPerPage,
      page: currentPageNumber - 1,
      rowsPerPageOptions: [10, 25, 50, 100],
      textLabels: {
        pagination: {
          next: "Next >",
          previous: "< Previous",
        },
        body: {
          noMatch: "No records ",
        },
      },
      onChangePage: (currentPage) => { 
        setCurrentPageNumber(currentPage + 1);
      },
      onChangeRowsPerPage: (rowPerPageCount) => { 
        setCurrentPageNumber(1); 
        setCurrentRowPerPage(rowPerPageCount); 
      },
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    serverSide: true,
  };

  return (
    <ThemeProvider theme={themeDefault}>
      <Box >
        <Tabs value={taskType} onChange={(e, newVal) => setTaskType(newVal)} aria-label="basic tabs example" sx={{mb: 2}}>
            <Tab label={translate("label.recentTasks.annotation")} value="annotation" sx={{ fontSize: 16, fontWeight: '700'}}/>
            <Tab label={translate("label.recentTasks.review")} value="review" sx={{ fontSize: 16, fontWeight: '700'}}/>
            <Tab label="Super Check" value="supercheck" sx={{ fontSize: 16, fontWeight: '700'}}/>
        </Tabs>
      </Box>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={RecentTasks?.results ?? []}
          columns={columns}
          options={tableOptions}
        />
      </ThemeProvider>
    </ThemeProvider>
  )
}

export default RecentTasks