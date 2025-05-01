import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Card from "@mui/material/Card";
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Typography from "@mui/material/Typography";
import React, { useEffect, useState, useRef } from "react";
import CustomButton from "../../component/common/Button";
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector, useDispatch } from "react-redux";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import PeriodicalTasks from "../../../../redux/actions/api/Progress/PeriodicalTasks";
import CumulativeTasksAPI from "../../../../redux/actions/api/Progress/CumulativeTasks";
import LightTooltip from '../../component/common/Tooltip';
import { translate } from "../../../../config/localisation";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import InfoIcon from '@mui/icons-material/Info';
import { Bar } from 'react-chartjs-2';
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import Spinner from "../../component/common/Spinner";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { addDays, isSameDay, format, minutesToSeconds, hoursToSeconds, secondsToHours } from 'date-fns/esm';
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import colorsData from '../../../../utils/Colors_JSON/Colors_JSON';
import axios from "axios";
import html2canvas from 'html2canvas';
import  { modifiedStaticRanges } from "../../../../utils/Date_Range/getDateRangeFormat";
import { MenuProps } from "../../../../utils/utils";
import { jsPDF } from "jspdf";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
ChartJS.register(CategoryScale);

const footer = (tooltipItems) => {
  let sum = 0;
  tooltipItems.forEach(function (tooltipItem) {
    sum += tooltipItem.parsed.y;
  });
  return 'Sum: ' + sum;
};

const labelChart = function(context) {
  let label = context.dataset.label || '';
  let dataVal = context.parsed.y;

  if(dataVal && dataVal !== 0 && dataVal !== null){
    label += " : " + new Intl.NumberFormat('en-US').format(dataVal);
  } else {
     label = ""
  }
  return label;
};

const getWidth = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth;
  }
};

const width = getWidth();

