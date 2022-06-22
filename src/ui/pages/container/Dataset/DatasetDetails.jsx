import { Box, Card, Grid, ThemeProvider, Typography } from "@mui/material";
import themeDefault from '../../../theme/theme'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GetDatasetDetailsAPI from "../../../../redux/actions/api/Dataset/GetDatasetDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";
import DataitemsTable from "../../component/common/DataitemsTable";

const DatasetDetails = () => {

    const { datasetId } = useParams();

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
                    <DataitemsTable />
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;