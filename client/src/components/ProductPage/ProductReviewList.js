import { List } from "@material-ui/core";
import React from "react";
import { ReviewCard } from "./ReviewCard";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    }
}));


export const ProductReviewList = ({ reviews }) => {
    const classes = useStyles();
    if(reviews === undefined) return null;

    return (
        <List component="nav" aria-label="main mailbox folders" className={classes.root} variant="outlined">
            {reviews.map((review) => (
                <ReviewCard review={review} key={review.review_id} />
            ))}
        </List>
    );
};
