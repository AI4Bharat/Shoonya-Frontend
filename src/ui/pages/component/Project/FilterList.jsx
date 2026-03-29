import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { snakeToTitleCase } from "../../../../utils/utils";
import {  useSelector } from "react-redux";
import { Stack } from "@mui/material";

const FilterList = (props) => {
  const classes = DatasetStyle();
  const { filterStatusData, currentFilters, updateFilters, pull, setpull, rejected, setRejected, pullvalue } = props;
  const [selectedStatus, setSelectedStatus] = useState(!!currentFilters?.annotation_status ? currentFilters?.annotation_status : currentFilters.review_status);
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const userDetails = useSelector((state) => state.fetchLoggedInUserData.data);
  const pulledstatus = currentFilters?.annotation_status ? ["Pulled By reviewer", "Not Pulled By reviewer"]
    : currentFilters?.review_status ? ["Pulled By SuperChecker", "Not Pulled By SuperChecker"] : null;
  const handleStatusChange = (e) => {
    let statusvalue = !!currentFilters?.annotation_status ? "annotation_status" : "review_status"
    updateFilters({
      ...currentFilters,
      [statusvalue]: selectedStatus,
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
          <Stack direction="row">
            <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body2" sx={{ ml: 1, fontWeight: "700", fontSize: "16px" }} className={classes.filterTypo}>
                {translate("label.filter.status")}
              </Typography>
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
            <Stack direction="column">
              {currentFilters?.annotation_status ?
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="project-type-label" sx={{
                    fontSize: "16px",
                    position: "inherit",
                    top: "23px",
                    left: "-3px",
                  }}>Editable</InputLabel>
                  <Select
                    labelId="editable-label"
                    id="editable-select"
                    value={pull}
                    defaultValue={"All"}
                    label="editable"
                    onChange={(e) => setpull(e.target.value)}

                  >
                    <MenuItem value={'All'} selected>
                      All
                    </MenuItem>
                    {pulledstatus.map((type, index) => (
                      <MenuItem value={type} key={index}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl> : currentFilters?.review_status ?
                  <FormControl sx={{ m: 1, minWidth: 125 }} size="small" >
                    <InputLabel id="project-type-label" sx={{
                      fontSize: "16px",
                      position: "inherit",
                      top: "23px",
                      left: "-3px",
                    }} >Editable</InputLabel>
                    <Select

                      labelId="editable-label"
                      id="editable-select"
                      value={pull}
                      label="editable"
                      defaultValue={"All"}
                      onChange={(e) => setpull(e.target.value)}

                    >
                      <MenuItem value={'All'} selected>All</MenuItem>
                      {pulledstatus.map((type, index) => (
                        <MenuItem value={type} key={index}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> : null

              }
              {currentFilters?.annotation_status && selectedStatus !== "unlabeled" ? 
              <FormControl sx={{ m: 1, minWidth: 125 }} size="small" >
                 <FormControlLabel
              control={
                <Checkbox
                  checked={rejected}
                  onChange={() => setRejected(!rejected)}
                />
              }
              label={currentFilters?.annotation_status ? "Rejected By reviewer" : currentFilters?.review_status ? "Rejected By SuperChecker" : null}
            />
              </FormControl> : currentFilters?.review_status && selectedStatus !== "unreviewed" ? <FormControl sx={{ m: 1, minWidth: 125 }} size="small" >
               
                <FormControlLabel
              control={
                <Checkbox
                  checked={rejected}
                  onChange={() => setRejected(!rejected)}
                />
              }
              label={currentFilters?.annotation_status ? "Rejected By reviewer" : currentFilters?.review_status ? "Rejected By SuperChecker" : null}
            />
              </FormControl> : null}
            </Stack>

          </Stack>
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
