const couchbase = require('couchbase');
const db = require('../database');

const cluster = db.getCluster();
const bucket = cluster.getBucket();


const indexName = 'reviewIndex';
const indexStatement = `CREATE INDEX ${indexName} ON server.store.products(DISTINCT ARRAY review.review_body FOR review IN reviews END)`;
const collection = bucket.scope('store').collection('products');

// Execute the index creation query
const review_bodyIndex = () => {
  return new Promise((resolve, reject) => {
    collection.query(indexStatement, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
};

module.exports = {
  review_bodyIndex
};
