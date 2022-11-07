import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../component/common/Button'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
// import WorkspaceTable from "../common/WorkspaceTable";
import GetWorkspaceAPI from "../../../../redux/actions/api/Organization/GetWorkspace";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { ThemeProvider, Grid } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import DatasetStyle from "../../../styles/Dataset";
import Search from "../../component/common/Search";


const WorkspaceTable = (props) => {
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const { showManager, showCreatedBy } = props;
    const workspaceData = useSelector(state => state.GetWorkspace.data);
    const SearchWorkspace = useSelector((state) => state.SearchProjectCards.data);

    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [currentRowPerPage, setCurrentRowPerPage] = useState(10);
    const [totalWorkspaces, setTotalWorkspaces] = useState(10);

    const totalWorkspaceCount = useSelector(state => state.GetWorkspace.data.count);

    const getWorkspaceData = () => {
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

    useEffect(() => {
        getWorkspaceData();
    }, []);

    const pageSearch = () => {

        return workspaceData.filter((el) => {

            if (SearchWorkspace == "") {

                return el;
            } else if (
                el.workspace_name
                    ?.toLowerCase()
                    .includes(SearchWorkspace?.toLowerCase())
            ) {

                return el;
            }
            else if (
                el.managers?.some(val => val.username
                    ?.toLowerCase().includes(SearchWorkspace?.toLowerCase()) ))           
                    
                 {

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
                align: "center",
                setCellHeaderProps: sort => ({ style: { height: "70px", padding: "16px" } }),
            }
        },
        {
            name: "Manager",
            label: "Manager",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showManager ? "true" : "exclude"
            }
        },
        {
            name: "Created By",
            label: "Created By",
            options: {
                filter: false,
                sort: false,
                align: "center",
                display: showCreatedBy ? "true" : "exclude"
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
      
    
    const data = workspaceData && workspaceData.length > 0 ?pageSearch().map((el, i) => {
        return [
            el.workspace_name,
            el.managers.map((manager, index) => {
                return manager.username
            }).join(", "),
            el.created_by && el.created_by.username,
            <Link to={`/workspaces/${el.id}`} style={{ textDecoration: "none" }}>
                <CustomButton
                    sx={{ borderRadius: 2 }}
                    label="View"
                />
            </Link>
        ]
    })  : [];

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
            <Grid sx={{ mb: 1 }}>
                <Search />
            </Grid>
            {workspaceData && <ThemeProvider theme={tableTheme}>
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>}
        </div>
    )
}

export default WorkspaceTable;