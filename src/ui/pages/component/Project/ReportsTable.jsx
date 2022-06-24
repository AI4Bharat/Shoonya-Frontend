// ReportsTable

import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import CustomButton from '../common/Button';
import { Typography, TextField, Box, Stack, Button, Grid } from '@mui/material';
import { DateRangePicker, LocalizationProvider   } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { format, addDays, addWeeks, startOfWeek, startOfMonth, lastDayOfWeek } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GetProjectReportAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectReport";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';

const ReportsTable = () => {
    const [startDate, setStartDate] = useState(format(startOfMonth(Date.now()), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(Date.now(), 'yyyy-MM-dd'));
    const [selectRange, setSelectRange] = useState("This Month");
    const [rangeValue, setRangeValue] = useState([startOfMonth(Date.now()), Date.now()]);
    const [showPicker, setShowPicker] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [columns, setColumns] = useState([]);

    const { id } = useParams();
    const dispatch = useDispatch();
    const ProjectReport = useSelector(state => state.getProjectReport.data);
    const classes = DatasetStyle();

    useEffect(() => {
        if (ProjectReport?.length > 0) {
            let cols = [];
            let selected = [];
            Object.keys(ProjectReport[0]).forEach((key) => {
                cols.push({
                    name: key,
                    label: key,
                    options: {
                        filter: false,
                        sort: false,
                    }
                })
                selected.push(key);
            });
            setSelectedColumns(selected);
            setColumns(cols);
        } else {
            setColumns([]);
            setSelectedColumns([]);
        }
    }, [ProjectReport]);

    const renderToolBar = () => {
        const buttonSXStyle = { borderRadius: 2, margin: 2 }
        return (
            <Box className={classes.filterToolbarContainer}>
                <ColumnList
                    columns={columns}
                    setColumns={setSelectedColumns}
                    selectedColumns={selectedColumns}
                />
            </Box>
        )
    }

    const options = {
        filterType: 'checkbox',
        selectableRows: "none",
        download: false,
        filter: false,
        print: false,
        search: false,
        viewColumns: false,
        customToolbar: renderToolBar,
    };

    const handleOptionChange = (e) => {
        setSelectRange(e.target.value);
        if (e.target.value === "Custom Range") {
            setStartDate(format(startOfMonth(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
            setShowPicker(true);
        } else setShowPicker(false);
        if (e.target.value === "Today") {
            setStartDate(format(Date.now(), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
        if (e.target.value === "Yesterday") {
            setStartDate(format(addDays(Date.now(), -1), 'yyyy-MM-dd'));
            setEndDate(format(addDays(Date.now(), -1), 'yyyy-MM-dd'));
        }
        if (e.target.value === "This Week") {
            setStartDate(format(startOfWeek(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
        if (e.target.value === "Last Week") {
            setStartDate(format(startOfWeek(addWeeks(Date.now(), -1)), 'yyyy-MM-dd'));
            setEndDate(format(lastDayOfWeek(addWeeks(Date.now(), -1)), 'yyyy-MM-dd'));
        }
        if (e.target.value === "This Month") {
            setStartDate(format(startOfMonth(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
    };

    const handleRangeChange = (dates) => {
        setRangeValue(dates);
        const [start, end] = dates;
        setStartDate(format(start, 'yyyy-MM-dd'));
        setEndDate(format(end, 'yyyy-MM-dd'));
    };

    const handleDateSubmit = () => {
        const projectObj = new GetProjectReportAPI(id, startDate, endDate);
        dispatch(APITransport(projectObj));
    }

    return (
        <React.Fragment>
            <Stack direction="row" spacing={2} sx={{ marginBottom: "12px", alignItems: "center" }}>
                <Box sx={{ width: "200px" }}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="date-range-select-label" sx={{fontSize:"16px"}}>Date Range</InputLabel>
                            <Select
                                labelId="date-range-select-label"
                                id="date-range-select"
                                value={selectRange}
                                defaultValue={"This Month"}
                                label="Date Range"
                                onChange={handleOptionChange}
                                sx={{fontSize : "0.875rem", lineHeight : 3}}
                            >
                                <MenuItem value={"Today"}>Today</MenuItem>
                                <MenuItem value={"Yesterday"}>Yesterday</MenuItem>
                                <MenuItem value={"This Week"}>This Week</MenuItem>
                                <MenuItem value={"Last Week"}>Last Week</MenuItem>
                                <MenuItem value={"This Month"}>This Month</MenuItem>
                                <MenuItem value={"Custom Range"}>Custom Range</MenuItem>
                            </Select>
                    </FormControl>
                </Box>
                {showPicker &&
                    <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        localeText={{ start: 'Start Date', end: 'End Date' }}
                    >
                        <DateRangePicker
                            value={rangeValue}
                            onChange={handleRangeChange}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField {...startProps} />
                                        <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                </React.Fragment>
                            )}
                        />
                    </LocalizationProvider>}
                <Button variant="contained" onClick={handleDateSubmit}>Submit</Button>
            </Stack>
            {ProjectReport.length > 0 &&
                <MUIDataTable
                    title={""}
                    data={ProjectReport}
                    columns={columns.filter(col => selectedColumns.includes(col.name))}
                    options={options}
                    // filter={false}
                />}
        </React.Fragment>
    )
}

export default ReportsTable;