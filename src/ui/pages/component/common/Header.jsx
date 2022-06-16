import {
  AppBar,
  Avatar,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import headerStyle from "../../../styles/header";
import Logo from "../../../../assets/logo.svg";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";
import { useNavigate } from "react-router-dom";
import CustomButton from "../common/Button";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [activeproject, setActiveproject] = useState("activeButtonproject");
  const [activeworkspace, setActiveworkspace] = useState("");
  const history = useNavigate();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );

  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI("me");
    dispatch(APITransport(loggedInUserObj));
  };

  useEffect(() => {
    getLoggedInUserData();
    console.log("loggedInUserData", loggedInUserData);
  }, []);

  // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

  const onLogoutClick = () => {
    handleCloseUserMenu();
    // ExpireSession();
    localStorage.clear();
    navigate("/");
  };

  const userSettings = [{ name: "Logout", onclick: () => onLogoutClick() }];

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSettingsMenu = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setAnchorElSettings(null);
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

  const classes = headerStyle();

  return (
    <Box className={classes.parentContainer}>
      <AppBar style={{ backgroundColor: "#ffffff" }}>
        <Toolbar className={classes.toolbar}>
          <Grid
            sx={{ flexGrow: 0, display: "inline-grid" }}
            xs={12}
            sm={12}
            md={5}
          >
            <Link to="/">
              <img src={Logo} alt="logo" className={classes.headerLogo} />
            </Link>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-around"
            // spacing={0}
            xs={12}
            sm={12}
            md={5}
          >
            <Grid item xs={12} sm={12} md={4}>
              <Typography variant="body1">
                <NavLink
                  to="/my-organization"
                  className={({ isActive }) =>
                    isActive ? classes.highlightedMenu : classes.headerMenu
                  }
                  activeClassName={classes.highlightedMenu}
                >
                  Organization
                </NavLink>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
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
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
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
            </Grid>
          </Grid>

          <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={2}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              spacing={2}
              sx={{ textAlign: "center", alignItems: "center" }}
            >
              <Grid item xs={6} sm={6} md={3}>
                <Tooltip title="Settings">
                  <IconButton onClick={handleOpenSettingsMenu}>
                    <SettingsOutlinedIcon
                      color="primary.dark"
                      fontSize="large"
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <Tooltip title="User Options">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid
                item
                md={6}
                display={{ xs: "none", sm: "none", md: "block" }}
              >
                <Typography variant="body1" color="primary.dark" sx={{ p: 0 }}>
                  {loggedInUserData.username}
                </Typography>
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
              <MenuItem
                key={1}
                onClick={() =>
                  {
                  handleCloseSettingsMenu();
                  history(`${process.env.PUBLIC_URL}/transliteration`)
                }
                }
              >
                <Typography variant="body2" textAlign="center">
                  Transliteration
                </Typography>
              </MenuItem>
              <MenuItem key={2}>
                <Typography variant="body2" textAlign="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleRTLChange}
                        defaultChecked={localStorage.getItem("rtl") === "true"}
                      />
                    }
                    label="Enable RTL-typing"
                  />
                </Typography>
              </MenuItem>
              <MenuItem key={3}>
                <Typography variant="body2" textAlign="center">
                  Help
                </Typography>
              </MenuItem>
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
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
