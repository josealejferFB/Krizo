const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { 
  initUsersTable, 
  createUser, 
  getUserById, 
  getUserByEmail, 
  getUserByCedula,
  getAllUsers, 
  updateUser, 
  deleteUser, 
  checkUserExists 
} = require('../database/users');

// Inicializar la tabla al cargar el módulo
initUsersTable().catch(console.error);

// Middleware para validar datos de usuario
const validateUserData = (req, res, next) => {
  const { nombres, apellidos, cedula, email, telefono, password, tipo } = req.body;
  
  if (!nombres || !apellidos || !cedula || !email || !telefono || !password || !tipo) {
    return res.status(400).json({ 
      error: 'Todos los campos son requeridos' 
    });
  }
  
  if (!['cliente', 'krizoworker'].includes(tipo)) {
    return res.status(400).json({ 
      error: 'El tipo debe ser "cliente" o "krizoworker"' 
    });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Formato de email inválido' 
    });
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'La contraseña debe tener al menos 6 caracteres' 
    });
  }
  
  next();
};

// POST /api/users - Crear nuevo usuario
router.post('/', validateUserData, async (req, res) => {
  try {
    const { nombres, apellidos, cedula, email, telefono, password, tipo } = req.body;
    
    // Verificar si ya existe un usuario con los datos únicos
    const existingField = await checkUserExists(email, cedula, telefono);
    if (existingField !== 'none') {
      return res.status(409).json({ 
        error: `Ya existe un usuario con este ${existingField}` 
      });
    }
    
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear usuario
    const userData = {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      password: hashedPassword,
      tipo
    };
    
    const newUser = await createUser(userData);
    
    // No devolver la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const user = await getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/users/email/:email - Obtener usuario por email
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Error obteniendo usuario por email:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// GET /api/users/cedula/:cedula - Obtener usuario por cédula
router.get('/cedula/:cedula', async (req, res) => {
  try {
    const { cedula } = req.params;
    const user = await getUserByCedula(cedula);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // No devolver la contraseña
    const { password, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
    
  } catch (error) {
    console.error('Error obteniendo usuario por cédula:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', validateUserData, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const { nombres, apellidos, cedula, email, telefono, password, tipo } = req.body;
    
    // Verificar si el usuario existe
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Encriptar contraseña si se proporciona una nueva
    let hashedPassword = existingUser.password;
    if (password && password !== existingUser.password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    const userData = {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      password: hashedPassword,
      tipo
    };
    
    const updatedUser = await updateUser(userId, userData);
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      message: 'Usuario actualizado exitosamente',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    
    if (error.message.includes('ya está registrado')) {
      return res.status(409).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const result = await deleteUser(userId);
    res.json({ 
      message: result.message 
    });
    
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

module.exports = router; 