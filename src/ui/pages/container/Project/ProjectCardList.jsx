import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import CustomButton from "../../component/common/Button";
import { Grid, ThemeProvider, Tooltip, Button, Box } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import Search from "../../component/common/Search";
import { useDispatch, useSelector } from "react-redux";
import ProjectFilterList from "../../component/common/ProjectFilterList";
import FilterListIcon from "@mui/icons-material/FilterList";
import UserMappedByProjectStage from "../../../../utils/UserMappedByRole/UserMappedByProjectStage";
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import { tooltipClasses } from '@mui/material/Tooltip';

const ProjectCardList = (props) => {
  const { projectData, selectedFilters, setsSelectedFilters } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverOpen = Boolean(anchorEl);
  const filterId = popoverOpen ? "simple-popover" : undefined;

  const SearchProject = useSelector((state) => state.SearchProjectCards.data);

  const handleShowFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pageSearch = () => {
    return projectData.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.project_type?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase()?.includes(SearchProject.toLowerCase())
      ) {
        return el;
      } else if (
        el.workspace_id
          .toString()
          ?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.tgt_language?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        UserMappedByProjectStage(el.project_stage)
          ?.name?.toLowerCase()
          .includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };
  const columns = [
    {
      name: "Project_id",
      label: "Project Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Project_Title",
      label: "Project Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "project_Type",
      label: "Project Type",
      options: {
        filter: false,
        sort: false,
        align: "center",

        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "project_mode",
      label: "Project Mode",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: 'false', 
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "workspace_id",
      label: "Workspace Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", fontSize: "16px" },
        }),
      },
    },
  ];

  const data =
    projectData && projectData.length > 0
      ? pageSearch().map((el, i) => {
          const userRole =
            el.project_stage &&
            UserMappedByProjectStage(el.project_stage).element;
          return [
            el.id,
            el.title,
            el.project_type,
            userRole ? userRole : el.project_stage,
            el.tgt_language == null ? "-" : el.tgt_language,
            el.project_mode,
            el.workspace_id,
            <Link to={`/projects/${el.id}`} style={{ textDecoration: "none" }}>
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
        backgroundColor: '#e0e0e0',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 350,
        fontSize: theme.typography.pxToRem(12),
      },
      [`& .${tooltipClasses.arrow}`]: {
        color: "#e0e0e0",
      },
}));

  const renderToolBar = () => {
    return (
      <div style={{position: "relative"}}>
        {filtersApplied && <InfoIcon color="primary" fontSize="small" sx={{position:"absolute", top:-4, right:-4}}/>}
        <Button style={{ minWidth: "25px" }} onClick={handleShowFilter}>
          <CustomTooltip
            title={
              filtersApplied ? (
                <Box style={{ fontFamily: 'Roboto, sans-serif' }} sx={{ padding: '5px', maxWidth: '350px', fontSize: '12px', display:"flex",flexDirection:"column", gap:"5px" }}>
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
  // const renderSearch = () => {
  //     return (
  //         <Search />
  //     );
  // };

  return (
    <>
      <ThemeProvider theme={tableTheme} sx={{ mt: 4 }}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
      <ProjectFilterList
        id={filterId}
        open={popoverOpen}
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateFilters={setsSelectedFilters}
        currentFilters={selectedFilters}
      />
    </>
  );
};

export default ProjectCardList;
