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
        try {
            const indexName = 'review_bodyIndex';
            const user_input = req.query.q;
            const page = req.query.page;
            
            const OFFSET = page * 10;

            let products_ids = await database.getCluster().searchQuery(indexName, couchbase.SearchQuery.matchPhrase(user_input), {})
                .then(async (result) => result.rows.map((row) => row.id))
                .catch(() => []);
            console.log("products_ids", products_ids);
            if(products_ids.length === 0) return res.status(200).json([]); // TODO: return a better message if possible
            
            
            const total = products_ids.length;
            
            // Pagination has to be made manually through the results array, otherwise one req retrieves all the results (getting the number) and another the limited results
                
            // slice the products_ids array TODO: Check conditions
            if(OFFSET + 10 < products_ids.length) products_ids = products_ids.slice(OFFSET, OFFSET + 10);
            else if(OFFSET < products_ids.length) products_ids = products_ids.slice(OFFSET);
            else if(OFFSET >= products_ids.length) return res.status(200).json(products_ids);  



            const col = await database.getCollection("products");
            const products =  products_ids.map(  (id) =>
                col.get(id)
                    .then((res) => res)
                    .catch(() => res.status(404).json({ message: "Error getting products" })));
            // settle all promises
            await Promise.all(products).then((values) => {
                console.log("res", values);
                // Naming convention to make all req return the same format
                res.status(200).json({
                    total: Math.ceil(total / 10),
                    rows: values.map((row) => {return { product : row.value }
                })})
            }).catch((err) => {
                console.log("err", err);
                res.status(404).json({ message: "Error getting products" });
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = reviewController;
