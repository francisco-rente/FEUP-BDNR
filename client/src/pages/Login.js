import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

function Form() {
  const [userId, setUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userId", userId);
  };

  const handleTextChange = (e) => {
    setUserId(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Enter some text"
        value={userId}
        onChange={handleTextChange}
        variant="outlined"
      />
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </form>
  );
}

export default Form;




























