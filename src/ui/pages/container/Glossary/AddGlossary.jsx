import React, { useEffect, useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  MenuItem,
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

export default function AddGlossary() {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const allLevels = glossaryLevel;
  const [selectedSourceLang, setselectedSourceLang] = useState("");
  const [selectedTargetLang, setselectedTargetLang] = useState("");
  const [SourceText, setSourceText] = useState("");
  const [targetText, settargetText] = useState("");
  const [domain, setdomain] = useState("");
  const [collectionSource, setcollectionSource] = useState("");
  const [level, setlevel] = useState("");
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
});

  const allDomains = useSelector((state) => state.getDomains);
  useEffect(() => {
    const domainApiObj = new getDomains();
    dispatch(APITransport(domainApiObj));
  }, []);

  const onSubmit = async() => {
    const AddGlossaryData = {
        "glossary":[{
            srcLanguage: selectedSourceLang,
      tgtLanguage: selectedTargetLang,
      srcText: SourceText,
      tgtText: targetText,
      domain: domain,
      collectionSource: collectionSource,
      level: level,
        }
        ]
      
    };
    const domainApiObj = new AddGlossaryAPI(AddGlossaryData);
    //dispatch(APITransport(domainApiObj));
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
        })
  
      } else {
        setSnackbarInfo({
          open: true,
          message: resp?.message,
          variant: "error",
        })
    }
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
    <Grid>
      <Grid>{renderSnackBar()}</Grid>
      <Card className={classes.workspaceCard}>
        <Grid
          container
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <FormControl sx={{ m: 1, minWidth: 500 }}>
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
            >
              {LanguageCode.languages.map((el, i) => {
                return <MenuItem value={el.code}>{el.label}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 500 }}>
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
          <OutlinedTextField
            placeholder="Source Text"
            sx={{ m: 1, width: 500 }}
            value={SourceText}
            onChange={handleSourceTextChange}
          />
          <OutlinedTextField
            placeholder="Target Text"
            sx={{ m: 1, width: 500 }}
            value={targetText}
            onChange={handleTargetTextChange}
          />
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
          <FormControl sx={{ m: 1, minWidth: 500 }}>
            <InputLabel id="demo-simple-select-helper-label">Domain</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={domain}
              label="Domain"
              onChange={handleDomainChange}
              sx={{
                textAlign: "left",
              }}
            >
              {allDomains &&
                allDomains.length > 0 &&
                allDomains.map((el, i) => {
                  return <MenuItem value={el.code}>{el.label}</MenuItem>;
                })}
            </Select>
          </FormControl>
          <OutlinedTextField
            placeholder="Collection Source"
            sx={{ width: 500 }}
            value={collectionSource}
            onChange={handleCollectionSourceTextChange}
          />
        </Grid>
        <Grid
          container
          flexDirection="row"
          justifyContent="space-around"
          alignItems="end"
          sx={{
            marginTop: 4,
            marginBottom: 4,
            // alignItems: "center"
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 500 }}>
            <InputLabel id="demo-simple-select-helper-label">Level</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={level}
              label="Level"
              onChange={handleLevelChange}
              sx={{
                textAlign: "left",
              }}
            >
              {allLevels.map((el, i) => {
                return <MenuItem value={el.key}>{el.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <CustomButton
            label={translate("button.submit")}
            onClick={onSubmit}
            disabled={(selectedSourceLang && selectedTargetLang && SourceText && targetText && domain && collectionSource && level ) ? false : true}

            sx={{
              width: 500,
              padding: 4,
              borderRadius: 2,
              textDecoration:"none"
            }}
          />
        </Grid>
      </Card>
    </Grid>
  );
}
