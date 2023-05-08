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



export const CreateReviewDialog = ({ open, onClose, id }) => {
    const [review_headline, setReviewHeadline] = useState("");
    const [review_body, setReviewBody] = useState("");
    const [star_rating, setStarRating] = useState(0);


    function handleSubmit(event) {
        event.preventDefault();
        const query = "http://localhost:3001/api/product/" + id + "/addReview";
        const data = {
            review_headline: review_headline,
            review_body: review_body,
            star_rating: star_rating,
            user_id: localStorage.getItem("userId")
        };

        console.log("data", data);
        fetch(query, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.status === 200) {
                console.log("Review created successfully");
            } else {
                console.log("Failed to create review");
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
                    <DialogContentText>
                        To create a review, please enter the following information here. 
                    </DialogContentText>
                    <TextField
                        autoFocus
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
                        margin="dense"
                        mt={2}
                        id="review_body"
                        label="Review Body"
                        type="text"
                        placeholder="Empty"
                        style={{ width: 300, height: 100 }}
                        name="review_body"
                        fullWidth
                        onChange={(e) => setReviewBody(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="star_rating"
                        label="Star Rating"
                        type="number"
                        name="star_rating"
                        fullWidth
                        inputProps={{ min: "1", max: "5", step: "1" }}
                        onChange={(e) => setStarRating(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button  color="primary" type="submit">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
