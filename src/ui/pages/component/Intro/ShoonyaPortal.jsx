import React, { useEffect } from "react";

//Styles
import IntroDatasetStyle from "../../../styles/introDataset";

//Components
import { Grid, Typography, Button, Box } from "@mui/material";
import Principles from "../../container/Intro/Principles";
import Features from "../../container/Intro/Features";
import Partners from "../../container/Intro/Partners";
import Footer from "../Intro/Footer";
import Chitralekhaimg from "../../../../assets/img/shoonya-bg.png";

const ChitralekhaPortal = () => {
  const classes = IntroDatasetStyle();
  const handleWatchDemoVideo = () => {
    // const url = "https://www.youtube.com/watch?v=hf5M6tApDlo";
    // window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      <Grid container direction="row" className={classes.section}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mt: 15, mb: 20 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "500",
              fontSize: "62px",
              lineHeight: 1.17,
              color: "#3a3a3a",
              textAlign: "left",
              margin: "0 35px 25px 45px",
            }}
          >
            Shoonya
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              lineHeight: "2.2rem",
              margin: "0 35px 25px 45px",
              textAlign: "justify",
            }}
          >
            <b>Shoonya</b> is an <b>open source</b> platform to improve the
            efficiency of language work in Indian languages with AI tools and
            custom built UI interfaces and features. This is a key requirement
            to create larger dataset for training datasets for training AI
            models such as neural machine translation for a large number of
            Indian languages.
          </Typography>
          <Button
            variant="contained"
            // className={classes.buttons}
            sx={{
            borderRadius: "5px",
            display: "flex",
            marginLeft: "42px",
            fontSize: "16px",
            fontFamily: "roboto,sans-serif",
            height: "35px",
            marginTop: "8px",
            padding: "22px",}}
            onClick={handleWatchDemoVideo}
          >
            Watch Demo Video
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{ mt: 2 }}>
          <Box display={{ xs: "none", md: "inherit" }}>
            <img
              src={Chitralekhaimg}
              style={{
                width: "100%",
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Principles />
      <Features />
      <Partners />
      <Footer />
    </div>
  );
};
export default ChitralekhaPortal;
