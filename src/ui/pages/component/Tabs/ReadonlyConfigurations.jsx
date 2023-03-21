import { Card, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "../../component/common/Button";

const ReadonlyConfigurations = (props) => {
  const classes = DatasetStyle();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid
        container
        direction="row"
        // justifyContent='center'
        // alignItems='center'
      >
        {/* <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h5"   >
                            Read-only Configurations
                        </Typography>
                    </Grid> */}
        {ProjectDetails && ProjectDetails.sampling_mode && (
          <div>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              // sx={{mt:2}}
            >
              <Typography variant="h6">Sampling Parameters</Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                Sampling Mode :
              </Typography>

              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                {ProjectDetails.sampling_mode == "f" && "Full"}
                {ProjectDetails.sampling_mode == "b" && "Batch"}
                {ProjectDetails.sampling_mode == "r" && "Random"}
              </Typography>
            </Grid>

            {ProjectDetails.datasets.map((dataset) => (
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
                sx={{ mt: 2, display: "flex" }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ flexDirection: "column" }}
                >
                  Dataset Instance :
                </Typography>

                <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                  {dataset?.instance_name}
                </Typography>
                <Link
                    to={`/datasets/${dataset?.instance_id}`}
                    style={{ textDecoration: "none" }}
                    >
                    <CustomButton
                        sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
                        label="View Dataset"
                    />
                </Link>
              </Grid>
            ))}

            {ProjectDetails.filter_string && (
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
                sx={{ mt: 2, display: "flex" }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ flexDirection: "column" }}
                >
                  Filter String :
                </Typography>

                <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                  {ProjectDetails.filter_string}
                </Typography>
              </Grid>
            )}
          </div>
        )}
      </Grid>

      <Grid container direction="row">
        {ProjectDetails && ProjectDetails?.variable_parameters?.output_language && (
          <div>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Variable Parameters</Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                Output Language :
              </Typography>
              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                {ProjectDetails?.variable_parameters?.output_language}
              </Typography>
            </Grid>
          </div>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default ReadonlyConfigurations;
