import { Box, Grid,Button,Tooltip } from "@mui/material";
import React, {  useState } from "react";
import ProjectCard from "../../component/common/ProjectCard";
import DatasetStyle from "../../../styles/Dataset";
import {  useSelector } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../component/common/TablePaginationActions";
import Record from "../../../../assets/no-record.svg";
import ProjectFilterList from "../../component/common/ProjectFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserMappedByProjectStage from "../../../../utils/UserMappedByRole/UserMappedByProjectStage";
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


const Projectcard = (props) => {
  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const classes = DatasetStyle();
  const SearchProject = useSelector((state) => state.SearchProjectCards.data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
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
    return projectData.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.project_type?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }  else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase()?.includes(SearchProject.toLowerCase())
      ) {
        return el;
      }else if (
        el.workspace_id.toString()?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;}
        else if (
          el.tgt_language?.toLowerCase().includes(SearchProject?.toLowerCase())
        ) {
          return el;}
          else if (
            UserMappedByProjectStage(el.project_stage)
              ?.name?.toLowerCase()
              .includes(SearchProject?.toLowerCase())
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
        <Grid sx={{textAlign:"end",margin:"-20px 10px 10px 0px"}}>
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
        {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{position:"absolute", top:-4, right:-4}}/>}
          <CustomTooltip
            title={
              filtersApplied ? (
                <Box style={{ fontFamily: 'Roboto, sans-serif' }} sx={{ padding: '5px', maxWidth: '300px', fontSize: '12px', display:"flex",flexDirection:"column", gap:"5px" }}>
                  {selectedFilters.project_type && <div><strong>Project Type:</strong> {selectedFilters.project_type}</div>}
                  {selectedFilters.project_user_type && <div><strong>Project User Type:</strong> {selectedFilters.project_user_type}</div>}
                  {selectedFilters.archived_projects && <div><strong>Archived Projects:</strong> {selectedFilters.archived_projects}</div>}
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
      {pageSearch().length > 0 ? (
        <Box sx={{ margin: "0 auto", pb: 5 }}>
          {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
          <Grid
            container
            rowSpacing={4}
            spacing={2}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            sx={{ mb: 3 }}
          >
            {pageSearch()
              .map((el, i) => {
                return (
                  <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                    <ProjectCard
                      classAssigned={
                        i % 2 === 0
                          ? classes.projectCardContainer2
                          : classes.projectCardContainer1
                      }
                      projectObj={el}
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
      ) : (
        SearchProject && (
          <div
            style={{
              background: `url(${Record}) no-repeat center center`,
              height: "287px",
              marginTop: "20vh",
            }}
          ></div>
        )
      )}
      <ProjectFilterList
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

export default Projectcard;
