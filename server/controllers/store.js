const Store = require('../models/store');

const storeController = {
  getAll: async (req, res, next) => {
    try {
      const stores = await Store.findAll();
      res.json(stores);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) {
        res.status(404).json({ message: 'Store not found' });
      } else {
        res.json(Store);
      }
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const store = await Store.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  },

  /*

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


module.exports = storeController;
