import {
  AppBar, Avatar, Box, Checkbox, Divider, FormControlLabel, Grid, Button, Stack, IconButton, Menu, MenuItem,
  Toolbar, Tooltip, Typography, Tabs, Tab, Badge, Popover, Chip
} from "@mui/material";
import { useEffect, useState } from "react";
import { formatDistanceToNow, format } from 'date-fns';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import GradingSharpIcon from '@mui/icons-material/GradingSharp';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Link, NavLink } from "react-router-dom";
import CustomButton from "../common/Button";
import headerStyle from "../../../styles/header";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationPatchAPI from "../../../../redux/actions/api/Notification/NotificationPatchApi";
import Shoonya_Logo from "../../../../assets/Shoonya_Logo.png";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";
import { useLocation, useNavigate } from "react-router-dom";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import MobileNavbar from "./MobileNavbar";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logout from "../../../../redux/actions/UserManagement/Logout";
import Modal from "./Modal";
import Transliteration from "../../container/Transliteration/Transliteration";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import NotificationAPI from "../../../../redux/actions/api/Notification/Notification";
import UpdateUIPrefsAPI from "../../../../redux/actions/api/UserManagement/UpdateUIPrefs";
import axios from "axios";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [Notification, setnotification] = useState()
  const [activeproject, setActiveproject] = useState("activeButtonproject");
  const [activeworkspace, setActiveworkspace] = useState("");
  const [isSpaceClicked, setIsSpaceClicked] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [unread, setunread] = useState(null)
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [showTransliterationModel, setShowTransliterationModel] =
    useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });


  //below one is for Unreaded notification count countinue from line No. 157
  const [notificationCount, setNotificationCount] = useState(0);

  //const[checkClUI,setCheckClUI]=useState(null)
  const [moreHorizonAnchorEl, setMoreHorizonAnchorEl] = useState(null);

  if (localStorage.getItem("source") !== undefined) {
    localStorage.setItem("source", "shoonya-frontend");
  }

  const handleMoreHorizonClick = (event) => {
    setMoreHorizonAnchorEl(event.currentTarget);
  };

  const handleMoreHorizonClose = () => {
    setMoreHorizonAnchorEl(null);
  };


  const loggedInUserData = useSelector(
    (state) => state?.fetchLoggedInUserData?.data
  );
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch();
  let navigate = useNavigate();
  const location = useLocation();
  const classes = headerStyle();


  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI("me");
    dispatch(APITransport(loggedInUserObj));
  };

  const fetchNotifications = () => {
    let apiObj = new NotificationAPI();
    const endpoint = unread == null ? apiObj.apiEndPoint() : `${apiObj.apiEndPoint()}?seen=${unread}`;
    fetch(endpoint, {
      method: "get",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response?.json();
          setnotification(data);
          console.log(Notification?.length, data);
          // Count unread notifications (assuming they have a 'seen' property)
          // const count = data.filter((notification) => !notification.seen).length;
          // setUnreadCount(count);
          console.log("Notification Count:", data.length);
        } else {
          console.error("Error fetching notifications:", response.status, response.statusText);
          setnotification([]);
          // setUnreadCount(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };
  // Call fetchNotifications when the component mounts
  useEffect(() => {
    // fetchNotifications();
    console.log("Component mounted");
  }, []);

  const markAsRead = (notificationId) => {
    const task = new NotificationPatchAPI(notificationId);
    setSelectedNotificationId(notificationId);
    dispatch(APITransport(task));
    fetchNotifications()

  };

  const markAllAsRead = () => {
    const notificationIds = Notification.map((notification) => notification.id);
    const tasks = new NotificationPatchAPI(notificationIds);
    setSelectedNotificationId(notificationIds)
    dispatch(APITransport(tasks));
    fetchNotifications()

  };

  const handleMarkAllAsReadClick = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  //below one is for Unreaded notification count countinue from line No. 57 and after this from line No. 889
  const fetchUnreadCount = async () => {
    try {
      let apiObj = new NotificationAPI();
      const endpoint = `${apiObj.apiEndPoint()}unread`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: apiObj.getHeaders().headers,
      });
      if (!response.ok) {
        throw new Error(`Error fetching unread notifications: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Assuming the response contains a total_count field
      setNotificationCount(data.total_count || 0);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      setNotificationCount(0);
    }
  };
  // Fetch unread notifications on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

// // from below if we comment that , default call of Notification API is stoped 
  // useEffect(() => {
  //   fetchNotifications();
  // }, [unread, selectedNotificationId]);

  useEffect(() => {
    getLoggedInUserData();
  }, []);


  /* useEffect(()=>{
    if(loggedInUserData?.prefer_cl_ui !== undefined){
      setCheckClUI(loggedInUserData?.prefer_cl_ui)
    }
  },[loggedInUserData]) */

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const onLogoutClick = () => {
    handleCloseUserMenu();
    dispatch(Logout());
    // ExpireSession();
    localStorage.clear();
    navigate("/");
  };

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const keyPress = (e) => {
    if (e.code === "Escape" && showTransliterationModel) {
      handleTransliterationModelClose();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  }, [keyPress]);
  const handleTitleMouseEnter = (event, notificationId) => {
    setPopoverAnchorEl(event.currentTarget);
    setSelectedNotificationId(notificationId);
  };

  const handleTitleMouseLeave = () => {
    setPopoverAnchorEl(null);
    setSelectedNotificationId(null);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setSelectedNotificationId(null);
  };

  const handleopenproject = (id, type) => {
    if (type == "publish_project") {
      navigate(`/projects/${id}`);
    }
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenHelpMenu = (event) => {
    setAnchorElHelp(event.currentTarget);
  };
  const handleCloseHelpMenu = () => {
    setAnchorElHelp(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
  };

  // on click to call api notification from line No. 889
  const handleOpenNotification = (event) => {
    setAnchorElNotification(event.currentTarget);
    // fetchNotifications();// Fetch all notifications on click
  };

  const handleCloseNotification = () => {
    setAnchorElNotification(null);
  };

  const handleRTLChange = (event) => {
    let style;
    if (event.target.checked) {
      localStorage.setItem("rtl", true);
      style = document.createElement("style");
      style.innerHTML = "input, textarea { direction: RTL; }";
      document.head.appendChild(style);
    } else {
      localStorage.setItem("rtl", false);
      style = document.createElement("style");
      style.innerHTML = "input, textarea { direction: unset; }";
      document.head.appendChild(style);
    }
  };

  const handleTranscriptionFlowChange = async (event) => {
    const obj = new UpdateUIPrefsAPI(event.target.checked);
    // dispatch(APITransport(loggedInUserObj));
    const res = await fetch(obj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(obj.getBody()),
      headers: obj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      getLoggedInUserData();
      setSnackbarInfo({
        open: true,
        message: resp.message,
        variant: "success",
      });
    }
  };
  // const handleTabChange = async (index) => {
  //   if (index === 0) {
  //     await setunread(null);
  //   } else if (index === 1) {
  //     await setunread("False");
  //   }
  // };
  const handleTabChange = (newValue) => {
    setValue(newValue);
    setunread(newValue === 0 ? "False" : null);
    fetchNotifications();
  };

  const handleTagsChange = (event) => {
    if (event.target.checked) {
      localStorage.setItem("enableTags", true);
      setSnackbarInfo({
        open: true,
        message: "Please type blackslash ( \\ ) to access the tags",
        variant: "info",
      });
    } else {
      localStorage.setItem("enableTags", false);
    }
  };
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };
  const unseenNotifications = Notification?.length > 0 && Notification?.filter(notification => notification?.seen_json == null || !notification?.seen_json[loggedInUserData.id]);
  console.log(unseenNotifications, 'uuu');

  const renderTabs = () => {
    if (
      userRole.Annotator === loggedInUserData?.role ||
      userRole.Reviewer === loggedInUserData?.role ||
      userRole.SuperChecker === loggedInUserData?.role
    ) {
      return (
        <Grid
          container
          direction="row"
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={7}
        >
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1}
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography> */}
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1 || loggedInUserData.role === 3}
              to="/workspaces"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Workspaces
            </NavLink>
          </Typography> */}
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
          {/* <Typography variant="body1">
            <NavLink
              hidden={loggedInUserData.role === 1}
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography> */}
        </Grid>
      );
    } else if (userRole.WorkspaceManager === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={7}
        >
          {/* <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography> */}
          <Typography variant="body1">
            <NavLink
              to="/workspaces"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Workspaces
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
        </Grid>
      );
    } else if (userRole.OrganizationOwner === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={7}
        >
          <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Admin
            </NavLink>
          </Typography>
        </Grid>
      );
    } else if (userRole.Admin === loggedInUserData?.role) {
      return (
        <Grid
          container
          direction="row"
          // justifyContent="space-evenly"
          // spacing={0}
          columnGap={2}
          rowGap={2}
          xs={12}
          sm={12}
          md={8}
        >
          <Typography variant="body1">
            <NavLink
              to={
                loggedInUserData && loggedInUserData.organization
                  ? `/my-organization/${loggedInUserData.organization.id}`
                  : `/my-organization/1`
              }
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Organization
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Projects
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/datasets"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Datasets
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Analytics
            </NavLink>
          </Typography>
          <Typography variant="body1">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? classes.highlightedMenu : classes.headerMenu
              }
              activeClassName={classes.highlightedMenu}
            >
              Admin
            </NavLink>
          </Typography>
        </Grid>
      );
    } else {
      return null;
    }
  };

  const tabs = [
    <Typography variant="body1">
      <NavLink
        hidden={
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role ||
          userRole.SuperChecker === loggedInUserData?.role ||
          userRole.WorkspaceManager === loggedInUserData?.role
        }
        to={
          loggedInUserData && loggedInUserData.organization
            ? `/my-organization/${loggedInUserData.organization.id}`
            : `/my-organization/1`
        }
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Organization
      </NavLink>
    </Typography>,
    <Typography variant="body1">
      <NavLink
        hidden={userRole.WorkspaceManager !== loggedInUserData?.role}
        to="/workspaces"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Workspaces
      </NavLink>
    </Typography>,
    <Typography variant="body1">
      <NavLink
        to="/projects"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Projects
      </NavLink>
    </Typography>,
    <Typography variant="body1">
      <NavLink
        hidden={
          userRole.Annotator === loggedInUserData?.role ||
          userRole.Reviewer === loggedInUserData?.role ||
          userRole.SuperChecker === loggedInUserData?.role
        }
        to="/datasets"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Datasets
      </NavLink>
    </Typography>,
    <Typography variant="body1">
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Analytics
      </NavLink>
    </Typography>,
    <Typography variant="body1">
      <NavLink
        to="/admin"
        hidden={userRole.Admin !== loggedInUserData?.role}
        className={({ isActive }) =>
          isActive ? classes.highlightedMenu : classes.headerMenu
        }
        activeClassName={classes.highlightedMenu}
      >
        Admin
      </NavLink>
    </Typography>,
  ];

  const userSettings = [
    {
      name: "My Profile",
      onclick: () => {
        handleCloseUserMenu();
        navigate(`/profile/${loggedInUserData.id}`);
      },
    },
    {
      name: "My Progress",
      onclick: () => {
        handleCloseUserMenu();
        navigate(`/progress/${loggedInUserData.id}`);
      },
    },
    {
      name: "Change Password",
      onclick: () => {
        handleCloseUserMenu();
        navigate("/Change-Password");
      },
    },
    { name: "Logout", onclick: () => onLogoutClick() },
  ];

  const appSettings = [
    {
      name: "Transliteration",
      onclick: () => {
        // navigate("/transliteration");
        handleCloseSettingsMenu();
        setShowTransliterationModel(true);
      },
    },
    {
      name: "Enable RTL-typing",
      control: (
        <Checkbox
          onChange={handleRTLChange}
          defaultChecked={localStorage.getItem("rtl") === "true"}
        />
      ),
    },
    /* {
      name: "Use Chitralekha Transcription Flow",
      control: (
        <Checkbox
          onChange={handleTranscriptionFlowChange}
          checked={checkClUI} 
        />
      ),
    }, */
    // {
    //   name: "Enable Tags Dropdown",
    //   control: (
    //     <Checkbox
    //       onChange={handleTagsChange}
    //       defaultChecked={localStorage.getItem("enableTags") === "true"}
    //     />
    //   ),
    // },

    // {
    //   name: "Help",
    //   onclick: () => {},
    // },
  ];
  const helpMenu = [
    {
      name: "Help",
      onclick: () => {
        const url = "https://github.com/AI4Bharat/Shoonya/wiki/Shoonya-FAQ";
        window.open(url, "_blank");
      },
    },

    // {
    //   name: "Feedback",
    //   onclick: () => {},
    // },
  ];

  const handleTransliterationModelClose = () => {
    setShowTransliterationModel(false);
  };

  return (
    <Grid container direction="row" style={{ zIndex: 200 }}>
      <Box
        className={location.pathname.includes("AudioTranscriptionLandingPage") ? classes.AudioparentContainers
          : classes.parentContainer
        }
      >
        {isMobile ? (
          <MobileNavbar
            tabs={tabs}
            userSettings={userSettings}
            appSettings={appSettings}
            loggedInUserData={loggedInUserData}
          />
        ) : (
          <AppBar>
            <Toolbar className={classes.toolbar}>
              <Grid
                sx={{ display: "flex", alignItems: "center" }}
                xs={12}
                sm={12}
                md={3}
              >
                <Link to="/projects">
                  <img
                    src={Shoonya_Logo}
                    alt="logo"
                    className={classes.headerLogo}
                    sx={{ marginTop: "5%" }}
                  />
                </Link>
                <Typography
                  variant="h4"
                  className={classes.headerTitle}
                  sx={{
                    fontSize: "28px",
                    fontWeight: "lighter",
                  }}
                >
                  Shoonya
                </Typography>
              </Grid>

              {/* <Grid
                container
                direction="row"
                // justifyContent="space-evenly"
                // spacing={0}
                columnGap={2}
                rowGap={2}
                xs={12}
                sm={12}
                md={7}
              >
                {tabs.map((tab) => tab)}
              </Grid> */}
              {renderTabs()}
              {renderSnackBar()}
              <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={4}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  sx={{ textAlign: "center", alignItems: "center", }}
                >
                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Notifications">
                      <IconButton onClick={handleOpenNotification}>
                        <Badge badgeContent={notificationCount > 0 ? notificationCount : null} color="primary">
                          <NotificationsIcon color="primary.dark" fontSize="large" />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="help">
                      <IconButton onClick={handleOpenHelpMenu}>
                        <HelpOutlineIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="Settings">
                      <IconButton onClick={handleOpenSettingsMenu}>
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={3} sm={3} md={2}>
                    <Tooltip title="User Options">
                      <IconButton onClick={handleOpenUserMenu}>
                        <Avatar
                          alt="user_profile_pic"
                          variant="contained"
                          src={loggedInUserData?.profile_photo ? loggedInUserData.profile_photo : ''}
                          className={classes.avatar}
                        >
                          {loggedInUserData &&
                            loggedInUserData.username &&
                            loggedInUserData.username.split("")[0]}
                        </Avatar>
                        <Typography
                          variant="body1"
                          color="primary.dark"
                          sx={{ p: 0, ml: 1 }}
                        >
                          {loggedInUserData.username}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElSettings}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElSettings)}
                  onClose={handleCloseSettingsMenu}
                >
                  {appSettings.map((setting) => (
                    <MenuItem key={setting} onClick={setting.onclick}>
                      {setting.control ? (
                        <FormControlLabel
                          control={setting.control}
                          label={setting.name}
                          labelPlacement="start"
                          sx={{ ml: 0 }}
                        />
                      ) : (
                        <Typography variant="body2" textAlign="center">
                          {setting.name}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Typography variant="body2" sx={{ pl: "1rem", mt: 1 }}>
                    Signed in as <b>{loggedInUserData.last_name}</b>
                  </Typography>
                  <Divider sx={{ mb: 2, mt: 1 }} />
                  {userSettings.map((setting) => (
                    <MenuItem key={setting} onClick={setting.onclick}>
                      <Typography variant="body2" textAlign="center">
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElHelp}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElHelp)}
                  onClose={handleCloseHelpMenu}
                >
                  {helpMenu.map((help) => (
                    <MenuItem key={help} onClick={help.onclick}>
                      {help.control ? (
                        <FormControlLabel
                          control={help.control}
                          label={help.name}
                          labelPlacement="start"
                          sx={{ ml: 0 }}
                        />
                      ) : (
                        <Typography variant="body2" textAlign="center">
                          {help.name}
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Menu>

                <Menu
                  sx={{ mt: "45px", display: "flex", flexDirection: "row" }}
                  id="menu-appbar"
                  anchorEl={anchorElNotification}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}

                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  style={{ overflow: "scroll" }}
                  open={Boolean(anchorElNotification)}
                  onClose={handleCloseNotification}
                >
                  <Stack direction="row" style={{ justifyContent: "space-between", padding: "0 10px 0 10px" }} >
                    <Typography variant="h4">Notifications</Typography>
                    {Notification && Notification?.length > 0 && unseenNotifications?.length > 0 ? <Tooltip title="Mark all as read">
                      <IconButton aria-label="More" onClick={handleMarkAllAsReadClick}>
                        <GradingSharpIcon color="primary" />
                      </IconButton>
                    </Tooltip> : null}
                  </Stack>

                  <Stack direction="row" spacing={2} style={{ padding: "0 0 10px 10px" }}>
                    <Tabs value={value} onChange={handleChange} sx={{
                      '& .MuiTabs-indicator': {
                        backgroundColor: theme => theme.palette.primary.main,
                      }
                    }}>
                      <Tab label="All" onClick={() => handleTabChange(0)} />
                      <Tab label="Unread" onClick={() => handleTabChange(1)} />
                    </Tabs>
                  </Stack>

                  {Notification && Notification?.length > 0 ? (
                    <>
                      {Notification.map((notification, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                          <div style={{ marginRight: '10px', cursor: "pointer" }}>
                            <FiberManualRecordIcon color={notification?.seen_json
                              ? notification?.seen_json[loggedInUserData.id]
                                ? 'action'
                                : 'primary'
                              : "primary"} />
                          </div>
                          <Link style={{ color: "rgba(0, 0, 0, 0.87)", display: 'flex', flexDirection: 'column', width: '100%', cursor: "pointer", textDecoration: "none" }} to={notification.on_click}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                              <Typography variant="subtitle2">{`ID: ${notification?.title?.split('-')[0]}`}</Typography>
                              <Typography style={{ paddingLeft: "10px" }} variant="subtitle2">{`TITLE: ${notification?.notification_type}`}</Typography>
                              <Typography style={{ padding: "5px 5px 0px 5px" }} variant="caption" color="action">{`${formatDistanceToNow(new Date(notification?.created_at), { addSuffix: true })}`}
                              </Typography>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                              <Typography style={{ justifyContent: "flex-start", width: '100%' }} variant="body2">{notification?.title?.split('-')[1]}</Typography>
                              {notification?.seen_json == null || !notification?.seen_json[loggedInUserData.id] ?
                                <Tooltip title="Mark as read">
                                <IconButton aria-label="More" onClick={() => handleMarkAsRead(notification?.id)}>
                                  <CheckCircleOutlineRoundedIcon color="primary" />
                                </IconButton>
                                </Tooltip> : null}
                            </div>
                            <Typography variant="caption" color="action">{`Sent on: ${format(new Date(notification?.created_at), 'MMM d, yyyy')}`}
                            </Typography>
                            {index !== Notification?.length - 1 && <Divider />}
                          </Link>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <NotificationsOffIcon color="disabled" fontSize="large" />
                      <Typography variant="h5" color="textSecondary" style={{ marginTop: '10px' }}>
                        No notifications found
                      </Typography>
                    </div>
                  )}


                </Menu>
                <Popover
                  open={Boolean(moreHorizonAnchorEl)}
                  anchorEl={moreHorizonAnchorEl}
                  onClose={handleMoreHorizonClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleMarkAllAsReadClick}>Mark All as read</MenuItem>
                </Popover>
                <Popover
                  open={Boolean(popoverAnchorEl)}
                  anchorEl={popoverAnchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >

                  <MenuItem onClick={handleMarkAsRead}>Mark as Read</MenuItem>

                </Popover>

              </Box>
            </Toolbar>
          </AppBar>
        )}
      </Box>
      <Modal
        open={showTransliterationModel}
        onClose={() => handleTransliterationModelClose}
        top={50}
        left={50}
        topTranslate={"40"}
        leftTranslate={"-50"}
        isTransliteration={true}
      // sx={{width: "400px"}}
      >
        <Transliteration
          onCancelTransliteration={() => handleTransliterationModelClose}
          setIsSpaceClicked={setIsSpaceClicked}
          isSpaceClicked={isSpaceClicked}
          setShowTransliterationModel={setShowTransliterationModel}

        />
      </Modal>
    </Grid>
  );
};

export default Header;
