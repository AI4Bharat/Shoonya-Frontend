import React, { useState, useEffect, useCallback } from "react";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import { ThemeProvider } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
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
import debounce from "lodash/debounce";

export default function DatasetList() {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const navigate = useNavigate();
  const [radiobutton, setRadiobutton] = useState(true);
  const [loading, setLoading] = useState(true);
  const datasetList = useSelector((state) => state.getDatasetList.data);
  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);

  const [listPage, setListPage] = useState(0);
  const [listRowsPerPage, setListRowsPerPage] = useState(10);

  const [cardPage, setCardPage] = useState(0);
  const [cardRowsPerPage, setCardRowsPerPage] = useState(9);
  
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFilters, setSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("datasetSelectedFilters");
    return savedFilters ? JSON.parse(savedFilters) : {
      dataset_type: "",
      dataset_visibility: "",
    };
  });

  const debouncedSearch = useCallback(
    debounce((query) => {
      setLoading(true);
      const projectObj = new GetDatasetsAPI({
        ...selectedFilters,
        page_number: 1,
        page_size: radiobutton ? listRowsPerPage : cardRowsPerPage,
        search: query
      });
      dispatch(APITransport(projectObj));
      setListPage(0);
      setCardPage(0);
    }, 500),
    [selectedFilters, listRowsPerPage, cardRowsPerPage, radiobutton, dispatch]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const getDashboardprojectData = () => {
    setLoading(true);
    const projectObj = new GetDatasetsAPI({
      ...selectedFilters,
      page_number: (radiobutton ? listPage : cardPage) + 1,
      page_size: radiobutton ? listRowsPerPage : cardRowsPerPage,
      search: searchQuery
    });
    dispatch(APITransport(projectObj));
  };

  useEffect(() => {
    setLoading(false);
    if (datasetList) {
      setTotalCount(datasetList.count || 0);
      if (datasetList.page_number) {
        if (radiobutton) {
          setListPage(datasetList.page_number - 1);
        } else {
          setCardPage(datasetList.page_number - 1);
        }
      }
      if (datasetList.page_size) {
        if (radiobutton) {
          setListRowsPerPage(datasetList.page_size);
        } else {
          setCardRowsPerPage(datasetList.page_size);
        }
      }
    }
  }, [datasetList, radiobutton]);

  useEffect(() => {
    getDashboardprojectData();
  }, [selectedFilters, radiobutton]);

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

  const handleListPageChange = (event, newPage) => {
    if (typeof newPage === 'number') {
      setListPage(newPage);
      const projectObj = new GetDatasetsAPI({
        ...selectedFilters,
        page_number: newPage + 1,
        page_size: listRowsPerPage,
        search: searchQuery
      });
      dispatch(APITransport(projectObj));
    }
  };

  const handleListRowsPerPageChange = (event) => {
    const newRowsPerPage = typeof event === 'number' ? event : parseInt(event.target.value, 10);
    if (newRowsPerPage > 0) {
      setListRowsPerPage(newRowsPerPage);
      setListPage(0);
      const projectObj = new GetDatasetsAPI({
        ...selectedFilters,
        page_number: 1,
        page_size: newRowsPerPage,
        search: searchQuery
      });
      dispatch(APITransport(projectObj));
    }
  };

  const handleCardPageChange = (event, newPage) => {
    if (typeof newPage === 'number') {
      setCardPage(newPage);
      const projectObj = new GetDatasetsAPI({
        ...selectedFilters,
        page_number: newPage + 1,
        page_size: cardRowsPerPage,
        search: searchQuery
      });
      dispatch(APITransport(projectObj));
    }
  };

  const handleCardRowsPerPageChange = (event) => {
    const newRowsPerPage = typeof event === 'number' ? event : parseInt(event.target.value, 10);
    if (newRowsPerPage > 0) {
      setCardRowsPerPage(newRowsPerPage);
      setCardPage(0);
      const projectObj = new GetDatasetsAPI({
        ...selectedFilters,
        page_number: 1,
        page_size: newRowsPerPage,
        search: searchQuery
      });
      dispatch(APITransport(projectObj));
    }
  };

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
          <Search onSearch={handleSearch} />
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
        <Box sx={{ p: 1, overflow: "hidden" }}>
          {radiobutton ? (
            <DatasetCardList
              datasetList={datasetList?.results || []}
              selectedFilters={selectedFilters}
              setsSelectedFilters={setSelectedFilters}
              page={listPage}
              rowsPerPage={listRowsPerPage}
              totalCount={totalCount}
              onPageChange={handleListPageChange}
              onRowsPerPageChange={handleListRowsPerPageChange}
            />
          ) : (
            <DatasetCard
              datasetList={datasetList?.results || []}
              selectedFilters={selectedFilters}
              setsSelectedFilters={setSelectedFilters}
              page={cardPage}
              rowsPerPage={cardRowsPerPage}
              totalCount={totalCount}
              onPageChange={handleCardPageChange}
              onRowsPerPageChange={handleCardRowsPerPageChange}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
