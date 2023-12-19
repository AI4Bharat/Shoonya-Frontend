import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip, Paper } from '@mui/material';
import MyProgress from '../../component/Tabs/MyProgress';
import RecentTasks from '../../component/Tabs/RecentTasks';
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import ToggleMailsAPI from '../../../../redux/actions/api/UserManagement/ToggleMails';
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";


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
            <>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
                <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px" ,backgroundColor:'ButtonHighlight', textAlign:'center'}}>
                  <CardContent>
                    <Typography variant="h4">{userDetails.organization.title}</Typography>
                  </CardContent>
                </Paper>
              </Grid>
              {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role )||(LoggedInUserId === userDetails?.id && (userRole.Annotator === loggedInUserData?.role || userRole.Reviewer === loggedInUserData?.role || userRole.SuperChecker === loggedInUserData?.role ) )) ?
              <>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 , display:'flex', justifyContent:'center' }}>
                  
                  <Card>
                    <CardContent>
                      <Typography variant="h4" sx={{mb: 1}}>Recent Tasks</Typography>
                      <RecentTasks />
                    </CardContent>
                  </Card> 
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ p: 2 }}>
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>{LoggedInUserId===userDetails.id?  "My Progress": `Progress of ${userDetails?.first_name} ${userDetails?.last_name}` }</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
              
              </Grid>
              </>:
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 1, display:'flex', justifyContent:'center', color: 'red'  }}>
                  <Typography variant="h4" sx={{mb: 1}}>{"Not Authorised to View Details"}</Typography>
              </Grid>
              }
              </>
          )}
      </Grid>
  )
}

export default ProfilePage;
