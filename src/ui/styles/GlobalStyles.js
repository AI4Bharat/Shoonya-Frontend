import { makeStyles } from "@mui/styles";

const GlobalStyles = makeStyles(theme=>({
  section: {
    background: "url('../img/slide1-bg.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "0 5%",
    display: "flex",
    alignItems: "center",
  },

  textBox: {
    width: "100%",
  },

  heading: {
    color: "#3a3a3a",
    margin: "24px 0",
  },

  description: {
    fontSize: "1.25rem",
    lineHeight: "2rem",
    margin: "0 35px 25px 0",
    textAlign: "justify",
  },

  homeDescription: {
    fontSize: "1.25rem",
    lineHeight: "2rem",
    margin: "0 35px 25px 0",
    [theme.breakpoints.down('md')]: {
      margin: "0 10px 25px 0",
    },
    textAlign: "justify",
  },

  aboutImg: {
    width: "85%",
  },

  demoBtn: {
    backgroundColor: "rgb(44, 39, 153)",
    border: "none",
    color: "white",
    padding: "10px 25px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "20px 2px",
    transitionDuration: "0.4s",
    cursor: "pointer",
    borderRadius: "10px",
    height: "auto",
    "&:hover": {
      boxShadow:
        "0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19)",
      textDecoration: "none",
      backgroundColor: "rgb(44, 39, 153)",
    },
  },

  ai4bharatLogo: {
    color: "rgba(234,108,69)",
    fontSize: "1.25rem",
    letterSpacing: "-.025em",
    fontWeight: "600",
    fontFamily: "Rowdies, cursive",
  },

  ai4bharatLogoImg: {
    width: "32px",
    height: "29px",
    margin: "4px 0 0 0",
  },

  ekStepLogo: {
    color: "black",
    fontSize: "1.25rem",
    letterSpacing: "-.025em",
    fontWeight: "600",
    fontFamily: "Rowdies, cursive",
    marginTop: "1rem",
  },

  list: {
    listStyle: "unset",
    margin: "0 0 0 5%",
    padding: "0",
  },

  listItem: {
    display: "list-item",
    padding: "0",
  },
  homeLink: {
    color: "#000",
    textDecoration: "underline",
    '&:hover' : {
      color: "#000",
      textDecoration: "underline"
    }
  }
}));

export default GlobalStyles;
