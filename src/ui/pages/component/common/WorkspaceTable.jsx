import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../component/common/Button'
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import tableTheme from "../../../theme/tableTheme";
import Search from "../../component/common/Search";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


const WorkspaceTable = (props) => {
    const dispatch = useDispatch();
    const { showManager, showCreatedBy } = props;
    const workspaceData = useSelector(state => state.GetWorkspace.data);
    const SearchWorkspace = useSelector((state) => state.SearchProjectCards.data);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);

    const getWorkspaceData = () => {
        const workspaceObj = new GetWorkspaceAPI(currentPageNumber);
        dispatch(APITransport(workspaceObj));
    }
    const [isBrowser, setIsBrowser] = useState(false);
    const tableRef = useRef(null);
    const [displayWidth, setDisplayWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        setDisplayWidth(window.innerWidth);
      };

      if (typeof window !== 'undefined') {
        handleResize();
        window.addEventListener('resize', handleResize);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('resize', handleResize);
        }
      };
    }, []);

    useEffect(() => {
      setIsBrowser(true);

      // Force responsive mode after component mount
      const applyResponsiveMode = () => {
        if (tableRef.current) {
          const tableWrapper = tableRef.current.querySelector('.MuiDataTable-responsiveBase');
          if (tableWrapper) {
            tableWrapper.classList.add('MuiDataTable-vertical');
          }
        }
      };

      // Apply after a short delay to ensure DOM is ready
      const timer = setTimeout(applyResponsiveMode, 100);
      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        getWorkspaceData();
    }, [currentPageNumber]);

    useEffect(() => {
        getWorkspaceData();
    }, []);

    const pageSearch = () => {

        return workspaceData.filter((el) => {

            if (SearchWorkspace == "") {

                return el;
            } else if (
                el.workspace_name
                    ?.toLowerCase()
                    .includes(SearchWorkspace?.toLowerCase())
            ) {

                return el;
            }
            else if (
                el.managers?.some(val => val.username
                    ?.toLowerCase().includes(SearchWorkspace?.toLowerCase()) ))           
                    
                 {

                return el;
            }
        })

    }

   
    const columns = [
        {
            name: "id",
            label: "Id",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Manager",
            label: "Manager",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showManager ? "true" : "exclude",
                setCellProps: () => ({ 
                    style: {
                fontSize: "16px",
                    padding: "16px",
                    whiteSpace: "normal", 
                    overflowWrap: "break-word",
                    wordBreak: "break-word",  
                  } 
                  }),
            }
        },
        {
            name: "Created By",
            label: "Created By",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showCreatedBy ? "true" : "exclude",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
            }
        }];
      
    const data = workspaceData && workspaceData.length > 0 ?pageSearch().map((el, i) => {
        return [
            el.id,
            el.workspace_name,
            el.managers.map((manager, index) => {
                return manager.username
            }).join(", "),
            el.created_by && el.created_by.username,
            <Link to={`/workspaces/${el.id}`} style={{ textDecoration: "none" }}>
                <CustomButton
                    sx={{ borderRadius: 2 }}
                    label="View"
                />
            </Link>
        ]
    })  : [];
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
        displaySelectToolbar: false,
        fixedHeader: false,
        filterType: "checkbox",
        download: false,
        print: false,
        rowsPerPageOptions: [10, 25, 50, 100],
        filter: false,
        viewColumns: false,
        selectableRows: "none",
        search: false,
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
        <div>
            <Grid sx={{ mb: 1 }}>
                <Search />
            </Grid>
            {workspaceData && <ThemeProvider theme={tableTheme}>
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
                      borderRadius: '4px',
                      transform: 'none'
                    }}
                  />
                )}
              </div>
            </ThemeProvider>}
        </div>
    )
}

export default WorkspaceTable;
