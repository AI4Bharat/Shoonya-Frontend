
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import React, { useEffect, useState } from "react";
import themeDefault from '../../../theme/theme'
import { useNavigate, useParams } from 'react-router-dom';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspaceSaveButtonAPI from "../../../../redux/actions/api/WorkspaceDetails/WorkspaceEditUpdate";
import CustomButton from "../common/Button";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";
import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";



const BasicWorkspaceSettings = (props) => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const [publicanalytics,setpublicanalytics] = useState(true)
   


    const handlepublicanalytics = async () => {
        // setLoading(true);
        setpublicanalytics((publicanalytics)=>!publicanalytics)
      };

    const workspaceDetails = useSelector(state => state.getWorkspaceDetails.data);
    const getWorkspaceDetails = () => {
        const workspaceObj = new GetWorkspacesDetailsAPI(id);
        dispatch(APITransport(workspaceObj));
    }

    useEffect(() => {
        getWorkspaceDetails();
    }, []);

    useEffect(() => {
        setNewDetails({
            workspace_name: workspaceDetails?.workspace_name
        });
    }, [workspaceDetails]);

    const handleSave = async () => {

        const sendData = {
            workspace_name: newDetails.workspace_name,
            organization: workspaceDetails.organization,
            is_archived: workspaceDetails.is_archived,
            public_analytics: publicanalytics
        }
        const workspaceObj = new GetWorkspaceSaveButtonAPI(id, sendData);
        dispatch(APITransport(workspaceObj));
        const res = await fetch(workspaceObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(workspaceObj.getBody()),
            headers: workspaceObj.getHeaders().headers,
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

    const handleWorkspaceName = (event) => {

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
                            Workspace Name
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
                            name="workspace_name"
                            InputProps={{ style: { fontSize: "14px", width: "500px" } }}
                            // value={ProjectDetails.title}
                            value={newDetails?.workspace_name}
                            onChange={handleWorkspaceName} />
                    </Grid>
                    <Grid
                        items
                        xs={12}
                        sm={12}
                        md={12}
                        lg={2}
                        xl={2}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                            Public Analytics
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
                        <FormControlLabel
                            control={<Switch color="primary" />}
                            labelPlacement="start"
                            checked={publicanalytics}
                            onChange={handlepublicanalytics}
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
                        m: 7,
                        // justifyContent: "center",

                    }}
                >
                    <CustomButton sx={{ inlineSize: "max-content", marginRight: "10px", width: "80px" }}
                        onClick={() => navigate(`/workspace/:id/`)}
                        // onClick={handleCancel}
                        label="Cancel" />
                    <CustomButton sx={{ inlineSize: "max-content", width: "80px" }}
                        onClick={handleSave}
                        label="Save" />
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicWorkspaceSettings;
