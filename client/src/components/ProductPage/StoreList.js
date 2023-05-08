import React from "react";
import { List } from "@material-ui/core";
import { StoreListCard } from "./StoreListCard";


export const StoreList = ({stores}) => {

    console.log("stores", stores);
    if(stores === undefined) return null;
    return (
        <List component="nav" aria-label="main mailbox folders">
            {stores.map((store) => (
                <StoreListCard key={store.store_id} store={store} />
            ))}
        </List>
    ); 
};
