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
import Shoonya_Logo from "../../../../assets/Shoonya_Logo.png";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";
import { useLocation, useNavigate } from "react-router-dom";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import CustomButton from "../common/Button";
import MobileNavbar from "./MobileNavbar";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Logout from "../../../../redux/actions/UserManagement/Logout";
import Modal from "./Modal";
import Transliteration from "../../container/Transliteration/Transliteration";
import CustomizedSnackbars from "../common/Snackbar";
import userRole from "../../../../utils/UserMappedByRole/Roles";
import UpdateUIPrefsAPI from "../../../../redux/actions/api/UserManagement/UpdateUIPrefs";

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElHelp, setAnchorElHelp] = useState(null);
  const [activeproject, setActiveproject] = useState("activeButtonproject");
  const [activeworkspace, setActiveworkspace] = useState("");
  const [isSpaceClicked, setIsSpaceClicked] = useState(false); 
  const [showTransliterationModel, setShowTransliterationModel] =
    useState(false);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  //const[checkClUI,setCheckClUI]=useState(null)

  const loggedInUserData = useSelector(
    (state) => state?.fetchLoggedInUserData?.data
  );

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

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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

  const handleTranscriptionFlowChange = async(event) => {
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
          message:resp.message,
          variant: "success",
        });
      }
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

  const handleTransliterationModelClose =  () => {
        setShowTransliterationModel(false);
  };

  return (
    <Grid container direction="row" style={{zIndex:1}}>
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
                    sx={{marginTop: "5%"}}
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
              <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={2}>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  sx={{ textAlign: "center", alignItems: "center" }}
                >
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
                  <Grid item xs={3} sm={3} md={3}>
                    <Tooltip title="Settings">
                      <IconButton onClick={handleOpenSettingsMenu}>
                        <SettingsOutlinedIcon
                          color="primary.dark"
                          fontSize="large"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6} sm={6} md={7}>
                    <Tooltip title="User Options">
                      <IconButton onClick={handleOpenUserMenu}>
                        <Avatar
                          alt="user_profile_pic"
                          variant="contained"
                          src={loggedInUserData?.profile_photo?loggedInUserData.profile_photo:''}
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
