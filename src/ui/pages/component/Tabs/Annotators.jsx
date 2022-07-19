import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import {useDispatch,useSelector} from 'react-redux';
import GetWorkspacesAnnotatorsDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceAnnotators";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole";
import CustomButton from "../common/Button";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

const AnnotatorsTable = (props) => {
    const dispatch = useDispatch();
    
    const {id} = useParams();
    
    const orgId = useSelector(state=>state.getWorkspacesProjectData.data[0].organization_id);

    const getWorkspaceAnnotatorsData = ()=>{
        
        const workspaceObjs = new GetWorkspacesAnnotatorsDataAPI(id);
       
        dispatch(APITransport(workspaceObjs));
    }

    const workspaceAnnotators = useSelector(state=>state.getWorkspacesAnnotatorsData.data);

    useEffect(()=>{
        getWorkspaceAnnotatorsData();
    },[]);
    // const orgId = workspaceAnnotators &&  workspaceAnnotators
// getWorkspacesProjectData

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
            const userRole = el.role && UserMappedByRole(el.role).element;
            console.log("userRole", userRole);
            return [
                        el.username, 
                        el.email,
                        userRole ? userRole : el.role,
                        // userRole ? userRole : el.role,
                        // el.role,
                        <Link to={`/profile/${el.id}`} style={{ textDecoration: "none" }}>
                            <CustomButton
                                sx={{borderRadius : 2,marginRight: 2}}
                                label = "View"
                            />
                            <CustomButton
                                sx={{borderRadius : 2,backgroundColor:"#cf5959"}}
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
            jumpToPage: true,
          };

    return (
        <div>
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

export default AnnotatorsTable;