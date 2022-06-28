import {useState} from 'react';
import { Box, Card, Grid, ThemeProvider, Typography, Tabs, Tab } from "@mui/material";
import themeDefault from '../../../theme/theme'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GetDatasetDetailsAPI from "../../../../redux/actions/api/Dataset/GetDatasetDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";
import DataitemsTable from "../../component/common/DataitemsTable";
import { translate } from "../../../../config/localisation";
import TabPanel from '../../component/common/TabPanel';

const DatasetDetails = () => {

    const { datasetId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);

    const dispatch = useDispatch();
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);

    const getDatasetDetails = () => {
        const datasetObj = new GetDatasetDetailsAPI(datasetId);

        dispatch(APITransport(datasetObj));
    }

    useEffect(() => {
        getDatasetDetails();
    }, []);

    return (
        <ThemeProvider theme={themeDefault}>
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Card
                    sx={{
                        // width: window.innerWidth * 0.8,
                        width: '100%',
                        padding: 5,
                    }}
                >
                    <Typography variant="h3">
                        {DatasetDetails.instance_name}
                    </Typography>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2,
                            paddingBottom: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Instance ID :</Typography>
                        <Typography variant="caption">{DatasetDetails.instance_id}</Typography>
                    </Grid>
                    <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingBottom: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Dataset Type :</Typography>
                        <Typography variant="caption">{DatasetDetails.dataset_type}</Typography>
                    </Grid>
                    {DatasetDetails.instance_description && <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        sx={{
                            paddingTop: 2
                        }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Description :</Typography>
                        <Typography variant="caption">{DatasetDetails.instance_description}</Typography>
                    </Grid>}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={selectedTab} onChange={(_event,value)=>setSelectedTab(value)} aria-label="nav tabs example" TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}>
                            <Tab label={translate("label.datasets")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.projects")} sx={{ fontSize: 16, fontWeight: '700' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value={selectedTab} index={0}>
                        <DataitemsTable />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={1}>

                    </TabPanel>
                    <TabPanel value={selectedTab} index={2}>
                        
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;