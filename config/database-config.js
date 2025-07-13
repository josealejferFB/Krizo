// Configuración para manejar la migración entre sistemas de base de datos
const config = {
  // Configuración del sistema actual (Sequelize)
  current: {
    useSequelize: true,
    database: 'sqlite',
    storage: './database/krizo.sqlite',
    logging: false
  },
  
  // Configuración del nuevo sistema (SQLite3 puro)
  new: {
    useSQLite3: true,
    databasePath: './database/krizo.sqlite',
    enableLogging: false
  },
  
  // Configuración de la API
  api: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    retries: 3
  },
  
  // Configuración de autenticación
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    bcryptRounds: 10
  },
  
  // Configuración de migración
  migration: {
    // Habilitar para migrar datos del sistema anterior al nuevo
    enableMigration: false,
    // Mantener ambos sistemas funcionando en paralelo
    parallelMode: true,
    // Limpiar datos del sistema anterior después de migración
    cleanupOldData: false
  }
};

// Función para obtener la configuración actual
const getCurrentConfig = () => {
  return {
    ...config,
    // Determinar qué sistema usar basado en variables de entorno
    activeSystem: process.env.USE_SQLITE3_PURE === 'true' ? 'new' : 'current'
  };
};

// Función para verificar si usar el nuevo sistema
const useNewSystem = () => {
  return process.env.USE_SQLITE3_PURE === 'true';
};

// Función para obtener la URL base de la API
const getApiBaseUrl = () => {
  return config.api.baseURL;
};

// Función para obtener la configuración de JWT
const getJwtConfig = () => {
  return {
    secret: config.auth.jwtSecret,
    expiresIn: config.auth.jwtExpire
  };
};

// Función para obtener la configuración de bcrypt
const getBcryptConfig = () => {
  return {
    rounds: config.auth.bcryptRounds
  };
};

module.exports = {
  config,
  getCurrentConfig,
  useNewSystem,
  getApiBaseUrl,
  getJwtConfig,
  getBcryptConfig
}; 