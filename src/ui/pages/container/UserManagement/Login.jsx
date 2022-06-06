import { Grid, Link, Typography, Hidden,ThemeProvider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translate } from "../../../../config/localisation";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import LoginStyle from "../../../styles/loginStyle";
import Button from "../../component/common/Button";
import CustomCard from "../../component/common/Card";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import themeDefault from '../../../theme/theme'


const Login = () => {
  const classes = LoginStyle();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });


  let navigate = useNavigate();
  
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: '',
    variant: 'success'
  })

  const createToken = () => {
    const apiObj = new LoginAPI(credentials.email, credentials.password);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      const rsp_data = await res.json();
      console.log(rsp_data);
      if (!res.ok) {
        // return Promise.reject('');
        console.log("res -", res);
      } else {
        localStorage.setItem('shoonya_access_token', rsp_data.access);
        localStorage.setItem('shoonya_refresh_token', rsp_data.refresh);
        navigate("/dashboard");
    }})
  }

  const handleFieldChange = (event) => {
    event.preventDefault();
    setCredentials((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const routeChange = () =>{ 
    let path = `dashboard`; 
    navigate(path);
  }

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
            type="password"
            onChange={handleFieldChange}
            value={credentials["password"]}
            placeholder={translate("enterPassword")}
          />
        </Grid>
      </Grid>
    );
  };
  const renderCardContent = () => (
    <CustomCard title={"Sign in to Shoonya"} cardContent={TextFields()}>
        <Grid container spacing={2} style={{width:"100%"}}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  textAlign={"right"}>
            <Link href="/forgot-password">{translate("forgotPassword")}</Link>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button fullWidth onClick={createToken} label={"Login"} />
          </Grid>
         
        </Grid>
      </CustomCard>
  );

  return (
    <ThemeProvider theme={themeDefault}>
    
   <Grid container>
  <Grid item xs={12} sm={4} md={3} lg={3} color = {"primary"} className={classes.appInfo}>
 
        <Typography  variant={"h2"} className={classes.title} style={{ margin: "22% 294px 10% 39px"}} onClick={routeChange} >Shoonya</Typography>
      
        <Hidden only="xs">
          
        <Typography variant={"body1"} className={classes.body} style={{ margin: "30px 0px 50px 39px",}}>
        {translate("label.ulcaInfo")}
        </Typography>
        </Hidden>
      </Grid>
   <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
   {renderCardContent()}
   </Grid>
 </Grid>
 </ThemeProvider>
  );
};

export default Login;
