import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";

export const StoreListCard = ({store}) => {
    const {store_name, store_location, store_contact} = store;
    const {city, country} = store_location;
    const {phone_number, email} = store_contact;
    return (
        <ListItem button>
            <ListItemText primary={store_name} secondary={city + ", " + country} />
            <ListItemText primary={phone_number} secondary={email} />
        </ListItem>
    );
};
