const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');
console.log(storeController);

const cors = require('cors');

router.use(cors());
//router.options('*', cors());
router.use(express.json());

// GET /api/store
router.get('/', storeController.getAll);

// GET /api/store/:id
router.get('/:id', storeController.getById);

router.post('/discount', storeController.applyDiscount);

module.exports = router;
