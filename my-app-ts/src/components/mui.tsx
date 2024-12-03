import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Mui= () => {
  return (
    <Button variant="contained" color="success" component={Link} to="/home">
      Go to Home
    </Button>
  );
};

export default Mui;
