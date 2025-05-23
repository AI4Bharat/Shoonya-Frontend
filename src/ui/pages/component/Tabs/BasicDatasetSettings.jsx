import ThemeProvider from '@mui/material/styles/ThemeProvider';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import themeDefault from '../../../theme/theme'
import { useNavigate, useParams } from 'react-router-dom';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetDatasetDetailsAPI from "../../../../redux/actions/api/Dataset/GetDatasetDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetSaveButtonAPI from "../../../../redux/actions/api/Dataset/DatasetEditUpdate";
import CustomButton from "../common/Button";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";



const BasicDatasetSettings = (props) => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { datasetId } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const DatasetDetails = useSelector(state => state.getDatasetDetails.data);
   
    const GetDatasetDetails = () => {
        const DatasetObj = new GetDatasetDetailsAPI(datasetId);
        dispatch(APITransport(DatasetObj));
    }

    useEffect(() => {
        GetDatasetDetails();
    }, []);

    useEffect(() => {
        setNewDetails({
            instance_name: DatasetDetails?.instance_name,
            instance_description: DatasetDetails?.instance_description=='' || DatasetDetails?.instance_description=='None'?'':DatasetDetails.instance_description,
        });
    }, [DatasetDetails]);

    const handleSave = async () => {

        const sendData = {
            instance_name: newDetails.instance_name,
            instance_description: newDetails.instance_description,

            parent_instance_id: DatasetDetails.parent_instance_id,
            dataset_type: DatasetDetails.dataset_type,
            organisation_id: DatasetDetails.organisation_id,
            users: DatasetDetails.users,
        }
        const DatasetObj = new GetSaveButtonAPI(datasetId, sendData);
        dispatch(APITransport(DatasetObj));
        const res = await fetch(DatasetObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(DatasetObj.getBody()),
            headers: DatasetObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }

    }

    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }
    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

    const handleDatasetName = (event) => {

        event.preventDefault();
        setNewDetails((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            {loading && <Spinner />}
            <Grid>
                {renderSnackBar()}

            </Grid>

            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Dataset Name
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}
                    >
                        <OutlinedTextField
                            fullWidth
                            name="instance_name"
                            InputProps={{ style: { fontSize: "14px" } }}
                            // value={ProjectDetails.title}
                            value={newDetails?.instance_name}
                            onChange={handleDatasetName} />
                    </Grid>
                </Grid>
                <Grid
                    container
                    direction='row'
                    sx={{
                        alignItems: "center",
                        // justifyContent: "space-between",
                        mt: 2
                    }}
                >
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >

                        <Typography variant="body2" fontWeight='700'>
                            Dataset Description
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={9}
                        xl={9}
                        sm={12}

                    >
                        <OutlinedTextField
                            fullWidth
                            name="instance_description"
                            InputProps={{ style: { fontSize: "14px" } }}
                            value={newDetails?.instance_description}
                            onChange={handleDatasetName}
                        />
                    </Grid>
                </Grid>
                <Grid
                    container
                    xs={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sm={12}
                    sx={{
                        mt: 4,
                        justifyContent: { 
                            xs: "space-between", 
                            md: "normal" 
                        },
                    }}
                >
                    <CustomButton sx={{ 
                        width: { 
                            xs: "100%", 
                            sm: "300px" 
                        }, 
                        marginBottom: { 
                            xs: 2, 
                            md: 0 
                        }, 
                        marginRight: { 
                            md: 2 
                        }}}
                        onClick={() => navigate(`/dataset/:id/`)}
                        // onClick={handleCancel}
                        label="Cancel" />
                    <CustomButton sx={{ 
                        width: { 
                            xs: "100%", 
                            sm: "300px" 
                        }}}
                        onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicDatasetSettings;
