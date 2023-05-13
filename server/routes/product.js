const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// GET /api/store
router.get('/', productController.getAll);

// GET /api/product/id
router.get('/:id', productController.getById);

router.get('/:id/stores', productController.getStoresByProductId);

router.post('/:id/addReview', productController.addReview);

router.get('/fts/:query', productController.getByFTS);

module.exports = router;
