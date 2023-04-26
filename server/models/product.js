const couchbase = require('couchbase');
const config = require('../config');

const cluster = new couchbase.Cluster(config.dbUrl);
const bucket = cluster.openBucket(config.bucketName, config.dbPassword);

const productSchema = {
  product_id: { type: String, required: true },
  product_title: { type: String, required: true },
  product_category: { type: String },
  product_parent: { type: Integer },
  marketplace: { type: String },
  reviews: {
    type: Array,
    items: {
      type: Object,
      properties: {
        review_id: { type: String },
        customer_id: { type: Integer },
        star_rating: { type: Integer, minimum: 1, maximum: 5 },
        helpful_votes: { type: Integer, minimum: 0 },
        total_votes: { type: Integer, minimum: 0 },
        vine: { type: String, enum: ["Y", "N"] },
        verified_purchase: { type: String, enum: ["Y", "N"] },
        review_headline: { type: String },
        review_body: { type: String },
        review_date: { type: String, format: "date" }
      },
    }
  }
};

const Product = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      const query = couchbase.N1qlQuery.fromString('SELECT * FROM product');
      bucket.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      bucket.get(id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.value);
        }
      });
    });
  },
/*
  create: (book) => {
    return new Promise((resolve, reject) => {
      const id = book.title.replace(/\s/g, '-').toLowerCase();
      bucket.insert(id, book, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.value);
        }
      });
    });
  },

  update: (id, book) => {
    return new Promise((resolve, reject) => {
      bucket.replace(id, book, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.value);
        }
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      bucket.remove(id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  */
}
