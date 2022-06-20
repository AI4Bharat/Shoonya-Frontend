import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import DatasetCard from "../../component/common/DatasetCard";
import DatasetStyle from "../../../styles/Dataset";
import GetDatasetsAPI from "../../../../redux/actions/api/Dataset/GetDatasetList";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';

const DatasetList = () => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const datasetList = useSelector(state=>state.getDatasetList.data);
    const getDatasetList = ()=>{
        const datasetObj = new GetDatasetsAPI();
        dispatch(APITransport(datasetObj));
        
    }
    
    useEffect(()=>{
        getDatasetList();
    },[]);

    return (
        <React.Fragment>
            {/* <Header /> */}
            <Box sx={{margin : "0 auto", pb : 5 }}>
                {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
                <Grid container justifyContent={"center"} rowSpacing={4} spacing={2} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                    {
                        datasetList.map((el,i)=>{
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
                
            </Box>
        </React.Fragment>
    )
}

export default DatasetList;