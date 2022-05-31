import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Divider, Grid, ThemeProvider } from '@mui/material';
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

    return (
        <Link to={`/projects/1}`} style={{ textDecoration: "none" }}>
            <Grid
                elevation={2}
                className={props.classAssigned}
                sx={{
                    minHeight: 200,
                    width: 350,
                    cursor: "pointer"
                }}
            >
                <Typography variant="h6" sx={{ mt: 2, textAlign: "center", color: "primary.contrastText" }}>{props.projectObj.name}</Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />


                <Typography variant="body2" sx={{ mt: 2, ml: 5, color: "primary.contrastText" }}>{props.projectObj.desc}</Typography>
                <Divider sx={{ mt: 7 }} variant="inset" />
                <Typography variant="subtitle2" sx={{ mt: 1, mr: 2, textAlign: "end", color: "primary.contrastText" }}>{props.projectObj.type}</Typography>
            </Grid>
        </Link>
    )
}

export default ProjectCard;