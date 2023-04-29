const couchbase = require('couchbase');
const config = require('../config');
const db = require('../db/database');
const N1qlQuery = couchbase.N1qlQuery;

const storeSchema = {
    //id???
    name: { type: String, required: true },
    location: { type: String, required: false},
    store_items: {type: Array,  required: true},
    contact: { type: Number,  required: false}
};

const Store = {
    findAll: () => new Promise((resolve, reject) =>{
            const scope = db.getScope();   
            console.log("scope", scope);
                
            const collection = scope.collection('stores');
            console.log("collection", collection);

            scope.query( 'SELECT * FROM `stores` LIMIT 10', (err, result) => {
                if (err) {
                    console.log("Error in Store.findAll");
                    reject(err);
                } else {
                    console.log("Store.findAll");
                    resolve(result);
                }
            });
        }),

    findById: (id) => {
        return new Promise((resolve, reject) => {
            store_collection.get(id, (err, result) => {
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
      store_collection.insert(id, book, (err, result) => {
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
      store_collection.replace(id, book, (err, result) => {
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
      store_collection.remove(id, (err, result) => {
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

module.exports = Store;
