import {
  Grid,
  Link,
  Typography,
  Hidden,
  ThemeProvider,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translate } from "../../../../config/localisation";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import LoginStyle from "../../../styles/loginStyle";
import Button from "../../component/common/Button";
import CustomCard from "../../component/common/Card";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from "../../../theme/theme";

export default function AppInfo() {
  let navigate = useNavigate();
  const classes = LoginStyle();
  const routeChange = () => {
    let path = `dashboard`;
    navigate(path);
  };
  return (
    <div>
      <ThemeProvider theme={themeDefault}>
        <Grid container className={classes.appInfo}>
          <img
            src={"Shoonya_Logo.png"}
            alt="logo"
            className={classes.infoLogo}
          />{" "}
          <Typography
            variant={"h2"}
            className={classes.title}
            onClick={routeChange}
          >
            Shoonya
          </Typography>
          <Typography variant={"body1"} className={classes.body}>
            {translate("label.shoonyaInfo")}
          </Typography>
        </Grid>
      </ThemeProvider>
    </div>
  );
}
