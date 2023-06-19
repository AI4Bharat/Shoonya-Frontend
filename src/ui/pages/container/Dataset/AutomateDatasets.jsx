<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2bb5d916900ec8d34895d3f608c2e617ae2578b5
import { Tabs,Tab ,Box} from "@mui/material";
import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, InputLabel, Typography,Switch } from "@mui/material";
=======
<<<<<<< HEAD
import { Tabs,Tab ,Box} from "@mui/material";
=======
import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, InputLabel, Typography,Switch } from "@mui/material";
>>>>>>> 56c7912c32bad49f453c9b0fe61d20eb6f3657d5
>>>>>>> develop
import React, { useEffect, useState } from "react";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";

const AutomateDatasets = () => {
<<<<<<< HEAD

  const [selectedTab, setSelectedTab] = useState(0);

=======
<<<<<<< HEAD
=======
  const navigate = useNavigate();
  const classes = DatasetStyle();
  const dispatch = useDispatch();

<<<<<<< HEAD
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
  //const [apitype, setApitype] = useState("indic-trans");
=======
  const [selectedTab, setSelectedTab] = useState(0);
>>>>>>> 2bb5d916900ec8d34895d3f608c2e617ae2578b5

  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
  const DatasetTypes = useSelector((state) => state.GetDatasetType.data);
  const LanguageChoicesIndicTrans = useSelector((state) => state.getIndicTransLanguages.data);
  const LanguageChoicesAll = useSelector((state) => state.getLanguageChoices.data);
>>>>>>> 56c7912c32bad49f453c9b0fe61d20eb6f3657d5
  
  const [selectedTab, setSelectedTab] = useState(0);

>>>>>>> develop
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

<<<<<<< HEAD


  return (
=======
<<<<<<< HEAD
=======
  const handleTgtDatasetTypeChange = (value) => {
    setTgtDatasetType(value);
    setLoading(true);
    const instancesObj = new GetDatasetsByTypeAPI(value);
    dispatch(APITransport(instancesObj));
  };

<<<<<<< HEAD
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

const apitype = translationModel===1?"indic-trans": translationModel===2?"google":translationModel===3?"azure":"indic-trans-v2";
  const handleConfirm = () => {
    const apiObj = new AutomateDatasetsAPI(srcInstance, tgtInstance, languages, loggedInUserData.organization.id,checks,apitype,checked);
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

  // const handleAPiType = (e) => {
  //   setApitype(e.target.value)
  // }
>>>>>>> 56c7912c32bad49f453c9b0fe61d20eb6f3657d5

  const handleChangeAutomatemissingitems = (event) => {
    setChecked(event.target.checked);
  };

  return (
<<<<<<< HEAD
>>>>>>> develop
=======

  return (
>>>>>>> 2bb5d916900ec8d34895d3f608c2e617ae2578b5
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Inter-Automate Datasets" />
        <Tab label="Intra-Automate Datasets" />
      </Tabs>
      {selectedTab === 0 && <InterAutomateDataset/>}
      {selectedTab === 1 && <IntraAutomateDataset />}
    </Box>
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
    <ThemeProvider theme={themeDefault}>
      {loading && <Spinner />}
      <Grid container direction="row"  >
        <Card className={classes.workspaceCard}>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={8} sm={8} md={8} lg={8} xl={8} sx={{ pb: "6rem" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h2" gutterBottom component="div">
                Automate Datasets
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
                       console.log(e.target.value,"e.target.value")}}
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
            
>>>>>>> 56c7912c32bad49f453c9b0fe61d20eb6f3657d5
>>>>>>> develop
=======
>>>>>>> 2bb5d916900ec8d34895d3f608c2e617ae2578b5

  );
};

export default AutomateDatasets;
