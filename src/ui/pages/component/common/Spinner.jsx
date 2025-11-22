import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import DatasetStyle from '../../../styles/Dataset';


function CircularIndeterminate(props) {
  const classes = DatasetStyle()
  return (
    <div className={classes.progressDiv}>
      <CircularProgress color="primary" size={50} />
    </div>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default CircularIndeterminate;