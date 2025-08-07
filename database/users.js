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
        document_url TEXT,
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
          'ALTER TABLE users ADD COLUMN is_email_verified INTEGER DEFAULT 0',
          'ALTER TABLE users ADD COLUMN document_url TEXT',
          'ALTER TABLE users ADD COLUMN services TEXT',
          'ALTER TABLE users ADD COLUMN ciudad TEXT',
          'ALTER TABLE users ADD COLUMN zona TEXT',
          'ALTER TABLE users ADD COLUMN descripcion TEXT',
          'ALTER TABLE users ADD COLUMN disponibilidad TEXT',
          'ALTER TABLE users ADD COLUMN profile_image_url TEXT',
          'ALTER TABLE users ADD COLUMN paypal_email TEXT',
          'ALTER TABLE users ADD COLUMN binance_id TEXT',
          'ALTER TABLE users ADD COLUMN service_phone TEXT',
          'ALTER TABLE users ADD COLUMN push_token TEXT'
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

const initShopsTable = () => {
  return new Promise((resolve, reject) => {
    // 1. SQL para crear la tabla 'shops' si no existe
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS shops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        descripcion TEXT,
        ciudad TEXT,
        zona TEXT,
        disponibilidad TEXT,
        services TEXT, -- Almacenado como una cadena de texto separada por comas (ej. 'repuestos,mecanica')
        profile_image_url TEXT, -- URL de la imagen de perfil de la tienda
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.transaction(tx => {
      tx.executeSql(createTableSQL, [],
        () => {
          console.log('✅ Tabla shops creada/verificada correctamente.');

          // 2. SQL para agregar columnas si no existen (útil para migraciones)
          // Si añades nuevas columnas en el futuro, agrégalas aquí.
          const addColumnsSQL = [
            // Ejemplos de columnas que podrías añadir más tarde si las necesitaras:
            // 'ALTER TABLE shops ADD COLUMN rating REAL DEFAULT 0',
            // 'ALTER TABLE shops ADD COLUMN is_verified INTEGER DEFAULT 0'
            // Ya incluimos profile_image_url en el CREATE TABLE, pero si no estuviera:
            // 'ALTER TABLE shops ADD COLUMN profile_image_url TEXT'
          ];

          let completedColumns = 0;
          if (addColumnsSQL.length === 0) {
            // Si no hay columnas para añadir, pasamos directamente a crear índices
            resolveIndexes();
            return;
          }

          addColumnsSQL.forEach((columnSQL, index) => {
            tx.executeSql(columnSQL, [],
              () => {
                console.log(`✅ Columna ${index + 1} agregada/verificada.`);
                completedColumns++;
                if (completedColumns === addColumnsSQL.length) {
                  resolveIndexes();
                }
              },
              (_, error) => {
                // Ignorar el error si la columna ya existe
                if (error.message.includes('duplicate column name')) {
                  console.log(`ℹ️ Columna ${index + 1} ya existe, ignorando.`);
                  completedColumns++;
                  if (completedColumns === addColumnsSQL.length) {
                    resolveIndexes();
                  }
                } else {
                  console.error(`❌ Error agregando columna ${index + 1}:`, error.message);
                  reject(error);
                }
                return false; // Indicar que hubo un error o que ya existe
              }
            );
          });

          const resolveIndexes = () => {
            // 3. SQL para crear índices para mejorar el rendimiento de búsquedas
            const createIndexesSQL = [
              'CREATE INDEX IF NOT EXISTS idx_shops_name ON shops(name)',
              'CREATE INDEX IF NOT EXISTS idx_shops_ciudad ON shops(ciudad)',
              'CREATE INDEX IF NOT EXISTS idx_shops_services ON shops(services)'
            ];

            let completedIndexes = 0;
            createIndexesSQL.forEach((indexSQL, index) => {
              tx.executeSql(indexSQL, [],
                () => {
                  console.log(`✅ Índice ${index + 1} creado/verificado.`);
                  completedIndexes++;
                  if (completedIndexes === createIndexesSQL.length) {
                    resolve(); // Resuelve la promesa principal una vez todo esté listo
                  }
                },
                (_, error) => {
                  console.error(`❌ Error creando índice ${index + 1}:`, error.message);
                  reject(error);
                  return false;
                }
              );
            });
          };
        },
        (_, error) => {
          console.error('❌ Error creando tabla shops:', error.message);
          reject(error);
          return false; // Indicar que hubo un error
        }
      );
    });
  });
};

