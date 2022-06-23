import React, { useState } from "react";
import {
  Button,
  Divider,
  Typography,
  Popover,
  Box,
  TextField
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import { snakeToTitleCase } from "../../../../utils/utils";
import DatasetStyle from "../../../styles/Dataset";
// import { translate } from "../../../../assets/localisation";

const SearchPopup = (props) => {
    const classes = DatasetStyle();
  const { currentFilters, updateFilters, searchedCol, updateSearched } = props;
  const [searchValue, setSearchValue] = useState(currentFilters["search_"+searchedCol]);
  
  const handleSearchSubmit = (e) => {
    updateFilters({
      ...currentFilters,
      ["search_"+searchedCol]: searchValue,
    });
    updateSearched((prev) => [...prev, searchedCol]);
    props.handleClose();
  };

  const handleClearSearch = (e) => {
    updateFilters({
        ...currentFilters,
        ["search_"+searchedCol]: "",
    });
    setSearchValue("");
    updateSearched((prev) => prev.filter((col) => col !== searchedCol));
    props.handleClose();
    };

  return (
      <Popover
        id={props.id}
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
       <Box sx={{p:2, display: "flex", flexDirection: "column", gap: 2}}>
        <TextField 
            size="small" 
            variant="outlined" 
            placeholder={`Search ${snakeToTitleCase(searchedCol)}`} 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            inputProps={{
                style: {
                    fontSize: "16px"
                }
            }}          
        />
        <Divider />
        <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2}}>
            <Button
                onClick={handleClearSearch}
                variant="outlined"
                color="primary"
                size="small"
                className={classes.clearAllBtn}
            >
                {" "}
                {translate("button.clear")}
            </Button>
            <Button
                onClick={handleSearchSubmit}
                variant="contained"
                color="primary"
                size="small"
                className={classes.clearAllBtn}
                >
                {" "}
                {translate("button.Apply")}
            </Button>
        </Box>
       </Box>
      </Popover>
  );
};
export default SearchPopup;
