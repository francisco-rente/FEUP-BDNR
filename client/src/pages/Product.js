import MyNavbar from "../components/MyNavbar";
import {Fragment, useState,useLayoutEffect, useEffect} from "react";
import { useParams } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, CardActions, Button, Grid } from '@material-ui/core';
import {List, ListItem, ListItemText} from '@material-ui/core';

const ProductInfoCard = ({ product }) => {
    const {product_title, product_category, marketplace} = product;
    console.log("product", product);
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {product_title}
                </Typography>
                <Typography variant="body2" component="p">
                    {product_category}
                </Typography>
                <Typography variant="body2" component="p">
                    {marketplace}
                </Typography>
            </CardContent>
        </Card>
    );
};



const ProductReviewList = (props) => {
    const { reviews } = props;
    console.log("reviews", reviews);
    if(reviews === undefined) return null;
    //TODO: this works for now, but is weird and should be turned into a loading screen
    return (
        <List>
            {reviews.map((review) => (
                <ReviewListItem key={review.review_id} review={review} />
            ))}
        </List>
    );
};


const ReviewListItem = ({ review }) => {
    const {review_headline, review_body, star_rating, review_date} = review;
    const classes = makeStyles((theme) => ({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        }
    }));
    const stars = Array.from({length: star_rating}, () => <span>&#9733;</span>); 
    return (
        <ListItem>
            <ListItemText primary={review_headline} secondary={review_body} />
            <ListItemText primary={stars} secondary={review_date} />
        </ListItem>
    );
};



const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    useLayoutEffect( () => async () => {
        const query = "http://localhost:3001/api/product/" + id; 
        await fetch(query).then((res) => res.json())
            .then((data) => setProduct(data.content))
            .catch((err) => console.log("err", err)); 
    }, []);
    
    

    return (
        <Fragment>
            <MyNavbar hasSearchBar={false} style={{height:"50px"}}></MyNavbar>
            <Typography variant="h6">Product Details:</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <ProductInfoCard product={product} />
                </Grid>
                <Grid item xs={12} sm={6}>
                   <ProductReviewList reviews={product.reviews} />
                </Grid>
            </Grid>
        </Fragment>
    );};

export default Product;
