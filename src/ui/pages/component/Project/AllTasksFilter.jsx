import React, { useState ,useEffect} from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";

const AllTasksFilterList = (props) => {
  const classes = DatasetStyle();        
  const { filterStatusData, currentFilters, updateFilters,onchange} = props;
  const [selectedStatus, setSelectedStatus] = useState(currentFilters.task_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");

  const handleStatusChange = (e) => {
    onchange()
    props.handleClose();
   
  };
  useEffect(() => {
    updateFilters({
        ...currentFilters,
        task_status: selectedStatus,
      })
}, [selectedStatus])

  

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
