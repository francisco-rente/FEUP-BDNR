const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');


router.get('/', reviewController.getAll);

router.get('/id/:id', reviewController.getById);

router.get('/fts/:review', reviewController.getByFTS);

module.exports = router;
