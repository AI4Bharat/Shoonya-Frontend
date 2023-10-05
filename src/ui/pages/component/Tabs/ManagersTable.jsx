import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceManagers";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import {useDispatch,useSelector} from 'react-redux';
import CustomButton from "../common/Button";
import { ThemeProvider, Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import RemoveWorkspaceManagerAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceManager";
import CustomizedSnackbars from "../../component/common/Snackbar";
import Search from "../../component/common/Search";
import TextField from '@mui/material/TextField';
import LoginAPI from "../../../../redux/actions/api/UserManagement/Login";

const ManagersTable = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
      });
    
    const {id} = useParams();
    // const orgId = useSelector(state=>state.getWorkspacesProjectData?.data?.[0]?.organization_id);
    const getWorkspaceManagersData = ()=>{
        
        const workspaceObjs = new GetWorkspacesManagersDataAPI(id);
       
        dispatch(APITransport(workspaceObjs));
    }
    
    useEffect(()=>{
        getWorkspaceManagersData();
    },[]);

    const workspaceManagers = useSelector(state=>state.getWorkspacesManagersData.data);
    const SearchWorkspaceManagers = useSelector((state) => state.SearchProjectCards.data);

const handleRemoveWorkspaceManager = async(userid)=>{
   
        const projectObj = new RemoveWorkspaceManagerAPI(id, {ids:[userid]},);
        // dispatch(APITransport(projectObj));
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
                message: "Successfully Removed",
                variant: "success",
            })
            getWorkspaceManagersData();
        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }
    }
    const pageSearch = () => {

        return workspaceManagers.filter((el) => {

            if (SearchWorkspaceManagers == "") {

                return el;
            } else if (
                el.username
                    ?.toLowerCase()
                    .includes(SearchWorkspaceManagers?.toLowerCase())
            ) {

                return el;
            } else if (
                el.email
                    ?.toLowerCase()
                    .includes(SearchWorkspaceManagers?.toLowerCase())
            ) {

                return el;
            }
        })
    }
    const columns = [
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align : "center",
                setCellHeaderProps: sort => ({ style: { height: "70px",  padding: "16px" } }),
            }
        },
        {
            name: "Email",
            label: "Email",
            options: {
                filter: false,
                sort: false,
                align : "center"
            }
        },
        
        
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
            }
        }];
       
        // const data = [
        //     ["Shoonya User", "user123@tarento.com", 0, ]
        // ];

        const data =  workspaceManagers &&  workspaceManagers.length > 0 ? pageSearch().map((el,i)=>{
            return [
                el.username, 
                el.email,
               <>
                <Link to={`/profile/${el.id}`} style={{ textDecoration: "none" }}>
                    <CustomButton
                        sx={{borderRadius : 2,marginRight: 2}}
                        label = "View"
                    />
                   
                </Link>
                 <CustomButton
                 sx={{borderRadius : 2,backgroundColor:"#cf5959"}}
                 label = "Remove"
                 onClick={()=>{setElId(el.id); setElEmail(el.email); setConfirmationDialog(true);}}
             />
             </>
                    ]
        }) : [];

        const options = {
            textLabels: {
              body: {
                noMatch: "No records",
              },
              toolbar: {
                search: "Search",
                viewColumns: "View Column",
              },
              pagination: { rowsPerPage: "Rows per page" },
              options: { sortDirection: "desc" },
            },
            // customToolbar: fetchHeaderButton,
            displaySelectToolbar: false,
            fixedHeader: false,
            filterType: "checkbox",
            download: false,
            print: false,
            rowsPerPageOptions: [10, 25, 50, 100],
            // rowsPerPage: PageInfo.count,
            filter: false,
            // page: PageInfo.page,
            viewColumns: false,
            selectableRows: "none",
            search: false,
            jumpToPage: true,
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

        const [confirmationDialog, setConfirmationDialog] = useState(false);
        const [elEmail, setElEmail] = useState("");
        const [elId, setElId] = useState("");
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
            handleRemoveWorkspaceManager(elId);
            setConfirmationDialog(false);
          }else{
            window.alert("Invalid credentials, please try again");
            console.log(rsp_data);
          }
        };

    return (
        <div>
            {renderSnackBar()}
            <Dialog
                open={confirmationDialog}
                onClose={() => setConfirmationDialog(false)}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
              >
                <DialogTitle id="dialog-title">
                  {"Remove Member from Project?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {elEmail} will be removed from this workspace. Please be careful as
                    this action cannot be undone.
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
                  <Button
                    onClick={() => setConfirmationDialog(false)}
                    variant="outlined"
                    color="error"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    autoFocus
                  >
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            <Grid sx={{mb:1}}>
                <Search />
            </Grid>
            <ThemeProvider theme={tableTheme}>
				<MUIDataTable
                    // title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </div>
       
    )
}

export default ManagersTable;