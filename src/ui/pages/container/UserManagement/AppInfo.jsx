import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ThemeProvider from '@mui/material/styles/ThemeProvider';

import Shoonya_Logo from "../../../../assets/Shoonya_Logo.webp";
import { useNavigate } from "react-router-dom";
import { translate } from "../../../../config/localisation";
import LoginStyle from "../../../styles/loginStyle";
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
            src={Shoonya_Logo}
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
