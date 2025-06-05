import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import UpdateProfileAPI from "../../../../redux/actions/api/UserManagement/UpdateProfile";
import UpdateEmailAPI from "../../../../redux/actions/api/UserManagement/UpdateEmail";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import Snackbar from "../../component/common/Snackbar";
import UpdateEmailDialog from "../../component/common/UpdateEmailDialog"
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import {participationType} from '../../../../config/dropDownValues';
import { MenuProps } from "../../../../utils/utils";

const MyProfile = () => {
  const [newDetails, setNewDetails] = useState();
  const [initLangs, setInitLangs] = useState([]);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);

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
      availability_status:userDetails.availability_status,
      participation_type: userDetails.participation_type
    });
    setEmail(userDetails.email);
    setOriginalEmail(userDetails.email);
  }, [userDetails]);

  const handleFieldChange = (event) => {
    event.preventDefault();
    setNewDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEmailChange = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
    event.target.value !== originalEmail ? setEnableVerifyEmail(true) : setEnableVerifyEmail(false);
  };

  const handleUpdateEmail = () => {
    setEmailVerifyLoading(true);
    const apiObj = new UpdateEmailAPI(email.toLowerCase());
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      setEmailVerifyLoading(false);
      if (!res.ok) throw await res.json();
      else return await res.json();
    }).then((res) => {
      setSnackbarState({ open: true, message: res.message, variant: "success" });
      setShowEmailDialog(true);
    }).catch((err) => {
      setSnackbarState({ open: true, message: err.message, variant: "error" });
    });
  };

  const handleEmailDialogClose = () => {
    setShowEmailDialog(false);
  };
  
  const handleVerificationSuccess = () => {
    setEnableVerifyEmail(false);
    setOriginalEmail(email);
    setSnackbarState({ open: true, message: "Email successfully updated", variant: "success" });
  }
  
  const handleSubmit = () => {
    const apiObj = new UpdateProfileAPI(
      newDetails.username,
      newDetails.first_name,
      newDetails.last_name,
      newDetails.languages,
      newDetails.phone,
      newDetails.availability_status,
      newDetails.participation_type
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
            padding: 5,
            border: 0,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h3" align="center">
                Edit Profile
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
                fullWidth
                label="Email"
                value={email}
                onChange={handleEmailChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (enableVerifyEmail && <InputAdornment position="end">
                    <Button variant="text" color="primary" onClick={handleUpdateEmail} sx={{gap:"4px"}}>
                      {emailVerifyLoading && <CircularProgress size="1rem" color="primary"/>}VERIFY EMAIL
                    </Button>
                  </InputAdornment>)
                }}
              ></OutlinedTextField>
              <UpdateEmailDialog 
                isOpen={showEmailDialog}
                handleClose={handleEmailDialogClose}
                oldEmail={userDetails.email}
                newEmail={email?.toLowerCase()}
                onSuccess={handleVerificationSuccess}
              />
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
                MenuProps={MenuProps}
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
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Availability Status"
                name="availability_status"
                value={newDetails?.availability_status}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Participation Type</InputLabel>
              <Select
                fullWidth
                labelId="lang-label"
                name="participation_type"
                value={newDetails?.participation_type? newDetails.participation_type : []}
                onChange={handleFieldChange}
                style={{zIndex: "0"}}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              >
                {participationType?.length && participationType.map((type,i) => (
                  <MenuItem
                    key={i+1}
                    value={i+1}
                  >
                    {type}
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
