import {
  ThemeProvider,
  Box,
  Tabs,
  Tab,
  IconButton
} from "@mui/material";
import { Grid } from "@mui/material";

import React, { useEffect, useState } from "react";
import AllTasksFilterList from "../Project/AllTasksFilter";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from 'react-router-dom';
import  Search  from "../../component/common/Search";
import FetchRecentTasksAPI from "../../../../redux/actions/api/UserManagement/FetchRecentTasks";
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../config/localisation";
import SearchIcon from "@mui/icons-material/Search";
import AllTaskSearchPopup from '../Project/AllTaskSearchPopup';


const TASK_TYPES = ["annotation", "review","supercheck"]

const RecentTasks = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [text,settext] = useState("")
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const RecentTasks = useSelector((state) => state.getRecentTasks.data)
  const SearchWorkspace = useSelector((state) => state.SearchProjectCards.data);
  const filterData = {
    Status: ["incomplete", "annotated", "reviewed","super_checked","exported"],
  };
  const [selectedFilters, setsSelectedFilters] = useState({});
  // useEffect(() => {
  //   const taskObj = new FetchRecentTasksAPI(id, taskType, currentPageNumber, currentRowPerPage);
  //   dispatch(APITransport(taskObj));
  // }, [id, taskType, currentPageNumber,selectedFilters, currentRowPerPage])

  // const GetAllTasksdata = () => {
  //   const taskObjs = new FetchRecentTasksAPI(id, taskType,currentPageNumber,selectedFilters, currentRowPerPage);
  //   dispatch(APITransport(taskObjs));
  // };

  const GetAllTasksdata = () => {
    const taskObjs = new FetchRecentTasksAPI( taskType,currentPageNumber,selectedFilters, currentRowPerPage);
    dispatch(APITransport(taskObjs));
  };

  useEffect(() => {
    GetAllTasksdata();
  }, [taskType,currentPageNumber, currentRowPerPage,selectedFilters]);


  useEffect(() => {
    if (RecentTasks && RecentTasks?.results?.results?.length > 0) {
      // console.log(RecentTasks.results);
      const data = RecentTasks?.results?.results?.map((el) => {
        // let row=[];
        if (typeof el === 'object') {
          return Object.keys(el).map((key) => el[key]);
        }
        return []; 
        // console.log(row);
        // console.log("kkk",el);
        // return row;
        
      });
      let colList = [];
      console.log(...Object.keys(RecentTasks.results.results[0]));
      if (RecentTasks.results.results.length > 0 && typeof RecentTasks.results.results[0] === 'object') {

      colList.push(
        ...Object.keys(RecentTasks.results.results[0])
      );
      }
      const cols = colList.map((col) => {
        return {
          name: col,
          label: col,
          options: {
            filter: false,
            sort: false,
            align: "center",
            customHeadLabelRender: customColumnHead,
          },
        };
      });
      console.log("colss", cols,colList);
      setColumns(cols);
      setSelectedColumns(colList);
      setTasks(data);
    } else {
      setTasks([]);
    }
    }, [RecentTasks]);
    const handleClose = () => {
      setAnchorEl(null);
    };
  
  const handleSearchClose = () => {
    setSearchAnchor(null);
  }
    const handleShowSearch = (col, event) => {
      setSearchAnchor(event.currentTarget);
      setSearchedCol(col);
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
                  { <IconButton sx={{ borderRadius: "100%" }} onClick={(e) => handleShowSearch(col.name, e)}>
                      <SearchIcon id={col.name + "_btn"} />
                  </IconButton>}
          </Box>
      );
  }
  
  useEffect(() => {
    const newCols = columns.map((col) => {
      col.options.display = selectedColumns.includes(col.name)
        ? "true"
        : "false";
      return col;
    });
    setColumns(newCols);
  }, [selectedColumns]);

  



//   const pageSearch = () => {

//     return RecentTasks?.results?.filter((el) => {
//       console.log(el.ProjectID);

//         if (SearchWorkspace == "") {

