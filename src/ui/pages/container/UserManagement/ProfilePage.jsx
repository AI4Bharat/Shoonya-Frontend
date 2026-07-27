import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FetchUserByIdAPI from '../../../../redux/actions/api/UserManagement/FetchUserById';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, IconButton, Card, CardContent, Chip, Grid, Typography, Switch, FormControlLabel, Tooltip, Paper, ThemeProvider } from '@mui/material';
import { Input, inputClasses } from '@mui/base/Input';
import MyProgress from '../../component/Tabs/MyProgress';
import RecentTasks from '../../component/Tabs/RecentTasks';
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';
import ToggleMailsAPI from '../../../../redux/actions/api/UserManagement/ToggleMails';
import UpdateProfileImageAPI from '../../../../redux/actions/api/UserManagement/UpdateProfileImage'
import CustomizedSnackbars from "../../component/common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import MyProfile from "../../container/UserManagement/ProfileDetails"
import ScheduleMails from "../../container/UserManagement/ScheduleMails"
import axios from 'axios';
import { getUserProjects } from '../../../../utils/bookmarkService';
import BookmarkButton from '../Project/BookmarkButton';
import tableTheme from '../../../theme/tableTheme';
import MUIDataTable from 'mui-datatables';

const ProfilePage = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [avatarOverley,setAvatarOverley] = useState(false)
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

  const onImageChangeHandler=async (event)=>{
    if(event.target.files && event.target.files.length!==0){
      setLoading(true);
      let pickedFile=event.target.files[0];
      const updateProfileImageAPIObj = new UpdateProfileImageAPI(LoggedInUserId,pickedFile);
      await axios.post(updateProfileImageAPIObj.apiEndPoint(), updateProfileImageAPIObj.getBody(), updateProfileImageAPIObj.getHeaders())
        .then(response => {
          console.log(response.status)
          if (response.status == 200 || response.status == 201) {
            const userObj = new FetchUserByIdAPI(id);
            dispatch(APITransport(userObj));
            setLoading(false);
            console.log("updateProfileImageData -----", response);
          } else {
            setLoading(false);
          }
        })
        .catch(err => {
          setLoading(false);
          console.log("err - ", err);
        })
      }
  }

  const handleavatarOverleyOpen = () => {
    setAvatarOverley(true)
  };

  const handleavatarOverleyClose = () => {
    setAvatarOverley(false)
  };

  useEffect(() => {
    setLoading(true);
    const userObj = new FetchUserByIdAPI(id);
    dispatch(APITransport(userObj));
  }, [id]);

  useEffect(() => {
    if (UserDetails && UserDetails.id == id) {
      setUserDetails(UserDetails);
      setLoading(false);
    }
  }, [UserDetails]);

  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);
  const [bookmarkedLoading, setBookmarkedLoading] = useState(false);
  const fetchBookmarkedProjects = async () => {
    setBookmarkedLoading(true);
    try {
      const data = await getUserProjects();
      setBookmarkedProjects(data.results || []);
    } catch (error) {
      console.error('Error fetching bookmarked projects:', error);
      setSnackbarInfo({
        open: true,
        message: "Failed to fetch bookmarked projects",
        variant: "error",
      });
    }
    setBookmarkedLoading(false);
  };
  useEffect(() => {
    if (userDetails?.id) {
      fetchBookmarkedProjects();
    }
  }, [userDetails?.id]);
  const handleBookmarkChange = (projectId, bookmarked) => {
    if (!bookmarked) {
      setBookmarkedProjects((prev) =>
        prev.filter((proj) => proj.id !== projectId)
      );
    }
  };
  const bookmarkedColumns = [
    {
      name: "id",
      label: "Project Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "title",
      label: "Project Title",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "project_type",
      label: "Project Type",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "project_stage",
      label: "Project Stage",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "tgt_language",
      label: "Target Language",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "workspace_id",
      label: "Workspace Id",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    },
    {
      name: "action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        customBodyRender: (value, tableMeta) => {
          const rowData = tableMeta.rowData;
          const projectId = rowData[0];
          return (
            <div style={{display:"flex", wordBreak:"normal", alignItems:"center"}}>
              <Link to={`/projects/${projectId}`} style={{ textDecoration: "none" }}>
                <CustomButton
                  sx={{ borderRadius: 2, marginRight: 2 }}
                  label="View"
                />
              </Link>
              <BookmarkButton
                projectId={projectId}
                isBookmarked={true}
                onBookmarkChange={handleBookmarkChange}
              />
            </div>
          );
        },
        setCellProps: () => ({
          style: {
            height: "70px",
            fontSize: "16px",
            padding: "16px",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }
        }),
      },
    }
  ];
  const bookmarkedTableOptions = {
    textLabels: {
      body: {
        noMatch: "No bookmarked projects found",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [5, 10, 25],
    filter: false,
    viewColumns: false,
    selectableRows: "none",
    search: false,
    responsive: "vertical",
  };

  return (
    <Grid container spacing={2}>
      {loading && <Spinner />}
      {renderSnackBar()}
      {userDetails && (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
            <Paper variant="outlined" sx={{ minWidth: 275, borderRadius: "5px", backgroundColor: 'ButtonHighlight', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4">{userDetails.organization.title}</Typography>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ p: 2 }}>
            <Card sx={{ borderRadius: "5px", mb: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', position:'relative' }}>
                <Card sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', border: "none" }}>
                  <Input accept="image/*" id="upload-avatar-pic" type="file" hidden onChange={onImageChangeHandler}/>
                  {avatarOverley && <AddPhotoAlternateIcon sx={{position:'absolute'}}/>}
                  <label htmlFor="upload-avatar-pic">
                      <IconButton component="span">
                          <Avatar
                            alt="user_profile_pic"
                            variant="contained"
                            src={userDetails?.profile_photo?userDetails.profile_photo:''}
                            sx={{ 
                              color: "#FFFFFF !important",
                              bgcolor: "#2A61AD !important",
                              width: 96,
                              height: 96,
                              mb: 2,
                              alignSelf: 'center',
                              ":hover": {opacity:'0.5'}
                            }}
                            onMouseEnter={handleavatarOverleyOpen} 
                            onMouseLeave={handleavatarOverleyClose}
                          >
                            {userDetails.username.split("")[0]}
                          </Avatar>
                      </IconButton>
                  </label>
                  <Typography variant="h3" sx={{ alignSelf: 'center', mb: 2 }}>
                    {UserMappedByRole(userDetails.role).element}
                  </Typography>

                </Card>
                <Typography variant="h3" sx={{ mb: 1, alignSelf: 'center', textAlign: 'center' }}>
                  {userDetails.first_name} {userDetails.last_name}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 1, alignSelf: 'center', textAlign: 'center' }}>
                  {userDetails.username}
                </Typography>
                <Card style={{ alignSelf: 'center', border: "none", boxShadow: "none", alignItems: "center", textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <MailOutlineIcon />{userDetails.email}
                  </Typography>
                  {userDetails.phone && <Typography variant="body1" sx={{ alignItems: "center", alignSelf: 'center' }}>
                    <PhoneOutlinedIcon />{userDetails.phone}
                  </Typography>}
                </Card>
                {userDetails.languages.length > 0 && (
                  <Typography variant="body1" sx={{ display: "flex", gap: "5px", alignItems: "center", alignSelf: 'center', textAlign: 'center' }}>Languages:
                    {userDetails.languages.map
                      (lang => <Chip label={lang} variant="outlined" sx={{ ml: 1 }}></Chip>
                      )}
                  </Typography>
                )}
                {/* {LoggedInUserId === userDetails.id && */}
                {(userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role || LoggedInUserId === userDetails?.id) &&
                  <Grid container spacing={2} sx={{ mt: 1, alignItems: "center", display: 'inline-flex', justifyContent: 'center' }}>
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
                    {/* <Grid item>
                          <CustomButton
                            label="Edit Profile"
                            onClick={() => navigate("/edit-profile")}
                          />
                        </Grid> */}
                    <Grid item>
                      <CustomButton
                        label="View Progress"
                        onClick={() => navigate(`/progress/${UserDetails.id}`)}
                      />
                    </Grid>
                  </Grid>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ p: 2 }}>
            {/* {((userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role )||(LoggedInUserId === userDetails?.id && userRole.Annotator === loggedInUserData?.role))  &&
                <Card sx={{ minWidth: 275, borderRadius: "5px" }}>
                  <CardContent>
                    <Typography variant="h4" sx={{mb: 1}}>My Progress</Typography>
                    <MyProgress />
                  </CardContent>
                </Card>
                }  */}
            <Card sx={{ borderRadius: "5px", mb: 2 }}>
              <MyProfile />
            </Card>
          </Grid>
          {LoggedInUserId === userDetails?.id && (userRole.WorkspaceManager === loggedInUserData?.role || userRole.OrganizationOwner === loggedInUserData?.role || userRole.Admin === loggedInUserData?.role) &&
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <ScheduleMails />
              </Card>
            </Grid>
          }
          {LoggedInUserId === userDetails?.id && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ p: 2 }}>
              <Card sx={{ borderRadius: "5px", mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Bookmarked Projects
                  </Typography>
                  {bookmarkedLoading ? (
                    <Spinner />
                  ) : (
                    <ThemeProvider theme={tableTheme}>
                      <MUIDataTable
                        title=""
                        data={bookmarkedProjects}
                        columns={bookmarkedColumns}
                        options={bookmarkedTableOptions}
                      />
                    </ThemeProvider>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </>
      )}
    </Grid>
  )
}

export default ProfilePage;
