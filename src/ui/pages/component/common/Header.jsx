import { AppBar, Avatar, Box, Divider, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headerStyle from "../../../styles/header";
import Logo from '../../../../assets/logo.svg';
import {useDispatch,useSelector} from 'react-redux';
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";
import { useNavigate } from "react-router-dom";
import CustomButton from "../common/Button"
import "../../../styles/background.css"

const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [activeproject ,setActiveproject] = useState("activeButtonproject")
    const [activeworkspace ,setActiveworkspace] = useState("")

    const dispatch = useDispatch();
    let navigate = useNavigate();

    const loggedInUserData = useSelector(state=>state.fetchLoggedInUserData.data);

    const getLoggedInUserData = ()=>{
        const loggedInUserObj = new FetchLoggedInUserDataAPI("me");
        dispatch(APITransport(loggedInUserObj))
    }
    
    useEffect(()=>{
        getLoggedInUserData();
        console.log("loggedInUserData", loggedInUserData);
    },[]);

    // const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const onLogoutClick = () => {
        handleCloseUserMenu();
        // ExpireSession();
        localStorage.clear();
        navigate("/");
    }

    const settings = [
        {name : "Profile", onclick:()=>handleCloseUserMenu()},
        {name : "Account", onclick:()=>handleCloseUserMenu()},
        {name : "Dashboard", onclick:()=>handleCloseUserMenu()},
        {name : "Logout", onclick:()=>onLogoutClick()},
    ]

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      
    };
    const onWorkspaceClick = () =>{
        navigate("/WorkSpaces");
        setActiveworkspace("activeButtonworkspace")
        setActiveproject("")
       

    }
    const onProjectClick = ()=>{
        navigate("/projects");
        setActiveproject("activeButtonproject")
        setActiveworkspace("")
      
        
        
    }
  
    const classes = headerStyle();

    return (
        <Box className={classes.parentContainer}>
            <AppBar style={{ backgroundColor: "#ffffff" }}>
                <Toolbar className={classes.toolbar}>
                    <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={7}>
                        <Link to="/">
                            <img src={Logo} alt="logo" className={classes.headerLogo} />
                        </Link>
                    </Box>
                    {/* <Box sx={{ flexGrow: 0 }} xs={2}>
                    <Typography variant="h6" sx={{color : "#000000", display: "inline"}}>Username </Typography>
                    <Typography variant="caption" sx={{color : "red", display: "inline", p : 0.3, border : "1px solid red", borderRadius : 2}}>admin</Typography>
                </Box> */}
                 <Grid
                                container
                                direction="row"
                                justifyContent="left"
                                spacing={1}
                                // sx={{textAlign : "center", alignItems : "center"}}
                            >
                                <Grid 
                                
                                    item 
                                    xs={2}
                                    sm={2}
                                    md={2}
                                >
                                     <div  className={activeproject}>
                                             <CustomButton 
                                   sx={{
                                    borderRadius: "inherit",
                                    backgroundColor: "transparent",
                                    color: "black",
                                    boxShadow: "none",
                                    fontSize: "19px",
                                    '&:hover': {
                                        backgroundColor:"#E0E0E0",
                                        boxShadow: "none",
                                  },
                                   }}
                                    label={"Projects"} onClick={onProjectClick}/> 

                                        </div>


                                 
                                    
                                </Grid>
                                <Grid 
                                    item 
                                    xs={2}
                                    sm={2}
                                    md={2}
                                >
                                    <div   className={activeworkspace}>
                                    <CustomButton 
                                     sx={{
                                        borderRadius: "inherit",
                                        backgroundColor: "transparent",
                                        color: "black",
                                        boxShadow: "none",
                                        fontSize: "19px",
                                        '&:hover': {
                                            backgroundColor:"#E0E0E0",
                                            boxShadow: "none",
                                      },
                                       }}
                                    label={"Workspaces"} onClick={onWorkspaceClick}/>
                                    </div>
               
                                </Grid>
                                </Grid>

               
                    <Box sx={{ flexGrow: 0 }} xs={12} sm={12} md={5}>
                        
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                spacing={1}
                                sx={{textAlign : "center", alignItems : "center"}}
                            >
                                <Grid 
                                    item 
                                    xs={12}
                                    sm={12}
                                    md={6}
                                >
                                    <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid 
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                >
                                    <Typography variant="body1" color="primary.dark" sx={{p:0}}>{loggedInUserData.username}</Typography>
                                </Grid>
                            </Grid>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <Typography variant="body2" sx={{pl:"1rem", mt:1}}>Signed in as <b>{loggedInUserData.last_name}</b></Typography>
                            <Divider sx={{mb:2}}/>
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={setting.onclick}>
                                    <Typography variant="body2" textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
        // <Grid
        //     container
        //     flexDirection="row"
        //     justifyContent="space-between"
        //     alignItems="center"
        //     spacing={1}
        //     padding="1%"
        //     style={{ backgroundColor : "#fff"}}
        // >
        //     <Grid xs={6}>
        //         <img src={"logo.svg"} alt="logo" style={{height: "30%",verticalAlign: "middle"}}/>
        //     </Grid>

        //     <Grid >

        //     </Grid>
        // </Grid>
    )
}

export default Header