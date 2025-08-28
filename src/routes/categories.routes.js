const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategoryById,
} = require('../controllers/categories.controller');

router.post('/category', createCategory);
router.get('/category/:id', getCategoryById);

module.exports = router;
