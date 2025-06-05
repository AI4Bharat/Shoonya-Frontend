
import Grid from "@mui/material/Grid";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Link from "@mui/material/Link";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { translate } from "../../../../config/localisation";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import CustomButton from "../../component/common/Button";
import CustomCard from "../../component/common/Card";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from "../../../theme/theme";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import InputAdornment from "@material-ui/core/InputAdornment";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AppInfo from "./AppInfo";
import CustomizedSnackbars from "../../component/common/Snackbar";
import LoginStyle from "../../../styles/loginStyle";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";

const Login = () => {
  const classes = LoginStyle();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("shoonya_access_token");
  const refreshToken = localStorage.getItem("shoonya_refresh_token");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [isPressed, setIsPressed] = useState(false);

  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );
  const getLoggedInUserData = () => {
    const loggedInUserObj = new FetchLoggedInUserDataAPI("me");
    dispatch(APITransport(loggedInUserObj));
  };

  const keyPress = (e) => {
    if (e.code === "Enter") {
      if (!isPressed) {
        setIsPressed(true);
        createToken();
      }
    }
  };

  const keyRelease = () => {
    setIsPressed(false);
  };
  useEffect(() => {
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);
    return () => {
      window.removeEventListener("keydown", keyPress);
      window.removeEventListener("keyup", keyRelease);
    };
  }, [keyPress, keyRelease]);


  useEffect(() => {
    if (loggedInUserData && accessToken && refreshToken) {
      navigate("/projects");
    }
  }, [loggedInUserData]);

  const createToken = async () => {
    // setLoading(true);

    const apiObj = new LoginAPI(
      credentials.email.toLowerCase(),
      credentials.password
    );
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });

    const rsp_data = await res.json();
    if (res.ok) {
      localStorage.setItem("shoonya_access_token", rsp_data.access);
      localStorage.setItem("shoonya_refresh_token", rsp_data.refresh);
      localStorage.setItem("email_id", credentials.email.toLowerCase());
      localStorage.setItem(
        "userCustomTranscriptionSettings",
        JSON.stringify({})
      );
      getLoggedInUserData();
      // setLoading(false);
    } else {
      setSnackbarInfo({
        open: true,
        message: rsp_data?.message,
        variant: "error",
      });
    }

    // setLoading(false);
  };

  const handleFieldChange = (event) => {
    event.preventDefault();
    setCredentials((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="email"
            onChange={handleFieldChange}
            value={credentials["email"]}
            placeholder={translate("enterEmailId")}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="password"
            type={values.showPassword ? "text" : "password"}
            onChange={handleFieldChange}
            value={credentials["password"]}
            placeholder={translate("enterPassword")}
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
      </Grid>
    );
  };
  const renderCardContent = () => (
    <CustomCard title={"Sign in to Shoonya"} cardContent={TextFields()}>
      <Grid container spacing={2} style={{ width: "100%", cursor: "pointer" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} textAlign={"right"}>
          <Link onClick={() => navigate("/forgot-password")}>
            {translate("forgotPassword")}
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CustomButton
            style={{
              backgroundColor: "#2C2799",
              borderRadius: "20px",
              color: "#FFFFFF",
            }}
            fullWidth
            onClick={createToken}
            label={"Login"}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
        <div className={classes.createLogin}>
        <Typography  variant={"body2"} className={classes.Typo}>New to Shoonya ? </Typography>
        <Typography variant={"body2"}>
        <Link className={classes.link} onClick={() => navigate("invite/:inviteCode")}>
            {translate("link.Createanaccount")}
          </Link>
          </Typography>
          </div>
        </Grid> */}
      </Grid>
    </CustomCard>
  );

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid container className={classes.pageWrpr}>
        <Grid item className={classes.appInfoWrpr}>
          <AppInfo />
        </Grid>
        <Grid className={classes.formWrpr}>
          <form autoComplete="off">{renderCardContent()}</form>
        </Grid>
        {renderSnackBar()}
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
