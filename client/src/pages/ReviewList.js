import MyNavbar from "../components/MyNavbar";
import SearchBar from '../components/SearchBar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  const handleSearch = async (searchTerm) => {
    console.log(searchTerm);
    // make API call or search algorithm to get search results
    try {
      const response = await fetch(`https://api.example.com/reviews?q=${searchTerm}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
    handleSubmit(searchTerm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    console.log('Form submitted');
    console.log(reviews);
  };



    return (
      <>
      <MyNavbar hasSearchBar={false} style={{height:"50px"}}></MyNavbar>
      <div>
      <SearchBar onSearch={handleSearch} label="Review id" formProps={{ style: { display: 'flex', width: '50%', marginLeft: '25%', marginTop: '5%'   } }} />
      <Typography variant="h6">Search Results:</Typography>
      <ul>
        {reviews.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
      reviewList page
      
      </>)
      ;
  };
  
  export default ReviewList;