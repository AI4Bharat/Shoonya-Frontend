import React, { useEffect, useState ,useRef, useDebugValue} from "react";
import { TextField } from "@mui/material";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import { IndicTransliterate, getTransliterationLanguages, getTransliterateSuggestions } from "@ai4bharat/indic-transliterate";
import "../../../../IndicTransliterate/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";
import CustomizedSnackbars from "../../component/common/Snackbar";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import configs from "../../../../config/config";
const Transliteration = (props) => {
  const { onCancelTransliteration ,setIsSpaceClicked,isSpaceClicked,setShowTransliterationModel} = props;
  const params = useParams();
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([{ DisplayName: "data" }]);
  const [selectedLang, setSelectedLang] = useState("");
  const [prev, setprev] = useState(false);
  const keystrokesRef = useRef([]);
  const suggestionRef = useRef([null]);
  const newKeystrokesRef = useRef();
  const [flag, setflag] = useState();
  // const [debouncedText, setDebouncedText] = useState("");
  // const debouncedTextRef = useRef("");
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false,
  });
  const matches = useMediaQuery('(max-width:768px)');

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);

  let searchFilters = JSON.parse(localStorage.getItem("TaskData"));

  var data = languageList.filter((e) => e.DisplayName.includes(ProjectDetails.tgt_language));
// console.log("nnn",data,ProjectDetails,searchFilters);
  useEffect(() => {
    if (params.taskId) {
      setText(searchFilters?.data?.machine_translation);
    } else {
      setText("");
    }
  }, []);


// console.log(isSpaceClicked);
 
  // useEffect(() => {
  //   console.log(logJsonArray);
  // }, [logJsonArray])

  // useEffect(() => {
  //   console.log("nnn","useEffect is running",prev);
  //   const processConsoleLog = (args) => {
  //     const msg = JSON.stringify(args);
  //     if (msg.includes('library data')) {
  //       const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
  //       setflag(dataMatch.result)
  //       return dataMatch.result;
  //     }
  //     return ;
  //   };
  //   const originalConsoleLog = console.log;
  //   console.log = (...args) => {
  //     const newSuggestions = processConsoleLog(args);
  //     if (newSuggestions!=null) {
  //       suggestionRef.current  = prev==true?flag:newSuggestions
  //     }
  //     originalConsoleLog(...args);
  //   };
    
  //   return () => {
  //     console.log = originalConsoleLog;
  //   };
  // }, [debouncedTextRef.current,prev,selectedLang.LangCode]);
  

  // useEffect(() => { 
  //   if (debouncedTextRef.current.trim()!="" && suggestionRef.current.length>1) {
  //     console.log("nnn",suggestionRef.current);
  //     console.log("nnn",debouncedTextRef.current,text);
  //     const words = debouncedTextRef.current.split(/\s+/).filter(word => word.trim() !== "");

  //       const optedWord = suggestionRef.current.find((item) => item === words[words.length-1]) || "";

  //       const newKeystroke = {
  //         keystrokes: debouncedTextRef.current,
  //         results: suggestionRef.current,
  //         opted:optedWord,
  //         created_at: new Date().toISOString(),
  //       };
  //       newKeystrokesRef.current = newKeystroke
  //       if (
  //         keystrokesRef.current.length > 0 &&
  //         keystrokesRef.current[keystrokesRef.current.length - 1].keystrokes === newKeystroke.keystrokes
  //       ) {
  //         keystrokesRef.current[keystrokesRef.current.length - 1] = newKeystroke;
  //       } else {
  //         keystrokesRef.current = [...keystrokesRef.current, newKeystroke];
  //       }
  //       console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
  //       const finalJson = {
  //         word: debouncedTextRef.current,
  //         steps: keystrokesRef.current,
  //         language: selectedLang.LangCode!=undefined?selectedLang.LangCode:"hi",
  //       };
  //       localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
  //   }
  // }, [suggestionRef.current,prev,selectedLang.LangCode]);

  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        rows={5}
        className={classes.textAreaTransliteration}
      />
    );
  };

