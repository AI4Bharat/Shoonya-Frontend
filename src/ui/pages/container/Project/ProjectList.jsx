import React, { useEffect, useState } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import ProjectCardList from "./ProjectCardList";
import ProjectCard from "./ProjectCard";
import Spinner from "../../component/common/Spinner"
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from 'react-redux';
import Search from "../../component/common/Search";
import DatasetStyle from "../../../styles/Dataset";
import themeDefault from "../../../theme/theme";
import tableTheme from "../../../theme/tableTheme";


export default function ProjectList() {
    const [radiobutton, setRadiobutton] = useState(true)
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const projectData = useSelector(state => state.getProjects.data);

    const getDashboardprojectData = () => {
        setLoading(true);
        const projectObj = new GetProjectsAPI();
        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        setLoading(false);
    }, [projectData])

    useEffect(() => {
        getDashboardprojectData();

    }, []);

    const handleProjectlist = () => {
        setRadiobutton(true)

    }
    const handleProjectcard = () => {
        setRadiobutton(false)
    }


    return (
        <ThemeProvider theme={themeDefault}>
            {loading && <Spinner />}

            <Grid container justifyContent="end"  >
                <Grid className={classes.projectgrid}>
                    <Typography sx={{ marginRight: "10px", fontSize: "20px", fontWeight: 500, marginTop: "3px" }} >View :</Typography> </Grid>
                <Grid className={classes.projectgrid}> <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        defaultValue="ProjectList"
                    >
                        <FormControlLabel value="ProjectList" control={<Radio />} label="List view" onClick={handleProjectlist} />
                        <FormControlLabel value="ProjectCard" control={<Radio />} label="Card view" onClick={handleProjectcard} />

                    </RadioGroup>
                </FormControl>
                </Grid>
                <Grid>
                    <Search />
                </Grid>
            </Grid>

            <Box >
                <Box sx={{ marginTop: "20px" }}>
                    {radiobutton ? <ProjectCardList projectData={projectData} /> : <ProjectCard projectData={projectData} />}
                </Box>
            </Box>
        </ThemeProvider>
    );
}