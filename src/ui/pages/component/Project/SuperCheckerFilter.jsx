import React, { useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";
// import { translate } from "../../../../assets/localisation";

const SuperCheckerFilter = (props) => {
  const classes = DatasetStyle();
  const { filterStatusData, currentFilters, updateFilters } = props;
  const [selectedStatus, setSelectedStatus] = useState(currentFilters?.supercheck_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");
console.log(currentFilters,"currentFilters")

  


  const handleStatusChange = (e) => {
    let statusvalue =  !!currentFilters?.supercheck_status? "supercheck_status":""
    updateFilters({
      ...currentFilters,
      [statusvalue]:selectedStatus,
    })
    props.handleClose();
  };
  
  return (
    <div>
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
          horizontal: "right",
        }}
      >
        <Box className={classes.filterContainer}>
            <Typography variant="body2" sx={{ mr: 5, fontWeight: "700" }} className={classes.filterTypo}>
              {translate("label.filter.status")} :
            </Typography>
            <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
              {filterStatusData.Status.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedStatus === type ? true : false}
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={type}
                    label={snakeToTitleCase(type)}
                    sx={{
                      fontSize: "1rem",
                    }} 
                  />
                );
              })}
            </FormGroup>
            <Divider />
            <Box 
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <Button
                onClick={props.handleClose}
                variant="outlined"
                color="primary"
                size="small"
                className={classes.clearAllBtn}
              >
                {" "}
                {translate("button.cancel")}
              </Button>
              <Button
                onClick={handleStatusChange}
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
    </div>
  );
};
export default SuperCheckerFilter;
