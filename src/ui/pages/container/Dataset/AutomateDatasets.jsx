import { Tabs,Tab ,Box} from "@mui/material";
import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, InputLabel, Typography,Switch } from "@mui/material";
import React, { useEffect, useState } from "react";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";

const AutomateDatasets = () => {

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };



  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Inter-Automate Datasets" />
        <Tab label="Intra-Automate Datasets" />
      </Tabs>
      {selectedTab === 0 && <InterAutomateDataset/>}
      {selectedTab === 1 && <IntraAutomateDataset />}
    </Box>

  );
};

export default AutomateDatasets;
