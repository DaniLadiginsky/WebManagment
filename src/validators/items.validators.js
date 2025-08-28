// Minimal, dependency-free validators for item-related payloads.

function validateCreateOrUpdateItem(body = {}) {
    const errors = [];
  
    // name
    if (typeof body.name !== 'string' || !body.name.trim()) {
      errors.push('Field "name" is required (non-empty string).');
    } else if (body.name.length > 200) {
      errors.push('Field "name" is too long (max 200 chars).');
    }
  
    // price
    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      errors.push('Field "price" must be a number.');
    } else if (body.price < 0) {
      errors.push('Field "price" must be >= 0.');
    }
  
    // categoryId
    if (!Number.isInteger(body.categoryId) || body.categoryId <= 0) {
      errors.push('Field "categoryId" must be a positive integer.');
    }
  
    // volumes (at least one)
    if (!Array.isArray(body.volumes) || body.volumes.length === 0) {
      errors.push('Field "volumes" must be a non-empty array.');
    } else {
      body.volumes.forEach((v, idx) => {
        if (!v || typeof v !== 'object') {
          errors.push(`volumes[${idx}] must be an object.`);
          return;
        }
        if (typeof v.value !== 'string' || !v.value.trim()) {
          errors.push(`volumes[${idx}].value is required (non-empty string).`);
        } else if (v.value.length > 200) {
          errors.push(`volumes[${idx}].value is too long (max 200 chars).`);
        }
        if (typeof v.price !== 'number' || Number.isNaN(v.price)) {
          errors.push(`volumes[${idx}].price must be a number.`);
        } else if (v.price < 0) {
          errors.push(`volumes[${idx}].price must be >= 0.`);
        }
      });
    }
  
    if (errors.length) {
      return { value: null, error: new Error(errors.join(' ')) };
    }
  
    // normalized value
    const value = {
      name: String(body.name).trim(),
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      volumes: body.volumes.map(v => ({
        value: String(v.value).trim(),
        price: Number(v.price),
      })),
    };
    return { value, error: null };
  }
  
  function validateIdParam(id) {
    const num = Number(id);
    if (!Number.isInteger(num) || num <= 0) {
      return { value: null, error: new Error('Param "id" must be a positive integer.') };
    }
    return { value: num, error: null };
  }
  
  function validateSearchQuery(q) {
    const s = String(q ?? '').trim();
    if (!s) {
      return { value: null, error: new Error('Query "q" is required (non-empty).') };
    }
    if (s.length > 200) {
      return { value: null, error: new Error('Query "q" is too long (max 200 chars).') };
    }
    return { value: s, error: null };
  }
  
  module.exports = {
    validateCreateOrUpdateItem,
    validateIdParam,
    validateSearchQuery,
  };
  