import React, { useState ,useEffect} from "react";
import {
  Button,
  Popover,
  Box,
  TextField,
  Grid,
  Typography,
  ListItemIcon,
  ListItemText,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  IconButton
} from "@mui/material";
import { translate } from "../../../../config/localisation";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import removeDuplicatesDatasetInstanceAPI from "../../../../redux/actions/api/Dataset/removeDuplicatesDatasetInstance";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { snakeToTitleCase } from "../../../../utils/utils";
import { useParams } from 'react-router-dom';
import CustomizedSnackbars from "../../component/common/Snackbar"
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "center",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "center",
  },
  variant: "menu",
};
export default function DeduplicateDataItems() {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const { datasetId } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [openDialog, setOpenDialog] = useState(false);
  const [dataitems, setDataitems] = useState([]);
  const [dataitemsvalues, setDataitemsvalues] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);

  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
});
const [newPopoverAnchorEl, setNewPopoverAnchorEl] = useState(null);
const [openNewPopover, setOpenNewPopover] = useState(false);
const [selectedOptions, setSelectedOptions] = useState({
    view: false,
    use: false,
});
const open1 = Boolean(anchorEl);
const newPopoverOpen = Boolean(newPopoverAnchorEl);
const Id1 = open1 ? 'simple-popover' : undefined;
const newPopoverId = newPopoverOpen ? 'new-popover' : undefined;






useEffect(() => {
    const Dataitems=JSON.parse(localStorage.getItem("Dataitem"))
    setDataitemsvalues(Dataitems)  
}, [])



useEffect(() => {
  let fetchedItems =dataitemsvalues.results;


let tempSelected = [];
if (fetchedItems?.length) {
  Object.keys(fetchedItems[0]).forEach((key) => {
    
      tempSelected.push({ name: key,
        label: snakeToTitleCase(key),});
  
  });
}
setSelectedColumns(tempSelected);


 }, [dataitemsvalues])

 useEffect(() => {
  const newCols = columns.map(col => {
      col.options.display = selectedColumns.includes(col.name) ? "true" : "false";
      return col;
  });
  setColumns(newCols);
  
}, [selectedColumns]);

const handleChange = (event) => {
    const value = event.target.value;
   
    setDataitems(value);
  };
  const handleSearchSubmit = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDataitems([])
  };
  const handleClearSearch = () => {
    setAnchorEl(null);
    setDataitems([])
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDataitems([])
};

const handleok = async() => {
  const  datasetObj = new removeDuplicatesDatasetInstanceAPI(datasetId,dataitems.toString())
       // dispatch(APITransport(datasetObj));
        const res = await fetch(datasetObj.apiEndPoint(), {
            method: "GET",
            body: JSON.stringify(datasetObj.getBody()),
            headers: datasetObj.getHeaders().headers,
        });
        const resp = await res.json();
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
        setOpenDialog(false);
        setDataitems([])
}
const handleNewPopoverOpen = (event) => {
  setOpenNewPopover(true);
  setNewPopoverAnchorEl(event.currentTarget);
};

const handleNewPopoverClose = () => {
  setOpenNewPopover(false);
  setNewPopoverAnchorEl(null);
  setSelectedOptions({ view: false, use: false });
};

const handleCheckboxChange = (name,checked) => {
  
  setSelectedOptions({
      ...selectedOptions,
      [name]: checked,
  });
};

const handleApply = () => {
  console.log("Selected Options:", selectedOptions);
  handleNewPopoverClose();
};

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
    <div>
         {renderSnackBar()}
         <Box display="flex" alignItems="center">

      <Button
        sx={{ width: "200px" ,  borderRadius: "8px 0 0 8px",}}
        aria-describedby={id}
        variant="contained"
        color="error"
        onClick={handleClick}
        disabled={
            dataitemsvalues.length < 0
              ? true
              : false
          }
      >
        Deduplicate Data Items
      </Button>
      <IconButton
                    color="primary"
                    onClick={handleNewPopoverOpen} 
                    sx={{   borderRadius: "0 8px 8px 0",backgroundColor:"#B00020",color:"white"}} 
                >
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>
            <Popover
                id={newPopoverId}
                open={newPopoverOpen}
                anchorEl={newPopoverAnchorEl}
                onClose={handleNewPopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6">View</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.orgOwner}
                                onChange={() => handleCheckboxChange("view", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.view.manager}
                                onChange={() => handleCheckboxChange("view", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>Use</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.orgOwner}
                                onChange={() => handleCheckboxChange("use", "orgOwner")}
                            />
                        }
                        label="Org Owner"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedOptions.use.manager}
                                onChange={() => handleCheckboxChange("use", "manager")}
                            />
                        }
                        label="Manager"
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                        <Button variant="outlined" color="error" onClick={handleNewPopoverClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleApply}>
                            Apply
                        </Button>
                    </Box>
                </Box>
            </Popover>


      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <>
          <Grid
            container
            direction="row"
            sx={{
              alignItems: "center",
              p: 1,
            }}
          >
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12} sx={{mt:2}}>

            <FormControl className={classes.formControl} size="small">
      <InputLabel id="Select-fields-to-deduplicate" sx={{ fontSize: "16px" }}>Select Fields to Deduplicate</InputLabel>
      <Select
        labelId="Select-fields-to-deduplicate"
        label= "Select Fields to Deduplicate"
        id="Select-fields-to-deduplicate"
        multiple
        value={dataitems}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        
        {selectedColumns.map((option) => (
          <MenuItem key={option.name} value={option.name}>
            <ListItemIcon>
              <Checkbox checked={dataitems.indexOf(option.name) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
            
            </Grid>
          </Grid>
        </>

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
            disabled={
                dataitems.length < 0
                  ? true
                  : false
              }
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
                    Are you sure you want to delete the Duplicate Data Items ? Please note this action cannot be undone. 
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
