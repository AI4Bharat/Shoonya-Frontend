import React, { useState } from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography, Radio,
} from "@mui/material";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import DeleteDataItemsAPI from "../../../../redux/actions/api/Dataset/DeleteDataItems";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar";


export default function DeleteDataItems() {
    const classes = DatasetStyle();
    const { datasetId } = useParams();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [startdataid, setStartDataId] = useState("");
    const [enddataid, setEndDataId] = useState("");
    const [loading, setLoading] = useState(false);
    const [radiobutton, setRadiobutton] = useState(true)
    const [dataIds, setDataIds] = useState([])
    console.log(radiobutton, "radiobutton",dataIds)
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setStartDataId();
        setEndDataId();

    };
    const handleDeletebyids = () => {
        setRadiobutton(true)

    }
    const handleDeletebyrange = () => {
        setRadiobutton(false)
    }


    const handleSearchSubmit = async () => {
      
        let datasetObj;
        const DeleteDataItems = {
            data_item_start_id: parseInt(startdataid),
            data_item_end_id: parseInt(enddataid)
        }
        if(radiobutton === true){
            datasetObj = new DeleteDataItemsAPI(datasetId, DeleteDataItems)
            

        }else{
            datasetObj = new DeleteDataItemsAPI(datasetId, [parseInt(dataIds)])
        }
        // dispatch(APITransport(datasetObj));
        const res = await fetch(datasetObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(datasetObj.getBody()),
            headers: datasetObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
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


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
        <div >
            {renderSnackBar()}
            <Button aria-describedby={id} variant="contained" onClick={handleClick}>
                Delete Data Item
            </Button>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Grid container className={classes.root} >
                    <Grid item style={{ flexGrow: "1" }}>
                        <FormControl >
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue="deletebyids"

                            >

                                <FormControlLabel value="deletebyids" control={<Radio />} label="Delete by Ids" onClick={handleDeletebyids} />
                                <FormControlLabel value="deletebyrange" control={<Radio />} label="Delete by Range" onClick={handleDeletebyrange} />

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>

                {radiobutton === true &&
                    <>

                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                p: 1
                            }}
                        >

                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={4}
                                xl={4}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                    Start Data Id:
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                xl={6}
                                sm={6}
                            >
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    value={startdataid}
                                    onChange={(e) => setStartDataId(e.target.value)}
                                    inputProps={{
                                        style: {
                                            fontSize: "16px"
                                        }
                                    }}
                                />

                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction='row'
                            sx={{
                                alignItems: "center",
                                p: 1
                            }}
                        >
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={4}
                                xl={4}
                            >
                                <Typography variant="body2" fontWeight='700' label="Required">
                                    End Data Id:
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={6}
                                xl={6}
                                sm={6}
                            >
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    value={enddataid}
                                    onChange={(e) => setEndDataId(e.target.value)}
                                    inputProps={{
                                        style: {
                                            fontSize: "16px"
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </>
                }
                {radiobutton === false &&
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            p: 1
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={4}
                            xl={4}
                        >
                            <Typography variant="body2" fontWeight='700' label="Required">
                                Data Ids:
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={6}
                            xl={6}
                            sm={6}
                        >
                            <TextField
                             multiple
                                size="small"
                                variant="outlined"
                                value={dataIds}
                                onChange={(e) => setDataIds(e.target.value)}
                                inputProps={{
                                    style: {
                                        fontSize: "16px"
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                }


                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 1 }}>
                    <Button
                        onClick={handleClearSearch}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                    >
                        {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button
                        onClick={handleSearchSubmit}
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn}
                       // disabled={(!startdataid  || !enddataid  ) && !dataIds}
                    >
                        {" "}
                        {translate("button.submit")}
                    </Button>
                </Box>
            </Popover>
        </div>
    );
}
