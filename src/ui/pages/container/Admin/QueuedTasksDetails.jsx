import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, IconButton } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import Spinner from "../../component/common/Spinner";
import GetQueuedTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetQueuedTaskDetails";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";

const QueuedTasksDetails = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [tableData, setTableData] = useState([])
  const [queuedTaskData,setQueuedTaskData] = useState([])

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

  useEffect(() => {
    getUserDetail();
  }, []);

  useEffect(()=>{
    const tData=pageSearch(queuedTaskData)
    setTableData(tData)
  },[queuedTaskData,SearchQueuedTasks])
  

  useEffect(() => {
  const formatedQueuedTaskData=Object.keys(UserDetail).map((key) => UserDetail[key]);
    if (formatedQueuedTaskData.length > 0) {
      // setLoading(false);
    }
    const data=formatedQueuedTaskData && formatedQueuedTaskData.length > 0
            ? formatedQueuedTaskData.map((el,i)=>{
          return {
            uuid:el.uuid,
            name:el.name,
            received:el.received,
            sent:el.sent|| "No",
            started:el.started,
            rejected:el.rejected|| "No",
            succeeded:el.succeeded,
            failed:el.failed || "No",
            exception:el.exception || "No",
            traceback:el.traceback|| "No",
            worker:el.worker,
            result:el.result,
            state:el.state,
            args:el.args,
            args:el.kwargs,
            };
        })
      : [];
    setQueuedTaskData(data)
  }, [UserDetail]);

  const pageSearch = (data) => {
    return data.filter((el) => {
      if (SearchQueuedTasks == "") {
        return el;
      } else if (
        el.name?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      } 
      else if (
        el.state?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
      else if (
        el.args?.toLowerCase().includes(SearchQueuedTasks?.toLowerCase())
      ) {
        return el;
      }
      else if (
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
    setCellProps: () => ({ style: { paddingLeft: "30px" } }),
};

function createColumn(name, label, options = {}) {
    return {
        name,
        label,
        options: {
            ...defaultOptions,
            ...options 
        }
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
    responsive:"standard"
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
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        {tableData.length ? <MUIDataTable
          title="Queued Task Details"
          data={tableData}
          columns={columns}
          options={options}
        />:
        <Box sx={{display: 'flex', gap: '2em', alignItems: 'center', justifyContent:'center'}}>
            {!apiLoading && <Typography>
              No Queued Tasks to Display
            </Typography>}
        </Box>
        }
      </ThemeProvider>
    </div>
  );
};

export default QueuedTasksDetails;
