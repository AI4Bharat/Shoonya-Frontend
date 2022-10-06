import { Box,Grid,Tab, Card,Tabs, Typography, Divider } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import ProgressAnalytics from '../../component/Tabs/ProgressAnalytics';



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

const ProgressList = () => {
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (e, v) => {
        setTabValue(v)
    }
    return (
      
        < >
              {/* <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{mb:3,}}
                    >
                        <Typography variant="h3" gutterBottom component="div"sx={{fontWeight: '1.6875rem'}}>
                           
                        </Typography>
                    </Grid> */}
            <Box sx={{mb:2,}} >
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user-tabs">
                    <Tab label="Progress Analytics " sx={{ fontSize: 17, fontWeight: '700', marginRight: '28px !important' }} />
                   
                </Tabs>
            </Box>
            {/* <Divider/> */}
            <Box sx={{ p: 1 }}>
                <TabPanel value={tabValue} index={0}>
                <ProgressAnalytics />  
                </TabPanel>   
            </Box>
        </>
       
    )
}

export default ProgressList
