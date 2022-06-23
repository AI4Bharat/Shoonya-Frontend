// AnnotateTask

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Card, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import CustomButton from "../../component/common/Button";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { translate } from "../../../../config/localisation";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import PostAnnotationAPI from "../../../../redux/actions/api/Annotation/PostAnnotation";
//import DeleteAnnotationAPI from "../../../../redux/actions/api/Annotation/DeleteAnnotation";
//import GetTaskPredictionAPI from "../../../../redux/actions/api/Tasks/GetTaskPrediction";
import GetNextTaskAPI from "../../../../redux/actions/api/Tasks/GetNextTask";
import UpdateTaskAPI from "../../../../redux/actions/api/Tasks/UpdateTask";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CustomizedSnackbars from "../../component/common/Snackbar";

const AnnotateTask = () => {
  const urlParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const TaskDetails = useSelector(state => state.getTaskDetails.data);
  const NextTask = useSelector(state => state.getNextTask.data);
  const User = useSelector((state) => state.fetchLoggedInUserData.data);

  const [loadTime, setLoadTime] = useState(Date.now());
  const [translatedText, setTranslatedText] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  
  const [notes, setNotes] = useState("");

  const getTaskDetails = () => {
    const taskListObj = new GetTaskDetailsAPI(urlParams.taskId);
    dispatch(APITransport(taskListObj));
  }

  const getNextTask = () => {
    const getNextTaskObj = new GetNextTaskAPI(urlParams.projectId, urlParams.taskId);
    dispatch(APITransport(getNextTaskObj));
  };

  const postAnnotation = (task_status) => {
    if (TaskDetails.task_status !== "freezed") {
      const postAnnotationObj = new PostAnnotationAPI(translatedText, urlParams.taskId, User.id, loadTime, task_status, notes);
      dispatch(APITransport(postAnnotationObj));
    }
    else {
      setSnackbarInfo({
        open: true,
        variant: "error",
        message: "Task is freezed", 
      });
    }

    if (localStorage.getItem("labelAll")) {
      getNextTask();
    }
    else {
      window.location.reload();
    }
  };


  useEffect(() => {
    getTaskDetails();
    setLoadTime(Date.now());
  }, [urlParams.taskId]);
  
  useEffect(() => {
    setTranslatedText(TaskDetails && TaskDetails.data ? TaskDetails.data.machine_translation : "");
  }, [TaskDetails]);

  useEffect(() => {
    if(Object.keys(NextTask).length > 0) {
      navigate(`/projects/${urlParams.projectId}/task/${NextTask.id}`);
    }
    //TODO: if no more tasks and labelAll enabled, navigate(`/projects/${urlParams.projectId}`);
  }, [NextTask]);

  
  const onDraftTask = () => {
    postAnnotation("draft");
  };

  const onNextTask = () => {
    getNextTask();
  };
  
  const onSubmitAnnotation = () => {
    postAnnotation(TaskDetails.task_status);
  };

  const onSkipTask = () => {
    setSnackbarInfo({
      open: true,
      variant: "warning",
      message: "Notes will not be saved for skipped tasks!", 
    });
    const updateTaskObj = new UpdateTaskAPI(urlParams.taskId, {task_status: "skipped"});
    dispatch(APITransport(updateTaskObj));
    getNextTask();
  };

  return (
    <Card
      elevation={2}
      sx={{
        minHeight: 600,
        padding: 5,
        mb: 5
      }}
    >
      <Grid
        container
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          mb : 2
        }}
      >
        <Typography variant="body1"><b>Annotate Task - #{urlParams && urlParams.taskId}</b></Typography>
        <CustomButton
          label={translate("button.notes")}
          onClick={() => setShowNotes(!showNotes)}
          endIcon={showNotes ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          sx={{
            borderRadius: 2,
          }}
        />
      </Grid>

      {showNotes && <Grid
        // container
        // direction={"row"}
        // justifyContent={"space-between"}
        sx={{
          mt: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <Alert severity="warning" sx={{ width: "auto" }}>Please do not add notes if you are going to skip the task!</Alert>
        <TextField
          value={notes}
          onChange={(e)=>setNotes(e.target.value)}
          placeholder="Place your remarks here..."
          multiline
          rows={3}
          sx={{ border: "none", width: "100%", mt: 2 }}
        />
      </Grid>}
      <Divider />
      <Grid
        container
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          mt: 5,
          mb: 2,
          alignItems: "center",
        }}
      >
        {/* <Typography variant="body2">Task : #<b>{urlParams && urlParams.taskId}</b></Typography> */}
        <Typography variant="body2">Task Status : <b>{TaskDetails && TaskDetails.task_status}</b></Typography>
        <Grid
          direction={"row"}
          justifyContent={"space-around"}
          columnSpacing={5}
          sx={{
          }}
        >
          <CustomButton label={translate("button.draft")} onClick={onDraftTask} buttonVariant="outlined" sx={{ borderRadius: 2, mr: 2 }} />
          <CustomButton label={translate("button.next")} onClick={onNextTask} endIcon={<NavigateNextIcon />} sx={{ borderRadius: 2 }} />
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        direction={"row"}
        justifyContent={"space-between"}
        columnGap={1}
        sx={{ mb: 3 }}
      >
        <Grid
          item
          xs={12}
          md={3.5}
          lg={3.5}
          xl={3.5}
          sm={12}
          sx={{ minHeight: 200, mt: 3, p: 2, backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="body1">Source sentence</Typography>
          <Typography variant="body2" sx={{ mt: 4 }}>{TaskDetails && TaskDetails.data && TaskDetails.data.input_text}</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          lg={3.5}
          xl={3.5}
          sm={12}
          sx={{ minHeight: 200, mt: 3, p: 2, backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="body1">{TaskDetails && TaskDetails.data && TaskDetails.data.output_language} translation</Typography>
          <TextField
            value={translatedText}
            onChange={(e) => setTranslatedText(e.target.value)}
            multiline
            rows={6}
            sx={{ border: "none", width: "100%", mt: 4, background : "#ffffff" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          lg={3.5}
          xl={3.5}
          sm={12}
          sx={{ minHeight: 200, mt: 3, p: 2, backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="body1">Machine translation</Typography>
          <Typography variant="body2" sx={{ mt: 4 }}>{TaskDetails && TaskDetails.data && TaskDetails.data.machine_translation}</Typography>
        </Grid>

      </Grid>
      <Grid
        direction={"row"}
        justifyContent={"space-around"}
        columnSpacing={5}
        sx={{
          mt: 3,
          mb: 3,
          textAlign: "end"
        }}
      >
        <CustomButton label={translate("button.skip")} onClick={onSkipTask} buttonVariant="outlined" sx={{ borderRadius: 2, mr: 2 }} />
        <CustomButton label={translate("button.submit")} sx={{ borderRadius: 2 }} onClick={onSubmitAnnotation}/>
      </Grid>
      <Divider />
      <Grid
        container
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          mt: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="body1">Context</Typography>
        <Typography variant="body2" sx={{ mt: 4 }}>{TaskDetails && TaskDetails.data && TaskDetails.data.context}</Typography>
      </Grid>
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    </Card>
  )
}

export default AnnotateTask;