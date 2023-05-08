import React from "react";
import { List } from "@material-ui/core";
import { StoreListCard } from "./StoreListCard";
import { useNavigate } from "react-router-dom";

export const StoreList = ({stores}) => {
    const navigate = useNavigate();
    if(stores === undefined) return <div>No stores have this product.</div>;
    return (
        <List component="nav" aria-label="main mailbox folders">
            {stores.map((store) => (
                <StoreListCard key={store.store_id} store={store} navigate={navigate} />
            ))}
        </List>
    ); 
};
