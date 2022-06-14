import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import { ThemeProvider } from '@mui/material';
import themeDefault from '../../../theme/theme';
// import { workspaceData } from '../../../../constants/workspaceData/workspaceData';
import {useDispatch,useSelector} from 'react-redux';
import CustomButton from '../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";


const WorkspaceTable = (props) => {
   
    const  {workspaceData,} = props;

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
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
            }
        }];

        const data = workspaceData.map((el,i)=>{
            return [
                        el.workspace_name, 
                        <Link to={`/workspaces/${el.id}`}  style={{ textDecoration: "none" }}>
                            <CustomButton
                                sx={{borderRadius : 2}}
                                label = "View"
                            />
                        </Link>
                    ]
        });

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
            // onTableChange: (action, tableState) => {
            //   switch (action) {
            //     case "changePage":
            //       processTableClickedNextOrPrevious(tableState.page);
            //       break;
            //     case "changeRowsPerPage":
            //       dispatch(
            //         RowChange(tableState.rowsPerPage, C.SEARCH_ROW_COUNT_CHANGE)
            //       );
            //       break;
            //     default:
            //   }
            // },
        
            // onRowClick: (rowData, rowMeta) => rowData[3] && renderAction(rowData),
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

export default WorkspaceTable;