import React, { useEffect, useState ,useRef} from "react";
import { TextField } from "@mui/material";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import { IndicTransliterate, getTransliterationLanguages, getTransliterateSuggestions } from "@ai4bharat/indic-transliterate";
import "@ai4bharat/indic-transliterate/dist/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";
import CustomizedSnackbars from "../../component/common/Snackbar";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const Transliteration = (props) => {
  const { onCancelTransliteration } = props;
  const params = useParams();
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([{ DisplayName: "data" }]);
  const [selectedLang, setSelectedLang] = useState("");
  const [prev, setprev] = useState([]);
  const keystrokesRef = useRef([]);
  const suggestionRef = useRef([null]);
  const newKeystrokesRef = useRef();
  const [flag, setflag] = useState();
  const [msg,setmsg] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const debouncedTextRef = useRef("");
  const [isSpaceClicked, setIsSpaceClicked] = useState(false); 
  const sss = {};
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

  useEffect(() => {
    if (params.taskId) {
      setText(searchFilters?.data?.machine_translation);
    } else {
      setText("");
    }
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
    console.log("nnn","useEffect is running");
    const processConsoleLog = (args) => {
      const msg = JSON.stringify(args);
      if (msg.includes('library data')) {
        const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
        return dataMatch.result;
      }
      return ;
    };
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      const newSuggestions = processConsoleLog(args);
      if (newSuggestions) {
        suggestionRef.current  = newSuggestions==null?flag: newSuggestions
        setflag(newSuggestions)
        if (debouncedTextRef.current.trim()!="" ) {
          console.log("nnn",suggestionRef.current);
          console.log("nnn",debouncedTextRef.current,text);
            const newKeystroke = {
              keystrokes: debouncedTextRef.current,
              results: prev?flag:newSuggestions,
              opted: suggestionRef.current.find((item) => item === debouncedTextRef.current) || debouncedTextRef.current,
              created_at: new Date().toISOString(),
            };
            newKeystrokesRef.current = newKeystroke
            if(newKeystrokesRef.current!=undefined){
              keystrokesRef.current = [...keystrokesRef.current, newKeystrokesRef.current];
            }
            console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
            const finalJson = {
              word: debouncedTextRef.current,
              steps: keystrokesRef.current,
            };
            localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
        }
      }
      originalConsoleLog(...args);
    };
    
    return () => {
      console.log = originalConsoleLog;
    };
  }, [debouncedTextRef.current,prev]);
  

  // useEffect(() => { 
  //   if (debouncedTextRef.current.trim()!="" || debouncedText!=debouncedTextRef.current) {
  //     console.log("nnn",suggestionRef.current);
  //     console.log("nnn",debouncedTextRef.current,text);
  //       const newKeystroke = {
  //         keystrokes: debouncedTextRef.current,
  //         results: suggestionRef.current,
  //         opted: suggestionRef.current.find((item) => item === debouncedTextRef.current) || debouncedTextRef.current,
  //         created_at: new Date().toISOString(),
  //       };
  //       newKeystrokesRef.current = newKeystroke
  //       if(newKeystrokesRef.current!=undefined){
  //         keystrokesRef.current = [...keystrokesRef.current, newKeystrokesRef.current];
  //       }
  //       console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
  //       const finalJson = {
  //         word: debouncedTextRef.current,
  //         steps: keystrokesRef.current,
  //       };
  //       localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));
  //       setflag(false)
  //   }
  // }, [suggestionRef.current,debouncedText]);

//   async function getTransliterationForWholeText(inputLang, outputLang, text) {
//     const data = {
//       "input": [
//         {
//           "source": text
//         }
//       ],
//       "config": {
//         "isSentence": true,
//         "language": {
//           "sourceLanguage": inputLang,
//           "targetLanguage": outputLang
//         }
//       }
//     };
  
//     const outputData = await fetch("http://xlit-api.ai4bharat.org/transliterate", {
//       method: 'post',
//       body: JSON.stringify(data),
//       headers: new Headers({
//         'Content-Type': 'application/json'
//       })
//     })
//     .then(response => response.json());
//     return outputData["output"][0]["target"];
//   }


async function getTransliterationSuggestion(searchTerm) {

  if (searchTerm == '.' || searchTerm == '..') {
    searchTerm = ' ' + searchTerm;
  }
  // searchTerm = encodeURIComponent(searchTerm);

  const url = `https://xlit-api.ai4bharat.org/tl/hi/${searchTerm}`;
  let response = await fetch(url, {
    credentials: 'include'
  });
  let data = await response.json();
  return data;
}
  
// useEffect(()=>{
  // const data = getTransliterationForWholeText("en",`hi`,debouncedTextRef.current)
  // const datas = getTransliterationSuggestion(debouncedTextRef.current)
  // console.log("nnn",datas);
// },[debouncedTextRef.current])


  // useEffect(() => {
  //   if(newKeystrokesRef.current!=undefined){
  //     keystrokesRef.current = [...keystrokesRef.current, newKeystrokesRef.current];
  //   }
  //   console.log("nnn", keystrokesRef.current,newKeystrokesRef.current);
  //   const finalJson = {
  //     word: debouncedText,
  //     steps: keystrokesRef.current,
  //   };
  //   localStorage.setItem('TransliterateLogging', JSON.stringify(finalJson));

  // }, [newKeystrokesRef.current]);

useEffect(()=>{
  if (isSpaceClicked) {
    json()
  }
},[isSpaceClicked])

  const renderTextarea = (props) => {
    // console.log("nnn",props);
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        rows={5}
        className={classes.textAreaTransliteration}
      />
    );
  };
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
      setShowSnackBar({ open: true, message: res.message, variant: "success" });
      console.log("success");
    })
    .catch((err) => {
      setShowSnackBar({ open: true, message: err.message, variant: "error" });
      console.log("error", err);
    });
}


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
  };

  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(text);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true,
    });
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
          
        />
      </Grid>

      <IndicTransliterate
        lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ? data[0]?.LangCode : "hi")}
        value={text}
        onChangeText={(val) => {
          setText(val)
          setDebouncedText(val);
          if(!debouncedTextRef.current.toString().includes(debouncedText)){
            setprev(true)
          }
          else{
            setprev(false)
          }
          debouncedTextRef.current=val
          console.log("nnn",text,debouncedText,debouncedTextRef.current);
          setIsSpaceClicked(text.endsWith(" "));
          
        }}
        renderComponent={(props) => renderTextarea(props)}
        showCurrentWordAsLastSuggestion={true}
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
        <Button variant="contained" sx={{}} onClick={onCancelTransliteration()}>
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
