const itemModel = require('../models/item.model');

/**
 * Creates or updates an item and its volumes (upsert semantics).
 * Expects: { name, price, categoryId, volumes: [{ value, price }, ...] }
 */
async function createOrUpdateItem(payload) {
  const { name, price, categoryId, volumes } = payload;
  return itemModel.upsertWithVolumes({ name, price, categoryId, volumes });
}

async function getAllItems() {
  return itemModel.findAll();
}

async function getItemById(id) {
  return itemModel.findByIdWithVolumes(id);
}

module.exports = {
  createOrUpdateItem,
  getAllItems,
  getItemById,
};
