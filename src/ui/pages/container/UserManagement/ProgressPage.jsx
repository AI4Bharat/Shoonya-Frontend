import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MyProgress from '../../component/Tabs/MyProgress';
import RecentTasks from '../../component/Tabs/RecentTasks';
import Spinner from "../../component/common/Spinner";
import ToggleMailsAPI from '../../../../redux/actions/api/UserManagement/ToggleMails';
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";


const ProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentTasksLoading, setRecentTasksLoading] = useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const UserDetails = useSelector((state) => state.fetchUserById.data);
  const LoggedInUserId = useSelector((state) => state.fetchLoggedInUserData.data.id);
  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const recentTasksData = useSelector((state) => state.getRecentTasks.data);
  const isRecentTasksLoading = useSelector((state) => state.getRecentTasks.isLoading);

  const fetchUserData = () => {
    setLoading(true);
    setRecentTasksLoading(true);
    const userObj = new FetchUserByIdAPI(id);
    dispatch(APITransport(userObj));
  };

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
    fetchUserData();
    
    return () => {
      setLoading(false);
      setRecentTasksLoading(false);
    };
  }, [id]);

  useEffect(() => {
    if(UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      setLoading(false);
    }
  }, [UserDetails, id]);

  useEffect(() => {
    if (recentTasksData && recentTasksData.results && !isRecentTasksLoading) {
      setRecentTasksLoading(false);
    }
  }, [recentTasksData, isRecentTasksLoading]);

  useEffect(() => {
    setLoading(true);
    setRecentTasksLoading(true);
  }, []);

  return (
    <Grid container>
      {(loading || recentTasksLoading || isRecentTasksLoading) && <Spinner />}
      {renderSnackBar()}
      {userDetails && (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mx: { xs: 2, sm: 3, md: 4 }, fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}>
            <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px", backgroundColor: "ButtonHighlight", textAlign: "center" }}>
              <CardContent>
                <Typography variant="h4">{userDetails?.organization?.title}</Typography>
              </CardContent>
            </Paper>
          </Grid>
  
          {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role) || (LoggedInUserId === userDetails?.id && (userRole.Annotator === loggedInUserData?.role || userRole.Reviewer === loggedInUserData?.role || userRole.SuperChecker === loggedInUserData?.role))) ? (
            <Grid container sx={{ margin: "none" }}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ py: 2, fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}>
                <Card sx={{ borderRadius: "5px", fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: "1rem", sm: "1.2rem" } }}>Recent Tasks</Typography>
                    <RecentTasks />
                  </CardContent>
                </Card>
              </Grid>
  
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ py: 2, fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}>
                <Card sx={{ borderRadius: "5px", fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: "1rem", sm: "1.2rem" } }}>{LoggedInUserId === userDetails?.id ? "My Progress" : `Progress of ${userDetails?.first_name} ${userDetails?.last_name}`}</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 1, display: "flex", justifyContent: "center", color: "red" }}>
              <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, fontWeight: 500 }}>Not Authorised to View Details</Typography>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
};

export default ProfilePage;
