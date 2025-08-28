const { query } = require('./db');

async function create({ name }) {
  const sql = `
    INSERT INTO categories (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name;
  `;
  const { rows } = await query(sql, [name]);
  // If existed, rows.length === 0 → fetch existing to return
  if (rows.length) return rows[0];

  const { rows: existed } = await query(
    'SELECT id, name FROM categories WHERE name = $1',
    [name]
  );
  return existed[0] || null;
}

async function findWithItems(id) {
  const catSql = 'SELECT id, name FROM categories WHERE id = $1';
  const { rows: catRows } = await query(catSql, [id]);
  if (!catRows.length) return null;

  const itemsSql = `
    SELECT i.id, i.name, i.price, i.category_id AS "categoryId"
    FROM items i
    WHERE i.category_id = $1
    ORDER BY i.id ASC;
  `;
  const { rows: items } = await query(itemsSql, [id]);

  return {
    id: catRows[0].id,
    name: catRows[0].name,
    items,
  };
}

async function searchByName(term) {
  if (!term) return [];
  const { rows } = await query(
    `SELECT id, name
     FROM categories
     WHERE name ILIKE '%' || $1 || '%'
     ORDER BY name ASC`,
    [term]
  );
  return rows;
}

module.exports = { create, findWithItems, searchByName };
