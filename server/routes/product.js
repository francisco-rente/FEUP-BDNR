const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// GET /api/store
router.get('/', productController.getAll);

// GET /api/product/id
router.get('/:id', productController.getById);

router.get('/:id/stores', productController.getStoresByProductId);

router.post('/:id/addReview', productController.addReview);

// POST /api/store
//router.post('/', storeController.create);

// PUT /api/store/:id
//router.put('/:id', storeController.update);

// DELETE /api/store/:id
//router.delete('/:id', storeController.delete);

module.exports = router;
