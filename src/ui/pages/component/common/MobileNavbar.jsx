import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  Grid,
  AppBar,
  Divider,
  Avatar,
  Typography,
  Box,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { NavLink, Link } from "react-router-dom";
import Shoonya_Logo from "../../../../assets/Shoonya_Logo.png";
import headerStyle from "../../../styles/header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import GradingSharpIcon from "@mui/icons-material/GradingSharp";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import Tooltip from "@mui/material/Tooltip";
import { Menu, Close } from "@mui/icons-material";
import NotificationAPI from "../../../../redux/actions/api/Notification/Notification";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import NotificationPatchAPI from "../../../../redux/actions/api/Notification/NotificationPatchApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "50%",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "50%",
    padding: "0",
    overflowX: "hidden",
    transition: "all 0.3s ease-in-out",
  },
  menuButton: {
    color: theme.palette.primary.main,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(90deg)",
    },
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 10,
    color: theme.palette.text.secondary,
    transition: "all 0.2s ease",
    "&:hover": {
      color: theme.palette.primary.main,
      transform: "rotate(90deg)",
    },
  },
  listItem: {
    cursor: "pointer",
    padding: "12px 32px",
    borderRadius: "8px",
    margin: "4px 16px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transform: "translateX(5px)",
    },
  },
  profileBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  avatar: {
    backgroundColor: "#2e5cb8",
    width: 45,
    height: 45,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  sectionTitle: {
    fontSize: "0.85rem",
    fontWeight: 600,
    paddingX: "32px",
    marginX: "16px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "rgba(0, 0, 0, 0.6)",
    padding: "16px 16px 8px 16px",
  },
  logoutItem: {
    cursor: "pointer",
    padding: "12px 32px",
    borderRadius: "8px",
    margin: "4px 16px",
    color: "#f44336",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      transform: "translateX(5px)",
    },
  },
  appBar: {
    backgroundColor: "#ffffff",
    padding: "8px 0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  headerLogo: {
    height: "40px",
    marginRight: "10px",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "500",
    fontFamily: "Rowdies,cursive,Roboto,sans-serif",
    color: "#2e5cb8",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#1a3a7a",
    },
  },
}));

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Increased width to better fit tabs
    bgcolor: "background.paper",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
  };
  

