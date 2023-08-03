import React from "react";
import { useNavigate } from "react-router-dom";

//Styles
import  IntroDatasetStyle  from "../../../styles/introDataset";

//Components
import { Grid, Typography, Button } from "@mui/material";
import  YouTube  from "../../../../assets/img/youtube.png";
import  Twitter  from "../../../../assets/img/twitter.png";
import  Github  from "../../../../assets/img/gitHub.png";

const Footer = () => {
  const classes = IntroDatasetStyle();
  const navigate = useNavigate();

  const handleClickThanks = () => {
    navigate("/thanks");
  };
  return (
    <div>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGridMains}
        >
          <a target="_blank" href="https://github.com/AI4Bharat/Shoonya">
            <img src={Github} alt="logo" className={classes.footerimg} />{" "}
          </a>
          <a target="_blank" href=" https://twitter.com/ai4bharat">
            <img src={Twitter} alt="logo" className={classes.footerimg} />
          </a>
          <a
            target="_blank"
            href="https://www.youtube.com/@shoonya-bhashini"
          >
            <img
              src={YouTube}
              alt="logo"
              style={{ height: "48px" }}
              className={classes.footerimg}
            />
          </a>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          className={classes.footerGridMain}
        >
          <Typography>
            Want to be a part of Shoonya?
            <a target="_blank" href={"mailto:" + "chitralekha.tool@gmail.com"}>
              <Button
                variant="contained"
                sx={{
                  border: "1px solid white",
                  ml: 2,
                  textTransform: "capitalize",
                }}
              >
                Contact Us
              </Button>
            </a>
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          xl={2}
          className={classes.footerGrid}
        >
          <a
            href="https://github.com/AI4Bharat/Shoonya/blob/master/LICENSE"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ ml: "2px", color: "white" }}>
              License
            </Typography>
          </a>
          <span style={{ margin: "0px 15px 0px 15px" }}>|</span>
          <Typography
            variant="caption"
            onClick={handleClickThanks}
            sx={{ mt: 1 }}
            className={classes.thanks}
          >
            Thanks
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
          lg={7}
          xl={7}
          className={classes.footerGrid}
        ></Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={3}
          lg={3}
          xl={3}
          className={classes.footerGridlast}
        >
          <a
            href="https://ai4bharat.org/"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ color: "white" }}>
              {" "}
              AI4Bharat{" "}
            </Typography>{" "}
          </a>
          <span style={{ margin: "0px 15px 0px 15px" }}>|</span>
          <a
            href="https://ekstep.org/"
            style={{ color: "white", textDecoration: "none" }}
          >
            <Typography variant="caption" sx={{ color: "white" }}>
              {" "}
              EkStep{" "}
            </Typography>{" "}
          </a>
        </Grid>
      </Grid>
    </div>
  );
};
export default Footer;
