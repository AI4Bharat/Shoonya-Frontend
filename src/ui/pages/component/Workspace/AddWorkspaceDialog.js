import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import GetWorkspacesAPI from '../../../../redux/actions/api/Dashboard/GetWorkspaces'
import CreateWorkspaceAPI from '../../../../redux/actions/api/WorkspaceDetails/CreateWorkspace'
import APITransport from '../../../../redux/actions/apitransport/apitransport'
import CustomButton from '../common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';



const AddWorkspaceDialog = ({ isOpen, dialogCloseHandler, orgId }) => {
    const [workspaceName, setWorkspaceName] = useState('')
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    
   
    const addBtnClickHandler = async (event) => {
        setWorkspaceName('');
        dialogCloseHandler();
        if (!workspaceName) return;

        //  setLoading(true);
        const createWorkspaceObj = new CreateWorkspaceAPI(
            orgId,
            workspaceName,
        );
        const createWorkspaceRes = await fetch(createWorkspaceObj.apiEndPoint(), {
            method: "POST",
            body: JSON.stringify(createWorkspaceObj.getBody()),
            headers: createWorkspaceObj.getHeaders().headers,
        });

        const createWorkspaceRespData = await createWorkspaceRes.json();

        if (createWorkspaceRes.ok) {
            const workspaceObj = new GetWorkspacesAPI(1);
            dispatch(APITransport(workspaceObj));
            return createWorkspaceRespData;
        }

        setLoading(false)
       

    }

    const handleUserDialogClose = () => {
        setWorkspaceName('');
        dialogCloseHandler();
    }

    const handleTextField=(e)=>{
       setWorkspaceName(e.target.value)   
    }
    
    return (
        <Dialog open={isOpen} onClose={handleUserDialogClose} close>
            <DialogTitle>Enter workspace details</DialogTitle>
            <DialogContent style={{ paddingTop: 4 }}>
                <TextField placeholder='Enter Workspace Name' label="Workspace Name" fullWidth size='small' value={workspaceName} onChange={handleTextField} />
            </DialogContent>
            <DialogActions style={{ padding: '0 24px 24px 0' }}>
                <Button onClick={handleUserDialogClose} size="small">
                    Cancel
                </Button>
                
                <CustomButton
                    startIcon={
                        !loading ? (
                            null
                        ) : (
                            <CircularProgress size="0.8rem" color="secondary" />
                        )
                    }
                    onClick={addBtnClickHandler}
                    size="small"
                    label="OK"
                    disabled={loading || !workspaceName}
                />
                
            </DialogActions>
        </Dialog>
    )
}

export default AddWorkspaceDialog