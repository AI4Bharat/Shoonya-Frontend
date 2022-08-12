import React, { useEffect, useState } from "react";
import {  useSelector,useDispatch } from 'react-redux';
import APITransport from "../../../../redux/actions/apitransport/apitransport";
import ArchiveWorkspaceAPI from "../../../../redux/actions/api/WorkspaceDetails/ArchiveWorkspace";
import CustomButton from "../common/Button";
import { useParams } from 'react-router-dom';
import DatasetStyle from "../../../styles/Dataset";
import CustomizedSnackbars from "../../component/common/Snackbar";
import GetWorkspacesAPI from "../../../../redux/actions/api/Dashboard/GetWorkspaces";

 function WorkspaceSetting(props) {
  const{onArchiveWorkspace}=props
  console.log(props,"props")
    const { id } = useParams();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [snackbar, setSnackbarInfo] = useState({
      open: false,
      message: "",
      variant: "success",
  });
  
  const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data); 
  
    const handleArchiveWorkspace = async() =>{
      const projectObj = new ArchiveWorkspaceAPI(id,id);
    dispatch(APITransport(projectObj));
    const res = await fetch(projectObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(projectObj.getBody()),
      headers: projectObj.getHeaders().headers,
    });
    const resp = await res.json();
    setLoading(false);
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message: "success",
        variant: "success",
      })
       onArchiveWorkspace()
      // window.location.reload();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }

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
              message={[snackbar.message]}
          />
      );
  };
  return (
    <div>
       {renderSnackBar()}
      <CustomButton
      sx={{backgroundColor : "#cf5959", "&:hover" : {backgroundColor : "#cf5959",}}} 
      className={classes.settingsButton} 
      onClick={handleArchiveWorkspace}
      label={"Archive Workspace"} 
      buttonVariant="contained"
      disabled={workspaceDtails?.is_archived}
      />
    </div>
  )
}
export default WorkspaceSetting;