import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from "../../../theme/theme";
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FetchLanguagesAPI from "../../../../redux/actions/api/UserManagement/FetchLanguages.js";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import Snackbar from "../../component/common/Snackbar";
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import {participationType} from '../../../../config/dropDownValues';
import { MenuProps } from "../../../../utils/utils";
import CustomButton from "../../component/common/Button";

const MyProfile = () => {
  const { id } = useParams();
  const [newDetails, setNewDetails] = useState();
  const [initLangs, setInitLangs] = useState([]);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [enableVerifyEmail, setEnableVerifyEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
  const navigate = useNavigate();

  // const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const userDetails = useSelector((state) => state.fetchUserById.data);
  const LoggedInUserId = useSelector((state) => state.fetchLoggedInUserData.data.id);
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
                Profile Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="First Name"
                name="first_name"
                value={newDetails?.first_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Last Name"
                name="last_name"
                value={newDetails?.last_name}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Email"
                value={email}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                disabled
                fullWidth
                label="Phone"
                name="phone"
                value={newDetails?.phone}
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
                disabled
                required
                fullWidth
                label="Username"
                name="username"
                value={newDetails?.username}
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
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="1">Available</MenuItem>
                <MenuItem value="2">Unavailable</MenuItem>
              </Select>
            </Grid> */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Languages</InputLabel>
              <Select
                disabled
                multiple
                fullWidth
                labelId="lang-label"
                name="languages"
                value={newDetails?.languages? newDetails.languages : []}
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
                disabled
                fullWidth
                label="Availability Status"
                name="availability_status"
                value={newDetails?.availability_status}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <InputLabel id="lang-label" style={{fontSize: "1.25rem", zIndex: "1", position: "absolute", display: "block", transform: "translate(14px, -9px) scale(0.75)", backgroundColor: "white", paddingLeft: "4px", paddingRight: "4px"}}>Participation Type</InputLabel>
              <Select
                disabled
                fullWidth
                labelId="lang-label"
                name="participation_type"
                value={newDetails?.participation_type? newDetails.participation_type : []}
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
                {LoggedInUserId === userDetails.id &&
                    <Grid item>
                        <CustomButton
                        label="Edit Profile"
                        onClick={() => navigate("/edit-profile")}
                        />
                    </Grid> }
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
