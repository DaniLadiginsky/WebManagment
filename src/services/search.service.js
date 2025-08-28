const categoryModel = require('../models/category.model');
const itemModel = require('../models/item.model');

/**
 * Full-text-ish search across categories and items by name.
 */
async function searchAll(q) {
  const term = String(q || '').trim();
  const [categories, items] = await Promise.all([
    categoryModel.searchByName(term),
    itemModel.searchByName(term),
  ]);
  return { categories, items };
}

module.exports = {
  searchAll,
};
