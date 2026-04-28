import React, { useEffect, useState, useMemo } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ProjectCardList from "./ProjectCardList";
import ProjectCard from "./ProjectCard";
import Spinner from "../../component/common/Spinner";
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../component/common/Search";
import DatasetStyle from "../../../styles/Dataset";
import themeDefault from "../../../theme/theme";
import tableTheme from "../../../theme/tableTheme";
import { getUserProjects } from "../../../../utils/bookmarkService";
import CustomizedSnackbars from "../../component/common/Snackbar";

const ProjectList = React.memo(function ProjectList() {
  const [radiobutton, setRadiobutton] = useState(true);
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setsSelectedFilters] = useState({
    project_type: "",
    project_user_type: "",
    archived_projects: "",
  });
  const apiLoading = useSelector((state) => state.apiStatus.loading);
  const projectData = useSelector((state) => state.getProjects.data);
  
  const getDashboardprojectData = () => {
    setLoading(true);
    const projectObj = new GetProjectsAPI(selectedFilters);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    setLoading(false);
  }, [projectData]);

  useEffect(() => {
    getDashboardprojectData();
  }, [selectedFilters]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const [bookmarkedProjects, setBookmarkedProjects] = useState([]);

  const fetchBookmarkedProjects = async () => {
    try {
      const data = await getUserProjects();
      setBookmarkedProjects(data.results || []);
    } catch (error) {
      console.error('Error fetching bookmarked projects:', error);
      setSnackbarInfo({
        open: true,
        message: "Failed to fetch bookmarked projects",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchBookmarkedProjects();
  }, []);

  const bookmarkedProjectIds = useMemo(() => {
    return new Set(bookmarkedProjects.map(project => project.id));
  }, [bookmarkedProjects]);

  const displayedProjects = useMemo(() => {
    if (!projectData || !Array.isArray(projectData)) return [];

    const bookmarked = [];
    const nonBookmarked = [];

    for (let i = 0; i < projectData.length; i++) {
      const project = projectData[i];
      const isBookmarked = project.is_bookmarked || bookmarkedProjectIds.has(project.id);
      
      if (isBookmarked) {
        bookmarked.push(project);
      } else {
        nonBookmarked.push(project);
      }
    }

    return [...bookmarked, ...nonBookmarked];
  }, [projectData, bookmarkedProjectIds]);

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      {renderSnackBar()}

      {/* <Grid container direction="row" columnSpacing={3} rowSpacing={2} sx={{ position: "static", bottom: "-51px", left: "20px" }} > */}
      <Grid container className={classes.root}>
        <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "7px" }}>
            View :{" "}
          </Typography>
        </Grid>
        <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="ProjectList"
            >
              <FormControlLabel
                value="ProjectList"
                control={<Radio />}
                label="List"
                onClick={handleProjectlist}
              />
              <FormControlLabel
                value="ProjectCard"
                control={<Radio />}
                label="Card"
                onClick={handleProjectcard}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* <Grid  >
                    <FormControl >
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="ProjectList"
                            sx={{ marginLeft: "10px" }}
                        >

                            <FormControlLabel value="ProjectList" control={<Radio />} label="List view" onClick={handleProjectlist} />
                            <FormControlLabel value="ProjectCard" control={<Radio />} label="Card view" onClick={handleProjectcard} />

                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid> */}
        <Grid xs={3} item className={classes.fixedWidthContainer}>
          <Search />
        </Grid>
      </Grid>
      {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Search />
            </Grid> */}
      <Box>
        <Box sx={{ marginTop: "20px" }}>
          {radiobutton ? (
            <ProjectCardList
              projectData={displayedProjects}
              selectedFilters={selectedFilters} 
              setsSelectedFilters={setsSelectedFilters} 
              bookmarkedProjectIds={bookmarkedProjectIds}
            />
          ) : (
            <ProjectCard projectData={displayedProjects}
             selectedFilters={selectedFilters} 
            setsSelectedFilters={setsSelectedFilters}  />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
});

export default ProjectList;
