import { Box,Grid,Tab, Card,Tabs,IconButton, Typography, Divider ,Checkbox,Button,Popover,FormControlLabel} from '@mui/material'
import React from 'react'
import { useState } from 'react'
import BasicDatasetSettings from '../../component/Tabs/BasicDatasetSettings';
import DatasetSettings from './DatasetSettings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={4}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


const DatasetSettingTabs = () => {
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
const [openNewPopover, setOpenNewPopover] = useState(false);
const [selectedOptions, setSelectedOptions] = useState({
    view: false,
    use: false,
});
const open1 = Boolean(anchorEl);
const newPopoverOpen = Boolean(newPopoverAnchorEl);
const Id1 = open1 ? 'simple-popover' : undefined;
const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;
const handleNewPopoverOpen = (event) => {
    setOpenNewPopover(true);
    setNewPopoverAnchorEl(event.currentTarget);
};

const handleNewPopoverClose = () => {
    setOpenNewPopover(false);
    setNewPopoverAnchorEl(null);
    setSelectedOptions({ view: false, use: false });
};

const handleCheckboxChange = (name,checked) => {
    
    setSelectedOptions({
        ...selectedOptions,
        [name]: checked,
    });
};

const handleApply = () => {
    console.log("Selected Options:", selectedOptions);
    handleNewPopoverClose();
};


    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    return (
        <Card
        sx={{
            // width: window.innerWidth * 0.8,
            width: "100%",
            minHeight: 500,
            padding: 5
        }}
    >
      
        <Box >
              <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{mb:3,}}
                    >
                        <Typography variant="h3" gutterBottom component="div"sx={{fontWeight: '1.6875rem'}}>
                            DataSet Settings
                        </Typography>
                    </Grid>
                    <Box sx={{ mb: 2, position: 'relative' }}>

                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Basic " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important',paddingRight: '20px' }} />
                    <Tab label=" Advanced " sx={{ fontSize: 17, fontWeight: '700' }} />
                </Tabs>
                <IconButton
    color="primary"
    onClick={(e) => {
      e.stopPropagation();
      handleNewPopoverOpen(e);
    }}
    sx={{
      color: "black",
      position: 'absolute',
      left: '35px',
      top: '4px',  
    }}
  >
    <PlayArrowIcon />
  </IconButton>
            </Box>
            <Divider/>
            <Popover
                id={newPopoverId}
                open={newPopoverOpen}
                anchorEl={newPopoverAnchorEl}
                onClose={handleNewPopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">View</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.orgOwner}
                                onChange={() => handleCheckboxChange("view", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.manager}
                                onChange={() => handleCheckboxChange("view", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.orgOwner}
                                onChange={() => handleCheckboxChange("use", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.manager}
                                onChange={() => handleCheckboxChange("use", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="error" onClick={handleNewPopoverClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleApply}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Popover>

            <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                    <BasicDatasetSettings />  
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <DatasetSettings />
                </TabPanel>
            </Box>
        </Box>
        </Card>
    )
}

export default DatasetSettingTabs