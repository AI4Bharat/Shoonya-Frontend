import { TextField } from "@mui/material";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IndicTransliterate, getTransliterationLanguages } from "@ai4bharat/indic-transliterate"
import "@ai4bharat/indic-transliterate/dist/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";
import CustomizedSnackbars from "../../component/common/Snackbar";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Transliteration = (props) => {
  const { onCancelTransliteration } = props;
  const params = useParams()
  console.log(params,"params")
  const classes = GlobalStyles();
  const [text, setText] = useState();
  const [languageList, setLanguageList] = useState([{DisplayName:"data"}]);
  const [selectedLang, setSelectedLang] = useState("");
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false
  });
  // const [taskdata, setTaskdata] = useState(searchFilters);
  const matches = useMediaQuery('(max-width:768px)');

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);

  let searchFilters = JSON.parse(localStorage.getItem("TaskData"));

  var data = languageList.filter((e)=>e.DisplayName.includes(ProjectDetails.tgt_language))

  useEffect(() => {
    if(params.taskId ){
      setText(searchFilters.data.machine_translation)
    }else{
      setText("")
    }
    
  }, [])


  var data = languageList.filter((e)=>e.DisplayName.includes(ProjectDetails.tgt_language))
  
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
  console.log('...transliteration')
 
  useEffect(() => {

    getTransliterationLanguages()
      .then(langs => {
        setLanguageList(langs);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const handleLanguageChange = (event, val) => {
    setSelectedLang(val);
  }
  const onCopyButtonClick = () => {
    navigator.clipboard.writeText(text);
    setShowSnackBar({
      message: "Copied to clipboard!",
      variant: "success",
      timeout: 1500,
      visible: true
    })
  }
  const handleSnackBarClose = () => {
    setShowSnackBar({
      message: "",
      variant: "",
      timeout: 1500,
      visible: false
    })
  }
  // useEffect(() => {
  //   if (data.length == 0 && languageList[0].DisplayName != "data" && params.taskId) {
  //     setShowSnackBar({
  //       open: true,
  //       message: "This language doesn't support",
  //       variant: "error",
  //       timeout: 2500,
  //       visible: true
  //     })
  
  //   } 
  // }, [languageList])

  return (
    <Card
      sx={{
        width: matches ? window.innerWidth * 0.7 : window.innerWidth * 0.3,
        // width: 500,
        // minHeight: 500,
        // padding: 5
      }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", padding: "0.4rem 1rem 0.4rem 1rem", marginBottom: 2 }}
      >
        <Typography variant="subtitle1">Select Language :</Typography>
        <Autocomplete
           value={selectedLang ? selectedLang : (data.length > 0 && (params.taskId || params.id) ? {DisplayName:data[0]?.DisplayName ,LangCode:data[0]?.LangCode} : {DisplayName : "Hindi - हिंदी", LangCode : "hi"})}
          onChange={handleLanguageChange}
          options={languageList}
          size={"small"}  
          getOptionLabel={el => { return el.DisplayName }}
          sx={{ width: window.innerWidth * 0.15 }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Select Language" />}
        />
      </Grid>

      <IndicTransliterate
        lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ?  data[0]?.LangCode : "hi" )}
        value={text}
        onChangeText={(text) => {
          setText(text);
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
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={onCopyButtonClick}
          disabled={!text}
        >
          Copy Text
        </Button>
        <Button
          variant="contained"
          sx={{}}
          onClick={onCancelTransliteration()}
        >
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
