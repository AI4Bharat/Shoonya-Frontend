import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import DatasetStyle from '../../../styles/Dataset';

// const styles = theme => ({
//   progress: {   
//     position:'relative',
//     top:'40%',
//     left:'46%'
           
//   },
//   progressDiv:{
//     position: 'fixed',
//     backgroundColor: 'rgba(0.5, 0, 0, 0.5)',      
//       zIndex: 1000,
//     width:'100%',
//     height:'100%',  
//       top:0,
//     left:0,
//     opacity: 0.4
//   }  
// });



function CircularIndeterminate(props) {
  const classes = DatasetStyle()
  return (
    <div className={classes.progressDiv}>
      <CircularProgress color="primary" size={50} className={classes.progress} />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default CircularIndeterminate;