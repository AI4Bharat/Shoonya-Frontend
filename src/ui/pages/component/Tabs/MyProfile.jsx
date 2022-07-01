import { Button, Card, Grid, ThemeProvider, Typography, Select, OutlinedInput, Box, Chip, MenuItem, InputLabel } from "@mui/material";
import OutlinedTextField from "../common/OutlinedTextField";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import UpdateProfileAPI from "../../../../redux/actions/api/UserManagement/UpdateProfile";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import Snackbar from "../common/Snackbar";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";

const MyProfile = () => {
  const [newDetails, setNewDetails] = useState();
  const [initLangs, setInitLangs] = useState([]);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});

  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const dispatch = useDispatch();
  const LanguageList = useSelector(state => state.fetchLanguages.data);

  const getLanguageList = () => {
      const langObj = new FetchLanguagesAPI();

      dispatch(APITransport(langObj));
  }

  useEffect(() => {
    getLanguageList();
  }, []);

  useEffect(() => {
    if (LanguageList) {
      setInitLangs(LanguageList.language);
    }
  }, [LanguageList]);

  useEffect(() => {
    setNewDetails({
      username: userDetails.username,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      languages: userDetails.languages,
      phone: userDetails.phone,
    });
  }, [userDetails]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setNewDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    const apiObj = new UpdateProfileAPI(
      newDetails.username,
      newDetails.first_name,
      newDetails.last_name,
      newDetails.languages,
      newDetails.phone
    );
    fetch(apiObj.apiEndPoint(), {
      method: "PATCH",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      setSnackbarState({
        open: true,
        message: rsp_data.message,
        variant: res.status === 200 ? "success" : "error",
      })
    });
  }

  console.log(snackbarState)
  return (
    <ThemeProvider theme={themeDefault}>
      {/* <Header /> */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            // padding: 5,
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                My Profile
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="First Name"
                name="first_name"
                value={newDetails?.first_name}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={newDetails?.last_name}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Email"
                value={userDetails.email}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Phone"
                name="phone"
                value={newDetails?.phone}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Role"
                value={UserMappedByRole(userDetails.role)?.name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                required
                fullWidth
                label="Username"
                name="username"
                value={newDetails?.username}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Organization"
                value={userDetails.organization?.title}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <InputLabel id="availability-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Availability Status</InputLabel>
              <Select
                fullWidth
                labelId="availability-label"
                name="availability_status"
                value={newDetails?.availability_status}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="1">Available</MenuItem>
                <MenuItem value="2">Unavailable</MenuItem>
              </Select>
            </Grid> */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Languages</InputLabel>
              <Select
                multiple
                fullWidth
                labelId="lang-label"
                name="languages"
                value={newDetails?.languages? newDetails.languages : []}
                onChange={handleFieldChange}
                style={{zIndex: "0"}}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {initLangs?.length && initLangs.map((lang) => (
                  <MenuItem
                    key={lang}
                    value={lang}
                  >
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid 
                container 
                direction="row"
                justifyContent="flex-end"
                style={{marginTop: 20}}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Update Profile
                </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Snackbar 
        {...snackbarState} 
        handleClose={()=> setSnackbarState({...snackbarState, open: false})} 
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default MyProfile;
