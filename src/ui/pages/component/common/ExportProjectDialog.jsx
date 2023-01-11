import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Box,
    Typography
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import APITransport from '../../../../redux/actions/apitransport/apitransport';
  import OutlinedTextField from "../common/OutlinedTextField";
  import GetProjectDomainsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDomains"
  
  const ExportProjectDialog = ({ OpenExportProjectDialog, handleClose,datasetId,setDatasetId,datavalue }) => {
    const dispatch = useDispatch();
    
    const ProjectTypes = useSelector((state) => state.getProjectDomains.data);
    console.log(ProjectTypes.Conversation?.project_types?.ConversationTranslation?.output_dataset?.save_type

        ,"ProjectTypes")
    useEffect(() => {
        const typesObj = new GetProjectDomainsAPI();
        dispatch(APITransport(typesObj));
       
      }, []);
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
                        lg={4}
                        xl={4}
                    >
                        <Typography variant="body2" fontWeight='700' label="Required">
                        Dataset Id :
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={6}
                        xl={6}
                        sm={12}
                    >
                        <OutlinedTextField
                           
                            name="id"
                            InputProps={{ style: { fontSize: "14px", width: "210px" } }}
                             value={datasetId}
                             onChange={(e) => setDatasetId(e.target.value)}
                           
                             />
                    </Grid>
                </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button
            variant="text"
            onClick={handleClose}
            sx={{ lineHeight: "1", borderRadius: "6px" }}
          >
            Close
          </Button>
          <Button
            variant="text"
            onClick={datavalue}
            sx={{ borderRadius: "6px" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default ExportProjectDialog;
  