import { Box, Card, Grid, Tab, Tabs, ThemeProvider, Typography } from "@mui/material";
import React, { useState } from "react";
import Header from "../../component/common/Header";
import themeDefault from '../../../theme/theme'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from "../../component/common/Button"
import OutlinedTextField from "../../component/common/OutlinedTextField";
import DatasetStyle from "../../../styles/Dataset";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import StandardTextField from "../../component/common/StandardTextField";
import NativeSelect from '@mui/material/NativeSelect';
import MenuItems from "../../component/common/MenuItems";

let data1 = [{ name: "Translation", value: "Translation" }, { name: "OCR", value: "OCR" }, { name: "Monolingual", value: "Monolingual" }]
let data2 = [{ name: "MonolingualTranslation", value: "MonolingualTranslation" }, { name: "TranslationEditing", value: "TranslationEditing" }, { name: "ContextualTranslationEditing", value: "ContextualTranslationEditing" }]
const ProjectSetting = (props) => {

    const classes = DatasetStyle();
    const [selectmenu, setselectmenu] = React.useState('');
    const [selectvalue, setselectvalue] = useState(false)
    const [values, setValues] = useState("")
    const [valuesdata, setValuesdata] = useState("")

    const handleChange = (event) => {
        setselectmenu(event.target.value);
    };

    const selectdata = (e) => {
        setValuesdata(e)
    }

    const selectDatas = (e) => {
        console.log(e, "e")
        setValues(e)
    }
    console.log(values, "value")
    return (
        <ThemeProvider theme={themeDefault}>

            <Header />
            <Grid
                container
                direction='row'
                justifyContent='left'
                alignItems='left'


            >
                <Grid
                    item
                    xs={5}
                    sm={5}
                    md={5}
                    lg={5}
                    xl={5}
                >
                    <Grid
                        container
                        direction='row'
                        style={{ boxShadow: "4px 4px 4px -4px #00000029" }}
                    >
                        <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            lg={2}
                            xl={2}
                        ></Grid>
                        <Grid
                            item
                            xs={9}
                            sm={9}
                            md={9}
                            lg={9}
                            xl={9}
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

                                    Create a Project
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
                                    lg={12}
                                    xl={12}
                                >
                                    <Typography gutterBottom component="div" label="Required">
                                        Title:
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <StandardTextField
                                        fullWidth


                                    />
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
                                    lg={12}
                                    xl={12}
                                >

                                    <Typography gutterBottom component="div">
                                        Description:
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
                                    <StandardTextField
                                        fullWidth


                                    />
                                </Grid>

                                <Grid
                                    items
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                >

                                    <Typography gutterBottom component="div">
                                        Select a domain to work in:
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

                                    <MenuItems
                                        menuOptions={data1}
                                        handleChange={selectDatas}
                                        value={values}
                                    />
                                </Grid>

                            </Grid>
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                            >
                                {values !== "" && (
                                    <Typography gutterBottom component="div">
                                       Select a Project Type:
                                    </Typography>)}
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                xl={12}
                                sm={12}
                            >
                                {values !== "" && (<MenuItems
                                    menuOptions={data2}
                                    handleChange={selectdata}
                                    value={valuesdata}

                                />)}

                            </Grid>
                           
                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                            >
                                {valuesdata !== "" && ( <Typography gutterBottom component="div">
                                    Description:
                                </Typography>)}
                               
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={12}
                                lg={12}
                                xl={12}
                                sm={12}
                            >
                                 {valuesdata !== "" && (
                                      <StandardTextField
                                      fullWidth
  
  
                                  />
                                 )}
                               
                            </Grid>


                            <Grid
                                items
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                            >
                                 {valuesdata !== "" && (<Typography gutterBottom component="div">
                                    Finalize Project
                                </Typography>

                                 )}
                                
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
                                 {valuesdata !== "" && ( <Button label="Confirm Selections" />
                              

                                 )}
                                 {valuesdata !== "" && ( 
                                <Button label="Change Sources" />

                                 )}
                               
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
                                <Button label="Create Project" />
                                <Button label="Cancel" />
                            </Grid>




                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>

    )
}

export default ProjectSetting;