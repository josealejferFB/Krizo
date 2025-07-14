const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Verificando solicitudes en la base de datos...\n');

db.all('SELECT * FROM requests ORDER BY created_at DESC', [], (err, rows) => {
  if (err) {
    console.error('❌ Error consultando base de datos:', err);
  } else {
    console.log('📋 Solicitudes encontradas:', rows.length);
    rows.forEach((row, index) => {
      console.log(`\n--- Solicitud ${index + 1} ---`);
      console.log('ID:', row.id);
      console.log('Cliente:', row.client_name);
      console.log('Trabajador:', row.worker_name);
      console.log('Tipo de servicio:', row.service_type);
      console.log('Problema:', row.problem_description);
      console.log('Vehículo:', row.vehicle_info);
      console.log('Urgencia:', row.urgency_level);
      console.log('Estado:', row.status);
      console.log('Creado:', row.created_at);
    });
  }
  
  db.close();
}); 