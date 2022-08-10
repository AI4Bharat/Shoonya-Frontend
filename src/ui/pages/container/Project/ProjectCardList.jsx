import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import MUIDataTable from "mui-datatables";
import GetWorkspacesManagersDataAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceManagers";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from "../../component/common/Button";
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import GetProjectsAPI from "../../../../redux/actions/api/Dashboard/GetProjects";
import Spinner from "../../component/common/Spinner";

const ProjectCardList = (props) => {
const{projectData}= props
    
    const [loading, setLoading] = useState(false);
    const apiLoading = useSelector(state => state.apiStatus.loading);
    //  const projectData = useSelector(state => state.getProjects.data);
    // const getDashboardprojectData = () => {
    //      setLoading(true);
    //     const projectObj = new GetProjectsAPI();
    //     dispatch(APITransport(projectObj));
    // }


    // useEffect(() => {
    //     getDashboardprojectData();

    // }, []);
    useEffect(() => {
        setLoading(false);
    }, [projectData])
    
    const columns = [
        {
            name: "Project_id",
            label: "Project Id",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },
        {
            name: "Project_Title",
            label: "Project Title",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },


        {
            name: "project_Type",
            label: "project Type",
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: "Project_mode",
            label: "Project mode",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },
        {
            name: "Action",
            label: "Action",
            options: {
                filter: false,
                sort: false,
                align: "center"
            }
        },

    ];



    const data = projectData && projectData.length > 0 ? projectData.map((el, i) => {
        return [
            el.id,
            el.title,
            el.project_type,
            el.project_mode,
            <Link to={`/projects/${el.id}`} style={{ textDecoration: "none" }}>
            <CustomButton
                sx={{ borderRadius: 2, marginRight: 2 }}
                label="View"
            />
       </Link>
       
        ]
    }) 
    : [];

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
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>

        </div>

    )
}

export default ProjectCardList;