const { db } = require('../database/users');

function clearTables() {
  db.serialize(() => {
    db.run('DELETE FROM payments', function(err) {
      if (err) return console.error('Error al limpiar payments:', err.message);
      console.log('✅ Tabla payments limpiada');
    });
    db.run('DELETE FROM quote_services', function(err) {
      if (err) return console.error('Error al limpiar quote_services:', err.message);
      console.log('✅ Tabla quote_services limpiada');
    });
    db.run('DELETE FROM quotes', function(err) {
      if (err) return console.error('Error al limpiar quotes:', err.message);
      console.log('✅ Tabla quotes limpiada');
    });
    db.run('DELETE FROM requests', function(err) {
      if (err) return console.error('Error al limpiar requests:', err.message);
      console.log('✅ Tabla requests limpiada');
    });
  });
}

clearTables(); 