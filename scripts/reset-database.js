const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Configuración de la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');

console.log('🧹 Iniciando limpieza de la base de datos...\n');

// Función para limpiar y recrear la base de datos
const resetDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Cerrando conexiones existentes...');
    
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

    // Crear la tabla users con la estructura correcta
    const createTableSQL = `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        cedula TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefono TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        tipo TEXT CHECK(tipo IN ('cliente', 'krizoworker')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    db.run(createTableSQL, (err) => {
      if (err) {
        console.error('❌ Error creando tabla users:', err.message);
        reject(err);
        return;
      }
      
      console.log('✅ Tabla users creada correctamente');
      
      // Crear índices
      const createIndexesSQL = [
        'CREATE INDEX idx_users_cedula ON users(cedula)',
        'CREATE INDEX idx_users_email ON users(email)',
        'CREATE INDEX idx_users_telefono ON users(telefono)',
        'CREATE INDEX idx_users_tipo ON users(tipo)'
      ];

      let completedIndexes = 0;
      createIndexesSQL.forEach((indexSQL, index) => {
        db.run(indexSQL, (err) => {
          if (err) {
            console.error(`❌ Error creando índice ${index}:`, err.message);
          } else {
            console.log(`✅ Índice ${index + 1} creado correctamente`);
          }
          completedIndexes++;
          if (completedIndexes === createIndexesSQL.length) {
            console.log('\n4️⃣ Verificando estructura de la tabla...');
            
            // Verificar que la tabla se creó correctamente
            db.all("PRAGMA table_info(users)", (err, rows) => {
              if (err) {
                console.error('❌ Error verificando tabla:', err.message);
                reject(err);
                return;
              }
              
              console.log('✅ Estructura de la tabla users:');
              rows.forEach(row => {
                console.log(`   - ${row.name} (${row.type})${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
              });
              
              console.log('\n5️⃣ Creando usuario de prueba...');
              
              // Crear un usuario de prueba
              const bcrypt = require('bcryptjs');
              bcrypt.hash('123456', 10).then(hashedPassword => {
                const insertSQL = `
                  INSERT INTO users (nombres, apellidos, cedula, email, telefono, password, tipo)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                
                db.run(insertSQL, [
                  'Admin',
                  'Sistema',
                  'ADMIN001',
                  'admin@krizo.com',
                  '3000000000',
                  hashedPassword,
                  'krizoworker'
                ], function(err) {
                  if (err) {
                    console.error('❌ Error creando usuario de prueba:', err.message);
                    reject(err);
                    return;
                  }
                  
                  console.log('✅ Usuario de prueba creado (ID:', this.lastID, ')');
                  console.log('   Email: admin@krizo.com');
                  console.log('   Contraseña: 123456');
                  
                  db.close((err) => {
                    if (err) {
                      console.error('❌ Error cerrando base de datos:', err.message);
                      reject(err);
                      return;
                    }
                    
                    console.log('\n🎉 Base de datos reseteada exitosamente!');
                    console.log('📱 El sistema SQLite3 está listo para usar.');
                    console.log('\n📋 Próximos pasos:');
                    console.log('   1. Reiniciar el servidor');
                    console.log('   2. Probar el login con admin@krizo.com / 123456');
                    console.log('   3. Registrar nuevos usuarios desde la app');
                    
                    resolve();
                  });
                });
              }).catch(err => {
                console.error('❌ Error encriptando contraseña:', err.message);
                reject(err);
              });
            });
          }
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