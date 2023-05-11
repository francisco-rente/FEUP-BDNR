const Product = require('../models/product');
const database = require('../db/database');
couchbase = require('couchbase');
const reviewController = {
    getAll:async (_, res) => {
        try {
            const query = "SELECT product.product_id, review FROM server.store.products AS product UNNEST product.reviews AS review LIMIT 10";
            console.log("query", query);
            const scope = database.getScope();
            await scope.query(query, (err, result) => err ? err : result)
                .then((result) => {
                res.status(200).json(result);
            }
        ).catch((err) => {
            res.status(404).json({ message: 'error getting reviews' });
        }
        );
    } catch (err) {
      console.log("error is", err);
    }
  }, 

  getById: async (req, res, next) => {
    console.log("req.params.id", req.params.id);
    const reviewId = req.params.id;
    try {
        const query = "SELECT product.product_id, review FROM server.store.products AS product UNNEST product.reviews AS review WHERE review.review_id = \"" + reviewId + "\"";
        console.log("query", query);
        const scope = database.getScope();
        await scope.query(query, (err, result) => err ? err : result)
            .then((result) => {
            res.status(200).json(result);
        }
        ).catch((err) => {
            res.status(404).json({ message: 'review not found' });
        }
        );
    } catch (err) {
      next(err);
    }
  },

  getByFTS: async (req, res, next) => {
    const input = req.params.review;
    try {
      const indexName = "reviewIndex";
      const query = couchbase.SearchQuery.match(input).field("review.review_body").limit(10);
      collection = database.getCollection();
      collection.searchQuery(indexName, query, (err, result) => {
        if (err) {
          console.error('Error executing FTS search:', err);
          res.status(404).json({ message: 'no matching reviews' });
          return;
        }
        else {
          res.status(200).json(result);
        }
      });
    } catch (err) {
      next(err);
    }
  },
};


module.exports = reviewController;
