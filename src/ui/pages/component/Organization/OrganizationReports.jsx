// OrganizationReports

import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { TextField, Box, Button, Grid } from "@mui/material";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  format,
  addDays,
  addWeeks,
  startOfWeek,
  startOfMonth,
  lastDayOfWeek,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetOrganizationUserReportsAPI from "../../../../redux/actions/api/Organization/GetOrganizationUserReports";
import GetOrganizationProjectReportsAPI from "../../../../redux/actions/api/Organization/GetOrganizationProjectReports";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';

const OrganizationReports = () => {
  const [startDate, setStartDate] = useState(format(startOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(lastDayOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
  const [selectRange, setSelectRange] = useState("Last Week");
  const [rangeValue, setRangeValue] = useState([startOfMonth(Date.now()), Date.now()]);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [reportType, setReportType] = useState("project");
  const [targetLanguage, setTargetLanguage] = useState("all");
  const [sortByColumn, setSortByColumn] = useState(null);
  const [descOrder, setDescOrder] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  
  const classes = DatasetStyle();
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserReports = useSelector((state) => state.getOrganizationUserReports.data);
  const ProjectReports = useSelector((state) => state.getOrganizationProjectReports.data);
  const LanguageChoices = useSelector((state) => state.fetchLanguages.data);

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    const langObj = new FetchLanguagesAPI();
    dispatch(APITransport(typesObj));
    dispatch(APITransport(langObj));
  }, []);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      setSelectedType(types[0]);
    }
  }, [ProjectTypes]);

  useEffect(() => {
    if (UserReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(UserReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: key === "Word Count Of Annotated Tasks",
            align: "center",
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setReportData(UserReports);
      setSelectedColumns(tempSelected);
    } else {
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
  }, [UserReports]);

  useEffect(() => {
    if (ProjectReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(ProjectReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: key === "Word Count Of Annotated Tasks",
            align: "center",
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setReportData(ProjectReports);
      setSelectedColumns(tempSelected);
    } else {
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
  }, [ProjectReports]);

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

const options = {
    filterType: 'checkbox',
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    customToolbar: renderToolBar,
};

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
    if (e.target.value === "Yesterday") {
      setStartDate(format(addDays(Date.now(), -1), "yyyy-MM-dd"));
      setEndDate(format(addDays(Date.now(), -1), "yyyy-MM-dd"));
    }
    if (e.target.value === "This Week") {
      setStartDate(format(startOfWeek(Date.now()), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    }
    if (e.target.value === "Last Week") {
      setStartDate(format(startOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
      setEndDate(format(lastDayOfWeek(addWeeks(Date.now(), -1)), "yyyy-MM-dd"));
    }
    if (e.target.value === "This Month") {
      setStartDate(format(startOfMonth(Date.now()), "yyyy-MM-dd"));
      setEndDate(format(Date.now(), "yyyy-MM-dd"));
    }
  };

  const handleRangeChange = (dates) => {
    setRangeValue(dates);
    const [start, end] = dates;
    setStartDate(format(start, "yyyy-MM-dd"));
    setEndDate(format(end, "yyyy-MM-dd"));
  };

  const handleDateSubmit = () => {
    if (reportType === "user") {
      const userReportObj = new GetOrganizationUserReportsAPI(
        orgId,
        selectedType,
        startDate,
        endDate,
        targetLanguage,
        sortByColumn,
        descOrder,
      );
      dispatch(APITransport(userReportObj));
    } else if (reportType === "project") {
      const projectReportObj = new GetOrganizationProjectReportsAPI(
        orgId,
        selectedType,
        startDate,
        endDate,
        targetLanguage,
        sortByColumn,
        descOrder,
      );
      dispatch(APITransport(projectReportObj));
    }
  };

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          marginBottom: "24px",
        }}
      >
        <Grid item xs={12} sm={12} md={showPicker ? 4 : 2} lg={showPicker ? 4 : 2} xl={showPicker ? 4 : 2}>
          <FormControl fullWidth>
            <InputLabel id="date-range-select-label"sx={{fontSize:"16px"}}>Date Range</InputLabel>
            <Select
              labelId="date-range-select-label"
              id="date-range-select"
              value={selectRange}
              defaultValue={"Last Week"}
              label="Date Range"
              onChange={handleOptionChange}
            >
              <MenuItem value={"Today"}>Today</MenuItem>
              <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
              <MenuItem value={"This Week"}>This Week</MenuItem>
              <MenuItem value={"Last Week"}>Last Week</MenuItem>
              <MenuItem value={"This Month"}>This Month</MenuItem>
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
                  <TextField {...startProps} sx={{width: "48%"}}/>
                  <Box sx={{ mx: 2, width: "4%", textAlign: "center" }}> to </Box>
                  <TextField {...endProps} sx={{width: "48%"}}/>
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Grid>}
        <Grid item xs={12} sm={12} md={showPicker ? 4 : 3} lg={showPicker ? 4 : 3} xl={showPicker ? 4 : 3}>
          <FormControl fullWidth>
            <InputLabel id="project-type-label" sx={{fontSize:"16px"}}>Project Type</InputLabel>
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
            <InputLabel id="report-type-label" sx={{fontSize:"16px"}}>Report Type</InputLabel>
            <Select
              labelId="report-type-label"
              id="report-select"
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value={"user"}>User Reports</MenuItem>
              <MenuItem value={"project"}>Project Reports</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth>
            <InputLabel id="language-label" sx={{fontSize:"16px"}}>Target Language</InputLabel>
            <Select
              labelId="language-label"
              id="language-select"
              value={targetLanguage}
              label="Target Language"
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              <MenuItem value={"all"}>All languages</MenuItem>
              {LanguageChoices.language?.map((lang) => (
                <MenuItem value={lang} key={lang}>
                  {lang}
                </MenuItem>))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
            <Button
              variant="contained"
              onClick={handleDateSubmit}
              sx={{width: "100%", mt:2}}
            >
              Submit
            </Button>
        </Grid>
      </Grid>
      {reportData?.length > 0 && (
        <MUIDataTable
          title={""}
          data={reportData}
          columns={columns.filter((col) => selectedColumns.includes(col.name))}
          options={options}
        />
      )}
    </React.Fragment>
  );
};

export default OrganizationReports;
