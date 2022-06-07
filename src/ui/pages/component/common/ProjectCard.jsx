import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Chip, Divider, Grid, ThemeProvider } from '@mui/material';
import themeDefault from '../../../theme/theme';
import { Link, useNavigate, useParams } from 'react-router-dom';
import projectCardStyles from '../../../styles/projectCard';

const ProjectCard = (props) => {

    let navigate = useNavigate();
    let { id } = useParams();

    // const onCardPress = () => {
    //     navigate('/projects/1');
    // }

    const classes = projectCardStyles();
    const { projectObj, index } = props
    return (
        <Link to={`/projects/1}`} style={{ textDecoration: "none" }}>
            <Grid
                elevation={2}
                className={props.classAssigned}
                sx={{
                    minHeight: 250,
                    cursor: "pointer",
                    borderRadius: 5,
                    p: 2
                }}
            >
                <Typography variant="lightText" sx={{ background: "#FFD981", color : "#0C0F0F", p: 1, borderRadius: 3, fontSize : "0.875rem" }}>{projectObj.status}</Typography>
                <Typography
                    variant="h6"
                    className={classes.modelname}
                    sx={{ 
                            marginTop : 2,
                            color: "secondary.contrastText", 
                            // backgroundColor: "primary.contrastText", 
                            // borderRadius: 3, pt: 1, pb: 1,
                            // height : 64,
                            // alignItems : "center"
                        }}
                >{projectObj.name}
                </Typography>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    sx={{mt:1, mb:2}}
                    spacing={3}
                    columnSpacing={{xs: 1, sm: 1, md: 10}}
                >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                    >
                        <Typography variant="lightText">Type</Typography>
                        <Typography variant="body2" sx={{ color: "primary.contrastText" }}><b>{projectObj.type}</b></Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                    >
                        <Typography variant="lightText">Project ID</Typography>
                        <Typography variant="body2" sx={{ color: "primary.contrastText" }}><b>{projectObj.id}</b></Typography>
                    </Grid>
                </Grid>
                
                <Typography variant="lightText">Description</Typography>
                <Typography variant="body2" sx={{ color: "primary.contrastText" }}><b>{projectObj.desc}</b></Typography>

                {/* <Typography variant="body2" sx={{ mt: 2, ml: 5, color: "primary.contrastText" }}>{projectObj.desc}</Typography> */}
                {/* <Divider sx={{ mt: 7 }} variant="inset" /> */}

            </Grid>
        </Link>
    )
}

export default ProjectCard;