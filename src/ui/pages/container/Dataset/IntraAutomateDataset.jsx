import React, { useEffect, useState } from "react";

import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import { Card, FormControl, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, ThemeProvider, Typography } from '@mui/material';
import DraftDataPopulation from "./DraftDataPopulation";
import PopulateAiModel from "./PopulateAiModel";
import { FormControlLabel } from "@mui/material";

export default function ControlledRadioButtonsGroup() {
  const classes = DatasetStyle();
  const [draftdata,setdraftdata] = useState(false);
  const [aimodel,setaimodel] = useState(true);
  const [automation,setautomation] = useState();
  const handleChange=(value)=>{
    setautomation(value)
  }
 const handledraftdropdown=()=>{
   setdraftdata(true)
   setaimodel(false)
 }
 const handleaidropdown=()=>{
  setaimodel(true)
  setdraftdata(false)
}

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid container direction="row"  paddingTop={3}>
      <Card className={classes.workspaceCard}>
      <Typography variant="h2" gutterBottom component="div">
          Intra-Automate Datasets
      </Typography>
      <Grid container className={classes.root}>
      <Grid item style={{ flexGrow: "0" }}>
          <Typography variant="h6" sx={{ paddingBottom: "7px" }}>
            Type Of Automation :{" "}
          </Typography>
        </Grid>
      <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue="Populate Predictions from AI Model"
            >
              <FormControlLabel
                value="Populate Draft Data Json"
                control={<Radio />}
                label="Populate Draft Data Json"
                onClick={handledraftdropdown}
              />
              <FormControlLabel
                value="Populate Predictions from AI Model"
                control={<Radio />}
                label="Populate Predictions from AI Model"
                onClick={handleaidropdown}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      {draftdata?<DraftDataPopulation/>:null}
      {aimodel?<PopulateAiModel/>:null}
      </Grid>
      </Card>
      </Grid>
    </ThemeProvider>
  );
}