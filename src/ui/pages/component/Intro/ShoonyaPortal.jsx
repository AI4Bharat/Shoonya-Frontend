import React, { useEffect } from "react";

//Styles
import  IntroDatasetStyle  from "../../../styles/introDataset";

//Components
import { Grid, Typography, Button, Box } from "@mui/material";
// import { Partners, Features, Principles } from "containers/intro/index";
// import Footer from "../common/Footer";
import  Chitralekhaimg  from "../../../../assets/img/shoonya-bg.png";

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
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ mt: 20, mb: 20 }}>
          <Typography variant="h2" className={classes.Chitralekhatitle}>
            Shoonya
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              lineHeight: "2rem",
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
            className={classes.buttons}
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
      {/* <Principles />
      <Features />
      <Partners />
      <Footer /> */}
    </div>
  );
};
export default ChitralekhaPortal;
