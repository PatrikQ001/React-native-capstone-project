import * as SQLite from 'expo-sqlite';

let dbInstance = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('little_lemon');
  }
  return dbInstance;
}

export async function createTable() {
  try {
    const db = await getDb();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menuitems (
        id INTEGER PRIMARY KEY NOT NULL,
        uuid TEXT,
        name TEXT,
        price TEXT,
        description TEXT,
        image TEXT,
        category TEXT
      );
    `);
  } catch (error) {
    console.error(error);
  }
}

export async function getMenuItems() {
  try {
    const db = await getDb();
    const rows = await db.getAllAsync('SELECT * FROM menuitems');
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function saveMenuItems(menuItems) {
  if (!menuItems?.length) return;

  const db = await getDb();

  const values = menuItems.map(item =>
    `('${item.uuid || item.id}', '${item.name}', '${item.price}', '${item.description}', '${item.image}', '${item.category}')`
  ).join(', ');

  const query = `
    INSERT INTO menuitems (uuid, name, price, description, image, category)
    VALUES ${values};
  `;

  try {
    await db.execAsync(query);
  } catch (error) {
    console.error(error);
  }
}

export async function filterByQueryAndCategories(query, activeCategories) {
  const db = await getDb();

  try {
    if (!activeCategories.length) {
      return [];
    }

    const placeholders = activeCategories.map(() => '?').join(', ');
    const sql = `
      SELECT * FROM menuitems
      WHERE name LIKE ? AND category IN (${placeholders});
    `;
    const params = [`%${query}%`, ...activeCategories];

    const rows = await db.getAllAsync(sql, params);
    return rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}
