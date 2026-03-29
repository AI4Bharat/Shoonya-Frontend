import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  MenuItem,
  DialogContent,
  Dialog,
  DialogContentText,
  Typography,
} from "@mui/material";
import CustomButton from "../../component/common/Button";
import OutlinedTextField from "../../component/common/OutlinedTextField";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import LanguageCode from "../../../../utils/LanguageCode";
import glossaryLevel from "../../../../utils/glossaryLevel";
import { useDispatch, useSelector } from "react-redux";
import getDomains from "../../../../redux/actions/api/Glossary/GetDomains";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddGlossaryAPI from "../../../../redux/actions/api/Glossary/AddGlossary";
import CustomizedSnackbars from "../../..//pages/component/common/Snackbar";
import {
  IndicTransliterate,
  getTransliterationLanguages,
} from "@ai4bharat/indic-transliterate";
import "../../../../IndicTransliterate/index.css";
import { MenuProps } from "../../../../utils/utils";
import configs from "../../../../config/config";

const AddGlossary = ({
  openDialog,
  handleCloseDialog,
  targetlang,
  Sourcelang,
  addBtnClickHandler,
}) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const allLevels = glossaryLevel;
  const [selectedSourceLang, setselectedSourceLang] = useState(Sourcelang);
  const [selectedTargetLang, setselectedTargetLang] = useState(targetlang);
  const [SourceText, setSourceText] = useState("");
  const [targetText, settargetText] = useState("");
  const [domain, setdomain] = useState("");
  const [collectionSource, setcollectionSource] = useState("shoonya");
  const [level, setlevel] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
  const [Sourcelanguage, setSourcelanguage] = useState([]);
  const [Targetlanguage, setTargetlanguage] = useState([]);

  var data = Targetlanguage?.filter((e)=>e.LangCode.includes(selectedTargetLang))
  var Sourcedata = Sourcelanguage?.filter((e)=>e.LangCode.includes(selectedSourceLang))


  const allDomains = useSelector((state) => state.getDomains);

  useEffect(() => {
    const domainApiObj = new getDomains();
    dispatch(APITransport(domainApiObj));
  }, []);

  const onSubmit = async () => {
    let word_condition =
      SourceText &&
      SourceText.indexOf(" ") === -1 &&
      (SourceText.split("")[SourceText.length - 1] !== "." ||
        SourceText.split("")[SourceText.length - 1] !== "|");
    let sentence_condition =
      SourceText &&
      (SourceText.split("")[SourceText.length - 1] === "." ||
        SourceText.split("")[SourceText.length - 1] === "|") &&
      SourceText.indexOf(" ") >= 0;

    const AddGlossaryData = {
      glossary: [
        {
          srcLanguage: selectedSourceLang,
          tgtLanguage: selectedTargetLang,
          srcText: SourceText,
          tgtText: targetText,
          domain: domain,
          collectionSource: "shoonya",
          level: word_condition
            ? allLevels[0].key
            : sentence_condition
            ? allLevels[1].key
            : allLevels[2].key,
        },
      ],
    };
    const domainApiObj = new AddGlossaryAPI(AddGlossaryData);
    dispatch(APITransport(domainApiObj));
    const res = await fetch(domainApiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(domainApiObj.getBody()),
      headers: domainApiObj.getHeaders().headers,
    });
    const resp = await res.json();
    //setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "success",
      });
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
    setdomain("");
    setSourceText("");
    settargetText("");
  };

  const handleSrcLangChange = (e) => {
    setselectedSourceLang(e.target.value);
  };
  const handleTrgLangChange = (e) => {
    setselectedTargetLang(e.target.value);
  };
  const handleSourceTextChange = (e) => {
    setSourceText(e.target.value);
  };
  const handleTargetTextChange = (e) => {
    settargetText(e.target.value);
  };
  const handleDomainChange = (e) => {
    setdomain(e.target.value);
  };

  const handleCollectionSourceTextChange = (e) => {
    setcollectionSource(e.target.value);
  };
  const handleLevelChange = (e) => {
    setlevel(e.target.value);
  };

  useEffect(() => {
  
    getTransliterationLanguages()
    .then(langs => {
      setSourcelanguage(langs);
      setTargetlanguage(langs)
    })
    .catch(err => {
    }) 
   
   
  }, [])


  const renderTargetText = (props) => {
    return (
      <>
        <textarea
          {...props}
          placeholder={"Target Text"}
          rows={2}
          className={classes.textTransliteration}
        />
      </>
    );
  };
  const renderSourceText = (props) => {
    return (
      <>
        <textarea
          {...props}
          placeholder={"Source Text"}
          rows={2}
          className={classes.textTransliteration}
         
        />
      </>
    );
  };
  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid>
            <Grid>{renderSnackBar()}</Grid>
            <Card className={classes.AddGlossaryCard}>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                sx={{ mb: 3 }}
              >
                Add Glossary
              </Typography>
              <Grid
                container
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
              >
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Source Language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selectedSourceLang}
                    label="Source Language"
                    onChange={handleSrcLangChange}
                    sx={{
                      textAlign: "left",
                    }}
                    MenuProps={MenuProps}
                  >
                    {LanguageCode.languages.map((el, i) => {
                      return <MenuItem value={el.code}>{el.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Target Language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={selectedTargetLang}
                    label="Target Language"
                    onChange={handleTrgLangChange}
                    sx={{
                      textAlign: "left",
                    }}
                    MenuProps={MenuProps}
                  >
                    {LanguageCode.languages.map((el, i) => {
                      return <MenuItem value={el.code}>{el.label}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                container
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{
                  marginTop: 4,
                }}
              >

               
                { Sourcedata.length > 0 && selectedSourceLang !== "en" ? (
                 <IndicTransliterate
                  customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                  apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
                  lang={Sourcelanguage.LangCode  ? Sourcelanguage.LangCode  : (Sourcedata.length > 0   ?   Sourcedata[0]?.LangCode  : "hi" )}
                  value={SourceText}
                  onChangeText={(SourceText) => {
                    setSourceText(SourceText);
                  }}
                  renderComponent={(props) => renderSourceText(props)}
                  
                />): ( <OutlinedTextField
                placeholder="Source Text"
                sx={{ m: 1, width: 200 }}
                value={SourceText}
                onChange={handleSourceTextChange}
              />)}
               { data.length > 0 && selectedTargetLang !== "en" ? (
                <IndicTransliterate
                  customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
                  apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
                  lang={Targetlanguage.LangCode  ? Targetlanguage.LangCode : (data.length > 0  ?  data[0]?.LangCode : "hi")}
                  value={targetText}
                  onChangeText={(targetText) => {
                    settargetText(targetText);
                  }}
                  renderComponent={(props) => renderTargetText(props)}

                />): ( <OutlinedTextField
                  placeholder="Target Text"
                  sx={{ m: 1, width: 200 }}
                  value={targetText}
                  onChange={handleTargetTextChange}
                />)}
              </Grid>

              <Grid
                container
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                sx={{
                  marginTop: 4,
                }}
              >
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Domain
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={domain}
                    label="Domain"
                    onChange={handleDomainChange}
                    sx={{
                      textAlign: "left",
                    }}
                    MenuProps={MenuProps}
                  >
                    {allDomains &&
                      allDomains.length > 0 &&
                      allDomains.map((el, i) => {
                        return <MenuItem value={el.code}>{el.label}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
                <Grid sx={{ m: 1, minWidth: 200 }}></Grid>
               
              </Grid>

              <Grid sx={{ textAlignLast: "end" }}>
                <CustomButton
                  label={translate("button.submit")}
                  onClick={onSubmit}
                  disabled={
                    selectedSourceLang &&
                    selectedTargetLang &&
                    SourceText &&
                    targetText &&
                    domain
                      ? false
                      : true
                  }
                  sx={{
                    borderRadius: 2,
                    textDecoration: "none",
                  }}
                />
                <CustomButton
                  label={translate("button.cancel")}
                  onClick={handleCloseDialog}
                  sx={{
                    ml: 1,
                    borderRadius: 2,
                    textDecoration: "none",
                  }}
                />
              </Grid>
            </Card>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
export default AddGlossary;
