import React, { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

import { translate } from "../../../../config/localisation";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DatasetStyle from "../../../styles/Dataset";

const ColumnList = (props) => {
  const classes = DatasetStyle();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef();
  return (
    <div>
      <Tooltip title="View Columns">
        <Button onClick={() => setIsOpen(!isOpen)} ref={buttonRef}>
          <ViewColumnIcon />
        </Button>
      </Tooltip>
      <Popover
        id={props.id}
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={() => setIsOpen(false)}
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
        <Typography
          variant="body2"
          sx={{ mr: 5, fontWeight: "700" }}
          className={classes.filterTypo}
        >
          {translate("label.filter.column")} :
        </Typography>
        <List sx={{ width: "100%" }}>
          {props.columns.map((column, index) => (
            <ListItem key={index} sx={{padding: "0"}}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.selectedColumns.includes(column.name)}
                    onChange={() => {
                      if (props.selectedColumns.includes(column.name)) {
                        props.setColumns(
                          props.selectedColumns.filter(
                            (selectedColumn) => selectedColumn !== column.name
                          )
                        );
                      } else {
                        props.setColumns((prev) => [...prev, column.name]);
                      }
                    }}
                  />
                }
                label={column.label}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      </Popover>
    </div>
  );
};
export default ColumnList;
