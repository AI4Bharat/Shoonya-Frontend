import { Tabs,Tab ,Box} from "@mui/material";
import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, InputLabel, Typography,Switch } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";

const AutomateDatasets = () => {
  const classes = DatasetStyle();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <ThemeProvider theme={themeDefault}>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} >
        <Tab label="Inter-Automate Datasets" sx={{ fontSize: 16, fontWeight: '700' }}/>
        <Tab label="Intra-Automate Datasets" sx={{ fontSize: 16, fontWeight: '700' }} />
      </Tabs>
      {selectedTab === 0 && <InterAutomateDataset/>}
      {selectedTab === 1 && <IntraAutomateDataset />}
    </Box>
    </ThemeProvider>


  );
};

export default AutomateDatasets;