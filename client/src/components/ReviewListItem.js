import React from 'react';
import { ListItem, ListItemText, Typography, Box } from '@mui/material';

const ReviewListItem = ({ product_id, review }) => {
  const {
    customer_name,
    review_body,
    star_rating,
    review_date,
    verified_purchase,
  } = review;

  return (
    <ListItem alignItems="flex-start" divider>
      <ListItemText 
        primary={
          <Typography variant="subtitle1">
            {customer_name} ({star_rating} stars)
          </Typography>
        }
        secondary={
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" gutterBottom>
              {review_body}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Product: {product_id}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Reviewed on {review_date}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Verified Purchase: {verified_purchase === 'Y' ? 'Yes' : 'No'}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

export default ReviewListItem;