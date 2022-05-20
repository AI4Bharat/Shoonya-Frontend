import { Button, Grid, Link, Paper, styled, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import { translate } from "../../../../config/localisation";
import themeDefault from "../../../theme/theme";
import Header from "../../component/common/Header";
import UserCard from "../../component/common/UserCard";

const Dashboard = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: themeDefault.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...themeDefault.typography.body2,
        padding: themeDefault.spacing(1),
        textAlign: 'center',
        color: themeDefault.palette.text.secondary,
    }));
    return (
        <ThemeProvider theme={themeDefault}>
            <Header />
            <Grid
                container
                // direction="column"
                // alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
                spacing={2}
            >
                <Grid item xs={3} sm={12} md={12}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="space-around"
                        style={{ height: "100%" }}
                        spacing={2}
                    >
                        <UserCard />
                        <Item style={{ visibility: "hidden" }}></Item>
                    </Grid>

                </Grid>
                <Grid item xs={9}>
                    <Grid
                        container
                        direction="column"
                        alignItems="left"
                        justifyContent="space-around"
                        style={{ height: "100%" }}
                        spacing={2}
                    >
                        {/* Project List */}
                        {/* Workspace List */}
                    </Grid>

                </Grid>
            </Grid>
        </ThemeProvider>

    )
}

export default Dashboard;