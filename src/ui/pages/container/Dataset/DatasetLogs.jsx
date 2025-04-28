import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import MUIDataTable from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TablePagination from "@mui/material/TablePagination";
import tableTheme from "../../../theme/tableTheme";
import Spinner from "../../component/common/Spinner";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { addMonths, parse } from "date-fns/esm";
import { DateRangePicker } from "react-date-range";
import GetDatasetLogsAPI from "../../../../redux/actions/api/Dataset/GetDatasetLogs";
import { snakeToTitleCase } from "../../../../utils/utils";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { styled } from "@mui/material/styles";

const TruncatedContent = styled(Box)(({ expanded }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: expanded ? "unset" : 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.5em",
  maxHeight: expanded ? "9900px" : "4.5em",
  transition: "max-height 1.8s ease-in-out",
}));

const RowContainer = styled(Box)(({ expanded }) => ({
  cursor: "pointer",
  transition: "all 1.8s ease-in-out",
}));

const DatasetLogs = (props) => {
  const { datasetId } = props;
  const dispatch = useDispatch();
  const DatasetLogs = useSelector((state) => state.getDatasetLogs.data);
  const [taskName, setTaskName] = useState(
    "projects.tasks.export_project_in_place"
  );
  const [columns, setColumns] = useState([]);
  const [datasetLogs, setDatasetLogs] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectRange, setSelectRange] = useState([
    {
      startDate: addMonths(new Date(), -3),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleRangeChange = (ranges) => {
    const { selection } = ranges;
    if (selection.endDate > new Date()) selection.endDate = new Date();
    setSelectRange([selection]);
    if (DatasetLogs?.length) {
      let tempLogs = JSON.parse(JSON.stringify(DatasetLogs));
      tempLogs = tempLogs.filter((log) => {
        const date = parse(log.date, "dd-MM-yyyy", new Date());
        return date >= selection.startDate && date <= selection.endDate;
      });
      setDatasetLogs(tempLogs);
    }
  };
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setDisplayWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    setIsBrowser(true);

    // Force responsive mode after component mount
    const applyResponsiveMode = () => {
      if (tableRef.current) {
        const tableWrapper = tableRef.current.querySelector(
          ".MuiDataTable-responsiveBase"
        );
        if (tableWrapper) {
          tableWrapper.classList.add("MuiDataTable-vertical");
        }
      }
    };

    // Apply after a short delay to ensure DOM is ready
    const timer = setTimeout(applyResponsiveMode, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const apiObj = new GetDatasetLogsAPI(datasetId, taskName);
    dispatch(APITransport(apiObj));
    setShowSpinner(true);
    setSelectRange([
      {
        startDate: addMonths(new Date(), -3),
        endDate: new Date(),
        key: "selection",
      },
    ]);
  }, [taskName]);

  useEffect(() => {
    if (DatasetLogs?.length) {
      let tempColumns = [];
      Object.keys(DatasetLogs[0]).forEach((key) => {
        tempColumns.push({
          name: key,
          label: snakeToTitleCase(key),
          options: {
            filter: key === "status",
            sort: false,
            align: "center",
            customBodyRender: (value, tableMeta) => {
              const rowIndex = tableMeta.rowIndex;
              const isExpanded = expandedRow === rowIndex;
              return (
                <RowContainer
                  expanded={isExpanded}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedRow((prevExpanded) =>
                      prevExpanded === rowIndex ? null : rowIndex
                    );
                  }}
                >
                  <TruncatedContent expanded={isExpanded}>
                    {value}
                  </TruncatedContent>
                </RowContainer>
              );
            },
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
  }, [DatasetLogs, expandedRow]);


  const CustomFooter = ({
    count,
    page,
    rowsPerPage,
    changeRowsPerPage,
    changePage,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
          alignItems: "center",
          padding: "10px",
          gap: {
            xs: "10px",
            md: "20px",
          },
        }}
      >
        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => changePage(newPage)}
          onRowsPerPageChange={(e) => changeRowsPerPage(e.target.value)}
          sx={{
            "& .MuiTablePagination-actions": {
              marginLeft: "0px",
            },
            "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input":
              {
                marginRight: "10px",
              },
          }}
        />

        {/* Jump to Page */}
        <div>
          <label
            style={{
              marginRight: "5px",
              fontSize: "0.83rem",
            }}
          >
            Jump to Page:
          </label>
          <Select
            value={page + 1}
            onChange={(e) => changePage(Number(e.target.value) - 1)}
            sx={{
              fontSize: "0.8rem",
              padding: "4px",
              height: "32px",
            }}
          >
            {Array.from({ length: Math.ceil(count / rowsPerPage) }, (_, i) => (
              <MenuItem key={i} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    );
  };

  const options = {
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: true,
    print: false,
    search: false,
    viewColumns: true,
    jumpToPage: true,
    responsive: "vertical",
    enableNestedDataAccess: ".",
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage) => (
      <CustomFooter
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
      />
    ),
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
            <InputLabel id="task-type-filter-label" sx={{ fontSize: "16px" }}>
              Filter by Task Type
            </InputLabel>
            <Select
              labelId="task-type-filter-label"
              id="task-type-filter"
              value={taskName}
              label="Filter by Task Type"
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
              sx={{ fontSize: "16px" }}
            >
              {[
                "dataset.tasks.upload_data_to_data_instance",
                "projects.tasks.export_project_new_record",
                "projects.tasks.export_project_in_place",
              ].map((el, i) => (
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
            Pick Dates
          </Button>
        </Grid>
        {showPicker && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
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
          </Box>
        )}
      </Grid>
      {showSpinner ? (
        <Spinner />
      ) : (
        <ThemeProvider theme={tableTheme}>
          <div ref={tableRef}>
            {isBrowser ? (
              <MUIDataTable
                key={`table-${displayWidth}`}
                title={""}
                data={datasetLogs}
                columns={columns}
                options={options}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                  mx: 2,
                  my: 3,
                  borderRadius: "4px",
                  transform: "none",
                }}
              />
            )}
          </div>
        </ThemeProvider>
      )}
    </React.Fragment>
  );
};

export default DatasetLogs;
