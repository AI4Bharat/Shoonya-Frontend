import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import CustomButton from "../common/Button";
import WorkspaceTable from "../common/WorkspaceTable";
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";

const Workspaces = () => {
    const dispatch = useDispatch();
    const workspaceData = useSelector(state=>state.getWorkspaces.data);

    const getDashboardWorkspaceData = ()=>{
        const workspaceObj = new GetWorkspacesAPI(1);
        dispatch(APITransport(workspaceObj));
      }
      
      useEffect(()=>{
        getDashboardWorkspaceData();
      },[]);
    
    return(
        <WorkspaceTable showManager={true} showCreatedBy={true} workspaceData={workspaceData} />
    )
}

export default Workspaces;