const { getAllUsers } = require('../database/users');

async function listUsers() {
  try {
    console.log('👥 Usuarios en la base de datos:');
    const users = await getAllUsers();
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombres} ${user.apellidos} (${user.email}) - Tipo: ${user.tipo}`);
    });
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
  }
}

listUsers(); 