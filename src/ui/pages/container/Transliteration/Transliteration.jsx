import { Autocomplete, Box, Card, Grid, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";

const Transliteration = () => {
  const classes = GlobalStyles();
  const [text, setText] = useState("");
  const [languageList, setLanguageList] = useState([]);
  const [selectedLang, setSelectedLang] = useState();

  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
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

  const handleLanguageChange = (val) => {
    console.log("val",val)
    // setSelectedLang(val)
  }

  return (
    <Card
      sx={{
        // width: window.innerWidth * 0.8,
        width: "100%",
        minHeight: 500,
        // padding: 5
      }}
    >
      <Grid
        sx={{ backgroundColor: "#f5f5f5", padding: 3 }}
      >
        <Autocomplete
          value={selectedLang}
          onChange={handleLanguageChange()}
          options={languageList}
          getOptionLabel={el=>{return el.DisplayName}}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Target Language" />}
        />
      </Grid>
      
      <ReactTransliterate
        renderComponent={(props) => renderTextarea(props)}
        value={text}
        onChangeText={(text) => {
          setText(text);
        }}
        lang="hi"
      />
    </Card>
  );
};

export default Transliteration;
