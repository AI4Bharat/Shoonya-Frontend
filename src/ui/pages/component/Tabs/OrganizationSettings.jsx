import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import CustomButton from "../common/Button";
import OutlinedTextField from "../common/OutlinedTextField";
import { Divider, Grid, Typography } from "@mui/material";
import EditOrganizationAPI from "../../../../redux/actions/api/Organization/EditOrganization";

const OrganizationSettings = (props) => {
    const dispatch = useDispatch();
    const [organizationName, setOrganizationName] = useState("");
    let navigate = useNavigate();
        
    const orgId = useSelector(state=>state.fetchLoggedInUserData.data.organization.id);
    const orgName = useSelector(state=>state.fetchLoggedInUserData.data.organization.title);


    const onSubmitClick = ()=>{
        
        const organizationDataObj = new EditOrganizationAPI(orgId, organizationName);
       
        dispatch(APITransport(organizationDataObj));
        
        navigate(`/my-organization/${orgId}`)

    }


    useEffect(()=>{
        setOrganizationName(orgName ? orgName : "");
    },[]);

    return (
        <Grid
            container
            direction={"column"}
            sx={{
                alignItems : "center",
                justifyContent : "center"
            }}
        >
                <Typography variant="h4">Edit Organization</Typography>
                <OutlinedTextField 
                    value={organizationName}
                    onChange={e=>setOrganizationName(e.target.value)}
                    sx={{width : "100%", mt : 5}} 
                    placeholder = "Organization Name..." 
                    />
                <CustomButton 
                    label={"Change"} 
                    onClick={()=>onSubmitClick()}
                    sx={{mt:5, width : "100%", borderRadius : 2}} 
                />
            
        </Grid>
            
       
    )
}

export default OrganizationSettings;