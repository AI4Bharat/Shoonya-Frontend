import React, { memo } from "react";
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const TimeBoxes = ({ handleTimeChange, time, index, type }) => {
  const classes = AudioTranscriptionLandingStyle();

  return (
    <Box display="flex">
      <TextField
        variant="standard"
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "hours")
        }
        value={time.split(":")[0]}
        onFocus={(event) => event.target.select()}
        className={classes.timeInputBox}
        style={{
          paddingLeft: "10px",
          marginLeft: type === "endTime" ? "auto" : "",
        }}
        type="number"
      />

      <TextField
        variant="standard"
        value={":"}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[1]}
        className={classes.timeInputBox}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 59 } }}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "minutes")
        }
        type="number"
      />

      <TextField
        variant="standard"
        value={":"}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[0]}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 59 } }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "seconds")
        }
        type="number"
      />

      <TextField
        variant="standard"
        value={"."}
        style={{ width: "2%" }}
        className={classes.timeInputBox}
      />

      <TextField
        variant="standard"
        value={time.split(":")[2].split(".")[1]}
        style={{ width: "20%", paddingRight: "10px" }}
        onFocus={(event) => event.target.select()}
        InputProps={{ inputProps: { min: 0, max: 999 } }}
        className={classes.timeInputBox}
        onChange={(event) =>
          handleTimeChange(event.target.value, index, type, "miliseconds")
        }
        type="number"
      />
    </Box>
  );
};

export default memo(TimeBoxes);
