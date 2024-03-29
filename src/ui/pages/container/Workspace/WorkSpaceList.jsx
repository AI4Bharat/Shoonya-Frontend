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

export default function WorkSpaces(props) {
 
  //   const classes = DatasetStyle();
  //   const dispatch = useDispatch();
  //   const workspaceData = useSelector(state=>state.getWorkspaces.data);

  //   const getDashboardWorkspaceData = ()=>{
  //   const workspaceObj = new GetWorkspacesAPI(1);
  //   dispatch(APITransport(workspaceObj));
  // }
  
  // useEffect(()=>{
  //   getDashboardWorkspaceData();
  // },[]);
    

  return (
    <React.Fragment>
    {/* <Header /> */}
    <Box sx={{ margin : "0 auto", pb : 5 }}>
        {/* <Typography variant="h5" sx={{mt : 2, mb : 2}}>Visit Workspaces</Typography> */}
        <WorkspaceTable 
          showManager={false} 
          showCreatedBy={false} 
          // workspaceData={workspaceData} 
        />
    </Box>
</React.Fragment>
  )
}
