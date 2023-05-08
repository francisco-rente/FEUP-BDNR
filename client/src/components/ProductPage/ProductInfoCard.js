import React from "react";
import { Card, CardContent, CardHeader, CardMedia, Typography } from "@material-ui/core";
import StarIcon from '@material-ui/icons/Star';
import { makeStyles } from '@material-ui/core/styles';
import videoPng from "../../assets/videotape.png";
import Grid from "@material-ui/core/Grid";

const stars = (star_rating) => Array.from({length: star_rating}, () => <span><StarIcon style={{color: "#FFD700"}}/></span>);
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: "80%",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
        margin: "10px",
        boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.75)",
    }
}));



export const ProductInfoCard = ( props ) => {
    

    const { product_title, product_category, marketplace } = props.product;
    return (
        <Card variant="outlined" className={useStyles().root} >

            <CardMedia
                component="img"
                alt="Product Image"
                image={videoPng}
                title="Product Image"
            />
            <CardHeader
                title={product_title}
            />


            <CardContent style={{height:"100%"}}>
                <Grid container direction="row" alignItems="stretch" spacing={1} style={{height:"100%", width:"100%"}} >
                    <Grid item xs={6} sm={6} md={6}>
                        <Typography variant="body2" component="p">
                            Category: {product_category}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Marketplace {marketplace}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                        <Typography variant="body2" component="p">
                            {stars(4)}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Avg. Price: $5.00
                        </Typography>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
};

