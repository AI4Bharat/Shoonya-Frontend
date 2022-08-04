import React, { useEffect, useState } from "react";
import CustomCard from "../../component/common/Card";
import { Grid ,Typography, Link,ThemeProvider,} from "@mui/material";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import { translate } from "../../../../config/localisation";
import LoginStyle from "../../../styles/loginStyle";
import themeDefault from '../../../theme/theme'
import { useNavigate } from "react-router-dom";
import AppInfo from "./AppInfo";
import ForgotPasswordAPI from "../../../../redux/actions/api/UserManagement/ForgotPassword";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch } from "react-redux";

const ConfirmForgetPassword = () => {
  const classes = LoginStyle();
   const dispatch = useDispatch();
   const [sendemail, setSendemail] = useState("")

  const handleforgotPassword = () => {
    setSendemail("")
    const ChangePassword = {
      email:sendemail
    }
    const projectObj = new ForgotPasswordAPI(ChangePassword);
    dispatch(APITransport(projectObj));
  }

 
  const TextFields = () => {
    return (
      <Grid container spacing={2}  style={{ marginTop: "2px",width:"40%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Typography variant="h3"   >
          Confirm Forgot Password
        </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            placeholder="Enter your Password"
            value={sendemail}
            onChange={(e) => setSendemail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            placeholder="Re-enter your Password"
            value={sendemail}
            onChange={(e) => setSendemail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
          <Button fullWidth label={"Change PassWord"} onClick={handleforgotPassword}/>
        </Grid>
      </Grid>
    );
  };

  
  return (
    <ThemeProvider theme={themeDefault}>
    
   <Grid container  className={classes.loginGrid} >
     
  <Grid item xs={12} sm={3} md={3} lg={3} color = {"primary"} className={classes.appInfo}>
  
        <AppInfo/>
      </Grid>
   <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent} >
   {TextFields()}
   </Grid>
 </Grid>
 </ThemeProvider>
    
  );
};

export default ConfirmForgetPassword;
