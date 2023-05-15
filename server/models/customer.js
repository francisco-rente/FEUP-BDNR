const couchbase = require('couchbase');
const config = require('../config');
const db = require('../db/database');

const bucket = db.bucket;


const customerSchema = {
  customer_id: { type: "integer", required: true },
  name: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: false },
  location: {
    type: "object",
    properties: {
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zip_code: { type: String },
      coordinates: {
        type: "object",
        properties: {
          latitude: { type: Number },
          longitude: { type: Number }
        },
      }
    },
  },
  phone_number: {type: String, required: false},
  products_reviews_pairs: {
    type: Array, items: {
    product_id: {type: String, required: true},
    review_id: {type: String, required: true}
  },
  required: true}
};


const Customer = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      const query = couchbase.N1qlQuery.fromString('SELECT * FROM customer');
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
            const users = db.getCollection("users");
            users.get(id, (err, result) => err ? reject(err) : resolve(result));
        }
    )},
}

module.exports = Customer;
