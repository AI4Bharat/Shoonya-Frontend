import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, ThemeProvider } from "@mui/material";
import { addMonths } from 'date-fns/esm';
import { DateRangePicker } from "react-date-range";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetProjectLogsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectLogs";
import { snakeToTitleCase } from "../../../../utils/utils";
import tableTheme from "../../../theme/tableTheme";

const ProjectLogs = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const ProjectLogs = useSelector((state) => state.getProjectLogs.data);
  const [taskName, setTaskName] = useState("projects.tasks.export_project_in_place"); 
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [projectLogs, setProjectLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectRange, setSelectRange] = useState([{
    startDate: addMonths(new Date(), -3),
    endDate: new Date(),
    key: "selection"
  }]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    if (ProjectLogs?.length) {
      let tempLogs = JSON.parse(JSON.stringify(ProjectLogs));
      tempLogs = tempLogs.filter((log) => {
        return new Date(log.date) >= selection.startDate && new Date(log.date) <= selection.endDate;
      });
      setProjectLogs(tempLogs);
    }
  };

  useEffect(() => {
    const apiObj = new GetProjectLogsAPI(projectId, taskName);
    dispatch(APITransport(apiObj));
    setSelectRange([{
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
      key: "selection"
    }]);
  }, [taskName]);

  useEffect(() => {
    if (ProjectLogs?.length) {
      let tempColumns = [];
      let tempSelected = [];
      Object.keys(ProjectLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: ['status', 'result'].includes(key),
            sort: false,
            align: "center"
          },
        });
        tempSelected.push(key);
      });
      setColumns(tempColumns);
      setProjectLogs(ProjectLogs);
      setSelectedColumns(tempSelected);
    } else {
      setColumns([]);
      setProjectLogs([]);
      setSelectedColumns([]);
    }
  }, [ProjectLogs]);

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
                  {['projects.tasks.add_new_data_items_into_project', 'projects.tasks.create_parameters_for_task_creation', 'projects.tasks.export_project_in_place', 'projects.tasks.pull_new_data_items_into_project', 'projects.tasks.export_project_new_record'].map((el, i) => (
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
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={projectLogs}
          columns={columns.filter((col) => selectedColumns.includes(col.name))}
          options={options}
        />
      </ThemeProvider>
    </React.Fragment>
  );
};

export default ProjectLogs;
