import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import GetUserAnalyticsAPI from "../../../../redux/actions/api/UserManagement/GetUserAnalytics";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../common/ColumnList";
import CustomizedSnackbars from "../common/Snackbar";
import { isSameDay, format } from "date-fns/esm";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useParams } from "react-router-dom";
import Spinner from "../../component/common/Spinner";
import { MenuProps } from "../../../../utils/utils";
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

const MyProgress = () => {
  const { id } = useParams();
  const UserDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: new Date(
        Date.parse(UserDetails?.date_joined, "yyyy-MM-ddTHH:mm:ss.SSSZ")
      ),
      endDate: new Date(),
      key: "selection",
    },
  ]);
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
  const [totalsummary, setTotalsummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const UserAnalytics = useSelector(
    (state) => state.getUserAnalytics.data.project_summary
  );
  const UserAnalyticstotalsummary = useSelector(
    (state) => state.getUserAnalytics.data.total_summary
  );
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const dispatch = useDispatch();

  const classes = DatasetStyle();
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);

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
    const typesObj = new GetProjectDomainsAPI();
    dispatch(APITransport(typesObj));
  }, []);

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

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
      if(selectedColumns.length === 0) {
        setSelectedColumns(columns);
      }
      Object.keys(UserAnalytics[0]).forEach((key) => {
        const isSelectedColumn = selectedColumns.includes(key)
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: isSelectedColumn ? "true" : "false",
            customBodyRender: (value, tableMeta) => {
              const rowIndex = tableMeta.rowIndex;
              const isExpanded = expandedRow === rowIndex;
              return (
                <RowContainer
                  expanded={isExpanded}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedRow((prevExpanded) =>
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
      setColumns(tempColumns);
      setReportData(UserAnalytics);
    } else {
      setColumns([]);
      setReportData([]);
    }
    setShowSpinner(false);
  }, [UserAnalytics, expandedRow]);

  useEffect(() => {
      if (columns.length > 0 && selectedColumns.length > 0) {
        const newCols = columns.map((col) => ({
          ...col,
          options: {
            ...col.options,
            display: selectedColumns.includes(col.name) ? "true" : "false",
          },
        }));
        if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
          setColumns(newCols);
        }
      }
    }, [selectedColumns, columns]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
  };

  const handleProgressSubmit = () => {
    setShowPicker(false);
    setSubmitted(true);
    const reviewdata = {
      user_id: id,
      project_type: selectedType,
      reports_type:
        radiobutton === "AnnotatationReports"
          ? "annotation"
          : radiobutton === "ReviewerReports"
          ? "review"
          : "supercheck",
      start_date: format(selectRange[0].startDate, "yyyy-MM-dd"),
      end_date: format(selectRange[0].endDate, "yyyy-MM-dd"),
    };

    const progressObj = new GetUserAnalyticsAPI(reviewdata);
    dispatch(APITransport(progressObj));
    // setShowSpinner(true);
    setTotalsummary(true);
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
    setRadiobutton(e.target.value);
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
  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
      {loading && <Spinner />}
      <Grid
        container
        direction="row"
        justifyContent="start"
        alignItems="center"
        // sx={{ marginLeft: "50px" }}
      >
        <Grid>
          <Typography
            gutterBottom
            component="div"
            sx={{ marginTop: "15px", fontSize: "16px" }}
          >
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
            <FormControlLabel
              value="AnnotatationReports"
              control={<Radio />}
              label="Annotator"
            />
            <FormControlLabel
              value="ReviewerReports"
              control={<Radio />}
              label="Reviewer"
            />
            <FormControlLabel
              value="SuperCheckerReports"
              control={<Radio />}
              label="Super Checker"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          columnSpacing={4}
          rowSpacing={2}
          mt={1}
          mb={1}
          justifyContent="flex-start"
        >
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
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
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
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
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleProgressSubmit}
              sx={{ width: "130px" }}
            >
              Submit
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
            <Card sx={{ overflowX: "scroll" }}>
              <DateRangePicker
                onChange={handleRangeChange}
                staticRanges={[
                  ...defaultStaticRanges,
                  {
                    label: "Till Date",
                    range: () => ({
                      startDate: new Date("2021-01-01"),
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
                minDate={new Date("2021-01-01")}
                maxDate={new Date()}
                direction="horizontal"
              />
            </Card>
          </Box>
        )}
        {radiobutton === "AnnotatationReports" && totalsummary && (
          <Grid container direction="row" sx={{ mb: 3, mt: 2 }}>
            <Grid
              container
              alignItems="center"
              direction="row"
              justifyContent="flex-start"
            >
              <Typography variant="h6">Total Summary </Typography>
            </Grid>
            {UserAnalyticstotalsummary?.[0] &&
              Object.entries(UserAnalyticstotalsummary?.[0]).map(
                ([title, value], index) => (
                  <Grid
                    key={index}
                    container
                    alignItems="center"
                    direction="row"
                    justifyContent="flex-start"
                  >
                    <Typography variant="subtitle1">{title}:</Typography>
                    <Typography
                      variant="body2"
                      className={classes.TotalSummarydata}
                    >
                      {value}
                    </Typography>
                  </Grid>
                )
              )}
          </Grid>
        )}

        {radiobutton === "ReviewerReports" && totalsummary && (
          <Grid
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
            {UserAnalyticstotalsummary?.[0] &&
              Object.entries(UserAnalyticstotalsummary?.[0]).map(
                ([title, value], index) => (
                  <Grid
                    key={index}
                    container
                    alignItems="center"
                    direction="row"
                    justifyContent="flex-start"
                  >
                    <Typography variant="subtitle1">{title}:</Typography>
                    <Typography
                      variant="body2"
                      className={classes.TotalSummarydata}
                    >
                      {value}
                    </Typography>
                  </Grid>
                )
              )}{" "}
          </Grid>
        )}
        {radiobutton === "SuperCheckerReports" && totalsummary && (
          <Grid
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

            {UserAnalyticstotalsummary?.[0] &&
              Object.entries(UserAnalyticstotalsummary?.[0]).map(
                ([title, value], index) => (
                  <Grid
                    key={index}
                    container
                    alignItems="center"
                    direction="row"
                    justifyContent="flex-start"
                  >
                    <Typography variant="subtitle1">{title}:</Typography>
                    <Typography
                      variant="body2"
                      className={classes.TotalSummarydata}
                    >
                      {value}
                    </Typography>
                  </Grid>
                )
              )}
          </Grid>
        )}
        {UserAnalytics?.length > 0 ? (
          <ThemeProvider theme={tableTheme}>
            <div ref={tableRef}>
              {isBrowser ? (
                <MUIDataTable
                  key={`table-${displayWidth}`}
                  title={
                    radiobutton === "AnnotatationReports"
                      ? "Annotation Report"
                      : radiobutton === "ReviewerReports"
                      ? "Reviewer Report"
                      : "Super Checker Report"
                  }
                  data={reportData}
                  columns={columns.filter((col) =>
                    selectedColumns.includes(col.name)
                  )}
                  options={tableOptions}
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
          </ThemeProvider>
        ) : (
          <Grid container justifyContent="center">
            <Grid item sx={{ mt: "10%" }}>
              {showSpinner ? (
                <CircularProgress color="primary" size={50} />
              ) : (
                !reportData?.length && submitted && <>No results</>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
      <CustomizedSnackbars
        message={snackbarText}
        open={snackbarOpen}
        hide={2000}
        handleClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        variant="error"
      />
    </ThemeProvider>
  );
};

export default MyProgress;
