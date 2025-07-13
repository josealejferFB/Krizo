const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
// Comentar el sistema anterior de Sequelize
// const { sequelize, syncDatabase, testConnection } = require('./config/database');

// Importar rutas SQLite3
const authRoutes = require('./routes/auth-sqlite');
const userRoutes = require('./routes/users-sqlite');

// Comentar rutas del sistema anterior
// const serviceRoutes = require('./routes/services');
// const requestRoutes = require('./routes/requests');
// const paymentRoutes = require('./routes/payments');
// const notificationRoutes = require('./routes/notifications');
// const geolocationRoutes = require('./routes/geolocation');

// Configurar variables de entorno
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} se unió a la sala: ${room}`);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`Usuario ${socket.id} salió de la sala: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Hacer io disponible globalmente
app.set('io', io);

// Rutas SQLite3
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Comentar rutas del sistema anterior
// app.use('/api/services', serviceRoutes);
// app.use('/api/requests', requestRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/geolocation', geolocationRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Krizo con SQLite3 funcionando correctamente',
    version: '2.0',
    database: 'SQLite3 puro',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users'
    }
  });
});

// Ruta de prueba para API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API de Krizo con SQLite3 funcionando correctamente',
    version: '2.0',
    database: 'SQLite3 puro'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Inicializar el nuevo sistema SQLite3 puro
const initializeDatabase = async () => {
  try {
    const { initUsersTable } = require('./database/users');
    await initUsersTable();
    console.log('✅ Sistema SQLite3 puro inicializado correctamente');
  } catch (err) {
    console.error('Error inicializando la base de datos SQLite3:', err);
    process.exit(1);
  }
};

initializeDatabase();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor SQLite3 corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`🔐 Endpoints de autenticación: http://localhost:${PORT}/api/auth`);
  console.log(`👥 Endpoints de usuarios: http://localhost:${PORT}/api/users`);
  console.log(`\n🧪 Usuario de prueba:`);
  console.log(`   Email: admin@krizo.com`);
  console.log(`   Contraseña: 123456`);
}); 