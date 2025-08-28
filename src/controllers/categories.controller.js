const categoriesService = require('../services/categories.service');
const {
  validateCreateCategory,
  validateIdParam,
} = require('../validators/category.validator');

async function createCategory(req, res, next) {
  try {
    const { value, error } = validateCreateCategory(req.body);
    if (error) {
      return res.status(400).json({ success: false, code: 400, error: error.message });
    }
    const category = await categoriesService.createCategory(value);
    return res.status(200).json({ success: true, code: 200, data: category });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, code: 409, error: 'Category name already exists' });
    }
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { value, error } = validateIdParam(req.params.id);
    if (error) {
      return res.status(400).json({ success: false, code: 400, error: error.message });
    }
    const category = await categoriesService.getCategoryWithItems(value);
    if (!category) {
      return res.status(404).json({ success: false, code: 404, error: 'Category not found' });
    }
    return res.status(200).json({ success: true, code: 200, data: { category } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCategory,
  getCategoryById,
};
