const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');

// GET /api/books
router.get('/', bookController.getAll);

// GET /api/books/:id
router.get('/:id', bookController.getById);

// POST /api/books
router.post('/', bookController.create);

// PUT /api/books/:id
router.put('/:id', bookController.update);

// DELETE /api/books/:id
router.delete('/:id', bookController.delete);

module.exports = router;
