import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { ThemeProvider, Box, Button, Grid, Card  } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Spinner from "../../component/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { addMonths, parse } from 'date-fns/esm';
import { DateRangePicker } from "react-date-range";
import GetDatasetLogsAPI from "../../../../redux/actions/api/Dataset/GetDatasetLogs";
import { snakeToTitleCase } from "../../../../utils/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const DatasetLogs = (props) => {
  const { datasetId } = props;
  const dispatch = useDispatch();
  const DatasetLogs = useSelector((state) => state.getDatasetLogs.data);
  const [taskName, setTaskName] = useState("projects.tasks.export_project_in_place"); 
  const [columns, setColumns] = useState([]);
  const [datasetLogs, setDatasetLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectRange, setSelectRange] = useState([{
    startDate: addMonths(new Date(), -3),
    endDate: new Date(),
    key: "selection"
  }]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    if (DatasetLogs?.length) {
      let tempLogs = JSON.parse(JSON.stringify(DatasetLogs));
      tempLogs = tempLogs.filter((log) => {
        const date = parse(log.date, 'dd-MM-yyyy', new Date());
        return date >= selection.startDate && date <= selection.endDate;
      });
      setDatasetLogs(tempLogs);
    }
  };

  useEffect(() => {
    const apiObj = new GetDatasetLogsAPI(datasetId, taskName);
    dispatch(APITransport(apiObj));
    setShowSpinner(true);
    setSelectRange([{
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
      key: "selection"
    }]);
  }, [taskName]);

  useEffect(() => {
    if (DatasetLogs?.length) {
      let tempColumns = [];
      Object.keys(DatasetLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: key === 'status',
            sort: false,
            align: "center"
          },
        });
      });
      setColumns(tempColumns);
      setDatasetLogs(DatasetLogs);
    } else {
      setColumns([]);
      setDatasetLogs([]);
    }
    setShowSpinner(false);
  }, [DatasetLogs]);

  const options = {
      filterType: 'checkbox',
      selectableRows: "none",
      download: false,
      filter: true,
      print: false,
      search: false,
      viewColumns: true,
      jumpToPage: true,
  };

  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        spacing={3}
        sx={{
          marginBottom: "24px",
        }}
      >
        
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="task-type-filter-label" sx={{fontSize: "16px"}}>Filter by Task Type</InputLabel>
                <Select
                  labelId="task-type-filter-label"
                  id="task-type-filter"
                  value={taskName}
                  label="Filter by Task Type"
                  onChange={(e) => {setTaskName(e.target.value)}}
                  sx={{fontSize: "16px"}}
                  >
                  {['dataset.tasks.upload_data_to_data_instance', 'projects.tasks.export_project_new_record', 'projects.tasks.export_project_in_place'].map((el, i) => (
                      <MenuItem value={el}>{el}</MenuItem>
                  ))}
                </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
        <Button 
            endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />} 
            variant="contained" 
            color="primary" 
            onClick={() => setShowPicker(!showPicker)}
          >
            Pick dates
          </Button>
        </Grid>
        {showPicker && <Box sx={{mt: 2, display: "flex", justifyContent: "center", width: "100%"}}>
            <Card>
              <DateRangePicker
                onChange={handleRangeChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={selectRange}
                maxDate={new Date()}
                direction="horizontal"
              />
            </Card>
          </Box>}
      </Grid>
      { showSpinner ? <Spinner/> : (
        <ThemeProvider theme={tableTheme}>
          <MUIDataTable
            title={""}
            data={datasetLogs}
            columns={columns}
            options={options}
          />
        </ThemeProvider>)
      }
    </React.Fragment>
  );
};

export default DatasetLogs;
