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

const RecentTasks = ({setstart_date, setend_date,start_date,end_date}) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [columns, setColumns] = useState([]);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filterdata, setFilteredData] = useState();
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
useEffect(() => {
  if(start_date && end_date !==null  ){
  const updatedData = RecentTasks.results.filter(item => {
    const datePart = item['Updated at'].split(" ")[0]; 
    const [day, month, year] = datePart.split("-");
    const itemDate = new Date(`${year}-${month}-${day}`);
    const [startDay, startMonth, startYear] = start_date.split("-");
    const startDateObj = new Date(`${startMonth}-${startDay}-${startYear}`);
    startDateObj.setHours(0,0,0,0)
    const [endDay, endMonth, endYear] = end_date.split("-");
    const endDateObj = new Date(`${endMonth}-${endDay}-${endYear}`);
    endDateObj.setHours(0,0,0,0)
    itemDate.setHours(0,0,0,0)

    console.log(itemDate.getDate(),datePart,startDateObj , end_date,endDateObj);
    return(itemDate >= startDateObj && itemDate <= endDateObj);
  });

  setFilteredData(updatedData);
  console.log(updatedData);
}
}, [start_date,end_date]);
  
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
          data={filterdata||RecentTasks?.results||[] }
          columns={columns}
          options={tableOptions}
        />
      </ThemeProvider>
    </ThemeProvider>
  )
}

export default RecentTasks