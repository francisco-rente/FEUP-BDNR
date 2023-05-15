import MyNavbar from "../components/MyNavbar";
import {Fragment, useState, useEffect} from "react";
import StoreCard from "../components/StoreCard";

const StoresList = (props) => {
    const stores = props.stores;

    return (
        <div className="row">
            {stores.map((store, index) => (
                <Fragment key={`store_${index}`}>
                    <StoreCard 
                    store={store.stores}>
                    </StoreCard>
                    
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
