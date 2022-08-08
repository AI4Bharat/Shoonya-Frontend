import {useState} from 'react';
import { Box, Card, Grid, ThemeProvider, Typography, Tabs, Tab } from "@mui/material";
import themeDefault from '../../../theme/theme'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";
import DataitemsTable from "../../component/common/DataitemsTable";
import { translate } from "../../../../config/localisation";
import TabPanel from '../../component/common/TabPanel';
import DatasetProjectsTable from '../../component/Tabs/DatasetProjectsTable';
import GetDatasetDetailsAPI from "../../../../redux/actions/api/Dataset/GetDatasetDetails";
import GetDatasetMembersAPI from "../../../../redux/actions/api/Dataset/GetDatasetMembers";
import MembersTable from '../../component/Project/MembersTable';
import DatasetSettings from './DatasetSettings';

const DatasetDetails = () => {

    const { datasetId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);

    const dispatch = useDispatch();
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
    const DatasetMembers = useSelector((state) => state.getDatasetMembers.data);
    
    useEffect(() => {
		dispatch(APITransport(new GetDatasetDetailsAPI(datasetId)));
		dispatch(APITransport(new GetDatasetMembersAPI(datasetId)));
	}, [dispatch, datasetId]);

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
                        <Typography variant="body2" >{DatasetDetails.instance_id}</Typography>
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
                        <Typography variant="body2" >{DatasetDetails.dataset_type}</Typography>
                    </Grid>
                    {DatasetDetails.instance_description && <Grid
                        container
                        alignItems="center"
                        direction="row"
                        justifyContent="flex-start"
                        // sx={{
                        //     paddingTop: 2
                        // }}
                    >
                        <Typography variant="body2" fontWeight='700' pr={1}>Description :</Typography>
                        <Typography variant="body2" >{DatasetDetails.instance_description}</Typography>
                    </Grid>}
                    <Box >
                        <Tabs value={selectedTab} onChange={(_event,value)=>setSelectedTab(value)} aria-label="nav tabs example" TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}>
                            <Tab label={translate("label.datasets")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.projects")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.settings")} sx={{ fontSize: 16, fontWeight: '700' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value={selectedTab} index={0}>
                        <DataitemsTable />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={1}>
                        <MembersTable dataSource={DatasetMembers} hideButton />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={2}>
                        <DatasetProjectsTable datasetId={datasetId} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={3}>
                        <DatasetSettings datasetId={datasetId} />
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;