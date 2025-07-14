const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando la última solicitud creada...\n');

db.get('SELECT * FROM requests WHERE id = 7', [], (err, row) => {
  if (err) {
    console.error('❌ Error consultando base de datos:', err);
  } else if (row) {
    console.log('📋 Última solicitud (ID 7):');
    console.log('ID:', row.id);
    console.log('Cliente:', row.client_name);
    console.log('Trabajador:', row.worker_name);
    console.log('Tipo de servicio:', row.service_type);
    console.log('Problema:', row.problem_description);
    console.log('Vehículo:', row.vehicle_info);
    console.log('Urgencia:', row.urgency_level);
    console.log('Estado:', row.status);
    console.log('Creado:', row.created_at);
  } else {
    console.log('❌ No se encontró la solicitud con ID 7');
  }
  
  db.close();
}); 