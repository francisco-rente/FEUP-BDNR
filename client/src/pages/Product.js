import MyNavbar from "../components/MyNavbar";
import {Fragment, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import {List, ListItem, ListItemText} from '@material-ui/core';
import { ProductReviewList } from "../components/ProductPage/ProductReviewList";
import { StoreList } from "../components/ProductPage/StoreList";
import { ProductInfoCard } from "../components/ProductPage/ProductInfoCard";
import { Button, TextareaAutosize , Box} from "@material-ui/core";
import { CreateReviewDialog } from "../components/ProductPage/CreateReviewDialog";
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    }, 
    item: {
        height: "100%",
        padding: "5%",
    },
    storesSection: {
        height: "100%",
        padding: "10px",
    }
}));



const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [stores, setStores] = useState([]);
    const [openCreateReviewDialog, setOpenCreateReviewDialog] = useState(false);
    const [refreshReviews, setRefreshReviews] = useState(false);

    const refreshReviewsCallback = (value) => {
        // For now it works, but is it supposed to be like this? Does the value get set to false after this?
        // Also weird because it refreshes products, should we simply add it when the req is successful?
        setRefreshReviews(value);
    }

    const handleClickOpen = () => setOpenCreateReviewDialog(true); 
    const handleClose = () => setOpenCreateReviewDialog(false);

    useEffect( () => async () => {
        const query = "http://localhost:3001/api/product/" + id; 
        await fetch(query).then((res) => res.json())
            .then((data) => setProduct(data.content))
            .catch((err) => console.log("err", err)); 
    }, [refreshReviews]);

    useEffect( () => async () => {
        const query = "http://localhost:3001/api/product/" + id + "/stores";
        await fetch(query).then((res) => res.json())
            .then((data) => {
                setStores(data.rows);
            })
            .catch((err) => console.log("err", err));
    }, []);
    
    const classes = useStyles();

    return (
        <Fragment>
            <MyNavbar hasSearchBar={false} style={{height:"50px"}}></MyNavbar>

            <Box mt={100} p={2} className={classes.box}>
                <Grid container spacing={{ xs: 1, sm: 2, md: 1}} className={classes.item}>

                    {/*Left side*/}
                    <Grid item xs={6} sm={6} md={6}>
                        <Grid container direction="column" alignItems="stretch" spacing={1} >
                            <Grid item xs={6} sm={6} md={5}>
                                <ProductInfoCard product={product} />
                            </Grid>
                            <Grid item xs={6} sm={6} md={7} >
                                <Typography variant="h6"
                                    style={{paddingBottom: "10px", paddingTop: "10px", fontWeight: "bold"}}
                                >Available at: </Typography>
                                <List component="nav" aria-label="main mailbox folders">
                                    <StoreList stores={stores} />
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/*Right side*/}
                    <Grid item xs={6} sm={6} md={6} className={classes.storesSection}>
                        <CreateReviewDialog open={openCreateReviewDialog} onClose={handleClose} setRefreshReviews={refreshReviewsCallback} product_id={id} />
                        <Typography   variant="h6" align="center" style={
                            {paddingBottom: "10px", paddingTop: "10px", fontWeight: "bold", marginBottom: "10px"}
                        }>Reviews:</Typography>
                        <Divider variant="middle" />
                        <ProductReviewList reviews={product.reviews} /> 
                        <Box align="" justifyContent={"center"} style={{marginTop: "29px"}}>
                            <Button variant="contained" color="primary" onClick={handleClickOpen} align="center">
                                Add Review
                            </Button>
                        </Box>
                    </Grid> 
                </Grid>
            </Box>
        </Fragment>
    );};

export default Product;
