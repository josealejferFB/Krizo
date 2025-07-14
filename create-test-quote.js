const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('💰 Creando cotización de prueba...\n');

// Crear cotización para la solicitud ID 8
const quoteData = {
  request_id: 8,
  worker_id: 6, // Armando Delgado
  client_id: 4, // Santo Delgado
  transport_fee: 50.00,
  total_price: 250.00,
  estimated_time: '2-3 horas',
  notes: 'Incluye diagnóstico completo y garantía de 3 meses',
  status: 'pending'
};

// Insertar cotización
db.run(`
  INSERT INTO quotes (
    request_id, worker_id, client_id, transport_fee, 
    total_price, estimated_time, notes, status, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`, [
  quoteData.request_id,
  quoteData.worker_id,
  quoteData.client_id,
  quoteData.transport_fee,
  quoteData.total_price,
  quoteData.estimated_time,
  quoteData.notes,
  quoteData.status
], function(err) {
  if (err) {
    console.error('❌ Error creando cotización:', err);
    db.close();
    return;
  }

  const quoteId = this.lastID;
  console.log('✅ Cotización creada con ID:', quoteId);

  // Crear servicios de la cotización
  const services = [
    { description: 'Diagnóstico del problema', price: 100.00 },
    { description: 'Reparación del sistema', price: 100.00 }
  ];

  let servicesCreated = 0;
  services.forEach((service) => {
    db.run(`
      INSERT INTO quote_services (quote_id, description, price, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `, [quoteId, service.description, service.price], function(err) {
      if (err) {
        console.error('❌ Error creando servicio:', err);
      } else {
        console.log('✅ Servicio creado:', service.description);
      }
      
      servicesCreated++;
      if (servicesCreated === services.length) {
        console.log('\n🎉 Cotización de prueba creada exitosamente!');
        console.log('📋 Detalles:');
        console.log('- ID de cotización:', quoteId);
        console.log('- Cliente: Santo Delgado (ID 4)');
        console.log('- Trabajador: Armando Delgado (ID 6)');
        console.log('- Precio total: $250.00');
        console.log('- Estado: Pendiente');
        console.log('\n👤 El cliente puede ver esta cotización en "Mis Cotizaciones"');
        
        db.close();
      }
    });
  });
}); 