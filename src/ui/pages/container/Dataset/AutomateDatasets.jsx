import { Tabs,Tab ,Box} from "@mui/material";
import { Card, FormControl, Grid, MenuItem, Select, ThemeProvider, InputLabel, Typography,Switch } from "@mui/material";
import React, { useEffect, useState } from "react";

import InterAutomateDataset from "./InterAutomateDataset";
import IntraAutomateDataset from "./IntraAutomateDataset";

const AutomateDatasets = () => {
//   const navigate = useNavigate();
//   const classes = DatasetStyle();
//   const dispatch = useDispatch();

//   const [srcDatasetTypes, setSrcDatasetTypes] = useState([]);
//   const [tgtDatasetTypes, setTgtDatasetTypes] = useState([]);
//   const [srcDatasetType, setSrcDatasetType] = useState('');
//   const [tgtDatasetType, setTgtDatasetType] = useState('');
//   const [srcInstances, setSrcInstances] = useState([]);
//   const [tgtInstances, setTgtInstances] = useState([]);
//   const [srcInstance, setSrcInstance] = useState('');
//   const [tgtInstance, setTgtInstance] = useState('');
//   const [languageChoices, setLanguageChoices] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const [translationModel, setTranslationModel] = useState('');
//   const [checks, setChecks] = useState('False');
//   const [loading, setLoading] = useState(false);
//   const [checked, setChecked] = useState(true);
//   const [snackbarState, setSnackbarState] = useState({ open: false, message: '', variant: '' });
//   //const [apitype, setApitype] = useState("indic-trans");

//   const loggedInUserData = useSelector((state) => state.fetchLoggedInUserData.data);
//   const DatasetInstances = useSelector((state) => state.getDatasetsByType.data);
//   const DatasetTypes = useSelector((state) => state.GetDatasetType.data);
//   const LanguageChoicesIndicTrans = useSelector((state) => state.getIndicTransLanguages.data);
//   const LanguageChoicesAll = useSelector((state) => state.getLanguageChoices.data);
// >>>>>>> 56c7912c32bad49f453c9b0fe61d20eb6f3657d5
  
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
