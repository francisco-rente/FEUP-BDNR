import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

const StoreCard = ({ store }) => {
  const [showProducts, setShowProducts] = useState(false);
  //TODO improve the way this value is tracked


  function toggleProducts(){
    setShowProducts(!showProducts);
  };

  async function applyDiscount(discount, store_id) {
    console.log("inside applyDiscount of store card");
    const data = {
      store_id: store_id,
      discount: discount
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/store/discount", {
        method: "POST",
        mode : 'cors',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 200) {
        console.log("Discount applied successfully, response is:", response);
      } else {
        console.log("Failed to apply discount, error is:", response);
      }
    } catch (error) {
      console.log("Error occurred while applying discount:", error);
    }
      window.location.reload("false");
  }

  const ProductList = ({ products }) => {
    const [discount, setDiscount] = useState(0);
    return (
      <div>
      <ul>
        {products.map((product) => (
          <li key={product.product_id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                Id: {product.product_id}
                </Typography>
                <Typography color="text.secondary">
                Price: {product.price}
                </Typography>
                <Typography color="text.secondary">
                Quantity: {product.quantity}
                </Typography>
              </CardContent>
            </Card>
          </li> 
        ))}
      </ul>
      <TextField id="outlined-basic" label="Discount" variant="outlined" size='small' onChange={(e) => setDiscount(e.target.value)}/>
      <Button variant="contained" onClick={() => applyDiscount(discount, store.store_id)}>Apply store discount</Button>
      </div>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {store.name}
        </Typography>
        <Typography color="text.secondary">
          Latitude: {store.location.latitude}, Longitude: {store.location.longitude}, Altitude: {store.location.altitude}
        </Typography>
        <Typography color="text.secondary">
          City: {store.location.city}, Country: {store.location.country}
        </Typography>
        <Typography color="text.secondary">
          Email: {store.contact.email}, Phone number: {store.contact.phone_number}
        </Typography>
        <Button onClick={() =>toggleProducts()} size="small">
          {showProducts ? 'Hide Products' : 'Show Products'}
        </Button>
        {showProducts && (<ProductList products={store.store_items} store_id = {store.store_id} />)}
      </CardContent>
    </Card>
  );
};

export default StoreCard;
