const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

// Función para inicializar la tabla products
const initProductsTable = () => {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        imageUri TEXT,
        is_deleted INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Error creando tabla products:', err.message);
        reject(err);
      } else {
        console.log('✅ Tabla products creada/verificada correctamente');
        resolve();
      }
    });
  });
};

// Función para insertar un nuevo producto
const createProduct = (productData) => {
  return new Promise((resolve, reject) => {
    const { name, brand, quantity, price, category, imageUri } = productData;

    const insertSQL = `
      INSERT INTO products (name, brand, quantity, price, category, imageUri)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(insertSQL, [name, brand, quantity, price, category, imageUri || null], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...productData });
      }
    });
  });
};

// Función para obtener un producto por ID
const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM products WHERE id = ?';

    db.get(selectSQL, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM products
      WHERE is_deleted = 0
      ORDER BY created_at DESC
    `;

    db.all(selectSQL, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para actualizar un producto
const updateProduct = (id, productData) => {
  return new Promise((resolve, reject) => {
    const { name, brand, quantity, price, category, imageUri } = productData;

    const updateSQL = `
      UPDATE products 
      SET name = ?, brand = ?, quantity = ?, price = ?, category = ?, imageUri = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateSQL, [name, brand, quantity, price, category, imageUri || null, id], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ id, ...productData });
        } else {
          reject(new Error('Producto no encontrado'));
        }
      }
    });
  });
};

// Función para eliminar un producto
const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const updateSQL = 'UPDATE products SET is_deleted = 1 WHERE id = ?';

    db.run(updateSQL, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ message: 'Producto marcado como eliminado correctamente' });
        } else {
          reject(new Error('Producto no encontrado'));
        }
      }
    });
  });
};

// Exportar las funciones
module.exports = {
  initProductsTable,
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  db // Exportar la instancia de db
};

// Inicializar la tabla de productos al cargar el módulo
initProductsTable().catch(console.error);
