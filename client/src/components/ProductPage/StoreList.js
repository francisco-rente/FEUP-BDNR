import React from "react";
import { List } from "@material-ui/core";
import { StoreListCard } from "./StoreListCard";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        maxWidth: 500,
        margin: "auto",
        backgroundColor: theme.palette.background.grey,
        maxHeight: 100,
        position: 'relative',
        overflow: 'scroll',
    }
}));

export const StoreList = ({stores}) => {
    const navigate = useNavigate();
    const classes = useStyles();
    if(stores === undefined) return <div>No stores have this product.</div>;
    return (
        <List component="nav" aria-label="main mailbox folders" className={classes.root}
            scroll="paper">
            {stores.map((store) => (
                <StoreListCard key={store.store_id} store={store} navigate={navigate} />
            ))}
        </List>
    ); 
};
