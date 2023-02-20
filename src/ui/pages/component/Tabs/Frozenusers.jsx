import React from 'react'
import MUIDataTable from "mui-datatables";
import { ThemeProvider,Grid } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import CustomButton from "../common/Button";
import {useSelector} from 'react-redux';
import UserMappedByRole from "../../../../utils/UserMappedByRole/UserMappedByRole"



export default function Frozenusers() {
    const ProjectDetails = useSelector((state) => state.getProjectDetails.data);
    
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
    const data =  ProjectDetails?.frozen_users &&  ProjectDetails?.frozen_users.length > 0 ? ProjectDetails?.frozen_users.map((el,i)=>{
        const userRole = el.role && UserMappedByRole(el.role).element;    
            return [
            el.username, 
            el.email,
            userRole ? userRole : el.role,
           <>
           
             <CustomButton
             sx={{borderRadius : 2,backgroundColor:"#cf5959"}}
             label = "Remove"
            //  onClick={()=>handleRemoveWorkspaceManager(el.id)}
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
