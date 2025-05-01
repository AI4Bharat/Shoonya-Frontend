import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import LightTooltip from "../common/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import React, { useEffect, useState, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useSelector, useDispatch } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useParams } from "react-router-dom";
import FetchRecentTasksAPI from "../../../../redux/actions/api/UserManagement/FetchRecentTasks";
import tableTheme from "../../../theme/tableTheme";
import themeDefault from "../../../theme/theme";
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../config/localisation";
import SearchIcon from "@mui/icons-material/Search";
import AllTaskSearchPopup from "../Project/AllTaskSearchPopup";
import { styled } from "@mui/material/styles";
import { snakeToTitleCase } from "../../../../utils/utils";

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

const TASK_TYPES = ["annotation", "review", "supercheck"];

const RecentTasks = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [taskType, setTaskType] = useState(TASK_TYPES[0]);
  const [text, settext] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

  const [searchAnchor, setSearchAnchor] = useState(null);
  const searchOpen = Boolean(searchAnchor);
  const [searchedCol, setSearchedCol] = useState();
  const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const RecentTasks = useSelector((state) => state.getRecentTasks.data);
  const filterData = {
    Status: [
      "incomplete",
      "annotated",
      "reviewed",
      "super_checked",
      "exported",
    ],
  };
  const [selectedFilters, setsSelectedFilters] = useState({});

  const GetAllTasksdata = () => {
    const taskObjs = new FetchRecentTasksAPI(
      id,
      taskType,
      currentPageNumber,
      selectedFilters,
      currentRowPerPage
    );
    dispatch(APITransport(taskObjs));
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
    GetAllTasksdata();
  }, [id, taskType, currentPageNumber, currentRowPerPage, selectedFilters]);

  useEffect(() => {
    if (RecentTasks && RecentTasks?.results?.results?.length > 0) {
      const data = RecentTasks?.results?.results?.map((el) => {
        if (typeof el === "object") {
          return Object.keys(el).map((key) => el[key]);
        }
        return [];
      });
      let colList = [];
      if (
        RecentTasks.results.results.length > 0 &&
        typeof RecentTasks.results.results[0] === "object"
      ) {
        colList.push(...Object.keys(RecentTasks.results.results[0]));
      }
      if (selectedColumns.length === 0) {
        setSelectedColumns(colList);
      }
      const cols = colList.map((col) => {
        const isSelectedColumn = selectedColumns.includes(col);
        return {
          name: col,
          label: snakeToTitleCase(col),
          options: {
            filter: false,
            sort: false,
            align: "center",
            display: isSelectedColumn ? "true" : "false",
            customHeadLabelRender: customColumnHead,
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
        };
      });
      setColumns(cols);
      setTasks(data);
    } else {
      setTasks([]);
    }
  }, [RecentTasks, expandedRow]);

  useEffect(() => {
    if (columns.length > 0 && selectedColumns.length > 0) {
      const newCols = columns.map((col) => ({
        ...col,
        options: {
          ...col.options,
          display: selectedColumns.includes(col.name) ? "true" : "false",
        },
      }));
      if (JSON.stringify(newCols) !== JSON.stringify(columns)) {
        setColumns(newCols);
      }
    }
  }, [selectedColumns, columns]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchClose = () => {
    setSearchAnchor(null);
  };
  const handleShowSearch = (col, event) => {
    setSearchAnchor(event.currentTarget);
    setSearchedCol(col);
  };
  const customColumnHead = (col) => {
    let tooltipText = "";

    switch (col.label) {
      case "Updated at":
        tooltipText = "When task was last updated";
        break;
      case "Created at":
        tooltipText = "When task was assigned";
        break;
      case "Annotated at":
        tooltipText = "When task was first annotated";
        break;
      default:
        break;
    }
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          columnGap: "5px",
          flexGrow: "1",
          alignItems: "center",
        }}
      >
        {col.label}
        {col.label === "Updated at" ||
        col.label === "Created at" ||
        col.label === "Annotated at" ? (
          <LightTooltip arrow placement="top" title={tooltipText}>
            <InfoIcon sx={{ color: "grey" }} fontSize="medium" />
          </LightTooltip>
        ) : null}
        {
          <IconButton
            sx={{ borderRadius: "100%" }}
            onClick={(e) => handleShowSearch(col.name, e)}
          >
            <SearchIcon id={col.name + "_btn"} />
          </IconButton>
        }
      </Box>
    );
  };

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

  const tableOptions = {
    count: RecentTasks?.count,
    rowsPerPage: currentRowPerPage,
    page: currentPageNumber - 1,
    rowsPerPageOptions: [10, 25, 50, 100],
    textLabels: {
      pagination: {
        next: "Next >",
        previous: "< Previous",
      },
      body: {
        noMatch: "No records ",
      },
    },
    onChangePage: (currentPage) => {
      setCurrentPageNumber(currentPage + 1);
    },
    onChangeRowsPerPage: (rowPerPageCount) => {
      setCurrentPageNumber(1);
      setCurrentRowPerPage(rowPerPageCount);
    },
    filterType: "checkbox",
    selectableRows: "none",
    download: false,
    filter: false,
    print: false,
    search: false,
    viewColumns: false,
    jumpToPage: true,
    serverSide: true,
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
    <ThemeProvider theme={themeDefault}>
      <Box>
        <Tabs
          value={taskType}
          onChange={(e, newVal) => setTaskType(newVal)}
          aria-label="basic tabs example"
          sx={{ mb: 2 }}
        >
          <Tab
            label={translate("label.recentTasks.annotation")}
            value="annotation"
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
          <Tab
            label={translate("label.recentTasks.review")}
            value="review"
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
          <Tab
            label="Super Check"
            value="supercheck"
            sx={{ fontSize: 16, fontWeight: "700" }}
          />
        </Tabs>
      </Box>
      <ThemeProvider theme={tableTheme}>
        <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={tasks}
              columns={columns}
              options={tableOptions}
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

      {searchOpen && (
        <AllTaskSearchPopup
          open={searchOpen}
          anchorEl={searchAnchor}
          handleClose={handleSearchClose}
          updateFilters={setsSelectedFilters}
          //filterStatusData={filterData}
          currentFilters={selectedFilters}
          searchedCol={searchedCol}
          onchange={GetAllTasksdata}
        />
      )}
    </ThemeProvider>
  );
};

export default RecentTasks;
