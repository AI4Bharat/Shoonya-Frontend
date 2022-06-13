import React, { useState, useEffect } from "react";
import CustomButton from '../../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceManagers";
import APITransport from '../../../../../redux/actions/apitransport/apitransport';
import {useDispatch,useSelector} from 'react-redux';

const ManagersTable = (props) => {

    const dispatch = useDispatch();
    
    const {id} = useParams();
    const orgId = useSelector(state=>state.getWorkspacesProjectData.data[0].organization_id);
    const getWorkspaceManagersData = ()=>{
        
        const workspaceObjs = new GetWorkspacesManagersDataAPI( orgId);
       
        dispatch(APITransport(workspaceObjs));
    }
    
    useEffect(()=>{
        getWorkspaceManagersData();
    },[]);

    const workspaceManagers = useSelector(state=>state.getWorkspacesManagersData.data);
   
<<<<<<< HEAD:src/ui/pages/component/WorkspaceTables/ManagersTable.jsx
    console.log("workspaceManagers ", workspaceManagers);
=======
    console.log(" WorkspaceManagers", workspaceManagers);
>>>>>>> feature-migration:src/ui/pages/container/workspace/Tabs/ManagersTable.jsx

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
        const data =  workspaceManagers &&  workspaceManagers.length > 0 ? workspaceManagers.filter((item) => {
            if (
                  item.role===2
                    
                ) {
                  return item;
                }
              }).map((el,i)=>{
            return [
                el.username, 
                el.email,
               
                <Link to={`/workspace/${el.id}`} style={{ textDecoration: "none" }}>
                    <CustomButton
                        sx={{borderRadius : 2,marginRight: 2}}
                        label = "View"
                    />
                    <CustomButton
                        sx={{borderRadius : 2,backgroundColor:"red"}}
                        label = "Remove"
                    />
                </Link>
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
           
          };

    return (
        <div>
            <MUIDataTable
                // title={""}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
       
    )
}

export default ManagersTable;