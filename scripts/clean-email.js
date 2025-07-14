const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath);

// Email a limpiar
const emailToClean = 'sandjesdelsum@gmail.com';

console.log(`🧹 Limpiando email: ${emailToClean}`);

// Eliminar el usuario con ese email
db.run(
  'DELETE FROM users WHERE email = ?',
  [emailToClean],
  function(err) {
    if (err) {
      console.error('❌ Error eliminando usuario:', err.message);
    } else {
      console.log(`✅ Usuario con email ${emailToClean} eliminado correctamente`);
      console.log(`📊 Filas afectadas: ${this.changes}`);
    }
    
    // Cerrar la conexión
    db.close((err) => {
      if (err) {
        console.error('❌ Error cerrando base de datos:', err.message);
      } else {
        console.log('✅ Base de datos cerrada correctamente');
      }
    });
  }
); 