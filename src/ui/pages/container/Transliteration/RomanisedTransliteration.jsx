import React, { useEffect, useState ,useRef, useDebugValue} from "react";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import { IndicTransliterate, getTransliterationLanguages, getTransliterateSuggestions } from "@ai4bharat/indic-transliterate";
import "../../../../IndicTransliterate/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";
import CustomizedSnackbars from "../../component/common/Snackbar";
import TransliterationAPI from "../../../../redux/actions/api/Transliteration/TransliterationAPI";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from "react-redux";
import {IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
const RomanisedTransliteration = (props) => { 
  const { onCancelTransliteration, setShowRomanisedTransliterationModel,setIsSpaceClicked, indicText, originalRomanisedText,editedRomanisedText, handleEditableRomanisedText, showSpinner, handleTranslitrationOnClick, handleSubmitRomanisedText } = props;
  const params = useParams();
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([{ DisplayName: "data" }]);
  const [selectedLang, setSelectedLang] = useState("");
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false,
  });
  const matches = useMediaQuery('(max-width:768px)');

  const ProjectDetails = useSelector(state => state.getProjectDetails.data);

//   let searchFilters = JSON.parse(localStorage.getItem("TaskData"));


  var data = languageList.filter((e) => e.DisplayName.includes(ProjectDetails.tgt_language));

  // const renderTextarea = (props) => {
  //   return (
  //     <textarea
  //       {...props}
  //       placeholder={"Enter text here..."}
  //       rows={5}
  //       className={classes.textAreaTransliteration}
  //     />
  //   );
  // };

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

  
  const onCloseButtonClick = async () => {
    localStorage.setItem("showRomanisedTransliterationModel", false);
    setShowRomanisedTransliterationModel(false);
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
    position: 'fixed', // Make the card behave like an overlay
    bottom: 0, // Position at the bottom
    right: 0, // Position to the right
    width: matches ? '70%' : '30%', // Responsive width
    maxHeight: '60%', // Maximum height to ensure content above is accessible
    overflow: 'auto', // Make content inside scrollable if it exceeds the height
    zIndex: 1000, // Ensure it's above other content
    backgroundColor: "#f5f5f5", // Background color
    padding: "0.4rem 1rem", // Padding
    marginBottom: 2, // Margin bottom
  }}
    >
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#f5f5f5",
          marginBottom: 2,
        }}
      >
        {/* <Typography variant="h5" style={{padding:"5px"}}></Typography> */}
        <h3 className="ant-typography" style={{"margin": "10px 0px"}}>Romanised Transliteration</h3>
        <IconButton onClick={onCloseButtonClick} style={{ padding: "5px" }}>
          <CloseIcon style={{ color: "red" }} />
        </IconButton>
        {/* <Typography><h3>Romanised Transliteration</h3></Typography> */}
        <Grid item xs={12} style={{width:"400px"}} className="ant-form-item-control-input-content">
          <textarea rows="4" id="outlined-multiline-static"  
            className="ant-input is-search"
            label="Output tranliteration"
            style={{width:"100%", height:"120px", lineHeight:"1.5715", maxWidth:"100%", minHeight:"32px", transition:"all .3s, height 0s", verticalAlign:"bottom"}}  
            value={text ? text : editedRomanisedText }
            onChange = {handleEditableRomanisedText}
          /> 
          </Grid> 
      </Grid>

      {/* <IndicTransliterate
        lang={selectedLang.LangCode ? selectedLang.LangCode : (data.length > 0 && (params.taskId || params.id) ? data[0]?.LangCode : "hi")}
        value={text}
        onChangeText={(val) => {
          setText(val)
        }}
        renderComponent={(props) => renderTextarea(props)}
      /> */}
      <Grid
        container
        direction="row"
        justifyContent="end"
        alignItems="center"
        sx={{ padding: "1rem" }}
      >
        <Button variant="contained" sx={{ mr: 2 }}  onClick={handleTranslitrationOnClick} disabled={!indicText || showSpinner}  >
          Check Transliteration
        </Button>
        <Button variant="contained" sx={{ mr: 2 }} onClick={handleSubmitRomanisedText} disabled={!editedRomanisedText} >
          Submit 
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

export default RomanisedTransliteration;
