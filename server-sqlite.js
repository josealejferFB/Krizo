const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar variables de entorno
dotenv.config();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    // Verificar que sea una imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

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

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Rutas de pagos (definidas directamente para evitar conflictos con Express 5.x)
const authMiddleware = require('./middleware/auth');
const { db } = require('./database/users');

// GET /api/payments/worker - Obtener pagos del trabajador autenticado
app.get('/api/payments/worker', authMiddleware, async (req, res) => {
  try {
    const workerId = req.user.id;
    
    const query = `
      SELECT p.*, 
             c.firstName as client_firstName, 
             c.lastName as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(query, [workerId], (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del trabajador:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        payments: payments
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/worker:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/payments/worker/:workerId - Obtener pagos del trabajador (alternativa)
app.get('/api/payments/worker/:workerId', authMiddleware, async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    const query = `
      SELECT p.*, 
             c.firstName as client_firstName, 
             c.lastName as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(query, [workerId], (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del trabajador:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        data: payments
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/worker/:workerId:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/payments/submit - Enviar comprobante de pago
app.post('/api/payments/submit', authMiddleware, async (req, res) => {
  try {
    const { 
      quote_id, 
      payment_method, 
      amount, 
      reference, 
      payment_date, 
      payment_time,
      payment_screenshot 
    } = req.body;
    
    const clientId = req.user.id;
    
    // Obtener información de la cotización
    db.get('SELECT * FROM quotes WHERE id = ?', [quote_id], (err, quote) => {
      if (err) {
        console.error('Error al obtener cotización:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      if (!quote) {
        return res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
      }
      
      // Insertar el pago
      const insertQuery = `
        INSERT INTO payments (
          quote_id, 
          client_id, 
          worker_id, 
          payment_method, 
          amount, 
          reference, 
          payment_date, 
          payment_time,
          payment_screenshot, 
          status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
      `;
      
      db.run(insertQuery, [
        quote_id,
        clientId,
        quote.worker_id,
        payment_method,
        amount,
        reference,
        payment_date,
        payment_time,
        payment_screenshot
      ], function(err) {
        if (err) {
          console.error('Error al insertar pago:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al procesar el pago'
          });
        }
        
        res.json({
          success: true,
          message: 'Pago enviado correctamente',
          payment_id: this.lastID
        });
      });
    });
  } catch (error) {
    console.error('Error en POST /api/payments/submit:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/payments/:paymentId/verify - Verificar pago (trabajador)
app.put('/api/payments/:paymentId/verify', authMiddleware, async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const workerId = req.user.id;
    const { status } = req.body; // 'verified' o 'rejected'
    
    // Verificar que el pago pertenece al trabajador
    db.get('SELECT * FROM payments WHERE id = ? AND worker_id = ?', [paymentId, workerId], (err, payment) => {
      if (err) {
        console.error('Error al verificar pago:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }
      
      // Actualizar el estado del pago
      const updateQuery = `
        UPDATE payments
        SET status = ?, updated_at = datetime('now')
        WHERE id = ?
      `;
      
      db.run(updateQuery, [status, paymentId], function(err) {
        if (err) {
          console.error('Error al actualizar pago:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al actualizar el pago'
          });
        }
        
        res.json({
          success: true,
          message: `Pago ${status === 'verified' ? 'verificado' : 'rechazado'} correctamente`
        });
      });
    });
  } catch (error) {
    console.error('Error en PUT /api/payments/:paymentId/verify:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para subir documentos
app.post('/api/upload/document', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Devolver la URL del archivo subido
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Documento subido exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error subiendo documento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir el documento'
    });
  }
});

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