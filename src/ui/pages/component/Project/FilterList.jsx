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
import { useDispatch, useSelector } from "react-redux";
// import { translate } from "../../../../assets/localisation";

const FilterList = (props) => {
  const classes = DatasetStyle();
  const { filterStatusData, currentFilters, updateFilters } = props;
  const [selectedStatus, setSelectedStatus] = useState(!!currentFilters?.annotation_status? currentFilters?.annotation_status:currentFilters.review_status);
  const [selectAnnotator, setSelectAnnotator] = useState("All");

const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  // const [selectedType, setSelectedType] = useState(selectedFilter.Annotators);
  // const [selectedStatus, setSelectedStatus] = useState(selectedFilter.status);
  // const handleDatasetChange = (e) => {
  //   if (e.target.checked) setSelectedType([...selectedType, e.target.name]);
  //   else {
  //     const selected = Object.assign([], selectedType);
  //     const index = selected.indexOf(e.target.name);

  //     if (index > -1) {
  //       selected.splice(index, 1);
  //       setSelectedType(selected);
  //     }
  //   }
  // };


  const handleStatusChange = (e) => {
    let statusvalue = !!currentFilters?.annotation_status? "annotation_status":"review_status"
    updateFilters({
      ...currentFilters,
      [statusvalue]:selectedStatus,
    })
    props.handleClose();
  };
  // const handleClearAll = () => {
  //   setSelectedStatus([]);
  //   setSelectedType([]);
  //   clearAll({ datasetType: [], status: [] });
  // };
  // const isChecked = (type, param) => {
  //   const index =
  //     param === "status"
  //       ? selectedStatus.indexOf(type)
  //       : selectedType.indexOf(type);
  //   if (index > -1) return true;
  //   return false;
  // };

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
                    disabled={(ProjectDetails.project_stage === 2 || ProjectDetails?.review_supercheckers?.some((superchecker) => superchecker.id === userDetails?.id)) && type === "rejected"}
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
export default FilterList;
