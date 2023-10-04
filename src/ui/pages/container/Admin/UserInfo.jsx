import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  MenuItem,
  DialogContent,
  Dialog,
  DialogContentText,
  Typography,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const UserInfo = (props) => {
  const {
    openDialog,
    handleCloseDialog,
    submit,
    Email,
    FirstName,
    LastName,
    Language,
    ParticipationType,
    Role,
    setRole,
    setUserName,
    userName,
    setActive,
    active,
    setFirstName,
    setLastName,
    setLanguage,
    setParticipationType,
  } = props;
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (e, v) => {
    setTabValue(v);
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid>
              {/* <Grid>{renderSnackBar()}</Grid> */}
              <Box sx={{ mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="user-tabs"
                >
                  <Tab
                    label="Profile"
                    sx={{
                      fontSize: 17,
                      fontWeight: "700",
                      marginRight: "28px !important",
                    }}
                  />
                </Tabs>
              </Box>
              <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                  <EditProfile
                    handleCloseDialog={handleCloseDialog}
                    setRole={setRole}
                    submit={submit}
                    Email={Email}
                    FirstName={FirstName}
                    setFirstName={setFirstName}
                    LastName={LastName}
                    userName = {userName}
                    setUserName={setUserName}
                    active={active}
                    setActive={setActive}
                    setLastName={setLastName}
                    Language={Language}
                    setLanguage={setLanguage}
                    ParticipationType={ParticipationType}
                    Role={Role}
                    setParticipationType={setParticipationType}
                  />
                </TabPanel>
              </Box>
            </Grid>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserInfo;
