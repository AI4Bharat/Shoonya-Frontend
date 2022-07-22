// ReportsTable

import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import CustomButton from '../common/Button';
import { Typography, TextField, Box, Stack, Button, Grid, CircularProgress } from '@mui/material';
// import { DateRangePicker, LocalizationProvider   } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { format, addDays, addWeeks, startOfWeek, startOfMonth, lastDayOfWeek, compareAsc } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GetProjectReportAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectReport";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';

const ReportsTable = () => {
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const [startDate, setStartDate] = useState(format(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(Date.now(), 'yyyy-MM-dd'));
    const [selectRange, setSelectRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const [rangeValue, setRangeValue] = useState([format(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'), Date.now()]);
    const [showPicker, setShowPicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
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
        setShowSpinner(false);
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
        textLabels: {
            body: {
                noMatch: 'No Record Found!'
            }
        }
    };

    const handleOptionChange = (e) => {
        setSelectRange([
            {
                startDate: new Date(),
                endDate: addDays(new Date(), 7),
                key: 'selection'
            }
        ]);
        if (e.target.value === "Custom Range") {
            setStartDate(format(startOfMonth(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
            setShowPicker(true);
        } else setShowPicker(false);
        if (e.target.value === "Today") {
            setStartDate(format(Date.now(), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
        else if (e.target.value === "Yesterday") {
            setStartDate(format(addDays(Date.now(), -1), 'yyyy-MM-dd'));
            setEndDate(format(addDays(Date.now(), -1), 'yyyy-MM-dd'));
        }
        else if (e.target.value === "This Week") {
            setStartDate(format(startOfWeek(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
        else if (e.target.value === "Last Week") {
            setStartDate(format(startOfWeek(addWeeks(Date.now(), -1)), 'yyyy-MM-dd'));
            setEndDate(format(lastDayOfWeek(addWeeks(Date.now(), -1)), 'yyyy-MM-dd'));
        }
        else if (e.target.value === "This Month") {
            setStartDate(format(startOfMonth(Date.now()), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
        else if (e.target.value === "Till Date") {
            setStartDate(format(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'));
            setEndDate(format(Date.now(), 'yyyy-MM-dd'));
        }
    };

    const handleRangeChange = (dates) => {
        // console.log("dates", dates.selection);
        // console.log("parsed start date", format(Date.parse(dates.selection.startDate), 'yyyy-MM-dd'));
        // console.log("parsed end date", format(Date.parse(dates.selection.endDate), 'yyyy-MM-dd'));
        // setRangeValue(dates);
        // const [start, end] = dates;
        let currentDateSplittedArr = format(Date.parse(new Date()), 'yyyy-MM-dd').split("-");
        let startDateSplittedArr = format(Date.parse(dates.selection.startDate), 'yyyy-MM-dd').split("-");
        let endDateSplittedArr = format(Date.parse(dates.selection.endDate), 'yyyy-MM-dd').split("-");

        let finalStartDate = compareAsc(new Date(startDateSplittedArr[0], startDateSplittedArr[1], startDateSplittedArr[2]), new Date(currentDateSplittedArr[0], currentDateSplittedArr[1], currentDateSplittedArr[2]));
        let finalEndDate = compareAsc(new Date(endDateSplittedArr[0], endDateSplittedArr[1], endDateSplittedArr[2]), new Date(currentDateSplittedArr[0], currentDateSplittedArr[1], currentDateSplittedArr[2]));

        // console.log("finalStartDate", finalStartDate);
        // console.log("finalEndDate", finalEndDate);

        // console.log("startDateSplittedArr", startDateSplittedArr);
        // console.log("endDateSplittedArr", endDateSplittedArr);


        setSelectRange([dates.selection]);
        setStartDate(finalStartDate == 1 ? currentDateSplittedArr.join("-") : startDateSplittedArr.join("-"));
        setEndDate(finalEndDate == 1 ? currentDateSplittedArr.join("-") : endDateSplittedArr.join("-"));
    };

    const handleDateSubmit = () => {
        const projectObj = new GetProjectReportAPI(id, startDate, endDate);
        dispatch(APITransport(projectObj));
        setShowPicker(false)
        setShowSpinner(true);
    }

    return (
        <React.Fragment>
            <Stack direction="row" spacing={2} sx={{ marginBottom: "12px", alignItems: "center", marginTop : "1rem" }}>
                

                {showPicker &&
                    <DateRangePicker
                        onChange={handleRangeChange}
                        // onChange={item => setSelectRange([item.selection])}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={selectRange}
                        direction="horizontal"
                        maxDate={new Date()}
                    />
                }
                {showPicker ?
                    <Button variant="contained" onClick={handleDateSubmit}>Submit</Button>
                    : <Button variant="contained" onClick={() => setShowPicker(true)}>Select a Date Range</Button>
                }
            </Stack>
            {
                showSpinner ? <CircularProgress sx={{ mx: "auto", display: "block" }} /> : (
                    !showPicker && <MUIDataTable
                        title={""}
                        data={ProjectReport}
                        columns={columns.filter(col => selectedColumns.includes(col.name))}
                        options={options}
                    // filter={false}
                    />
                )
            }
        </React.Fragment>
    )
}

export default ReportsTable;