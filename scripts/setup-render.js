const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando proyecto Krizo para Render...');

// Verificar que existe el archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creando archivo .env desde env.example...');
  const envExamplePath = path.join(__dirname, '..', 'env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Archivo .env creado');
  } else {
    console.log('❌ No se encontró env.example');
  }
}

// Verificar que existe la carpeta database
const dbPath = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbPath)) {
  console.log('📁 Creando carpeta database...');
  fs.mkdirSync(dbPath, { recursive: true });
  console.log('✅ Carpeta database creada');
}

// Verificar que existe la carpeta uploads
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('📁 Creando carpeta uploads...');
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('✅ Carpeta uploads creada');
}

console.log('\n✅ Configuración completada!');
console.log('\n📋 Próximos pasos para Render:');
console.log('1. Subir código a GitHub');
console.log('2. Crear cuenta en render.com');
console.log('3. Conectar repositorio');
console.log('4. Configurar variables de entorno:');
console.log('   - NODE_ENV=production');
console.log('   - PORT=10000');
console.log('   - JWT_SECRET=tu_secret_seguro');
console.log('   - EMAIL_USER=equipo.krizo@gmail.com');
console.log('   - EMAIL_PASS=tu_password_de_aplicacion');
console.log('5. Deploy automático!'); 