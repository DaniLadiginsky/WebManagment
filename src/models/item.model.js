const { query, withTransaction } = require('./db');
const volumeModel = require('./volume.model');

/**
 * Upsert item and its volumes (and per-pair prices) inside a transaction.
 * payload: { name, price, categoryId, volumes: [{ value, price }, ...] }
 */
async function upsertWithVolumes(payload) {
  const { name, price, categoryId, volumes = [] } = payload;

  return withTransaction(async (client) => {
    // 1) Upsert item (unique by name)
    const upsertItemSql = `
      INSERT INTO items (name, price, category_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (name)
        DO UPDATE SET price = EXCLUDED.price, category_id = EXCLUDED.category_id
      RETURNING id, name, price, category_id AS "categoryId";
    `;
    const { rows: itemRows } = await client.query(upsertItemSql, [name, price, categoryId]);
    const item = itemRows[0];

    if (!volumes.length) {
      return { ...item, volumes: [] };
    }

    // 2) Ensure all volumes exist (by value)
    const values = volumes.map(v => v.value);
    const volMap = new Map();
    for (const v of values) {
      const { rows } = await client.query(
        `INSERT INTO volumes (value, price)
         VALUES ($1, 0.00)
         ON CONFLICT (value) DO UPDATE SET value = EXCLUDED.value
         RETURNING id, value;`,
        [v]
      );
      volMap.set(v, rows[0]); // value -> { id, value }
    }

    // 3) Upsert items_volumes with provided price per pair
    for (const v of volumes) {
      const vol = volMap.get(v.value);
      await client.query(
        `INSERT INTO items_volumes (item_id, volume_id, price)
         VALUES ($1, $2, $3)
         ON CONFLICT (item_id, volume_id)
           DO UPDATE SET price = EXCLUDED.price`,
        [item.id, vol.id, v.price]
      );
    }

    // 4) Return item with its volumes
    const withVols = await _findByIdWithVolumesClient(client, item.id);
    return withVols;
  });
}

async function findAll() {
  const sql = `
    SELECT i.id, i.name, i.price, i.category_id AS "categoryId",
           c.name AS "categoryName"
    FROM items i
    JOIN categories c ON c.id = i.category_id
    ORDER BY i.id ASC;
  `;
  const { rows } = await query(sql);
  return rows;
}

async function findByIdWithVolumes(id) {
  return withTransaction(async (client) => _findByIdWithVolumesClient(client, id));
}

async function _findByIdWithVolumesClient(client, id) {
  const itemSql = `
    SELECT i.id, i.name, i.price, i.category_id AS "categoryId"
    FROM items i
    WHERE i.id = $1
    LIMIT 1;
  `;
  const { rows: itemRows } = await client.query(itemSql, [id]);
  if (!itemRows.length) return null;

  const volsSql = `
    SELECT v.value, iv.price
    FROM items_volumes iv
    JOIN volumes v ON v.id = iv.volume_id
    WHERE iv.item_id = $1
    ORDER BY v.value ASC;
  `;
  const { rows: vols } = await client.query(volsSql, [id]);

  return { ...itemRows[0], volumes: vols };
}

async function searchByName(term) {
  if (!term) return [];
  const { rows } = await query(
    `SELECT id, name, price, category_id AS "categoryId"
     FROM items
     WHERE name ILIKE '%' || $1 || '%'
     ORDER BY name ASC`,
    [term]
  );
  return rows;
}

module.exports = {
  upsertWithVolumes,
  findAll,
  findByIdWithVolumes,
  searchByName,
};
