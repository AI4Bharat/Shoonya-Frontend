import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {  ThemeProvider,  } from "@mui/material";
import themeDefault from './theme/theme'
import GlobalStyles from "./styles/LayoutStyles";
import { translate } from "../config/localisation";
const Header = React.lazy(() => import("./pages/component/common/Header"));
const BackButton = React.lazy(() => import("./pages/component/common/BackButton"));
const ArrowBackIcon = React.lazy(() => import("@mui/icons-material/ArrowBack"));

const Layout= (props) => {
  // const Component = props.component;
  const { type, index, userRoles, component,Backbutton, backPressNavigationPath } = props;
  const [show, setShow] = useState(false);
  const [popUp, setPopup] = useState(true);
  const apiStatus = useSelector((state) => state.apiStatus);
  const location = useLocation();

  const classes = GlobalStyles();
  let navigate = useNavigate();

  const handleClose = () => {
    setPopup(false);
  };
  const loggedInUserData = useSelector(
    (state) => state?.fetchLoggedInUserData?.data
  );


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

  useEffect(() => {
    if (localStorage.getItem('rtl') === "true") {
      let style = document.createElement('style');
      style.innerHTML = 'input, textarea { direction: RTL; }'
      document.head.appendChild(style);
    }
  }, []);

  return (
    <ThemeProvider theme={themeDefault}>
      <div 
      className={location.pathname.includes("AudioTranscriptionLandingPage") ? classes.Audioroot : classes.root}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <Header
            type={type}
            index={index}
            className={classes.headerContainer}
          />
        </Suspense>
        <div
        className={location.pathname.includes("AudioTranscriptionLandingPage") ? classes.Audiocontainer : classes.container}
        >
          {/* {renderSpinner()}
          {renderError()} */}
          { Backbutton  && 
           < BackButton startIcon={<  ArrowBackIcon />} sx={{ color:"white" ,   mt:1.5,mb:1.5,ml:1,mr:1 }} backPressNavigationPath={backPressNavigationPath ? backPressNavigationPath : ""} label={translate("label.backToPreviousPage")}/>
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
