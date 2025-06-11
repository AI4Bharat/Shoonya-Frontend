import { useState} from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import LoginStyle from "../../../styles/loginStyle";
import themeDefault from '../../../theme/theme'
import { useNavigate, useParams } from "react-router-dom";
import AppInfo from "./AppInfo";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CustomizedSnackbars from "../../component/common/Snackbar";
import SignUpAPI from '../../../../redux/actions/api/UserManagement/SignUp';


const SignUp = () => {
    let navigate = useNavigate();
    const { inviteCode } = useParams();
    
    const classes = LoginStyle();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        UserName: "",
        email: "",
        password: "",
        confirmPassword: "",

    });
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [error, setError] = useState({
        UserName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        setError({ ...error, [prop]: false });
    };
    const comformdata = {
        username: values.UserName,
        email: values.email.toLowerCase(),
        password: values.password,

    }

    //SignUpAPI
    const handleSubmit = () => {
        let apiObj = new SignUpAPI(comformdata,inviteCode)
        var rsp_data = []
        fetch(apiObj.apiEndPoint(), {
            method: 'PATCH',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            rsp_data = await response.json();
            setLoading(false)
            if (!response.ok) {

                return Promise.reject('');
            } else {
                setSnackbarInfo({
                    ...snackbar,
                    open: true,
                    message: rsp_data.message ? rsp_data.message : "Invalid email / password",
                    variant: 'success'
                })

                setValues({
                    UserName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                })

            }
        }).catch((error) => {
            setLoading(false)
            setSnackbarInfo({
                ...snackbar,
                open: true,
                message: rsp_data.message ? rsp_data.message : "Invalid email / password",
                variant: 'error'
            })
        });

    }



    const ValidateEmail = (mail) => {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        else {
            return false;
        }
    }


    const HandleSubmitValidate = () => {
        if (!ValidateEmail(values.email)) {
            setError({ ...error, email: true })
        }
        else if (!(/^[A-Za-z ]+$/.test(values.UserName))) {
            setError({ ...error, UserName: true })
        }
        else if (!(values.password.length > 7)) {
            setError({ ...error, password: true })
        }
        else if (values.password !== values.confirmPassword) {
            setError({ ...error, confirmPassword: true })
        }
        else {
            handleSubmit()
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
            <Grid container spacing={2} style={{ width: "40%", }}>
                <Grid>
                    {renderSnackBar()}
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h3" align="center" >Create new account</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="email"
                        placeholder="Enter your Email ID."
                        onChange={handleChange("email")}
                        error={error.email ? true : false}
                        value={values.email}
                        helperText={error.email ? "Invalid email" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon style={{ color: "#75747A" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="name"
                        placeholder="Enter your Username."
                        onChange={handleChange("UserName")}
                        error={error.UserName ? true : false}
                        value={values.UserName}
                        helperText={error.UserName ? "UserName is not proper" : ""}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlinedIcon style={{ color: "#75747A" }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid> <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                </Grid> <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <OutlinedTextField
                        fullWidth
                        name="password"
                        placeholder="Re-enter your Password."
                        error={error.confirmPassword ? true : false}
                        value={values.confirmPassword}
                        onChange={handleChange("confirmPassword")}
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
                    <Button fullWidth label={"Submit"} onClick={() => {
                        HandleSubmitValidate();
                    }} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  >
                    <div className={classes.createLogin}>
                        <Typography variant={"body2"} className={classes.Typo}>Already have an account ?</Typography>
                        <Typography variant={"body2"}>
                            <Link className={classes.link} href="/" style={{ fontSize: "14px" }} >
                                {" "}
                                Sign in
                            </Link>
                        </Typography>
                    </div>
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

export default SignUp;

