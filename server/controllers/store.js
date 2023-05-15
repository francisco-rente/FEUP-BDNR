const Store = require('../models/store');
console.log("Store", Store);
const storeController = {
    getAll:async (_, res) => {
        console.log("Store.findAll");
        let stores = Store.findAll();
        await stores.then((result) => {
            res.status(200);
            res.json(result);
        }).catch((err) => {
            res.status(500);
            res.json({ message: err.message });
        }); 
        res.send(); 
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

  applyDiscount: async (req, res, next) => {
    try {
      const store = await Store.applyDiscount(req.body.store_id, req.body.discount);
      if (!store) {
        res.status(404).json({ message: 'Error applying discount' });
      } else {
        res.json(store);
      }
    } catch (err) {
      next(err);
    }
  }
};


module.exports = storeController;
