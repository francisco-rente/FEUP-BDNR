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


    applyDiscount: (id, discount) => new Promise((resolve, reject) =>{
      const scope = db.getScope();   
      console.log("scope", scope);
          /*
      const query = `
      UPDATE stores 
      SET store_items = ARRAY v FOR v IN store_items 
                        WHEN v.product_id IN (
                            SELECT p.product_id 
                            FROM stores AS s 
                            UNNEST s.store_items AS p 
                            WHERE s.store_id = ${id} 
                        )
                        END
                        || ARRAY {"product_id": v.product_id, "price": v.price + ${discount}, "quantity": v.quantity} FOR v IN store_items 
                        WHEN v.product_id IN (
                            SELECT p.product_id 
                            FROM stores AS s 
                            UNNEST s.store_items AS p 
                            WHERE s.store_id = ${id} 
                        )
                        END
      WHERE store_id = ${id};
      `;*/

     /* const query = `UPDATE stores 
SET store_items = ARRAY {"product_id": v.product_id, "price": v.price + ${discount}, "quantity": v.quantity} FOR v IN store_items 
WHERE store_id = ${id};`;
*/
const query = `
UPDATE stores 
SET store_items = ARRAY v FOR v IN store_items 
                  END 
                  || [{"product_id": v.product_id, "price": v.price + ${discount}, "quantity": v.quantity}] 
WHERE store_id = ${id};
`;
      scope.query( query, (err, result) => {
          if (err) {
              console.log("Error in Store.applyDiscount");
              reject(err);
          } else {
              console.log("Store.applyDiscount");
              resolve(result);
          }
      });
  }),


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
