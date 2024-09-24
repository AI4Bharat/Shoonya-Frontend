import { Card, Grid, ThemeProvider, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from "../../../theme/theme";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomButton from "../../component/common/Button";
import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from "../../../../redux/actions/apitransport/apitransport";

const ReadonlyConfigurations = (props) => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();
  const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
  const workspaceDetails = useSelector((state) => state.getWorkspaceDetails.data);
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState("");

  const getWorkspaceDetails = () => {
    const workspaceObj = new GetWorkspacesDetailsAPI(ProjectDetails.workspace_id);
    dispatch(APITransport(workspaceObj));
}

useEffect(() => {
    getWorkspaceDetails();
}, []);

  const handleOpenMetadataDialog = () => {
    setEditedMetadata(JSON.stringify(ProjectDetails.metadata_json, null, 2));
    setMetadataDialogOpen(true);
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
  };

  const handleMetadataChange = (e) => {
    setEditedMetadata(e.target.value);
  };

  const handleSaveMetadata = () => {
    try {
      const parsedMetadata = JSON.parse(editedMetadata);
      const patchProjectObj = new GetProjectDetailsAPI(
        ProjectDetails.id,
        "PATCH",
        { metadata_json: parsedMetadata }
      );

      dispatch(APITransport(patchProjectObj));
      setMetadataDialogOpen(false);
      alert("Metadata update initiated. Please wait for confirmation.");
      dispatch(APITransport(new GetProjectDetailsAPI(ProjectDetails.id)));
    } catch (error) {
      console.error("Invalid JSON format or network error", error);
      alert("Invalid JSON format or network error. Please correct it.");
    }
  };

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid
        container
        direction="row"
        // justifyContent='center'
        // alignItems='center'
      >
        {/* <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h5"   >
                            Read-only Configurations
                        </Typography>
                    </Grid> */}
        {ProjectDetails && ProjectDetails.sampling_mode && (
          <div>
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              // sx={{mt:2}}
            >
              <Typography variant="h6">Sampling Parameters</Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                Sampling Mode :
              </Typography>

              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                {ProjectDetails.sampling_mode == "f" && "Full"}
                {ProjectDetails.sampling_mode == "b" && "Batch"}
                {ProjectDetails.sampling_mode == "r" && "Random"}
              </Typography>
              
            </Grid>
            {ProjectDetails && ProjectDetails?.sampling_parameters_json?.batch_size  && ( 
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                Batch Size  :
              </Typography>

              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
              {ProjectDetails.sampling_parameters_json?.batch_size}
              </Typography>
              
            </Grid>)}
            {ProjectDetails && ProjectDetails?.sampling_parameters_json?.batch_size  && ( 
            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                 Batch Number  :
              </Typography>

              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
              {ProjectDetails.sampling_parameters_json?.batch_number}
              </Typography>
            </Grid>)}

            {ProjectDetails.datasets.map((dataset) => (
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
                sx={{ mt: 2, display: "flex" }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ flexDirection: "column" }}
                >
                  Dataset Instance :
                </Typography>

                <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                  {dataset?.instance_name}
                </Typography>
                <Link
                    to={`/datasets/${dataset?.instance_id}`}
                    style={{ textDecoration: "none" }}
                    >
                    <CustomButton
                        sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
                        label="View Dataset"
                    />
                </Link>
              </Grid>
            ))}

             <Grid
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
                sx={{ mt: 2, display: "flex" }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ flexDirection: "column" }}
                >
                  Workspace Name :
                </Typography>

                <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                {workspaceDetails.workspace_name}
                </Typography>
                <Link
                    to={`/workspaces/${ProjectDetails.workspace_id}`}
                    style={{ textDecoration: "none" }}
                    >
                    <CustomButton
                        sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
                        label="View Workspace"
                    />
                </Link>
              </Grid>

            {ProjectDetails.filter_string && (
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                xl={12}
                sm={12}
                sx={{ mt: 2, display: "flex" }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ flexDirection: "column" }}
                >
                  Filter String :
                </Typography>

                <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                  {ProjectDetails.filter_string}
                </Typography>
              </Grid>
            )}
          </div>
        )}

        {/* Metadata Parameters Section */}
        <div>
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            xl={12}
            sm={12}
            sx={{ mt: 4, display: "flex", alignItems: 'center' }}  
          >
            <Typography variant="subtitle1" style={{ flexDirection: "column", minWidth: '150px' }}>
              Metadata Parameters:
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 25, marginRight: 10 }}> 
              {ProjectDetails.metadata_json ? JSON.stringify(ProjectDetails.metadata_json, null, 2) : "No Metadata Available"}
            </Typography>
            
            <Button
              sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
              variant="contained"
              color="primary"
              onClick={handleOpenMetadataDialog}
            >
              Edit Metadata
            </Button>
          </Grid>
        </div>
      </Grid>

      {/* Metadata Editing Dialog */}
      <Dialog open={metadataDialogOpen} onClose={handleCloseMetadataDialog}>
        <DialogTitle>Edit Metadata</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={editedMetadata}
            onChange={handleMetadataChange}
          />
        </DialogContent>
        <DialogActions>
        <Button
              sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
              variant="contained"
              color="primary"
              onClick={handleOpenMetadataDialog}
            >
              Cancel
        </Button>
        <Button
              sx={{ borderRadius: 2,marginLeft:2 ,marginRight: 2 }}
              variant="contained"
              color="primary"
              onClick={handleSaveMetadata}
            >
              Save
        </Button>
        </DialogActions>
      </Dialog>

      <Grid container direction="row">
        {ProjectDetails && ProjectDetails?.variable_parameters?.output_language && (
          <div>
            <Grid item xs={12} md={12} lg={12} xl={12} sm={12} sx={{ mt: 2 }}>
              <Typography variant="h6">Variable Parameters</Typography>
            </Grid>

            <Grid
              item
              xs={12}
              md={12}
              lg={12}
              xl={12}
              sm={12}
              sx={{ mt: 2, display: "flex" }}
            >
              <Typography
                variant="subtitle1"
                style={{ flexDirection: "column" }}
              >
                Output Language :
              </Typography>
              <Typography variant="subtitle1" style={{ marginLeft: 25 }}>
                {ProjectDetails?.variable_parameters?.output_language}
              </Typography>
            </Grid>
          </div>
        )}
      </Grid>
    </ThemeProvider>
  );
};

export default ReadonlyConfigurations;
