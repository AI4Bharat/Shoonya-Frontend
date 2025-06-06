import React, { useState, useEffect } from "react";
import {
    Button,
    Popover,
    Box,
    TextField,
    Grid, Typography, Radio,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
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
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import GetDatasetDownloadJSON from "../../../../redux/actions/api/Dataset/GetDatasetDownloadJSON";

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
    const [data, setData] = useState(null);
    const [jsonData, setJsonData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]);
    const [openPreview, setOpenPreview] = useState(false);  
    const [showPreview, setShowPreview] = useState(false);

    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    useEffect(() => {
        const fetchDataset = async () => {
          const datasetAPI = new GetDatasetDownloadJSON(datasetId);
      
          try {
            const response = await fetch(datasetAPI.apiEndPoint(), {
              method: "GET",
              headers: datasetAPI.getHeaders().headers,
            });
      
            if (response.ok) {
              const result = await response.text();
              setData(result); // Store the raw CSV data
            } else {
              console.error("Failed to fetch dataset");
            }
          } catch (error) {
            console.error("Error fetching dataset:", error);
          }
        };
      
        fetchDataset();
      }, [datasetId]);
      
      useEffect(() => {
  if (data) {
    const parseCSVData = (csvString) => {
      console.log(csvString);
      if (!csvString || typeof csvString !== 'string') {
        console.error('Invalid CSV data');
        return;
      }

      const lines = csvString.split('\n').filter((line) => line.trim() !== '');
      const headers = lines[0].split(',').map((header) => header.trim());

      const parsedData = lines.slice(1).map((line) => {
        const values = [];
        let insideArray = false;
        let insideQuotes = false;
        let currentVal = '';
        let escape = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '\\' && !escape) {
            escape = true;
            continue;
          }

          if (char === '"') {
            insideQuotes = !insideQuotes;
          }

          if (char === '[') {
            insideArray = true;
          } else if (char === ']') {
            insideArray = false;
          }

          if (char === ',' && !insideArray && !insideQuotes && !escape) {
            let value = currentVal.trim();
            if (value.startsWith('"') && value.endsWith('"') && !value.startsWith('""')) {
              value = value.slice(1, -1);
            }
            if (value.startsWith('[') && value.endsWith(']')) {
              value = value.replace(/""/g, '"');
              try {
                values.push(JSON.parse(value));
              } catch {
                values.push(value);
              }
            } else {
              value = value.replace(/\\"/g, '"');
              if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                values.push(value.toLowerCase() === 'true');
              } else {
                values.push(value);
              }
            }
            currentVal = ''; // Clear current value for the next entry
          } else {
            currentVal += char; // Continue accumulating the current value
            escape = false;
          }
        }

        // Handle the last value (for the 'domain' field)
        let lastValue = currentVal.trim();
        if (lastValue.startsWith('"') && lastValue.endsWith('"') && !lastValue.startsWith('""')) {
          lastValue = lastValue.slice(1, -1);
        }
        if (lastValue.startsWith('[') && lastValue.endsWith(']')) {
          lastValue = lastValue.replace(/""/g, '"');
          try {
            values.push(JSON.parse(lastValue));
          } catch {
            values.push(lastValue);
          }
        } else {
          lastValue = lastValue.replace(/\\"/g, '"');
          if (lastValue.toLowerCase() === 'true' || lastValue.toLowerCase() === 'false') {
            values.push(lastValue.toLowerCase() === 'true');
          } else {
            values.push(lastValue);
          }
        }

        // Map the headers and values to form the object
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] !== undefined ? values[index] : null; // Ensure all headers are included
          return obj;
        }, {});
      });

      setJsonData(parsedData); // Store the parsed JSON data in state
    };

    parseCSVData(data);
  }
}, [data]);

const closePreview = () => {
    setOpenPreview(false);
};

      
useEffect(() => {
    if (jsonData.length > 0) {
      const filterData = () => {
        let filtered;
        const idsToDelete = dataIds.split(',').map(id => Number(id.trim())); // Use trim()

        console.log(idsToDelete);
        if (radiobutton) {
          filtered = jsonData.filter(item => item.id >= startdataid && item.id <= enddataid);
        } else {
            filtered = jsonData.filter(item => idsToDelete.includes(Number(item.id)));

          console.log(filtered)
        }
        setFilteredData(filtered);
       
      };
      filterData();
    }
  }, [jsonData, startdataid, enddataid, radiobutton, dataIds]);
        
    console.log(filteredData);
    const Dataitems = JSON.parse( localStorage.getItem("DataitemsList"))

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
        setOpenDialog(false);
        setOpenPreview(true);
    };
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

    const emailId = localStorage.getItem("email_id");
    const [password, setPassword] = useState("");
    const handleConfirm = async () => {
      const apiObj = new LoginAPI(emailId, password);
        const res = await fetch(apiObj.apiEndPoint(), {
        method: "POST",
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers,
        });
        const rsp_data = await res.json();
        if (res.ok) {
        handleok();
        }else{
        window.alert("Invalid credentials, please try again");
        console.log(rsp_data);
        }
    };

    return (
        <div >
            {renderSnackBar()}
            <Button
                sx={{ width: "150px" }}
                aria-describedby={id}
                variant="contained"
                color="error"
                onClick={handleClick}
                disabled={
                    Dataitems.length < 0
                      ? true
                      : false
                  }
                >
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
                open={openPreview}
                onClose={closePreview}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Preview of Data Items to Delete</DialogTitle>
                <DialogContent>
                {filteredData.length > 0 ? (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer component={Paper}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Context</TableCell>
                        <TableCell>Input Text</TableCell>
                        <TableCell>Machine Translation</TableCell>
                        <TableCell>Domain</TableCell>
                        <TableCell>Draft Data</TableCell>
                        <TableCell>Input Language</TableCell>
                        <TableCell>Instance ID</TableCell>
                        <TableCell>LabSE Score</TableCell>
                        <TableCell>Metadata</TableCell>
                        <TableCell>Output Language</TableCell>
                        <TableCell>Output Text</TableCell>
                        <TableCell>Parent Data</TableCell>
                        <TableCell>Rating</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.context}</TableCell>
                            <TableCell>{item.input_text}</TableCell>
                            <TableCell>{item.machine_translation}</TableCell>
                            <TableCell>{item.domain || 'N/A'}</TableCell>
                            <TableCell>{item.draft_data_json || 'N/A'}</TableCell>
                            <TableCell>{item.input_language}</TableCell>
                            <TableCell>{item.instance_id}</TableCell>
                            <TableCell>{item.labse_score !== null ? item.labse_score : 'N/A'}</TableCell>
                            <TableCell>{item.metadata_json || 'N/A'}</TableCell>
                            <TableCell>{item.output_language}</TableCell>
                            <TableCell>{item.output_text || 'N/A'}</TableCell>
                            <TableCell>{item.parent_data}</TableCell>
                            <TableCell>{item.rating !== null ? item.rating : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
) : (
    <Typography>No data found for the given IDs.</Typography>
)}


                </DialogContent>
                <DialogActions>
                    <Button onClick={closePreview} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            closePreview();
                            setOpenDialog(true);
                        }}
                        color="primary"
                        variant="contained"
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>

                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete the data items? Please note this action cannot be undone. 
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.clearAllBtn} > 
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm}
                        variant="contained"
                        color="primary"
                        size="small" className={classes.clearAllBtn} autoFocus >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
