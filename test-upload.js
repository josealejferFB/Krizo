const fs = require('fs');
const FormData = require('form-data');

// Crear una imagen de prueba simple (1x1 pixel PNG)
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

// Guardar la imagen de prueba
fs.writeFileSync('test-image.png', testImageData);

console.log('✅ Imagen de prueba creada: test-image.png');
console.log('📸 Ahora puedes probar la subida de imágenes desde la app');
console.log('🔗 URL del servidor: http://192.168.1.14:5000');
console.log('📁 Carpeta de uploads: http://192.168.1.14:5000/uploads/');
console.log('\n🚀 Para probar:');
console.log('1. Abre la app en el teléfono');
console.log('2. Ve a una cotización');
console.log('3. Toca "Enviar Comprobante de Pago"');
console.log('4. Selecciona o toma una foto');
console.log('5. La imagen se subirá automáticamente');
console.log('6. El worker podrá ver la imagen real en su pantalla de pagos'); 