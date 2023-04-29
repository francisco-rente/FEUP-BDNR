import MyNavbar from "../components/MyNavbar";
import {Fragment, useState, useEffect} from "react";


const StoreCard = (props) => {
    const store = props.store.stores; 
    const {name, contact, location, store_id, store_items} = store;
    return(       
        <div className="col-4">
            <div className="card" style={{width: "18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    <p className="card-text">{contact.email}</p>
                </div>
            </div>
        </div>
    )
};


const StoresList = (props) => {
    const stores = props.stores;

    return (
        <div className="row">
            {stores.map((store, index) => (
                <Fragment key={`store_${index}`}>
                    <StoreCard store={store}></StoreCard>
                </Fragment>
            ))}
        </div>
    ); 
};



const Store= () => {
    const [stores, setStores] = useState([]);

    useEffect(() => async () => {
        fetch("http://localhost:3001/api/store").then((res) => res.json()).then((data) => {
            console.log("data", data);
            setStores(data.rows);
        }).catch((err) => {
            console.log("err", err);
        });
    }, []);

    return (
        <Fragment>
            <MyNavbar hasSearchBar={false} style={{height:"50px"}}></MyNavbar>
            Stores
            <StoresList stores={stores}></StoresList>
        </Fragment>);
};

export default Store;
