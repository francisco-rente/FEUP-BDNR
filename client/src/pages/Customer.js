import MyNavbar from "../components/MyNavbar";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Typography from "@material-ui/core/Typography";

const Customer = () => {
  const [searchResults, setSearchResults] = useState([]);

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
        <SearchBar
          onSearch={handleSearch}
          label="Customer id"
          formProps={{
            style: {
              display: "flex",
              width: "50%",
              marginLeft: "25%",
              marginTop: "5%",
            },
          }}
        />
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Customer;
