const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testRequest() {
  console.log('🧪 Probando envío de solicitud de servicio...\n');

  try {
    // Datos de prueba
    const requestData = {
      worker_id: 6, // ID del KrizoWorker
      client_id: 4, // ID del cliente Santo Delgado
      service_type: 'mecanico',
      problem_description: 'Mi auto no enciende, necesito diagnóstico urgente',
      vehicle_info: 'Toyota Corolla 2020, color blanco, placa ABC-123',
      urgency_level: 'high',
      coordinates: {
        latitude: 19.4326,
        longitude: -99.1332
      }
    };

    console.log('📤 Enviando datos:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(`${BASE_URL}/api/requests`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Respuesta exitosa:', response.data);
    
    // Verificar que la solicitud se guardó correctamente
    const requestsResponse = await axios.get(`${BASE_URL}/api/requests`);
    console.log('\n📋 Solicitudes en la base de datos:', requestsResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testRequest(); 