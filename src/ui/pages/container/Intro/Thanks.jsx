import React, { useEffect } from "react";

//Styles
import introTheme  from "../../../theme/introTheme";

//Components
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  ThemeProvider,
} from "@mui/material";
import  teamDetails  from "../../../../utils/userDetails";

const Thanks = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <ThemeProvider theme={introTheme}>
      <Grid sx={{ mt: 15 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "50px",
            lineHeight: 1.17,
            color: "#51504f",
            marginBottom: "80px",
          }}
        >
          Our Team
        </Typography>
        <Grid container spacing={1} sx={{ ml: "13px" }}>
          {teamDetails?.map((el, i) => (
            <Grid item xs={6} sm={6} md={3} lg={3} xl={3} sx={{ p: 8 }}>
              <Card>
                <CardMedia sx={{ height: 300 }} image={el.img} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {el.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {el.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Thanks;
