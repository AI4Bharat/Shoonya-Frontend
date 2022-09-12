import React, { useState, useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux';
import CustomButton from '../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
// import WorkspaceTable from "../common/WorkspaceTable";
import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";


const WorkspaceTable = (props) => {

    const dispatch = useDispatch();
    const  {showManager, showCreatedBy} = props;
    const workspaceData = useSelector(state=>state.GetWorkspace.data.results);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [totalWorkspaces, setTotalWorkspaces] = useState(10);

    const totalWorkspaceCount = useSelector(state =>state.GetWorkspace.data.count);
   
    const getWorkspaceData = ()=>{
        const workspaceObj = new GetWorkspaceAPI(currentPageNumber);
        dispatch(APITransport(workspaceObj));
      }

      useEffect(() => {
        getWorkspaceData();
        console.log("fired now")
    }, [currentPageNumber]);

    // useEffect(() => {
    //     getWorkspaceData();
    // }, [currentRowPerPage]);
      
      useEffect(()=>{
        getWorkspaceData();
      },[]);

    const columns = [
        {
            name: "Name",
            label: "Name",
            options: {
                filter: false,
                sort: false,
                align : "center",
            }
        },
        {
            name: "Manager",
            label: "Manager",
            options: {
                filter: false,
                sort: false,
                align : "center",
                display : showManager ? "true" : "exclude"
            }
        },
        {
            name: "Created By",
            label: "Created By",
            options: {
                filter: false,
                sort: false,
                align : "center",
                display : showCreatedBy ? "true": "exclude"
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

        const data = workspaceData && workspaceData.map((el,i)=>{
            return [
                        el.workspace_name, 
                        el.managers.map((manager,index)=>{
                            return manager.username
                        }).join(", "),
                        el.created_by && el.created_by.username,
                        <Link to={`/workspaces/${el.id}`}  style={{ textDecoration: "none" }}>
                            <CustomButton
                                sx={{borderRadius : 2}}
                                label = "View"
                            />
                        </Link>
                    ]
        });

        const options = {
            count: totalWorkspaceCount,
            rowsPerPage: currentRowPerPage,
            page: currentPageNumber - 1,
            rowsPerPageOptions: [],
            textLabels: {
                pagination: {
                    next: "Next >",
                    previous: "< Previous",
                    rowsPerPage: "currentRowPerPage",
                    displayRows: "OF"
                }
            },
            onChangePage: (currentPage) => setCurrentPageNumber(currentPage + 1),
            // onChangeRowsPerPage: (rowPerPageCount) => { setCurrentRowPerPage(rowPerPageCount); console.log("rowPerPageCount", rowPerPageCount) },
            filterType: 'checkbox',
            selectableRows: "none",
            download: false,
            filter: false,
            print: false,
            search: false,
            viewColumns: false,
            textLabels: {
                body: {
                    noMatch: "No records ",
                },
                toolbar: {
                    search: "Search",
                    viewColumns: "View Column",
                },
                pagination: {
                    rowsPerPage: "",
                },
                options: { sortDirection: "desc" },
            },
            jumpToPage: true,
            serverSide: true,
            // customToolbar: renderToolBar,
        };

    return (
        <div>
            {workspaceData && <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    // title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>}
        </div>
    )
}

export default WorkspaceTable;