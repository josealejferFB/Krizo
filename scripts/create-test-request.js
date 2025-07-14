const { db } = require('../database/users');

async function createTestRequest() {
  try {
    console.log('🚀 Creando solicitud de prueba...');

    // Verificar que existe el cliente (ID 4) y el worker (ID 6)
    const client = await new Promise((resolve, reject) => {
      db.get('SELECT id, nombres, apellidos FROM users WHERE id = ?', [4], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const worker = await new Promise((resolve, reject) => {
      db.get('SELECT id, nombres, apellidos FROM users WHERE id = ?', [6], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log('👤 Cliente:', client);
    console.log('👷 Worker:', worker);

    if (!client || !worker) {
      console.error('❌ Cliente o Worker no encontrado');
      return;
    }

    // Crear solicitud de prueba
    const insertQuery = `
      INSERT INTO requests (
        client_id, worker_id, service_type, description, 
        client_location, client_phone, client_name, worker_name,
        latitude, longitude, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;

    const requestData = [
      4, // client_id
      6, // worker_id
      'mechanic', // service_type
      'Mi auto no enciende, necesito diagnóstico urgente', // description
      'Av. Insurgentes Sur 123, CDMX', // client_location
      '04243031238', // client_phone
      `${client.nombres} ${client.apellidos}`, // client_name
      `${worker.nombres} ${worker.apellidos}`, // worker_name
      19.4326, // latitude
      -99.1332, // longitude
      'pending' // status
    ];

    await new Promise((resolve, reject) => {
      db.run(insertQuery, requestData, function(err) {
        if (err) {
          console.error('❌ Error creando solicitud:', err);
          reject(err);
        } else {
          console.log('✅ Solicitud creada con ID:', this.lastID);
          resolve(this.lastID);
        }
      });
    });

    // Verificar que se creó correctamente
    const createdRequest = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM requests WHERE client_id = ? AND worker_id = ? ORDER BY created_at DESC LIMIT 1', [4, 6], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    console.log('📋 Solicitud creada:', createdRequest);
    console.log('🎉 ¡Solicitud de prueba creada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Cerrar la base de datos
    db.close();
  }
}

createTestRequest(); 