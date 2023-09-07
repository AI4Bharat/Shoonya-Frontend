import React from "react";
import { useDispatch } from "react-redux";
import { onSubtitleChange } from "../../../../utils/SubTitlesUtils";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import { Grid, IconButton, Popover, Tooltip, Typography } from "@mui/material";

//Icons
import CloseIcon from "@mui/icons-material/Close";

//Redux
import C from "../../../../redux/constants";
import { setSubtitles } from "../../../../redux/actions/Common";

const TagsSuggestionList = ({
  tagSuggestionsAnchorEl,
  setTagSuggestionList,
  index,
  setTagSuggestionsAnchorEl,
  textWithoutBackslash,
  textAfterBackSlash,
  // saveTranscriptHandler,
  setEnableTransliterationSuggestion,
  TabsSuggestionData,
}) => {
  const dispatch = useDispatch();
  const classes = AudioTranscriptionLandingStyle();
  const handleTagClick = (suggestion) => {
    const modifiedText = `${textWithoutBackslash}[${suggestion}]${textAfterBackSlash}`;

    const sub = onSubtitleChange(modifiedText, index);
    dispatch(setSubtitles(sub, C.SUBTITLES));
    // saveTranscriptHandler(false, false, sub);

    setEnableTransliterationSuggestion(true);
    setTagSuggestionsAnchorEl(null);
  };

  const handleClose = () => {
    setTagSuggestionsAnchorEl(null);
    setTagSuggestionList([]);
  };

  return (
    <Popover
      id={"suggestionList"}
      open={Boolean(tagSuggestionsAnchorEl)}
      anchorEl={tagSuggestionsAnchorEl}
      onClose={() => handleClose()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <Grid width={200}>
        <Grid className={classes.suggestionListHeader}>
          <Typography variant="body1" sx={{ fontSize: "16px" }}>
            Select Tag
          </Typography>
          <Tooltip title="close suggestions">
            <IconButton onClick={() => setTagSuggestionsAnchorEl(null)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid maxHeight={250}>
          {TabsSuggestionData.map((name, value) => (
            <Typography
              onClick={() => handleTagClick(name)}
              variant="body2"
              className={classes.suggestionListTypography}
            >
              {name}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Popover>
  );
};

export default TagsSuggestionList;
