import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, CardContent, Chip, Grid, Tab, Tabs, Typography } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';

const ProfilePage = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState(null);

  const UserDetails = useSelector((state) => state.fetchUserById.data);
  
  useEffect(() => {
    const userObj = new FetchUserByIdAPI(id);
    dispatch(APITransport(userObj));
  }, []);

  useEffect(() => {
    if(UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
    }
  }, [UserDetails]);


  return (
      <Grid container spacing={2}>
          {userDetails && (
            <><Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px" }}>
                  <CardContent>
                    <Avatar
                      alt="user_profile_pic"
                      variant="contained"
                      sx={{ color: "#FFFFFF !important", bgcolor: "#2A61AD !important", width: 96, height: 96, mb: 2 }}
                    >
                      {userDetails.username.split("")[0]}
                    </Avatar>
                    <Typography variant="h3">
                      {userDetails.first_name} {userDetails.last_name}
                    </Typography>
                    <Typography variant="subtitle1" sx={{mb: 1}}>
                      {userDetails.username}
                    </Typography>
                    <Typography variant="body1" sx={{display: "flex", gap: "5px", alignItems: "center"}}>
                      <MailOutlineIcon />{userDetails.email}
                    </Typography>
                    {userDetails.phone && <Typography variant="body1" sx={{display: "flex", gap: "5px", alignItems: "center"}}>
                      <PhoneOutlinedIcon />{userDetails.phone}
                    </Typography>}
                    {userDetails.languages.length > 0 && (
                      <Typography variant="body1">Languages: 
                        {userDetails.languages.map
                          (lang => <Chip label={lang} variant="outlined" sx={{ ml: 1 }}></Chip>
                        )}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ p: 2 }}>
              <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                <CardContent>
                  <Typography variant="h4" sx={{mb: 1}}>{userDetails.organization.title}</Typography>
                  {UserMappedByRole(userDetails.role).element}
                </CardContent>
                </Card>
            </Grid></>
          )}
      </Grid>
  )
}

export default ProfilePage;
