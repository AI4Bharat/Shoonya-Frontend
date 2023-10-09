// OrganizationReports

import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Button, Grid, ThemeProvider, Card, Radio, Typography, FormGroup, Checkbox, ListItemText, ListItemIcon, Paper } from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import tableTheme from "../../../theme/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetOrganizationUserReportsAPI from "../../../../redux/actions/api/Organization/GetOrganizationUserReports";
import GetOrganizationProjectReportsAPI from "../../../../redux/actions/api/Organization/GetOrganizationProjectReports";
import GetOrganizationAnnotatorQualityAPI from "../../../../redux/actions/api/Organization/GetOrganizationAnnotatorQuality";
import SendOrganizationUserReports from "../../../../redux/actions/api/Organization/SendOrganizationUserReports";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { isSameDay, format } from 'date-fns/esm';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from '@mui/material/styles';
import { addDays } from 'date-fns';
import CustomizedSnackbars from "../../component/common/Snackbar";
import { snakeToTitleCase } from "../../../../utils/utils";


const ProgressType = ["Annotation Stage", "Review Stage", "Super Check Stage", "All Stage"]
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center"
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center"
  },
  variant: "menu"
};


const OrganizationReports = () => {
  const OrganizationDetails = useSelector(state => state.fetchLoggedInUserData.data.organization);
  const UserDetails = useSelector(state => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([{
    // startDate: new Date(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
    // endDate: new Date(),
    // key: "selection"
    startDate: addDays(new Date(), -9),
    endDate: addDays(new Date(), -3),
    key: 'selection'
  }]);
  // const [rangeValue, setRangeValue] = useState([format(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'), Date.now()]);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [participationTypes, setParticipationTypes] = useState([1, 2, 4]);
  const [selectedType, setSelectedType] = useState("");
  const [reportType, setReportType] = useState("project");
  const [targetLanguage, setTargetLanguage] = useState("all");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportRequested, setReportRequested] = useState(false);
  const [reportTypes, setReportTypes] = useState("Annotator");
  const [radiobutton, setRadiobutton] = useState("ProjectReports");
  const [reportfilter, setReportfilter] = useState(["All Stage"]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const classes = DatasetStyle();
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserReports = useSelector((state) => state.getOrganizationUserReports.data);
  const ProjectReports = useSelector((state) => state.getOrganizationProjectReports.data);
  const SuperCheck = useSelector((state) => state.getOrganizationAnnotatorQuality.data);
  const LanguageChoices = useSelector((state) => state.fetchLanguages.data);

  let ProgressTypeValue = "Annotation Stage"
  const filterdata = ProgressType.filter(item => item !== ProgressTypeValue)
  const FilterProgressType = reportTypes === "Reviewer" ? filterdata : ProgressType

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    const langObj = new FetchLanguagesAPI();
    dispatch(APITransport(typesObj));
    dispatch(APITransport(langObj));
  }, []);

  useEffect(() => {
    if (radiobutton === "PaymentReports") {
      setProjectTypes([
        "AudioSegmentation",
        "AudioTranscription",
        "AudioTranscriptionEditing",
        "ConversationTranslation",
        "ConversationTranslationEditing",
        "AcousticNormalisedTranscriptionEditing",
        "AllAudioProjects",
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
  }, [ProjectTypes, radiobutton]);

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

  // useEffect(() => {
  //   if (reportRequested && ProjectReports?.length) {
  //     let tempColumns = [];
  //     let tempSelected = [];
  //     Object.keys(ProjectReports[0]).forEach((key) => {
  //       tempColumns.push({
  //         name: key,
  //         label: key,
  //         options: {
  //           filter: false,
  //           sort: true,
  //           align: "center",
  //         },
  //       });
  //       tempSelected.push(key);
  //     });
  //     setColumns(tempColumns);
  //     setReportData(ProjectReports);
  //     setSelectedColumns(tempSelected);
  //   } else {
  //     setColumns([]);
  //     setReportData([]);
  //     setSelectedColumns([]);
  //   }
  //   setShowSpinner(false);
  // }, [ProjectReports]);

  // useEffect(() => {
  //   if (reportRequested && SuperCheck?.length) {
  //     let tempColumns = [];
  //     let tempSelected = [];
  //     Object.keys(SuperCheck[0]).forEach((key) => {
  //       tempColumns.push({
  //         name: key,
  //         label: key,
  //         options: {
  //           filter: false,
  //           sort: true,
  //           align: "center",
  //         },
  //       });
  //       tempSelected.push(key);
  //     });
  //     setColumns(tempColumns);
  //     setReportData(SuperCheck);
  //     setSelectedColumns(tempSelected);
  //   } else {
  //     setColumns([]);
  //     setReportData([]);
  //     setSelectedColumns([]);
  //   }
  //   setShowSpinner(false);
  // }, [SuperCheck]);

  const renderToolBar = () => {
    return (
      <Box
        //className={classes.filterToolbarContainer}
        className={classes.ToolbarContainer}
      >
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
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
  };


  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    console.log(selection, "selection");
  };

  const handleSubmit = () => {
    if (radiobutton === "PaymentReports") {
      const userReportObj = new SendOrganizationUserReports(
        orgId,
        UserDetails.id,
        selectedType,
        participationTypes,
        format(selectRange[0].startDate, 'yyyy-MM-dd'),
        format(selectRange[0].endDate, 'yyyy-MM-dd'),
      );
      dispatch(APITransport(userReportObj));
      setSnackbarInfo({
        open: true,
        message: "Payment Reports will be e-mailed to you shortly",
        variant: "success",
      })
    }
    else {
      setReportRequested(true);
      setShowSpinner(true);
      setShowPicker(false);
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
      if (radiobutton === "UsersReports" && reportTypes === "Annotator" && reportfilter == "") {
        setSnackbarInfo({
          open: true,
          message: "Please fill Report Filter",
          variant: "error",
        })

      }
      let ReviewData = []

      if ((reportTypes === "Annotator" || reportTypes === "Reviewer") && reportfilter != "" && radiobutton === "UsersReports") {

        if (reportfilter.toString() == "Annotation Stage") {
          ReviewData.push(1)
        } else if (reportfilter.toString() == "Review Stage") {
          ReviewData.push(2)
        } else if (reportfilter.toString() == "Super Check Stage") {
          ReviewData.push(3)
        }
        const userReportObj = new GetOrganizationUserReportsAPI(
          orgId,
          selectedType,
          format(selectRange[0].startDate, 'yyyy-MM-dd'),
          format(selectRange[0].endDate, 'yyyy-MM-dd'),
          reportTypes === "Annotator" ? "annotation" : reportTypes === "Reviewer" ? "review" : "supercheck",
          targetLanguage,
          ...ReviewData,

        );
        dispatch(APITransport(userReportObj));

      } else if ((reportTypes === "SuperCheck" || reportfilter === "All Stage" && radiobutton === "UsersReports")) {
        const supercheckObj = new GetOrganizationUserReportsAPI(
          orgId,
          selectedType,
          format(selectRange[0].startDate, 'yyyy-MM-dd'),
          format(selectRange[0].endDate, 'yyyy-MM-dd'),
          "supercheck",
          targetLanguage,
        );
        dispatch(APITransport(supercheckObj));


      }
      else if (radiobutton === "ProjectReports") {
        const emailId = localStorage.getItem("email_id");
        const projectReportObj = new GetOrganizationProjectReportsAPI(
          orgId,
          selectedType,
          targetLanguage,
          emailId,
        );
        dispatch(APITransport(projectReportObj));
        setSnackbarInfo({
          open: true,
          message: "Project Reports will be e-mailed to you shortly",
          variant: "success",
        })
      }
    }
  };

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
  }

  const handleChangeprojectFilter = (event) => {
    const value = event.target.value;
    setReportfilter(value);
  }

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
        sx={{ mb: 3 }}
      >
        <Grid
          container
          direction="row"
          spacing={3}
          sx={{ mt: 1, ml: 1 }}
        >

          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
            <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px", }}>
              Select Report Type :
            </Typography>
          </Grid >
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}  >
            <FormControl >

              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radiobutton}
                onChange={handleChangeReports}

              >
                <FormControlLabel value="UsersReports" control={<Radio />} label="Users Reports" />
                <FormControlLabel value="ProjectReports" control={<Radio />} label="Project Reports" />
                <FormControlLabel value="PaymentReports" control={<Radio />} label="Payment Reports" />
              </RadioGroup>
            </FormControl>
          </Grid >
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" >
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
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
        {radiobutton === "PaymentReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
        {radiobutton === "UsersReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="report-type-label" sx={{ fontSize: "16px" }}> Report Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="report-type-label"
              id="report-select"
              value={reportTypes}
              label="Report Type"
              onChange={(e) => setReportTypes(e.target.value)}
            >
              <MenuItem value={"Annotator"}>Annotator</MenuItem>
              <MenuItem value={"Reviewer"}>Reviewer</MenuItem>
              <MenuItem value={"SuperCheck"}>Super Checker</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
        {radiobutton === "UsersReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small" disabled={reportTypes === "SuperCheck" || radiobutton === "ProjectReports"} >
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Projects Filter</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="project-type-label"
              id="project-type-select"
              value={reportfilter}
              label="Projects Filter"
              onChange={handleChangeprojectFilter}
            >
              {FilterProgressType.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}

        {radiobutton !== "PaymentReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="language-label" sx={{ fontSize: "16px" }}>Target Language</InputLabel>
            <Select
              labelId="language-label"
              id="language-select"
              value={targetLanguage}
              label="Target Language"
              onChange={(e) => setTargetLanguage(e.target.value)}
              MenuProps={MenuProps}
            >
              <MenuItem value={"all"}>All languages</MenuItem>
              {LanguageChoices.language?.map((lang) => (
                <MenuItem value={lang} key={lang}>
                  {lang}
                </MenuItem>))}
            </Select>
          </FormControl>
        </Grid>}
        {["UsersReports", "PaymentReports"].includes(radiobutton) &&
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              onClick={() => setShowPicker(!showPicker)}
              sx={{ width: "130px" }}
            >
              Pick Dates
            </Button>
          </Grid>
        }

        <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ width: "130px" }}
          >
            E-mail CSV
          </Button>
        </Grid>
      </Grid>
      {showPicker && <Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}>
        <Card>
          <DateRangePicker
            onChange={handleRangeChange}
            staticRanges={[
              ...defaultStaticRanges,
              {
                label: "Till Date",
                range: () => ({
                  startDate: new Date(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
            minDate={new Date(Date.parse(OrganizationDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
            maxDate={new Date()}
            direction="horizontal"
          />
        </Card>
      </Box>}
      {/* {showSpinner ? <div></div> : reportRequested && (
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={ProjectReports.length > 0 ? "Reports" : ""}
            data={reportData}
            columns={columns.filter((col) => selectedColumns.includes(col.name))}
            options={options}
          />
        </ThemeProvider>)
      } */}
      {/*<Grid
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

export default OrganizationReports;
