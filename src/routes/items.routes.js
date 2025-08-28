const express = require('express');
const router = express.Router();

const {
  createOrUpdateItem,
  getItems,
  getItemById,
  search,
} = require('../controllers/items.controller');

router.post('/items', createOrUpdateItem);
router.get('/items', getItems);

// put search BEFORE :id so "search" won't be captured as an id
router.get('/item/search', search);
router.get('/item/:id', getItemById);

module.exports = router;
