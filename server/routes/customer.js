const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

// GET /api/customer
router.get('/', customerController.getAll);

// GET /api/customer/:id
router.get('/:id', customerController.getById);

// POST /api/customer/login
router.post('/login', customerController.login);

// POST were it passes the following paranms in the body: customer_id, product_id, review_id into the function deleteReview
router.post('/deleteReview/', customerController.deleteReview);

// POST /api/store
//router.post('/', storeController.create);

// PUT /api/store/:id
//router.put('/:id', storeController.update);

// DELETE /api/store/:id
//router.delete('/:id', storeController.delete);

module.exports = router;
