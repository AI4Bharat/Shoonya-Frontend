import { Card, Grid, ThemeProvider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import OutlinedTextField from "../common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import GetProjectDetailsAPI from "../../../../redux/actions/api/ProjectDetails/GetProjectDetails";
import APITransport from '../../../../redux/actions/apitransport/apitransport';
import GetSaveButtonAPI from '../../../../redux/actions/api/ProjectDetails/EditUpdate'
import GetLanguageChoicesAPI from "../../../../redux/actions/api/ProjectDetails/GetLanguageChoices";
import CustomButton from "../common/Button";
import MenuItems from "../common/MenuItems";
import CustomizedSnackbars from "../common/Snackbar";
import Spinner from "../common/Spinner";
import Autocomplete from "../common/Autocomplete"



const BasicSettings = (props) => {
    const [snackbar, setSnackbarInfo] = useState({
        open: false,
        message: "",
        variant: "success",
    });
    const [value, setValue] = useState();
    const [showLanguage, setShowLanguage] = useState(false);
    const [sourceLanguage, setSourceLanguage] = useState("");
    const [targetLanguage, setTargetLanguage] = useState("");
    const [languageOptions, setLanguageOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newDetails, setNewDetails] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const classes = DatasetStyle();
    const dispatch = useDispatch();
    const apiLoading = useSelector(state => state.apiStatus.loading);
    const ProjectDetails = useSelector(state => state.getProjectDetails.data);
    console.log(ProjectDetails, "ProjectDetails")
    console.log(targetLanguage,"targetLanguage")
    const getProjectDetails = () => {
        const projectObj = new GetProjectDetailsAPI(id);
        dispatch(APITransport(projectObj));
    }

   

    useEffect(() => {
        getProjectDetails();
    }, []);


    useEffect(() => {
        if (ProjectDetails.project_type === "MonolingualTranslation" || ProjectDetails.project_type === "TranslationEditing" || ProjectDetails.project_type === "ContextualTranslationEditing") {
            getLanguageChoices();
            setShowLanguage(true);
        }
       
    }, [ProjectDetails]);



    useEffect(() => {
        setNewDetails({
            title: ProjectDetails.title,
            description: ProjectDetails.description,
           

        });
        setTargetLanguage(ProjectDetails?.tgt_language)
    }, [ProjectDetails]);
    console.log(targetLanguage,"cccccccccccccc")
    const LanguageChoices = useSelector((state) => state.getLanguageChoices.data);

    const getLanguageChoices = () => {
        const langObj = new GetLanguageChoicesAPI();
        dispatch(APITransport(langObj));
    };

    useEffect(() => {
        if (LanguageChoices && LanguageChoices.length > 0) {
            let temp = [];
            LanguageChoices.forEach((element) => {
                temp.push({
                    name: element[0],
                    value: element[0],
                });
            });
            setLanguageOptions(temp);
        }
    }, [LanguageChoices]);



    const handleSave = async () => {

        const sendData = {
            title: newDetails.title,
            description: newDetails.description,
            tgt_language: targetLanguage,
            src_language: sourceLanguage,
            project_type: ProjectDetails.project_type,
            project_mode: ProjectDetails.project_mode,
            users: ProjectDetails.users,
            annotation_reviewers: ProjectDetails.annotation_reviewers,
        }
        const projectObj = new GetSaveButtonAPI(id, sendData);
        dispatch(APITransport(projectObj));
        const res = await fetch(projectObj.apiEndPoint(), {
            method: "PUT",
            body: JSON.stringify(projectObj.getBody()),
            headers: projectObj.getHeaders().headers,
        });
        const resp = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbarInfo({
                open: true,
                message: "success",
                variant: "success",
            })

        } else {
            setSnackbarInfo({
                open: true,
                message: resp?.message,
                variant: "error",
            })
        }

    }

    function snakeToTitleCase(str) {
        return str.split("_").map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(" ");
    }
    useEffect(() => {
        setLoading(apiLoading);
    }, [apiLoading])

    const handleProjectName = (event) => {
       
        event.preventDefault();
        setNewDetails((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }
   
   const handletargetLanguage = (event)=>{
       event.preventDefault();
       console.log(event.target.name,"event.target.name",event.target.value)
   
    setTargetLanguage({
        
        [event.target.name]: event.target.value,
    });
   
   }
    console.log(targetLanguage,"targetLanguage")

    const renderSnackBar = () => {
        return (
            <CustomizedSnackbars
                open={snackbar.open}
                handleClose={() =>
                    setSnackbarInfo({ open: false, message: "", variant: "" })
                }
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                variant={snackbar.variant}
                message={snackbar.message}
            />
        );
    };

    return (
        <ThemeProvider theme={themeDefault}>

            {/* <Header /> */}
            {loading && <Spinner />}
            <Grid>
                {renderSnackBar()}

            </Grid>

            <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            // justifyContent: "space-between",
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >
                            <Typography variant="body2" fontWeight='700'  label="Required">
                                Project Name 
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
                                name="title"
                                InputProps={{ style: { fontSize: "14px" } }}
                                // value={ProjectDetails.title}
                                value={newDetails?.title}
                                onChange={handleProjectName} />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction='row'
                        sx={{
                            alignItems: "center",
                            // justifyContent: "space-between",
                            mt: 2
                        }}
                    >
                        <Grid
                            items
                            xs={12}
                            sm={12}
                            md={12}
                            lg={2}
                            xl={2}
                        >

                            <Typography variant="body2" fontWeight='700'>
                                Project Description 
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
                                name="description"
                                InputProps={{ style: { fontSize: "14px" } }}
                                value={newDetails?.description}
                                onChange={handleProjectName}
                            />
                        </Grid>
                    </Grid>
                    {showLanguage && (
                        <>
                            <Grid
                                container
                                direction='row'
                                sx={{
                                    alignItems: "center",
                                    // justifyContent: "space-between",
                                    mt: 2
                                }}
                            >
                                <Grid
                                    items
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={2}
                                    xl={2}
                                >
                                    <Typography variant="body2" fontWeight='700' label="Required">
                                        Source Language
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
                                  <Autocomplete
                                options={languageOptions}
                               
                                />
                                </Grid>
                            </Grid>
                            <Grid
                                container
                                direction='row'
                                sx={{
                                    alignItems: "center",
                                    // justifyContent: "space-between",
                                    mt: 2
                                }}
                            >
                                <Grid
                                    items
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={2}
                                    xl={2}
                                >
                                    <Typography variant="body2" fontWeight='700' label="Required">
                                        Target Language
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
                                   <Autocomplete
                                   name="tgt_language"
                                options={languageOptions.map(options=>options.name)}
                               value={targetLanguage}
                               onChange={handletargetLanguage}
                                />
                                </Grid>
                                
                            </Grid>
                        </>)}
                    <Grid
                        container
                        xs={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sm={12}
                        sx={{ 
                            m: 7,
                            justifyContent: "center",
                            
                        }}
                    >
                        <CustomButton sx={{ inlineSize: "max-content" ,marginRight:"10px",width:"80px"}}
                            onClick={() => navigate(`/projects/:id/`)}
                            label="Cancel" />
                        <CustomButton sx={{ inlineSize: "max-content",width:"80px" }}
                            onClick={handleSave}
                            label="Save" />
                    </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default BasicSettings;