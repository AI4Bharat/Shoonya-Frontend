import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { translate } from "../../../../config/localisation";
import { snakeToTitleCase } from "../../../../utils/utils";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
// import { translate } from "../../../../assets/localisation";

const AllTaskSearchPopup = (props) => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const { datasetId } = useParams();
  const { currentFilters, updateFilters, searchedCol ,onchange} = props;
  const [searchValue, setSearchValue] = useState(currentFilters["search_"+searchedCol]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });
 

  const handleSearchSubmit = async(e) => {
    document.getElementById(searchedCol + "_btn").style.color = "#2C2799";
    onchange()
    props.handleClose();
   
  };
  const handleClearSearch = (e) => {
    updateFilters({
        ...currentFilters,
        ["search_"+searchedCol]: "",
    });
    delete currentFilters["search_"+searchedCol]
    updateFilters({
      ...currentFilters,
      ["search_"+searchedCol]: "",
    }); 
    onchange()
     document.getElementById(searchedCol + "_btn").style.color = "rgba(0, 0, 0, 0.54)";
     props.handleClose();
     
    };

    const handlesubmitSearchValue =(e)=>{
      updateFilters({
        ...currentFilters,
        ["search_"+searchedCol]: e.target.value,
      }); 
      setSearchValue(e.target.value)
    }
    

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
            onChange={handlesubmitSearchValue}
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
export default AllTaskSearchPopup;
