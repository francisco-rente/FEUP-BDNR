import MyNavbar from "../components/MyNavbar";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";
import { List, ListItem, Divider } from "@material-ui/core";
import {RegularSlider, FilterSlider} from "../components/FilterSlider";
import ProductCard from "../components/ProductCard";
import { Grid } from "@material-ui/core";
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const style = {
    bgcolor: "background.paper",
    display: "flex",
    // flex center
    width: "50%",
    marginLeft: "25%",
    marginTop: "5%",
};


const FilterStack = ({ setQuantityInterval, setPriceInterval }) => {

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <ListItem button>

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



const Products = ({ searchResults }) => {
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


const SEARCH_TYPE = {
    PRODUCT: "product/fts",
    REVIEW: "review/fts", 
    DISTANCE: "product/distance",
};



const ProductList = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [distanceInterval, setDistanceInterval] = useState([0, 100]);
    const [quantityInterval, setQuantityInterval] = useState([0, 100]);
    const [priceInterval, setPriceInterval] = useState([0, 500]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchType, setSearchType] = useState(SEARCH_TYPE.PRODUCT);

    
    const handleChange = (event) => {
        setSearchType(event.target.value);
    };

    async function getProducts(reqPage=page) {
        const query = "http://localhost:3001/api/product";
        console.log("price interval: " + priceInterval);
           const params = new URLSearchParams({
               q: "product_title:fts",
               product_quantity: quantityInterval,
               product_price: priceInterval,
               page: reqPage,
           });
           await fetch(query + "?" + params)
               .then((res) => res.json())
               .then((data) => {
                    console.log("data from getProducts", data);
                   setSearchResults(data.rows);
                   setTotalPages(+data.total);
               })
               .catch((err) => console.log(err));
   }


    //function to make call to api for fts
    async function queryProducts(query) {
        const url = `http://localhost:3001/api/${searchType}`; 
        const params = new URLSearchParams({
            page: page,
            q: query
        });
        console.log("SEARCH QUERY: ", url + "?" + params);

        await fetch(url + "?" + params)
            .then((res) => res.json())
            .then((data) => {
                if(data.length == 0 || !data || !data.rows || data.rows.length == 0) {
                    console.log("No results found");
                    setSearchResults([]);
                    setTotalPages(1);
                    setPage(1);
                }
                else{
                console.log("data from queryProducts", data)
                setSearchResults(data.rows);
                setTotalPages(+data.total);
                }
            })
            .catch((err) => console.log(err));
    }




    
  useEffect(
    () => {getProducts()},
    [quantityInterval, priceInterval]
  );

    const handleSearch = (searchTerm) => {
        queryProducts(searchTerm);
    };

    const handlePageChange = (value) => {
        console.log("Page changed to: " + value);
        setPage(value);
        getProducts(value);
    }

    const handleDistanceChange = async (event,newValue) => {
        event.preventDefault();
        console.log("Distance changed to: " + newValue);
            
        const user = localStorage.getItem("userId");

        if(!user) return;

        const params = new URLSearchParams({
            page: page,
            distance: newValue,
            customer_id: user
        }); 
        const url = `http://localhost:3001/api/product/distance`;

        await fetch(url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }, 
                params: params
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("data from handleDistanceChange", data);
                //setSearchResults(data.rows);
                //setTotalPages(+data.total);
            }).catch((err) => console.log(err));

        setDistanceInterval(newValue);
    }



    return (
        <>
            <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
            <div>
                {/*FTS in title*/}
                <div>
                    <SearchBar
                        onSearch={handleSearch}
                        label="Search query"
                        formProps={{
                            style: {
                                display: "flex",
                                width: "50%",
                                marginLeft: "25%",
                                marginTop: "5%",
                            },
                        }}
                    />
                    <Box sx={{
                        display: "flex",
                        width: "50%",
                        marginLeft: "25%",
                        marginTop: "1%",
                    }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={searchType}
                                label="Search Type"
                                onChange={handleChange}
                            >
                                <MenuItem value={SEARCH_TYPE.PRODUCT}>Product</MenuItem>
                                <MenuItem value={SEARCH_TYPE.REVIEW}>Review</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>

                <Box sx={{width: "50%", marginLeft: "25%", marginTop: "1%"}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography id="range-slider" gutterBottom>
                                Radius
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RegularSlider
                                onChange={(e) => handleDistanceChange(e, e.target.value)}
                                units="km"
                                limit={100}
                                step={25}
                            />
                        </Grid>
                    </Grid>
                </Box>





                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <FilterStack
                            setQuantityInterval={setQuantityInterval}
                            setPriceInterval={setPriceInterval}
                        />

                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Products searchResults={searchResults} />
                    </Grid>
                    <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "center" }}>
                        {/*Is this necessary https://mui.com/material-ui/react-pagination/#router-integration*/}
                        <Pagination variant="outlined" color="primary" siblingCount={1} boundaryCount={2}
                            page={page} count={totalPages} onChange={(_, value) => handlePageChange(value)} />
                    </Grid>
                </Grid>
            </div>
        </>
    );
};
export default ProductList;
