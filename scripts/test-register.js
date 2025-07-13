const fetch = require('node-fetch');

async function testRegister() {
  console.log('🧪 Probando registro con datos del frontend...\n');

  const testData = {
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    cedula: '1234567890',
    email: 'juan.perez@test.com',
    telefono: '3001234567',
    password: '123456',
    tipo: 'cliente'
  };

  try {
    console.log('📤 Enviando datos:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const data = await response.json();
    
    console.log('📥 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ Registro exitoso!');
      console.log('Usuario creado:', data.data.user);
    } else {
      console.log('\n❌ Error en el registro');
      console.log('Mensaje:', data.message);
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

testRegister(); 