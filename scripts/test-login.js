const fetch = require('node-fetch');

const testLogin = async () => {
  try {
    console.log('🔐 Probando login...\n');
    
    const loginData = {
      email: 'test@example.com',
      password: '123456'
    };
    
    console.log('📤 Enviando datos de login:', loginData);
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    const data = await response.json();
    
    console.log('📥 Respuesta del servidor:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login exitoso!');
      console.log('Usuario:', data.data.user.firstName, data.data.user.lastName);
      console.log('Token recibido:', data.data.token ? 'Sí' : 'No');
    } else {
      console.log('\n❌ Error en el login');
      console.log('Mensaje:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

testLogin(); 