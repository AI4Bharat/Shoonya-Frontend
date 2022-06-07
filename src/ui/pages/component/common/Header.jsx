import { AppBar, Avatar, Box, Button, Divider, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
import { useState } from "react";
import { Link } from "react-router-dom";
import headerStyle from "../../../styles/header";
import Logo from '../../../../assets/logo.svg'

const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState(null);

    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      
    };

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
                                    <Typography variant="body1" color="primary.dark" sx={{p:0}}>Username</Typography>
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
                            <Typography variant="body2" sx={{pl:"1rem", mt:1}}>Signed in as <b>Admin</b></Typography>
                            <Divider sx={{mb:2}}/>
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography variant="body2" textAlign="center" >{setting}</Typography>
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