import React, { useState, useRef } from "react";
import {
  Button,
  Divider,
  Grid,
  Typography,
  Popover,
  List,
  ListItem,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Radio,
  Autocomplete,
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DatasetStyle from "../../../styles/Dataset";

const ColumnList = (props) => {
  const classes = DatasetStyle();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef();

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} ref={buttonRef}>
        <ViewColumnIcon />
      </Button>
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
        <Grid
          container
          direction="column"
          className={classes.filterContainer}
          sx={{ width: "250px" }}
        >
          <Grid
            item
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            sx={{ p: 2 }}
            className={classes.statusFilterContainer}
          >
            <Typography
              variant="body2"
              sx={{ mr: 5, fontWeight: "700" }}
              className={classes.filterTypo}
            >
              {translate("label.filter.column")} :
            </Typography>
            <List sx={{ width: "100%" }}>
              {props.columns.map((column, index) => (
                <ListItem key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={props.selectedColumns.includes(column)}
                        onChange={() => {
                          if (props.selectedColumns.includes(column)) {
                            props.setColumns(
                              props.selectedColumns.filter(
                                (selectedColumn) => selectedColumn !== column
                              )
                            );
                          } else {
                            props.setColumns((prev) => [...prev, column]);
                          }
                        }}
                      />
                    }
                    label={column.label}
                  />
                </ListItem>
              ))}
            </List>
            <Grid
              container
              sx={{ p: 2 }}
              spacing={2}
              direction="column"
              justify="flex-end"
            >
              <Divider />
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.clearAllBtn}
                >
                  {" "}
                  Close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </div>
  );
};
export default ColumnList;
