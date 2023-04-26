const express = require('express');
const bodyParser = require('body-parser');
const storeRoutes = require('./routes/store');
const errorMiddleware = require('./middlewares/error');
const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/product');

// Set up the server
const app = express();
const port = process.env.PORT || 3001;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Set up the routes
app.use('/api/store', storeRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);

// Use error middleware to handle errors
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
