import { Button, Divider, Grid, Link, Paper, styled, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import { translate } from "../../../../config/localisation";
import themeDefault from "../../../theme/theme";
import Header from "../../component/common/Header";
import ProjectCard from "../../component/common/ProjectCard";
import UserCard from "../../component/common/UserCard";
import WorkspaceTable from "../../component/common/WorkspaceTable";

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
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                style={{ minHeight: "100vh" }}
                spacing={2}
            >
                <Grid item xs={3}>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{ height: "100%" }}
                        spacing={1}
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
                        justifyContent="space-between"
                        style={{ minHeight: "70vh" }}
                        spacing={2}
                    >
                        <ProjectCard />
                        <Divider />
                        <WorkspaceTable />
                    </Grid>

                </Grid>
            </Grid>
        </ThemeProvider>

    )
}

export default Dashboard;