function MobileNavbar(props) {
  const { loggedInUserData, appSettings, userSettings, tabs, appInfo } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const headerClasses = headerStyle();
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [Notification, setnotification] = useState();
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [unread, setunread] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const fetchNotifications = () => {
    let apiObj = new NotificationAPI();
    const endpoint =
      unread == null
        ? apiObj.apiEndPoint()
        : `${apiObj.apiEndPoint()}?seen=${unread}`;

    fetch(endpoint, {
      method: "get",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response?.json();
          setnotification(data);
        } else {
          setnotification([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const markAsRead = (notificationId) => {
    const task = new NotificationPatchAPI(notificationId);
    setSelectedNotificationId(notificationId);
    dispatch(APITransport(task));
    fetchNotifications();
  };

  const markAllAsRead = () => {
    const notificationIds = Notification.map((notification) => notification.id);
    const tasks = new NotificationPatchAPI(notificationIds);
    setSelectedNotificationId(notificationIds);
    dispatch(APITransport(tasks));
    fetchNotifications();
  };

  const handleMarkAllAsReadClick = () => {
    markAllAsRead();
  };

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  useEffect(() => {
    fetchNotifications();
  }, [unread, selectedNotificationId]);

  const handleOpenModal = () => {
    setOpenModal(true);
    setOpenDrawer(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const unseenNotifications =
    Notification?.length > 0 &&
    Notification?.filter(
      (notification) =>
        notification?.seen_json == null ||
        !notification?.seen_json[loggedInUserData.id]
    );

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

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
        transitionDuration={{ enter: 400, exit: 300 }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            position: "relative",
          }}
        >
          <IconButton
            className={classes.closeButton}
            onClick={() => setOpenDrawer(false)}
          >
            <CloseIcon />
          </IconButton>

          <Box>
            <NavLink
              to={`/profile/${loggedInUserData.id}`}
              onClick={() => setOpenDrawer(false)}
              style={{ textDecoration: "none" }}
            >
              <Box className={classes.profileBox}>
                <Avatar alt="user_profile_pic" className={classes.avatar}>
                  {loggedInUserData?.username?.[0]}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#000",
                      fontWeight: 500,
                      fontSize: "1.1rem",
                    }}
                  >
                    {loggedInUserData.username}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ color: "rgba(0,0,0,0.6)", fontSize: "0.85rem" }}
                  >
                    View Profile
                  </Typography>
                </Box>
              </Box>
            </NavLink>

            <Typography className={classes.sectionTitle}>
              Organization
            </Typography>
            <List>
              {tabs.map((tab, i) => (
                <ListItem
                  key={i}
                  className={classes.listItem}
                  onClick={() => setOpenDrawer(false)}
                >
                  {tab}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box>
            <Typography className={classes.sectionTitle}>
              App Information
            </Typography>
            <Divider style={{ margin: "0 16px" }} />
            <List>
              {appInfo.map((setting, index) => (
                <ListItem
                  key={index}
                  className={classes.listItem}
                  onClick={() => {
                    if (setting.name === "Notifications") {
                      handleOpenModal();
                    } else {
                      setting.onclick();
                    }
                  }}
                >
                  {setting.control ? (
                    <FormControlLabel
                      control={setting.control}
                      label={
                        <Typography style={{ fontSize: "0.95rem" }}>
                          {setting.name}
                        </Typography>
                      }
                    />
                  ) : (
                    <Typography variant="body1">{setting.name}</Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box style={{ marginBottom: 16 }}>
            <Typography className={classes.sectionTitle}>
              App Settings
            </Typography>
            <Divider style={{ margin: "0 16px" }} />
            <List>
              {appSettings.map((setting, index) => (
                <ListItem
                  key={index}
                  className={
                    setting.name === "Logout"
                      ? classes.logoutItem
                      : classes.listItem
                  }
                  onClick={setting.onclick}
                >
                  {setting.control ? (
                    <FormControlLabel
                      control={setting.control}
                      label={setting.name}
                    />
                  ) : (
                    <Typography variant="body1" textAlign="center">
                      {setting.name}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          <Box style={{ marginBottom: 16 }}>
            <Typography className={classes.sectionTitle}>
              User Settings
            </Typography>
            <Divider style={{ margin: "0 16px" }} />
            <List>
              {userSettings.map((setting, index) => (
                <ListItem
                  key={index}
                  className={
                    setting.name === "Logout"
                      ? classes.logoutItem
                      : classes.listItem
                  }
                  onClick={() => {
                    setting.onclick();
                    setOpenDrawer(false);
                  }}
                >
                  <Typography
                    variant="body1"
                    style={setting.name === "Logout" ? { fontWeight: 500 } : {}}
                  >
                    {setting.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <AppBar position="fixed" className={classes.appBar}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{
            padding: "0 5%",
          }}
        >
          <Grid item style={{ display: "flex", alignItems: "center" }}>
            <Link to="/projects" style={{ textDecoration: "none" }}>
              <img
                src={Shoonya_Logo}
                alt="Shoonya"
                className={classes.headerLogo}
              />
            </Link>
            <Typography variant="h4" className={classes.headerTitle}>
              Shoonya
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              className={classes.menuButton}
              onClick={() => setOpenDrawer(!openDrawer)}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AppBar>

      {/* Modal for Notification */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="notification-modal-title"
        aria-describedby="notification-modal-description"
      >
        <Box>
          <Typography
            id="notification-modal-title"
            variant="h6"
            component="h2"
          >
            Notifications
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              {/* Content for All notifications */}
              <Typography variant="body2">
                All notifications will appear here
              </Typography>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {/* Content for Unread notifications */}
              <Typography variant="body2">
                Unread notifications will appear here
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default MobileNavbar;
