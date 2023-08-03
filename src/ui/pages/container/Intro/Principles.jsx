import React from "react";

//Styles
import IntroDatasetStyle from "../../../styles/introDataset";
import introTheme from "../../../theme/introTheme";

//Components
import { Grid, Typography, ThemeProvider } from "@mui/material";
import Scalable from "../../../../assets/Scalable.svg";
import Dynamic from "../../../../assets/Dynamic.svg";
import Elegant from "../../../../assets/Elegant.svg";
import Extensible from "../../../../assets/Extensible.svg";

const Principles = () => {
  const classes = IntroDatasetStyle();

  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ mt: 9, mb: 1 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontSize: "55px",
              lineHeight: 1.17,
              color: "#51504f",
              marginBottom: "50px",
            }}
          >
            Principles
          </Typography>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <img
                src={Scalable}
                alt="logo"
                className={classes.Principlesimg}
              />
              <Typography
                variant="h4"
                sx={{ mt: 1, mb: 1 }}
                className={classes.principlesTitle}
              >
                Scalable
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "16px", color: "#707070", lineHeight: "25px" }}
              >
                Chitralekha has a modular & micro-service based <br />{" "}
                architecture and uses a message queue to orchestrate the tasks{" "}
                <br /> & workflows. Containerization provides the <br /> option
                to scale the application to infinity.
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <img src={Dynamic} alt="logo" className={classes.Principlesimg} />
              <Typography
                variant="h4"
                sx={{ mt: 1, mb: 1 }}
                className={classes.principlesTitle}
              >
                Dynamic
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "16px", color: "#707070", lineHeight: "25px" }}
              >
                Chitralekha provides an option to dynamically pick
                <br />
                the models of your choice. It also provides the <br />
                option to pick up the tasks dynamically across Digitization,
                <br /> Translation, Checker & Super-Checker.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ mt: 4 }}>
            <img
              src={Extensible}
              alt="logo"
              className={classes.Principlesimg}
            />
            <Typography
              variant="h4"
              sx={{ mt: 1, mb: 1 }}
              className={classes.principlesTitle}
            >
              Extensible
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "16px", color: "#707070", lineHeight: "25px" }}
            >
              Any new models can be plugged in to the system <br />
              and micro-service & cloud-agnostic based <br />
              architecture gives flexibility to extend other capabilities with
              minimal code changes
              <br />
            </Typography>
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ mt: 4 }}>
            <img src={Elegant} alt="logo" className={classes.Principlesimg} />
            <Typography
              variant="h4"
              sx={{ mt: 1, mb: 1 }}
              className={classes.principlesTitle}
            >
              Elegant
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "16px", color: "#707070", lineHeight: "25px" }}
            >
              Chitralekha portal is simple and explicit.
              <br />
              Role based hierarchical gives the flexibility to work <br />
              both as a team or individual. Most of the configurations and{" "}
              <br /> features can be easily tuned.
            </Typography>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default Principles;
