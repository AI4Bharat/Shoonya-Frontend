import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, Typography } from "@mui/material";
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

const AutomateDatasets = () => {
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
  const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: ''});

  const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
  const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
  const DatasetTypes = useSelector((state) => state.GetDatasetType.data);
  const LanguageChoicesIndicTrans = useSelector((state) => state.getIndicTransLanguages.data);
  const LanguageChoicesAll = useSelector((state) => state.getLanguageChoices.data);
console.log(DatasetTypes,"DatasetTypes", srcDatasetType, srcDatasetTypes)
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
          disabled: (srcDatasetType == "SentenceText" ? element !=="TranslationPair" : element !== "Conversation")
          
        });
      });
      setTgtDatasetTypes(temp);
    }
  }, [DatasetTypes]);

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

  const handleConfirm = () => {
    const apiObj = new AutomateDatasetsAPI(srcInstance, tgtInstance, languages.map(s => `'${s}'`).join(', '), loggedInUserData.organization.id, translationModel, checks);
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

  if (loggedInUserData?.role === 1) return navigate("/projects");
  
  return (
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
                <MenuItems
                  menuOptions={srcInstances.map((instance) => {
                    return {
                      name: instance["instance_name"],
                      value: instance["instance_id"],
                    }
                  })}
                  handleChange={(value) => setSrcInstance(value)}
                  value={srcInstance}
                />
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
                <MenuItems
                    menuOptions={tgtInstances.map((instance) => {
                      return {
                        name: instance["instance_name"],
                        value: instance["instance_id"],
                      }
                    })}
                    handleChange={(value) => setTgtInstance(value)}
                    value={tgtInstance}
                  />
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
                  }, ...(loggedInUserData?.role === 3 ? [{
                    name: "Google Translate",
                    value: 2
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
                    onChange={(e) => setLanguages(e.target.value)}
                    value={languages}
                    multiple
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
                disabled={!srcInstance || !tgtInstance || !languages.length}
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
        handleClose={()=> setSnackbarState({...snackbarState, open: false})} 
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        hide={2000}
      />
    </ThemeProvider>
  );
};

export default AutomateDatasets;
