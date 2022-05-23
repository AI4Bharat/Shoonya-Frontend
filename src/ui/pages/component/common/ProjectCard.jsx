import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Divider, ThemeProvider } from '@mui/material';
import themeDefault from '../../../theme/theme';

const ProjectCard = () => {
    return (
        <ThemeProvider theme={themeDefault}>
            <Typography style={{marginBottom : "10px"}} variant='body1'>Projects</Typography>
            <Card
                sx={{
                    width: 400,
                    padding : 2,
                    minHeight : 100,
                }}
            >
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Project Demo
                    </Typography>
                    <Divider />
                    <Typography gutterBottom variant="lightText" component="div" >
                        Project Type
                    </Typography>
                    <Divider />
                    <Typography gutterBottom variant="subtitle2" component="div" >
                        Project Description
                    </Typography>
                </CardContent>
            </Card>
        </ThemeProvider>

    )
}

export default ProjectCard;