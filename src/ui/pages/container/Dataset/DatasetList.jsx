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
import { useNavigate } from "react-router-dom";
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

  const [selectedFilters, setsSelectedFilters] = useState({
    dataset_visibility: "",
    dataset_type: "",
  });

  const loggedInUserData = useSelector(
    (state) => state.fetchLoggedInUserData.data
  );

  const getDashboardprojectData = () => {
    const projectObj = new GetDatasetsAPI(selectedFilters);
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    getDashboardprojectData();
  }, [selectedFilters]);

  useEffect(() => {
    setLoading(apiLoading);
  }, [apiLoading]);

  const handleProjectlist = () => {
    setRadiobutton(true);
  };

  const handleProjectcard = () => {
    setRadiobutton(false);
  };

  const handleCreateProject = () => {
    navigate(`/create-Dataset-Instance-Button/`);
  };

  const handleAutomateButton = () => {
    navigate("/datasets/automate");
  };

  return (
    <ThemeProvider theme={themeDefault}>
      {(loading || !datasetList || datasetList.length === 0) && <Spinner />}

      <Grid container className={classes.root}>
        <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "8px" }}>
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
        <Grid xs={3} item className={classes.fixedWidthContainer}>
          <Search />
        </Grid>
      </Grid>

      <Box>
        <CustomButton
          sx={{
            p: 2,
            borderRadius: 3,
            mt: 2,
            mb: 2,
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
          disabled={userRole.Admin === loggedInUserData?.role ? false : true}
          onClick={handleAutomateButton}
          label="Automate Datasets"
        />
        <Box sx={{ p: 1 }}>
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
