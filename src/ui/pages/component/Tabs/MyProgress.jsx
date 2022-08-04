import {
  Button,
  Grid,
  ThemeProvider,
  Typography,
  Select,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CircularProgress 
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import Snackbar from "../common/Snackbar";
// import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { DateRangePicker } from "@mui/x-date-pickers-pro";
// import {
//   addDays,
//   addWeeks,
//   format,
//   lastDayOfWeek,
//   startOfMonth,
//   startOfWeek,
// } from "date-fns";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetUserAnalyticsAPI from "../../../../redux/actions/api/UserManagement/GetUserAnalytics";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../common/ColumnList";
import CustomizedSnackbars from "../common/Snackbar";
import { isSameDay, format } from 'date-fns/esm';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const MyProgress = () => {
  const UserDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([{
      startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
      endDate: new Date(),
      key: "selection"
  }]);
  // const [rangeValue, setRangeValue] = useState([
  //   format(
  //     Date.parse(UserDetails?.date_joined, "yyyy-MM-ddTHH:mm:ss.SSSZ"),
  //     "yyyy-MM-dd"
  //   ),
  //   Date.now(),
  // ]);
  const [showPicker, setShowPicker] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    if (UserDetails && Workspaces?.results) {
      const filteredWorkspaces = Workspaces.results.filter((ws) => {
        let userAdded = false;
        for (let user of ws.users) {
          if (user.id === UserDetails.id) {
            userAdded = true;
            break;
          }
        }
        return userAdded;
      });
      let workspacesList = [];
      filteredWorkspaces?.forEach((item) => {
        workspacesList.push({ id: item.id, name: item.workspace_name });
      });
      setWorkspaces(workspacesList);
      setSelectedWorkspaces(workspacesList.map(item => item.id))
      setSelectedType("ContextualTranslationEditing")
      // console.log("wid--->>", Workspaces.results[0]);
       // console.log("here");
       //console.log("test");
    }
  }, [UserDetails, Workspaces]);

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
    setShowSpinner(false);
  }, [UserAnalytics]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    console.log(selection, "selection"); 
  };

  const handleProgressSubmit = () => {
    setShowPicker(false);
    setSubmitted(true);
    if (!selectedWorkspaces.length) {
      setSnackbarText("Please select atleast one workspace!");
      showSnackbar();
      return;
    }
    const progressObj = new GetUserAnalyticsAPI(
      format(selectRange[0].startDate, 'yyyy-MM-dd'),
      format(selectRange[0].endDate, 'yyyy-MM-dd'),
      selectedType,
      selectedWorkspaces
    );
    dispatch(APITransport(progressObj));
    setShowSpinner(true);
  };

  const showSnackbar = () => {
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
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
    );
  };

  const tableOptions = {
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };

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
        <Grid container columnSpacing={4} rowSpacing={2} mt={1} mb={1}>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Button 
                  endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />} 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setShowPicker(!showPicker)}
              >
                Pick dates
              </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
                Project Type
              </InputLabel>
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
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="workspace-label" sx={{ fontSize: "16px" }}>
                Workspace
              </InputLabel>
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
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleProgressSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        {showPicker && <Box sx={{mt: 2, mb:2, display: "flex", justifyContent: "center", width: "100%"}}>
            <Card sx={{overflowX: "scroll"}}>
                <DateRangePicker
                    onChange={handleRangeChange}
                    staticRanges={[
                        ...defaultStaticRanges,
                        {
                            label: "Till Date",
                            range: () => ({
                            startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                            endDate: new Date(),
                            }),
                            isSelected(range) {
                            const definedRange = this.range();
                            return (
                                isSameDay(range.startDate, definedRange.startDate) &&
                                isSameDay(range.endDate, definedRange.endDate)
                            );
                            }
                        },
                    ]}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={selectRange}
                    minDate={new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                    maxDate={new Date()}
                    direction="horizontal"
                />
            </Card>
        </Box>}
        {UserAnalytics?.length > 0 ? (
          <ThemeProvider theme={tableTheme}>
            <MUIDataTable
              title={""}
              data={reportData}
              columns={columns.filter((col) => selectedColumns.includes(col.name))}
              options={tableOptions}
            />
          </ThemeProvider>
        ) : <Grid
          container
          justifyContent="center"
        >
          <Grid item sx={{mt:"10%"}}>
            {showSpinner ? <CircularProgress color="primary" size={50} /> : (
              !reportData?.length && submitted && <>No results</>
            )}
          </Grid>
        </Grid>
        }
      </Grid>
      <CustomizedSnackbars message={snackbarText} open={snackbarOpen} hide={2000} handleClose={closeSnackbar} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }} variant="error" />
    </ThemeProvider>
  );
};

export default MyProgress;
