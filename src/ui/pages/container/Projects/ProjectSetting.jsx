import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { withStyles } from '@mui/styles';
import TextareaAutosize from '@mui/material/TextareaAutosize';


const ProjectSetting = (props) => {
    const { classes } = props;
    return (
        <ThemeProvider theme={themeDefault}>

            <Header />
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
                        // justifyContent='center'
                        // alignItems='center'
                        // width={window.innerWidth}
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={2}
                            sm={2}
                            md={2}
                            lg={2}
                            xl={2}
                        >
                            <Typography variant="h6" gutterBottom component="div">
                                Project Name :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={9}
                            md={9}
                            lg={9}
                            xl={9}
                            sm={9}
                        >
                            <OutlinedTextField
                                fullWidth


                            />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        // justifyContent='center'
                        // alignItems='center'
                        // width={window.innerWidth}
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={2}
                            sm={2}
                            md={2}
                            lg={2}
                            xl={2}
                        >

                            <Typography variant="h6" gutterBottom component="div">
                                Project Description :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={9}
                            md={9}
                            lg={9}
                            xl={9}
                            sm={9}
                        >
                            <OutlinedTextField
                                fullWidth


                            />
                        </Grid>
                    </Grid>
                    <Grid
                        className={classes.abc}
                        style={{ margin: "15px 0px 10px 0px", }}
                        item
                        xs={7}
                        md={7}
                        lg={7}
                        xl={7}
                        sm={7}
                    >
                        <Button

                            label="Save" />
                    </Grid>
                    <Grid
                        item
                        xs={7}
                        md={7}
                        lg={7}
                        xl={7}
                        sm={7}
                    >
                        <Typography variant="h4" gutterBottom component="div">
                            Add Annotators To The Project
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={7}
                        md={7}
                        lg={7}
                        xl={7}
                        sm={7}
                    >
                        <Typography variant="h6" gutterBottom component="div">
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
                            minRows={8}
                            placeholder="Enter emails of Annotators separated by commas(,)"
                            style={{ width: "100%" }}
                        />
                    </Grid>
                    <Grid
                        container
                        direction='row'
                    // justifyContent='center'
                    // alignItems='center'
                    // width={window.innerWidth}
                    >
                        <Grid
                            style={{ margin: "15px 0px 10px 0px", }}
                            item
                            xs={2}
                            md={2}
                            lg={2}
                            xl={2}
                            sm={2}
                        >
                            <Button label="Add Annotators" />
                        </Grid>
                        <Grid
                            style={{ margin: "15px 0px 10px 0px", }}
                            item
                            xs={2}
                            md={2}
                            lg={2}
                            xl={2}
                            sm={2}
                        >
                            <Button label="Publish Project" />
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
                        <Typography variant="h4" gutterBottom component="div">
                            Add Annotators To The Project
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                    // justifyContent='center'
                    // alignItems='center'
                    // width={window.innerWidth}
                    >
                        <Grid
                            style={{ margin: "15px 0px 10px 0px", }}
                            item
                            xs={3}
                            md={3}
                            lg={3}
                            xl={3}
                            sm={3}
                        >
                            <Button label="Export Project into Dataset" />
                        </Grid>
                        <Grid
                            style={{ margin: "15px 0px 10px 0px", }}
                            item
                            xs={4}
                            md={4}
                            lg={4}
                            xl={4}
                            sm={4}
                        >
                            <Button label="Pull New Data Items from Source Dataset" />
                        </Grid>
                        <Grid
                            style={{ margin: "15px 0px 10px 0px", }}
                            item
                            xs={3}
                            md={3}
                            lg={3}
                            xl={3}
                            sm={3}
                        >
                            <Button label="Download project" />

                        </Grid>
                    </Grid>

                </Card>
            </Grid>
        </ThemeProvider>

    )
}

export default withStyles(DatasetStyle)(ProjectSetting);