const couchbase = require('couchbase');
const config = require('../config');
const db = require('../db/database');


const productSchema = {
    product_id: { type: String, required: true },
    product_title: { type: String, required: true },
    product_category: { type: String },
    product_parent: { type: Number },
    marketplace: { type: String },
    reviews: {
        type: Array,
        items: {
            type: Object,
            properties: {
                review_id: { type: String },
                customer_id: { type: Number },
                star_rating: { type: Number, minimum: 1, maximum: 5 },
                helpful_votes: { type: Number, minimum: 0 },
                total_votes: { type: Number, minimum: 0 },
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
            const scope = db.getScope();   
            scope.query( 'SELECT * FROM `products` LIMIT 10', (err, result) => {
                if (err) {
                    console.log("Error in Store.findAll");
                    reject(err);
                } else {
                    resolve(result);
                }
            })}); 
    },
    findById: (id) => { 
        return new Promise((resolve, reject) => {
            const products = db.getCollection("products");
            products.get(id, (err, result) => err ? reject(err) : resolve(result));
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

module.exports = Product;
