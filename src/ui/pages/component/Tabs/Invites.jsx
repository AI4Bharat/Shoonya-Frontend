// Invites

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
import GetManagerSuggestionsAPI from "../../../../redux/actions/api/Organization/GetManagerSuggestions";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { FormControl } from "@mui/material";


const Invites = (props) => {
    const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
    const {hideButton,reSendButton} = props;
    const dispatch = useDispatch();
    const { orgId } = useParams();
    const OrganizationUserData = useSelector(state => state.getOrganizationUsers.data);
    const ManagerSuggestions = useSelector(state => state.getManagerSuggestions.data);
    const [tabValue, setTabValue] = useState(0);

    const getOrganizationMembersData = () => {
        const organizationUsersObj = new GetOragnizationUsersAPI(orgId);
        dispatch(APITransport(organizationUsersObj));
        console.log(OrganizationUserData)
    }

    const getManagerSuggestions = () => {
        const managerSuggestionsObj = new GetManagerSuggestionsAPI(orgId);
        dispatch(APITransport(managerSuggestionsObj));
    }
    const handleTabChange = (e, v) => {
        setTabValue(v);
    }

    useEffect(() => {
        getManagerSuggestions();
        getOrganizationMembersData();
    }, [tabValue]);

    return (
        <React.Fragment>
        <FormControl>
              <Box sx={{mb:2,}} >

            {userDetails && userDetails.role === 6 &&  
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Invited Users" sx={{ fontSize: 17, fontWeight: '700' }} />
                    <Tab label="Manager Suggestions" sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                </Tabs>
            }
            </Box> 
        </FormControl>

        {tabValue === 0 ?
            <MembersTable
            key={1}
            reSendButton ={reSendButton}
            hideViewButton={false}
            showInvitedBy={false}
            hideButton = {hideButton ? hideButton : false}
            dataSource={OrganizationUserData && OrganizationUserData.length > 0 && OrganizationUserData.filter((el, i) => { return !el.has_accepted_invite })}
            />
            : <>
            <MembersTable
            key={2}
            hideViewButton={true}
            showInvitedBy={true}
            hideButton = {hideButton ? hideButton : false}
            approveButton = {true}
            rejectButton = {true}
            dataSource={ManagerSuggestions && ManagerSuggestions.length > 0 && ManagerSuggestions.filter((el, i) => { return !el.has_accepted_invite })}
            />
            </>
        }
        
        </React.Fragment>
    )
}

export default Invites;