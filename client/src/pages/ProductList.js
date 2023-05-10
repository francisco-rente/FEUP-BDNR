import MyNavbar from "../components/MyNavbar";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";
import { List, ListItem, Divider } from "@material-ui/core";
import FilterSlider from "../components/FilterSlider";
import ProductCard from "../components/ProductCard";

const style = {
  bgcolor: "background.paper",
  display: "flex",
  // flex center
  width: "50%",
  marginLeft: "25%",
  marginTop: "5%",
};

const ProductList = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [distanceInterval, setDistanceInterval] = useState([0, 100]);
  const [quantityInterval, setQuantityInterval] = useState([0, 100]);
  const [priceInterval, setPriceInterval] = useState([0, 500]);

  // ?q=product_title:fts
  //&&product_distance:distanceInterval
  //&&product_quantity:quantityInterval
  //&&product_price:priceInterval

  useEffect(
    () => async () => {
      const query = "http://localhost:3001/api/product";
      const params = new URLSearchParams({
        q: "product_title:fts",
        product_distance: distanceInterval,
        product_quantity: quantityInterval,
        product_price: priceInterval,
      });

      fetch(query + "?" + params)
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data);
          setSearchResults(data.rows);
        })
        .catch((err) => {
          console.log("err", err);
        });
    },
    [distanceInterval, quantityInterval, priceInterval]
  );

  const handleSearch = (searchTerm) => {
    // make API call or search algorithm to get search results
    setSearchResults([...searchResults, searchTerm]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

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

        <List sx={style} component="nav" aria-label="mailbox folders">
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
        </List>

        <Typography variant="h6">Search Results:</Typography>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              <ProductCard product={result.product}></ProductCard>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default ProductList;
