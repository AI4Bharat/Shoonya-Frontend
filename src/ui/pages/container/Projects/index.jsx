import { Box, Button, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import TaskTable from "../../component/Project/TaskTable";
import MembersTable from "../../component/Project/MembersTable";
import ReportsTable from "../../component/Project/ReportsTable";

const projectData = [
    { name: "Project ID", value: "1" },
    { name: "Description", value: "Desc" },
    { name: "Project Type", value: "Annotation - ContextualTranslationEditin" },
    { name: "Status", value: "Draft" },
]

const menuOptions = [
    { name: "Tasks", isChecked: false, component: () => null },
    { name: "Members", isChecked: false, component: () => null },
    { name: "Reports", isChecked: true, component: () => null }
]

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


const Projects = () => {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={themeDefault}>
            <Header />
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Card
                    sx={{
                        width: window.innerWidth * 0.8,
                        minHeight: 500,
                        padding: 5
                    }}
                >
                    <Typography variant="h3">Project Name</Typography>
                    {projectData.map((el, i) => {
                        return (
                            <Grid
                                container
                                alignItems="center"
                                direction="row"
                                justifyContent="flex-start"
                                sx={{
                                    paddingTop: 2
                                }}
                            >
                                <Typography variant="body2" fontWeight='700' pr={1}>{el.name} :</Typography>
                                <Typography variant="caption">{el.value}</Typography>
                            </Grid>
                        )
                    })}
                    <Button
                        sx={{
                            marginTop: 2,
                            marginBottom: 2,
                            padding: 1,
                            backgroundColor: "primary.main",
                            borderRadius : 2
                        }}
                        variant="contained"
                    >
                        <Typography variant="caption">Show Project Setting</Typography>
                    </Button>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="nav tabs example" TabIndicatorProps={{style: {backgroundColor: "#2C2799"}}}>
                            <Tab label="Tasks" sx={{fontSize : 16, fontWeight : '700'}} />
                            <Tab label="Members" sx={{fontSize : 16, fontWeight : '700'}} />
                            <Tab label="Reports" sx={{fontSize : 16, fontWeight : '700'}} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <TaskTable />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <MembersTable />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <ReportsTable />
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    )
}

export default Projects;