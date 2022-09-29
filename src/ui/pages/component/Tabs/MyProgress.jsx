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
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import { useParams } from "react-router-dom";
import Spinner from "../../component/common/Spinner";

const MyProgress = () => {
  const { id } = useParams();
  const UserDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([{
    startDate: new Date(Date.parse(UserDetails?.date_joined, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
    endDate: new Date(),
    key: "selection"
  }]);
  console.log(UserDetails?.date_joined, "UserDetails?.date_joined")
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
  const [radiobutton, setRadiobutton] = useState("AnnotatationReports");
  const [workspaces, setWorkspaces] = useState([]);
  const [totalsummary, setTotalsummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const Workspaces = useSelector((state) => state.getWorkspaces.data);
  const UserAnalytics = useSelector((state) => state.getUserAnalytics.data.project_summary);
  const UserAnalyticstotalsummary = useSelector((state) => state.getUserAnalytics.data.total_summary);
  const apiLoading = useSelector(state => state.apiStatus.loading);
  const dispatch = useDispatch();

  const classes = DatasetStyle();

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    dispatch(APITransport(typesObj));
    // const workspacesObj = new GetWorkspacesAPI(1, 9999);
    // dispatch(APITransport(workspacesObj));

  }, []);
  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading])




  // useEffect(() => {
  //   if (UserDetails && Workspaces?.results) {
  //     let workspacesList = [];
  //     Workspaces.results.forEach((item) => {
  //       workspacesList.push({ id: item.id, name: item.workspace_name });
  //     });
  //     setWorkspaces(workspacesList);
  //     setSelectedWorkspaces(workspacesList.map(item => item.id))
  //     setSelectedType("ContextualTranslationEditing");
  //   }
  // }, [UserDetails, Workspaces]);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      types?.length && setSelectedType(types[3]);
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
    // if (!selectedWorkspaces.length) {
    //   setSnackbarText("Please select atleast one workspace!");
    //   showSnackbar();
    //   return;
    // }
    const reviewdata = {
      user_id: id,
      project_type: selectedType,
      reports_type: radiobutton === "AnnotatationReports" ? "annotation" : "review",
      start_date: format(selectRange[0].startDate, 'yyyy-MM-dd'),
      end_date: format(selectRange[0].endDate, 'yyyy-MM-dd'),

    }
    const progressObj = new GetUserAnalyticsAPI(reviewdata);
    dispatch(APITransport(progressObj));
    // setShowSpinner(true);
    setTotalsummary(true)

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

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
  }


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
  const tableOptionstotalSummary = {
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
      {loading && <Spinner />}
      <Grid
        container
        direction="row"
        justifyContent="start"
        alignItems="center"
        sx={{ marginLeft: "50px" }}
      >
        <Grid >
          <Typography gutterBottom component="div" sx={{ marginTop: "15px", fontSize: "16px" }}>
            Select Report Type :
          </Typography>
        </Grid>
        <FormControl>

          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ marginTop: "10px", marginLeft: "20px" }}
            value={radiobutton}
            onChange={handleChangeReports}

          >
            <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotatation Reports" />
            <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer Reports" />

          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >

        <Grid container columnSpacing={4} rowSpacing={2} mt={1} mb={1} justifyContent="space-evenly">

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
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              onClick={() => setShowPicker(!showPicker)}
            >
              Pick Dates
            </Button>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
                {Workspaces.map((Workspaces, index) => (
                  <MenuItem value={Workspaces.id} key={Workspaces.id}>
                    {Workspaces.workspace_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid> */}
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
        {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
          <Card sx={{ overflowX: "scroll" }}>
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
        {radiobutton === "AnnotatationReports" && totalsummary && <Grid
          container
          direction="row"
          sx={{ mb: 3, mt: 2 }}
        >
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="h6">Total Summary </Typography>

          </Grid>

          <Grid
            container
            alignItems="center"
            direction="row"

          >
            <Typography variant="subtitle1">Annotated Tasks : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata}>{UserAnalyticstotalsummary?.["Annotated Tasks"]}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"


          >
            <Typography variant="subtitle1">Average Annotation Time (In Seconds) : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata}>{UserAnalyticstotalsummary?.["Average Annotation Time (In Seconds)"]}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="subtitle1">Word Count : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata}>{UserAnalyticstotalsummary?.["Word Count"]}</Typography>
          </Grid>
        </Grid>
        }
        {radiobutton === "ReviewerReports" && totalsummary && <Grid
          container
          alignItems="center"
          direction="row"
          sx={{ mb: 3, mt: 2 }}

        >
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="h6">Total Summary </Typography>

          </Grid>

          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="subtitle1">Reviewed Tasks : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata} >{UserAnalyticstotalsummary?.["Reviewed Tasks"]}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="subtitle1">Average Review Time (In Seconds) : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata}>{UserAnalyticstotalsummary?.["Average Review Time (In Seconds)"]}</Typography>
          </Grid>
          <Grid
            container
            alignItems="center"
            direction="row"
            justifyContent="flex-start"

          >
            <Typography variant="subtitle1">Word Count : </Typography>
            <Typography variant="body2" className={classes.TotalSummarydata}>{UserAnalyticstotalsummary?.["Word Count"]}</Typography>
          </Grid>
        </Grid>}
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
          <Grid item sx={{ mt: "10%" }}>
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
