const { db } = require('./database/users');

// Imagen PNG base64 simple para el pago de Binance (1x1 pixel verde)
const binanceScreenshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// Imagen PNG base64 simple para el pago de Transferencia (1x1 pixel azul)
const transferScreenshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// Actualizar el pago de Binance
db.run(`
  UPDATE payments 
  SET payment_screenshot = ?
  WHERE id = 1
`, [binanceScreenshot], function(err) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('✅ Screenshot de Binance actualizado (PNG)');
  }
  
  // Actualizar el pago de Transferencia
  db.run(`
    UPDATE payments 
    SET payment_screenshot = ?
    WHERE id = 2
  `, [transferScreenshot], function(err) {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('✅ Screenshot de Transferencia actualizado (PNG)');
    }
    
    // Mostrar los pagos actualizados
    db.all('SELECT id, payment_method, payment_amount, payment_screenshot FROM payments', (err, payments) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('📊 Pagos con screenshots PNG actualizados:');
        payments.forEach(payment => {
          console.log(`- ID ${payment.id}: $${payment.payment_amount} (${payment.payment_method})`);
          console.log(`  Screenshot: ${payment.payment_screenshot ? 'SÍ' : 'NO'}`);
        });
      }
      process.exit();
    });
  });
}); 