import React from 'react';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';


const stars = (star_rating) => Array.from({length: star_rating}, () => <span><StarIcon style={{color: "#FFD700"}}/></span>);


export const ReviewCard = ({ review }) => {
    const {review_headline, review_body, star_rating, review_date, review_id, customer_name, customer_id} = review;
    const navigate = useNavigate();
    const goToUser = () => navigate(`/user/${customer_id}`);

    return (
        <ListItem key={review_id} alignItems="flex-start" divider={true} justifyContent="center">
            <ListItemText primary={
                <React.Fragment>
                    <Typography
                        component="span"
                        variant="body1"
                        color="textPrimary"
                    >
                        {review_headline}
                    </Typography>
                </React.Fragment> 
                } secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body1"
                            color="textSecondary"
                        >
                            {review_body}
                        </Typography>
                        <Button size="small" color="primary" target="_blank" onClick={() => goToUser()} >
                        {` — ${customer_name}`}
                        </Button>
                    </React.Fragment>
                } />
            <ListItemText align="right" 
                primary={stars(star_rating)}
                secondary={review_date} />
        </ListItem>
    );
};


