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
import DatasetLogs from './DatasetLogs';
import DatasetDescription from './DatasetDescription';

const DatasetDetails = () => {

    const { datasetId } = useParams();
    const [selectedTab, setSelectedTab] = useState(0);
    const [datasetData, setDatasetData] = useState(
        [
            { name: "Dataset ID", value: null },
            { name: "Description", value: null },
            { name: "dataset Type", value: null },    
        ]
    )

    const dispatch = useDispatch();
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
    const DatasetMembers = useSelector((state) => state.getDatasetMembers.data);
    console.log(DatasetMembers,"DatasetMembersDatasetMembers")
    useEffect(() => {
		dispatch(APITransport(new GetDatasetDetailsAPI(datasetId)));
		dispatch(APITransport(new GetDatasetMembersAPI(datasetId)));
	}, [dispatch, datasetId]);
    useEffect(() => {
       
        setDatasetData([
            {
                name: "Dataset ID",
                value: DatasetDetails.instance_id
            },
            {
                name: "Description",
                value: DatasetDetails.description
            },
            {
                name: "Datset Type",
                value: DatasetDetails.dataset_type
            },
          
           
        ])
    }, [DatasetDetails.instance_id]);

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
                    {/* <Grid
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
                    </Grid>} */}
                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12}  sx={{ mb: 2 ,mt:3}}>
                        <Grid container spacing={2}>
                            {datasetData?.map((des, i) => (
                                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <DatasetDescription
                                        name={des.name}
                                        value={des.value}
                                        index={i}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Box >
                        <Tabs value={selectedTab} onChange={(_event,value)=>setSelectedTab(value)} aria-label="nav tabs example" TabIndicatorProps={{ style: { backgroundColor: "#FD7F23 " } }}>
                            <Tab label={translate("label.datasets")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.members")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.projects")} sx={{ fontSize: 16, fontWeight: '700' }} />
                            <Tab label={translate("label.logs")} sx={{ fontSize: 16, fontWeight: '700' }} />
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
                        <DatasetLogs datasetId={datasetId} />
                    </TabPanel>
                    <TabPanel value={selectedTab} index={4}>
                        <DatasetSettings datasetId={datasetId} />
                    </TabPanel>
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;