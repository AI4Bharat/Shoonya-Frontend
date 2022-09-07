import {
  Button,
  Grid,
  ThemeProvider,
  Typography,
  Select,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import PeriodicalTasks from "../../../../redux/actions/api/Progress/PeriodicalTasks";
import CumulativeTasksAPI from "../../../../redux/actions/api/Progress/CumulativeTasks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import CustomizedSnackbars from "../common/Snackbar";
// import Spinner from "../common/Spinner";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { isSameDay, format } from 'date-fns/esm';
import moment from "moment";
import {
  DateRangePicker,
  defaultStaticRanges,
  createStaticRanges
} from "react-date-range";
import { useTheme } from "@material-ui/core/styles";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
// import { BarChart, Bar, XAxis, YAxis, 
//   CartesianGrid,Tooltip,Legend,ResponsiveContainer } from 'recharts';
import { addDays } from 'date-fns';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      // text: 'Chart.js Bar Chart',
    },
  },
};

const GraphType = [{ graphTypename: "Individual" }, { graphTypename: "Comparison" }]
const ProgressType = [ {ProgressTypename:"Cumulative"}, {ProgressTypename:"Yearly"} ,  {ProgressTypename:"Monthly"}, {ProgressTypename:"Weekly"}]
const avilableGraphType = {
  Individual:"Individual",
  Comparison:"Comparison"
}
function ProgressList() {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [graphTypes, setGraphTypes] = useState("")
  const [progressTypes, setProgressTypes] = useState("")
  const[showBarChar,setShowBarChar]= useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const [comparisonProgressTypes, setComparisonProgressTypes] = useState("");

  const theme = useTheme();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const CumulativeTasksData = useSelector((state) => state?.getCumulativeTasks?.data)
  const PeriodicalTaskssData = useSelector((state) => state?.getCumulativeTasks?.data)
  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
      types?.length && setSelectedType(types[0]);
    }
  }, [ProjectTypes]);

  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    dispatch(APITransport(typesObj));
  }, []);

  const handleGraphType = (e) => {
    setGraphTypes(e.target.value)
    console.log(e.target.value,"e.target.value")
  }
  const handleSubmit = () => {
    const OrgId = userDetails.organization.id
    setShowPicker(false);
    
      const Cumulativedata = {
        project_type: selectedType,  
    };
   
    if(graphTypes===avilableGraphType.Individual || graphTypes===avilableGraphType.Comparison){
      const Periodicaldata = {
        project_type: selectedType,
        periodical_type:progressTypes,
        start_date: format(state[0].startDate, 'yyyy-MM-dd'),
        end_date: format(state[0].endDate, 'yyyy-MM-dd'),
    };
      if(progressTypes === "Cumulative" ){
        const progressObj = new CumulativeTasksAPI(Cumulativedata,OrgId);
        dispatch(APITransport(progressObj))
    }
     else {const progressObj = new PeriodicalTasks(Periodicaldata,OrgId);
      dispatch(APITransport(progressObj));
      }
  

    }
    if(graphTypes===avilableGraphType.Comparison){
      const Periodicaldata = {
        project_type: selectedType,
        periodical_type:comparisonProgressTypes,
        start_date: format(state[0].startDate, 'yyyy-MM-dd'),
        end_date: format(state[0].endDate, 'yyyy-MM-dd'),
    };
     

    if(comparisonProgressTypes !== "Cumulative" ){
      const progressObj = new PeriodicalTasks(Periodicaldata,OrgId);
      dispatch(APITransport(progressObj));
    }
    }
    
    setShowBarChar(true)
    setGraphTypes(" ")
    setProgressTypes(" ")
    setComparisonProgressTypes(" ")
  }

  const handleProgressType = (e)=>{
    setProgressTypes(e.target.value)
  }
  const handleComparisonProgressType = (e)=>{
    setComparisonProgressTypes(e.target.value)
  }


const labels = CumulativeTasksData && CumulativeTasksData.map((el, i) =>  el.language)
let data;
console.log(graphTypes,"print graph type")

if(graphTypes === avilableGraphType.Individual){

  console.log("Individual")
  
    data = {
    labels,
    datasets: [
      {
        
        label: 'Individual',
        data: CumulativeTasksData.map((e) => (e.cumulative_tasks_count)),
        backgroundColor: 'rgba(26, 161, 234)',
      },
    ],
    
  };}else{
    console.log("Comparison")
     data = {
      labels,
      datasets: [
        {
          
          label: 'Individual',
          data: CumulativeTasksData.map((e) => (e.cumulative_tasks_count)),
          backgroundColor: 'rgba(26, 161, 234)',
        },
        {
          label: 'Comparison',
           data: PeriodicalTaskssData.map((e) => (e.periodical_tasks_count)),
          backgroundColor: 'rgba(216, 208, 27 )',
        },
      ],
      
    };
  }

console.log(data,"data")
  
  return (
    <ThemeProvider theme={themeDefault}>
    <Card
      sx={{
        width: "100%",
        minHeight: 500,
        padding: 5
      }}
    >

      <Box >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container columnSpacing={3} rowSpacing={2} mt={1} mb={1}>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth size="small" >
                <InputLabel id="Graph-Type-label" sx={{ fontSize: "16px"}}>
                  Select Graph Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Graph Type"
                  onChange={handleGraphType}
                >
                  {GraphType.map((item, index) => (
                    <MenuItem value={item.graphTypename} key={index}>{item.graphTypename}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px",color:"rgba(26, 161, 234)" }}>
                  Select Progress Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Progress Type"
                  onChange={handleProgressType}
                >
                  {ProgressType.map((item, index) => (
                    <MenuItem value={item.ProgressTypename} key={index}>{item.ProgressTypename}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          {graphTypes === avilableGraphType.Comparison &&  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="project-type-label" sx={{ fontSize: "16px",color:"rgba(216, 208, 27 )"}}>
                  Select Progress Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Select Progress Type"
                  onChange={handleComparisonProgressType}
                >
                  {ProgressType.map((item, index) => (
                    <MenuItem value={item.ProgressTypename} key={index}>{item.ProgressTypename}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>}
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
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
                >
                  {projectTypes.map((type, index) => (
                    <MenuItem value={type} key={index}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container  rowSpacing={2} mt={1} mb={1}>
          {progressTypes!=="Cumulative" ||  graphTypes !==" "|| graphTypes === avilableGraphType.Individual && <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                onClick={() => setShowPicker(!showPicker)}
                sx={{backgroundColor : "rgba(26, 161, 234)", "&:hover" : {backgroundColor : "rgba(26, 161, 234)",}}} 
                
              >
                Pick dates
              </Button>
            </Grid>}
            {comparisonProgressTypes!=="Cumulative"  && <Grid item xs={3} sm={3} md={3} lg={3} xl={3} >
              <Button
                endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                variant="contained"
                color="primary"
                onClick={() => setShowPicker(!showPicker)}
                sx={{backgroundColor : "rgba(216, 208, 27 )", "&:hover" : {backgroundColor : "rgba(216, 208, 27 )",}}} 
              >
                Pick dates
              </Button>
            </Grid>}
          <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
            {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
              <Card sx={{ overflowX: "scroll" }}>
                <DateRangePicker
                  onChange={item => setState([item.selection])}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={state}
                  direction="horizontal"
                  preventSnapRefocus={true}
                  calendarFocus="backwards"
                />
              </Card>
            </Box>}
            
          </Grid>
        </Grid>
        {showBarChar &&  <Bar options={options} data={data} />}
      </Box>
     </Card>
     </ThemeProvider>
  )
}
export default ProgressList;