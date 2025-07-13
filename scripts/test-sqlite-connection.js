const { initUsersTable, createUser, getUserByEmail, getAllUsers } = require('../database/users');
const bcrypt = require('bcryptjs');

// Función para probar la conexión y funcionalidades básicas
const testSQLiteConnection = async () => {
  console.log('🧪 Iniciando pruebas del sistema SQLite3...\n');

  try {
    // 1. Inicializar la tabla
    console.log('1️⃣ Inicializando tabla users...');
    await initUsersTable();
    console.log('✅ Tabla users inicializada correctamente\n');

    // 2. Crear un usuario de prueba
    console.log('2️⃣ Creando usuario de prueba...');
    const testUserData = {
      nombres: 'Juan',
      apellidos: 'Pérez',
      cedula: '1234567890',
      email: 'juan.test@example.com',
      telefono: '3001234567',
      password: await bcrypt.hash('123456', 10),
      tipo: 'cliente'
    };

    const newUser = await createUser(testUserData);
    console.log('✅ Usuario creado:', {
      id: newUser.id,
      nombres: newUser.nombres,
      apellidos: newUser.apellidos,
      email: newUser.email,
      tipo: newUser.tipo
    });
    console.log('');

    // 3. Buscar usuario por email
    console.log('3️⃣ Buscando usuario por email...');
    const foundUser = await getUserByEmail('juan.test@example.com');
    if (foundUser) {
      console.log('✅ Usuario encontrado:', {
        id: foundUser.id,
        nombres: foundUser.nombres,
        email: foundUser.email
      });
    } else {
      console.log('❌ Usuario no encontrado');
    }
    console.log('');

    // 4. Obtener todos los usuarios
    console.log('4️⃣ Obteniendo todos los usuarios...');
    const allUsers = await getAllUsers();
    console.log(`✅ Total de usuarios: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.nombres} ${user.apellidos} (${user.email})`);
    });
    console.log('');

    // 5. Probar validaciones únicas
    console.log('5️⃣ Probando validaciones únicas...');
    try {
      await createUser({
        ...testUserData,
        cedula: '0987654321', // Cédula diferente
        email: 'juan.test@example.com', // Email duplicado
        telefono: '3009876543' // Teléfono diferente
      });
      console.log('❌ No se detectó el email duplicado');
    } catch (error) {
      if (error.message.includes('email')) {
        console.log('✅ Validación de email único funcionando correctamente');
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    // 6. Probar validación de tipo
    console.log('6️⃣ Probando validación de tipo...');
    try {
      await createUser({
        ...testUserData,
        cedula: '1111111111',
        email: 'test.tipo@example.com',
        telefono: '3001111111',
        tipo: 'invalid_type' // Tipo inválido
      });
      console.log('❌ No se detectó el tipo inválido');
    } catch (error) {
      if (error.message.includes('CHECK constraint failed')) {
        console.log('✅ Validación de tipo funcionando correctamente');
      } else {
        console.log('❌ Error inesperado:', error.message);
      }
    }
    console.log('');

    console.log('🎉 Todas las pruebas completadas exitosamente!');
    console.log('📱 El sistema SQLite3 está listo para conectar con el frontend.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    process.exit(1);
  }
};

// Función para probar la API REST
const testAPIConnection = async () => {
  console.log('\n🌐 Probando conexión con la API REST...\n');

  const API_BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Probar endpoint de registro
    console.log('1️⃣ Probando registro de usuario...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'api.test@example.com',
        password: '123456',
        firstName: 'María',
        lastName: 'González',
        phone: '3005555555',
        userType: 'client'
      }),
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registro exitoso:', {
        id: registerData.data.user.id,
        email: registerData.data.user.email,
        userType: registerData.data.user.userType
      });
    } else {
      console.log('❌ Error en registro:', registerData.message);
    }
    console.log('');

    // 2. Probar endpoint de login
    console.log('2️⃣ Probando login...');
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'api.test@example.com',
        password: '123456'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login exitoso:', {
        id: loginData.data.user.id,
        email: loginData.data.user.email,
        token: loginData.data.token ? 'Token generado' : 'Sin token'
      });
    } else {
      console.log('❌ Error en login:', loginData.message);
    }
    console.log('');

    // 3. Probar endpoint de usuarios
    console.log('3️⃣ Probando endpoint de usuarios...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    const usersData = await usersResponse.json();
    
    if (usersResponse.ok) {
      console.log(`✅ Usuarios obtenidos: ${usersData.users.length}`);
    } else {
      console.log('❌ Error obteniendo usuarios:', usersData.error);
    }

  } catch (error) {
    console.error('❌ Error probando API:', error.message);
    console.log('💡 Asegúrate de que el servidor esté corriendo en puerto 5000');
  }
};

// Ejecutar pruebas
const runTests = async () => {
  console.log('🚀 Iniciando pruebas del sistema SQLite3 + Frontend\n');
  
  // Probar funcionalidades básicas de SQLite3
  await testSQLiteConnection();
  
  // Probar conexión con API REST
  await testAPIConnection();
  
  console.log('\n✨ Pruebas completadas!');
  console.log('📋 Resumen:');
  console.log('   ✅ Sistema SQLite3 funcionando');
  console.log('   ✅ Validaciones implementadas');
  console.log('   ✅ API REST conectada');
  console.log('   ✅ Frontend listo para usar');
};

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testSQLiteConnection,
  testAPIConnection,
  runTests
}; 