//             return el;
//         } else if (
//             el['Project ID']
//                 ?.toString()?.toLowerCase()
//                 .includes(SearchWorkspace?.toLowerCase())
//         ) {

//             return el;
//         }
//         else if (
//           el["Task ID"]
//               .toString()?.toLowerCase()
//               .includes(SearchWorkspace?.toLowerCase())
//       ) {

//           return el;
//       }
//       else if (
//         el["Created at"]
//             ?.toLowerCase()
//             .includes(SearchWorkspace?.toLowerCase())
//     ) {

//         return el;
//     }
//     else if (
//       el["Updated at"]
//           ?.toLowerCase()
//           .includes(SearchWorkspace?.toLowerCase())
//   ) {

//       return el;
//   }else if (
//     el["Annotated at"]
//         ?.toLowerCase()
//         .includes(SearchWorkspace?.toLowerCase())
// ) {

//     return el;
// }
//     })

// }
// const columns = [
//   {
//     name: "Project ID",
//     label: "Project ID",
//     options: {
//                 filter: false,
//                 sort: false,
//                 align: "center",
//               },
//   },
//   {
//     name: "Task ID",
//     label: "Task ID",
//     options: {
//                 filter: false,
//                 sort: false,
//                 align: "center",
//               },
//   },
//   {
//     name: "Created At",
//     label: "Created At",
//     options: {
//                 filter: false,
//                 sort: false,
//                 align: "center",
//               },
//   },
//   {
//     name: "Updated At",
//     label: "Updated At",
//     options: {
//                 filter: false,
//                 sort: false,
//                 align: "center",
//               },
//   },

//   {
//     name: "Annotated At",
//     label: "Annotated At",
//     options: {
//                 filter: false,
//                 sort: false,
//                 align: "center",
//               },
//   },
// ];




// const data = RecentTasks && RecentTasks?.results?.length > 0 ?pageSearch().map((el, i) => {
//   return [
//       el['Project ID'],
//       el["Task ID"],
//       el["Updated at"],
//       el["Created at"],
//       el["Annotated at"]
//       // el.managers.map((manager, index) => {
//       //     return manager.username
//       // }).join(", "),
//       // el.created_by && el.created_by.username,
//       // <Link to={`/workspaces/${el.id}`} style={{ textDecoration: "none" }}>
//       //     <CustomButton
//       //         sx={{ borderRadius: 2 }}
//       //         label="View"
//       //     />
//       // </Link>
//   ]
// })  : [];
  // useEffect(() => {
  //   if (RecentTasks?.results?.length > 0) {
  //     let tempColumns = []
  //     Object.keys(RecentTasks.results[0]).forEach((key) => {
  //       tempColumns.push({
  //         name: key,
  //         label: key,
  //         options: {
  //           filter: false,
  //           sort: false,
  //           align: "center",
  //         },
  //       })
  //     })
  //     setColumns(tempColumns)
  //   } else {
  //     setColumns([])
  //   }
  // }, [RecentTasks])

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
      <Box>
        <Tabs value={taskType} onChange={(e, newVal) => setTaskType(newVal)} aria-label="basic tabs example" sx={{mb: 2}}>
            <Tab label={translate("label.recentTasks.annotation")} value="annotation" sx={{ fontSize: 16, fontWeight: '700'}}/>
            <Tab label={translate("label.recentTasks.review")} value="review" sx={{ fontSize: 16, fontWeight: '700'}}/>
            <Tab label="Super Check" value="supercheck" sx={{ fontSize: 16, fontWeight: '700'}}/>
        </Tabs>
      </Box>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={tasks}
          columns={columns}
          options={tableOptions}
        />
      </ThemeProvider>
      {/* {popoverOpen && (
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
      )} */}
       {searchOpen && <AllTaskSearchPopup
                    open={searchOpen}
                    anchorEl={searchAnchor}
                     handleClose={handleSearchClose}
                    updateFilters={setsSelectedFilters}
                    //filterStatusData={filterData}
                    currentFilters={selectedFilters}
                    searchedCol={searchedCol}
                    onchange={GetAllTasksdata}
                />}
    </ThemeProvider>
  )
}

export default RecentTasks