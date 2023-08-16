import { Card, CircularProgress, Grid, ThemeProvider, Typography, Select, Box, MenuItem, InputLabel } from "@mui/material";
import themeDefault from "../../../theme/theme";
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
import CreateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/CreateScheduledMails";
import GetScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/GetScheduledMails";
import UpdateScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/UpdateScheduledMails";
import DeleteScheduledMailsAPI from "../../../../redux/actions/api/UserManagement/DeleteScheduledMails";
import Snackbar from "../../component/common/Snackbar";
import { MenuProps } from "../../../../utils/utils";
import CustomButton from "../../component/common/Button";
import FormControl from "@mui/material/FormControl";
import tableTheme from "../../../theme/tableTheme";
import MUIDataTable from "mui-datatables";
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from "../../component/common/ColumnList";
import userRole from "../../../../utils/UserMappedByRole/Roles";

const ScheduleMails = () => {
  const { id } = useParams();
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });
  const [reportLevel, setReportLevel] = useState(1);
  const [selectedProjectType, setSelectedProjectType] = useState("AudioTranscription + Editing");
  const [projectTypes, setProjectTypes] = useState([
    "AudioSegmentation",
    "AudioTranscription",
    "AudioTranscriptionEditing",
    "AudioTranscription + Editing",
    "ConversationTranslation",
    "ConversationTranslationEditing"
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
  const workspaceData = useSelector(state => state.GetWorkspace.data);
  const scheduledMails = useSelector(state => state.getScheduledMails.data);
  //const [requested, setRequested] = useState({ get: false, create: false, update: false, delete: false });

  const getWorkspaceData = () => {
    const workspaceObj = new GetWorkspaceAPI();
    dispatch(APITransport(workspaceObj));
  }

  const getScheduledMails = () => {
    const scheduledMailsObj = new GetScheduledMailsAPI(id);
    dispatch(APITransport(scheduledMailsObj));
  };

  const createScheduledMail = () => {
    if (!reportLevel || !schedule || !selectedProjectType || (reportLevel === 2 && workspaceId === 0)) {
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
        setSnackbarState({ open: true, message: err.status === 500 ? "Unexpected error occurred" : err.message, variant: "error" });
      });
  };

  const updateScheduledMail = (mail) => {
    const scheduledMailsObj = new UpdateScheduledMailsAPI(
      id,
      mail.id,
    );
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
        setSnackbarState({ open: true, message: err.status === 500 ? "Unexpected error occurred" : err.message, variant: "error" });
      });
  };

  const deleteScheduledMail = (mail) => {
    const scheduledMailsObj = new DeleteScheduledMailsAPI(
      id,
      mail.id,
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
          message: "Mail schedule deleted",
          variant: "success",
        });
        getScheduledMails();
      })
      .catch((err) => {
        setSnackbarState({ open: true, message: err.status === 500 ? "Unexpected error occurred" : err.message, variant: "error" });
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
      let tempSelected = [];
      Object.keys(scheduledMails[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: key,
          options: {
            filter: false,
            sort: true,
            align: "center",
          },
        });
        key !== "id" && tempSelected.push(key);
      });
      tempColumns.push({
        name: "Actions",
        label: "Actions",
        options: {
          filter: false,
          sort: true,
          align: "center",
        },
      });
      tempSelected.push("Actions");
      scheduledMails.map((mail) => {
        mail.Actions = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <CustomButton
              label={mail["Status"] === "Enabled" ? "Pause" : "Resume"}
              onClick={() => updateScheduledMail(mail)} />
            <CustomButton
              label="Delete"
              sx={{ backgroundColor: "#EC0000" }}
              onClick={() => deleteScheduledMail(mail)} />
          </Box>
        );
        return mail;
      });
      setColumns(tempColumns);
      setTableData(scheduledMails);
      setSelectedColumns(tempSelected);
    } else {
      setColumns([]);
      setTableData([]);
      setSelectedColumns([]);
    }
    setShowSpinner(false);
  }, [scheduledMails]);

  const renderToolBar = () => {
    return (
      <Box
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

  const tableOptions = {
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
                <InputLabel id="report-level-label" sx={{ fontSize: "16px" }}>Report Level</InputLabel>
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
                  {(userRole.OrganizationOwner === userDetails?.role || userRole.Admin === userDetails?.role) &&
                    <MenuItem value={1}>Organization</MenuItem>
                  }
                  <MenuItem value={2}>Workspace</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="workspace-label" sx={{ fontSize: "16px" }}>Workspace</InputLabel>
                <Select
                  style={{ zIndex: "0" }}
                  inputProps={{ "aria-label": "Without label" }}
                  MenuProps={MenuProps}
                  labelId="workspace-label"
                  id="workspace-select"
                  value={workspaceId}
                  label="Workspace"
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  disabled={reportLevel === 1 || !(workspaceData && workspaceData.length > 0)}
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
                <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
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
                <InputLabel id="schedule-label" sx={{ fontSize: "16px" }}>Schedule</InputLabel>
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
            {schedule === "Weekly" && <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="weekday-label" sx={{ fontSize: "16px" }}>Day of Week</InputLabel>
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
            </Grid>}
            {schedule === "Monthly" && <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="month-day-label" sx={{ fontSize: "16px" }}>Day of Month</InputLabel>
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
            </Grid>}
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <CustomButton
                label="+ Add"
                onClick={createScheduledMail}
              />
            </Grid>
            {showSpinner ? <div></div> : tableData && (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <ThemeProvider theme={tableTheme}>
                  <MUIDataTable
                    title={""}
                    data={tableData}
                    columns={columns.filter((col) => selectedColumns.includes(col.name))}
                    options={tableOptions}
                  />
                </ThemeProvider></Grid>)
            }
          </Grid>
        </Card>
      </Grid>
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default ScheduleMails;
