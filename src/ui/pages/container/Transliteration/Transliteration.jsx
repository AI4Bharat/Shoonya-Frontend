import { withStyles } from "@mui/styles";
import React, { useState } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import GlobalStyles from "../../../styles/LayoutStyles";

const Transliteration = () => {
  const classes = GlobalStyles();
  const [text, setText] = useState("");

  const renderTextarea = (props) => {
    return (
      <textarea
        {...props}
        placeholder={"Enter text here..."}
        className={classes.textAreaTransliteration}
      />
    );
  };

  return (
    <ReactTransliterate
      renderComponent={(props) => renderTextarea(props)}
      value={text}
      onChangeText={(text) => {
        setText(text);
      }}
      lang="hi"
    />
  );
};

export default withStyles(GlobalStyles)(Transliteration);
