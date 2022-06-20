import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import CustomButton from "../common/Button";
import OutlinedTextField from "../common/OutlinedTextField";
import { Divider, Grid, Typography } from "@mui/material";

const OrganizationSettings = (props) => {
    const dispatch = useDispatch();
    
    const {id} = useParams();
    
    // const orgId = useSelector(state=>state.getWorkspacesProjectData.data[0].organization_id);

    const getWorkspaceAnnotatorsData = ()=>{
        
        // const workspaceObjs = new GetWorkspacesAnnotatorsDataAPI(orgId);
       
        // dispatch(APITransport(workspaceObjs));
    }

    // const workspaceAnnotators = useSelector(state=>state.getWorkspacesAnnotatorsData.data);

    useEffect(()=>{
        // getWorkspaceAnnotatorsData();
    },[]);
    // const orgId = workspaceAnnotators &&  workspaceAnnotators
    // console.log("workspaceAnnotators", workspaceAnnotators);


    return (
        <Grid
            container
            direction={"column"}
            sx={{
                alignItems : "center",
                justifyContent : "center"
                // width : "100%"
            }}
        >
                <Typography variant="h4">Edit Organization</Typography>
                <OutlinedTextField sx={{width : "100%", mt : 5}} placeholder = "Organization Name..." />
                <CustomButton label={"Change"} sx={{mt:5, width : "100%", borderRadius : 2}} />
            
        </Grid>
            
       
    )
}

export default OrganizationSettings;