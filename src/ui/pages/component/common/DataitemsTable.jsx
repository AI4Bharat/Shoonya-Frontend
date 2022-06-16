// TaskTable

import MUIDataTable from "mui-datatables";
import { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GetDataitemsById from "../../../../redux/actions/api/Dataset/GetDataitemsById";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Typography } from "@mui/material";
import DatasetStyle from "../../../styles/Dataset";
import FilterListIcon from "@mui/icons-material/FilterList";
import { snakeToTitleCase } from "../../../../utils/utils";
// import FilterList from "./FilterList";

// const columns = [
//     {
//         name: "ID",
//         label: "ID",
//         options: {
//             filter: false,
//             sort: false,
//             align: "center"
//         }
//     },
//     {
//         name: "Context",
//         label: "Context",
//         options: {
//             filter: false,
//             sort: false,
//             align: "center"
//         }
//     },
//     {
//         name: "Input Text",
//         label: "Input Text",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     },
//     {
//         name: "Input Language",
//         label: "Input Language",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     },
//     {
//         name: "Output Language",
//         label: "Output Language",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     },
//     {
//         name: "Machine translation",
//         label: "Machine translation",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     },
//     {
//         name: "Status",
//         label: "Status",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     },
//     {
//         name: "Actions",
//         label: "Actions",
//         options: {
//             filter: false,
//             sort: false,
//         }
//     }];

const excludeKeys = [
  "parent_data_id",
  "metadata_json",
  "instance_id_id",
  "datasetbase_ptr_id",
  "key",
];

const DataitemsTable = () => {
  const classes = DatasetStyle();
  const { datasetId } = useParams();
  const dispatch = useDispatch();
  const dataitemsList = useSelector((state) => state.getDataitemsById.data);

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [totalDataitems, setTotalDataitems] = useState(10);
  const [dataitems, setDataitems] = useState([]);
  const [columns, setColumns] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

  const filterData = {
    Status: ["unlabeled", "skipped", "accepted"],
  };

  const getDataitems = () => {
    const dataObj = new GetDataitemsById(
      datasetId,
      currentPageNumber,
      currentRowPerPage
    );
    dispatch(APITransport(dataObj));
  };

  const totalTaskCount = useSelector(
    (state) => state.getTasksByProjectId.data.count
  );

  useEffect(() => {
    getDataitems();
  }, []);

  useEffect(() => {
    setTotalDataitems(dataitemsList.count);
    setDataitems(dataitemsList.results);
    let tempColumns = [];
    if (dataitems?.length) {
      console.log(Object.keys(dataitems[0]));
      Object.keys(dataitems[0]).forEach((key) => {
        if (!excludeKeys.includes(key)) {
          tempColumns.push({
            name: key,
            label: snakeToTitleCase(key),
            options: {
              filter: false,
              sort: false,
              align: "center",
            },
          });
        }
      });
    }
    //   tempCheckOptions.push({
    //     label: snakeToTitleCase(key),
    //     value: key,
    //   });
    setColumns(tempColumns);
  }, [dataitemsList]);

  useEffect(() => {
    getDataitems();
    console.log("fired now");
  }, [currentPageNumber]);

  useEffect(() => {
    getDataitems();
    console.log("fired now");
  }, [currentRowPerPage]);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderToolBar = () => {
    const buttonSXStyle = { borderRadius: 2, margin: 2 };
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
          <Button onClick={handleShowFilter}>
            <FilterListIcon />
          </Button>
          {/* <Typography variant="caption">Filter by Status:</Typography>
                    <Button variant={filterTypeValue == "unlabeled" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("unlabeled")}>unlabeled</Button>
                    <Button variant={filterTypeValue == "skipped" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("skipped")}>skipped</Button>
                    <Button variant={filterTypeValue == "accepted" ? "outlined" : "contained"} sx={buttonSXStyle} className={classes.filterButtons} onClick={()=>setFilterTypeValue("accepted")}>accepted</Button> */}
        </Grid>
      </Grid>
    );
  };

  const options = {
    count: totalDataitems,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
        rowsPerPage: "currentRowPerPage",
        displayRows: "OF",
      },
    },
    onChangePage: (currentPage) => {
      currentPage + 1 > currentPageNumber &&
        setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentRowPerPage(rowPerPageCount);
      console.log("rowPerPageCount", rowPerPageCount);
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
    customToolbar: renderToolBar,
  };

  return (
    <Fragment>
      <MUIDataTable
        title={""}
        data={dataitems}
        columns={columns}
        options={options}
        // filter={false}
      />
      {/* {popoverOpen && (
                <FilterList
                    id={filterId}
                    open={popoverOpen}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    filterStatusData={filterData}
                    // selectedFilter={myContributionReport.selectedFilter}
                    // clearAll={(data) => clearAll(data, handleClose)}
                    // apply={(data) => apply(data, handleClose)}
                    // task={props.task}
                />
            )} */}
    </Fragment>
  );
};

export default DataitemsTable;
