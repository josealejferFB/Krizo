const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, '..', 'database', 'krizo.sqlite');
const db = new sqlite3.Database(dbPath);

async function createWorkerPaymentInfo() {
  try {
    console.log('🔧 Creando información de métodos de pago para workers...');

    // Buscar el worker existente (ID 6 según los logs)
    db.get('SELECT id, nombres, apellidos FROM users WHERE id = 6 AND tipo = "krizoworker"', (err, worker) => {
      if (err) {
        console.error('❌ Error buscando worker:', err);
        return;
      }

      if (!worker) {
        console.log('❌ No se encontró el worker con ID 6');
        return;
      }

      console.log(`👤 Worker encontrado: ${worker.nombres} ${worker.apellidos}`);

      // Datos de métodos de pago de ejemplo
      const paymentMethods = [
        {
          method: 'transfer',
          name: 'Transferencia Bancaria',
          account: '0102-0123-0123456789',
          bank: 'Banco de Venezuela',
          holder: 'Armando Delgado'
        },
        {
          method: 'binance',
          name: 'Binance Pay',
          id: 'armando.delgado',
          qr: 'https://example.com/binance-qr.png'
        },
        {
          method: 'zelle',
          name: 'Zelle',
          email: 'armando.delgado@gmail.com',
          holder: 'Armando Delgado'
        },
        {
          method: 'cash',
          name: 'Efectivo',
          description: 'Pago en efectivo al momento del servicio'
        }
      ];

      const paymentInfo = {
        preferred_method: 'transfer',
        instructions: 'Por favor incluir referencia con el número de cotización',
        contact_phone: '04243031238'
      };

      // Insertar o actualizar información de pago
      const insertSQL = `
        INSERT OR REPLACE INTO worker_info (
          user_id, payment_methods, payment_info, updated_at
        ) VALUES (?, ?, ?, datetime('now'))
      `;

      db.run(insertSQL, [
        worker.id,
        JSON.stringify(paymentMethods),
        JSON.stringify(paymentInfo)
      ], function(err) {
        if (err) {
          console.error('❌ Error insertando información de pago:', err);
        } else {
          console.log('✅ Información de métodos de pago creada exitosamente');
          console.log('📋 Métodos de pago configurados:');
          paymentMethods.forEach(method => {
            console.log(`   - ${method.name}`);
          });
        }
        
        db.close();
      });
    });

  } catch (error) {
    console.error('❌ Error en createWorkerPaymentInfo:', error);
    db.close();
  }
}

// Ejecutar el script
createWorkerPaymentInfo(); 