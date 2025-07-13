const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar las rutas de usuarios con SQLite3
const usersRoutes = require('./routes/users-sqlite');

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', usersRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Krizo con SQLite3 funcionando correctamente',
    endpoints: {
      users: '/api/users',
      createUser: 'POST /api/users',
      getUsers: 'GET /api/users',
      getUserById: 'GET /api/users/:id',
      getUserByEmail: 'GET /api/users/email/:email',
      getUserByCedula: 'GET /api/users/cedula/:cedula',
      updateUser: 'PUT /api/users/:id',
      deleteUser: 'DELETE /api/users/:id'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 API disponible en: http://localhost:${PORT}`);
  console.log(`👥 Endpoints de usuarios: http://localhost:${PORT}/api/users`);
});

module.exports = app; 