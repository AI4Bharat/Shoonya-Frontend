import React from "react";

//Styles
import IntroDatasetStyle  from "../../../styles/introDataset";
import  introTheme  from "../../../theme/introTheme";

//Components
import { Grid, Typography, Button, ThemeProvider } from "@mui/material";

const UseCases = () => {
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
         UseCases
          </Typography>

      
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default UseCases;
