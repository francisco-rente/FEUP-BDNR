import MyNavbar from "../components/MyNavbar";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";
import { List, ListItem, Divider } from "@material-ui/core";
import FilterSlider from "../components/FilterSlider";
import ProductCard from "../components/ProductCard";
import { Grid } from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

const style = {
    bgcolor: "background.paper",
    display: "flex",
    // flex center
    width: "50%",
    marginLeft: "25%",
    marginTop: "5%",
};


const FilterStack = ({setDistanceInterval, setQuantityInterval, setPriceInterval}) => {

    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <ListItem button>
                <FilterSlider
                    units="km"
                    limit={100}
                    step={50}
                    onChange={(e) => setDistanceInterval(e.target.value)}
                />
            </ListItem>
            <Divider />
            <ListItem button divider>
                <FilterSlider
                    onChange={(e) => setQuantityInterval(e.target.value)}
                    units="u."
                    limit={100}
                    step={25}
                />
            </ListItem>
            <ListItem button>
                <FilterSlider
                    units="€"
                    onChange={(_, newValue) => setPriceInterval(newValue)}
                    limit={500}
                    step={100}
                />
            </ListItem>
            <Divider light />
        </Stack>
    );
};



const Products = ({searchResults}) => {
    return (<>
        <Typography variant="h6">Search Results:</Typography>
        <ul>
            {searchResults.map((result, index) => (
                <li key={index}>
                    <ProductCard product={result.product}></ProductCard>
                </li>
            ))}
        </ul>
    </>);

};



const ProductList = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [distanceInterval, setDistanceInterval] = useState([0, 100]);
    const [quantityInterval, setQuantityInterval] = useState([0, 100]);
    const [priceInterval, setPriceInterval] = useState([0, 500]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    async function getProducts(reqPage=page) {
         const query = "http://localhost:3001/api/product";
         console.log("price interval: " + priceInterval);
            const params = new URLSearchParams({
                q: "product_title:fts",
                product_distance: distanceInterval,
                product_quantity: quantityInterval,
                product_price: priceInterval,
                page: reqPage,
            });
            await fetch(query + "?" + params)
                .then((res) => res.json())
                .then((data) => {
                    console.log("Total pages: " + data.total);
                    setSearchResults(data.rows);
                    setTotalPages(+data.total);
                })
                .catch((err) => console.log(err));
    }



    useEffect(
        () => {getProducts()},
        [distanceInterval, quantityInterval, priceInterval]
    );

    const handleSearch = (searchTerm) => {
        // make API call or search algorithm to get search results
        setSearchResults([...searchResults, searchTerm]);
    };

    const handlePageChange =(value) => {
        console.log("Page changed to: " + value);
        setPage(value);
        getProducts(value);
    }

    return (
        <>
            <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
            <div>
                {/*FTS in title*/}
                <SearchBar
                    onSearch={handleSearch}
                    label="Search products"
                    formProps={{
                        style: {
                            display: "flex",
                            width: "50%",
                            marginLeft: "25%",
                            marginTop: "5%",
                        },
                    }}
                />

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <FilterStack
                            setDistanceInterval={setDistanceInterval}
                            setQuantityInterval={setQuantityInterval}
                            setPriceInterval={setPriceInterval}
                        />

                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Products searchResults={searchResults} />
                    </Grid>
                    <Grid item xs={12} md={12} style={{display: "flex", justifyContent: "center"}}>
                        {/*Is this necessary https://mui.com/material-ui/react-pagination/#router-integration*/}
                        <Pagination  variant="outlined" color="primary" siblingCount={1} boundaryCount={2} 
                            page={page} count={totalPages} onChange={(_, value) => handlePageChange(value)} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
};
export default ProductList;
