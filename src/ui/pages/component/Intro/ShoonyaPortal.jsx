import React, { useEffect } from "react";

//Styles
import IntroDatasetStyle from "../../../styles/introDataset";

//Components
import { Paper, Grid, Typography, Button, Box } from "@mui/material";
import Principles from "../../container/Intro/Principles";
import Features from "../../container/Intro/Features";
import Partners from "../../container/Intro/Partners";
import Footer from "../Intro/Footer";
import Chitralekhaimg from "../../../../assets/img/shoonya-bg.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Carousel from "react-material-ui-carousel";
import Timeline from "../../container/Intro/versions";
import OrgChart from "../../container/Intro/OrganizationChart";

const ChitralekhaPortal = () => {
  const classes = IntroDatasetStyle();
  const handleWatchDemoVideo = () => {
    // const url = "https://www.youtube.com/watch?v=hf5M6tApDlo";
    const url = "https://youtu.be/vkjCmCWejMM?si=bwihyf0h1t--9J2r";
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const items = [
    {
      title: "Welcome to Shoonya",
      description: "An AI-powered platform for seamless language processing.",
      image: "https://via.placeholder.com/800x400", // Replace with actual image URL
      link: "https://shoonya.ai", // Replace with actual URL
    },
    {
      title: "Efficient & Scalable",
      description: "Enhance your workflow with cutting-edge AI technology.",
      image: "https://via.placeholder.com/800x400",
      link: "https://shoonya.ai/features",
    },
    {
      title: "Join Us Today",
      description: "Be part of the future with Shoonya's innovative solutions.",
      image: "https://via.placeholder.com/800x400",
      link: "https://shoonya.ai/signup",
    },
  ];

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
              padding: "22px",
            }}
            onClick={handleWatchDemoVideo}
          >
            Watch Demo Video
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{ mt: 2 }}>
          <Box display={{ xs: "none", md: "inherit" }}>
            <img src={Chitralekhaimg}
              style={{
                width: "100%",
              }}
            />
          </Box>
        </Grid>
      </Grid>
        <Typography
          variant="h4"
          sx={{
            fontSize: "55px",
            lineHeight: 1,
            color: "#51504f",
            marginBottom: "50px",
          }}
        >
          Upcoming Things
        </Typography>
        <Carousel
          stopAutoPlayOnHover
          animation="slide"
          navButtonsAlwaysVisible
          duration={1200}
          interval={2800}
          fullHeightHover
          navButtonsProps={{
            style: { borderRadius: "50%", width: "35px", height: "35px" },
          }}
          navButtonsWrapperProps={{
            style: { top: "-35px" },
          }}
          NextIcon={<ArrowForwardIosIcon />}
          PrevIcon={<ArrowBackIosNewIcon />}
          sx={{
            width: "90%",
            margin: "auto",
            height: "auto",
          }}
        >
          {items.map((item, index) => (
            <Paper
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                textAlign: "center",
                backgroundImage: `url(${item.image})`,
                // backgroundSize: "cover",
                // backgroundPosition: "center",
                height: "200px",
                color: "#fff",
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {item.title}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                {item.description}
              </Typography>
              <Button
            variant="contained"
            sx={{ marginTop: 2, backgroundColor: "#1976d2" }}
            component="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </Button>
            </Paper>
          ))}
        </Carousel>
      <Principles />
      <Features />
      <Timeline />
      <OrgChart />
      <Partners />
      <Footer />
    </div>
  );
};
export default ChitralekhaPortal;
