import React, { useState, useEffect } from "react";
import CustomButton from "../common/Button";
import { Link, useParams } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import GetWorkspacesProjectDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceProject";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider, Grid, Box, TablePagination, Select, MenuItem } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import Search from "../../component/common/Search";
import UserMappedByProjectStage from "../../../../utils/UserMappedByRole/UserMappedByProjectStage";

const ProjectTable = (props) => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const getWorkspaceProjectData = () => {
    const workspaceObjs = new GetWorkspacesProjectDetailsAPI(id);

    dispatch(APITransport(workspaceObjs));
  };

  useEffect(() => {
    getWorkspaceProjectData();
  }, []);

  const workspacesproject = useSelector(
    (state) => state.getWorkspacesProjectData.data
  );
  const SearchWorkspaceProjects = useSelector(
    (state) => state.SearchProjectCards.data
  );
  const pageSearch = () => {
    return workspacesproject.filter((el) => {
      if (SearchWorkspaceProjects == "") {
        return el;
      } else if (
        el.title?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.id.toString()?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.tgt_language?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      } else if (
        el.project_type?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      }
      else if (
        UserMappedByProjectStage(el.project_stage)?.name?.toLowerCase().includes(SearchWorkspaceProjects?.toLowerCase())
      ) {
        return el;
      }
    });
  };

  const columns = [
    {
      name: "id",
      label: " Project ID",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px", padding:"16px" },
        }),
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",},
        }),
      },
    },

    {
      name: "Created By",
      label: "Created By",
      options: {
        filter: false,
        sort: false,
        align: "center",
        display: 'false', 
        setCellHeaderProps: (sort) => ({
            style: { height: "70px",  },
          }),
      },
    },
    {
      name: "Project stage",
      label: "project_stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",  },
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",   },
        }),
      },
    },
    {
      name: "project_type",
      label: "project type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
          style: { height: "70px",  },
        }),
      },
    },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: (sort) => ({
            style: { height: "70px",  },
          }),
      },
    },
  ];
  const data =
    workspacesproject && workspacesproject.length > 0
      ? pageSearch().map((el, i) => {
        const userRole = el.project_stage && UserMappedByProjectStage(el.project_stage).element;
          return [
            el.id,
            el.title,
            el.created_by && el.created_by.username,
            userRole ? userRole :  el.project_stage,
            el.tgt_language == null ?"-": el.tgt_language,
            el.project_type,
            <Link to={`/projects/${el.id}`} style={{ textDecoration: "none" }}>
              <CustomButton sx={{ borderRadius: 2 }} label="View" />
            </Link>,
          ];
        })
      : [];
      const CustomFooter = ({ count, page, rowsPerPage, changeRowsPerPage, changePage }) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", 
              justifyContent: { 
                xs: "space-between", 
                md: "flex-end" 
              }, 
              alignItems: "center",
              padding: "10px",
              gap: { 
                xs: "10px", 
                md: "20px" 
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
              "& .MuiInputBase-root.MuiInputBase-colorPrimary.MuiTablePagination-input": {
                marginRight: "10px",
              },
              }}
            />
      
            {/* Jump to Page */}
            <div>
              <label style={{ 
                marginRight: "5px", 
                fontSize:"0.83rem", 
              }}>
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
    responsive: "vertical",

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
      <Grid sx={{ mb: 1 }}>
        <Search />
      </Grid>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          // title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
};

export default ProjectTable;
