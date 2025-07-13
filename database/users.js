const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

// Función para inicializar la tabla users
const initUsersTable = () => {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        cedula TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefono TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        tipo TEXT CHECK(tipo IN ('cliente', 'krizoworker')) NOT NULL,
        is_email_verified INTEGER DEFAULT 0,
        verification_code TEXT,
        verification_code_expires DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Error creando tabla users:', err.message);
        reject(err);
      } else {
        console.log('✅ Tabla users creada/verificada correctamente');
        
        // Agregar columnas si no existen (para tablas existentes)
        const addColumnsSQL = [
          'ALTER TABLE users ADD COLUMN verification_code TEXT',
          'ALTER TABLE users ADD COLUMN verification_code_expires DATETIME',
          'ALTER TABLE users ADD COLUMN is_email_verified INTEGER DEFAULT 0'
        ];

        let completedColumns = 0;
        addColumnsSQL.forEach((columnSQL, index) => {
          db.run(columnSQL, (err) => {
            // Ignorar errores si la columna ya existe
            if (err && !err.message.includes('duplicate column name')) {
              console.error(`❌ Error agregando columna ${index}:`, err.message);
            } else if (!err) {
              console.log(`✅ Columna ${index + 1} agregada/verificada`);
            }
            completedColumns++;
            if (completedColumns === addColumnsSQL.length) {
              // Crear índices para mejorar el rendimiento de búsquedas únicas
              const createIndexesSQL = [
                'CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula)',
                'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
                'CREATE INDEX IF NOT EXISTS idx_users_telefono ON users(telefono)',
                'CREATE INDEX IF NOT EXISTS idx_users_tipo ON users(tipo)'
              ];

              let completedIndexes = 0;
              createIndexesSQL.forEach((indexSQL, index) => {
                db.run(indexSQL, (err) => {
                  if (err) {
                    console.error(`❌ Error creando índice ${index}:`, err.message);
                  } else {
                    console.log(`✅ Índice ${index + 1} creado/verificado`);
                  }
                  completedIndexes++;
                  if (completedIndexes === createIndexesSQL.length) {
                    resolve();
                  }
                });
              });
            }
          });
        });
      }
    });
  });
};

// Función para insertar un nuevo usuario
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { nombres, apellidos, cedula, email, telefono, password, tipo } = userData;
    
    const insertSQL = `
      INSERT INTO users (nombres, apellidos, cedula, email, telefono, password, tipo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertSQL, [nombres, apellidos, cedula, email, telefono, password, tipo], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          if (err.message.includes('cedula')) {
            reject(new Error('La cédula ya está registrada'));
          } else if (err.message.includes('email')) {
            reject(new Error('El email ya está registrado'));
          } else if (err.message.includes('telefono')) {
            reject(new Error('El teléfono ya está registrado'));
          } else {
            reject(new Error('Error de restricción única'));
          }
        } else {
          reject(err);
        }
      } else {
        resolve({ id: this.lastID, ...userData });
      }
    });
  });
};

// Función para obtener un usuario por ID
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM users WHERE id = ?';
    
    db.get(selectSQL, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Función para obtener un usuario por email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM users WHERE email = ?';
    
    db.get(selectSQL, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Función para obtener un usuario por cédula
const getUserByCedula = (cedula) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM users WHERE cedula = ?';
    
    db.get(selectSQL, [cedula], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Función para obtener un usuario por teléfono
const getUserByTelefono = (telefono) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM users WHERE telefono = ?';
    
    db.get(selectSQL, [telefono], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Función para obtener todos los usuarios
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT id, nombres, apellidos, cedula, email, telefono, tipo, created_at, updated_at FROM users';
    
    db.all(selectSQL, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para actualizar un usuario
const updateUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    const { nombres, apellidos, cedula, email, telefono, password, tipo } = userData;
    
    const updateSQL = `
      UPDATE users 
      SET nombres = ?, apellidos = ?, cedula = ?, email = ?, telefono = ?, password = ?, tipo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateSQL, [nombres, apellidos, cedula, email, telefono, password, tipo, id], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          if (err.message.includes('cedula')) {
            reject(new Error('La cédula ya está registrada por otro usuario'));
          } else if (err.message.includes('email')) {
            reject(new Error('El email ya está registrado por otro usuario'));
          } else if (err.message.includes('telefono')) {
            reject(new Error('El teléfono ya está registrado por otro usuario'));
          } else {
            reject(new Error('Error de restricción única'));
          }
        } else {
          reject(err);
        }
      } else {
        if (this.changes > 0) {
          resolve({ id, ...userData });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para eliminar un usuario
const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const deleteSQL = 'DELETE FROM users WHERE id = ?';
    
    db.run(deleteSQL, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ message: 'Usuario eliminado correctamente' });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para verificar si existe un usuario con email, cédula o teléfono
const checkUserExists = (email, cedula, telefono) => {
  return new Promise((resolve, reject) => {
    const checkSQL = `
      SELECT 
        CASE WHEN EXISTS(SELECT 1 FROM users WHERE email = ?) THEN 'email' 
             WHEN EXISTS(SELECT 1 FROM users WHERE cedula = ?) THEN 'cedula'
             WHEN EXISTS(SELECT 1 FROM users WHERE telefono = ?) THEN 'telefono'
             ELSE 'none' 
        END as exists_field
    `;
    
    db.get(checkSQL, [email, cedula, telefono], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.exists_field);
      }
    });
  });
};

// Función para generar código de verificación
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para actualizar código de verificación de usuario
const updateUserVerificationCode = (userId, verificationCode) => {
  return new Promise((resolve, reject) => {
    const updateSQL = `
      UPDATE users 
      SET verification_code = ?, verification_code_expires = datetime('now', '+10 minutes'), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateSQL, [verificationCode, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ userId, verificationCode });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para verificar email de usuario
const verifyUserEmail = (userId, verificationCode) => {
  return new Promise((resolve, reject) => {
    const verifySQL = `
      UPDATE users 
      SET is_email_verified = 1, verification_code = NULL, verification_code_expires = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND verification_code = ? AND verification_code_expires > datetime('now')
    `;
    
    db.run(verifySQL, [userId, verificationCode], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: 'Email verificado correctamente' });
        } else {
          reject(new Error('Código inválido o expirado'));
        }
      }
    });
  });
};

// Función para cerrar la conexión a la base de datos
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Conexión a la base de datos cerrada');
        resolve();
      }
    });
  });
};

module.exports = {
  initUsersTable,
  createUser,
  getUserById,
  getUserByEmail,
  getUserByCedula,
  getUserByTelefono,
  getAllUsers,
  updateUser,
  deleteUser,
  checkUserExists,
  updateUserVerificationCode,
  verifyUserEmail,
  closeDatabase
}; 