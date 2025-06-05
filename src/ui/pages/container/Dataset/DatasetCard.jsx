import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import DatasetCard from "../../component/common/DatasetCard";
import DatasetStyle from "../../../styles/Dataset";
import {  useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../component/common/TablePaginationActions";
import DatasetFilterList from "./DatasetFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const DatasetCards = (props) => {
  const { datasetList,selectedFilters,setsSelectedFilters } = props;
  const classes = DatasetStyle();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  // const apiLoading = useSelector(state => state.apiStatus.loading);
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


  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const rowChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
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
    const areFiltersApplied = (filters) => {
    return Object.values(filters).some((value) => value !== "");
  };

  const filtersApplied = areFiltersApplied(selectedFilters);

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

  return (
    <React.Fragment>
      {/* <Header /> */}
      {/* {loading && <Spinner />} */}
      <Grid sx={{textAlign:"end",margin:"-20px 10px 10px 0px"}}>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
        {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{position:"absolute", top:-4, right:-4}}/>}
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
      </Grid>
      {pageSearch().length > 0 && (
        <Box sx={{ margin: "0 auto", pb: 5 }}>
          {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
          <Grid
            container
            justifyContent={"center"}
            rowSpacing={4}
            spacing={2}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            sx={{ mb: 3 }}
          >
            {pageSearch()
              .map((el, i) => {
                return (
                  <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <DatasetCard
                      classAssigned={
                        i % 2 === 0
                          ? classes.projectCardContainer2
                          : classes.projectCardContainer1
                      }
                      datasetObj={el}
                      index={i}
                    />
                  </Grid>
                );
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          </Grid>
          <TablePagination
            component="div"
            count={pageSearch().length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[9, 18, 36, 72, { label: "All", value: -1 }]}
            onRowsPerPageChange={rowChange}
            ActionsComponent={TablePaginationActions}
          />
        </Box>
      )}
      <DatasetFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
    </React.Fragment>
  );
};

export default DatasetCards;
