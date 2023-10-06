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
  const [keystrokes, setKeystrokes] = useState([]);
  const keystrokesRef = useRef([]);
  const suggestionRef = useRef([]);
  const newKeystrokesRef = useRef();
  // const [flag, setflag] = useState(fal);
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
    var flag = false;
    var newSuggestions=[];
    // const processConsoleLog = (args) => {
    //   const msg = JSON.stringify(args);
    //   if (msg.includes('library data')) {
    //     const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
    //     console.log("nnn",dataMatch.result);
    //     flag=true;
    //     return dataMatch.result;
    //   }
    //   return;
    // };
    let previousSuggestions = null;

const processConsoleLog = (...args) => {
  if (args.length === 0) {
    return previousSuggestions || null;
  }

  const msg = JSON.stringify(args);
  if (msg.includes('library data')) {
    const dataMatch = JSON.parse(msg.match(/{[^}]*}/));
    const newSuggestions = dataMatch.result;
    
    if (newSuggestions && newSuggestions.length > 0) {
      previousSuggestions = newSuggestions;
      return newSuggestions;
    }
  }

  return previousSuggestions || null;
};
const originalConsoleLog = console.log;

console.log = (...args) => {
  const newSuggestions = processConsoleLog(...args);
  
  if (newSuggestions !== null) {
    suggestionRef.current = newSuggestions;
    if (debouncedTextRef.current.trim() !== "") {
      const newKeystroke = {
        keystrokes: debouncedTextRef.current,
        results: suggestionRef.current,
        opted:
          suggestionRef.current.find(
            (item) => item === debouncedTextRef.current
          ) || debouncedTextRef.current,
        created_at: new Date().toISOString(),
      };
      newKeystrokesRef.current = newKeystroke;
      if (newKeystrokesRef.current !== undefined) {
        keystrokesRef.current = [
          ...keystrokesRef.current,
          newKeystrokesRef.current,
        ];
      }
      console.log("nnn", keystrokesRef.current, newKeystrokesRef.current);
      const finalJson = {
        word: debouncedTextRef.current,
        steps: keystrokesRef.current,
      };
      localStorage.setItem("TransliterateLogging", JSON.stringify(finalJson));
    }
  }
  originalConsoleLog(...args);
};

    return () => {
      console.log = originalConsoleLog;
    };
  }, [debouncedTextRef.current]);

  // useEffect(() => {
  //   // console.log("nnn",debouncedText,suggestionRef.current);
  //   if (debouncedText.trim()!="") {
  //     const newKeystroke = {
  //       keystrokes: debouncedText,
  //       results: suggestionRef.current,
  //       opted: suggestionRef.current.find((item) => item === debouncedText) || debouncedText,
  //       created_at: new Date().toISOString(),
  //     };
  //     newKeystrokesRef.current = newKeystroke
  //   }
  // }, [suggestionRef.current]);

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
