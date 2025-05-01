import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import { translate } from "../../../../config/localisation";
import { useNavigate } from "react-router-dom";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import ChangePasswordAPI from "../../../../redux/actions/api/UserManagement/ChangePassword"
import Spinner from "../../component/common/Spinner";
import CustomizedSnackbars from "../../component/common/Snackbar";

const ChangePassword = (props) => {
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [newvalues, setNewValues] = useState({
    newpassword: "",
    showNewPassword: false,
  });
  const [confirmvalues, setConfirmValues] = useState({
    confirmpassword: "",
    showConfirmPassword: false,
  });
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
});

  const apiLoading = useSelector(state => state.apiStatus.loading);
  const apiMessage = useSelector(state => state.apiStatus.message);
  const apiError = useSelector(state => state.apiStatus.error);
  useEffect(() => {
    setSnackbarInfo({
        open: apiMessage ? true : false,
        variant: apiError ? "error" : "success",
        message: apiMessage ,
    });
}, [apiMessage, apiError])

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading])

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
};
const handleClickShowNewPassword = () => {
  setNewValues({ ...newvalues, showNewPassword: !newvalues.showNewPassword });
};
const handleClickShowConfirmPassword = () => {
  setConfirmValues({ ...confirmvalues, showConfirmPassword: !confirmvalues.showConfirmPassword });
};


const handleMouseDownPassword = (event) => {
    event.preventDefault();
};
const loggedInUserData = useSelector(
  (state) => state.fetchLoggedInUserData.data
);
 
  const handleChangePassword = async () => {
    setNewPassword("")
    setCurrentPassword("")
    setConfirmPassword("")
    const ChangePassword = {
      new_password: newPassword,
      current_password: currentPassword,
      confirm_password: confirmPassword
    }
    if(newPassword!==confirmPassword){
      setSnackbarInfo({
        ...snackbar,
        open: true,
        message: "New Password and Confirm Password must match",
        variant: 'error'
    })
    }
    else{
      const userObj = new ChangePasswordAPI(loggedInUserData.id,ChangePassword);
      const res = await fetch(userObj.apiEndPoint(), {
          method: "PATCH",
          body: JSON.stringify(userObj.getBody()),
          headers: userObj.getHeaders().headers,
      });
      const resp = await res.json();
      if (res.ok) {
          setSnackbarInfo({
              open: true,
              message: resp?.message,
              variant: "success",
          })
    
      } else {
          setSnackbarInfo({
              open: true,
              message: resp?.message,
              variant: "error",
          })
      }
      }

  }



  const renderSnackBar = () => {
    return (
        <CustomizedSnackbars
            open={snackbar.open}
            handleClose={() =>
                setSnackbarInfo({ open: false, message: "", variant: "" })
            }
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            variant={snackbar.variant}
            message={[snackbar.message]}
        />
    );
};


  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      {renderSnackBar()}
      <Grid container direction="row"  >
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Change Password
              </Typography>
            </Grid>

            {/* <Grid container direction="row">
             
            </Grid> */}

            <Grid
              className={classes.projectsettingGrid}
              items
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Current Password
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                // placeholder={"Enter Current Password"}
                placeholder={translate("currentPassword")}
                type={values.showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                          >
                              {values.showPassword ? <Visibility /> : <VisibilityOff />}

                          </IconButton>
                      </InputAdornment>
                  ),
              }}
                
              />
            </Grid>

            <Grid
                items
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className={classes.projectsettingGrid}
              >
                <Typography gutterBottom component="div" label="Required">
                  New Password
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  placeholder={translate("newPassword")}
                  type={newvalues.showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                 InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              onClick={handleClickShowNewPassword}
                              onMouseDown={handleMouseDownPassword}
                          >
                              {newvalues.showNewPassword ? <Visibility /> : <VisibilityOff />}

                          </IconButton>
                      </InputAdornment>
                  ),
              }}
                />
              </Grid>

              <Grid
                items
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className={classes.projectsettingGrid}
              >
                <Typography gutterBottom component="div" label="Required">
                  Confirm Password
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  placeholder={translate("newPassword")}
                  type={confirmvalues.showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                 InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                          <IconButton
                              onClick={handleClickShowConfirmPassword}
                              onMouseDown={handleMouseDownPassword}
                          >
                              {confirmvalues.showConfirmPassword ? <Visibility /> : <VisibilityOff />}

                          </IconButton>
                      </InputAdornment>
                  ),
              }}
                />
              </Grid>

            <Grid
              className={classes.projectsettingGrid}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2 }}
            >
              <Button
                label={"Submit"}
                onClick={handleChangePassword}
                disabled={ ( newPassword && currentPassword ) ? false : true}
              />
              <Button
                sx={{ ml: 2 }}
                label={"Cancel"}
                onClick={() => navigate(`/projects`)}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </ThemeProvider>
  );
};

export default ChangePassword;
