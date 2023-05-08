import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        margin: "auto",
    }
}));



export const StoreListCard = ({store, navigate}) => {
    const {store_name, store_location, store_contact, store_id} = store;
    const {city, country} = store_location;
    const {phone_number, email} = store_contact;  
    
    console.log(store);


    const goToStore = () => {
        navigate("/store/" + store_id);
    }


    return (
        <ListItem alignItems="flex-start" divider={true} justifyContent="center" onClick={() => goToStore()}>
            <ListItemText 
                primary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body1"
                            color="textPrimary"
                        >
                            {store_name}
                        </Typography>
                    </React.Fragment>

                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                        >
                            {city}, {country}
                        </Typography>    
                    </React.Fragment>
                }
            />
         <ListItemText align="right"
                primary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                        >
                            {phone_number}
                        </Typography>
                    </React.Fragment>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                        >
                            {email}
                        </Typography>
                    </React.Fragment>
                    
                }
            />


        </ListItem>
    



    );
};
