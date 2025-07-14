const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { 
  initUsersTable, 
  createUser, 
  getUserById, 
  getUserByEmail, 
  getUserByCedula,
  getAllUsers, 
  updateUser,
  updateUserFields,
  deleteUser, 
  checkUserExists,
  updateUserServiceProfile,
  updateUserPaymentMethods
} = require('../database/users');

// Conexión a la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');
const db = new sqlite3.Database(dbPath);

// Inicializar la tabla al cargar el módulo
initUsersTable().catch(console.error);

// GET /api/users/workers - Obtener todos los trabajadores con perfiles de servicios
router.get('/workers', async (req, res) => {
  try {
    console.log('GET /workers llamado - obteniendo trabajadores');
    
    // Obtener todos los usuarios que son krizoworkers y tienen datos de perfil
    const selectSQL = `
      SELECT 
        id, nombres, apellidos, email, telefono, cedula,
        services, ciudad, zona, descripcion, disponibilidad, profile_image_url,
        service_phone, created_at, updated_at
      FROM users 
      WHERE tipo = 'krizoworker' 
      AND services IS NOT NULL 
      AND ciudad IS NOT NULL 
      AND zona IS NOT NULL 
      AND descripcion IS NOT NULL 
      AND disponibilidad IS NOT NULL
      ORDER BY created_at DESC
    `;
    
    db.all(selectSQL, [], (err, rows) => {
      if (err) {
        console.error('Error obteniendo trabajadores:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      console.log(`Encontrados ${rows.length} trabajadores`);
      
      // Procesar cada trabajador para parsear servicios y formatear datos
      const workers = rows.map(worker => {
        let services = [];
        if (worker.services) {
          try {
            services = JSON.parse(worker.services);
          } catch (e) {
            services = [];
          }
        }
        
        return {
          id: worker.id,
          name: `${worker.nombres} ${worker.apellidos}`,
          email: worker.email,
          telefono: worker.service_phone || worker.telefono, // Usar service_phone si existe, sino telefono personal
          cedula: worker.cedula,
          services: services,
          ciudad: worker.ciudad,
          zona: worker.zona,
          descripcion: worker.descripcion,
          disponibilidad: worker.disponibilidad,
          servicePhone: worker.service_phone,
          profileImage: worker.profile_image_url,
          createdAt: worker.created_at,
          updatedAt: worker.updated_at
        };
      });
      
      res.json({
        success: true,
        data: workers,
        count: workers.length
      });
    });
    
  } catch (error) {
    console.error('Error obteniendo trabajadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

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

// PUT /api/users/:id - Actualizar usuario (requiere todos los campos)
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

// PUT /api/users/:id/update - Actualizar campos específicos del usuario
router.put('/:id/update', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const { nombres, apellidos, telefono } = req.body;
    
    // Verificar que al menos un campo se esté actualizando
    if (!nombres && !apellidos && !telefono) {
      return res.status(400).json({ 
        error: 'Debe proporcionar al menos un campo para actualizar' 
      });
    }
    
    // Verificar si el usuario existe
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Preparar datos para actualizar (solo los campos proporcionados)
    const updateData = {};
    if (nombres) updateData.nombres = nombres;
    if (apellidos) updateData.apellidos = apellidos;
    if (telefono) updateData.telefono = telefono;
    
    // Actualizar el usuario usando updateUserFields para campos específicos
    const updatedUser = await updateUserFields(userId, updateData);
    
    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
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

// GET /api/users/:id/profile - Obtener perfil de servicios
router.get('/:id/profile', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    console.log('GET /profile llamado para usuario:', userId);
    
    if (isNaN(userId)) {
      console.log('ID de usuario inválido:', req.params.id);
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const user = await getUserById(userId);
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');
    
    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    console.log('Datos del usuario:', {
      services: user.services,
      ciudad: user.ciudad,
      zona: user.zona,
      descripcion: user.descripcion,
      disponibilidad: user.disponibilidad,
      servicePhone: user.service_phone
    });
    
    // Verificar si tiene datos de perfil
    if (!user.services && !user.ciudad && !user.zona && !user.descripcion && !user.disponibilidad && !user.service_phone) {
      console.log('No se encontraron datos de perfil para el usuario');
      return res.status(404).json({ 
        error: 'No se encontraron datos de perfil' 
      });
    }
    
    // Parsear servicios si existen
    let services = [];
    if (user.services) {
      try {
        services = JSON.parse(user.services);
        console.log('Servicios parseados:', services);
      } catch (e) {
        console.log('Error parseando servicios:', e.message);
        services = [];
      }
    }
    
    const responseData = {
      success: true,
      data: {
        services: services,
        ciudad: user.ciudad || '',
        zona: user.zona || '',
        descripcion: user.descripcion || '',
        disponibilidad: user.disponibilidad || '',
        profileImage: user.profile_image_url || null,
        servicePhone: user.service_phone || ''
      }
    };
    
    console.log('Enviando respuesta:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/users/:id/profile - Actualizar perfil de servicios
router.put('/:id/profile', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const { services, ciudad, zona, descripcion, disponibilidad, profileImage, servicePhone } = req.body;
    
    // Validar campos requeridos
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ 
        error: 'Debe seleccionar al menos un servicio' 
      });
    }
    
    if (!ciudad || !zona || !descripcion || !disponibilidad || !servicePhone) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }
    
    // Validar servicios permitidos
    const allowedServices = ['mecanico', 'grua', 'repuestos'];
    const invalidServices = services.filter(service => !allowedServices.includes(service));
    if (invalidServices.length > 0) {
      return res.status(400).json({ 
        error: `Servicios no válidos: ${invalidServices.join(', ')}` 
      });
    }
    
    // Verificar que el usuario existe
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Actualizar perfil de servicios
    const profileData = {
      services,
      ciudad: ciudad.trim(),
      zona: zona.trim(),
      descripcion: descripcion.trim(),
      disponibilidad: disponibilidad.trim(),
      profileImage: profileImage || null,
      servicePhone: servicePhone.trim()
    };
    
    const result = await updateUserServiceProfile(userId, profileData);
    
    res.json({
      success: true,
      message: result.message,
      data: result.profileData
    });
    
  } catch (error) {
    console.error('Error actualizando perfil de servicios:', error);
    
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

// GET /api/users/test - Endpoint de prueba
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de prueba funcionando en SQLite'
  });
});

// GET /api/users/:id/payment-methods - Obtener métodos de pago
router.get('/:id/payment-methods', async (req, res) => {
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
    
    res.json({
      success: true,
      data: {
        paypalEmail: user.paypal_email,
        binanceId: user.binance_id
      }
    });

  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/users/:id/payment-methods - Actualizar métodos de pago
router.put('/:id/payment-methods', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ 
        error: 'ID de usuario inválido' 
      });
    }
    
    const { paypalEmail, binanceId } = req.body;
    
    console.log('Endpoint payment-methods llamado');
    console.log('Body:', req.body);
    console.log('Params:', req.params);
    
    // Verificar que el usuario existe
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Validar email de PayPal si se proporciona
    if (paypalEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(paypalEmail)) {
        return res.status(400).json({ 
          error: 'Formato de email de PayPal inválido' 
        });
      }
    }
    
    // Validar ID de Binance si se proporciona
    if (binanceId && binanceId.trim().length < 3) {
      return res.status(400).json({ 
        error: 'El ID de Binance debe tener al menos 3 caracteres' 
      });
    }
    
    // Actualizar métodos de pago en la base de datos
    const updateData = {
      paypalEmail: paypalEmail || null,
      binanceId: binanceId || null
    };
    
    console.log('Llamando a updateUserPaymentMethods con:', { userId, updateData });
    const result = await updateUserPaymentMethods(userId, updateData);
    console.log('Resultado de updateUserPaymentMethods:', result);
    
    res.json({
      success: true,
      message: result.message,
      data: result.paymentData
    });

  } catch (error) {
    console.error('Error en payment-methods:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 