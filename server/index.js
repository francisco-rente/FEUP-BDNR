const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/book');
const errorMiddleware = require('./middlewares/error');

// Set up the server
const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Set up the routes
app.use('/api/books', bookRoutes);

// Use error middleware to handle errors
app.use(errorMiddleware);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
