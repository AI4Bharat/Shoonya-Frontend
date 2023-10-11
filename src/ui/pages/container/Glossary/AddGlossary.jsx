import React, { useEffect, useState ,useRef} from "react";
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
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import AddGlossaryAPI from "../../../../redux/actions/api/Glossary/AddGlossary";
import CustomizedSnackbars from "../../..//pages/component/common/Snackbar";
import {
  IndicTransliterate,
  getTransliterationLanguages,
} from "@ai4bharat/indic-transliterate";
import "@ai4bharat/indic-transliterate/dist/index.css";
import { MenuProps } from "../../../../utils/utils";

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
   const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([{ DisplayName: "data" }]);
  const [selectedLang, setSelectedLang] = useState("");
  const [prev, setprev] = useState(false);
  const keystrokesRef = useRef([]);
  const suggestionRef = useRef([null]);
  const newKeystrokesRef = useRef();
  const [flag, setflag] = useState();
  const [debouncedText, setDebouncedText] = useState("");
  const debouncedTextRef = useRef("");
  const [isSpaceClicked, setIsSpaceClicked] = useState(false); 
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

  console.log(Sourcedata,"SourcedataSourcedata" ,selectedSourceLang ==="en",Sourcelanguage )

  const allDomains = useSelector((state) => state.getDomains);

  useEffect(() => {
    const domainApiObj = new getDomains();
    dispatch(APITransport(domainApiObj));
  }, []);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        setIsSpaceClicked(true);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === " ") {
        setIsSpaceClicked(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  useEffect(() => {
    console.log("nnn","useEffect is running",prev);
    const processConsoleLog = (args) => {
      const msg = JSON.stringify(args);
      if (msg.includes('library data')) {
        const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
        setflag(dataMatch.result)
        return dataMatch.result;
      }
      return ;
    };
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const newSuggestions = processConsoleLog(args);
      if (newSuggestions!=null) {
        suggestionRef.current  = prev==true?flag:newSuggestions
        // if (debouncedTextRef.current.trim()!="") {
        //   console.log("nnn",suggestionRef.current);
        //   console.log("nnn",debouncedTextRef.current,text);
        //     const newKeystroke = {
        //       keystrokes: debouncedTextRef.current,
        //       results: suggestionRef.current,
        //       opted: suggestionRef.current.find((item) => item === debouncedTextRef.current) || debouncedTextRef.current,
        //       created_at: new Date().toISOString(),
        //     };
        //     newKeystrokesRef.current = newKeystroke
        //     if(newKeystrokesRef.current!=undefined){
        //       keystrokesRef.current = [...keystrokesRef.current, newKeystrokesRef.current];
        //     }
        //     console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
        //     const finalJson = {
        //       word: debouncedTextRef.current,
        //       steps: keystrokesRef.current,
        //     };
        //     localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
        // }
      }
      originalConsoleLog(...args);
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, [debouncedTextRef.current,prev,selectedLang.LangCode]);
  

  useEffect(() => { 
    if (debouncedTextRef.current.trim()!="" && suggestionRef.current.length>1) {
      console.log("nnn",suggestionRef.current);
      console.log("nnn",debouncedTextRef.current,text);
      const words = debouncedTextRef.current.split(/\s+/).filter(word => word.trim() !== "");

        const optedWord = suggestionRef.current.find((item) => item === words[words.length-1]) || "";

        const newKeystroke = {
          keystrokes: debouncedTextRef.current,
          results: suggestionRef.current,
          opted:optedWord,
          created_at: new Date().toISOString(),
        };
        newKeystrokesRef.current = newKeystroke
        if (
          keystrokesRef.current.length > 0 &&
          keystrokesRef.current[keystrokesRef.current.length - 1].keystrokes === newKeystroke.keystrokes
        ) {
          keystrokesRef.current[keystrokesRef.current.length - 1] = newKeystroke;
        } else {
          keystrokesRef.current = [...keystrokesRef.current, newKeystroke];
        }
        console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
        const finalJson = {
          word: debouncedTextRef.current,
          steps: keystrokesRef.current,
          language: selectedLang.LangCode!=undefined?selectedLang.LangCode:"hi",
        };
        localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
    }
  }, [suggestionRef.current,prev,selectedLang.LangCode]);

useEffect(()=>{
  if (isSpaceClicked) {
    json()
  }
},[isSpaceClicked])
const json=()=>{
  const api = localStorage.getItem('TransliterateLogging');
  const transliterateObj = new TransliterationAPI(JSON.parse(api));
  fetch(transliterateObj.apiEndPoint(), {
    method: "POST",
    body: JSON.stringify(transliterateObj.getBody()),
    headers: transliterateObj.getHeaders().headers,
  })
    .then(async (res) => {
      if (!res.ok) throw await res.json();
      else return await res.json();
    })
    .then((res) => {
      setSnackbarInfo({ open: true, message: res.message, variant: "success" });
      console.log("success");
    })
    .catch((err) => {
      setSnackbarInfo({ open: true, message: err.message, variant: "error" });
      console.log("error", err);
    });
}
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
    setSelectedLang(e.target.value);
    newKeystrokesRef.current =[];
    keystrokesRef.current = [];
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
      console.log(err);
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
                  lang={Sourcelanguage.LangCode  ? Sourcelanguage.LangCode  : (Sourcedata.length > 0   ?   Sourcedata[0]?.LangCode  : "hi" )}
                  value={SourceText}
                  onChangeText={(val) => {
                    setSourceText(val);
                    setText(val)
          setDebouncedText(val);
          debouncedTextRef.current=val
          if(!debouncedTextRef.current.toString().includes(debouncedText)){
            setprev(true)
          }
          else{
            setprev(false)
          }
          console.log("nnn",text,debouncedText,debouncedTextRef.current);
          setIsSpaceClicked(text.endsWith(" "));
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
                  lang={Targetlanguage.LangCode  ? Targetlanguage.LangCode : (data.length > 0  ?  data[0]?.LangCode : "hi")}
                  value={targetText}
                  onChangeText={(val) => {
                    settargetText(val);
                    setText(val)
          setDebouncedText(val);
          debouncedTextRef.current=val
          if(!debouncedTextRef.current.toString().includes(debouncedText)){
            setprev(true)
          }
          else{
            setprev(false)
          }
          console.log("nnn",text,debouncedText,debouncedTextRef.current);
          setIsSpaceClicked(text.endsWith(" "));
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
