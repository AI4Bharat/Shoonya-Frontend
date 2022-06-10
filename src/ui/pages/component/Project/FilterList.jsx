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
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import TaskTableFilter from "../../../styles/TaskTableFilter";
// import { translate } from "../../../../assets/localisation";

const FilterList = (props) => {
  const classes = TaskTableFilter();
  const { filter, selectedFilter, clearAll, apply } = props;
  const [selectedStatus, setSelectedStatus] = useState("unlabeled");

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
  // const handleStatusChange = (e) => {
  //   if (e.target.checked) setSelectedStatus([...selectedStatus, e.target.name]);
  //   else {
  //     const selected = Object.assign([], selectedStatus);
  //     const index = selected.indexOf(e.target.name);

  //     if (index > -1) {
  //       selected.splice(index, 1);
  //       setSelectedStatus(selected);
  //     }
  //   }
  // };
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

  const onStatusChange = (value) => {
    console.log(value);
    setSelectedStatus(value)
  }

  return (
    <div>
      <Popover
        // style={{ width: '399px', minHeight: '246px' }}
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
        <Button
          // onClick={handleClearAll}
          color="primary"
          size="small"
          className={classes.clearAllBtn}
        >
          {" "}
          {translate("button.clearAll")}
        </Button>
        <Grid container className={classes.filterContainer}>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <Typography variant="body2" className={classes.filterTypo}>
                {translate("label.filter.status")}
            </Typography>
            <FormGroup>
              {filter.Status.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedStatus === type ? true : false}
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => onStatusChange(e.target.value)}
                    value={type}
                    label={type}
                  />
                );
              })}
            </FormGroup>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <Typography variant="body2" className={classes.filterTypo}>
                {translate("label.filter.status")}
            </Typography>
            <FormGroup>
              {filter.Status.map((type) => {
                return (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedStatus === type ? true : false}
                        name={type}
                        color="primary"
                      />
                    }
                    onChange={(e) => onStatusChange(e.target.value)}
                    value={type}
                    label={type}
                  />
                );
              })}
            </FormGroup>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};
export default FilterList;
