import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import DatasetCard from "../../component/common/DatasetCard";
import DatasetStyle from "../../../styles/Dataset";
import GetDatasetsAPI from "../../../../redux/actions/api/Dataset/GetDatasetList";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from "../../component/common/TablePaginationActions";
import Spinner from "../../component/common/Spinner"

const DatasetList = () => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const datasetList = useSelector(state=>state.getDatasetList.data);
    const apiLoading = useSelector(state => state.apiStatus.loading);

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    const getDatasetList = ()=>{
        const datasetObj = new GetDatasetsAPI();
        dispatch(APITransport(datasetObj));     
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

    useEffect(()=>{
        getDatasetList();
    },[]);

    return (
        <React.Fragment>
            {/* <Header /> */}
            {loading && <Spinner /> }
            {datasetList.length > 0 && <Box sx={{margin : "0 auto", pb : 5 }}>
                {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
                <Grid container justifyContent={"center"} rowSpacing={4} spacing={2} columnSpacing={{ xs: 1, sm: 1, md: 3 }} sx={{mb : 3}}>
                    {
                        (rowsPerPage > 0 ? datasetList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : datasetList ).map((el,i)=>{
                            return(
                                <Grid key={el.id} item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <DatasetCard 
                                        classAssigned = {i % 2 === 0 ? classes.projectCardContainer2 : classes.projectCardContainer1}
                                        datasetObj = {el}
                                        index = {i}
                                    />
                                </Grid>
                            )
                        })
                    }
                </Grid>
                <TablePagination
                    component="div"
                    count={datasetList.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[9, 18, 36, 72, { label: 'All', value: -1 }]}
                    onRowsPerPageChange={rowChange}
                    ActionsComponent={TablePaginationActions}
                />
            </Box>}
        </React.Fragment>
    )
}

export default DatasetList;