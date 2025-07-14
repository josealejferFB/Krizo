const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/krizo.sqlite');

db.get('SELECT id, nombres, apellidos, telefono, email, paypal_email, binance_id, tipo FROM users WHERE id = 6', (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Worker data:', row);
  }
  db.close();
}); 