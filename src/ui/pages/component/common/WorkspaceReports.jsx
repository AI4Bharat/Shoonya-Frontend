// WorkspaceReports

import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Card,
  Box,
  Button,
  Grid,
  ThemeProvider,
  Radio,Typography,
} from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import GetWorkspaceUserReportsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceUserReports";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetWorkspaceProjectReportAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceProjectReports";
import SendWorkspaceUserReportsAPI from "../../../../redux/actions/api/WorkspaceDetails/SendWorkspaceUserReports";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../common/ColumnList";
import { isSameDay, format } from 'date-fns/esm';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { MenuProps } from "../../../../utils/utils";
import CustomizedSnackbars from "../../component/common/Snackbar";

const WorkspaceReports = () => {
  const WorkspaceDetails = useSelector(
    (state) => state.getWorkspaceDetails.data
  );
  const UserDetails = useSelector(state => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([{
    startDate: new Date(Date.parse(WorkspaceDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
    endDate: new Date(),
    key: "selection"
  }]);
  // const [rangeValue, setRangeValue] = useState([
  //   format(
  //     Date.parse(WorkspaceDetails?.created_at, "yyyy-MM-ddTHH:mm:ss.SSSZ"),
  //     "yyyy-MM-dd"
  //   ),
  //   Date.now(),
  // ]);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [participationTypes, setParticipationTypes] = useState([]);
  const [reportType, setReportType] = useState("project");
  const [language, setLanguage] = useState("all");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [reportRequested, setReportRequested] = useState(false);
  const [radiobutton, setRadiobutton] = useState("AnnotatationReports");
  const classes = DatasetStyle();
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const { id } = useParams();
  const dispatch = useDispatch();
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserReports = useSelector(
    (state) => state.getWorkspaceUserReports.data
  );
  const ProjectReports = useSelector(
    (state) => state.getWorkspaceProjectReports.data
  );
  
  const LanguageChoices = useSelector((state) => state.fetchLanguages.data);

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    const langObj = new FetchLanguagesAPI();
    dispatch(APITransport(typesObj));
    dispatch(APITransport(langObj));
  }, []);

  useEffect(() => {
    if(reportType === "payment") {
      setProjectTypes([
        "AudioTranscription",
        "AudioTranscriptionEditing",
        "ConversationTranslation",
        "ConversationTranslationEditing"
      ]);
      setSelectedType("AudioTranscription");
    } else if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      setSelectedType(types[3]);
    }
  }, [ProjectTypes, reportType]);

  useEffect(() => {
    if (reportRequested && UserReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(UserReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
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
    setShowSpinner(false);
  }, [UserReports]);

  useEffect(() => {
    if (reportRequested && ProjectReports?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(ProjectReports[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
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
    setShowSpinner(false);
  }, [ProjectReports]);

  const renderToolBar = () => {
    const buttonSXStyle = { borderRadius: 2, margin: 2 };
    return (
      <Box 
      // className={classes.filterToolbarContainer}
      className={classes.ToolbarContainer}
      >
        <ColumnList
          columns={columns}
          setColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Box>
    );
  };

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
    textLabels: {
      body: {
        noMatch: "No Record Found!",
      },
    },
  };

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
}
  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    console.log(selection, "selection"); 
  };
  const handleDateSubmit = () => {
    if(reportType === "payment") {
      const userReportObj = new SendWorkspaceUserReportsAPI(
        id,
        UserDetails.id,
        selectedType,
        participationTypes,
      );
      dispatch(APITransport(userReportObj));
      setSnackbarInfo({
        open: true,
        message: "Report will be e-mailed to you shortly",
        variant: "success",
      })
    }
    else {
      setShowPicker(false);
      setReportRequested(true);
      if (reportType === "user") {
        const userReportObj = new GetWorkspaceUserReportsAPI(
          id,
          selectedType,
          format(selectRange[0].startDate, 'yyyy-MM-dd'),
          format(selectRange[0].endDate, 'yyyy-MM-dd'),
          language,
          radiobutton === "AnnotatationReports" ? "annotation" :  radiobutton ==="ReviewerReports" ? "review" :"supercheck",
        );
        dispatch(APITransport(userReportObj));
        setShowSpinner(true);
      } else if (reportType === "project") {
        const projectReportObj = new GetWorkspaceProjectReportAPI(
          id,
          selectedType,
        
          language,
          radiobutton === "AnnotatationReports" ? "annotation" :  radiobutton ==="ReviewerReports" ? "review" :"supercheck",
        );
        dispatch(APITransport(projectReportObj));
        setShowSpinner(true);
      }
    }
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
    <React.Fragment>
      {renderSnackBar()}
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          marginBottom: "24px",
        }}
      >
         <Grid
        container
        direction="row"
        spacing={3}
       sx={{mt:1,ml:1}}
      >

        <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
          <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px", }}>
            Select Report Type :
          </Typography>
        </Grid >
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5}  >
          <FormControl disabled={reportType === "payment"}>

            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{ marginTop: "5px" }}
              value={radiobutton}
              onChange={handleChangeReports}

            >
              <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotator" />
              <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer" />
              <FormControlLabel value="SuperCheckerReports" control={<Radio />} label="Super Checker" />

            </RadioGroup>
          </FormControl>
        </Grid >
        </Grid >
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="report-type-label" sx={{ fontSize: "16px" }}>
              Report Type
            </InputLabel>
            <Select
              labelId="report-type-label"
              id="report-select"
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
              MenuProps={MenuProps}
            >
              <MenuItem value={"user"}>User Reports</MenuItem>
              <MenuItem value={"project"}>Project Reports</MenuItem>
              <MenuItem value={"payment"}>Payment Reports (E-mail)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
        >
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
              MenuProps={MenuProps}
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {reportType !== "payment" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-label" sx={{ fontSize: "16px" }}>
              Target Language
            </InputLabel>
            <Select
              labelId="language-label"
              id="language-select"
              value={language}
              label="Target Language"
              onChange={(e) => setLanguage(e.target.value)}
              MenuProps={MenuProps}
            >
              <MenuItem value={"all"}>All languages</MenuItem>
              {LanguageChoices.language?.map((lang) => (
                <MenuItem value={lang} key={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}
        {reportType === "payment" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="participation-type-label" sx={{ fontSize: "16px" }}>Participation Types</InputLabel>
            <Select
             style={{ zIndex: "0" }}
             inputProps={{ "aria-label": "Without label" }}
             MenuProps={MenuProps}
              labelId="participation-type-label"
              id="participation-select"
              value={participationTypes}
              label="Participation Type"
              onChange={(e) => setParticipationTypes(e.target.value)}
              multiple
            >
              <MenuItem value={1}>Full-time</MenuItem>
              <MenuItem value={2}>Part-time</MenuItem>
              <MenuItem value={4}>Contract-Basis</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
        {reportType === "user" && 
         <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
         <Button 
             endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />} 
             variant="contained" 
             color="primary"
             sx={{width:"130px"}} 
             onClick={() => setShowPicker(!showPicker)}
         >
            Pick Dates
         </Button>
       </Grid>
        }
       
        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleDateSubmit}
            sx={{width:"130px"}}
          >
            {reportType === "payment" ? "E-mail CSV" : "Submit"}
          </Button>
        </Grid>
      </Grid>
      {showPicker && <Box sx={{mt: 2, mb:2, display: "flex", justifyContent: "center", width: "100%"}}>
          <Card>
              <DateRangePicker
                  onChange={handleRangeChange}
                  staticRanges={[
                      ...defaultStaticRanges,
                      {
                          label: "Till Date",
                          range: () => ({
                          startDate: new Date(Date.parse(WorkspaceDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                  minDate={new Date(Date.parse(WorkspaceDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                  maxDate={new Date()}
                  direction="horizontal"
              />
          </Card>
      </Box>}
      {showSpinner ? <div></div> : reportRequested && (
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={ProjectReports.length > 0 ? "Reports" : ""}
            data={reportData}
            columns={columns.filter((col) => selectedColumns.includes(col.name))}
            options={options}
          />
        </ThemeProvider>)
      }
      {/* <Grid
          container
          justifyContent="center"
        >
          <Grid item sx={{mt:"10%"}}>
            {showSpinner ? <div></div> : (
              !reportData?.length && submitted && <>No results</>
            )}
          </Grid>
        </Grid> */}
    </React.Fragment>
  );
};

export default WorkspaceReports;
