// Invites

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import MembersTable from "../Project/MembersTable";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";

const Invites = () => {
    const dispatch = useDispatch();
    const {orgId} = useParams();
    const OrganizationUserData = useSelector(state=>state.getOrganizationUsers.data);

    const getOrganizationMembersData = ()=>{
        const organizationUsersObj = new GetOragnizationUsersAPI(orgId);
        dispatch(APITransport(organizationUsersObj));
      }
      
      useEffect(()=>{
        getOrganizationMembersData();
      },[]);

      console.log("OrganizationUserData", OrganizationUserData)
    
    return(
        <MembersTable 
          dataSource = {OrganizationUserData && OrganizationUserData.length > 0 && OrganizationUserData.filter((el,i)=>{return !el.has_accepted_invite})}
        />
    )
}

export default Invites;