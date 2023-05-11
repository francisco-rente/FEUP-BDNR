const express = require('express');
const bodyParser = require('body-parser');
const storeRoutes = require('./routes/store');
const cors = require('cors');
const searchIndexes = require('./db/indexes')
// const errorMiddleware = require('./middlewares/error');
const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const database = require('./db/database');
// Set up the server
const app = express();
const port = process.env.PORT || 3001;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up the routes
app.use('/api/store', storeRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/product', productRoutes);
app.use('/api/review', reviewRoutes);

// Use error middleware to handle errors
//app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
    // Start the database
    database.startDB((err) => {
        if (err) {
            process.exit(1);
        }
        console.log('Database connected.');
    });
    console.log(`Server listening on port ${port}`);
});