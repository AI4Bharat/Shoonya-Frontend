import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import { useNavigate } from "react-router-dom";
import Button from "../../component/common/Button";
import MenuItems from "../../component/common/MenuItems";
import Spinner from "../../component/common/Spinner";
import Snackbar from "../../component/common/Snackbar";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import GetDatasetTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetType";
import GetDatasetsByTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetsByType";
import AutomateDatasetsAPI from "../../../../redux/actions/api/Dataset/AutomateDatasets";
import GetLanguageChoicesAPI from "../../../../redux/actions/api/ProjectDetails/GetLanguageChoices";
import GetIndicTransLanguagesAPI from "../../../../redux/actions/api/Dataset/GetIndicTransLanguages";
import roles from "../../../../utils/UserMappedByRole/Roles";
import { MenuProps } from "../../../../utils/utils";

const InterAutomateDataset = () => {
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const [srcDatasetTypes, setSrcDatasetTypes] = useState([]);
  const [tgtDatasetTypes, setTgtDatasetTypes] = useState([]);
  const [srcDatasetType, setSrcDatasetType] = useState('');
  const [tgtDatasetType, setTgtDatasetType] = useState('');
  const [srcInstances, setSrcInstances] = useState([]);
  const [tgtInstances, setTgtInstances] = useState([]);
  const [srcInstance, setSrcInstance] = useState('');
  const [tgtInstance, setTgtInstance] = useState('');
  const [languageChoices, setLanguageChoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [translationModel, setTranslationModel] = useState('');
  const [checks, setChecks] = useState('False');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });
  //const [api_type, setApi_type] = useState("indic-trans");

  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
  const DatasetTypes = useSelector((state) => state.GetDatasetType.data);
  const LanguageChoicesIndicTrans = useSelector((state) => state.getIndicTransLanguages.data);
  const LanguageChoicesAll = useSelector((state) => state.getLanguageChoices.data);
  
  useEffect(() => {
    const obj = new GetDatasetTypeAPI();
    dispatch(APITransport(obj));
    const langListObj1 = new GetIndicTransLanguagesAPI();
    dispatch(APITransport(langListObj1));
    const langListObj2 = new GetLanguageChoicesAPI();
    dispatch(APITransport(langListObj2));
  }, []);

  useEffect(() => {
    if (DatasetTypes && DatasetTypes.length > 0) {
      let temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element,
          disabled: (element !== "SentenceText" && element !== "Conversation")
        });
      });
      setSrcDatasetTypes(temp);
      temp = [];
      DatasetTypes.forEach((element) => {
        temp.push({
          name: element,
          value: element,
          disabled: (srcDatasetType === "SentenceText" ? element !== "TranslationPair" : element !== "Conversation")
        });
      });
      setTgtDatasetTypes(temp);
    }
  }, [DatasetTypes, srcDatasetType]);

  useEffect(() => {
    setLoading(false);
    if (DatasetInstances?.length > 0) {
      if (DatasetInstances[0].dataset_type === srcDatasetType)
        setSrcInstances(DatasetInstances);
      if (DatasetInstances[0].dataset_type === tgtDatasetType)
        setTgtInstances(DatasetInstances);
    }
  }, [DatasetInstances]);

  const handleSrcDatasetTypeChange = (value) => {
    setSrcDatasetType(value);
    setLoading(true);
    const instancesObj = new GetDatasetsByTypeAPI(value);
    dispatch(APITransport(instancesObj));
  };

  const handleTgtDatasetTypeChange = (value) => {
    setTgtDatasetType(value);
    setLoading(true);
    const instancesObj = new GetDatasetsByTypeAPI(value);
    dispatch(APITransport(instancesObj));
  };

  const handleTransModelChange = (value) => {
    setTranslationModel(value);
    setLanguages([]);
    if (value === 1) {
      if (!LanguageChoicesIndicTrans?.supported_languages)
        setSnackbarState({ open: true, message: "Error fetching language list", variant: "error" })
      else setLanguageChoices(LanguageChoicesIndicTrans?.supported_languages.map(lang => {
        return {
          name: lang,
          value: lang
        }
      }));
    } else {
      if (!LanguageChoicesAll)
        setSnackbarState({ open: true, message: "Error fetching language list", variant: "error" })
      else setLanguageChoices(LanguageChoicesAll.map(lang => {
        return {
          name: lang[0],
          value: lang[0]
        }
      }));
    }
  };

