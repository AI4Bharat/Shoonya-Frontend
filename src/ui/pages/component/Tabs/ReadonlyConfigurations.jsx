import { Card, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";

const ReadonlyConfigurations = (props) => {
	const classes = DatasetStyle();
	const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
	console.log(ProjectDetails, "ProjectDetails");

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
							<Typography variant="h6">
								Sampling Parameters
							</Typography>
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

							<Typography
								variant="subtitle1"
								style={{ marginLeft: 25 }}
							>
								{ProjectDetails.sampling_mode == "f" && "Full"}
								{ProjectDetails.sampling_mode == "b" && "Batch"}
								{ProjectDetails.sampling_mode == "r" &&
									"Random"}
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

								<Typography
									variant="subtitle1"
									style={{ marginLeft: 25 }}
								>
									{dataset?.instance_name}
								</Typography>
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

								<Typography
									variant="subtitle1"
									style={{ marginLeft: 25 }}
								>
									{ProjectDetails.filter_string}
								</Typography>
							</Grid>
						)}
					</div>
				)}
			</Grid>
		</ThemeProvider>
	);
};

export default ReadonlyConfigurations;
