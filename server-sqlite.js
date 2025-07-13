const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para log de peticiones
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
  }
  next();
});

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

// Importar rutas SQLite3
const authRoutes = require('./routes/auth-sqlite');
const userRoutes = require('./routes/users-sqlite');

// Rutas SQLite3
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Krizo con SQLite3 funcionando correctamente',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      workerLogin: 'POST /api/auth/worker-login'
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

// Middleware para manejar JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON malformado recibido:', err.message);
    return res.status(400).json({ 
      success: false,
      message: 'JSON malformado en la petición',
      error: 'El cuerpo de la petición debe ser un JSON válido'
    });
  }
  
  console.error('Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Inicializar el sistema SQLite3 puro
const initializeDatabase = async () => {
  try {
    const { initUsersTable } = require('./database/users');
    await initUsersTable();
    console.log('✅ Sistema SQLite3 puro inicializado correctamente');
  } catch (err) {
    console.error('❌ Error inicializando la base de datos SQLite3:', err);
    process.exit(1);
  }
};

// Inicializar base de datos y luego iniciar servidor
const startServer = async () => {
  try {
    await initializeDatabase();
    
    const PORT = process.env.PORT || 5000;
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor SQLite3 corriendo en puerto ${PORT}`);
      console.log(`📱 API disponible en: http://localhost:${PORT}`);
      console.log(`🌐 API disponible en: http://192.168.1.14:${PORT}`);
      console.log(`🔐 Endpoints de autenticación: http://localhost:${PORT}/api/auth`);
      console.log(`👥 Endpoints de usuarios: http://localhost:${PORT}/api/users`);
      console.log(`\n🧪 Usuario de prueba:`);
      console.log(`   Email: admin@krizo.com`);
      console.log(`   Contraseña: 123456`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer(); 