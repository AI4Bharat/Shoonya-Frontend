import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../component/common/Header";
import ProjectCard from "../../component/common/ProjectCard";
import WorkspaceTable from "../../component/common/WorkspaceTable";
import DatasetStyle from "../../../styles/Dataset";
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import { useDispatch, useSelector } from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from "../../component/common/TablePaginationActions";
import Search from "../../component/common/Search";
import SearchProjectCards from "../../../../redux/actions/api/ProjectDetails/SearchProjectCards"
import { InputBase, ThemeProvider } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import themeDefault from '../../../theme/theme'

import Spinner from "../../component/common/Spinner"

const Dashboard = () => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const projectData = useSelector(state => state.getProjects.data);

    const apiLoading = useSelector(state => state.apiStatus.loading);

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(9);


    const getDashboardprojectData = () => {
        const projectObj = new GetProjectsAPI();
        dispatch(APITransport(projectObj));   
    }

    const handleChangePage = (e, newPage) => {
        console.log("newPage", newPage);
        setPage(newPage);
    }

    const rowChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }

    useEffect(()=>{
        setLoading(apiLoading);
    },[apiLoading])

    useEffect(() => {
        getDashboardprojectData();
    }, []);

    const SearchProject = useSelector((state) => state.SearchProjectCards.data);
    console.log("loading", apiLoading);


    return (
        <React.Fragment>
            {/* <Header /> */}
            <Search />


            {/* <Box sx={{ margin: "0 auto", pb: 5 }}> */}
            {loading && <Spinner /> }
            {projectData.length > 0 && <Box sx={{ margin: "0 auto", pb: 5 }}>
                {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
                <Grid container rowSpacing={4} spacing={2} columnSpacing={{ xs: 1, sm: 1, md: 3 }} sx={{ mb: 3 }}>
                    {
                        (rowsPerPage > 0 ? projectData.slice(page ) : projectData).filter((el) => {
                            if (SearchProject == "") {
                                return el;
                            } else if (
                                el.project_type,el.title
                                    ?.toLowerCase()
                                    .includes(SearchProject?.toLowerCase())
                            ) {

                                return el;
                            }
                        }).map((el, i) => {
                            console.log(el, "el")
                            return (
                                <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <ProjectCard
                                        classAssigned={i % 2 === 0 ? classes.projectCardContainer2 : classes.projectCardContainer1}
                                        projectObj={el}
                                        index={i}
                                    />
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <TablePagination
                    component="div"
                    count={projectData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[9, 18, 36, 72, { label: 'All', value: -1 }]}
                    onRowsPerPageChange={rowChange}
                    ActionsComponent={TablePaginationActions}
                />
            </Box>
            }
        </React.Fragment>
    )
}

export default Dashboard;