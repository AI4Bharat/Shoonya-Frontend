import { Button, Divider, Grid, Link, Paper, styled, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import { translate } from "../../../../config/localisation";
import themeDefault from "../../../theme/theme";
import Header from "../../component/common/Header";
import ProjectCard from "../../component/common/ProjectCard";
import UserCard from "../../component/common/UserCard";
import WorkspaceTable from "../../component/common/WorkspaceTable";
import dashboardStyle from "../../../styles/dashboard";

const Dashboard = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: themeDefault.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...themeDefault.typography.body2,
        padding: themeDefault.spacing(1),
        textAlign: 'center',
        color: themeDefault.palette.text.secondary,
    }));

    const classes = dashboardStyle();
    return (
        <React.Fragment>
            <Header />
            <Grid
                container
                className={classes.parentContainer}               
                spacing={2}
            >
                <Grid item xs={3}>
                    <Grid
                        container
                        className={classes.userCardContainer}
                        spacing={1}
                    >
                        <UserCard />
                    </Grid>

                </Grid>
                <Grid item xs={9}>
                    <Grid
                        container
                        direction='column'
                        className={classes.dashboardContentContainer}
                        spacing={1}
                    >
                        <ProjectCard />
                        <Divider />
                        <WorkspaceTable />
                    </Grid>

                </Grid>
            </Grid>
        </React.Fragment>

    )
}

export default Dashboard;