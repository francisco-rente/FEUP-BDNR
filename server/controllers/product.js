const Customer = require("../models/product");
const Product = require("../models/product");

const db = require("../db/database");

const productController = {
  getAll: async (req, res, next) => {
    try {
      console.log("params", req.query);
      const distance = req.query.product_distance.split(",").map((x) => +x);
      const quantity = req.query.product_quantity.split(",").map((x) => +x);
      const price = req.query.product_price.split(",").map((x) => +x);

      // TODO: add distance to query
      const query = `SELECT * FROM server.store.products AS product WHERE product.product_id IN (SELECT RAW item.product_id FROM server.store.stores AS s UNNEST s.store_items AS item
          WHERE item.price BETWEEN ${price[0]} AND ${price[1]} AND item.quantity BETWEEN ${quantity[0]} AND ${quantity[1]})
          LIMIT 10
          `;

      console.log("query", query);

      const scope = db.getScope();
      const products = await scope.query(query, (err, result) => {
        if (err) {
          console.log("Error in Store.findAll");
          return err;
        } else {
          console.log("Store.findAll");
          console.log("result", result);
          return result;
        }
      });
      
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
        console.log("params", req.params);
      try {
          console.log("params", req.params);
          Product.findById(req.params.id).then((result) => {      
              res.status(200).json(result);
          }).catch(() => {
              console.log("Error in Product.findById"); 
              res.status(404).json({ message: 'product not found' });
          }); 
      } catch (err) {
          next(err);
    }
  },
  /*
  create: async (req, res, next) => {
    try {
      const customer = await Store.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  },


  update: async (req, res, next) => {
    try {
      const store = await Store.update(req.params.id, req.body);
      if (!store) {
        res.status(404).json({ message: 'store not found' });
      } else {
        res.json(store);
      }
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await Store.delete(req.params.id);
      if (result.cas) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ message: 'store not found' });
      
    } catch (err) {
      next(err);
    }
  }
  */
};

module.exports = productController;
