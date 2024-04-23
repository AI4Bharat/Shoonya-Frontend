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

const mockdata = [
    {
        "id": 316,
        "username": "Translator Gujarati - LSB",
        "email": "translatorguj1@gmail.com",
        "first_name": "",
        "last_name": "",
        "role": 2,
        "invited_by": "Vasudev Aital",
        "has_accepted_invite": true
    },
    {
        "id": 320,
        "username": "rmanojvarma",
        "email": "rmanojvarma@gmail.com",
        "first_name": "Manoj",
        "last_name": "varma",
        "role": 3,
        "invited_by": "Vasudev Aital",
        "has_accepted_invite": true
    },
    {
        "id": 344,
        "username": "sandesh",
        "email": "sandeshprabhudesai@gmail.com",
        "first_name": "Sandesh",
        "last_name": "Prabhudesai",
        "role": 3,
        "invited_by": "Vasudev Aital",
        "has_accepted_invite": true
    },
    {
        "id": 383,
        "username": "Vasudev Aital",
        "email": "vasu.aital@gmail.com",
        "first_name": "Vasudev",
        "last_name": "Aital",
        "role": 2,
        "invited_by": "Vasudev Aital",
        "has_accepted_invite": true
    },
    {
        "id": 148,
        "username": "dhakaram.kafle@gmail.com",
        "email": "dhakaram.kafle@gmail.com",
        "first_name": "Dhaka Ram",
        "last_name": "Kafle",
        "role": 2,
        "invited_by": "Vasudev Aital",
        "has_accepted_invite": true
    },
]

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
    }, []);

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