import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import tableTheme from "../../../theme/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import GetWorkspaceUserReportsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceUserReports";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetWorkspaceProjectReportAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceProjectReports";
import SendWorkspaceUserReportsAPI from "../../../../redux/actions/api/WorkspaceDetails/SendWorkspaceUserReports";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../common/ColumnList";
import { isSameDay, format } from "date-fns/esm";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { MenuProps } from "../../../../utils/utils";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetWorkspaceDetailedProjectReportsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetailedProjectReports";
import { styled } from "@mui/material/styles";

const TruncatedContent = styled(Box)(({ expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.5em",
  maxHeight: expanded ? "9900px" : "4.5em",
  transition: "max-height 1.8s ease-in-out",
}));

const RowContainer = styled(Box)(({ expanded }) => ({
  cursor: "pointer",
  transition: "all 1.8s ease-in-out",
}));

const ProgressType = [
  { name: "Annotation Stage", value: 1 },
  { name: "Review Stage", value: 2 },
  { name: "Super Check Stage", value: 3 },
  { name: "All Stage", value: "AllStage" },
];

const WorkspaceReports = () => {
  const WorkspaceDetails = useSelector(
    (state) => state.getWorkspaceDetails.data
  );
  const UserDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: new Date(
        Date.parse(WorkspaceDetails?.created_at, "yyyy-MM-ddTHH:mm:ss.SSSZ")
      ),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [participationTypes, setParticipationTypes] = useState([1, 2, 4]);
  const [radioButton, setRadioButton] = useState("project");
  const [userColumns, setUserColumns] = useState([]);
  const [projectColumns, setProjectColumns] = useState([]);
  const [userSelectedColumns, setUserSelectedColumns] = useState([]);
  const [projectSelectedColumns, setProjectSelectedColumns] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [reportRequested, setReportRequested] = useState(false);
  const [emailRequested, setEmailRequested] = useState(false);
  const [reportfilter, setReportfilter] = useState("AllStage");
  const [statisticsType, setStatisticsType] = useState(1);

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

  let ProgressTypeValue = "Annotation Stage";
  const filterdata = ProgressType.filter(
    (item) => item.name !== ProgressTypeValue
  );

  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [userReportsExpandedRow, setUserReportsExpandedRow] = useState(null);
  const [projectReportsExpandedRow, setProjectReportsExpandedRow] =
    useState(null);
  const [reportType, setReportType] = useState({
    user: "AnnotatationReports",
    project: 1,
    payment: "AnnotatationReports",
  });
  const [projectType, setProjectType] = useState({
    user: "ContextualTranslationEditing",
    project: "ContextualTranslationEditing",
    payment: "AllAudioProjects",
  });
  const [targetLanguage, setTargetLanguage] = useState({
      user: "all",
      project: "all",
    });
  const FilterProgressType =
    projectType[radioButton] === "ReviewerReports" ? filterdata : ProgressType;

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
    if (radioButton === "payment") {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      types.push("AllAudioProjects");
      setProjectTypes(types);
    } else if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
    }
  }, [ProjectTypes, radioButton]);

  useEffect(() => {
    if (reportRequested) {
      if (UserReports?.length && radioButton === "user") {
        let tempColumns = [];
        const currentSelectedColumns =
          userSelectedColumns.length === 0
            ? Object.keys(UserReports[0])
            : userSelectedColumns;
        if (userSelectedColumns.length === 0) {
          setUserSelectedColumns(Object.keys(UserReports[0]));
        }

        Object.keys(UserReports[0]).forEach((key) => {
          const isSelectedColumn = currentSelectedColumns.includes(key);
          tempColumns.push({
            name: key,
            label: key,
            options: {
              filter: false,
              sort: true,
              align: "center",
              display: isSelectedColumn ? "true" : "false",
              customBodyRender: (value, tableMeta) => {
                const rowIndex = tableMeta.rowIndex;
                const isExpanded = userReportsExpandedRow === rowIndex;
                return (
                  <RowContainer
                    expanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserReportsExpandedRow((prevExpanded) =>
                        prevExpanded === rowIndex ? null : rowIndex
                      );
                    }}
                  >
                    <TruncatedContent expanded={isExpanded}>
                      {value}
                    </TruncatedContent>
                  </RowContainer>
                );
              },
            },
          });
        });
        setUserColumns(tempColumns);
      }
      if (ProjectReports?.length && radioButton === "project") {
        let tempColumns = [];
        const currentSelectedColumns =
          projectSelectedColumns.length === 0
            ? Object.keys(ProjectReports[0])
            : projectSelectedColumns;
        if (projectSelectedColumns.length === 0) {
          setProjectSelectedColumns(Object.keys(ProjectReports[0]));
        }
        Object.keys(ProjectReports[0]).forEach((key) => {
          const isSelectedColumn = currentSelectedColumns.includes(key);
          tempColumns.push({
            name: key,
            label: key,
            options: {
              filter: false,
              sort: true,
              align: "center",
              display: isSelectedColumn ? "true" : "false",
              customBodyRender: (value, tableMeta) => {
                const rowIndex = tableMeta.rowIndex;
                const isExpanded = projectReportsExpandedRow === rowIndex;
                return (
                  <RowContainer
                    expanded={isExpanded}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectReportsExpandedRow((prevExpanded) =>
                        prevExpanded === rowIndex ? null : rowIndex
                      );
                    }}
                  >
                    <TruncatedContent expanded={isExpanded}>
                      {value}
                    </TruncatedContent>
                  </RowContainer>
                );
              },
            },
          });
        });
        setProjectColumns(tempColumns);
      }
    } else {
      if (emailRequested && UserReports?.length) {
        setSnackbarInfo({
          open: true,
          message: UserReports.message,
          variant: "success",
        });
        setEmailRequested(false);
      }
      if (emailRequested && ProjectReports?.length) {
        setSnackbarInfo({
          open: true,
          message: ProjectReports.message,
          variant: "success",
        });
        setEmailRequested(false);
      }
      radioButton === "user" && setUserColumns([]);
      radioButton === "project" && setProjectColumns([]);
    }
    setShowSpinner(false);
  }, [
    reportRequested,
    UserReports,
    userReportsExpandedRow,
    ProjectReports,
    projectReportsExpandedRow,
  ]);

  useEffect(() => {
    if (radioButton === "user") {
      if (userColumns.length > 0 && userSelectedColumns.length > 0) {
        const newCols = userColumns.map((col) => ({
          ...col,
          options: {
            ...col.options,
            display: userSelectedColumns.includes(col.name) ? "true" : "false",
          },
        }));
        if (JSON.stringify(newCols) !== JSON.stringify(userColumns)) {
          setUserColumns(newCols);
        }
      }
    } else if (radioButton === "project") {
      if (projectColumns.length > 0 && projectSelectedColumns.length > 0) {
        const newCols = projectColumns.map((col) => ({
          ...col,
          options: {
            ...col.options,
            display: projectSelectedColumns.includes(col.name)
              ? "true"
              : "false",
          },
        }));
        if (JSON.stringify(newCols) !== JSON.stringify(projectColumns)) {
          setProjectColumns(newCols);
        }
      }
    }
  }, [
    radioButton,
    userSelectedColumns,
    userColumns,
    projectSelectedColumns,
    projectColumns,
  ]);

  const renderToolBar = () => {
    return (
      <Box className={classes.ToolbarContainer}>
        <ColumnList
          columns={
            radioButton === "user"
              ? userColumns
              : radioButton === "project"
              ? projectColumns
              : null
          }
          setColumns={
            radioButton === "user"
              ? setUserSelectedColumns
              : radioButton === "project"
              ? setProjectSelectedColumns
              : null
          }
          selectedColumns={
            radioButton === "user"
              ? userSelectedColumns
              : radioButton === "project"
              ? projectSelectedColumns
              : null
          }
        />
      </Box>
    );
  };
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
    responsive: "vertical",
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

  const userId = useSelector((state) => state.fetchLoggedInUserData.data.id);

  const handleChangeReports = (e) => {
    const value = e.target.value;
    setRadioButton(value);
  };

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
  };
  const handleDateSubmit = (sendMail) => {
    if (radioButton === "payment") {
      const userReportObj = new SendWorkspaceUserReportsAPI(
        id,
        UserDetails.id,
        projectType[radioButton],
        participationTypes,
        format(selectRange[0].startDate, "yyyy-MM-dd"),
        format(selectRange[0].endDate, "yyyy-MM-dd")
      );
      dispatch(APITransport(userReportObj));
      setSnackbarInfo({
        open: true,
        message: "Report will be e-mailed to you shortly",
        variant: "success",
      });
    } else {
      if (sendMail) {
        setReportRequested(false);
        setEmailRequested(true);
      } else {
        setReportRequested(true);
      }
      setShowSpinner(true);
      setShowPicker(false);
      if (radioButton === "user") {
        const userReportObj = new GetWorkspaceUserReportsAPI(
          id,
          projectType[radioButton],
          format(selectRange[0].startDate, "yyyy-MM-dd"),
          format(selectRange[0].endDate, "yyyy-MM-dd"),
          targetLanguage[radioButton],
          sendMail,
          projectType[radioButton] === "AnnotatationReports"
            ? "annotation"
            : projectType[radioButton] === "ReviewerReports"
            ? "review"
            : "supercheck",
          reportfilter
        );
        dispatch(APITransport(userReportObj));
      } else if (radioButton === "project") {
        if (reportType[radioButton] === 1) {
          const projectReportObj = new GetWorkspaceProjectReportAPI(
            id,
            projectType[radioButton],
            targetLanguage[radioButton],
            sendMail,
            projectType[radioButton] === "AnnotatationReports"
              ? "annotation"
              : projectType[radioButton] === "ReviewerReports"
              ? "review"
              : "supercheck"
          );
          dispatch(APITransport(projectReportObj));
        } else if (reportType[radioButton] === 2) {
          const projectReportObj = new GetWorkspaceDetailedProjectReportsAPI(
            Number(id),
            projectType[radioButton],
            userId,
            statisticsType,
            targetLanguage[radioButton],
          );
          dispatch(APITransport(projectReportObj));
          setSnackbarInfo({
            open: true,
            message: "Report will be e-mailed to you shortly",
            variant: "success",
          });
        }
      }
    }
  };

  const handleChangeprojectFilter = (event) => {
    const value = event.target.value;
    setReportfilter(value);
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
        <Grid container direction="row" spacing={3} sx={{ mt: 1, ml: 1 }}>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
            <Typography
              gutterBottom
              component="div"
              sx={{ marginTop: "10px", fontSize: "16px" }}
            >
              Select Report Type :
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radioButton}
                onChange={handleChangeReports}
              >
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="Users Reports"
                />
                <FormControlLabel
                  value="project"
                  control={<Radio />}
                  label="Project Reports"
                />
                <FormControlLabel
                  value="payment"
                  control={<Radio />}
                  label="Payment Reports"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        {radioButton === "project" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="project-report-type-label"
                sx={{ fontSize: "16px" }}
              >
                Type
              </InputLabel>
              <Select
                style={{ zIndex: "0" }}
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                labelId="project-report-type-type-label"
                id="project-report-type-select"
                value={reportType[radioButton]}
                label="Project Report Type"
                onChange={(e) => {
                  setReportType({
                    ...reportType,
                    [radioButton]: e.target.value,
                  });
                }}
              >
                <MenuItem value={1}>High-Level Reports</MenuItem>
                <MenuItem value={2}>Detailed Reports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        {radioButton !== "project" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="report-type-label" sx={{ fontSize: "16px" }}>
                Report Type
              </InputLabel>
              <Select
                labelId="report-type-label"
                id="report-select"
                value={reportType[radioButton]}
                label="Report Type"
                onChange={(e) => {
                  setReportType({
                    ...reportType,
                    [radioButton]: e.target.value,
                  });
                }}
                MenuProps={MenuProps}
              >
                <MenuItem value={"AnnotatationReports"}>Annotator</MenuItem>
                <MenuItem value={"ReviewerReports"}>Reviewer</MenuItem>
                <MenuItem value={"SuperCheckerReports"}>Super Checker</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
              Project Type
            </InputLabel>
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={projectType[radioButton]}
              label="Project Type"
              onChange={(e) => {
                setProjectType({
                  ...projectType,
                  [radioButton]: e.target.value,
                });
              }}
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
        {radioButton === "user" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl
              fullWidth
              size="small"
              disabled={projectType[radioButton] === "SuperCheckerReports"}
            >
              <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
                Projects Filter
              </InputLabel>
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
                  <MenuItem value={type.value} key={index}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {radioButton !== "payment" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="language-label" sx={{ fontSize: "16px" }}>
                Target Language
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={targetLanguage[radioButton]}
                label="Target Language"
                onChange={(e) => {
                  setTargetLanguage({
                    ...targetLanguage,
                    [radioButton]: e.target.value,
                  });
                }}
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
          </Grid>
        )}
        {radioButton === "project" && reportType[radioButton] === 2 && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="statistics-label" sx={{ fontSize: "16px" }}>
                Statistics
              </InputLabel>
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
          </Grid>
        )}
        {radioButton === "payment" && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="participation-type-label"
                sx={{ fontSize: "16px" }}
              >
                Participation Types
              </InputLabel>
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
          </Grid>
        )}
        {(radioButton === "user" || radioButton === "payment") && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
              variant="contained"
              color="primary"
              sx={{ width: "130px" }}
              onClick={() => setShowPicker(!showPicker)}
            >
              Pick Dates
            </Button>
          </Grid>
        )}

        {(radioButton === "user" ||
          (radioButton === "project" && reportType[radioButton] === 1)) && (
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleDateSubmit(false)}
              sx={{ width: "130px" }}
            >
              Submit
            </Button>
          </Grid>
        )}
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleDateSubmit(true)}
            sx={{ width: "130px" }}
          >
            E-mail CSV
          </Button>
        </Grid>
      </Grid>
      {showPicker && (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Card>
            <DateRangePicker
              onChange={handleRangeChange}
              staticRanges={[
                ...defaultStaticRanges,
                {
                  label: "Till Date",
                  range: () => ({
                    startDate: new Date(
                      Date.parse(
                        WorkspaceDetails?.created_at,
                        "yyyy-MM-ddTHH:mm:ss.SSSZ"
                      )
                    ),
                    endDate: new Date(),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  },
                },
              ]}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={selectRange}
              minDate={
                new Date(
                  Date.parse(
                    WorkspaceDetails?.created_at,
                    "yyyy-MM-ddTHH:mm:ss.SSSZ"
                  )
                )
              }
              maxDate={new Date()}
              direction="horizontal"
            />
          </Card>
        </Box>
      )}
      {showSpinner ? (
        <div></div>
      ) : (
        reportRequested && (
          <ThemeProvider theme={tableTheme}>
            <div ref={tableRef}>
              {isBrowser ? (
                radioButton === "user" && UserReports?.length ? (
                  <MUIDataTable
                    key={`table-${displayWidth}`}
                    title={"User Reports"}
                    data={UserReports}
                    columns={userColumns.filter((col) =>
                      userSelectedColumns.includes(col.name)
                    )}
                    options={options}
                  />
                ) : radioButton === "project" && ProjectReports?.length > 0 ? (
                  <MUIDataTable
                    key={`table-${displayWidth}`}
                    title={"Projects Reports"}
                    data={ProjectReports}
                    columns={projectColumns.filter((col) =>
                      projectSelectedColumns.includes(col.name)
                    )}
                    options={options}
                  />
                ) : null
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
          </ThemeProvider>
        )
      )}
    </React.Fragment>
  );
};

export default WorkspaceReports;
