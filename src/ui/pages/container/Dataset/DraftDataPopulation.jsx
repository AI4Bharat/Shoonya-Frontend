import React, { useState, useEffect } from 'react';
import {

  ThemeProvider,
} from '@mui/material';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Spinner from "../../component/common/Spinner";
import Snackbar from "../../component/common/Snackbar";
import DatasetStyle from "../../../styles/Dataset";
import Button from "../../component/common/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
// import GetDatasetTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetType";
import GetDatasetsByTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetsByType";
import GetDataitemsByIdAPI from "../../../../redux/actions/api/Dataset/GetDataitemsById";
import intraAutomateDatasetsAPI from "../../../../redux/actions/api/Dataset/intraAutomateDatasetsAPI";
import MenuItems from "../../component/common/MenuItems";
import { MenuProps } from "../../../../utils/utils";
import themeDefault from "../../../theme/theme";


const DraftDataPopulation = () => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [srcDatasetTypes, setSrcDatasetTypes] = useState([]);
  const [srcDatasetType, setSrcDatasetType] = useState('');
  const [srcInstances, setSrcInstances] = useState([]);
  const [field, setfield] = useState([]);
  const [Field,setField] = useState([]);
  const [srcInstance, setSrcInstance] = useState('');
  // const [instance, setinstance] = useState("");
  // const [org_id, setorg_id] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });

  // const Fields = ["draft_data_json", "input_language", "output_language", "input_text", "output_text", "machine_translation", "context", "labse_score", "rating", "domain", "parent_data", "instance_id"];

  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
  const DatasetTypes = useSelector((state) => state.GetDatasetType.data);
  const dataitemsList = useSelector((state) => state.getDataitemsById.data);


  useEffect(() => {
    if (DatasetTypes && DatasetTypes.length > 0) {
      let temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element
          // disabled: (element !== "SentenceText" && element !== "Conversation")
        });
      });
      setSrcDatasetTypes(temp);
      temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element
          // disabled: (srcDatasetType === "SentenceText" ? element !== "TranslationPair" : element !== "Conversation")
        });
      });
    }
  }, [DatasetTypes, srcDatasetType]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setfield(
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  useEffect(() => {
    setLoading(false);
    if (dataitemsList.results?.length > 0) {
        let values = Object.keys(dataitemsList.results[0]) 
        setField(values)
    }
  }, [dataitemsList]);



  useEffect(() => {
    setLoading(false);
    if (DatasetInstances?.length > 0) {
      if (DatasetInstances[0].dataset_type === srcDatasetType)
        setSrcInstances(DatasetInstances)
    }
  }, [DatasetInstances]);

  

  const handleSrcDatasetTypeChange = (value) => {
    setSrcDatasetType(value);
    setLoading(true);
    const instancesObj = new GetDatasetsByTypeAPI(value);
    dispatch(APITransport(instancesObj));
  };

  const handleField =(value)=>{
    setSrcInstance(value);
    setLoading(true);
    const fieldObj = new GetDataitemsByIdAPI(value,srcDatasetType);
    dispatch(APITransport(fieldObj));
  }


  const handleConfirm = async () => {
    setLoading(true);
    const org_id = await (DatasetInstances.filter((items) => {
      return items.instance_id === srcInstance
    })[0].organisation_id);
    const apiObj = new intraAutomateDatasetsAPI(srcInstance, org_id, field);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    }).then(async (res) => {
      setLoading(false);
      if (!res.ok) throw await res.json();
      else return await res.json();
    }).then((res) => {
      setSnackbarState({ open: true, message: res.message, variant: "success" });
    }).catch((err) => {
      setSnackbarState({ open: true, message: err.message, variant: "error" });
    });
    setSrcDatasetType('');
    setSrcInstance('');
    setfield([])

  }

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid container direction="row"  paddingTop={3}>
        {/* <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            > */}
              <Typography variant="h6" gutterBottom component="div">
              Populate Draft Data Json
              </Typography>
            {/* </Grid> */}
            <Grid className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}>
            </Grid>
            <Typography gutterBottom component="div">
              Select dataset type:
            </Typography>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={srcDatasetTypes}
                handleChange={handleSrcDatasetTypeChange}
                value={srcDatasetType}
              />
            </Grid>
            {srcDatasetType && srcInstances.length > 0 && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Source dataset instance:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl fullWidth >
                  <Select
                    labelId="project-type-label"
                    id="project-type-select"
                    value={srcInstance}
                    onChange={(e)=>handleField(e.target.value)}
                    MenuProps={MenuProps}
                  >
                    {srcInstances.map((type, index) => (
                      <MenuItem value={type.instance_id} key={index}>
                        {type.instance_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>}
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
            >
              <Typography gutterBottom component="div">
                Select Field:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={field}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(',')}
                  MenuProps={MenuProps}
                >
                  {Field.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={field.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            <Grid
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
                onClick={handleConfirm}
              disabled={(srcInstance=="" || field=="" || srcDatasetType=="") ? true : false}
              />
              <Button
                label={"Cancel"}
              onClick={() => navigate(`/datasets/`)}
              />
            </Grid>
          </Grid>
        {/* </Card>
      </Grid> */}
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        hide={2000}
      />

    </ThemeProvider>

  );
};

export default DraftDataPopulation;