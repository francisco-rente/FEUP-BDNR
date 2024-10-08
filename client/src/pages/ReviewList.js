import MyNavbar from "../components/MyNavbar";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";
import React, { useState, useEffect } from "react";
import ReviewListItem from "../components/ReviewListItem";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const query = `http://${process.env.REACT_APP_BACKEND_HOST}:3001/api/review/`;

  useEffect(() => async () => {
    console.log("inside useEffect");
    fetch(query).then((res) => res.json()).then((data) => {
      console.log("data", data);
      setReviews(data.rows);
    }).catch((err) => {
      console.log("err", err);
    });
  }, []);

  const handleSearch = async (searchTerm) => {
    console.log(query + searchTerm)
    await fetch(query + "id/" + searchTerm)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        if (data.message == 'No reviews match query' || data.message == 'review not found') {
          setReviews([]);
        }
        else {
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
