import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
  import React, { useEffect, useState } from "react";
  import themeDefault from "../../../theme/theme";
  import {  useNavigate, useParams } from "react-router-dom";
  import Button from "../../component/common/Button";
  import OutlinedTextField from "../../component/common/OutlinedTextField";
  import DatasetStyle from "../../../styles/Dataset";
  import MenuItems from "../../component/common/MenuItems";
  import { useDispatch, useSelector } from "react-redux";
  import CreateProjectAPI from "../../../../redux/actions/api/ProjectDetails/CreateProject";
  import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
  import APITransport from "../../../../redux/actions/apitransport/apitransport";
  
  const CollectionProject = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
  
    const User = useSelector((state) => state.fetchLoggedInUserData.data);
    const NewProject = useSelector((state) => state.createProject.data);
    const ProjectDomains = useSelector((state) => state.getProjectDomains.data);
  
    const [domains, setDomains] = useState([]);
    const [projectTypes, setProjectTypes] = useState(null);
  
    //Form related state variables
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedType, setSelectedType] = useState("");
  
    useEffect(() => {
      const domainObj = new GetProjectDomainsAPI();
      dispatch(APITransport(domainObj));
    }, []);
  
    useEffect(() => {
      if (NewProject.id) {
        navigate(`/projects/${NewProject.id}`, { replace: true });
      }
    }, [NewProject]);
  
    useEffect(() => {
      if (User) {
        const tempDomains = [];
        const tempTypes = {};
        const tempDatasetTypes = {};
        const tempColumnFields = {};
        for (const domain in ProjectDomains) {
          for (const project_type in ProjectDomains[domain]["project_types"]) {
            if (
              ProjectDomains[domain]["project_types"][project_type]
                .project_mode === "Collection"
            ) {
              tempDomains.push(domain);
            }
          }
  
          const tempTypesArr = [];
  
          for (const project_type in ProjectDomains[domain]["project_types"]) {
            if (
              ProjectDomains[domain]["project_types"][project_type]
                .project_mode === "Collection"
            ) {
              tempTypesArr.push(project_type);
            }
  
            if (
              ProjectDomains[domain]["project_types"][project_type][
                "input_dataset"
              ]
            ) {
              tempDatasetTypes[project_type] =
                ProjectDomains[domain]["project_types"][project_type][
                  "input_dataset"
                ]["class"];
              tempColumnFields[project_type] =
                ProjectDomains[domain]["project_types"][project_type][
                  "input_dataset"
                ]["fields"];
            }
          }
          tempTypes[domain] = tempTypesArr;
        }
        setDomains(
          tempDomains.map((key) => {
            return {
              name: key,
              value: key,
            };
          })
        );
        setProjectTypes(tempTypes);
      }
    }, [ProjectDomains]);
  
    const onSelectDomain = (value) => {
      setSelectedDomain(value);
      setSelectedType("");
    };
  
    const onSelectProjectType = (value) => {
      setSelectedType(value);
    };
  
    const handleCreateProject = () => {
      const newProject = {
        title: title,
        description: description,
        created_by: User?.id,
        is_archived: false,
        is_published: false,
        users: [User?.id],
        workspace_id: +id,
        organization_id: User?.organization?.id,
        project_type: selectedType,
        label_config: "string",
        variable_parameters: {},
        project_mode: "Collection",
        required_annotators_per_task: 1,
      };
      const projectObj = new CreateProjectAPI(newProject);
      dispatch(APITransport(projectObj));
    };
    return (
      <ThemeProvider theme={themeDefault}>
        {/* <Header /> */}
        {/* <Grid
                  container
                  direction='row'
                  justifyContent='left'
                  alignItems='left'
  
  
              >
                  <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                  > */}
                  
        <Grid container direction="row"  >
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Create a Project
              </Typography>
            </Grid>
  
            <Grid container direction="row">
              <Grid
                items
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className={classes.projectsettingGrid}
              >
                <Typography gutterBottom component="div" label="Required">
                  Title:
                </Typography>
              </Grid>
              <Grid item md={12} lg={12} xl={12} sm={12} xs={12}>
                <OutlinedTextField
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
            </Grid>
  
            <Grid
              className={classes.projectsettingGrid}
              items
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Description:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
  
            {domains && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  items
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                  Select a Category to Work in:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={domains}
                    handleChange={onSelectDomain}
                    value={selectedDomain}
                  />
                </Grid>
              </>
            )}
  
            {selectedDomain && (
              <>
                <Grid
                  className={classes.projectsettingGrid}
                  items
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Typography gutterBottom component="div">
                    Select a Project Type:
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                  <MenuItems
                    menuOptions={projectTypes[selectedDomain].map((key) => {
                      return {
                        name: key,
                        value: key,
                      };
                    })}
                    handleChange={onSelectProjectType}
                    value={selectedType}
                  />
                </Grid>
              </>
            )}
  
            <Grid
              className={classes.projectsettingGrid}
              items
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Finalize Project
              </Typography>
            </Grid>
  
            <Grid
              className={classes.projectsettingGrid}
              style={{}}
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
            >
              {title !== "" && selectedType !== "" && (
                <Button
                  style={{ margin: "0px 20px 0px 0px" }}
                  label={"Create Project"}
                  onClick={handleCreateProject}
                />
              )}
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/workspaces/${id}`)}
              />
            </Grid>
          </Grid>
          </Card>
        </Grid>
      
        {/* </Grid>
              </Grid> */}
      </ThemeProvider>
    );
  };
  
  export default CollectionProject;
  