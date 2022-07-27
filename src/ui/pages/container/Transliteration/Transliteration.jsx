import { TextField } from "@mui/material";
import { Autocomplete, Box, Button, Card, Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactTransliterate } from "tarento-react-transliterate";
import GlobalStyles from "../../../styles/LayoutStyles";
import CustomizedSnackbars from "../../component/common/Snackbar";

const Transliteration = (props) => {
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [showSnackBar, setShowSnackBar] = useState({
    message: "",
    variant: "",
    timeout: 1500,
    visible: false
  });

  const { onCancelTransliteration } = props;

  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        style={{height : 300}}
        className={classes.textAreaTransliteration}
      />
    );
  };
  console.log('...transliteration')

  useEffect(() => {
    axios.get(`https://xlit-api.ai4bharat.org/languages`)
      .then(response => {
        console.log("response", response);
        setLanguageList(response.data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const handleLanguageChange = (event, val) => {
    console.log("val", val)
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

  return (
    <Card
      sx={{
        width: window.innerWidth * 0.5,
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
        sx={{ backgroundColor: "#f5f5f5", padding: "1rem", marginBottom: 2 }}
      >
        <Typography variant="h6">Select Target Language For Transliteration :</Typography>
        <Autocomplete
          value={selectedLang ? selectedLang : {DisplayName : "Hindi - हिंदी", LangCode : "hi"}}
          onChange={handleLanguageChange}
          options={languageList}
          getOptionLabel={el => { return el.DisplayName }}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="" placeholder="Select Language" />}
        />
      </Grid>
      <ReactTransliterate
        apiURL={`https://xlit-api.ai4bharat.org/tl/${selectedLang && selectedLang.LangCode ? selectedLang.LangCode : "hi"}`}
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
          Cancel
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
