import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import themeDefault from "../../../theme/theme";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
import CreateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/CreateScheduledMails";
import GetScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/GetScheduledMails";
import UpdateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/UpdateScheduledMails";
import DeleteScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/DeleteScheduledMails";
import Snackbar from "../../component/common/Snackbar";
import { MenuProps } from "../../../../utils/utils";
import CustomButton from "../../component/common/Button";
import tableTheme from "../../../theme/tableTheme";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../../component/common/ColumnList";
import userRole from "../../../../utils/UserMappedByRole/Roles";
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

const ScheduleMails = () => {
  const { id } = useParams();
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    variant: "",
  });
  const [reportLevel, setReportLevel] = useState(1);
  const [selectedProjectType, setSelectedProjectType] =
    useState("AllAudioProjects");
  const [projectTypes, setProjectTypes] = useState([
    "AllAudioProjects",
    "AudioSegmentation",
    "AudioTranscription",
    "AudioTranscriptionEditing",
    "StandardizedTranscriptionEditing",
    "AcousticNormalisedTranscriptionEditing",
    "MonolingualTranslation",
    "TranslationEditing",
    "SemanticTextualSimilarity(Scale5)",
    "ContextualTranslationEditing",
    "OCRTranscription",
    "OCRTranscriptionEditing",
    "OCRSegmentCategorization",
    "OCRSegmentCategorizationEditing",
    "OCRSegmentCategorizationRelationMappingEditing",
    "MonolingualCollection",
    "SentenceSplitting",
    "ContextualSentenceVerification",
    "ContextualSentenceVerificationandDomainClassification",
    "ConversationTranslation",
    "ConversationTranslationEditing",
    "ConversationVerification",
  ]);

  const [schedule, setSchedule] = useState("Daily");
  const [scheduleDay, setScheduleDay] = useState(1);
  const [workspaceId, setWorkspaceId] = useState(0);
  const [workspaces, setWorkspaces] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const workspaceData = useSelector((state) => state.GetWorkspace.data);
  const scheduledMails = useSelector((state) => state.getScheduledMails.data);
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

  const getWorkspaceData = () => {
    const workspaceObj = new GetWorkspaceAPI();
    dispatch(APITransport(workspaceObj));
  };

  const getScheduledMails = () => {
    const scheduledMailsObj = new GetScheduledMailsAPI(id);
    dispatch(APITransport(scheduledMailsObj));
  };

  const createScheduledMail = () => {
    if (
      !reportLevel ||
      !schedule ||
      !selectedProjectType ||
      (reportLevel === 2 && workspaceId === 0)
    ) {
      setSnackbarState({
        open: true,
        message: "Invalid input",
        variant: "error",
      });
      return;
    }
    if (schedule === "Monthly" && (scheduleDay > 28 || scheduleDay < 1)) {
      setSnackbarState({
        open: true,
        message: "Day of month not in range",
        variant: "error",
      });
      return;
    }
    if (schedule === "Weekly" && (scheduleDay > 6 || scheduleDay < 0)) {
      setSnackbarState({
        open: true,
        message: "Day of week not in range",
        variant: "error",
      });
      return;
    }
    const scheduledMailsObj = new CreateScheduledMailsAPI(
      id,
      reportLevel === 1 ? userDetails?.organization?.id : workspaceId,
      reportLevel,
      selectedProjectType,
      schedule,
      scheduleDay
    );
    fetch(scheduledMailsObj.apiEndPoint(), {
      method: "POST",
      headers: scheduledMailsObj.getHeaders().headers,
      body: JSON.stringify(scheduledMailsObj.getBody()),
    })
      .then(async (res) => {
        if (!res.ok) throw res.status === 500 ? res : await res.json();
        else return res;
      })
      .then((res) => {
        setSnackbarState({
          open: true,
          message: "Scheduled mail request sent",
          variant: "success",
        });
        getScheduledMails();
      })
      .catch((err) => {
        setSnackbarState({
          open: true,
          message:
            err.status === 500 ? "Unexpected error occurred" : err.message,
          variant: "error",
        });
      });
  };

  const updateScheduledMail = (mail) => {
    const scheduledMailsObj = new UpdateScheduledMailsAPI(id, mail.id);
    fetch(scheduledMailsObj.apiEndPoint(), {
      method: "PATCH",
      headers: scheduledMailsObj.getHeaders().headers,
      body: JSON.stringify(scheduledMailsObj.getBody()),
    })
      .then(async (res) => {
        if (!res.ok) throw res.status === 500 ? res : await res.json();
        else return res;
      })
      .then((res) => {
        setSnackbarState({
          open: true,
          message: "Mail schedule updated",
          variant: "success",
        });
        getScheduledMails();
      })
      .catch((err) => {
        setSnackbarState({
          open: true,
          message:
            err.status === 500 ? "Unexpected error occurred" : err.message,
          variant: "error",
        });
      });
  };

  const deleteScheduledMail = (mail) => {
    const scheduledMailsObj = new DeleteScheduledMailsAPI(id, mail.id);
    fetch(scheduledMailsObj.apiEndPoint(), {
      method: "POST",
      headers: scheduledMailsObj.getHeaders().headers,
      body: JSON.stringify(scheduledMailsObj.getBody()),
    })
      .then(async (res) => {
        if (!res.ok) throw res.status === 500 ? res : await res.json();
        else return res;
      })
      .then((res) => {
        setSnackbarState({
          open: true,
          message: "Mail schedule deleted",
          variant: "success",
        });
        getScheduledMails();
      })
      .catch((err) => {
        setSnackbarState({
          open: true,
          message:
            err.status === 500 ? "Unexpected error occurred" : err.message,
          variant: "error",
        });
      });
  };

  useEffect(() => {
    getWorkspaceData();
    getScheduledMails();
  }, []);

  useEffect(() => {
    workspaceData && workspaceData.length > 0 && setWorkspaces(workspaceData);
  }, [workspaceData]);

  useEffect(() => {
    if (scheduledMails?.length) {
      let tempColumns = [];
      Object.keys(scheduledMails[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
            align: "center",

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
            setCellProps: () => ({
              style: {

                whiteSpace: "normal",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }
            }),
          },
        });
      });
      tempColumns.push({
        name: "Actions",
        label: "Actions",
        options: {
          filter: false,
          sort: true,
          align: "center",
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
      scheduledMails.map((mail) => {
        mail.Actions = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <CustomButton
              label={mail["Status"] === "Enabled" ? "Pause" : "Resume"}
              onClick={() => updateScheduledMail(mail)}
            />
            <CustomButton
              label="Delete"
              sx={{ backgroundColor: "#EC0000" }}
              onClick={() => deleteScheduledMail(mail)}
            />
          </Box>
        );
        return mail;
      });

      const allColumnNames = tempColumns.map(col => col.name);
      setColumns(tempColumns);

      // Update the selectedColumns state to include all column names
      setSelectedColumns(allColumnNames);

      setTableData(scheduledMails);
    } else {
      setColumns([]);
      setTableData([]);
    }
    setShowSpinner(false);
  }, [scheduledMails, expandedRow])

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

  const renderToolBar = () => {
    return (
      <Box className={classes.ToolbarContainer}>
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

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            width: "100%",
            minHeight: 500,
            padding: 5,
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Schedule Emails (Payment Reports)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="report-level-label" sx={{ fontSize: "16px" }}>
                  Report Level
                </InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="report-level-label"
                  id="report-level-select"
                  value={reportLevel}
                  label="Report Level"
                  onChange={(e) => setReportLevel(e.target.value)}
                >
                  {(userRole.OrganizationOwner === userDetails?.role ||
                    userRole.Admin === userDetails?.role) && (
                    <MenuItem value={1}>Organization</MenuItem>
                  )}
                  <MenuItem value={2}>Workspace</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="workspace-label" sx={{ fontSize: "16px" }}>
                  Workspace
                </InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="workspace-label"
                  id="workspace-select"
                  value={workspaceId}
                  label="Workspace"
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  disabled={
                    reportLevel === 1 ||
                    !(workspaceData && workspaceData.length > 0)
                  }
                >
                  {workspaces.map((w, index) => (
                    <MenuItem value={w.id} key={index}>
                      {w.workspace_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>
                  Project Type
                </InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="project-type-label"
                  id="project-type-select"
                  value={selectedProjectType}
                  label="Project Type"
                  onChange={(e) => setSelectedProjectType(e.target.value)}
                >
                  {projectTypes.map((type, index) => (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="schedule-label" sx={{ fontSize: "16px" }}>
                  Schedule
                </InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="schedule-label"
                  id="schedule-select"
                  value={schedule}
                  label="Schedule"
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <MenuItem value={"Daily"}>Daily</MenuItem>
                  <MenuItem value={"Weekly"}>Weekly</MenuItem>
                  <MenuItem value={"Monthly"}>Monthly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {schedule === "Weekly" && (
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="weekday-label" sx={{ fontSize: "16px" }}>
                    Day of Week
                  </InputLabel>
                  <Select
                    style={{ zIndex: "0" }}
                    inputProps={{ "aria-label": "Without label" }}
                    MenuProps={MenuProps}
                    labelId="weekday-label"
                    id="weekday-select"
                    value={scheduleDay}
                    label="Day of Week"
                    onChange={(e) => setScheduleDay(e.target.value)}
                  >
                    <MenuItem value={0}>Sunday</MenuItem>
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
            {schedule === "Monthly" && (
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="month-day-label" sx={{ fontSize: "16px" }}>
                    Day of Month
                  </InputLabel>
                  <Select
                    style={{ zIndex: "0" }}
                    inputProps={{ "aria-label": "Without label" }}
                    MenuProps={MenuProps}
                    labelId="month-day-label"
                    id="month-day-select"
                    value={scheduleDay}
                    label="Day of Month"
                    onChange={(e) => setScheduleDay(e.target.value)}
                  >
                    {Array.from(Array(28).keys()).map((day, index) => (
                      <MenuItem value={day + 1} key={index}>
                        {day + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <CustomButton label="+ Add" onClick={createScheduledMail} />
            </Grid>
            {showSpinner ? (
              <div></div>
            ) : (
              tableData && (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <ThemeProvider theme={tableTheme}>
                    <div ref={tableRef}>
                      {isBrowser ? (
                        <MUIDataTable
                          key={`table-${displayWidth}`}
                          title={""}
                          data={tableData}
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
                </Grid>
              )
            )}
          </Grid>
        </Card>
      </Grid>
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default ScheduleMails;
