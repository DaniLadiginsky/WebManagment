const { query } = require('./db');

/** Upsert a volume by its textual value; returns { id, value } */
async function upsertByValue(value) {
  const sql = `
    INSERT INTO volumes (value, price)
    VALUES ($1, 0.00)                           -- default price, overridden per item in items_volumes
    ON CONFLICT (value) DO UPDATE SET value = EXCLUDED.value
    RETURNING id, value;
  `;
  const { rows } = await query(sql, [value]);
  return rows[0];
}

/** Ensure multiple volumes exist; returns map value -> {id,value} */
async function ensureMany(values) {
  const map = new Map();
  for (const v of values) {
    const vol = await upsertByValue(v);
    map.set(v, vol);
  }
  return map;
}

module.exports = { upsertByValue, ensureMany };
