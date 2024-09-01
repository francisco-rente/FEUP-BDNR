import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import Centered from "../components/Centered";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';



function Form() {
    const [userId, setUserId] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        const userIdInt = parseInt(userId);
        if(!isNaN(userIdInt)) {
            const user = await fetch(
                'http://localhost:3001/api/customer/login',
                {
                    method: 'POST',
                    mode : 'cors',
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    }, 
                    body: JSON.stringify({userId: userIdInt})
                }
            )
                .then((res) => res.json()).then((data) => {
                    const isValid = data.content.customer_id
                        == userIdInt;
                    if(isValid){
                        localStorage.setItem("userId", userId);
                        navigate("/profile");
                    } 
                    else{
                        setError(true);
                        console.log("Utilizador não encontrado");
                        setUserId("");
                    }
                }).catch( (err) => console.log(err));
        }
        else{
            setError(true);
            console.log("Utilizador não encontrado");
            setUserId("");
        }
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
                        {error && ( // Display error message if error is true
                        <Alert severity="error" style={{ marginBottom: 10 }}>
                            <AlertTitle>Error</AlertTitle>
                            Utilizador não encontrado
                        </Alert>
                        )}
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
