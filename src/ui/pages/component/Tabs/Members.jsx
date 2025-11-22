import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import MembersTable from "../Project/MembersTable";
import GetOragnizationUsersAPI from "../../../../redux/actions/api/Organization/GetOragnizationUsers";
import { CircularProgress } from "@mui/material"; // Import MUI Spinner

const Members = () => {
  const dispatch = useDispatch();
  const { orgId } = useParams();
  const [loading, setLoading] = useState(true);
  const OrganizationUserData = useSelector((state) => state.getOrganizationUsers.data);
  
  useEffect(() => {
    const getOrganizationMembersData = async () => {
      setLoading(true);
      const organizationUsersObj = new GetOragnizationUsersAPI(orgId);
      dispatch(APITransport(organizationUsersObj));
    };

    getOrganizationMembersData();
  }, [dispatch, orgId]);

  // Stop loader when OrganizationUserData is updated
  useEffect(() => {
    if (OrganizationUserData) {
      setLoading(false);
    }
  }, [OrganizationUserData]);


  return (
    <div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <MembersTable dataSource={OrganizationUserData} type="organization" />
      )}
    </div>
  );
};

export default Members;
