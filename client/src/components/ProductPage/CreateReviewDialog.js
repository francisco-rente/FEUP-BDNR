import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextareaAutosize,
    TextField,
} from "@material-ui/core";

import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

export const CreateReviewDialog = ({ open, onClose, setRefreshReviews, product_id }) => {
    const [review_headline, setReviewHeadline] = useState("");
    const [review_body, setReviewBody] = useState("");
    const [star_rating, setStarRating] = useState(0);

    
    async function handleSubmit(event) {
        event.preventDefault();
        const query = "http://localhost:3001/api/product/" + product_id + "/addReview";
        const userId = localStorage.getItem("userId");
        if(userId === null) return;

        const data = {
            review_headline: review_headline,
            review_body: review_body,
            star_rating: star_rating,
            user_id: userId,
        };

        await fetch(query, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status === 200) {
                setRefreshReviews(true);
                console.log("Review created successfully");
            } else {
                console.log("Failed to create review");
                setReviewBody("");
                setReviewHeadline("");
                setStarRating(0);
            }
        });
        // eliminate state contents
        setReviewHeadline("");
        setReviewBody("");
        setStarRating(0);
        onClose();
    }


    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <form onSubmit={handleSubmit} noValidate>
                <DialogTitle id="form-dialog-title">Create Review</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                    >
                    <TextField
                        autoFocus
                        value={review_headline}
                        margin="dense"
                        id="review_headline"
                        label="Review Headline"
                        type="text"
                        name="review_headline"
                        fullWidth
                        onChange={(e) => setReviewHeadline(e.target.value)}
                    />
                    <TextareaAutosize
                        autoFocus
                        value={review_body}
                        variant="outlined"
                        margin="dense"
                        mt={2}
                        id="review_body"
                        label="Review Body"
                        type="text"
                        placeholder="Write your review here"
                        style={{ width: 300, height: 100 }}
                        name="review_body"
                        fullWidth
                        minRows={3}
                        minColumns={100}
                        onChange={(e) => setReviewBody(e.target.value)}
                    />
                    <Rating
                        name="simple-controlled"
                        value={star_rating}
                            onChange={(event, newValue) => {
                            setStarRating(newValue);
                        }}
                    />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary" type="submit">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
