import MyNavbar from "../components/MyNavbar";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import EditIcon from "@material-ui/icons/Edit";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: theme.spacing(2),
  },
  reviewItem: {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    marginRight: theme.spacing(3),
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewBody: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
}));

function Profile() {
  const classes = useStyles();
  const [user, setUser] = React.useState(null);
  const useparam = useParams();
  const navigate = useNavigate();
  const user_id = useparam.id;
  const [editReview, setEditReview] = useState(null);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewBody, setNewReviewBody] = useState("");
  const [refresh_page, setRefreshPage] = useState(false);

  useEffect(() => {
    const userId = user_id ? user_id : localStorage.getItem("userId");
    if (!userId) navigate("/login");
    console.log("Sending request to get user with id: " + userId);

    async function fetchUser(userId) {
      console.log("Calling fetchUser");
      await fetch("http://localhost:3001/api/customer/" + userId)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) navigate("/login");
          const reviews = data.reviews.map((review) => {
            return {
              product_title: review.product_title,
              productId: review.product_id,
              body: review.r.review_body,
              date: review.r.review_date,
              title: review.r.review_headline,
              rating: review.r.review_rating,
              id: review.r.review_id,
            };
          });
          console.log("reviews", reviews);
          setUser({
            name: data.customer.name,
            email: data.customer.email,
            reviews: reviews,
            id: data.customer.customer_id,
          });
        })
        .catch((err) => {
          console.log("Error: " + err);
          return null;
        });
    }
    fetchUser(userId);
  }, [user_id, navigate, refresh_page]);

  if (!user) return null; // TODO: Fix this Suspense or loading here

  //delete review function here knnowing route and params are  "http://localhost:3001/api/costumer/:customer_id/:product_id/deleteReview/:review_id'
  async function handleDeleteReview(review) {
    await fetch( "http://localhost:3001/api/customer/deleteReview/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        review: review,
        customer_id: user.id,
        product_id: review.productId,
        review_id: review.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setUser(data);
        setRefreshPage(!refresh_page);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  };

  

  const handleEditReview = (review) => {
    setEditReview(review);
    setNewReviewTitle(review.title);
    setNewReviewBody(review.body);
  };

  const handleCloseEditDialog = () => {
    setEditReview(null);
  };

  const handleSaveEdit = () => {
    const editedReview = {
      ...editReview,
      title: newReviewTitle,
      body: newReviewBody,
    };

    const updatedReviews = user.reviews.map((review) =>
      review.date === editedReview.date ? editedReview : review
    );

    user.reviews = updatedReviews;

    handleCloseEditDialog();
  };

  return (
    <>
      <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
      <div className={classes.root}>
        <Avatar
          alt={user.name}
          src={user.avatarUrl}
          className={classes.avatar}
        />
        <Typography variant="h4">{user.name}</Typography>
        <Typography variant="subtitle1">{user.email}</Typography>
        <List>
          {user.reviews.map((review) => (
            <ListItem key={review.date} className={classes.reviewItem}>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    className={classes.reviewTitle}
                  >
                    {review.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" className={classes.reviewBody}>
                    {review.body}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleEditReview(review)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteReview(review)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Dialog open={Boolean(editReview)} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Title"
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
            />
            <TextField
              aria-label="body"
              placeholder="Write your review"
              multiline
              minRows={8}
              fullWidth
              value={newReviewBody}
              onChange={(e) => setNewReviewBody(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default Profile;
