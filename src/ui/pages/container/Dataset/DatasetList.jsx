import React, { useState, useEffect } from "react";
import { Radio, Box, Grid, Typography, ThemeProvider } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import DatasetCardList from "./DatasetCardList";
import DatasetCard from "./DatasetCard";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useDispatch, useSelector } from "react-redux";
import GetDatasetsAPI from "../../../../redux/actions/api/Dataset/GetDatasetList";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../component/common/Button";
import Spinner from "../../component/common/Spinner";
import DatasetStyle from "../../../styles/Dataset";
import themeDefault from "../../../theme/theme";
import Search from "../../component/common/Search";
import userRole from "../../../../utils/UserMappedByRole/Roles";

export default function DatasetList() {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const [radiobutton, setRadiobutton] = useState(true);
  const [loading, setLoading] = useState(false);
  const datasetList = useSelector((state) => state.getDatasetList.data);
  const apiLoading = useSelector((state) => state.apiStatus.loading);

  const [selectedFilters, setsSelectedFilters] = useState(() => {
  const savedFilters = localStorage.getItem("datasetSelectedFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : { dataset_visibility: "", dataset_type: "" };
  });
  const getDashboardprojectData = () => {
    const projectObj = new GetDatasetsAPI(selectedFilters);
    dispatch(APITransport(projectObj));
  };
  
  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );


  useEffect(() => {
    getDashboardprojectData();
  }, [selectedFilters]);

  useEffect(() => {
    localStorage.setItem(
      "datasetSelectedFilters",
      JSON.stringify(selectedFilters),
    );
  }, [selectedFilters]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };
  const handleProjectcard = () => {
    setRadiobutton(false);
  };
  const handleCreateProject = (e) => {
    navigate(`/create-Dataset-Instance-Button/`);
  };
  //   useEffect(()=>{
  //     getDatasetList();
  // },[]);

  //   const handleCreateProject =(e)=>{
  //       navigate(`/create-Dataset-Instance-Button/`)
  //   }

  const handleAutomateButton = (e) => {
    navigate("/datasets/automate");
  };
   useEffect(() => {
      setLoading(apiLoading);
  }, [apiLoading])

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}

      <Grid container className={classes.root}>
        <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "7px", paddingLeft: "15px" }}>
            View :{" "}
          </Typography>
        </Grid>
        <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="DatasetList"
            >
              <FormControlLabel
                value="DatasetList"
                control={<Radio />}
                label="List"
                onClick={handleProjectlist}
              />
              <FormControlLabel
                value="DatasetCard"
                control={<Radio />}
                label="Card"
                onClick={handleProjectcard}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid xs={3} item   sx={{mt:1,mb:1,mr:2,ml:2,width:200}}>
          <Search />
        </Grid>
      </Grid>

      <Box>
        <CustomButton
          sx={{
            p: 2,
            borderRadius: 3,
            m:1,
            justifyContent: "flex-end",
          }}
          onClick={handleCreateProject}
          label="Create New Dataset Instance"
        />
        <CustomButton
          sx={{
            p: 2,
            borderRadius: 3,
            mt: 2,
            mb: 2,
            ml: 2,
            justifyContent: "flex-end",
          }}
          disabled = {userRole.Admin === loggedInUserData?.role? false : true}
          onClick={handleAutomateButton}
          label="Automate Datasets"
        />
        <Box sx={{ p: 1,overflow:"hidden" }}>
          {radiobutton ? (
            <DatasetCardList
              datasetList={datasetList}
              selectedFilters={selectedFilters}
              setsSelectedFilters={setsSelectedFilters}
            />
          ) : (
            <DatasetCard
              datasetList={datasetList}
              selectedFilters={selectedFilters}
              setsSelectedFilters={setsSelectedFilters}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
