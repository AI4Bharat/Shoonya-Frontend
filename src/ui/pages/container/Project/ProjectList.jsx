import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import ProjectCard from "../../component/common/ProjectCard";
import WorkspaceTable from "../../component/common/WorkspaceTable";
import DatasetStyle from "../../../styles/Dataset";
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";

const Dashboard = () => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const projectData = useSelector(state=>state.getProjects.data);
  

    const getDashboardprojectData = ()=>{
        const projectObj = new GetProjectsAPI();
        dispatch(APITransport(projectObj));
        
    }
    
    useEffect(()=>{
        getDashboardprojectData();
    },[]);


    return (
        <React.Fragment>
            {/* <Header /> */}
            <Box sx={{ width: window.innerWidth*0.7, margin : "0 auto", pb : 5 }}>
                {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography> */}
                <Grid container sx={{alignItems : "center"}} rowSpacing={4} spacing={2} columnSpacing={{ xs: 1, sm: 1, md: 3 }}>
                    {
                        projectData.map((el,i)=>{
                            return(
                                <Grid key={el.id} item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <ProjectCard 
                                        classAssigned = {i % 2 === 0 ? classes.projectCardContainer2 : classes.projectCardContainer1}
                                        projectObj = {el}
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

export default Dashboard;