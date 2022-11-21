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

const AllTasksFilterList = (props) => {
  const classes = DatasetStyle();        
  const { filterStatusData, currentFilters, updateFilters} = props;
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.task_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");
console.log(currentFilters,"selectedStatus")

  const handleStatusChange = (e) => {
    updateFilters({
      ...currentFilters,
      task_status: selectedStatus,
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
              {filterStatusData.Status.map((item) => {
                return (
                  <FormControlLabel
                    control={
                        <Checkbox
                        overlay
                        disableIcon
                        checked={selectedStatus.includes(item)}
                      
                      
                        
                        variant="soft"
                      />
                    }
                    onChange={(event) => {
                        if (event.target.checked) {
                            setSelectedStatus((val) => [...val, item]);
                        } else {
                            setSelectedStatus((val) => val?.filter((text) => text !== item));
                        }
                      }}
                      value={selectedStatus}
                    label={snakeToTitleCase(item)}
                    sx={{
                      fontSize: "1rem",
                    }} 
                  />
                );
              })}


{/* {filterStatusData?.Status.map((item, index) => (
                        
                        <Checkbox
                          overlay
                          disableIcon
                          checked={selectedStatus.includes(item)}
                          value={selectedStatus}
                          label={item}
                          onChange={(event) => {
                            if (event.target.checked) {
                                setSelectedStatus((val) => [...val, item]);
                            } else {
                                setSelectedStatus((val) => val?.filter((text) => text !== item));
                            }
                          }}
                          variant="soft"
                        />
      
                    ))} */}

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
export default AllTasksFilterList;
