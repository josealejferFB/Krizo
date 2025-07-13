const User = require('../models/User');
const { sequelize, syncDatabase, testConnection } = require('../config/database');
require('dotenv').config();

async function createTestUsers() {
  try {
    // Inicializar la base de datos
    await testConnection();
    await syncDatabase();
    
    console.log('🗺️ Creando usuarios de prueba con ubicaciones...');

    // Usuarios de prueba con diferentes ubicaciones
    const testUsers = [
      // Mecánicos
      {
        email: 'mecanico1@krizo.com',
        password: '123456',
        firstName: 'Carlos',
        lastName: 'Mecánico',
        phone: '+1234567891',
        userType: 'mechanic',
        addressStreet: 'Av. Reforma 123',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '06500',
        addressLatitude: 19.4326,
        addressLongitude: -99.1332,
        workerServices: ['mechanic'],
        workerSpecialties: ['Motor', 'Frenos', 'Suspensión'],
        workerExperience: 8,
        workerHourlyRate: 30,
        workerRatingAverage: 4.8,
        workerRatingCount: 25,
        workerIsVerified: true,
        workerIsActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      {
        email: 'mecanico2@krizo.com',
        password: '123456',
        firstName: 'Miguel',
        lastName: 'García',
        phone: '+1234567892',
        userType: 'mechanic',
        addressStreet: 'Insurgentes Sur 456',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '03800',
        addressLatitude: 19.3556,
        addressLongitude: -99.1756,
        workerServices: ['mechanic'],
        workerSpecialties: ['Transmisión', 'Sistema Eléctrico'],
        workerExperience: 5,
        workerHourlyRate: 25,
        workerRatingAverage: 4.5,
        workerRatingCount: 15,
        workerIsVerified: true,
        workerIsActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      // Operadores de Grúa
      {
        email: 'grua1@krizo.com',
        password: '123456',
        firstName: 'Roberto',
        lastName: 'Grúa',
        phone: '+1234567893',
        userType: 'crane_operator',
        addressStreet: 'Periférico Sur 789',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '14000',
        addressLatitude: 19.3019,
        addressLongitude: -99.1897,
        workerServices: ['crane'],
        workerSpecialties: ['Remolque', 'Emergencias'],
        workerExperience: 10,
        workerHourlyRate: 40,
        workerRatingAverage: 4.9,
        workerRatingCount: 50,
        workerIsVerified: true,
        workerIsActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      {
        email: 'grua2@krizo.com',
        password: '123456',
        firstName: 'Fernando',
        lastName: 'López',
        phone: '+1234567894',
        userType: 'crane_operator',
        addressStreet: 'Calzada de Tlalpan 321',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '14000',
        addressLatitude: 19.2850,
        addressLongitude: -99.1350,
        workerServices: ['crane'],
        workerSpecialties: ['Equipos Pesados', 'Distancia Larga'],
        workerExperience: 7,
        workerHourlyRate: 35,
        workerRatingAverage: 4.7,
        workerRatingCount: 30,
        workerIsVerified: true,
        workerIsActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      // Dueños de Taller
      {
        email: 'taller1@krizo.com',
        password: '123456',
        firstName: 'Alejandro',
        lastName: 'Taller',
        phone: '+1234567895',
        userType: 'shop_owner',
        addressStreet: 'Av. Universidad 654',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '04360',
        addressLatitude: 19.3274,
        addressLongitude: -99.1567,
        workerServices: ['shop'],
        workerSpecialties: ['Carrocería', 'Pintura', 'Detallado'],
        workerExperience: 12,
        workerHourlyRate: 45,
        workerRatingAverage: 4.6,
        workerRatingCount: 40,
        workerIsVerified: true,
        workerIsActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      // Clientes
      {
        email: 'cliente1@krizo.com',
        password: '123456',
        firstName: 'María',
        lastName: 'González',
        phone: '+1234567896',
        userType: 'client',
        addressStreet: 'Condesa 987',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '06140',
        addressLatitude: 19.4150,
        addressLongitude: -99.1750,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      },
      {
        email: 'cliente2@krizo.com',
        password: '123456',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '+1234567897',
        userType: 'client',
        addressStreet: 'Roma Norte 147',
        addressCity: 'Ciudad de México',
        addressState: 'CDMX',
        addressZipCode: '06700',
        addressLatitude: 19.4200,
        addressLongitude: -99.1600,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true
      }
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const userData of testUsers) {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`⚠️  Usuario ${userData.email} ya existe`);
        existingCount++;
        continue;
      }

      // Crear usuario
      await User.create(userData);
      console.log(`✅ Usuario ${userData.email} creado exitosamente`);
      createdCount++;
    }

    console.log('\n📊 Resumen:');
    console.log(`✅ Usuarios creados: ${createdCount}`);
    console.log(`⚠️  Usuarios existentes: ${existingCount}`);
    console.log(`📧 Total de usuarios: ${createdCount + existingCount}`);

    console.log('\n🔑 Credenciales de prueba:');
    console.log('📧 Mecánicos: mecanico1@krizo.com, mecanico2@krizo.com');
    console.log('📧 Grúas: grua1@krizo.com, grua2@krizo.com');
    console.log('📧 Talleres: taller1@krizo.com');
    console.log('📧 Clientes: cliente1@krizo.com, cliente2@krizo.com');
    console.log('🔑 Contraseña para todos: 123456');

    console.log('\n🗺️ Ubicaciones de prueba:');
    console.log('📍 Centro CDMX: 19.4326, -99.1332');
    console.log('📍 Sur CDMX: 19.3556, -99.1756');
    console.log('📍 Periférico: 19.3019, -99.1897');
    console.log('📍 Tlalpan: 19.2850, -99.1350');
    console.log('📍 Universidad: 19.3274, -99.1567');
    console.log('📍 Condesa: 19.4150, -99.1750');
    console.log('📍 Roma: 19.4200, -99.1600');

  } catch (error) {
    console.error('❌ Error creando usuarios de prueba:', error);
  } finally {
    await sequelize.close();
  }
}

createTestUsers(); 