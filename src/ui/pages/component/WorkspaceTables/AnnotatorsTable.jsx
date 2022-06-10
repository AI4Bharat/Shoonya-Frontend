import React, { useState, useEffect } from "react";
import CustomButton from '../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from '../../../../utils/UserMappedByRole/UserMappedByRole';

const ManagersTable = (props) => {
    const dispatch = useDispatch();
    
    const {id} = useParams();
    const getWorkspaceAnnotatorsData = ()=>{
        
        const workspaceObjs = new GetWorkspacesAnnotatorsDataAPI(id);
       
        dispatch(APITransport(workspaceObjs));
    }
    
    useEffect(()=>{
        getWorkspaceAnnotatorsData();
    },[]);

    const workspaceAnnotators = useSelector(state=>state.getWorkspacesAnnotatorsData.data);
    // const orgId = workspaceAnnotators &&  workspaceAnnotators
    console.log("workspaceAnnotators", workspaceAnnotators);


   

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
            name: "Role",
            label: "Role",
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
        const data =  workspaceAnnotators && workspaceAnnotators.length > 0 ? workspaceAnnotators.map((el,i)=>{
            const userRole = UserMappedByRole(el.role).element;
            return [
                        el.username, 
                        el.email,
                        el.role,
                       
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
        }) :[];

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