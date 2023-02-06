import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box,
  Typography,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemIcon,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import OutlinedTextField from "../common/OutlinedTextField";
import { snakeToTitleCase } from "../../../../utils/utils";
import DatasetStyle from "../../../styles/Dataset";
import CancelIcon from "@mui/icons-material/Cancel";
import GetDatasetsByTypeAPI from "../../../../redux/actions/api/Dataset/GetDatasetsByType";

const ExportProjectDialog = ({
  OpenExportProjectDialog,
  handleClose,
  datasetId,
  setDatasetId,
  datavalue,
  projectType,
}) => {
  const dispatch = useDispatch();
  const classes = DatasetStyle();
  const [instanceIds, setInstanceIds] = useState([]);
 

  const DatasetInstances = useSelector(
    (state) => state.getDatasetsByType?.data
  );
 
  instanceIds?.map((el) =>
    console.log(el.instance_id, "instanceIdsinstanceIds")
  );

  useEffect(() => {
    const instancesObj = new GetDatasetsByTypeAPI(projectType);
    dispatch(APITransport(instancesObj));
  }, []);

  useEffect(() => {
    if(!(
      DatasetInstances &&
      Object.keys(DatasetInstances).length === 0 &&
      Object.getPrototypeOf(DatasetInstances) === Object.prototype
    ) ){ setInstanceIds(DatasetInstances);}
    
  }, [DatasetInstances]);
  return (
    <Dialog
      open={OpenExportProjectDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid
            container
            direction="row"
            sx={{
              alignItems: "center",
              // justifyContent: "space-between",
            }}
          >
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-label" sx={{ fontSize: "16px" }}>
                  Dataset Instance Id
                </InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={datasetId}
                  label="Dataset Instance Id"
                  onChange={(e) => setDatasetId(e.target.value)}
                >
                  {instanceIds?.map((el) => (
                      <MenuItem key={el.instance_id } value={el.instance_id}>
                        {el.instance_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Close
        </Button>
        <Button variant="text" onClick={datavalue} sx={{ borderRadius: "6px" }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportProjectDialog;
