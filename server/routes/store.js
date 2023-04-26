const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');

// GET /api/store
router.get('/', storeController.getAll);

// GET /api/store/:id
router.get('/:id', storeController.getById);

// POST /api/store
//router.post('/', storeController.create);

// PUT /api/store/:id
//router.put('/:id', storeController.update);

// DELETE /api/store/:id
//router.delete('/:id', storeController.delete);

module.exports = router;
