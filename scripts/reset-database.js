const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Necesario para el hash de contraseñas

// Configuración de la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');

console.log('🧹 Iniciando limpieza y configuración de la base de datos...\n');

// Función para limpiar y recrear la base de datos
const resetDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Cerrando conexiones existentes y haciendo backup...');

    // Si el archivo existe, hacer backup
    if (fs.existsSync(dbPath)) {
      const backupPath = dbPath.replace('.sqlite', '_backup.sqlite');
      fs.copyFileSync(dbPath, backupPath);
      console.log(`✅ Backup creado en: ${backupPath}`);
    }

    console.log('2️⃣ Eliminando archivo de base de datos...');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Archivo de base de datos eliminado');
    }

    console.log('3️⃣ Creando nueva base de datos...');
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => { // Usamos serialize para asegurar que las operaciones se ejecuten en orden
      // --- CREACIÓN DE LA TABLA USERS ---
      console.log('Creando tabla users...');
      const createUsersTableSQL = `
        CREATE TABLE users (
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
          services TEXT,          -- Para krizoworker (mecánicos, repuestos, etc.)
          ciudad TEXT,            -- Para krizoworker/tiendas
          zona TEXT,              -- Para krizoworker/tiendas
          descripcion TEXT,       -- Para krizoworker/tiendas
          disponibilidad TEXT,    -- Para krizoworker/tiendas
          profile_image_url TEXT, -- Para krizoworker/tiendas
          paypal_email TEXT,      -- Para krizoworker
          binance_id TEXT,        -- Para krizoworker
          service_phone TEXT,     -- Para krizoworker (teléfono de contacto público)
          push_token TEXT,        -- Para notificaciones push
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      db.run(createUsersTableSQL, (err) => {
        if (err) {
          console.error('❌ Error creando tabla users:', err.message);
          return reject(err);
        }
        console.log('✅ Tabla users creada correctamente');

        // --- CREACIÓN DE LA TABLA SHOPS (Se mantiene si la necesitas para algo más, pero no la usaremos para poblar los "workers" del frontend) ---
        console.log('Creando tabla shops...');
        const createShopsTableSQL = `
          CREATE TABLE shops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            descripcion TEXT,
            ciudad TEXT,
            zona TEXT,
            disponibilidad TEXT,
            services TEXT, -- Almacenado como una cadena de texto separada por comas (ej. 'repuestos,mecanica')
            profile_image_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `;

        db.run(createShopsTableSQL, (err) => {
          if (err) {
            console.error('❌ Error creando tabla shops:', err.message);
            return reject(err);
          }
          console.log('✅ Tabla shops creada correctamente');

          // --- CREACIÓN DE ÍNDICES PARA AMBAS TABLAS ---
          console.log('\n4️⃣ Creando índices para ambas tablas...');
          const createIndexesSQL = [
            'CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula)',
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
            'CREATE INDEX IF NOT EXISTS idx_users_telefono ON users(telefono)',
            'CREATE INDEX IF NOT EXISTS idx_users_tipo ON users(tipo)',
            'CREATE INDEX IF NOT EXISTS idx_shops_name ON shops(name)',
            'CREATE INDEX IF NOT EXISTS idx_shops_ciudad ON shops(ciudad)',
            'CREATE INDEX IF NOT EXISTS idx_shops_services ON shops(services)'
          ];

          let completedIndexes = 0;
          createIndexesSQL.forEach((indexSQL, index) => {
            db.run(indexSQL, (err) => {
              if (err) {
                console.error(`❌ Error creando índice ${index + 1}:`, err.message);
              } else {
                console.log(`✅ Índice ${index + 1} creado correctamente`);
              }
              completedIndexes++;
              if (completedIndexes === createIndexesSQL.length) {
                console.log('\n5️⃣ Verificando estructura de las tablas...');

                // --- VERIFICAR TABLA USERS ---
                db.all("PRAGMA table_info(users)", (err, rows) => {
                  if (err) {
                    console.error('❌ Error verificando tabla users:', err.message);
                    return reject(err);
                  }
                  console.log('✅ Estructura de la tabla users:');
                  rows.forEach(row => {
                    console.log(`  - ${row.name} (${row.type})${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
                  });

                  // --- VERIFICAR TABLA SHOPS ---
                  db.all("PRAGMA table_info(shops)", (err, rows) => {
                    if (err) {
                      console.error('❌ Error verificando tabla shops:', err.message);
                      return reject(err);
                    }
                    console.log('✅ Estructura de la tabla shops:');
                    rows.forEach(row => {
                      console.log(`  - ${row.name} (${row.type})${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
                    });

                    console.log('\n6️⃣ Insertando datos de prueba en la tabla users...');

                    // --- DATOS DE USUARIOS (INCLUYENDO KRIZOWORKERS DE MECÁNICA Y REPUESTOS) ---
                    const usersToInsert = [
                      // Usuario Administrador (Krizoworker general)
                      {
                        nombres: 'Admin',
                        apellidos: 'Sistema',
                        cedula: 'ADMIN001',
                        email: 'admin@krizo.com',
                        telefono: '3000000000',
                        password: '123456',
                        tipo: 'krizoworker',
                        services: null, // No aplica servicios específicos para este rol
                        ciudad: 'San Juan de Los Morros',
                        zona: 'Centro',
                        descripcion: 'Administrador del sistema Krizo.',
                        disponibilidad: 'L-V 8AM-5PM',
                        profile_image_url: null
                      },
                      // Krizoworker: Mecánico (Tu petición original)
                      {
                        nombres: 'Juan',
                        apellidos: 'Mecánico',
                        cedula: 'MECANICO001',
                        email: 'mecanico@krizo.com',
                        telefono: '3000000010',
                        password: '123456',
                        tipo: 'krizoworker',
                        services: '["mecanica", "grua"]', // Servicios de mecánico
                        ciudad: 'San Juan de Los Morros',
                        zona: 'La Florida',
                        descripcion: 'Especialista en mecánica automotriz, frenos, y reparación de motor. Servicios a domicilio disponibles.',
                        disponibilidad: 'L-S 9AM-6PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/mecanico-automoviles-trabajando-automovil-servicio_1303-26829.jpg?t=st=1722790000~exp=1722793600~hmac=d24b7a2d67a1c7d2425d7c88a8f1b626d708f51a7e44a0e1a1b1a7f1a1b1a7f&w=740'
                      },
                      // Krizoworker: Tienda de Repuestos 1
                      {
                        nombres: 'Repuestos',
                        apellidos: 'Modernos', // Usamos apellidos como parte del nombre de la "empresa" para el perfil
                        cedula: 'TIENDA001',
                        email: 'tienda.repuestos@krizo.com',
                        telefono: '3000000001',
                        password: 'krizo123',
                        tipo: 'krizoworker',
                        services: '["repuestos", "grua"]', // Esta también ofrece mecánica básica
                        ciudad: 'San Juan de Los Morros',
                        zona: 'Centro',
                        descripcion: 'Tienda de repuestos automotrices con amplia variedad de piezas originales y genéricas.',
                        disponibilidad: 'L-V 8AM-5PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/vista-frontal-piezas-automoviles-dispuestas_23-2148784157.jpg?t=st=1722692224~exp=1722695824~hmac=621743015ecf3e29f379fb036573c7379f874c7210e30d7037ce6d84a7e48ce4&w=740'
                      },
                      // Krizoworker: Tienda de Repuestos 2
                      {
                        nombres: 'Autopartes',
                        apellidos: 'ElCamino',
                        cedula: 'AUTOELCAMINO02',
                        email: 'autopartes.camino@krizo.com',
                        telefono: '3000000002',
                        password: 'krizo123',
                        tipo: 'krizoworker',
                        services: '["mecanico"]',
                        ciudad: 'San Juan de Los Morros',
                        zona: 'La Morera',
                        descripcion: 'Especialistas en tren delantero y suspensión, con un equipo de asesores expertos.',
                        disponibilidad: 'L-V 9AM-5PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/primer-plano-varias-piezas-coche-colocadas-mesa-negra_23-2148418049.jpg?t=st=1722692264~exp=1722695864~hmac=11b3323a6503c530514a6002f23b207a9776d65377f3e82502f9c8ef18f72533&w=740'
                      },
                      // Krizoworker: Tienda de Repuestos 3
                      {
                        nombres: 'Repuestos',
                        apellidos: 'LaGranja',
                        cedula: 'LAGRANJA03',
                        email: 'repuestos.lagranja@krizo.com',
                        telefono: '3000000003',
                        password: 'krizo123',
                        tipo: 'krizoworker',
                        services: '["repuestos"]',
                        ciudad: 'San Juan de Los Morros',
                        zona: 'La Granja',
                        descripcion: 'Amplia selección de filtros y aceites para todo tipo de vehículos, servicio rápido.',
                        disponibilidad: 'L-S 7AM-7PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/conjunto-componentes-coche_23-2148418047.jpg?t=st=1722692289~exp=1722695889~hmac=7e3d1c448651a14c6708b1a8d79146f33d74c43f7a63cefb99b0c7924ce04445&w=740'
                      },
                      // Krizoworker: Tienda de Repuestos de Motos
                      {
                        nombres: 'MotoRepuestos',
                        apellidos: 'Express',
                        cedula: 'MOTOEXPRESS04',
                        email: 'motorepuestos.express@krizo.com',
                        telefono: '3000000004',
                        password: 'krizo123',
                        tipo: 'krizoworker',
                        services: '["repuestos"]',
                        ciudad: 'San Juan de Los Morros',
                        zona: 'Paseo Los Indios',
                        descripcion: 'Solo repuestos para motos, todas las marcas y modelos, entrega el mismo día.',
                        disponibilidad: 'M-S 10AM-8PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/primer-plano-motores-automoviles-encontrados-taller-reparacion_23-2148418041.jpg?t=st=1722692305~exp=1722695905~hmac=4e4d5a9d821361c471015c7e100f93a8d8e579ed9485124b8ddb299e462d7c58&w=740'
                      },
                      // Krizoworker: Distribuidora de Repuestos (en otra ciudad para pruebas de filtro)
                      {
                        nombres: 'Distribuidora',
                        apellidos: 'CarParts',
                        cedula: 'CARPARTS05',
                        email: 'distribuidora.carparts@krizo.com',
                        telefono: '3000000005',
                        password: 'krizo123',
                        tipo: 'krizoworker',
                        services: '["mecanico"]',
                        ciudad: 'Calabozo', // Diferente ciudad para probar el filtro de ciudad
                        zona: 'Industrial',
                        descripcion: 'Venta al mayor y detal de repuestos automotrices, con envíos a nivel nacional.',
                        disponibilidad: 'L-V 8AM-4PM',
                        profile_image_url: 'https://img.freepik.com/foto-gratis/vista-superior-variedad-herramientas-automotrices_23-2148418037.jpg?t=st=1722692328~exp=1722695928~hmac=406085e3ffc85246ec27b8782ee81014e760c48e8913b83647f093a2072111b0&w=740'
                      },
                      // Usuario Cliente de Prueba
                      {
                        nombres: 'Cliente',
                        apellidos: 'Prueba',
                        cedula: 'CLIENTE001',
                        email: 'cliente@krizo.com',
                        telefono: '3000000006',
                        password: '123456',
                        tipo: 'cliente',
                        services: null,
                        ciudad: null,
                        zona: null,
                        descripcion: null,
                        disponibilidad: null,
                        profile_image_url: null
                      }
                    ];

                    let completedUserInserts = 0;
                    usersToInsert.forEach((userData) => {
                      bcrypt.hash(userData.password, 10).then(hashedPassword => {
                        const insertUserSQL = `
                          INSERT INTO users (nombres, apellidos, cedula, email, telefono, password, tipo, services, ciudad, zona, descripcion, disponibilidad, profile_image_url)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        db.run(insertUserSQL, [
                          userData.nombres,
                          userData.apellidos,
                          userData.cedula,
                          userData.email,
                          userData.telefono,
                          hashedPassword,
                          userData.tipo,
                          userData.services,
                          userData.ciudad,
                          userData.zona,
                          userData.descripcion,
                          userData.disponibilidad,
                          userData.profile_image_url
                        ], function(err) {
                          if (err) {
                            console.error(`❌ Error creando usuario ${userData.email}:`, err.message);
                          } else {
                            console.log(`✅ Usuario "${userData.email}" creado (ID: ${this.lastID}) sus servicios "${userData.services}"`);
                          }
                          completedUserInserts++;
                          // Cuando todas las inserciones de usuarios estén completas, cerrar la DB
                          if (completedUserInserts === usersToInsert.length) {
                            db.close((err) => {
                              if (err) {
                                console.error('❌ Error cerrando base de datos:', err.message);
                                return reject(err);
                              }
                              console.log('\n🎉 Base de datos reseteada y poblada exitosamente!');
                              console.log('📱 El sistema SQLite3 está listo para usar.');
                              console.log('\n📋 Próximos pasos:');
                              console.log('   1. Reiniciar el servidor FastAPI.');
                              console.log('   2. Probar el login con los nuevos usuarios.');
                              console.log('   3. Verificar los trabajadores (mecánicos y tiendas) en la app. Ahora debería haber una variedad de servicios.');
                              resolve();
                            });
                          }
                        });
                      }).catch(err => {
                        console.error(`❌ Error encriptando contraseña para ${userData.email}:`, err.message);
                        reject(err);
                      });
                    });
                  });
                });
              }
            });
          });
        });
      });
    });
  });
};

// Ejecutar si se llama directamente
if (require.main === module) {
  resetDatabase().catch(console.error);
}

module.exports = { resetDatabase };
