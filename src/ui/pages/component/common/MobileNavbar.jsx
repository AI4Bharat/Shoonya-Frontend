import React, { useState, useEffect, useCallback } from "react";
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
  Modal,
  Tabs,
  Tab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { NavLink, Link } from "react-router-dom";
import Shoonya_Logo from "../../../../assets/Shoonya_Logo.png";
import headerStyle from "../../../styles/header";
import GradingSharpIcon from "@mui/icons-material/GradingSharp";
import NotificationAPI from "../../../../redux/actions/api/Notification/Notification";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import NotificationPatchAPI from "../../../../redux/actions/api/Notification/NotificationPatchApi";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: "50%",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "50%",
    padding: "0",
    transition: "all 0.3s ease-in-out",
    overflowX: "hidden",
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
    backgroundColor: "#ffffff !important",
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
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "90%"
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
    borderRadius: "8px",
    width: "80%",
  },
  tabContent: {
    padding: theme.spacing(2),
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

function MobileNavbar(props) {
  const { loggedInUserData, appSettings, userSettings, tabs, appInfo } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const headerClasses = headerStyle();
  const classes = useStyles();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [Notification, setnotification] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [unread, setunread] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  const fetchNotifications = useCallback(() => {
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
  }, [unread]);

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
  }, [unread, selectedNotificationId, fetchNotifications]);

  const handleNotificationClick = () => {
    setOpenNotifications(true);
    setOpenDrawer(false);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            // display: "flex",
            // flexDirection: "column",
            // justifyContent: "space-between",
            // height: "100%",
            position: "sticky",
            top: 0,
            zIndex: 10,
            pb: 2,
          }}
        >
          <Box style={{ position: "sticky", top: "0px", zIndex: 10 }}>
            <IconButton
              className={classes.closeButton}
              onClick={() => setOpenDrawer(false)}
            >
              <CloseIcon />
            </IconButton>

            <NavLink
              to={`/profile/${loggedInUserData.id}`}
              onClick={() => setOpenDrawer(false)}
              style={{ textDecoration: "none" }}
            >
              <Box className={classes.profileBox}>
                <Avatar alt="user_profile_pic" className={classes.avatar}>
                  {loggedInUserData?.username?.[0]}
                </Avatar>
                <Box style={{ marginLeft: "20px" }}>
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
          </Box>

          <Box>
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
                      handleNotificationClick();
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

          <Box style={{ marginBottom: "16px" }}>
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

          <Box style={{ marginBottom: "16px" }}>
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

      <Modal
        className={classes.modal}
        open={openNotifications}
        onClose={handleCloseNotifications}
      >
        <div className={classes.modalContent}>
          <Box className={classes.titleContainer}>
            <Typography variant="h6">Notifications</Typography>
            {Notification &&
              Notification.length > 0 &&
              unseenNotifications?.length > 0 && (
                <Tooltip title="Mark all as read">
                  <IconButton onClick={handleMarkAllAsReadClick}>
                    <GradingSharpIcon
                      className={classes.icon}
                      color="primary"
                    />
                  </IconButton>
                </Tooltip>
              )}
          </Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
          >
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>
          <div className={classes.tabContent}>
            {tabValue === 0 && (
              <Box style={{ maxHeight: "400px", overflowY: "auto" }}>
                {Notification && Notification.length > 0 ? (
                  Notification.map((notification, index) => (
                    <Box
                      key={index}
                      style={{
                        padding: "20px",
                        margin: "10px",
                        borderRadius: "8px",
                        backgroundColor:
                          notification?.seen_json &&
                          notification?.seen_json[loggedInUserData.id]
                            ? `theme.palette.background.paper`
                            : "#D7EAF9",
                        border: "1px solid",
                        borderColor: "#c1c1c1",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(notification.on_click);
                      }}
                    >
                      <Typography variant="body1" style={{fontWeight: 700}}>
                        {notification.title || "Notification"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message || "No message content"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        style={{ display: "block", marginTop: "16px" }}
                      >
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>

                      {(!notification?.seen_json ||
                        !notification?.seen_json[loggedInUserData.id]) && (
                        <Tooltip title="Mark as read">
                          <IconButton
                            size="small"
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              right: "8px",
                            }}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircleOutlineRoundedIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    style={{ textAlign: "center", paddingY: "3rem" }}
                  >
                    No notifications available
                  </Typography>
                )}
              </Box>
            )}
            {tabValue === 1 && (
              <Box style={{ maxHeight: "400px", overflowY: "auto" }}>
                {unseenNotifications && unseenNotifications.length > 0 ? (
                  unseenNotifications.map((notification, index) => (
                    <Box
                      key={index}
                      style={{
                        padding: "2rem",
                        marginBottom: "1rem",
                        borderRadius: "8px",
                        backgroundColor: "#D7EAF9",
                        border: "1px solid",
                        borderColor: "#c1c1c1",
                        position: "relative",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(notification.on_click);
                      }}
                    >
                      <Typography variant="body1" style={{fontWeight: 700}}>
                        {notification.title || "Notification"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message || "No message content"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        style={{ display: "block", marginTop: "1rem" }}
                      >
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>

                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                          }}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCircleOutlineRoundedIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))
                ) : (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingY: "3rem",
                    }}
                  >
                    <NotificationsOffIcon
                      style={{ fontSize: "50px", color: "gray" }}
                    />
                    <Typography
                      variant="body2"
                      style={{ textAlign: "center", marginTop: "1rem" }}
                    >
                      No unread notifications
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default MobileNavbar;
