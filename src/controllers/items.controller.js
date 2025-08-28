const itemsService = require('../services/items.service');
const searchService = require('../services/search.service');
const {
  validateCreateOrUpdateItem,
  validateIdParam,
  validateSearchQuery,
} = require('../validators/items.validator');

async function createOrUpdateItem(req, res, next) {
  try {
    const { value, error } = validateCreateOrUpdateItem(req.body);
    if (error) {
      return res.status(400).json({ success: false, code: 400, error: error.message });
    }
    const item = await itemsService.createOrUpdateItem(value);
    return res.status(200).json({ success: true, code: 200, data: item });
  } catch (err) {
    next(err);
  }
}

async function getItems(req, res, next) {
  try {
    const items = await itemsService.getAllItems();
    return res.status(200).json({ success: true, code: 200, data: { items } });
  } catch (err) {
    next(err);
  }
}

async function getItemById(req, res, next) {
  try {
    const { value, error } = validateIdParam(req.params.id);
    if (error) {
      return res.status(400).json({ success: false, code: 400, error: error.message });
    }
    const item = await itemsService.getItemById(value);
    if (!item) {
      return res.status(404).json({ success: false, code: 404, error: 'Item not found' });
    }
    return res.status(200).json({ success: true, code: 200, data: item });
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const { value, error } = validateSearchQuery(req.query.q);
    if (error) {
      return res.status(400).json({ success: false, code: 400, error: error.message });
    }
    const { categories, items } = await searchService.searchAll(value);
    return res.status(200).json({
      success: true,
      code: 200,
      data: { categories, items },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrUpdateItem,
  getItems,
  getItemById,
  search,
};
