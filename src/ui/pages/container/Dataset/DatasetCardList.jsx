import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CustomButton from "../../component/common/Button";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import tableTheme from "../../../theme/tableTheme";
import { useSelector } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import DatasetFilterList from "./DatasetFilterList";
import InfoIcon from "@mui/icons-material/Info";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const DatasetCardList = (props) => {
  const { datasetList, selectedFilters, setsSelectedFilters } = props;
  const SearchDataset = useSelector((state) => state.SearchProjectCards.data);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
  const [isBrowser, setIsBrowser] = useState(false);
  const tableRef = useRef(null);
  const [displayWidth, setDisplayWidth] = useState(0);

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

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pageSearch = () => {
    return datasetList.filter((el) => {
      if (SearchDataset == "") {
        return el;
      } else if (
        el.dataset_type?.toLowerCase().includes(SearchDataset?.toLowerCase())
      ) {
        return el;
      } else if (
        el.instance_name?.toLowerCase().includes(SearchDataset?.toLowerCase())
      ) {
        return el;
      } else if (
        el.instance_id
          .toString()
          ?.toLowerCase()
          ?.includes(SearchDataset.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "Dataset_id",
      label: "Dataset Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding: "16px" },
        }),
      },
    },
    {
      name: "Dataset_Title",
      label: "Dataset Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },

    {
      name: "Dataset_Type",
      label: "Dataset Type",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
      },
    },
  ];

  const data =
    datasetList && datasetList.length > 0
      ? pageSearch().map((el, i) => {
          return [
            el.instance_id,
            el.instance_name,
            el.dataset_type,
            <Link
              to={`/datasets/${el.instance_id}`}
              style={{ textDecoration: "none" }}
            >
              <CustomButton
                sx={{ borderRadius: 2, marginRight: 2 }}
                label="View"
              />
            </Link>,
          ];
        })
      : [];

  const areFiltersApplied = (filters) => {
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);
  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#e0e0e0",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      fontSize: theme.typography.pxToRem(12),
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#e0e0e0",
    },
  }));

  const renderToolBar = () => {
    return (
      <>
        <Button
          style={{ position: "relative", minWidth: "25px" }}
          onClick={handleShowFilter}
        >
          {filtersApplied && (
            <InfoIcon
              color="primary"
              fontSize="small"
              sx={{ position: "absolute", top: -4, right: -4 }}
            />
          )}
          <CustomTooltip
            title={
              filtersApplied ? (
                <Box
                  style={{ fontFamily: "Roboto, sans-serif" }}
                  sx={{
                    padding: "5px",
                    maxWidth: "300px",
                    fontSize: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  {selectedFilters.dataset_type && (
                    <div>
                      <strong>Dataset Type:</strong>{" "}
                      {selectedFilters.dataset_type}
                    </div>
                  )}
                  {selectedFilters.dataset_visibility && (
                    <div>
                      <strong>Dataset Visibility:</strong>{" "}
                      {selectedFilters.dataset_visibility}
                    </div>
                  )}
                </Box>
              ) : (
                <span style={{ fontFamily: "Roboto, sans-serif" }}>
                  Filter Table
                </span>
              )
            }
            disableInteractive
          >
            <FilterListIcon sx={{ color: "#515A5A" }} />
          </CustomTooltip>
        </Button>
      </>
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

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    // customToolbar: fetchHeaderButton,
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    // rowsPerPage: PageInfo.count,
    filter: false,
    // page: PageInfo.page,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
    customToolbar: renderToolBar,
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
    <div>
      <ThemeProvider theme={tableTheme}>
        <div ref={tableRef}>
          {isBrowser ? (
            <MUIDataTable
              key={`table-${displayWidth}`}
              title={""}
              data={data}
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
      <DatasetFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
    </div>
  );
};

export default DatasetCardList;
