import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import Spinner from "../../component/common/Spinner";
import GetQueuedTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetQueuedTaskDetails";

const QueuedTasksDetails = (props) => {
  const dispatch = useDispatch();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [tableData, setTableData] = useState([]);
  const [queuedTaskData, setQueuedTaskData] = useState([]);

  const UserDetail = useSelector((state) => state.getQueuedTaskDetails.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const SearchQueuedTasks = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const getUserDetail = () => {
    // setLoading(true);
    const UserObj = new GetQueuedTaskDetailsAPI();
    dispatch(APITransport(UserObj));
  };
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector(
          ".MuiDataTable-responsiveBase"
        );
        if (tableWrapper) {
          tableWrapper.classList.add("MuiDataTable-vertical");
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(() => {
    const tData = pageSearch(queuedTaskData);
    setTableData(tData);
  }, [queuedTaskData, SearchQueuedTasks]);

  useEffect(() => {
    const formatedQueuedTaskData = Object.keys(UserDetail).map(
      (key) => UserDetail[key]
    );
    if (formatedQueuedTaskData.length > 0) {
      // setLoading(false);
    }
    const data =
      formatedQueuedTaskData && formatedQueuedTaskData.length > 0
        ? formatedQueuedTaskData.map((el, i) => {
            return {
              uuid: el.uuid,
              name: el.name,
              received: el.received,
              sent: el.sent || "No",
              started: el.started,
              rejected: el.rejected || "No",
              succeeded: el.succeeded,
              failed: el.failed || "No",
              exception: el.exception || "No",
              traceback: el.traceback || "No",
              worker: el.worker,
              result: el.result,
              state: el.state,
              args: el.args,
              args: el.kwargs,
            };
          })
        : [];
    setQueuedTaskData(data);
  }, [UserDetail]);

  const pageSearch = (data) => {
    return data.filter((el) => {
      if (SearchQueuedTasks == "") {
        return el;
      } else if (
        el.name?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      } else if (
        el.state?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      } else if (
        el.args?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      } else if (
        el.kwargs?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const defaultOptions = {
    filter: false,
    sort: false,
    align: "center",
    setCellProps: () => ({ 
          style: {
          padding: "30px",

        } 
        }),
};

  function createColumn(name, label, options = {}) {
    return {
      name,
      label,
      options: {
        ...defaultOptions,
        ...options,
      },
    };
  }

  const columns = [
    createColumn("uuid", "Id", { display: true }),
    createColumn("name", "Name"),
    createColumn("state", "State"),
    createColumn("args", "Args"),
    createColumn("kwargs", "KwArgs"),
    createColumn("received", "Received", { display: true }),
    createColumn("sent", "Sent", { display: true }),
    createColumn("started", "Started", { display: true }),
    createColumn("rejected", "Rejected", { display: true }),
    createColumn("succeeded", "Succeeded", { display: true }),
    createColumn("failed", "Failed", { display: true }),
    createColumn("exception", "Exception", { display: true }),
    createColumn("traceback", "Traceback", { display: true }),
    createColumn("worker", "Worker", { display: true }),
    createColumn("result", "Result", { display: true }),
  ];
  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => changePage(newPage)}
          onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
          sx={{
            "& .MuiTablePagination-actions": {
              marginLeft: "0px",
            },
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
              {
                marginRight: "10px",
              },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
            Jump to Page:
          </label>
          <Select
            value={page + 1}
            onChange={(e) => changePage(Number(e.target.value) - 1)}
            sx={{
              fontSize: "0.8rem",
              padding: "4px",
              height: "32px",
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
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
    responsive: "vertical",
    enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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
      {renderSnackBar()}
      {apiLoading && <Spinner />}
      <Grid 
        container
        justifyContent="center"  
        >
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        {tableData.length ? (
          <div ref={tableRef}>
            {isBrowser ? (
              <MUIDataTable
                key={`table-${displayWidth}`}
                title="Queued Task Details"
                data={tableData}
                columns={columns}
                options={options}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                  mx: 2,
                  my: 3,
                  borderRadius: "4px",
                  transform: "none",
                }}
              />
            )}
          </div>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: "2em",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!apiLoading && <Typography>No Queued Tasks to Display</Typography>}
          </Box>
        )}
      </ThemeProvider>
    </div>
  );
};

export default QueuedTasksDetails;