// const json=()=>{
//   let tempLogJsonArray = logJsonArray;
//   tempLogJsonArray.shift();
//   tempLogJsonArray.shift();
//   const finalJson = {"word": text, "source": "shoonya-frontend", "language": selectedLang.LangCode!=undefined?selectedLang.LangCode:"hi", "steps":tempLogJsonArray};
//   const transliterateObj = new TransliterationAPI(finalJson);
//   fetch(transliterateObj.apiEndPoint(), {
//     method: "POST",
//     body: JSON.stringify(transliterateObj.getBody()),
//     headers: transliterateObj.getHeaders().headers,
//   })
//     .then(async (res) => {
//       if (!res.ok) throw await res.json();
//       else return await res.json();
//     })
//     .then((res) => {
//       setShowSnackBar({ open: true, message: res.message, variant: "success" });
//       console.log("success");
//     })
//     .catch((err) => {
//       setShowSnackBar({ open: true, message: err.message, variant: "error" });
//       console.log("error", err);
//     });
//     setLogJsonArray([]);
//   setIsSpaceClicked(false)
// }

  useEffect(() => {
    getTransliterationLanguages()
      .then(langs => {
        setLanguageList(langs);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleLanguageChange = (event, val) => {
    setSelectedLang(val);
    // setIsSpaceClicked(true)

  };

  const onCopyButtonClick = () => {
    setIsSpaceClicked(true)
    navigator.clipboard.writeText(text);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true,
    });
  };
  const onCloseButtonClick = async () => {
    // console.log("kkkk");
    // json()
    setShowTransliterationModel(false);
  };
  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false,
    });
  };

  return (
    <Card
      sx={{
        width: matches ? window.innerWidth * 0.7 : window.innerWidth * 0.3,
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#f5f5f5",
          padding: "0.4rem 1rem 0.4rem 1rem",
          marginBottom: 2,
        }}
      >
        <Typography variant="subtitle1">Select Language:</Typography>
        <Autocomplete
          value={
            selectedLang
              ? selectedLang
              : data.length > 0 && (params.taskId || params.id)
              ? { DisplayName: data[0]?.DisplayName, LangCode: data[0]?.LangCode }
              : { DisplayName: "Hindi - हिंदी", LangCode: "hi" }
          }
          onChange={handleLanguageChange}
          options={languageList}
          size={"small"}
          getOptionLabel={(el) => el.DisplayName}
          sx={{ width: window.innerWidth * 0.15 }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Select Language" />}
          disableClearable={true}
        />
      </Grid>

      <IndicTransliterate
        customApiURL={`${configs.BASE_URL_AUTO}/tasks/xlit-api/generic/transliteration/`}
        apiKey={`JWT ${localStorage.getItem('shoonya_access_token')}`}
        lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ? data[0]?.LangCode : "hi")}
        value={text}
        onChangeText={(val) => {
          setText(val)
          // setDebouncedText(val);
          // debouncedTextRef.current=val
          // if(!debouncedTextRef.current.toString().includes(debouncedText)){
          //   setprev(true)
          // }
          // else{
          //   setprev(false)
          // }
          // console.log("nnn",text,debouncedText,debouncedTextRef.current);
        }}
        renderComponent={(props) => renderTextarea(props)}
      />
      <Grid
        container
        direction="row"
        justifyContent="end"
        alignItems="center"
        sx={{ padding: "1rem" }}
      >
        <Button variant="contained" sx={{ mr: 2 }} onClick={onCopyButtonClick} disabled={!text}>
          Copy Text
        </Button>
        <Button variant="contained" sx={{}} onClick={onCloseButtonClick}>
          Close
        </Button>
        <CustomizedSnackbars
          hide={showSnackBar.timeout}
          open={showSnackBar.visible}
          handleClose={handleSnackBarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          variant={showSnackBar.variant}
          message={showSnackBar.message}
        />
      </Grid>
    </Card>
  );
};

export default Transliteration;