const categoryPercentage = width < 600 ? 0.2 : width < 900 ? 0.5 : 0.6;
const barPercentage = width < 600 ? 0.3 : width < 900 ? 0.6 : 0.7;
const chartHeight = width < 600 ? "300px" : width < 900 ? "350px" : "400px";
const rotationAngle = width < 600 ? 90 : 45; 
const fontSize = width < 600 ? 10 : 12;
const chartWidth = width < 600 ? "1200px" : "100%"; 

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "x",
  scales: {
    x: {
      categoryPercentage,
      barPercentage,
      ticks: {
        maxRotation: rotationAngle,
        minRotation: rotationAngle,
        autoSkip: false,
      },
      grid: {
        display: false,
      },
      display: true,
      title: {
        display: true,
        text: 'Language',
        color: 'black',
        font: {
          family: 'Roboto',
          size: fontSize,
          weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
    },
    y: {
      beginAtZero: true,
      stacked: true,
      display: true,
      title: {
        display: true,
        text: '# Annotations Completed ',
        color: '#black',
        font: {
          family: 'Roboto',
          size: 16,
          style: 'normal',
          weight: 'bold',
          lineHeight: 1.2,
          paddingBottom: "100px",
        },
        padding: { top: 20, left: 0, right: 0, bottom: 20 }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
    },
    tooltip: {
      callbacks: {
        footer: footer,
        label: labelChart
      },

    }
  },
};

const TooltipData = [{ name: "Progress chart based on one data selection" }, { name: "Compares progress of two different data selections" }]
const ProgressTypedata = [{ title: "Complete progress for annotations done till date" }, { title: "Yearly stacked progress in selected span of years" }, { title: "Monthly stacked progress in selected span of months" }, { title: "Weekly stacked progress in selected span of weeks" }]
const ChartType = [{ chartTypename: "Individual" }, { chartTypename: "Comparison" }]
const ProgressType = [{ ProgressTypename: "Cumulative" }, { ProgressTypename: "yearly" }, { ProgressTypename: "monthly" }, { ProgressTypename: "weekly" }]
const availableChartType = { Individual: "Individual", Comparison: "Comparison" }

function ProgressList() {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const ref = useRef()
  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [chartTypes, setChartTypes] = useState("Individual")
  const [baseperiod, setBaseperiod] = useState("Cumulative")
  const [metaInfo, setMetaInfo] = useState(false);
  const [showBarChar, setShowBarChar] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const [showPickers, setShowPickers] = useState(false);
  const [comparisonperiod, setComparisonperiod] = useState("monthly");
  const [monthvalue, setmonthvalue] = useState([])
  const [weekvalue, setweekvalue] = useState([])
  const [loading, setLoading] = useState(false);
  const [yearvalue, setyearvalue] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [SVGChartData, setSVGChartData] = useState([]);
  const [radiobutton, setRadiobutton] = useState("Annotation");
  const [baseperiodDatepicker, setBaseperiodDatepicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [comparisonperiodDatepicker, setComparisonperiodDatepicker] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection'
    }
  ]);
  const [options, setOptions] = useState(defaultOptions);
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  
  const [CumulativeTasksData, setCumulativeTasksData] = useState([]);
  const [PeriodicalTasksData, setPeriodicalTasksData] = useState([]);
  const [SecondaryPeriodicalTasksData, setSecondaryPeriodicalTasksData] = useState([]);

  useEffect(() => {
    if (PeriodicalTasksData.length > 0) {
      if (PeriodicalTasksData[0].month_number > 0) {
        setmonthvalue(PeriodicalTasksData[0])
      }
      else if (PeriodicalTasksData[0].week_number > 0) {
        setweekvalue(PeriodicalTasksData[0])
      }
      else if (PeriodicalTasksData[0].year_number > 0) {
        setyearvalue(PeriodicalTasksData[0])
      }
    }
  }, [PeriodicalTasksData])

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
    const typesObj = new GetProjectDomainsAPI();
    dispatch(APITransport(typesObj));
  }, []);

  const getCumulativeTasksData = async (payload, OrgId) => {
    setLoading(true);
    const cumulativeTasksAPIObj = new CumulativeTasksAPI(payload, OrgId, metaInfo);
    await axios.post(cumulativeTasksAPIObj.apiEndPoint(), cumulativeTasksAPIObj.getBody(), cumulativeTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setCumulativeTasksData(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      })
  }

  const getPeriodicalTasksData = async (payload, OrgId) => {
    setLoading(true);
    const periodicalTasksAPIObj = new PeriodicalTasks(payload, OrgId, metaInfo);
    await axios.post(periodicalTasksAPIObj.apiEndPoint(), periodicalTasksAPIObj.getBody(), periodicalTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setPeriodicalTasksData(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      })
  }

  const getSecondaryPeriodicalTasksData = async (payload, OrgId) => {
    setLoading(true);
    const periodicalTasksAPIObj = new PeriodicalTasks(payload, OrgId, metaInfo);
    await axios.post(periodicalTasksAPIObj.apiEndPoint(), periodicalTasksAPIObj.getBody(), periodicalTasksAPIObj.getHeaders())
      .then(response => {
        if (response.statusText === "OK") {
          setSecondaryPeriodicalTasksData(response.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
      })
  }

  const handleChartType = (e) => {
    setChartTypes(e.target.value)
  }
  const handleSubmit = async () => {
    setShowBarChar(false);
    if(metaInfo) {
      if(!selectedType.includes("Audio") && !selectedType.includes("Acoustic")) {
        setOptions({
          ...defaultOptions,
          scales: {
            ...defaultOptions.scales,
            y: {
              ...defaultOptions.scales.y,
              title: {
                ...defaultOptions.scales.y.title,
                text: '# Words Completed',
              },
            }
          },
        });
      }
      else {
        setOptions({
          ...defaultOptions,
          scales: {
            ...defaultOptions.scales,
            y: {
              ...defaultOptions.scales.y,
              title: {
                ...defaultOptions.scales.y.title,
                text: '# Audio Duration Transcribed',
              },
              ticks: {
                ...defaultOptions.scales.y.ticks,
                callback: function(value) {
                  if(Math.floor(value) === value)
                    return secondsToHours(value) + new Date(value * 1000).toISOString().substring(13, 19);
                }
              }
            }
          },
          plugins: {
            ...defaultOptions.plugins,
            tooltip: {
              ...defaultOptions.plugins.tooltip,
              callbacks: {
                ...defaultOptions.plugins.tooltip.callbacks,
                label: function(context) {
                  let label = context.dataset.label || '';
                  return label + " : " + context.dataset.time[context.dataIndex];
                },
                footer: (tooltipItems) => {
                  let sum = 0;
                  tooltipItems.forEach(function (tooltipItem) {
                    sum += tooltipItem.parsed.y;
                  });
                  return 'Sum: ' + secondsToHours(sum) + new Date(sum * 1000).toISOString().substring(13, 19);
                }
              }
            }
          }
      });
      }
    } else {
      setOptions({...defaultOptions});
    }

    const OrgId = userDetails.organization.id
    setShowPicker(false);
    setShowPickers(false);
    // setLoading(true);

    const Cumulativedata = {
      project_type: selectedType,
      ...(radiobutton==="Review" && {reviewer_reports:true}),
      ...(radiobutton==="Supercheck" && {supercheck_reports:true})

    };
    const individualPeriodicaldata = {
      project_type: selectedType,
      periodical_type: baseperiod,
      start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
      end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
      ...(radiobutton==="Review" && {reviewer_reports:true}),
      ...(radiobutton==="Supercheck" && {supercheck_reports:true})
    };

    if (chartTypes === availableChartType.Individual) {

      if (baseperiod === "Cumulative") {
        await getCumulativeTasksData(Cumulativedata, OrgId);
        // const progressObj = new CumulativeTasksAPI(Cumulativedata, OrgId);
        // dispatch(APITransport(progressObj))
      }
      else {
        await getPeriodicalTasksData(individualPeriodicaldata, OrgId)
        // const progressObj = new PeriodicalTasks(individualPeriodicaldata, OrgId);
        // dispatch(APITransport(progressObj));
      }


    }
    else {

      if (comparisonperiod === "Cumulative" && baseperiod === "Cumulative") {

        await getCumulativeTasksData(Cumulativedata, OrgId);

      } else if (comparisonperiod !== "Cumulative" && baseperiod === "Cumulative") {

        const Periodicaldata = {
          project_type: selectedType,
          periodical_type: comparisonperiod,
          start_date: format(comparisonperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(comparisonperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton==="Review" && {reviewer_reports:true}),
          ...(radiobutton==="Supercheck" && {supercheck_reports:true})
        };
        await getPeriodicalTasksData(Periodicaldata, OrgId);
        await getCumulativeTasksData(Cumulativedata, OrgId);

      } else if (comparisonperiod === "Cumulative" && baseperiod !== "Cumulative") {
        const individualPeriodicaldata = {
          project_type: selectedType,
          periodical_type: baseperiod,
          start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton==="Review" && {reviewer_reports:true}),
          ...(radiobutton==="Supercheck" && {supercheck_reports:true})
        };
        await getPeriodicalTasksData(individualPeriodicaldata, OrgId);
        await getCumulativeTasksData(Cumulativedata, OrgId);
      } else {
        const basePeriodicalPayload = {
          project_type: selectedType,
          periodical_type: baseperiod,
          start_date: format(baseperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(baseperiodDatepicker[0].endDate, 'yyyy-MM-dd'), 
          ...(radiobutton==="Review" && {reviewer_reports:true})  ,
          ...(radiobutton==="Supercheck" && {supercheck_reports:true})  
        };
        const comparisonPeriodicalPayload = {
          project_type: selectedType,
          periodical_type: comparisonperiod,
          start_date: format(comparisonperiodDatepicker[0].startDate, 'yyyy-MM-dd'),
          end_date: format(comparisonperiodDatepicker[0].endDate, 'yyyy-MM-dd'),
          ...(radiobutton==="Review" && {reviewer_reports:true}),
          ...(radiobutton==="Supercheck" && {supercheck_reports:true})
        };

        await getPeriodicalTasksData(basePeriodicalPayload, OrgId);
        await getSecondaryPeriodicalTasksData(comparisonPeriodicalPayload, OrgId);

      }
    }
    await handleSwitchBarChartShow();

  }

  const handleSwitchBarChartShow = async () => {
    setShowBarChar(true);
  }

  const handleProgressType = (e) => {
    setBaseperiod(e.target.value)

  }
  const handledatecomparisionprogress = () => {
    setShowPickers(!showPickers)
  }

  const handleChangeReports = (e) => {
    setRadiobutton(e.target.value)
  }
  const handleDateRangePicker = (item) => {
    setComparisonperiodDatepicker([item.selection])
  }
  const handleComparisonProgressType = (e) => {
    setComparisonperiod(e.target.value)

  }

  const handleCloseDatepicker = (e) => {
    setShowPicker(!showPicker)
  }

  const keyPress = (e) => {
    if (e.code === "Escape" && setShowPicker(false)) {
      handleCloseDatepicker();
    }
    if (e.code === "Escape" && setShowPickers(false)) {
      handledatecomparisionprogress();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    }
  }, [keyPress]);

  const formatDateRangeChartLabel = (dataRangeStr) => {
    let dateRangeArr = dataRangeStr.split("To");
    let newDateRangeArr = [];
    // newDateRangeArr.join
    dateRangeArr?.map((el,i)=> {
      let trimmedCurrentDate = el.trim();
      newDateRangeArr.push(trimmedCurrentDate.split("-")[2]+"/"+ trimmedCurrentDate.split("-")[1] +"/"+ trimmedCurrentDate.split("-")[0]);
    })

    return newDateRangeArr.join(" To ");
  }


  useEffect(() => {
    const checkIfClickedOutside = e => {

      if (showPicker && ref.current && !ref.current.contains(e.target)) {
        setShowPicker(false)
      }
      if (showPickers && ref.current && !ref.current.contains(e.target)) {
        setShowPickers(false)
      }

    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {

      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [showPicker, showPickers])

  useEffect(() => {
    const getCumulativeMetaInfo = (e) => {
      let val;
      if(metaInfo) {
        if(selectedType.includes("Audio") || selectedType.includes("Acoustic")) {
          let [hours, minutes, seconds] = e.cumulative_aud_duration.split(":");
          val = hoursToSeconds(hours) + minutesToSeconds(minutes) + parseInt(seconds);
        } else {
          val = e.cumulative_word_count;
        }
      }
      else val = e.cumulative_tasks_count;
      return val;
    };

    const getPeriodicalMetaInfo = (e) => {
      let val;
      if(metaInfo) {
        if(selectedType.includes("Audio") || selectedType.includes("Acoustic")) {
          let [hours, minutes, seconds] = e.periodical_aud_duration.split(":");
          val = hoursToSeconds(hours) + minutesToSeconds(minutes) + parseInt(seconds);
        } else {
          val = e.periodical_word_count;
        }
      }
      else val = e.periodical_tasks_count;
      return val;
    };
    
    let chData;
    let svgChData;
    if (chartTypes === availableChartType.Individual) {
      if (baseperiod === "Cumulative") {
        svgChData = CumulativeTasksData.map((el, i) => {
          return {
            name: el.language,
            value: getCumulativeMetaInfo(el),
          }
        })
        const labels = CumulativeTasksData && CumulativeTasksData.map((el, i) => el.language)
        chData = {
          labels,
          datasets: [
            {
              label: baseperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 0",
              borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
              borderColor: "white",
              backgroundColor: colorsData.orange[0].color,
              barThickness: 25,
            },
          ],

        };
      } else {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        svgChData = PeriodicalTasksData.map((el, i) => {
          return {
            name: el.date_range,
            value: el.data,
          }
        })
        // debugger
        chData = {
          labels,
          datasets:
            PeriodicalTasksData?.map((el, i) => {
              return {
                label: formatDateRangeChartLabel(el.date_range),
                data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
                time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
                stack: "stack 0",
                borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
                borderColor: "white",
                backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
                barThickness: 20,
              }
            }),

        };
      }

    } else {
     
      if (baseperiod !== "Cumulative" && comparisonperiod !== "Cumulative" && baseperiod === comparisonperiod) {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });

        const SecondaryPeriodicalTasksDataset = SecondaryPeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && selectedType.includes("Audio")) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(SecondaryPeriodicalTasksDataset),
        };
      } else if (baseperiod !== "Cumulative" && comparisonperiod !== "Cumulative" && baseperiod != comparisonperiod) {
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });

        const SecondaryPeriodicalTasksDataset = SecondaryPeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(SecondaryPeriodicalTasksDataset),
        };
      
      } else if(baseperiod !== "Cumulative" && comparisonperiod === "Cumulative"){
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 0",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.orange[i] ? colorsData.orange[i].color : 'hsla(33, 100%, 48%, 0.05)',
            barThickness: 20,
          }
        });

        const cumulativeTasksDataset = {
          label: comparisonperiod,
          data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
          time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
          stack: "stack 1",
          borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
          borderColor: "white",
          backgroundColor: colorsData.green[0].color,
          barThickness: 20,
        }
        // CumulativeTasksData.map((e) => (e.cumulative_tasks_count));

        chData = {
          labels,
          datasets: PeriodicalTasksDataset.concat(cumulativeTasksDataset),
        };

      } else if(baseperiod === "Cumulative" && comparisonperiod !== "Cumulative"){
        const labels = PeriodicalTasksData[0]?.data && PeriodicalTasksData[0]?.data.map((el, i) => el.language);
        
        const cumulativeTasksDataset = [{
          label: baseperiod,
          data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
          time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
          stack: "stack 0",
          borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
          borderColor: "white",
          backgroundColor: colorsData.orange[0].color,
          barThickness: 20,
        }]

        const PeriodicalTasksDataset = PeriodicalTasksData?.map((el, i) => {
          return {
            label: formatDateRangeChartLabel(el.date_range),
            data: el.data?.map((e) => getPeriodicalMetaInfo(e)),
            time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? el.data?.map((el, i) => el.periodical_aud_duration) : null,
            stack: "stack 1",
            borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
            borderColor: "white",
            backgroundColor: colorsData.green[i] ? colorsData.green[i].color : 'hsla(120, 128%, 25%, 0.05)',
            barThickness: 20,
          }
        });
        chData = {
          labels,
          datasets: cumulativeTasksDataset.concat(PeriodicalTasksDataset),
        };
      } else {

        //const labels = baseperiod === "Cumulative" ? CumulativeTasksData.map((e) => (e.language)) : baseperiod === "weekly" ? weekvalue?.data?.map((e) => e.language) : baseperiod === "monthly" ? monthvalue?.data?.map((e) => e.language) : yearvalue?.data?.map((e) => e.language)
        const labels = CumulativeTasksData && CumulativeTasksData.map((el, i) => el.language)
        // const labels = progressTypes === "Cumulative" ? CumulativeTasksData.map((e) => (e.language)) : progressTypes === "weekly" ? weekvalue?.data?.map((e) => e.language) : progressTypes === "monthly" ? monthvalue?.data?.map((e) => e.language) : yearvalue?.data?.map((e) => e.language)

        chData = {
          labels,
          datasets: [

            {
              label: baseperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 0",
              borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
              borderColor: "white",
              backgroundColor: colorsData.orange[0].color,
              barThickness: 20,
            },
            {
            
              label: comparisonperiod,
              data: CumulativeTasksData.map((e) => getCumulativeMetaInfo(e)),
              time: (metaInfo && (selectedType.includes("Audio") || selectedType.includes("Acoustic"))) ? CumulativeTasksData.map((el, i) => el.cumulative_aud_duration) : null,
              stack: "stack 1",
              borderWidth: {top: 2, left: 0, right: 0, bottom: 0},
              borderColor: "white",
              backgroundColor: colorsData.green[0].color,
              barThickness: 20,
            },

          ],

        };

      }

    }
    setChartData(chData);
    setSVGChartData(svgChData);
  }, [PeriodicalTasksData, SecondaryPeriodicalTasksData, CumulativeTasksData])


  var now = new Date()
  var currentYear = now.getFullYear()



  const ToolTipdata1 = TooltipData.map((el, i) => el.name);

  const downloadReportClick = (type) => {
    const srcElement = document.getElementById('chart-container');
    html2canvas(srcElement)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        if (type === "img") {
          let anchorEle = document.createElement("a");
          anchorEle.href = imgData;
          anchorEle.download = "Image.png";
          anchorEle.click();
        } else if (type === "pdf") {
          const pdf = new jsPDF();
          pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150);
          pdf.save("download.pdf");
        }
      })
  }

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Card
        sx={{
          width: "100%",
          minHeight: 500,
          padding: 3
        }}
      >
        <Box >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
             <Grid
          container
          direction="row"
          spacing={0}
          sx={{ mb:1, ml: 1 }}
        >

          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}  >
            <Typography gutterBottom component="div" sx={{ marginTop: "10px", fontSize: "16px", }}>
              Select Report Type :
            </Typography>
          </Grid >
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}  >
            <FormControl >

              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{ marginTop: "5px" }}
                value={radiobutton}
                onChange={handleChangeReports}

              >
                <FormControlLabel value="Annotation" control={<Radio />} label="Annotation" />
                <FormControlLabel value="Review" control={<Radio />} label="Review" />
                <FormControlLabel value="Supercheck" control={<Radio />} label="Supercheck" />
              </RadioGroup>
            </FormControl>
          </Grid >
        </Grid>
        <Grid  container   mb={4} >
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}  sx={{display:"flex",ml:1}} >
            <Typography gutterBottom component="div" sx={{fontSize: "16px",mt:1, }}>
              Meta-info based stats:
            </Typography>
            <Checkbox
            sx={{ml:3}}
              onChange={(e) => setMetaInfo(e.target.checked)} 
              checked={metaInfo}
            />
          </Grid >
          </Grid>
            <Grid container columnSpacing={3} rowSpacing={2}  mb={1}>

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth size="small" >
                  <InputLabel id="Graph-Type-label" sx={{ fontSize: "16px" }}>
                    Analytics Type {" "}
                    {
                      <LightTooltip
                        arrow
                        placement="top"
                        title={translate("tooltip.AnalyticsType")}>
                        <InfoIcon
                          fontSize="medium"
                        />
                      </LightTooltip>
                    }
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Analytics Type"
                    value={chartTypes}
                    onChange={handleChartType}
                  >

                    {ChartType.map((item, index) => (
                      <LightTooltip title={TooltipData[index].name} key={index} value={item.chartTypename} placement="left" arrow>
                        <MenuItem value={item.chartTypename}>{item.chartTypename}</MenuItem>
                      </LightTooltip>
                    ))}

                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px" }}>
                    Project Type {" "}
                    {
                      <LightTooltip
                        arrow
                        placement="top"
                        title={translate("tooltip.ProjectType")}>
                        <InfoIcon
                          fontSize="medium"
                        />
                      </LightTooltip>
                    }
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedType}
                    label="Project Type"
                    sx={{padding:"1px"}}
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

            </Grid>

          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid container columnSpacing={2} rowSpacing={2} mt={1} mb={1}>
              {(chartTypes === availableChartType.Individual || chartTypes === availableChartType.Comparison) && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label" sx={{ fontSize: "16px", color: "rgba(243, 156, 18 )" }}>
                    Base period {" "}
                    {
                      <LightTooltip
                        arrow
                        placement="top"
                        title={translate("tooltip.Baseperiod")}>
                        <InfoIcon
                         sx={{color:"rgba(0, 0, 0, 0.6)"}}
                          fontSize="medium"
                        />
                      </LightTooltip>
                    }
                  </InputLabel>
                  <Select
                    labelId="project-type-label"
                    id="project-type-select"
                    label="Base period"
                    value={baseperiod}
                    onChange={handleProgressType}
                  >
                   {ProgressType.map((item, index) => (

                      <LightTooltip title={ProgressTypedata[index].title} value={item.ProgressTypename} key={index} placement="left" arrow >
                        <MenuItem value={item.ProgressTypename} key={index} sx={{ textTransform: "capitalize"}}>{item.ProgressTypename}</MenuItem>
                      </LightTooltip>
                    ))}
                  </Select>
                </FormControl>
              </Grid>}
              {!(baseperiod === "Cumulative" || chartTypes === "") && <Grid item xs={2} sm={2} md={2} lg={2} xl={2}  >
                <Button
                  endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handleCloseDatepicker}
                  sx={{ backgroundColor: "rgba(243, 156, 18)", "&:hover": { backgroundColor: "rgba(243, 156, 18 )", }, marginLeft: "20px" }}

                >
                 Pick Dates
                </Button>
              </Grid>}
              {chartTypes === availableChartType.Comparison && <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl   fullWidth size="small"  >
                  <InputLabel  id="project-type-label" sx={{ fontSize: "16px", color: "rgba(35, 155, 86 )" }}  >
                    Comparison Period {" "}
                    {
                      <LightTooltip
                        arrow
                        placement="top"
                        title={translate("tooltip.ComparisonPeriod")}>
                        <InfoIcon
                        sx={{color:"rgba(0, 0, 0, 0.6)"}}
                          fontSize="medium"
                        />
                      </LightTooltip>
                    }                   
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Comparison Period"
                    value={comparisonperiod}
                    onChange={handleComparisonProgressType}
                  >
                    {ProgressType.map((item, index) => (
                      <LightTooltip title={ProgressTypedata[index].title} value={item.ProgressTypename} key={index} placement="right" arrow >
                        <MenuItem value={item.ProgressTypename} key={index} sx={{ textTransform: "capitalize" }}>{item.ProgressTypename}</MenuItem>
                      </LightTooltip>

                    ))}
                  </Select>
                </FormControl>
              </Grid>}
              {!(comparisonperiod === "Cumulative" || chartTypes === "" || chartTypes === availableChartType.Individual) && <Grid item xs={2} sm={2} md={2} lg={2} xl={2} >
                <Button
                  endIcon={showPickers ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                  variant="contained"
                  color="primary"
                  onClick={handledatecomparisionprogress}
                  sx={{ backgroundColor: "rgba(35, 155, 86 )", "&:hover": { backgroundColor: "rgba(35, 155, 86 )", }, marginLeft: "20px" }}
                >
                  Pick Dates
                </Button>
              </Grid>}
              <Grid container sx={{marginLeft:"17px"}}>
            <CustomButton label="Submit" sx={{ width:{xs:"100%", sm:"200px"}, mt: 3 }} onClick={handleSubmit}
              disabled={(baseperiod || comparisonperiod) ? false : true} />
            </Grid>
              {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }} ref={ref}>
                <Card sx={{ overflowX: "scroll" }}>
                  <DateRangePicker
                    onChange={item => setBaseperiodDatepicker([item.selection])}
                    weekStartsOn={1}
                    inputRanges={[]}
                    staticRanges={[
                      ...modifiedStaticRanges,
                      {
                        label: "This Year",
                        range: () => ({
                          startDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                      {
                        label: "Last Year",
                        range: () => ({
                          startDate: new Date(Date.parse(currentYear - 1, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                          endDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                    showMonthAndYearPickers={true}
                    months={2}
                    ranges={baseperiodDatepicker}
                    direction="horizontal"
                    preventSnapRefocus={true}
                  />
                </Card>
              </Box>
              }
              {showPickers && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }} ref={ref}>
                <Card sx={{ overflowX: "scroll" }}>
                  <DateRangePicker
                    onChange={handleDateRangePicker} item
                    weekStartsOn={1}
                    inputRanges={[]}
                    staticRanges={[
                      ...modifiedStaticRanges,
                      {
                        label: "This Year",
                        range: () => ({
                          startDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                      {
                        label: "Last Year",
                        range: () => ({
                          startDate: new Date(Date.parse(currentYear - 1, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
                          endDate: new Date(Date.parse(currentYear, 'yyyy-MM-ddTHH:mm:ss.SSSZ') - 86400000),
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
                    showMonthAndYearPickers={true}
                    months={2}
                    ranges={comparisonperiodDatepicker}
                    direction="horizontal"
                    preventSnapRefocus={true}
                  />
                </Card>
              </Box>}
            </Grid>         
          </Grid>
          {showBarChar &&
            <>
              <Grid container justifyContent="end" sx={{mt:2}}>
                <Button onClick={() => downloadReportClick("pdf")}>
                  Download Report As PDF
                </Button>
                <Button onClick={() => downloadReportClick("img")}>
                  Download Report As Image
                </Button>
              </Grid>
              <div style={{
                  overflow:"auto",
                  width:"100%",
                  padding:"0.2rem"
                }}>
              <div id="chart-container"
                style={{
                  width: chartWidth,
                  height: chartHeight,
                }}
              >
                <Bar options={options} data={chartData} />
              </div>
              </div>
            </>
          }
        </Box>
      </Card>
    </ThemeProvider>
  )
}
export default ProgressList;
