const couchbase = require('couchbase');
const config = require('../config');

const cluster = new couchbase.Cluster(config.dbUrl);
const bucket = cluster.openBucket(config.bucketName, config.dbPassword);

const bookSchema = {
  //id???
  name: { type: String, required: true },
  location: { type: String, required: false},
  contact: {type: int, required: false},
  store_items: {type: array, required: true}
};

const Store = {
  findAll: () => {
    return new Promise((resolve, reject) => {
      const query = couchbase.N1qlQuery.fromString('SELECT * FROM store');
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
