import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GetDataitemsById from "../../../../redux/actions/api/Dataset/GetDataitemsById";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Typography, ThemeProvider,Box, IconButton, } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";
import ColumnList from "./ColumnList";
import SearchIcon from '@mui/icons-material/Search';
import DatasetSearchPopup from '../../container/Dataset/DatasetSearchPopup';
import Spinner from "../../component/common/Spinner";



const excludeKeys = [
  "parent_data_id",
  "metadata_json",
  "instance_id_id",
  "datasetbase_ptr_id",
  "key",
  "instance_id",
  "speakers_json",
  // "conversation_json",
  "transcribed_json",
  "machine_transcribed_json",
  "prediction_json",
  "conversation_json",
  "machine_translated_conversation_json",
  "speakers_json",
  "unverified_conversation_json"
];

const DataitemsTable = () => {
  const classes = DatasetStyle();
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const dataitemsList = useSelector((state) => state.getDataitemsById.data);
  const filterdataitemsList =useSelector((state) => state.datasetSearchPopup.data);
  const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
  const apiLoading = useSelector(state => state.apiStatus.loading);
 console.log(dataitemsList,"dataitemsListdataitemsList")

  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({});
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [dataitems, setDataitems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  localStorage.setItem("DataitemsList", JSON.stringify(columns));
  
  const getDataitems = () => {
    const dataObj = new GetDataitemsById(
      datasetId,
      DatasetDetails.dataset_type,
      selectedFilters,
      currentPageNumber,
      currentRowPerPage
    );
    dispatch(APITransport(dataObj));
  };

//   const dataObj = new GetDataitemsById(datasetId, currentPageNumber, currentRowPerPage, DatasetDetails.dataset_type,selectedFilters);
//   dispatch(APITransport(dataObj));
// };

  useEffect(() => {
    setLoading(apiLoading);
}, [apiLoading]);
 

    useEffect(() => {
      let fetchedItems =dataitemsList.results;
      setTotalDataitems(dataitemsList.count);
      fetchedItems = dataitemsList.results;
      setDataitems(fetchedItems);

     
   
    
    let tempColumns = [];
    let tempSelected = [];
    if (fetchedItems?.length) {
      Object.keys(fetchedItems[0]).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          tempColumns.push({
            name: key,
            label: snakeToTitleCase(key),
            options: {
              filter: false,
              sort: false,
              align: "center",
              customHeadLabelRender: customColumnHead,
            },
          });
          tempSelected.push(key);
        }
      });
    }
    setColumns(tempColumns);
    setSelectedColumns(tempSelected);
    // console.log(tempSelected,"tempSelected",tempColumns)
    // if (dataitemsList?.length > 0 && dataitemsList[0]) {

    // let colList = [];
    //         colList.push(...Object.keys(dataitemsList?.[0])?.filter(el => !excludeKeys.includes(el)));
    //         const cols = colList.map((col) => {
    //             return {
    //                 name: col,
    //                 label: snakeToTitleCase(col),
    //                 options: {
    //                     filter: false,
    //                     sort: false,
    //                     align: "center",
    //                     customHeadLabelRender: customColumnHead,
    //                 }
    //             }
    //         });
            
    //         setColumns(cols);
    //         setSelectedColumns(colList);
            
          
    //       }else {
    //         setDataitems([]);
    //     }
     
     }, [dataitemsList])
   

  useEffect(() => {
    getDataitems();
  }, [currentPageNumber,currentRowPerPage,selectedFilters]);

  useEffect(() => {
    const newCols = columns.map(col => {
        col.options.display = selectedColumns.includes(col.name) ? "true" : "false";
        return col;
    });
    setColumns(newCols);
    
}, [selectedColumns]);
 


  const handleShowSearch = (col, event) => {
     setSearchAnchor(event.currentTarget);
     setSearchedCol(col);
   
}
const handleSearchClose = () => {
  setSearchAnchor(null);
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
             <IconButton sx={{ borderRadius: "100%" }} onClick={(e) => handleShowSearch(col.name, e)}>
                <SearchIcon id={col.name + "_btn"} />
            </IconButton>
        </Box>
    );
}

  const renderToolBar = () => {
    return (
      <Grid container spacing={0} md={12}>
        <Grid
          item
          xs={8}
          sm={8}
          md={12}
          lg={12}
          xl={12}
          className={classes.filterToolbarContainer}
        >
          <Grid container direction="row" justifyContent={"flex-end"}>
            <ColumnList
              columns={columns}
              setColumns={setSelectedColumns}
              selectedColumns={selectedColumns}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const options = {
    count: totalDataitems,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100, 200 ,500, 1000, 2000,4000,8000],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "currentRowPerPage",
        displayRows: "OF",
      },
    },
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentRowPerPage(rowPerPageCount);
    },
    filterType: "checkbox",
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

  return (
   <>  
       <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={dataitems}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
                  {searchOpen && <DatasetSearchPopup
                    open={searchOpen}
                    anchorEl={searchAnchor}
                     handleClose={handleSearchClose}
                    updateFilters={setsSelectedFilters}
                    currentFilters={selectedFilters}
                    searchedCol={searchedCol}
                />}
                {loading && <Spinner />}
                </>
    
  );
};

export default DataitemsTable;
