import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Grid,
  Link,
  AppBar, 
  Divider,
  Avatar,
  Typography,
  Box,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";
import Logo from "../../../../assets/logo.svg";
import headerStyle from "../../../styles/header";

const useStyles = makeStyles(() => ({
  Navlink: {
    textDecoration: "none",
    color: "blue",
    fontSize: "20px",
  },
  icon: {
    color: "white",
  },
}));

function MobileNavbar(props) {
  const { loggedInUserData, appSettings, userSettings, tabs } = props;
  const [openDrawer, setOpenDrawer] = useState(false);
  const classes = headerStyle();

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
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{
        style: {
            padding: "16px"
        }
      }}>
        <Box
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                paddingBottom: "16px"
            }}
        >
            <Box>
                <NavLink to="/profile" onClick={() => setOpenDrawer(false)} style={{
                    textDecoration: "none"
                }}>
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            columnGap: "16px",
                            paddingBottom: "16px",
                        }}
                    >
                        <Avatar
                            alt="user_profile_pic"
                            variant="contained"
                            className={classes.avatar}
                        >
                            {loggedInUserData && loggedInUserData.username && loggedInUserData.username.split("")[0]}
                        </Avatar>
                        <Typography variant="h6" sx={{ p: 0, ml : 1 }} style={{
                            color: "black"
                        }}>
                            {loggedInUserData.username}
                        </Typography>
                    </Box>
                </NavLink>
                <Divider />
            </Box>
            <Box>
                <List>
                    {tabs.map((tab) => (
                        <ListItem onClick={() => setOpenDrawer(false)}>
                            {tab}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>
                <Typography variant="h6" align="center" style={{
                    fontSize: "1.1rem"
                }}>
                    App Settings
                </Typography>
                <Divider />
                <List>
                    {appSettings.map((setting) => (
                        <ListItem key={setting} onClick={setting.onclick}>
                            {setting.control ? 
                                <FormControlLabel
                                    control={setting.control}
                                    label={setting.name}
                                />
                                : 
                                <Typography variant="body1" textAlign="center">
                                    {setting.name}
                                </Typography>}
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box>
                <Typography variant="h6" align="center" style={{
                    fontSize: "1.1rem"
                }}>
                    User Settings
                </Typography>
                <Divider />
                <List>
                    {userSettings.map((setting) => (
                        <ListItem key={setting} onClick={() => {setting.onclick(); setOpenDrawer(false)}}>
                            <Typography variant="body1" textAlign="center">
                                {setting.name}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
      </Drawer>
      <AppBar style={{ backgroundColor: "#ffffff", padding: "8px 0" }}>
        <Grid
            container
            direction="row"
            justifyContent={"space-between"}
            style={{
                padding: "0 5%"
            }}
        > 
            <Grid item>
                <Link to="/projects">
                    <img src={Logo} alt="logo" className={classes.headerLogo} style={{marginTop: "5%"}} />
                </Link>
            </Grid>
            <Grid item>
                <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                    <MenuIcon />
                </IconButton>
            </Grid>
        </Grid>
      </AppBar>
    </>
  );
}
export default MobileNavbar;
