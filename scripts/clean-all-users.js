const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath);

console.log('🧹 Limpiando TODOS los usuarios de la base de datos...');

// Eliminar todos los usuarios excepto el admin
db.run(
  'DELETE FROM users WHERE email != ?',
  ['admin@krizo.com'],
  function(err) {
    if (err) {
      console.error('❌ Error eliminando usuarios:', err.message);
    } else {
      console.log(`✅ Usuarios eliminados correctamente`);
      console.log(`📊 Filas afectadas: ${this.changes}`);
    }
    
    // Verificar usuarios restantes
    db.all('SELECT id, email, nombres, apellidos FROM users', [], (err, rows) => {
      if (err) {
        console.error('❌ Error consultando usuarios:', err.message);
      } else {
        console.log('📋 Usuarios restantes:');
        rows.forEach(row => {
          console.log(`   - ID: ${row.id}, Email: ${row.email}, Nombre: ${row.nombres} ${row.apellidos}`);
        });
      }
      
      // Cerrar la conexión
      db.close((err) => {
        if (err) {
          console.error('❌ Error cerrando base de datos:', err.message);
        } else {
          console.log('✅ Base de datos cerrada correctamente');
        }
      });
    });
  }
); 