import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import Centered from "../components/Centered";

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
    <>
      <Centered
        title="Inicio de Sessão"
        cardProps={{ maxWidth: "15em" }}
        content={
          <>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Enter some text"
                value={userId}
                onChange={handleTextChange}
                variant="outlined"
              />
              <Button variant="contained" color="primary" type="submit" style={{marginTop: 10}}>
                Submit
              </Button>
            </form>
          </>
        }
      />
    </>
  );
}

export default Form;
