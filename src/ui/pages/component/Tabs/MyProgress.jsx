import { Button, Grid, ThemeProvider, Typography, Select, Box, MenuItem, InputLabel, FormControl, TextField } from "@mui/material";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import Snackbar from "../common/Snackbar";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { addDays, addWeeks, format, lastDayOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetUserAnalyticsAPI from "../../../../redux/actions/api/UserManagement/GetUserAnalytics";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';
import CustomizedSnackbars from "../common/Snackbar";


const MyProgress = () => {
  const UserDetails = useSelector(state => state.fetchLoggedInUserData.data);
  const [startDate, setStartDate] = useState(
    format(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(format(Date.now(), "yyyy-MM-dd"));
  const [selectRange, setSelectRange] = useState("Till Date");
  const [rangeValue, setRangeValue] = useState([
    format(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'),
    Date.now(),
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);

  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);

  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const Workspaces = useSelector((state) => state.getWorkspaces.data);
  const UserAnalytics = useSelector((state) => state.getUserAnalytics.data);
  const dispatch = useDispatch();

  const classes = DatasetStyle();

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    const workspacesObj = new GetWorkspacesAPI(1, 9999);
    dispatch(APITransport(typesObj));
    dispatch(APITransport(workspacesObj));
  }, []);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      types?.length && setSelectedType(types[0]);
    }
  }, [ProjectTypes]);

  useEffect(() => {
    if (Workspaces) {
      let workspacesList = [];
      Workspaces?.results?.forEach((item) => {
        workspacesList.push({ id: item.id, name: item.workspace_name })
      })
      setWorkspaces(workspacesList)
    }
  }, [Workspaces]);

  useEffect(() => {
    if (UserAnalytics?.message) {
      setSnackbarText(UserAnalytics?.message);
      showSnackbar();
      return;
    }
    if (UserAnalytics?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(UserAnalytics[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: false,
            align: "center",
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setReportData(UserAnalytics);
      setSelectedColumns(tempSelected);
    } else {
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
  }, [UserAnalytics])


  const handleOptionChange = (e) => {
    setSelectRange(e.target.value);
    if (e.target.value === "Custom Range") {
      setStartDate(format(startOfMonth(Date.now()), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
      setShowPicker(true);
    } else setShowPicker(false);
    if (e.target.value === "Today") {
      setStartDate(format(Date.now(), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    }
    else if (e.target.value === "Yesterday") {
      setStartDate(format(addDays(Date.now(), -1), "yyyy-MM-dd"));
      setEndDate(format(addDays(Date.now(), -1), "yyyy-MM-dd"));
    }
    else if (e.target.value === "This Week") {
      setStartDate(format(startOfWeek(Date.now()), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    }
    else if (e.target.value === "Last Week") {
      setStartDate(format(startOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
      setEndDate(format(lastDayOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
    }
    else if (e.target.value === "This Month") {
      setStartDate(format(startOfMonth(Date.now()), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    }
    else if (e.target.value === "Till Date") {
      setStartDate(format(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    } 
  };

  const handleRangeChange = (dates) => {
    setRangeValue(dates);
    const [start, end] = dates;
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };

  const handleProgressSubmit = () => {
    if (!selectedWorkspaces.length) {
      setSnackbarText("Please select atleast one workspace!");
      showSnackbar();
      return;
    }
    const progressObj = new GetUserAnalyticsAPI(
      startDate,
      endDate,
      selectedType,
      selectedWorkspaces,
    );
    dispatch(APITransport(progressObj));
  };

  const showSnackbar = () => {
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const renderToolBar = () => {
    return (
      <Box className={classes.filterToolbarContainer}>
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Box>
    )
  }

  const tableOptions = {
    filterType: 'checkbox',
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };

  console.log(startDate, endDate);

  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h3" align="center">
              My Progress
            </Typography>
          </Grid>

        </Grid>
        <Grid container spacing={4} mt={1} mb={1}>
          <Grid item xs={12} sm={12} md={showPicker ? 4 : 2} lg={showPicker ? 4 : 2} xl={showPicker ? 4 : 2}>
            <FormControl fullWidth>
              <InputLabel id="date-range-select-label" sx={{ fontSize: "16px" }}>Date Range</InputLabel>
              <Select
                labelId="date-range-select-label"
                id="date-range-select"
                value={selectRange}
                defaultValue={"This Month"}
                label="Date Range"
                onChange={handleOptionChange}
              >
                <MenuItem value={"Today"}>Today</MenuItem>
                <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
                <MenuItem value={"This Week"}>This Week</MenuItem>
                <MenuItem value={"Last Week"}>Last Week</MenuItem>
                <MenuItem value={"This Month"}>This Month</MenuItem>
                {UserDetails?.date_joined && <MenuItem value={"Till Date"}>Till Date</MenuItem>}
                <MenuItem value={"Custom Range"}>Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {showPicker && <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              localeText={{ start: "Start Date", end: "End Date" }}
            >
              <DateRangePicker
                value={rangeValue}
                onChange={handleRangeChange}
                renderInput={(startProps, endProps) => (
                  <React.Fragment>
                    <TextField {...startProps} sx={{ width: "48%" }} />
                    <Box sx={{ mx: 2, width: "4%", textAlign: "center" }}> to </Box>
                    <TextField {...endProps} sx={{ width: "48%" }} />
                  </React.Fragment>
                )}
              />
            </LocalizationProvider>
          </Grid>}
          <Grid item xs={12} sm={12} md={showPicker ? 4 : 3} lg={showPicker ? 4 : 3} xl={showPicker ? 4 : 3}>
            <FormControl fullWidth>
              <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
              <Select
                labelId="project-type-label"
                id="project-type-select"
                value={selectedType}
                label="Project Type"
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {projectTypes.map((type, index) => (
                  <MenuItem value={type} key={index}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={showPicker ? 4 : 3} lg={showPicker ? 4 : 3} xl={showPicker ? 4 : 3}>
            <FormControl fullWidth>
              <InputLabel id="workspace-label" sx={{ fontSize: "16px" }}>Workspace</InputLabel>
              <Select
                labelId="workspace-label"
                id="workspace-select"
                value={selectedWorkspaces}
                multiple
                label="Project Type"
                // onSelect={(e,)}
                onChange={(e) => setSelectedWorkspaces(e.target.value)}
              >
                {workspaces.map((workspace, index) => (
                  <MenuItem value={workspace.id} key={workspace.id}>
                    {workspace.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={showPicker ? 4 : 3} lg={showPicker ? 4 : 3} xl={showPicker ? 4 : 3}>
            <Button
              variant="contained"
              onClick={handleProgressSubmit}
              sx={{
                width: "100%",
                mt: 1,
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        {UserAnalytics?.length > 0 && (
          <MUIDataTable
            title={""}
            data={reportData}
            columns={columns.filter((col) => selectedColumns.includes(col.name))}
            options={tableOptions}
          />
        )}
      </Grid>
      <CustomizedSnackbars message={snackbarText} open={snackbarOpen} hide={2000} handleClose={closeSnackbar} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }} variant="error" />
    </ThemeProvider>
  );
};

export default MyProgress;
