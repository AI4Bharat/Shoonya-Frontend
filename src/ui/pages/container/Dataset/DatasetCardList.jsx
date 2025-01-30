import React, { useState } from "react";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CustomButton from "../../component/common/Button";
import { ThemeProvider,Tooltip, Button, Box } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import { useDispatch, useSelector } from "react-redux";
import FilterListIcon from "@mui/icons-material/FilterList";
import DatasetFilterList from "./DatasetFilterList";
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const DatasetCardList = (props) => {
  const { datasetList,selectedFilters,setsSelectedFilters } = props;
  const SearchDataset = useSelector((state) => state.SearchProjectCards.data);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;
 

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
  console.log("filtersApplied", filtersApplied);

  const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#e0e0e0',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#e0e0e0",
  },
}));

  const renderToolBar = () => {
    return (
      <div style={{ position: "relative" }}>
        {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{position:"absolute", top:-4, right:-4}}/>}
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
        <CustomTooltip
      title={
        filtersApplied ? (
          <Box style={{ fontFamily: 'Roboto, sans-serif' }} sx={{ padding: '5px', maxWidth: '300px', fontSize: '12px', display:"flex",flexDirection:"column", gap:"5px" }}>
            {selectedFilters.dataset_type && <div><strong>Dataset Type:</strong> {selectedFilters.dataset_type}</div>}
            {selectedFilters.dataset_visibility && <div><strong>Dataset Visibility:</strong> {selectedFilters.dataset_visibility}</div>}
        </Box>
      ) : (
      <span style={{ fontFamily: 'Roboto, sans-serif' }}>
        Filter Table
      </span>
      )  
      }
      disableInteractive
    >
      <FilterListIcon sx={{ color: '#515A5A' }} />
    </CustomTooltip>
        </Button>
      </div>
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
  };

  return (
    <div>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
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
