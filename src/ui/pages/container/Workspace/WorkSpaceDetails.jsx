import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, {useEffect } from "react";
import themeDefault from '../../../theme/theme'
import {  useParams } from 'react-router-dom';
import DatasetStyle from "../../../styles/Dataset";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetWorkspacesDetailsAPI from "../../../../redux/actions/api/WorkspaceDetails/GetWorkspaceDetails";
import componentType from "../../../../config/pageType";


import { useDispatch, useSelector } from 'react-redux';
import DetailsViewPage from "../../component/common/DetailsViewPage";



function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const Workspace = (props) => {

    const classes = DatasetStyle();
    const dispatch = useDispatch();
   

    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const {id} = useParams();
    
     
   
   
    const workspaceDtails = useSelector(state=>state.getWorkspaceDetails.data);
    const getWorkspaceDetails = ()=>{
        const workspaceObj = new GetWorkspacesDetailsAPI(id);
        dispatch(APITransport(workspaceObj));
      }
     
      
      useEffect(()=>{
        getWorkspaceDetails();
      },[]);
        
    return (
        <ThemeProvider theme={themeDefault}>
            <DetailsViewPage 
                title={workspaceDtails && workspaceDtails.workspace_name}
                createdBy={workspaceDtails && workspaceDtails.created_by ?.username}
                pageType = {componentType.Type_Workspace}
                onArchiveWorkspace={()=>getWorkspaceDetails()}

            />
        </ThemeProvider>

    )
}

export default Workspace;