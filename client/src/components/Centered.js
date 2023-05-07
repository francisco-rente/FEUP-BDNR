import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

function Centered ({ title, content, cardProps }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '95vh',
        padding: '5vh 0'
      }}
    >
      <Box bgcolor="white" sx={{ display: 'flex', flexDirection: 'column', margin: 'auto', borderRadius: 5, p: 5, width: '90vw', ...cardProps }}>
        <Typography variant="h5" sx={{ marginTop: 1, marginBottom: 1, fontWeight: 'bold', textAlign: 'left' }}>
          {title}
        </Typography>
        {content}
      </Box>
    </Box>
  );
}

Centered.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  cardProps: PropTypes.object
};

export default Centered;
