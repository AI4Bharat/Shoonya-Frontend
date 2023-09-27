import React from "react";
import { useDispatch } from "react-redux";
import { onSubtitleChange } from "../../../../utils/SubTitlesUtils";

//Styles
import AudioTranscriptionLandingStyle from "../../../styles/AudioTranscriptionLandingStyle";

//Components
import { Grid, IconButton, Popover, Tooltip, Typography, Autocomplete, TextField } from "@mui/material";

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
  textWithoutTripleDollar,
  textAfterTripleDollar,
  // saveTranscriptHandler,
  setEnableTransliterationSuggestion,
  TabsSuggestionData,
}) => {
  const dispatch = useDispatch();
  const classes = AudioTranscriptionLandingStyle();
  const handleTagClick = (suggestion) => {
    const modifiedText = `${textWithoutTripleDollar}[${suggestion}]${textAfterTripleDollar}`;

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
          <Autocomplete
            onChange={(event, value) => handleTagClick(value)}
            id="tags-suggestions-auto"
            options={TabsSuggestionData}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Select Tag" />}
            renderOption={(props, option, { selected }) => (
              <Typography
                {...props}
                variant="body2"
                className={classes.suggestionListTypography}
              >
                {option}
              </Typography>
            )}
          />
          <Tooltip title="close suggestions">
            <IconButton onClick={() => setTagSuggestionsAnchorEl(null)}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Popover>
  );
};

export default TagsSuggestionList;
