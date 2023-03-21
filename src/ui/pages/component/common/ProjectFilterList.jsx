import React, { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import { snakeToTitleCase } from "../../../../utils/utils";
import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import roles from "../../../../utils/UserMappedByRole/UserRoles";

const UserType = ["annotator", "reviewer"];
const archivedProjects = ["true", "false"];
const ProjectFilterList = (props) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const {
    filterStatusData,
    currentFilters,
    updateFilters,
  
  } = props;

  const [projectTypes, setProjectTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedArchivedProject, setSelectedArchivedProject] = useState("");
  const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );
  useEffect(() => {
    const typesObj = new GetProjectDomainsAPI();
    dispatch(APITransport(typesObj));
  }, []);

  useEffect(() => {
    if (ProjectTypes) {
      let types = [];
      Object.keys(ProjectTypes).forEach((key) => {
        let subTypes = Object.keys(ProjectTypes[key]["project_types"]);
        types.push(...subTypes);
      });
      setProjectTypes(types);
    }
  }, [ProjectTypes]);

  const handleChange = (e) => {
    updateFilters({
      ...currentFilters,
      project_type: selectedType,
      project_user_type: selectedUserType,
      archived_projects: selectedArchivedProject,
    });
    props.handleClose();
  };

  const handleChangeCancelAll = () => {
    updateFilters({
        project_type: "",
        project_user_type: "",
        archived_projects: "",
     
    });
    setSelectedType("")
    setSelectedUserType("")
    setSelectedArchivedProject("")
    props.handleClose();
  };

  return (
    <div>
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Grid container className={classes.filterContainer}>
          <Grid item xs={11} sm={11} md={11 } lg={11} xl={11} sx={{width:"130px"}} >
          <FormControl fullWidth size="small" >
            <InputLabel id="project-type-label" sx={{ fontSize: "16px" }}>Project Type</InputLabel>
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={selectedType}
              label="Project Type"
              onChange={(e) => setSelectedType(e.target.value)}
             
            >
              {projectTypes.map((type, index) => (
                <MenuItem value={type} key={index}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
            {/* <Typography
              variant="body2"
              sx={{ mr: 5, mb: 1, fontWeight: "900" }}
              className={classes.filterTypo}
            >
              Project Type :
            </Typography>
            <FormGroup>
              {projectTypes.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedType === type }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedType(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup> */}
          </Grid>
       
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{mt:2}}>
            <Typography
              variant="body2"
              sx={{  mb: 1, fontWeight: "900",width:"120px" }}
            >
              Project User Type :
            </Typography>
            <FormGroup>
              {UserType.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedUserType === type }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedUserType(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>
          {roles.filter((role) => role.role === loggedInUserData?.role)[0]?. ArchivedProjectsFilter  &&
          <Grid item xs={5} sm={5} md={5} lg={5} xl={5} sx={{mt:2}}>
            <Typography
              variant="body2"
              sx={{ mr: 5, mb: 1, fontWeight: "900" }}
              className={classes.filterTypo}
            >
              Archived Projects :
            </Typography>
            <FormGroup>
              {archivedProjects.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={
                          selectedArchivedProject === type 
                        }
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedArchivedProject(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }}
                  />
                );
              })}
            </FormGroup>
          </Grid>}
        </Grid>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            columnGap: "10px",
            padding:"15px"
          }}
        >
          <Button
            onClick={handleChangeCancelAll}
            variant="outlined"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Clear All
          </Button>
          <Button
            onClick={handleChange}
            variant="contained"
            color="primary"
            size="small"
            className={classes.clearAllBtn}
          >
            {" "}
            Apply
          </Button>
        </Box>
      </Popover>
    </div>
  );
};
export default ProjectFilterList;
