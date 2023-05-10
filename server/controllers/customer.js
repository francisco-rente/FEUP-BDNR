const Customer = require('../models/customer');
const db = require("../db/database");



const customerController = {
    getAll: async (req, res, next) => {
        try {
            const customer = await Customer.findAll();
            res.json(customer);
        } catch (err) {
            next(err);
        }
    },

    getById: async (req, res, next) => {
        try {      
            
            // TODO: collect these queries in a JOIN 
            // https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/join.html#ansi-join-with-arrays-on-both-sides
            
            const customer = await Customer.findById(parseInt(req.params.id));
            if (!customer) res.status(404).json({ message: 'Customer not found' });

            const reviews = customer.content.products_reviews_pairs.map((pair) => {
                return pair.review_id;
            })
            
            const query = `SELECT p.product_id, p.product_title,r FROM server.store.products AS p UNNEST p.reviews AS r WHERE r.review_id IN ${JSON.stringify(reviews)}`;
            const scope = db.getScope(); 
            const data = await scope.query(query, (err, result) => err ? err : result);
            if (data.error) res.status(404).json({ message: 'Customer not found' });
            console.log("data", data);
            
            const response = {
                customer: customer.content,
                reviews: data.rows
            }

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    },
    login: async (req, res, next) => {
        try {
            const userId = req.body.userId;
            const customer = await Customer.findById(userId);
            if (!customer)  res.status(404).json({ message: 'Customer not found' });
            res.json(customer);
        }
        catch (err) {
            next(err);
        }
    }
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


module.exports = customerController;
