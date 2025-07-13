const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database/krizo.sqlite'),
  logging: false, // Desactivar logs SQL en producción
  define: {
    timestamps: true, // Agregar createdAt y updatedAt automáticamente
    underscored: true, // Usar snake_case para nombres de columnas
  }
});

// Función para sincronizar la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // alter: true para desarrollo
    console.log('✅ Base de datos SQLite sincronizada correctamente');
  } catch (error) {
    console.error('❌ Error sincronizando la base de datos:', error);
    throw error;
  }
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a SQLite establecida correctamente');
  } catch (error) {
    console.error('❌ Error conectando a SQLite:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  testConnection
}; 