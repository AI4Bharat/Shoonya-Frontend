// ReportsTable

import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Button, Grid, CircularProgress, Card, Radio,Typography,ThemeProvider } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GetProjectReportAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectReport";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import DatasetStyle from "../../../styles/Dataset";
import ColumnList from '../common/ColumnList';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { isSameDay, format } from 'date-fns/esm';
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";

const ReportsTable = (props) => {
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    const [selectRange, setSelectRange] = useState([{
        startDate: new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
        endDate: new Date(),
        key: "selection"
    }]);
    // const [rangeValue, setRangeValue] = useState([format(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'), 'yyyy-MM-dd'), Date.now()]);
    const [showPicker, setShowPicker] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [reportRequested, setReportRequested] = useState(false);
    const [columns, setColumns] = useState([]);

    const { id } = useParams();
    const dispatch = useDispatch();
    const ProjectReport = useSelector(state => state.getProjectReport.data);
    const classes = DatasetStyle();
    const [radiobutton, setRadiobutton] = useState("AnnotatationReports");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (reportRequested && ProjectReport?.length > 0) {
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


    const handleAnnotatationReports = (e) => {
        setRadiobutton(e.target.value)
    }
    const handleReviewerReports = (e) => {
        setRadiobutton(e.target.value)

    }

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
        jumpToPage: true,
        customToolbar: renderToolBar,
        textLabels: {
            body: {
                noMatch: 'No Record Found!'
            }
        }
    };

    const handleRangeChange = (ranges) => {
        const { selection } = ranges;
        if (selection.endDate > new Date()) selection.endDate = new Date();
        setSelectRange([selection]);
    };

    const handleSubmit = () => {
        let projectObj;
        let reports_type = "review_reports"
        setReportRequested(true);
        setSubmitted(true);

        if (radiobutton === "AnnotatationReports") {
            projectObj = new GetProjectReportAPI(id, format(selectRange[0].startDate, 'yyyy-MM-dd'), format(selectRange[0].endDate, 'yyyy-MM-dd'));
        }
       else if(radiobutton === "ReviewerReports") {
            projectObj = new GetProjectReportAPI(id, format(selectRange[0].startDate, 'yyyy-MM-dd'), format(selectRange[0].endDate, 'yyyy-MM-dd'),reports_type);
        }
        dispatch(APITransport(projectObj));
        
        setShowPicker(false)
        setShowSpinner(true);
    }

    return (
        <React.Fragment>
            
         
            <Grid container direction="row" columnSpacing={3} rowSpacing={2} sx={{ mt: 2, mb: 2, justifyContent: "space-between" }}>
            <Grid   sx={{ }}   >
             <Typography gutterBottom component="div" sx={{marginTop: "25px",fontSize:"16px"}}>
             Select Report Type :
             </Typography>
           </Grid>
                <FormControl>

                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        sx={{ marginTop: "20px", marginRight:"90px" }}
                        value={radiobutton}
                        onChange={handleAnnotatationReports}

                    >
                        <FormControlLabel value="AnnotatationReports" control={<Radio />} label="Annotatation Reports"  />
                        <FormControlLabel value="ReviewerReports" control={<Radio />} label="Reviewer Reports"  />

                    </RadioGroup>
                </FormControl>
                <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                    <Button
                        endIcon={showPicker ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => setShowPicker(!showPicker)}
                    >
                        Pick Dates
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
            {showPicker && <Box sx={{ mt: 2, mb: 2, display: "flex", justifyContent: "center", width: "100%" }}>
                <Card>
                    <DateRangePicker
                        onChange={handleRangeChange}
                        staticRanges={[
                            ...defaultStaticRanges,
                            {
                                label: "Till Date",
                                range: () => ({
                                    startDate: new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ')),
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
                        ]}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={selectRange}
                        minDate={new Date(Date.parse(ProjectDetails?.created_at, 'yyyy-MM-ddTHH:mm:ss.SSSZ'))}
                        maxDate={new Date()}
                        direction="horizontal"

                    />
                </Card>
            </Box>}
            {ProjectReport?.length > 0 ? (
            <ThemeProvider theme={tableTheme}>
            {
                showSpinner ? <CircularProgress sx={{ mx: "auto", display: "block" }} /> : reportRequested && (
                    <MUIDataTable
                        title={"Reports"}
                        data={ProjectReport}
                        columns={columns.filter(col => selectedColumns.includes(col.name))}
                        options={options}
                    />
                )
            }
             </ThemeProvider>
             ):

             <Grid
          container
          justifyContent="center"
        >
          <Grid item sx={{mt:"10%"}}>
            {showSpinner ? <CircularProgress color="primary" size={50} /> : (
            !ProjectReport?.length && submitted && <>No results</>
            )}
          </Grid>
          </Grid>
}
        </React.Fragment>
    )
}

export default ReportsTable;