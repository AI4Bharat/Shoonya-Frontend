import React, { useState } from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography, Radio,Dialog, DialogActions, DialogContent, DialogContentText,
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
    const [dataIds, setDataIds] = useState("")
    const [openDialog, setOpenDialog] = useState(false);

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    let datasetitem = dataIds.split(",")
    var value = datasetitem.map(function (str) {
        return parseInt(str);
    });


    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClearSearch = () => {
        setAnchorEl(null);
        setStartDataId();
        setEndDataId();
        setDataIds("");

    };
    const handleDeletebyids = () => {
        setRadiobutton(true)

    }
    const handleDeletebyrange = () => {
        setRadiobutton(false)
    }


    const handledataIds = (e,) => {
        setDataIds(e.target.value);


    }
    const handleok = async() => {
        setOpenDialog(false);
        setAnchorEl(null);
        setStartDataId();
        setEndDataId();
        setDataIds("");
        let datasetObj;
        const DeleteDataItems = {
            data_item_start_id: parseInt(startdataid),
            data_item_end_id: parseInt(enddataid)
        }

        const dataitemids = {
            data_item_ids: value
        }

        if (radiobutton === true) {
            datasetObj = new DeleteDataItemsAPI(datasetId, DeleteDataItems)


        } else {
            datasetObj = new DeleteDataItemsAPI(datasetId, dataitemids)
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

    const handleSearchSubmit = async () => {
        setOpenDialog(true);

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
            <Button
                sx={{ width: "150px" }}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}>
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
                    <Grid item style={{ flexGrow: "1", padding: "10px" }}>
                        <FormControl >
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                defaultValue="deletebyrange"

                            >

                                <FormControlLabel value="deletebyrange" control={<Radio />} label="Delete by Range" onClick={handleDeletebyids} />
                                <FormControlLabel value="deletebyids" control={<Radio />} label="Delete by IDs" onClick={handleDeletebyrange} />

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
                                    Start Data ID:
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
                                    End Data ID:
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
                            lg={3}
                            xl={3}
                        >
                            <Typography variant="body2" fontWeight='700' label="Required">
                                Data IDs:
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
                                value={dataIds}
                                onChange={handledataIds}
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
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this data items ? Please note this action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn} > {" "}
                        {translate("button.clear")}
                    </Button>
                    <Button onClick={handleok}
                        variant="contained"
                        color="primary"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
