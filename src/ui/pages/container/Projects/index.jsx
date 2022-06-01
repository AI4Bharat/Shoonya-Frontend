import { Box, Button, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
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
                width={window.innerWidth}
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
                                <Typography variant="body2" fontWeight='700'>{el.name} : </Typography>
                                <Typography variant="caption"> {el.value}</Typography>
                            </Grid>
                        )
                    })}
                     <Link to={`/projects/1/projectsetting`} style={{ textDecoration: "none" }}>
                    <Button
                        sx={{
                            marginTop: 2,
                            padding: 1,
                            backgroundColor: "primary",
                            borderRadius : 2
                        }}
                        variant="contained"
                    >
                        <Typography variant="caption">Show Project Setting</Typography>
                    </Button>
                    </Link>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Tasks" {...a11yProps(0)} />
                            <Tab label="Members" {...a11yProps(1)} />
                            <Tab label="Reports" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        Item One
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    )
}

export default Projects;