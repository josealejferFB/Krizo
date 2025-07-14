const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Datos de prueba
const testData = {
  cliente: {
    id: 4,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJzYW50byIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3MzQ5NzI4MDB9.test'
  },
  krizoWorker: {
    id: 6,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJrcml6b3dvcmtlciIsInJvbGUiOiJ3b3JrZXIiLCJpYXQiOjE3MzQ5NzI4MDB9.test'
  }
};

async function testServiceFlow() {
  console.log('🚀 Iniciando prueba del flujo de servicio mecánico...\n');

  try {
    // 1. Crear solicitud de servicio (Cliente)
    console.log('📝 Paso 1: Creando solicitud de servicio...');
    const requestData = {
      service_type: 'mechanic',
      description: 'Mi auto no enciende, necesito diagnóstico',
      location: {
        latitude: 19.4326,
        longitude: -99.1332,
        address: 'Av. Insurgentes Sur 123, CDMX'
      },
      urgency: 'medium',
      vehicle_info: {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        plate: 'ABC-123'
      }
    };

    const requestResponse = await axios.post(`${BASE_URL}/api/requests`, requestData, {
      headers: {
        'Authorization': `Bearer ${testData.cliente.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Solicitud creada:', requestResponse.data);
    const requestId = requestResponse.data.id;

    // 2. KrizoWorker ve la solicitud
    console.log('\n👷 Paso 2: KrizoWorker consultando solicitudes...');
    const requestsResponse = await axios.get(`${BASE_URL}/api/requests`, {
      headers: {
        'Authorization': `Bearer ${testData.krizoWorker.token}`
      }
    });

    console.log('✅ Solicitudes disponibles:', requestsResponse.data);

    // 3. KrizoWorker crea cotización
    console.log('\n💰 Paso 3: Creando cotización...');
    const quoteData = {
      request_id: requestId,
      total_amount: 1500.00,
      currency: 'MXN',
      estimated_time: '2-3 horas',
      services: [
        {
          name: 'Diagnóstico eléctrico',
          description: 'Revisión del sistema eléctrico del vehículo',
          price: 800.00
        },
        {
          name: 'Cambio de batería',
          description: 'Instalación de batería nueva',
          price: 700.00
        }
      ],
      notes: 'Incluye diagnóstico completo y garantía de 6 meses en la batería'
    };

    const quoteResponse = await axios.post(`${BASE_URL}/api/quotes`, quoteData, {
      headers: {
        'Authorization': `Bearer ${testData.krizoWorker.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Cotización creada:', quoteResponse.data);
    const quoteId = quoteResponse.data.id;

    // 4. Cliente ve sus cotizaciones
    console.log('\n👤 Paso 4: Cliente consultando cotizaciones...');
    const clientQuotesResponse = await axios.get(`${BASE_URL}/api/quotes/client`, {
      headers: {
        'Authorization': `Bearer ${testData.cliente.token}`
      }
    });

    console.log('✅ Cotizaciones del cliente:', clientQuotesResponse.data);

    // 5. Cliente acepta la cotización y crea pago
    console.log('\n💳 Paso 5: Cliente aceptando cotización y creando pago...');
    const paymentData = {
      quote_id: quoteId,
      payment_method: 'paypal',
      amount: 1500.00,
      currency: 'MXN'
    };

    const paymentResponse = await axios.post(`${BASE_URL}/api/payments`, paymentData, {
      headers: {
        'Authorization': `Bearer ${testData.cliente.token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Pago creado:', paymentResponse.data);

    // 6. Verificar estado final
    console.log('\n📊 Paso 6: Verificando estado final...');
    
    const finalRequestResponse = await axios.get(`${BASE_URL}/api/requests/${requestId}`, {
      headers: {
        'Authorization': `Bearer ${testData.cliente.token}`
      }
    });

    const finalQuoteResponse = await axios.get(`${BASE_URL}/api/quotes/${quoteId}`, {
      headers: {
        'Authorization': `Bearer ${testData.cliente.token}`
      }
    });

    console.log('✅ Estado final de la solicitud:', finalRequestResponse.data.status);
    console.log('✅ Estado final de la cotización:', finalQuoteResponse.data.status);

    console.log('\n🎉 ¡Flujo completo probado exitosamente!');

  } catch (error) {
    console.error('❌ Error en el flujo:', error.response?.data || error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Headers:', error.response.headers);
      console.error('📊 Data:', error.response.data);
    }
    console.error('🔍 Error completo:', error);
  }
}

testServiceFlow(); 