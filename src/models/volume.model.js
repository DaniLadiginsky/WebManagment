const { query } = require('./db');

// Upsert a volume by its textual value (table: id, value)
async function upsertByValue(value) {
  const sql = `
    INSERT INTO volumes (value)
    VALUES ($1)
    ON CONFLICT (value) DO UPDATE SET value = EXCLUDED.value
    RETURNING id, value;
  `;
  const { rows } = await query(sql, [value]);
  return rows[0];
}

// Ensure multiple volumes exist; returns Map[value] = { id, value }
async function ensureMany(values) {
  const map = new Map();
  for (const v of values) {
    const vol = await upsertByValue(v);
    map.set(v, vol);
  }
  return map;
}

module.exports = {
  upsertByValue,
  ensureMany,
};
