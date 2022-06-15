import { Button, Card, Grid, ThemeProvider, Typography } from "@mui/material";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from "../../../theme/theme";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const [newDetails, setNewDetails] = useState();

  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);

  useEffect(() => {
    setNewDetails({
      username: userDetails.username,
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      languages: userDetails.languages,
      phone: userDetails.phone,
    });
  }, [userDetails]);

  const roleMap = {
    1: "Admin",
    2: "Manager",
    3: "Annotator",
  };

  const handleFieldChange = (event) => {
    event.preventDefault();
    setNewDetails((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

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
            width: window.innerWidth * 0.8,
            minHeight: 500,
            padding: 5,
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
                value={roleMap[userDetails.role]}
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
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <OutlinedTextField
                fullWidth
                label="Languages"
                name="languages"
                value={newDetails?.languages}
                onChange={handleFieldChange}
                InputLabelProps={{ shrink: true }}
              ></OutlinedTextField>
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
                    onClick={() => {
                        console.log(newDetails);
                    }
                }>
                    Update Profile
                </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </ThemeProvider>
  );
};

export default MyProfile;
