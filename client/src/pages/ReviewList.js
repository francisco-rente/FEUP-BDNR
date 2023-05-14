import MyNavbar from "../components/MyNavbar";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReviewListItem from "../components/ReviewListItem";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [searchType, setSearchType] = React.useState('id');
  const query = "http://localhost:3001/api/review/";

  useEffect(() => async () => {
    console.log("inside useEffect");
    fetch(query).then((res) => res.json()).then((data) => {
        console.log("data", data);
        setReviews(data.rows);
    }).catch((err) => {
        console.log("err", err);
    });
}, []);


  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearch = async (searchTerm) => {
      console.log(query + searchType +"/" + searchTerm)
      const response = await fetch(query + searchType +"/" + searchTerm)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        if(data.message == 'No reviews match query' || data.message == 'review not found'){
          setReviews([]);
        }
        else{
          setReviews(data.rows);
        }
        
      }).catch((err) => {
        console.log("err", err);
      });
  };


  return (
    <>
      <MyNavbar hasSearchBar={false} style={{ height: "50px" }}></MyNavbar>
      <div>
        <SearchBar
          onSearch={handleSearch}
          label="Review id"
          formProps={{
            style: {
              display: "flex",
              width: "50%",
              marginLeft: "25%",
              marginTop: "5%",
            },
          }}
        />
        <Box sx={{display: "flex",
              width: "50%",
              marginLeft: "25%",
              marginTop: "1%", }}>
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Search Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchType}
            label="Search Type"
            onChange={handleChange}
          >
          <MenuItem value={"id"}>Id</MenuItem>
          <MenuItem value={"fts"}>FTS</MenuItem>
          </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        <Typography variant="h6">Search Results:</Typography>
        <ul>
      {reviews.map((review) => (
        <ReviewListItem key={review.review.review_id} product_id={review.product_id} review={review.review} />
      ))}
    </ul>
      </div>
    </>
  );
};

export default ReviewList;
