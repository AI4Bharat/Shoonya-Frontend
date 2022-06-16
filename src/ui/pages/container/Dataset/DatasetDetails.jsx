import { Box, Card, Grid, ThemeProvider, Typography } from "@mui/material";
import themeDefault from '../../../theme/theme'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GetDatasetDetailsAPI from "../../../../redux/actions/api/Dataset/GetDatasetDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import { useEffect } from "react";

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

    console.log(DatasetDetails);

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
                        width: window.innerWidth * 0.8,
                        padding: 5,
                    }}
                >
                    <Typography variant="h2" gutterBottom component="div">
                        {DatasetDetails.instance_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        Instance Id : {DatasetDetails.instance_id}
                    </Typography>
                    <Typography variant="body1" gutterBottom component="div">
                        Dataset Type : {DatasetDetails.dataset_type}
                    </Typography>
                    {DatasetDetails.instance_description && <Typography variant="body1" gutterBottom component="div">
                        Description : {DatasetDetails.instance_description}
                    </Typography>}
                </Card>
            </Grid>
        </ThemeProvider>
    );
}

export default DatasetDetails;