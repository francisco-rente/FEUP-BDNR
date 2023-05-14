const Product = require('../models/product');
const database = require('../db/database');
couchbase = require('couchbase');

const reviewController = {
  getAll: async (_, res) => {
    try {
      const query =
        'SELECT product.product_id, review FROM server.store.products AS product UNNEST product.reviews AS review LIMIT 10';
      console.log('query', query);
      const scope = database.getScope();
      await scope.query(query, (err, result) => (err ? err : result))
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(404).json({ message: 'error getting reviews' });
        });
    } catch (err) {
      console.log('error is', err);
    }
  },

  getById: async (req, res, next) => {
    console.log('req.params.id', req.params.id);
    const reviewId = req.params.id;
    try {
      const query = `SELECT product.product_id, review FROM server.store.products AS product UNNEST product.reviews AS review WHERE review.review_id = "${reviewId}"`;
      console.log('query', query);
      const scope = database.getScope();
      await scope.query(query, (err, result) => (err ? err : result))
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          res.status(404).json({ message: 'review not found' });
        });
    } catch (err) {
      next(err);
    }
  },
/*
  getByFTSaux: async (reviews) => {
    const results = [];
    const scope = database.getScope();
    try {
      for (const review of reviews.rows) {
        const query = `SELECT product.product_id, review FROM server.store.products AS product UNNEST product.reviews AS review WHERE review.review_id = "${review.id}"`;
        console.log('query', query);
        const result = await new Promise((resolve, reject) => {
          scope.query(query, (err, result) => {
            if (err) {
              reject(err);
            }
            else {
              resolve(result);
            }
          });
        });
        console.log("pushing result into results:", result);
        console.log("result.rows", result.rows);
        console.log("result.rows[0]", result.rows[0]);
        results.push(result);
      }
    } catch (err) {
      throw err;
    }
    return results;
  },

  getByFTS: async (req, res, next) => {
    const input = req.params.review;
    let reviews = [];
    console.log('input', input);
    try {
      const indexName = 'review_bodyIndex';
      await database
        .getCluster()
        .searchQuery(indexName, couchbase.SearchQuery.matchPhrase(input), { limit: 10 })
        .then(async (result) => {
          console.log('result', result);
          reviews = await reviewController.getByFTSaux(result);
          res.status(200).json(reviews);
        })
        .catch((err) => {
          console.log('err in getByFTS', err);
          res.status(404).json({ message: 'No reviews match query' });
        });
    } catch (err) {
      next(err);
    }
  },
*/

getByFTS: async (req, res, next) => {
  const input = req.params.review;
  let reviews = [];
  console.log('input', input);
  try {
    const indexName = 'review_bodyIndex';
    await database
      .getCluster()
      .searchQuery(indexName, couchbase.SearchQuery.matchPhrase(input), { limit: 10 })
      .then(async (result) => {
        console.log('result', result);
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log('err in getByFTS', err);
        res.status(404).json({ message: 'No reviews match query' });
      });
  } catch (err) {
    next(err);
  }
},
};

module.exports = reviewController;
