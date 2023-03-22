const Book = require('../models/book');

const bookController = {
  getAll: async (req, res, next) => {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
      } else {
        res.json(book);
      }
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const book = await Book.create(req.body);
      res.status(201).json(book);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const book = await Book.update(req.params.id, req.body);
      if (!book) {
        res.status(404).json({ message: 'Book not found' });
      } else {
        res.json(book);
      }
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const result = await Book.delete(req.params.id);
      if (result.cas) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (err) {
      next(err);
    }
  }
};

module.exports = bookController;
