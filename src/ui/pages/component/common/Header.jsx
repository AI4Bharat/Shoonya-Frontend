import { AppBar, Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material"
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
            <AppBar style={{ backgroundColor: "#ffffff"}}>
                <Toolbar className={classes.toolbar}>
                <Box sx={{ flexGrow: 0 }} xs={8}>
                    <Link to="/">
                        <img src={Logo} alt="logo" className={classes.headerLogo} style={{ }} />
                    </Link>
                </Box>
                <Box sx={{ flexGrow: 0 }} xs={2}>
                    <Typography variant="h6" sx={{color : "#000000", display: "inline"}}>Username </Typography>
                    <Typography variant="caption" sx={{color : "red", display: "inline", p : 0.3, border : "1px solid red", borderRadius : 2}}>admin</Typography>
                </Box>
                    <Box sx={{ flexGrow: 0 }} xs={2}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
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
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
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