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
router.get('/item/:id', getItemById);
router.get('/item/search', search);

module.exports = router;
