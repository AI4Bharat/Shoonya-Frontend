import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import ProjectCard from "../../component/common/ProjectCard";
import WorkspaceTable from "../../component/common/WorkspaceTable";
import dashboardStyle from "../../../styles/dashboard";
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";

const Dashboard = () => {
    const classes = dashboardStyle();
    const dispatch = useDispatch();
    // const projectData = useSelector(state=>state.getProjects.data);
    // const workspaceData = useSelector(state=>state.getWorkspaces.data);
    const [projectData,setProjectData] = useState([]);
    const [workspaceData,setWorkspaceData] = useState([]);

    const getDashboardData = ()=>{
        const projectObj = new GetProjectsAPI();
        const workspaceObj = new GetWorkspacesAPI(1);
        // dispatch(APITransport(projectObj));
        // dispatch(APITransport(workspaceObj));
        fetch(projectObj.apiEndPoint(),{
            method:"GET",
            headers:projectObj.getHeaders().headers
        }).then(async res=>{
            const rsp_data = await res.json();
            if(res.ok){
                setProjectData(rsp_data);
            }
        })

        fetch(workspaceObj.apiEndPoint(),{
            method:"GET",
            headers:workspaceObj.getHeaders().headers
        }).then(async res=>{
            const rsp_data = await res.json();
            if(res.ok){
                setWorkspaceData(rsp_data.results);
            }
        })
    }
    
    useEffect(()=>{
        if(!workspaceData.length || !projectData.length)
        getDashboardData();
    },[]);

    // console.log(projectData,workspaceData);

    return (
        <React.Fragment>
            <Header />
            <Box sx={{ width: window.innerWidth*0.7, margin : "0 auto", pb : 5 }}>
                <Typography variant="h5" sx={{mt : 2, mb : 2}}>Projects</Typography>
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
                <Divider sx={{mt : 3, mb : 3}} />
                <Typography variant="h5" sx={{mt : 2, mb : 2}}>Visit Workspaces</Typography>
                <WorkspaceTable workspaceData={workspaceData} />
            </Box>
        </React.Fragment>
    )
}

export default Dashboard;