import React, { useState, useEffect } from "react";
import CustomButton from '../../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesProjectDetailsAPI from "../../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceProject";
import APITransport from '../../../../../redux/actions/apitransport/apitransport';
import {useDispatch,useSelector} from 'react-redux';

const ProjectTable = (props) => {
   
    const dispatch = useDispatch();
    
    const {id} = useParams();
    const getWorkspaceProjectData = ()=>{
        
        const workspaceObjs = new GetWorkspacesProjectDetailsAPI(id);
       
        dispatch(APITransport(workspaceObjs));
    }
    
    useEffect(()=>{
        getWorkspaceProjectData();
    },[]);

    const workspacesproject = useSelector(state=>state.getWorkspacesProjectData.data);

    console.log("workspacesproject", workspacesproject);
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
            name: "Created By",
            label: "Created By",
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
                align : "center"
            }
        }];

        // const data = [
        //     ["Shoonya User", "user123@tarento.com", 0, ]
        // ];
        const data = workspacesproject && workspacesproject.length > 0 ? workspacesproject.map((el,i)=>{
            return [
                        el.title, 
                        el.created_by && el.created_by.username,
                        // <Link  style={{ textDecoration: "none" }}>
                            <CustomButton
                                sx={{borderRadius : 2}}
                                label = "View"
                            />
                        // </Link>
            ]
        }) : [];

        console.log("data values", data);

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

export default ProjectTable;