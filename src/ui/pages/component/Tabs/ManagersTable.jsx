import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceManagers";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import {useDispatch,useSelector} from 'react-redux';
import CustomButton from "../common/Button";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import RemoveWorkspaceManagerAPI from "../../../../redux/actions/api/WorkspaceDetails/RemoveWorkspaceManager";
import CustomizedSnackbars from "../../component/common/Snackbar";

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

const handleRemoveWorkspaceManager = async(username)=>{
    const workspacedata={
        usernames:username,
 } 
        const projectObj = new RemoveWorkspaceManagerAPI(id,workspacedata);
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
    const columns = [
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align : "center"
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

        const data =  workspaceManagers &&  workspaceManagers.length > 0 ? workspaceManagers.map((el,i)=>{
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
                 onClick={()=>handleRemoveWorkspaceManager(el.username)}
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

    return (
        <div>
            {renderSnackBar()}
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