import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Divider } from '@mui/material';
import Wave from '../../../../assets/Wave.svg';

const UserCard = () => {
    return(
        <Card
        sx={{
          width : 350, 
          backgroundImage : `url(${Wave})`, 
          backgroundRepeat : 'round',
        }}
        >
      <CardContent>
        <Typography gutterBottom variant='h5'>
          Welcome Username!
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Box
          sx={{ border : 1, borderColor : 'error.main', borderRadius : 1, padding : 1}}
        >
          <Typography variant='lightText' color='error.main'>Admin</Typography>
        </Box>
        
      </CardActions>
    </Card>
    )
}

export default UserCard;