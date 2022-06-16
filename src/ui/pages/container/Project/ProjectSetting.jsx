import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetSaveButtonAPI from '../../../../redux/actions/api/ProjectDetails/EditUpdate'
import GetExportProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetExportProject';
import GetPublishProjectButtonAPI from '../../../../redux/actions/api/ProjectDetails/GetPublishProject';


const ProjectSetting = (props) => {
    const [projectData, setProjectData] = useState([
        { name: "Project ID", value: null },
        { name: "Description", value: null },
        { name: "Project Type", value: null },
        { name: "Status", value: null },
    ])
       const { id } = useParams();
      
    const classes = DatasetStyle();
    const dispatch = useDispatch();

    
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);

    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);

        dispatch(APITransport(projectObj));
    }

    useEffect(() => {
        getProjectDetails();
       
    }, []);
    console.log(ProjectDetails,"ProjectDetails")



  

    const getSaveButtonAPI = () => {
        const projectObj = new GetSaveButtonAPI(id,ProjectDetails);

        dispatch(APITransport(projectObj));
    }
    useEffect(() => {
        getSaveButtonAPI()
       
    }, []);

    
   

    

    const getExportProjectButton = () => {
        const projectObj = new GetExportProjectButtonAPI(id);

        dispatch(APITransport(projectObj));
    }
    useEffect(() => {
        getExportProjectButton() 
       
    }, []);

    const publishProject = useSelector(state => state.getPublishProjectButton.data);

    const getPublishProjectButton = () => {
        const projectObj = new GetPublishProjectButtonAPI(id);

        dispatch(APITransport(projectObj));
    }
    useEffect(() => {
        getPublishProjectButton() 
       
    }, []);
    
    const handleSave =() =>{
        getSaveButtonAPI()
    }
   const handleExportProject = ()=>{
    getExportProjectButton();
   }
   const handlePublishProject=()=>{
    getPublishProjectButton()
   }

   const handlePullNewData =()=>{
  
   }
   
  console.log(props,"processResponse")
    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
                
            >
                <Card
                    sx={{
                        width: window.innerWidth * 0.8,
                        minHeight: 500,
                        padding: 5
                    }}

                >

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                    >
                        <Typography variant="h2" gutterBottom component="div">
                            Project Settings
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{margin: "38px 0px 30px 0px"}}
                    >
                        <Typography variant="h4" gutterBottom component="div"  >
                            Basic Settings
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >
                            <Typography gutterBottom component="div" label="Required">
                                Project Name :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField fullWidth value={ProjectDetails.title} /> 
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        style={{ margin: "20px 0px 0px 0px" }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >

                            <Typography gutterBottom component="div">
                                Project Description :
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={12}
                            lg={9}
                            xl={9}
                            sm={12}
                        >
                            <OutlinedTextField
                                fullWidth
                                value={ProjectDetails.description}
                            />
                        </Grid>
                    </Grid>
                    <Grid

                        style={{ margin: "15px 0px 10px 0px", }}
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Button
                            style={{padding: "0px 25px 0px 25px"}}
                            onClick={handleSave}
                            label="Save" />
                             
                    </Grid>
                  
                   
                    <Grid
                        container
                        direction='row'
                        spacing={2}
                        sx={{
                            maxWidth: " 70%",
                            "@media (max-width:650px)": {

                                maxWidth: " 100%"
                            },
                        }}


                    >
                       
                        
                    </Grid>
                  
                    <Grid
                        container
                        direction='row'
                        spacing={2}
                        sx={{ maxWidth: " 100%" ,margin: "15px 0px 0px 0px"}}


                    >
                          <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h4" gutterBottom component="div" style={{ margin: "15px 0px 0px 0px", }}>
                            Advanced Operation
                        </Typography>
                    </Grid>
                         <Grid
                            sx={{
                                marginTop: 2,
                                marginRight: "-50px"
                            }}
                            item
                            xs={6}
                            md={6}
                            lg={2}
                            xl={2}
                            sm={6}
                        >
                            <Button onClick={handlePublishProject} style={{ lineHeight: "16.3px",     }} label="Publish Project" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={2}
                            xl={2}
                            sm={12}
                        >
                            <Button onClick={handleExportProject} style={{ lineHeight: "16.3px" }} label="Export Project into Dataset" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2,
                                marginRight: "-50px"
                            }}
                            item
                            xs={6}
                            md={6}
                            lg={2}
                            xl={2}
                            sm={6}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Archive Project" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2,
                                lineHeight: 2,
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={2}
                            xl={2}
                            sm={12}
                        >
                            <Button onClick={handlePullNewData} style={{ lineHeight: "16.3px",padding: "0px" }} label="Pull New Data Items from Source Dataset" />
                        </Grid>
                        <Grid
                            sx={{
                                marginTop: 2
                            }}
                            item
                            xs={12}
                            md={12}
                            lg={2}
                            xl={2}
                            sm={12}
                        >
                            <Button style={{ lineHeight: "16.3px" }} label="Download project" />

                        </Grid>
                        </Grid>
                        <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h3" gutterBottom component="div" style={{ margin: "35px 0px 10px 0px", }}>
                            Read-only Configurations
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography variant="h5" gutterBottom component="div" style={{ margin: "15px 0px 10px 0px", }}>
                            Sampling Parameters
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                    >
                        <Typography  gutterBottom component="div" style={{ margin: "15px 0px 10px 0px", }}>
                            Sampling Mode :
                        </Typography>
                    </Grid>
                </Card>
            </Grid>
        </ThemeProvider>
    )
}

export default ProjectSetting;