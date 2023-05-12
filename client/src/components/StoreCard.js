import { useState, React } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const StoreCard = ({ store }) => {
  const [showProducts, setShowProducts] = useState(false);

  const toggleProducts = () => {
    setShowProducts(!showProducts);
  };

  const ProductList = ({ products }) => {
    return (
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
    );
  };

  return (
    console.log(store),
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
        <Button onClick={toggleProducts} size="small">
          {showProducts ? 'Hide Products' : 'Show Products'}
        </Button>
        {showProducts && (<ProductList products={store.store_items} />)}
      </CardContent>
    </Card>
  );
};

export default StoreCard;
