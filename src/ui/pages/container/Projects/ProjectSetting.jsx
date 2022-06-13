import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import TextareaAutosize from '@mui/material/TextareaAutosize';


const ProjectSetting = (props) => {

    const classes = DatasetStyle();

    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
                width={window.innerWidth}
            >
                <Card
                    sx={{
                        width: window.innerWidth * 0.8,
                        minHeight: 500,
                        padding: 5
                    }}

                >
                    <Link to={`/projects/1}`} style={{ textDecoration: "none" }}>
                        <Button
                            sx={{
                                margin: "0px 0px 20px 0px",
                                backgroundColor: "transparent",
                                color: "black",
                                '&:hover': {
                                    backgroundColor: "transparent",
                                },
                            }}

                            label=" < Back to project" />
                    </Link>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                    >
                        <Typography variant="h2" gutterBottom component="div">
                            Project Settings
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                    >
                        <Typography variant="h4" gutterBottom component="div"  >
                            Basic Settings
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >
                            <Typography gutterBottom component="div" label="Required">
                                Project Name :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField
                                fullWidth


                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >

                            <Typography gutterBottom component="div">
                                Project Description :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField
                                fullWidth


                            />
                        </Grid>
                    </Grid>
                    <Grid

                        style={{ margin: "15px 0px 10px 0px", }}
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Button

                            label="Save" />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h4" gutterBottom component="div" style={{ margin: "15px 0px 10px 0px", }}>
                            Add Annotators To The Project
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography gutterBottom component="div">
                            Emails :
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={11}
                        md={11}
                        lg={11}
                        xl={11}
                        sm={11}
                    >
                        <TextareaAutosize
                            fullWidth
                            aria-label="minimum height"
                            minRows={6}
                            placeholder="Enter emails of Annotators separated by commas(,)"
                            className={classes.Projectsettingtextarea}

                        />
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        spacing={2}
                        sx={{
                            maxWidth: " 70%",
                            "@media (max-width:650px)": {

                                maxWidth: " 100%"
                            },
                        }}


                    >
                        <Grid
                            sx={{
                                marginTop: 2,

                            }}
                            item
                            xs={6}
                            md={6}
                            lg={2}
                            xl={2}
                            sm={6}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Add Annotators" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2
                            }}
                            item
                            xs={6}
                            md={6}
                            lg={2}
                            xl={2}
                            sm={6}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Publish Project" />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h4" gutterBottom component="div" style={{ margin: "15px 0px 10px 0px", }}>
                            Advanced Operation
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        spacing={2}
                        sx={{ maxWidth: " 70%" }}


                    >
                        <Grid
                            sx={{
                                marginTop: 2
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={3}
                            xl={3}
                            sm={12}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Export Project into Dataset" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2,
                                lineHeight: 2,
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={4}
                            xl={4}
                            sm={12}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Pull New Data Items from Source Dataset" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={3}
                            xl={3}
                            sm={12}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Download project" />

                        </Grid>
                    </Grid>

                </Card>
            </Grid>
        </ThemeProvider>

    )
}

export default ProjectSetting;