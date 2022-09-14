import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProjectCard from "../../component/common/ProjectCard";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from 'react-redux';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from "../../component/common/TablePaginationActions";
import Spinner from "../../component/common/Spinner";
import Search from "../../component/common/Search";
import SearchProjectCards from "../../../../redux/actions/api/ProjectDetails/SearchProjectCards";
import Record from "../../../../assets/no-record.svg";
import { useNavigate } from 'react-router-dom';


const Projectcard = (props) => {
    const { projectData } = props
    const classes = DatasetStyle();
    const SearchProject = useSelector((state) => state.SearchProjectCards.data);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(9);
  



    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const rowChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    }


    const pageSearch = () => {

        return projectData.filter((el) => {

            if (SearchProject == "") {

                return el;
            } else if (
                el.project_type
                    ?.toLowerCase()
                    .includes(SearchProject?.toLowerCase())
            ) {

                return el;
            } else if (
                el.project_mode
                    ?.toLowerCase()
                    .includes(SearchProject?.toLowerCase())
            ) {



                return el;
            } else if (
                el.title
                    ?.toLowerCase()
                    .includes(SearchProject?.toLowerCase())
            ) {



                return el;
            } else if (
                el.id.toString()?.toLowerCase()
                    ?.includes(SearchProject.toLowerCase())
            ) {

                return el;
            }


        })

    }


    return (
        <React.Fragment>
            <Search />
            {pageSearch().length > 0 ?
                <Box sx={{ margin: "0 auto", pb: 5 }}>
                    {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
                    <Grid container rowSpacing={4} spacing={2} columnSpacing={{ xs: 1, sm: 1, md: 3 }} sx={{ mb: 3 }}>
                        {

                            pageSearch().map((el, i) => {

                                return (
                                    <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>

                                        <ProjectCard
                                            classAssigned={i % 2 === 0 ? classes.projectCardContainer2 : classes.projectCardContainer1}
                                            projectObj={el}
                                            index={i}
                                        />

                                    </Grid>
                                )
                            }).slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)


                        }

                    </Grid>
                    <TablePagination
                        component="div"
                        count={pageSearch().length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[9, 18, 36, 72, { label: 'All', value: -1 }]}
                        onRowsPerPageChange={rowChange}
                        ActionsComponent={TablePaginationActions}
                    />

                </Box> : SearchProject && <div style={{ background: `url(${Record}) no-repeat center center`, height: '287px', marginTop: '20vh' }}>
                </div>}
        </React.Fragment>
    )
}

export default Projectcard;