const api_type = translationModel===1?"indic-trans": translationModel===2?"google":translationModel===3?"azure":"indic-trans-v2";
  const handleConfirm = () => {
    const apiObj = new AutomateDatasetsAPI(srcInstance, tgtInstance, languages, loggedInUserData.organization.id,checks,api_type,checked);
    setLoading(true);
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
  };

  if (roles?.Annotator === loggedInUserData?.role) return navigate("/projects");

  // const handleAPi_Type = (e) => {
  //   setApi_type(e.target.value)
  // }

  const handleChangeAutomatemissingitems = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid container direction="row"  paddingTop={3}>
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Inter-Automate Datasets
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
                Source dataset type:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={srcDatasetTypes}
                handleChange={handleSrcDatasetTypeChange}
                value={srcDatasetType}
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
                Target dataset type:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={tgtDatasetTypes}
                handleChange={handleTgtDatasetTypeChange}
                value={tgtDatasetType}
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
              onChange={(e) => setSrcInstance(e.target.value)}
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
            {tgtDatasetType && tgtInstances.length > 0 && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Target dataset instance:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>    
            <FormControl fullWidth >
            <Select
              labelId="project-type-label"
              id="project-type-select"
              value={tgtInstance}
              onChange={(e) => setTgtInstance(e.target.value)}
              MenuProps={MenuProps}
            >
              {tgtInstances.map((type, index) => (
                <MenuItem value={type.instance_id} key={index}>
                  {type.instance_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
              </Grid>
            </>}
            {tgtDatasetType === "TranslationPair" && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Choice of translation model:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <MenuItems
                  menuOptions={[{
                    name: "AI4Bharat IndicTrans",
                    value: 1
                  }, ...((roles?.OrganizationOwner === loggedInUserData?.role || roles?.Admin === loggedInUserData?.role )? [{
                    name: "Google Translate",
                    value: 2
                  },{
                    name: "Microsoft Azure Translate",
                    value: 3
                  },{
                    name: "AI4Bharat IndicTrans V2",
                    value: 4
                  }] : [])]}
                  handleChange={handleTransModelChange}
                  value={translationModel}
                />
              </Grid>
            </>}
            {translationModel && <>
              <Grid
                className={classes.projectsettingGrid}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
              >
                <Typography gutterBottom component="div">
                  Target Languages:
                </Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
                <FormControl
                  fullWidth
                  sx={{ minWidth: 120 }}
                >
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    onChange={(e) => {
                      setLanguages(e.target.value);
                      }}
                    value={languages}
                    multiple
                    MenuProps={MenuProps}
                  >
                    {languageChoices.map((lang) => (
                      <MenuItem key={lang.name} value={lang.name}>
                        {lang.name}
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
                Checks for particular language:
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <MenuItems
                menuOptions={[{
                  name: "True",
                  value: "True"
                }, {
                  name: "False",
                  value: "False"
                }]}
                handleChange={(value) => setChecks(value)}
                value={checks}
              />
            </Grid>
            <Grid container direction="row">
            <Grid
              className={classes.projectsettingGrid}
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
            >
              <Typography gutterBottom component="div">
              Automate missing items only:
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} lg={5} xl={5} sm={12} >
            <Switch
              checked={checked}
              onChange={handleChangeAutomatemissingitems}
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{mt:2,ml:2}}
             />
            </Grid>
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
                disabled={srcDatasetType === "SentenceText" ? !srcInstance || !tgtInstance || !languages.length : !srcInstance || !tgtInstance}
              />
              <Button
                label={"Cancel"}
                onClick={() => navigate(`/datasets/`)}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Snackbar
        {...snackbarState}
        handleClose={() => setSnackbarState({ ...snackbarState, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default InterAutomateDataset;
