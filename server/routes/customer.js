const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

// GET /api/customer
router.get('/', customerController.getAll);

// GET /api/customer/:id
router.get('/:id', customerController.getById);

// POST /api/store
//router.post('/', storeController.create);

// PUT /api/store/:id
//router.put('/:id', storeController.update);

// DELETE /api/store/:id
//router.delete('/:id', storeController.delete);

module.exports = router;
