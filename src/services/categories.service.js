const categoryModel = require('../models/category.model');

async function createCategory(payload) {
  const { name } = payload;
  return categoryModel.create({ name });
}

async function getCategoryWithItems(id) {
  return categoryModel.findWithItems(id);
}

module.exports = {
  createCategory,
  getCategoryWithItems,
};
