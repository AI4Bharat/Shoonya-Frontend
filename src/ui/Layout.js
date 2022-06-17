import React, { Suspense, useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import {  ThemeProvider,  } from "@mui/material";
// import Header from "./components/common/Header";
// import Footer from "./components/common/Footer";
// import Theme from "./theme/theme-default";
// import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
// import GlobalStyles from "./styles/Styles";
// import Spinner from "./pages/component/common/Spinner";
// import Snackbar from "./pages/component/common/Snackbar";
import themeDefault from './theme/theme'
import GlobalStyles from "./styles/LayoutStyles";
import BackButton from "./pages/component/common/BackButton";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const Header = React.lazy(() => import("./pages/component/common/Header"));


const Layout= (props) => {
  // const Component = props.component;
  const { type, index, userRoles, component,Backbutton } = props;
  const [show, setShow] = useState(false);
  const [popUp, setPopup] = useState(true);
  const apiStatus = useSelector((state) => state.apiStatus);

  const classes = GlobalStyles();
//   const history = useHistory();
  let navigate = useNavigate();
  // const renderSpinner = () => {
  //   if (apiStatus.progress) {
  //     return <Spinner />;
  //   }
  // };

  const handleClose = () => {
    setPopup(false);
  };

  // const renderError = () => {
  //   if (apiStatus.unauthrized) {
  //     setTimeout(
  //       () => navigate("/"),
  //       3000
  //     );
  //   }
  //   if (apiStatus.error && apiStatus.message && popUp) {
  //     return (
  //       <Snackbar
  //         open={true}
  //         handleClose={handleClose}
  //         anchorOrigin={{ vertical: "top", horizontal: "right" }}
  //         message={apiStatus.message}
  //         variant={"error"}
  //       />
  //     );
  //   }
  // };

  useEffect(() => {
    if (show) {
      window.removeEventListener('scroll', (e) => { });
    }
  }, [show])

  window.addEventListener('scroll', e => {
    if (window.pageYOffset > 100 && !show) {
        setShow(true);
    }
  })

  return (
    <ThemeProvider theme={themeDefault}>
      <div 
      className={classes.root}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <Header
            type={type}
            index={index}
            className={classes.headerContainer}
          />
        </Suspense>
        <div 
        className={classes.container}
        >
          {/* {renderSpinner()}
          {renderError()} */}
          { Backbutton  && 
           < BackButton  sx={{ color:"white" ,   mb:2,   }}  label="< Back To previous page"/>
           }
          <Suspense fallback={<div>Loading....</div>}>
            {component}
          </Suspense>
        </div>
       
      </div>
    </ThemeProvider >
  );
}
export default Layout;
