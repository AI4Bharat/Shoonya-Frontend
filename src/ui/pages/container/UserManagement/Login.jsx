import { Grid, Link, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translate } from "../../../../config/localisation";
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import Button from "../../component/common/Button";
import CustomCard from "../../component/common/Card";
import OutlinedTextField from "../../component/common/OutlinedTextField";

const Login = () => {
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
    <CustomCard title={"Login"} cardContent={TextFields()}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button fullWidth onClick={createToken} label={"Login"} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Link href="/forgot-password">{translate("forgotPassword")}</Link>
          </Grid>
        </Grid>
      </CustomCard>
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderCardContent()}
    </div>
  );
};

export default Login;
