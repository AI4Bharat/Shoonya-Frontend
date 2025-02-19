import { makeStyles } from "@mui/styles";

const LoginStyle = makeStyles({
  pageWrpr: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 767px)": {
      flexDirection: "row",
    },
  },
  appInfoWrpr: {
    background: "rgba(44, 39, 153, 1)",
    height: "100%",
    width: "40%",
    "@media (max-width: 767px)": {
      width: "100%",
    },
  },
  appInfo: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column !important",
    alignItems: "left",
    justifyContent: "flex-start",
    padding: "1rem",
    gap: "1rem",
  },
  infoLogo: {
    height: "80px",
    width: "80px",
    borderRadius: "50%",
  },
  title: {
    cursor: "pointer",
    lineHeight: "1.53",
    letterSpacing: "3.9px",
    textAlign: "left",
    color: "#fff",
    margin: "0 !important",
  },
  subTitle: {
    width: "80%",
    height: "auto",
    maxWidth: "300px",
    margin: "20% 70px 15% 39px",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    "@media (max-width:1040px)": {
      letterSpacing: "1px",
      maxWidth: "280px",
      width: "80%",
    },
    "@media (min-width:1790px)": {
      width: "68%",
    },
  },
  body: {
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    color: "#f2f2f4",
    "@media (max-width:1040px)": {
      letterSpacing: "1px",
    },
    "@media (min-width:1790px)": {},
  },
  formWrpr: {
    width: "60%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "@media (max-width: 767px)": {
      width: "100%",
    },
  },
  containerForgotPassword: {
    marginTop: "2px",
    width: "70%",
    "@media (max-width:650px)": {
      width: "100%",
    },
  },
  link: {
    cursor: "pointer",
    width: "100%",
    color: "#2C2799",
    float: "right",
    fontSize: "0.875rem",
    fontFamily: '"lato" ,sans-serif',
    fontWeight: "600",
  },
  Typo: {
    marginRight: "6px",
  },
  createLogin: {
    marginTop: "2%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  loginButtonStyle: {
    backgroundColor: "",
    borderRadius: "20px",
    color: "#FFFFFF",
  },
});

export default LoginStyle;
