const { db } = require('../database/users');

// Función para crear pagos de prueba
const createTestPayments = () => {
  return new Promise((resolve, reject) => {
    console.log('💰 Creando pagos de prueba...');
    
    // Pagos de prueba basados en las cotizaciones existentes
    const testPayments = [
      {
        quote_id: 1,
        client_id: 4, // Santo Delgado
        worker_id: 6, // Armando Delgado
        payment_method: 'Transferencia Bancaria',
        amount: 55,
        reference: 'TRF-001-2025',
        payment_date: '2025-07-14',
        payment_time: '10:30:00',
        payment_screenshot: null,
        status: 'verified',
        created_at: '2025-07-14 10:30:00'
      },
      {
        quote_id: 2,
        client_id: 4, // Santo Delgado
        worker_id: 6, // Armando Delgado
        payment_method: 'Pago Móvil',
        amount: 250,
        reference: 'PM-002-2025',
        payment_date: '2025-07-14',
        payment_time: '14:15:00',
        payment_screenshot: null,
        status: 'pending',
        created_at: '2025-07-14 14:15:00'
      },
      {
        quote_id: 1,
        client_id: 4, // Santo Delgado
        worker_id: 6, // Armando Delgado
        payment_method: 'Efectivo',
        amount: 100,
        reference: 'EFE-003-2025',
        payment_date: '2025-07-14',
        payment_time: '16:45:00',
        payment_screenshot: null,
        status: 'verified',
        created_at: '2025-07-14 16:45:00'
      }
    ];

    let completedPayments = 0;
    
    testPayments.forEach((payment, index) => {
      const insertQuery = `
        INSERT INTO payments (
          quote_id, 
          client_id, 
          worker_id, 
          payment_method, 
          payment_amount, 
          payment_reference, 
          payment_date, 
          payment_time,
          payment_screenshot, 
          status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(insertQuery, [
        payment.quote_id,
        payment.client_id,
        payment.worker_id,
        payment.payment_method,
        payment.amount,
        payment.reference,
        payment.payment_date,
        payment.payment_time,
        payment.payment_screenshot,
        payment.status,
        payment.created_at
      ], function(err) {
        if (err) {
          console.error(`❌ Error creando pago ${index + 1}:`, err);
        } else {
          console.log(`✅ Pago ${index + 1} creado con ID: ${this.lastID}`);
        }
        
        completedPayments++;
        if (completedPayments === testPayments.length) {
          console.log('🎉 Todos los pagos de prueba creados exitosamente');
          resolve();
        }
      });
    });
  });
};

// Ejecutar el script
createTestPayments()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 