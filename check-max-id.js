const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando el ID más alto en la tabla requests...\n');

db.get('SELECT MAX(id) as max_id FROM requests', [], (err, row) => {
  if (err) {
    console.error('❌ Error consultando base de datos:', err);
  } else {
    console.log('📋 ID más alto:', row.max_id);
    
    // Obtener la última solicitud
    db.get('SELECT * FROM requests WHERE id = ?', [row.max_id], (err, request) => {
      if (err) {
        console.error('❌ Error consultando última solicitud:', err);
      } else if (request) {
        console.log('\n📋 Última solicitud:');
        console.log('ID:', request.id);
        console.log('Cliente:', request.client_name);
        console.log('Trabajador:', request.worker_name);
        console.log('Tipo de servicio:', request.service_type);
        console.log('Problema:', request.problem_description);
        console.log('Vehículo:', request.vehicle_info);
        console.log('Urgencia:', request.urgency_level);
        console.log('Estado:', request.status);
        console.log('Creado:', request.created_at);
      }
      
      db.close();
    });
  }
}); 