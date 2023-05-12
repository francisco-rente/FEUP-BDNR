import MyNavbar from "../components/MyNavbar";
import {Fragment, useState, useEffect} from "react";
import StoreCard from "../components/StoreCard";

{/*
const StoreCard = (props) => {
    //console.log("props", props);
    //console.log('');
    //console.log('');
    //console.log('');
    var store;
    if(props.store.stores=null){
        console.log("props", props);
    } 
    else{ store = props.store.stores}
    ///console.log("store", store);
    const {name, contact, location, store_id, store_items} = store;
    return(       
        <div className="col-4">
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{contact.email}</p>
                    <StoreCard
                        key={store_id}
                        name={name}
                        latitude={location.latitude}
                        longitude={location.longitude}
                        altitude={location.altitude}
                        city={location.city}
                        country={location.country}
                    />
                </div>
            </div>
        </div>
    )
};*/}


const StoresList = (props) => {
    const stores = props.stores;

    return (
        <div className="row">
            {stores.map((store, index) => (
                <Fragment key={`store_${index}`}>
                    <StoreCard store={store.stores}></StoreCard>
                </Fragment>
            ))}
        </div>
    ); 
};



const StoreList= () => {
    const [stores, setStores] = useState([]);

    useEffect(() => async () => {
        fetch("http://localhost:3001/api/store").then((res) => res.json()).then((data) => {
            console.log("data from request", data);
            setStores(data.rows);
        }).catch((err) => {
            console.log("err", err);
        });
    }, []);

    return (
        <Fragment>
            <MyNavbar hasSearchBar={false} style={{height:"50px"}}></MyNavbar>
            <StoresList stores={stores}></StoresList>
        </Fragment>);
};

export default StoreList;
