// Minimal, dependency-free validators for category-related payloads.

function validateCreateCategory(body = {}) {
    const errors = [];
  
    if (typeof body.name !== 'string' || !body.name.trim()) {
      errors.push('Field "name" is required (non-empty string).');
    } else if (body.name.length > 200) {
      errors.push('Field "name" is too long (max 200 chars).');
    }
  
    if (errors.length) {
      return { value: null, error: new Error(errors.join(' ')) };
    }
  
    const value = { name: String(body.name).trim() };
    return { value, error: null };
  }
  
  function validateIdParam(id) {
    const num = Number(id);
    if (!Number.isInteger(num) || num <= 0) {
      return { value: null, error: new Error('Param "id" must be a positive integer.') };
    }
    return { value: num, error: null };
  }
  
  module.exports = {
    validateCreateCategory,
    validateIdParam,
  };
  