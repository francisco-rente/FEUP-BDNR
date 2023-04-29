const couchbase = require('couchbase');
const config = require('../config');
const db = require('../db/database');

const bucket = db.bucket;

/*
{"customer_id":42605767,
"name":"Abigail Jones",
"email":"Abigail Jones@gmail.com",
"password":"5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
"location":{"city":"Sparksside","state":"Arizona","country":"Saint Martin","zip_code":"47574","coordinates":{"latitude":87.856211,"longitude":-115.274201}},
"phone_number":"975.105.6526x2504",
"products_reviews_pairs":[{"product_id":"B00MUTIDKI","review_id":"R3EFW2STIYIY0I"}]},
*/

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
