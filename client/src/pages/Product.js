import MyNavbar from "../components/MyNavbar";
import { Fragment, useState, useLayoutEffect, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  TextareaAutosize,
} from "@material-ui/core";
import { List, ListItem, ListItemText } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@material-ui/core";

const ProductInfoCard = ({ product }) => {
  const { product_title, product_category, marketplace } = product;
  console.log("product", product);
  return (
    <Card variant="outlined">
      <CardContent style={{ height: "100%" }}>
        <Typography variant="h5" component="h2">
          {product_title}
        </Typography>
        <Typography variant="body2" component="p">
          Category: {product_category}
        </Typography>
        <Typography variant="body2" component="p">
          Marketplace {marketplace}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ProductReviewList = ({ reviews }) => {
  if (reviews === undefined) return null;
  //TODO: this works for now, but is weird and should be turned into a loading screen
  return (
    <List
      component="nav"
      aria-label="main mailbox folders"
      style={{ height: "100%", overflow: "auto" }}
    >
      {reviews.map((review) => (
        <ReviewListItem review={review} />
      ))}
    </List>
  );
};

const ReviewListItem = ({ review }) => {
  // TODO: question - does it make sense to include the users as well?
  const { review_headline, review_body, star_rating, review_date, review_id } =
    review;
  const classes = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  // material-ui start
  const stars = Array.from({ length: star_rating }, () => (
    <span>
      <StarIcon style={{ color: "#FFD700" }} />
    </span>
  ));
  return (
    <ListItem
      button
      key={review_id}
      style={{ height: "100%" }}
      variant="outlined"
    >
      <ListItemText primary={review_headline} secondary={review_body} />
      <ListItemText primary={stars} secondary={review_date} />
    </ListItem>
  );
};

const StoreListItem = ({ store }) => {
  const { store_name, store_location, store_contact } = store;
  const { city, country } = store_location;
  const { phone_number, email } = store_contact;
  return (
    <ListItem button>
      <ListItemText primary={store_name} secondary={city + ", " + country} />
      <ListItemText primary={phone_number} secondary={email} />
    </ListItem>
  );
};

const StoreList = ({ stores }) => {
  console.log("stores", stores);
  if (stores === undefined) return null;
  return (
    <List component="nav" aria-label="main mailbox folders">
      {stores.map((store) => (
        <StoreListItem store={store} />
      ))}
    </List>
  );
};

const CreateReviewDialog = ({ open, onClose }) => {
  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log("data", data);
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
          />
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

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [stores, setStores] = useState([]);
  const [openCreateReviewDialog, setOpenCreateReviewDialog] = useState(false);
  useEffect(
    () => async () => {
      const query = "http://localhost:3001/api/product/" + id;
      await fetch(query)
        .then((res) => res.json())
        .then((data) => setProduct(data.content))
        .catch((err) => console.log("err", err));
    },
    []
  );

  useEffect(
    () => async () => {
      const query = "http://localhost:3001/api/product/" + id + "/stores";
      await fetch(query)
        .then((res) => res.json())
        .then((data) => setStores(data.rows))
        .catch((err) => console.log("err", err));
    },
    []
  );

  const handdleClickOpen = () => {
    setOpenCreateReviewDialog(true);
  };

  const handleClose = (action) => {
    setOpenCreateReviewDialog(false);
  };

  return (
    <Fragment>
      <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
      <Typography variant="h6">Product Details:</Typography>
      <Grid container spacing={3} padding={10} mt={10}>
        <Grid item xs={6} sm={6}>
          <ProductInfoCard product={product} />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handdleClickOpen}
          >
            Add Review
          </Button>
          <CreateReviewDialog
            open={openCreateReviewDialog}
            onClose={handleClose}
          />
          <Typography variant="h6">Reviews:</Typography>
          <ProductReviewList reviews={product.reviews} />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography variant="h6">Stores:</Typography>
          <List component="nav" aria-label="main mailbox folders">
            <StoreList stores={stores} />
          </List>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Product;
