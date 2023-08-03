import React from "react";

//Styles
import IntroDatasetStyle  from "../../../styles/introDataset";
import  introTheme  from "../../../theme/introTheme";

//Components
import { Grid, Typography, Button, ThemeProvider } from "@mui/material";

const Partners = () => {
  const classes = IntroDatasetStyle();

  const handleClickImg = (link) => {
    window.open(link);
  };
  return (
    <ThemeProvider theme={introTheme}>
      <div>
        <Grid sx={{ mt: 10, mb: 10 }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "55px",
              lineHeight: 1.17,
              color: "#51504f",
              marginBottom: "50px",
            }}
          >
            Partners
          </Typography>

          {/* <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 10,
              mb: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {partnerData?.map((el, i) => (
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  onClick={() => handleClickImg(el.link)}
                  sx={{ textTransform: "capitalize" }}
                >
                  <div
                    component="div"
                    style={{
                      margin: 0,
                      padding: "8px 0 8px 0px",
                      lineHeight: 0,
                    }}
                    className={classes.partnersPaper}
                  >
                    <img
                      src={el.image}
                      alt="logo"
                      style={{ width: "230px", aspectRatio: "1" }}
                    />
                  </div>
                </Button>
              </Grid>
            ))}
          </Grid> */}
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default Partners;
