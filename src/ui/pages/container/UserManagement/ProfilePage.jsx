import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip } from '@mui/material';
import MyProgress from '../../component/Tabs/MyProgress';
import RecentTasks from '../../component/Tabs/RecentTasks';
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import ToggleMailsAPI from '../../../../redux/actions/api/UserManagement/ToggleMails';
import CustomizedSnackbars from "../../component/common/Snackbar";
import roles from "../../../../utils/UserMappedByRole/UserRoles";


const ProfilePage = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const UserDetails = useSelector((state) => state.fetchUserById.data);
  const LoggedInUserId = useSelector((state) => state.fetchLoggedInUserData.data.id);
  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const handleEmailToggle = async () => {
    setLoading(true);
    const mailObj = new ToggleMailsAPI(LoggedInUserId, !userDetails.enable_mail);
    const res = await fetch(mailObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(mailObj.getBody()),
        headers: mailObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "success",
        })
        const userObj = new FetchUserByIdAPI(id);
        dispatch(APITransport(userObj));
    } else {
        setSnackbarInfo({
            open: true,
            message: resp?.message,
            variant: "error",
        })
    }
  }

  const renderSnackBar = () => {
    return (
        <CustomizedSnackbars
            open={snackbar.open}
            handleClose={() =>
                setSnackbarInfo({ open: false, message: "", variant: "" })
            }
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            variant={snackbar.variant}
            message={snackbar.message}
        />
    );
  };
  
  useEffect(() => {
    setLoading(true);
    const userObj = new FetchUserByIdAPI(id);
    dispatch(APITransport(userObj));
  }, [id]);

  useEffect(() => {
    if(UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      setLoading(false);
    }
  }, [UserDetails]);

  return (
      <Grid container spacing={2}>
        {loading && <Spinner />}
        {renderSnackBar()}
          {userDetails && (
            <><Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb:2 }}>
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
                    {LoggedInUserId === userDetails.id &&
                      <Grid container spacing={2} sx={{mt: 1, alignItems: "center"}}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <Tooltip title={(userDetails.enable_mail ? "Disable" : "Enable") + " daily mails"}>
                            <FormControlLabel
                              control={<Switch color="primary" />}
                              label="Daily Mails"
                              labelPlacement="start"
                              checked={userDetails.enable_mail}
                              onChange={handleEmailToggle}
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <CustomButton
                            label="Edit Profile"
                            onClick={() => navigate("/edit-profile")}
                          />
                        </Grid>
                      </Grid>}
                  </CardContent>
                </Card>
                {((roles.filter((role) => role.role === loggedInUserData?.role)[0]?.RecentTasks )||(LoggedInUserId === userDetails?.id && roles.filter((role) => role.role === loggedInUserData?.role)[0]?.AnnotatorRecentTasks ))  &&
                <Card>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>Recent Tasks</Typography>
                    <RecentTasks />
                  </CardContent>
                </Card>
             } 
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 }}>
              <Card sx={{ minWidth: 275, borderRadius: "5px", mb: 2 }}>
                <CardContent>
                  <Typography variant="h4" sx={{mb: 1}}>{userDetails.organization.title}</Typography>
                  {UserMappedByRole(userDetails.role)?.element}
                </CardContent>
              </Card>
               {((roles.filter((role) => role.role === loggedInUserData?.role)[0]?.MyProgress )||(LoggedInUserId === userDetails?.id && roles.filter((role) => role.role === loggedInUserData?.role)[0]?.AnnotatorMyProgress))  &&
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>My Progress</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
                } 
            </Grid></>
          )}
      </Grid>
  )
}

export default ProfilePage;
