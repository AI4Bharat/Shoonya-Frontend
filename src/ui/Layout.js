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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { translate } from "../config/localisation";
import { authenticateUser } from "../utils/utils";
const Header = React.lazy(() => import("./pages/component/common/Header"));


const Layout= (props) => {
  // const Component = props.component;
  const { type, index, userRoles, component,Backbutton, backPressNavigationPath } = props;
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
  const loggedInUserData = useSelector(
    (state) => state?.fetchLoggedInUserData?.data
  );

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

  // useEffect(()=>{
  //   if(!authenticateUser()){
  //     navigate("/");
  //   }
  // },[])

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
      className={  loggedInUserData?.prefer_cl_ui=== true  && (localStorage.getItem("enableChitrlekhaUI") === "true")?classes.Audioroot:classes.root}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <Header
            type={type}
            index={index}
            className={classes.headerContainer}
          />
        </Suspense>
        <div
        className={ loggedInUserData?.prefer_cl_ui=== true  && (localStorage.getItem("enableChitrlekhaUI") === "true") ?classes.Audiocontainer:classes.container}
        >
          {/* {renderSpinner()}
          {renderError()} */}
          { Backbutton  && 
           < BackButton startIcon={<  ArrowBackIcon />} sx={{ color:"white" ,   mb:2  }} backPressNavigationPath={backPressNavigationPath ? backPressNavigationPath : ""} label={translate("label.backToPreviousPage")}/>
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
