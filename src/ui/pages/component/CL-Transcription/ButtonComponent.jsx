import React, { memo, useRef } from "react";
import { useSelector } from "react-redux";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MergeIcon from "@mui/icons-material/Merge";
import DeleteIcon from "@mui/icons-material/Delete";

const ButtonComponent = ({
  index,
  lastItem,
  onMergeClick,
  onDelete,
  addNewSubtitleBox,
}) => {
  const classes = AudioTranscriptionLandingStyle();

  return (
    <>
      {" "}
      {lastItem && (
        <Tooltip title="Merge Next" placement="bottom">
          <IconButton
            sx={{
              transform: "rotate(180deg)",
              backgroundColor: "#fcf7e9",
              borderRadius: "50%",
              marginRight: "10px",
              color: "blue",
              "&:disabled": {
                background: "grey",
              },
              "&:hover": {
                // backgroundColor: "#fff",
                backgroundColor: "#fcf7e9",
              },
            }}
            className={classes.optionIconBtn}
            onClick={() => onMergeClick(index)}
          >
            <MergeIcon />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Delete" placement="bottom">
        <IconButton
          className={classes.optionIconBtn}
          style={{
            color: "#d32f2f",
            backgroundColor: "#fcf7e9",
            borderRadius: "50%",
            marginRight: "10px",
            // color: "blue",
            "&:disabled": {
              background: "grey",
            },
            "&:hover": {
              // backgroundColor: "#fff",
              backgroundColor: "#fcf7e9",
            },
          }}
          onClick={() => onDelete(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Subtitle Box" placement="bottom">
        <IconButton
          sx={{
            backgroundColor: "#fcf7e9",
            borderRadius: "50%",
            marginRight: "10px",
            color: "blue",
            "&:disabled": {
              background: "grey",
            },
            "&:hover": {
              // backgroundColor: "#fff",
              backgroundColor: "#fcf7e9",
            },
          }}
          className={classes.optionIconBtn}
          onClick={() => addNewSubtitleBox(index)}
        >
          <AddIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default memo(ButtonComponent);
