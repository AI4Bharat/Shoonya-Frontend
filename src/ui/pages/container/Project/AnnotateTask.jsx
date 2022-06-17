// AnnotateTask

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, Card, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import CustomButton from "../../component/common/Button";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
// import GetTaskPredictionAPI from "../../../../redux/actions/api/Tasks/GetTaskPrediction";
import { translate } from "../../../../config/localisation";
import GetTaskDetailsAPI from "../../../../redux/actions/api/Tasks/GetTaskDetails";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AnnotateTask = () => {
  const urlParams = useParams();
  const dispatch = useDispatch();
  const taskDetails = useSelector(state => state.getTaskDetails.data);

  const [translatedText, setTranslatedText] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const getTaskDetails = () => {
    const taskListObj = new GetTaskDetailsAPI(urlParams.taskId);
    dispatch(APITransport(taskListObj));
  }


  useEffect(() => {
    getTaskDetails();
  }, [])

  useEffect(()=>{
    setTranslatedText(taskDetails && taskDetails.data ? taskDetails.data.machine_translation : "");
  },[taskDetails])

  console.log("taskDetails", taskDetails);

  return (
    <Card
      elevation={2}
      sx={{
        minHeight: 600,
        padding: 5,
        mb : 5
      }}
    >
      <Typography variant="body1" sx={{mb : 5}}><b>Annotate Task - #{urlParams && urlParams.taskId}</b></Typography>
      <CustomButton
        label={translate("button.notes")}
        onClick={()=>setShowNotes(!showNotes)}
        endIcon={showNotes ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
        sx={{
          borderRadius: 2,
          mb: 2
        }}
      />
      {showNotes && <Grid
        container
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          mt: 2,
          mb: 2,
          alignItems: "center",
        }}
      >
        <Alert severity="warning" sx={{width : "100%"}}>Please do not add notes if you are going to skip the task!</Alert>
        <TextField
            // value={translatedText}
            // onChange={(e)=>setTranslatedText(e.target.value)}
            placeholder="Place your remarks here..."
            multiline
            rows={3}
            sx={{ border: "none", width : "100%", mt:4 }}
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
        <Typography variant="body2">Task : #<b>{urlParams && urlParams.taskId}</b></Typography>
        <Typography variant="body2">Task Status : <b>{taskDetails && taskDetails.task_status}</b></Typography>
        <Grid
          direction={"row"}
          justifyContent={"space-around"}
          columnSpacing={5}
          sx={{
          }}
        >
          <CustomButton label={translate("button.draft")} buttonVariant="outlined" sx={{ borderRadius: 2, mr: 2 }} />
          <CustomButton label={translate("button.next")} endIcon={<NavigateNextIcon />} buttonVariant="outlined" sx={{ borderRadius: 2 }} />
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
          sx={{ minHeight: 250, mt: 3, p: 2, backgroundColor:"#f5f5f5" }}
        >
          <Typography variant="body1">Source sentence</Typography>
          <Typography variant="body2" sx={{ mt: 4 }}>{taskDetails && taskDetails.data && taskDetails.data.input_text}</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          lg={3.5}
          xl={3.5}
          sm={12}
          sx={{ minHeight: 250, mt: 3, p: 2, backgroundColor:"#f5f5f5" }}
        >
          <Typography variant="body1">{taskDetails && taskDetails.data && taskDetails.data.output_language} translation</Typography>
          <TextField
            value={translatedText}
            onChange={(e)=>setTranslatedText(e.target.value)}
            multiline
            rows={10}
            sx={{ border: "none", width : "100%", mt:4 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={3.5}
          lg={3.5}
          xl={3.5}
          sm={12}
          sx={{ minHeight: 250, mt: 3, p: 2, backgroundColor:"#f5f5f5" }}
        >
          <Typography variant="body1">Machine translation</Typography>
          <Typography variant="body2" sx={{ mt: 4 }}>{taskDetails && taskDetails.data && taskDetails.data.machine_translation}</Typography>
        </Grid>

      </Grid>
      <Grid
        direction={"row"}
        justifyContent={"space-around"}
        columnSpacing={5}
        sx={{
          mt:3,
          mb:3,
          textAlign : "end"
        }}
      >
        <CustomButton label={translate("button.skip")} buttonVariant="outlined" sx={{ borderRadius: 2, mr: 2 }} />
        <CustomButton label={translate("button.submit")} sx={{ borderRadius: 2 }} />
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
          <Typography variant="body2" sx={{ mt: 4 }}>{taskDetails && taskDetails.data && taskDetails.data.context}</Typography>
      </Grid>
    </Card>
  )
}

export default AnnotateTask;