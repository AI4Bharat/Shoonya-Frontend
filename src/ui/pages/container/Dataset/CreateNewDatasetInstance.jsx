import {
  Box,
  Card,
  Grid,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from "../../../theme/theme";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import CreateNewDatasetInstanceAPI from "../../../../redux/actions/api/Dataset/CreateNewDatasetInstance";
import FetchLoggedInUserDataAPI from "../../../../redux/actions/api/UserManagement/FetchLoggedInUserData";
import GetDatasetTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetType"
import MenuItems from "../../component/common/MenuItems"

const CollectionProject = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const [instance_Name, setInstance_Name] = useState("")
  const [parent_Instance_Id, setParent_Instance_Id] = useState("")
  const [instance_Description, setInstance_Description] = useState("")
  const [organisation_Id, setOrganisation_Id] = useState("")
  const [users, setUsers] = useState("")
  const [datasettype, setDatasettype] = useState("");
  const [type, setType] = useState([]);


  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );

  useEffect(() => {
    setUsers([loggedInUserData.id])
  },)
 
  const handleCreate = () => {
    const CreateDatasetInstance = {
      instance_name: instance_Name,
      parent_instance_id: parent_Instance_Id,
      instance_description: instance_Description,
      dataset_type:datasettype,
      organisation_id: organisation_Id,
      users: users,
    }
    const projectObj = new CreateNewDatasetInstanceAPI(CreateDatasetInstance);
    dispatch(APITransport(projectObj));
  }

  const datasetType = useSelector(state => state.GetDatasetType.data);

  const getProjectDetails = () => {
    const projectObj = new GetDatasetTypeAPI(id);
    dispatch(APITransport(projectObj));
  }

  useEffect(() => {
    getProjectDetails();

  }, []);
  


  useEffect(() => {
    if (datasetType && datasetType.length > 0) {
      let temp = [];
      datasetType.forEach((element) => {
        temp.push({
        
          name: element,
          value: element,

        });
      });
      setType(temp);
    }
  }, [datasetType]);
  console.log(loggedInUserData,"loggedInUserData")
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
              Create New Dataset Instance
              </Typography>
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Instance_Name *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={instance_Name}
                onChange={(e) => setInstance_Name(e.target.value)}
                required
              />
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Parent_Instance_Id:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={parent_Instance_Id}
                onChange={(e) => setParent_Instance_Id(e.target.value)}
              />
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Instance_Description:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={instance_Description}
                onChange={(e) => setInstance_Description(e.target.value)}
              />
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Dataset_Type *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={type}
                handleChange={(value) => setDatasettype(value)}
                value={datasettype}
              />
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Organisation_Id:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={organisation_Id}
                onChange={(e) => setOrganisation_Id(e.target.value)}
              />
            </Grid>
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                User *:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <OutlinedTextField
                fullWidth
                value={users}
                onChange={(e) => setUsers(e.target.value)}
              />
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
              sx={{ mt: 3 }}
            >

              <Button
                style={{ margin: "0px 20px 0px 0px" }}
                label={"Confirm"}
                onClick={handleCreate}
                disabled={ ( instance_Name && datasettype   ) ? false : true}

              />

              <Button
                label={"Cancel"}
                onClick={() => navigate(`/datasets/`)}
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