const saveShop = async (shopData) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO shops (name, descripcion, ciudad, zona, disponibilidad, services, profile_image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          shopData.name,
          shopData.descripcion,
          shopData.ciudad,
          shopData.zona,
          shopData.disponibilidad,
          shopData.services ? shopData.services.join(',') : '', // Convertir array a cadena
          shopData.profile_image_url || null // Manejar caso donde no hay imagen
        ],
        (_, { insertId }) => {
          console.log('Tienda guardada con ID:', insertId);
          resolve(insertId);
        },
        (_, error) => {
          console.error('Error al guardar la tienda:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Función para insertar un nuevo usuario
const createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const { nombres, apellidos, cedula, email, telefono, password, tipo, document_url } = userData;
    
    // Convertir email a minúsculas para mantener consistencia
    const normalizedEmail = email.toLowerCase();
    
    const insertSQL = `
      INSERT INTO users (nombres, apellidos, cedula, email, telefono, password, tipo, document_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertSQL, [nombres, apellidos, cedula, normalizedEmail, telefono, password, tipo, document_url || null], function(err) {
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
        resolve({ id: this.lastID, ...userData, email: normalizedEmail });
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

// Función para obtener un usuario por email (case-insensitive)
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const selectSQL = 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)';
    
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

// Función para actualizar un usuario (requiere todos los campos)
const updateUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    const { nombres, apellidos, cedula, email, telefono, password, tipo } = userData;
    
    // Convertir email a minúsculas para mantener consistencia
    const normalizedEmail = email ? email.toLowerCase() : email;
    
    const updateSQL = `
      UPDATE users 
      SET nombres = ?, apellidos = ?, cedula = ?, email = ?, telefono = ?, password = ?, tipo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(updateSQL, [nombres, apellidos, cedula, normalizedEmail, telefono, password, tipo, id], function(err) {
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
          resolve({ id, ...userData, email: normalizedEmail });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para actualizar campos específicos de un usuario
const updateUserFields = (id, updateData) => {
  return new Promise((resolve, reject) => {
    // Construir la consulta SQL dinámicamente basada en los campos proporcionados
    const fields = [];
    const values = [];
    
    if (updateData.nombres !== undefined) {
      fields.push('nombres = ?');
      values.push(updateData.nombres);
    }
    
    if (updateData.apellidos !== undefined) {
      fields.push('apellidos = ?');
      values.push(updateData.apellidos);
    }
    
    if (updateData.telefono !== undefined) {
      fields.push('telefono = ?');
      values.push(updateData.telefono);
    }
    
    if (fields.length === 0) {
      reject(new Error('No se proporcionaron campos para actualizar'));
      return;
    }
    
    const updateSQL = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    values.push(id);
    
    console.log('🔄 Actualizando usuario con SQL:', updateSQL);
    console.log('📤 Valores:', values);
    
    db.run(updateSQL, values, function(err) {
      if (err) {
        console.error('❌ Error actualizando usuario:', err);
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
          console.log('✅ Usuario actualizado correctamente');
          resolve({ id, ...updateData });
        } else {
          console.log('❌ Usuario no encontrado');
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

// Función para verificar si existe un usuario con email, cédula o teléfono (case-insensitive para email)
const checkUserExists = (email, cedula, telefono) => {
  return new Promise((resolve, reject) => {
    const checkSQL = `
      SELECT 
        CASE WHEN EXISTS(SELECT 1 FROM users WHERE LOWER(email) = LOWER(?)) THEN 'email' 
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

// Función para actualizar perfil de servicios
const updateUserServiceProfile = (userId, profileData) => {
  return new Promise((resolve, reject) => {
    const { services, ciudad, zona, descripcion, disponibilidad, profileImage, servicePhone } = profileData;
    
    // Convertir array de servicios a JSON string
    const servicesJson = JSON.stringify(services);
    
    console.log('🔄 updateUserServiceProfile - Datos recibidos:', {
      userId,
      services,
      ciudad,
      zona,
      descripcion,
      disponibilidad,
      profileImage,
      servicePhone
    });
    
    const updateSQL = `
      UPDATE users 
      SET services = ?, ciudad = ?, zona = ?, descripcion = ?, disponibilidad = ?, 
          profile_image_url = ?, service_phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const values = [servicesJson, ciudad, zona, descripcion, disponibilidad, profileImage, servicePhone, userId];
    console.log('📤 updateUserServiceProfile - SQL:', updateSQL);
    console.log('📤 updateUserServiceProfile - Valores:', values);
    
    db.run(updateSQL, values, function(err) {
      if (err) {
        console.error('❌ Error en updateUserServiceProfile:', err);
        reject(err);
      } else {
        console.log('✅ updateUserServiceProfile - Cambios realizados:', this.changes);
        if (this.changes > 0) {
          resolve({ 
            success: true, 
            message: 'Perfil de servicios actualizado correctamente',
            userId,
            profileData: {
              services,
              ciudad,
              zona,
              descripcion,
              disponibilidad,
              profileImage,
              servicePhone
            }
          });
        } else {
          console.log('❌ updateUserServiceProfile - Usuario no encontrado');
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para actualizar métodos de pago
const updateUserPaymentMethods = (userId, paymentData) => {
  return new Promise((resolve, reject) => {
    const { paypalEmail, binanceId } = paymentData;
    
    const updateSQL = `
      UPDATE users 
      SET paypal_email = ?, binance_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateSQL, [paypalEmail, binanceId, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ 
            success: true, 
            message: 'Métodos de pago actualizados correctamente',
            userId,
            paymentData: {
              paypalEmail,
              binanceId
            }
          });
        } else {
          reject(new Error('Usuario no encontrado'));
        }
      }
    });
  });
};

// Función para actualizar token de notificación de un usuario
const updateUserPushToken = (userId, pushToken) => {
  return new Promise((resolve, reject) => {
    const updateSQL = `
      UPDATE users 
      SET push_token = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateSQL, [pushToken, userId], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ 
            success: true, 
            message: 'Token de notificación actualizado correctamente',
            userId,
            push_token: pushToken
          });
        } else {
          reject(new Error('Usuario no encontrado'));
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

// Función para inicializar la tabla de solicitudes
const initRequestsTable = () => {
  return new Promise((resolve, reject) => {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        worker_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
        client_location TEXT,
        client_phone TEXT,
        client_name TEXT,
        worker_name TEXT,
        latitude REAL,
        longitude REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES users (id),
        FOREIGN KEY (worker_id) REFERENCES users (id)
      )
    `;

    const createChatSessionsTableSQL = `
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id INTEGER NOT NULL,
        client_id INTEGER NOT NULL,
        service_type TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        agreed_price TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES users (id),
        FOREIGN KEY (client_id) REFERENCES users (id)
      )
    `;

    const createMessagesTableSQL = `
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        sender_type TEXT NOT NULL CHECK(sender_type IN ('client', 'worker')),
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read INTEGER DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Error creando tabla requests:', err.message);
        reject(err);
      } else {
        console.log('✅ Tabla requests creada/verificada correctamente');
        
        // Crear tabla de sesiones de chat
        db.run(createChatSessionsTableSQL, (err) => {
          if (err) {
            console.error('❌ Error creando tabla chat_sessions:', err.message);
            reject(err);
          } else {
            console.log('✅ Tabla chat_sessions creada/verificada correctamente');
            
            // Crear tabla de mensajes
            db.run(createMessagesTableSQL, (err) => {
              if (err) {
                console.error('❌ Error creando tabla messages:', err.message);
                reject(err);
              } else {
                console.log('✅ Tabla messages creada/verificada correctamente');
                
                // Crear índices para mejorar el rendimiento
                const createIndexesSQL = [
                  'CREATE INDEX IF NOT EXISTS idx_requests_client_id ON requests(client_id)',
                  'CREATE INDEX IF NOT EXISTS idx_requests_worker_id ON requests(worker_id)',
                  'CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status)',
                  'CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at)',
                  'CREATE INDEX IF NOT EXISTS idx_chat_sessions_worker_id ON chat_sessions(worker_id)',
                  'CREATE INDEX IF NOT EXISTS idx_chat_sessions_client_id ON chat_sessions(client_id)',
                  'CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status)',
                  'CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id)',
                  'CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)',
                  'CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)'
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
                      // Agregar columnas de coordenadas si no existen
                      const addColumnsSQL = [
                        'ALTER TABLE requests ADD COLUMN latitude REAL',
                        'ALTER TABLE requests ADD COLUMN longitude REAL'
                      ];

                                        let completedColumns = 0;
                  addColumnsSQL.forEach((columnSQL, index) => {
                    db.run(columnSQL, (err) => {
                      // Ignorar errores si la columna ya existe
                      if (err && !err.message.includes('duplicate column name')) {
                        console.error(`❌ Error agregando columna de coordenadas ${index}:`, err.message);
                      } else if (!err) {
                        console.log(`✅ Columna de coordenadas ${index + 1} agregada/verificada`);
                      }
                      completedColumns++;
                      if (completedColumns === addColumnsSQL.length) {
                        // Migrar tabla messages existente de forma más segura
                        const migrateMessagesSQL = [
                          'ALTER TABLE messages ADD COLUMN session_id INTEGER',
                          'ALTER TABLE messages ADD COLUMN temp_request_id INTEGER',
                          'UPDATE messages SET temp_request_id = request_id WHERE request_id IS NOT NULL',
                          'UPDATE messages SET session_id = temp_request_id WHERE temp_request_id IS NOT NULL'
                        ];

                        let completedMigration = 0;
                        migrateMessagesSQL.forEach((migrationSQL, index) => {
                          db.run(migrationSQL, (err) => {
                            // Ignorar errores si la columna ya existe o no existe
                            if (err && !err.message.includes('duplicate column name') && 
                                !err.message.includes('no such column') &&
                                !err.message.includes('table messages has no column')) {
                              console.error(`❌ Error en migración ${index}:`, err.message);
                              
                              // Si hay error crítico, recrear la tabla
                              if (err.message.includes('foreign key') || err.message.includes('session_id')) {
                                console.log('🔄 Recreando tabla messages...');
                                db.run('DROP TABLE IF EXISTS messages', (dropErr) => {
                                  if (dropErr) {
                                    console.error('❌ Error eliminando tabla messages:', dropErr.message);
                                  } else {
                                    console.log('✅ Tabla messages eliminada, se recreará automáticamente');
                                  }
                                });
                              }
                            } else if (!err) {
                              console.log(`✅ Migración ${index + 1} completada`);
                            }
                            completedMigration++;
                            if (completedMigration === migrateMessagesSQL.length) {
                              // Agregar columnas faltantes a la tabla requests
                              const addRequestColumnsSQL = [
                                'ALTER TABLE requests ADD COLUMN problem_description TEXT',
                                'ALTER TABLE requests ADD COLUMN vehicle_info TEXT',
                                'ALTER TABLE requests ADD COLUMN urgency_level TEXT DEFAULT "normal"'
                              ];

                              let completedRequestColumns = 0;
                              addRequestColumnsSQL.forEach((columnSQL, index) => {
                                db.run(columnSQL, (err) => {
                                  // Ignorar errores si la columna ya existe
                                  if (err && !err.message.includes('duplicate column name')) {
                                    console.error(`❌ Error agregando columna de solicitud ${index}:`, err.message);
                                  } else if (!err) {
                                    console.log(`✅ Columna de solicitud ${index + 1} agregada/verificada`);
                                  }
                                  completedRequestColumns++;
                                  if (completedRequestColumns === addRequestColumnsSQL.length) {
                                    // Crear tablas de cotizaciones
                                    const createQuotesTableSQL = `
                                      CREATE TABLE IF NOT EXISTS quotes (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        request_id INTEGER NOT NULL,
                                        worker_id INTEGER NOT NULL,
                                        client_id INTEGER NOT NULL,
                                        transport_fee REAL DEFAULT 0,
                                        total_price REAL NOT NULL,
                                        estimated_time TEXT,
                                        notes TEXT,
                                        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed')),
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (request_id) REFERENCES requests (id),
                                        FOREIGN KEY (worker_id) REFERENCES users (id),
                                        FOREIGN KEY (client_id) REFERENCES users (id)
                                      )
                                    `;

                                    const createQuoteServicesTableSQL = `
                                      CREATE TABLE IF NOT EXISTS quote_services (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        quote_id INTEGER NOT NULL,
                                        description TEXT NOT NULL,
                                        price REAL NOT NULL,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (quote_id) REFERENCES quotes (id)
                                      )
                                    `;

                                    const createPaymentsTableSQL = `
                                      CREATE TABLE IF NOT EXISTS payments (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        quote_id INTEGER NOT NULL,
                                        client_id INTEGER NOT NULL,
                                        worker_id INTEGER NOT NULL,
                                        payment_method TEXT NOT NULL,
                                        payment_amount REAL NOT NULL,
                                        payment_reference TEXT,
                                        payment_date TEXT,
                                        payment_time TEXT,
                                        payment_screenshot TEXT,
                                        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'verified', 'rejected')),
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (quote_id) REFERENCES quotes (id),
                                        FOREIGN KEY (client_id) REFERENCES users (id),
                                        FOREIGN KEY (worker_id) REFERENCES users (id)
                                      )
                                    `;

                                    const createWorkerInfoTableSQL = `
                                      CREATE TABLE IF NOT EXISTS worker_info (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        user_id INTEGER NOT NULL,
                                        payment_methods TEXT,
                                        payment_info TEXT,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (user_id) REFERENCES users (id)
                                      )
                                    `;

                                    db.run(createQuotesTableSQL, (err) => {
                                      if (err) {
                                        console.error('❌ Error creando tabla quotes:', err.message);
                                      } else {
                                        console.log('✅ Tabla quotes creada/verificada correctamente');
                                        
                                        db.run(createQuoteServicesTableSQL, (err) => {
                                          if (err) {
                                            console.error('❌ Error creando tabla quote_services:', err.message);
                                          } else {
                                            console.log('✅ Tabla quote_services creada/verificada correctamente');
                                            
                                            // Crear tabla de pagos
                                            db.run(createPaymentsTableSQL, (err) => {
                                              if (err) {
                                                console.error('❌ Error creando tabla payments:', err.message);
                                              } else {
                                                console.log('✅ Tabla payments creada/verificada correctamente');
                                                
                                                // Crear tabla de información del trabajador
                                                db.run(createWorkerInfoTableSQL, (err) => {
                                                  if (err) {
                                                    console.error('❌ Error creando tabla worker_info:', err.message);
                                                  } else {
                                                    console.log('✅ Tabla worker_info creada/verificada correctamente');
                                                  }
                                                });

                                                // Crear índices para cotizaciones
                                                const createQuoteIndexesSQL = [
                                                  'CREATE INDEX IF NOT EXISTS idx_quotes_request_id ON quotes(request_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_quotes_worker_id ON quotes(worker_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status)',
                                                  'CREATE INDEX IF NOT EXISTS idx_quote_services_quote_id ON quote_services(quote_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_payments_quote_id ON payments(quote_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_payments_worker_id ON payments(worker_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_payments_client_id ON payments(client_id)',
                                                  'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)'
                                                ];

                                                let completedQuoteIndexes = 0;
                                                createQuoteIndexesSQL.forEach((indexSQL, index) => {
                                                  db.run(indexSQL, (err) => {
                                                    if (err) {
                                                      console.error(`❌ Error creando índice de cotizaciones ${index}:`, err.message);
                                                    } else {
                                                      console.log(`✅ Índice de cotizaciones ${index + 1} creado/verificado`);
                                                    }
                                                    completedQuoteIndexes++;
                                                    if (completedQuoteIndexes === createQuoteIndexesSQL.length) {
                                                      resolve();
                                                    }
                                                  });
                                                });
                                              }
                                            });
                                          }
                                        });
                                      }
                                    });
                                  }
                                });
                              });
                            }
                          });
                        });
                      }
                    });
                  });
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  });
};

// Función para crear una nueva solicitud
const createRequest = (requestData) => {
  return new Promise((resolve, reject) => {
    const { 
      client_id, 
      worker_id, 
      service_type, 
      description, 
      client_location, 
      client_phone, 
      client_name, 
      worker_name,
      coordinates,
      problem_description,
      vehicle_info,
      urgency_level
    } = requestData;
    
    const insertSQL = `
      INSERT INTO requests (
        client_id, worker_id, service_type, description, 
        client_location, client_phone, client_name, worker_name,
        latitude, longitude, problem_description, vehicle_info, urgency_level
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const latitude = coordinates?.latitude || null;
    const longitude = coordinates?.longitude || null;

    console.log('Ejecutando SQL con parámetros:', [
      client_id, worker_id, service_type, description,
      client_location, client_phone, client_name, worker_name,
      latitude, longitude, problem_description, vehicle_info, urgency_level
    ]);
    
    db.run(insertSQL, [
      client_id, worker_id, service_type, description,
      client_location, client_phone, client_name, worker_name,
      latitude, longitude, problem_description, vehicle_info, urgency_level
    ], function(err) {
      if (err) {
        console.error('Error en createRequest:', err);
        reject(err);
      } else {
        console.log('Solicitud creada con ID:', this.lastID);
        resolve({ 
          id: this.lastID, 
          ...requestData,
          status: 'pending',
          created_at: new Date().toISOString()
        });
      }
    });
  });
};

// Función para obtener solicitudes de un trabajador
const getWorkerRequests = (workerId) => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM requests 
      WHERE worker_id = ? 
      ORDER BY created_at DESC
    `;
    
    db.all(selectSQL, [workerId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para obtener solicitudes de un cliente
const getClientRequests = (clientId) => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM requests 
      WHERE client_id = ? 
      ORDER BY created_at DESC
    `;
    
    db.all(selectSQL, [clientId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para actualizar el estado de una solicitud
const updateRequestStatus = (requestId, status) => {
  return new Promise((resolve, reject) => {
    const updateSQL = `
      UPDATE requests 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateSQL, [status, requestId], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ id: requestId, status, updated_at: new Date().toISOString() });
        } else {
          reject(new Error('Solicitud no encontrada'));
        }
      }
    });
  });
};

// Función para crear un nuevo mensaje
const createMessage = (messageData) => {
  return new Promise((resolve, reject) => {
    const { session_id, sender_id, sender_type, message } = messageData;
    
    const insertSQL = `
      INSERT INTO messages (session_id, sender_id, sender_type, message)
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(insertSQL, [session_id, sender_id, sender_type, message], function(err) {
      if (err) {
        console.error('Error en createMessage:', err);
        reject(err);
      } else {
        console.log('Mensaje creado con ID:', this.lastID);
        resolve({ 
          id: this.lastID, 
          ...messageData,
          created_at: new Date().toISOString(),
          is_read: 0
        });
      }
    });
  });
};

// Función para obtener mensajes de una solicitud (mantener para compatibilidad)
const getMessagesByRequestId = (requestId) => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC
    `;
    
    db.all(selectSQL, [requestId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Función para marcar mensajes como leídos
const markMessagesAsRead = (sessionId, senderType) => {
  return new Promise((resolve, reject) => {
    const updateSQL = `
      UPDATE messages 
      SET is_read = 1
      WHERE session_id = ? AND sender_type != ?
    `;
    
    db.run(updateSQL, [sessionId, senderType], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ updated: this.changes });
      }
    });
  });
};

// Función para crear una sesión de chat
const createChatSession = (sessionData) => {
  return new Promise((resolve, reject) => {
    const { worker_id, client_id, service_type, status, agreed_price } = sessionData;
    
    const insertSQL = `
      INSERT INTO chat_sessions (worker_id, client_id, service_type, status, agreed_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    db.run(insertSQL, [worker_id, client_id, service_type, status, agreed_price], function(err) {
      if (err) {
        console.error('Error en createChatSession:', err);
        reject(err);
      } else {
        console.log('Sesión de chat creada con ID:', this.lastID);
        resolve({ 
          id: this.lastID, 
          ...sessionData,
          created_at: new Date().toISOString()
        });
      }
    });
  });
};

// Función para obtener una sesión de chat
const getChatSession = (sessionId) => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM chat_sessions 
      WHERE id = ?
    `;
    
    db.get(selectSQL, [sessionId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Función para actualizar una sesión de chat
const updateChatSession = (sessionId, updateData) => {
  return new Promise((resolve, reject) => {
    const { status, agreed_price } = updateData;
    
    const updateSQL = `
      UPDATE chat_sessions 
      SET status = ?, agreed_price = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateSQL, [status, agreed_price, sessionId], function(err) {
      if (err) {
        reject(err);
      } else {
        if (this.changes > 0) {
          resolve({ id: sessionId, ...updateData, updated_at: new Date().toISOString() });
        } else {
          reject(new Error('Sesión de chat no encontrada'));
        }
      }
    });
  });
};

// Función para obtener mensajes por sesión
const getMessagesBySessionId = (sessionId) => {
  return new Promise((resolve, reject) => {
    const selectSQL = `
      SELECT * FROM messages 
      WHERE session_id = ? 
      ORDER BY created_at ASC
    `;
    
    db.all(selectSQL, [sessionId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  initUsersTable,
  initShopsTable,
  saveShop,
  initRequestsTable,
  createUser,
  getUserById,
  getUserByEmail,
  createMessage,
  getMessagesByRequestId,
  getMessagesBySessionId,
  markMessagesAsRead,
  createChatSession,
  getChatSession,
  updateChatSession,
  getUserByCedula,
  getUserByTelefono,
  getAllUsers,
  updateUser,
  updateUserFields,
  deleteUser,
  checkUserExists,
  updateUserVerificationCode,
  verifyUserEmail,
  updateUserServiceProfile,
  updateUserPaymentMethods,
  updateUserPushToken,
  createRequest,
  getWorkerRequests,
  getClientRequests,
  updateRequestStatus,
  closeDatabase,
  db // Exportar la instancia de db
};

// Inicializar las tablas al cargar el módulo
initUsersTable().catch(console.error);
initRequestsTable().catch(console.error); 
