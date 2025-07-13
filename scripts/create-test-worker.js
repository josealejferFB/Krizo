const User = require('../models/User');
const { sequelize, syncDatabase, testConnection } = require('../config/database');
require('dotenv').config();

async function createTestWorker() {
  try {
    // Inicializar la base de datos
    await testConnection();
    await syncDatabase();
    
    // Verificar si ya existe el usuario de prueba
    const existingUser = await User.findOne({ where: { email: 'mecanico@krizo.com' } });
    
    if (existingUser) {
      console.log('El usuario de prueba ya existe');
      console.log('Email: mecanico@krizo.com');
      console.log('Contraseña: 123456');
      return;
    }

    // Crear usuario mecánico de prueba
    const testWorker = await User.create({
      email: 'mecanico@krizo.com',
      password: '123456',
      firstName: 'Juan',
      lastName: 'Mecánico',
      phone: '+1234567890',
      userType: 'mechanic',
      addressStreet: 'Calle Principal 123',
      addressCity: 'Ciudad de Prueba',
      addressState: 'Estado de Prueba',
      addressZipCode: '12345',
      workerServices: ['mechanic'],
      workerSpecialties: ['Motor', 'Frenos', 'Transmisión'],
      workerExperience: 5,
      workerCertifications: ['Certificación Mecánica'],
      workerAvailability: {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '18:00', available: true },
        saturday: { start: '08:00', end: '14:00', available: true },
        sunday: { start: '08:00', end: '14:00', available: false }
      },
      workerHourlyRate: 25,
      workerRatingAverage: 4.5,
      workerRatingCount: 10,
      workerIsVerified: true,
      workerIsActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true
    });

    console.log('✅ Usuario de prueba creado exitosamente');
    console.log('📧 Email: mecanico@krizo.com');
    console.log('🔑 Contraseña: 123456');
    console.log('👤 Tipo: Mecánico');
    console.log('💰 Tarifa por hora: $25');

  } catch (error) {
    console.error('Error creando usuario de prueba:', error);
  } finally {
    await sequelize.close();
  }
}

createTestWorker(); 