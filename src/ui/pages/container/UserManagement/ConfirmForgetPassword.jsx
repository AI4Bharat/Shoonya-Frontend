import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import LoginStyle from "../../../styles/loginStyle";
import themeDefault from '../../../theme/theme'
import { useParams } from "react-router-dom";
import AppInfo from "./AppInfo";
import ConfirmForgetPasswordAPI from "../../../../redux/actions/api/UserManagement/ConfirmForgetPassword";
import { useDispatch } from "react-redux";
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import CustomizedSnackbars from "../../component/common/Snackbar";
import { useNavigate } from "react-router-dom";

const ConfirmForgetPassword = () => {
    const classes = LoginStyle();
    const { key, token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState({
        password: false,
        confirmPassword: false,
    });
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setError({ ...error, [prop]: false });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async() => {
        const ConfirmForgetPassword = {
            new_password: values.confirmPassword,
            uid: key,
            token: token
        }

        let obj = new ConfirmForgetPasswordAPI(ConfirmForgetPassword);
        const res = await fetch(obj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(obj.getBody()),
            headers: obj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
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

    const handleConfirmForgetPassword = () => {
        if (!(values.password.length > 7)) {
            setError({ ...error, password: true })
        }
        else if (values.password !== values.confirmPassword) {
            setError({ ...error, confirmPassword: true })
        }
        else {
            handleSubmit()
            setValues({
                password: "",
                confirmPassword: "",
            })
            setLoading(true);
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
                message={snackbar.message}
            />
        );
    };

    const TextFields = () => {
        return (
            <Grid container spacing={4} style={{ marginTop: "2px", width: "40%" }}>
                <Grid>
                    {renderSnackBar()}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h3" align="center"  >
                        Confirm Forgot Password
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="password"
                        placeholder="Enter your Password."
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        error={error.password ? true : false}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyOutlinedIcon
                                        sx={{
                                            color: "#75747A",
                                            animation: "spin 0.1s linear infinite",
                                            "@keyframes spin": {
                                                "0%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                                "100%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                            },
                                        }}
                                    />

                                </InputAdornment>
                            ),
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
                    {error.password && <FormHelperText error={true}>
                        Minimum length is 8 characters with combination of uppercase, lowercase, number and a special character</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        placeholder="Re-enter your Password"
                        error={error.confirmPassword ? true : false}
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        helperText={error.email ? "this fiels is requird" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyOutlinedIcon
                                        sx={{
                                            color: "#75747A",
                                            animation: "spin 0.1s linear infinite",
                                            "@keyframes spin": {
                                                "0%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                                "100%": {
                                                    transform: "rotate(-225deg)",
                                                },
                                            },
                                        }}
                                    />

                                </InputAdornment>
                            ),

                        }}
                    />
                    {error.confirmPassword && <FormHelperText error={true}>Both password must match.</FormHelperText>}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                    <Button fullWidth label={"Change Password"} onClick={handleConfirmForgetPassword} />
                </Grid>
            </Grid>
        );
    };


    return (
        <ThemeProvider theme={themeDefault}>

            <Grid container className={classes.loginGrid} >

                <Grid item xs={12} sm={3} md={3} lg={3} color={"primary"} className={classes.appInfo}>

                    <AppInfo />
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent} >
                    {TextFields()}
                </Grid>
            </Grid>
        </ThemeProvider>

    );
};

export default ConfirmForgetPassword;
