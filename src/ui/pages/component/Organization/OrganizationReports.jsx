// OrganizationReports

import React, { useState, useEffect, useRef } from "react";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import tableTheme from "../../../theme/tableTheme";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import { ThemeProvider } from "@mui/material/styles";
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
import GetOrganizationDetailedProjectReportsAPI from "../../../../redux/actions/api/Organization/GetOrganizationDetailedProjectReports";
import Skeleton from "@mui/material/Skeleton";

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
  const [emailRequested, setEmailRequested] = useState(false);
  const [reportTypes, setReportTypes] = useState("Annotator");
  const [radiobutton, setRadiobutton] = useState("ProjectReports");
  const [reportfilter, setReportfilter] = useState(["All Stage"]);
  const [projectReportType, setProjectReportType] = useState(1);
  const [statisticsType, setStatisticsType] = useState(1);
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
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector('.MuiDataTable-responsiveBase');
        if (tableWrapper) {
          tableWrapper.classList.add('MuiDataTable-vertical');
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    const langObj = new FetchLanguagesAPI();
    dispatch(APITransport(typesObj));
    dispatch(APITransport(langObj));
  }, []);

  useEffect(() => {
    if (radiobutton === "PaymentReports") {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      types.push("AllAudioProjects")
      setProjectTypes(types);
      setSelectedType("AllAudioProjects");
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
      if(emailRequested){
          setSnackbarInfo({
            open: true,
            message: UserReports.message,
            variant: "success",
          })
          setEmailRequested(false);
        }
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
      if(emailRequested){
        setSnackbarInfo({
          open: true,
          message: ProjectReports.message,
          variant: "success",
        })
        setEmailRequested(false);
      }
      setColumns([]);
      setReportData([]);
      setSelectedColumns([]);
    }
    setShowSpinner(false);
  }, [ProjectReports]);

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

    const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", 
          justifyContent: { 
            xs: "space-between", 
            md: "flex-end" 
          }, 
          alignItems: "center",
          padding: "10px",
          gap: { 
            xs: "10px", 
            md: "20px" 
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
          "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
            marginRight: "10px",
          },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label style={{ 
            marginRight: "5px", 
            fontSize:"0.83rem", 
          }}>
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
    filterType: 'checkbox',
    selectableRows: "none",
    download: true,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
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


  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    console.log(selection, "selection");
  };

  const userId = useSelector((state) => state.fetchLoggedInUserData.data.id);

  const handleSubmit = (sendMail) => {
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
      if(sendMail){
        setReportRequested(false);
        setEmailRequested(true);
      }else{
        setReportRequested(true);
      }
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
          sendMail,
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
          sendMail,
        );
        dispatch(APITransport(supercheckObj));
      }
      else if (radiobutton === "ProjectReports") {
        if(projectReportType === 1){
        const projectReportObj = new GetOrganizationProjectReportsAPI(
          orgId,
          selectedType,
          targetLanguage,
          userId,
          sendMail
        );
        dispatch(APITransport(projectReportObj));
      }else if(projectReportType === 2){
        const projectReportObj = new GetOrganizationDetailedProjectReportsAPI(
          Number(orgId),
          selectedType,
          userId,
          statisticsType
        );
        dispatch(APITransport(projectReportObj));
        setSnackbarInfo({
          open: true,
          message: "Report will be e-mailed to you shortly",
          variant: "success",
        })
      }
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

        {radiobutton === "ProjectReports" && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="project-report-type-label" sx={{ fontSize: "16px" }}>Type</InputLabel>
            <Select
              style={{ zIndex: "0" }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={MenuProps}
              labelId="project-report-type-type-label"
              id="project-report-type-select"
              value={projectReportType}
              label="Project Report Type"
              onChange={(e) => setProjectReportType(e.target.value)}
            >
              <MenuItem value={1}>High-Level Reports</MenuItem>
              <MenuItem value={2}>Detailed Reports</MenuItem>
            </Select>
          </FormControl>
        </Grid>}
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
        {(radiobutton === "ProjectReports" && projectReportType === 1) &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
      {(radiobutton === "ProjectReports" && projectReportType === 2) &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="statistics-label" sx={{ fontSize: "16px" }}>Statistics</InputLabel>
          <Select
            labelId="statistics-label"
            id="statistics-select"
            value={statisticsType}
            label="Statistics"
            onChange={(e) => setStatisticsType(e.target.value)}
            MenuProps={MenuProps}
          >
          <MenuItem value={1}>Annotation Statistics</MenuItem>
          <MenuItem value={2}>Meta-Info Statistics</MenuItem>
          <MenuItem value={3}>Complete Statistics</MenuItem>
        </Select>
        </FormControl>
      </Grid>}
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
        {radiobutton === "UsersReports" && <><Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
      </Grid>
      </>}

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

        {(radiobutton==="UsersReports"|| (radiobutton==="ProjectReports" && projectReportType === 1)) && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(false)}
            sx={{ width: "130px" }}
          >
            Submit
          </Button>
        </Grid>}
      <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSubmit(true)}
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
      {showSpinner ? <div></div> : reportRequested && (
        <ThemeProvider theme={tableTheme}>
        <div ref={tableRef}>
                    {isBrowser ? (
                      <MUIDataTable
                        key={`table-${displayWidth}`}
                        title={ProjectReports.length > 0 ? "Reports" : ""}
                        data={reportData}
                        columns={columns.filter((col) => selectedColumns.includes(col.name))}
                        options={options}
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        height={400}
                        sx={{
                          mx: 2,
                          my: 3,
                          borderRadius: '4px',
                          transform: 'none'
                        }}
                      />
                    )}
                  </div>
        </ThemeProvider>)
      }
    </React.Fragment>
  );
};

export default OrganizationReports;
