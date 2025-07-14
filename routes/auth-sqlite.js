const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Importar servicio de email
const { sendVerificationEmail, sendWelcomeEmail } = require('../utils/emailService');

// Importar el módulo de usuarios SQLite3
const { 
  initUsersTable, 
  createUser, 
  getUserByEmail, 
  getUserById,
  updateUserVerificationCode,
  verifyUserEmail
} = require('../database/users');

// Inicializar la tabla al cargar el módulo
initUsersTable().catch(console.error);

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Generar código de verificación
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Middleware para validar datos de registro
const validateRegistrationData = (req, res, next) => {
  console.log('🔍 Datos recibidos en validación:', req.body);
  const { email, password, nombres, apellidos, cedula, telefono, tipo } = req.body;
  
  console.log('🔍 Verificando campos:', { 
    email: email ? '✅' : '❌', 
    password: password ? '✅' : '❌', 
    nombres: nombres ? '✅' : '❌', 
    apellidos: apellidos ? '✅' : '❌',
    cedula: cedula ? '✅' : '❌',
    telefono: telefono ? '✅' : '❌'
  });
  
  if (!email || !password || !nombres || !apellidos || !cedula || !telefono) {
    console.log('❌ Campos faltantes:', { 
      email: !!email, 
      password: !!password, 
      nombres: !!nombres, 
      apellidos: !!apellidos,
      cedula: !!cedula,
      telefono: !!telefono
    });
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son requeridos'
    });
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Formato de email inválido'
    });
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres'
    });
  }
  
  next();
};

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', validateRegistrationData, async (req, res) => {
  try {
    const {
      email,
      password,
      nombres,
      apellidos,
      cedula,
      telefono,
      tipo,
      document_url
    } = req.body;

    // Verificar si el email ya existe
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Verificar si la cédula ya existe
    const { getUserByCedula } = require('../database/users');
    const existingCedula = await getUserByCedula(cedula);
    if (existingCedula) {
      return res.status(400).json({
        success: false,
        message: 'La cédula ya está registrada'
      });
    }

    // Verificar si el teléfono ya existe
    const { getUserByTelefono } = require('../database/users');
    const existingTelefono = await getUserByTelefono(telefono);
    if (existingTelefono) {
      return res.status(400).json({
        success: false,
        message: 'El teléfono ya está registrado'
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con datos del frontend
    const userData = {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      password: hashedPassword,
      tipo: tipo || 'cliente',
      document_url: document_url || null
    };

    const newUser = await createUser(userData);

    // Generar token
    const token = generateToken(newUser.id);

    // Preparar respuesta compatible con el frontend
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.nombres,
      lastName: newUser.apellidos,
      userType: 'client',
      isEmailVerified: false,
      isPhoneVerified: false,
      wallet: {
        balance: 0,
        currency: 'COP'
      },
      workerInfo: null
    };

    // Generar código de verificación
    const verificationCode = generateVerificationCode();
    await updateUserVerificationCode(newUser.id, verificationCode);
    
    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(email, verificationCode, `${nombres} ${apellidos}`);
    
    if (emailResult.success) {
      console.log(`📧 Email de verificación enviado a ${email}`);
    } else {
      console.error(`❌ Error enviando email a ${email}:`, emailResult.error);
    }
    
    // Enviar respuesta
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Revisa tu email para el código de verificación.',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.message.includes('ya está registrado')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verificar email con código
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, email, verificationCode } = req.body;
    
    console.log('🔍 Datos recibidos en verificación:', { userId, email, verificationCode });

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación es requerido'
      });
    }

    let user;
    if (userId) {
      user = await getUserById(userId);
    } else if (email) {
      user = await getUserByEmail(email);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Usuario (ID o email) y código de verificación son requeridos'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const result = await verifyUserEmail(user.id, verificationCode);

    if (result.success) {
      // Obtener datos del usuario para enviar email de bienvenida
      if (user) {
        const welcomeEmailResult = await sendWelcomeEmail(user.email, `${user.nombres} ${user.apellidos}`);
        if (welcomeEmailResult.success) {
          console.log(`📧 Email de bienvenida enviado a ${user.email}`);
        }
      }
    }

    res.json({
      success: true,
      message: 'Email verificado correctamente',
      data: result
    });

  } catch (error) {
    console.error('Error en verificación de email:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Reenviar código de verificación
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { userId, email } = req.body;

    let user;
    if (userId) {
      user = await getUserById(userId);
    } else if (email) {
      user = await getUserByEmail(email);
    } else {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario o email es requerido'
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const verificationCode = generateVerificationCode();
    await updateUserVerificationCode(userId, verificationCode);

    // Enviar email de verificación
    const emailResult = await sendVerificationEmail(user.email, verificationCode, `${user.nombres} ${user.apellidos}`);
    
    if (emailResult.success) {
      console.log(`📧 Código de verificación reenviado a ${user.email}`);
    } else {
      console.error(`❌ Error reenviando email a ${user.email}:`, emailResult.error);
    }

    res.json({
      success: true,
      message: 'Código de verificación reenviado'
    });

  } catch (error) {
    console.error('Error reenviando código:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Mapear tipo de SQLite3 a userType para el frontend
    let userType;
    switch (user.tipo) {
      case 'cliente':
        userType = 'client';
        break;
      case 'krizoworker':
        // Por defecto asignar como mechanic, se puede actualizar después
        userType = 'mechanic';
        break;
      default:
        userType = 'client';
    }

    // Generar token
    const token = generateToken(user.id);

    // Preparar respuesta compatible con el frontend
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.nombres,
      lastName: user.apellidos,
      cedula: user.cedula,
      telefono: user.telefono,
      userType: userType,
      isEmailVerified: false,
      isPhoneVerified: false,
      wallet: {
        balance: 0,
        currency: 'COP'
      },
      workerInfo: user.tipo === 'krizoworker' ? {
        services: ['mechanic'],
        availability: {
          monday: { start: '08:00', end: '18:00', available: true },
          tuesday: { start: '08:00', end: '18:00', available: true },
          wednesday: { start: '08:00', end: '18:00', available: true },
          thursday: { start: '08:00', end: '18:00', available: true },
          friday: { start: '08:00', end: '18:00', available: true },
          saturday: { start: '08:00', end: '14:00', available: true },
          sunday: { start: '08:00', end: '14:00', available: false }
        }
      } : null
    };

    // Enviar respuesta
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/auth/worker-login
// @desc    Login específico para trabajadores
// @access  Public
router.post('/worker-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar que sea un trabajador
    if (user.tipo !== 'krizoworker') {
      return res.status(401).json({
        success: false,
        message: 'Esta cuenta no es de un trabajador'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user.id);

    // Preparar respuesta compatible con el frontend
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.nombres,
      lastName: user.apellidos,
      cedula: user.cedula,
      telefono: user.telefono,
      userType: 'mechanic', // Por defecto, se puede actualizar después
      isEmailVerified: false,
      isPhoneVerified: false,
      wallet: {
        balance: 0,
        currency: 'COP'
      },
      workerInfo: {
        services: ['mechanic'],
        availability: {
          monday: { start: '08:00', end: '18:00', available: true },
          tuesday: { start: '08:00', end: '18:00', available: true },
          wednesday: { start: '08:00', end: '18:00', available: true },
          thursday: { start: '08:00', end: '18:00', available: true },
          friday: { start: '08:00', end: '18:00', available: true },
          saturday: { start: '08:00', end: '14:00', available: true },
          sunday: { start: '08:00', end: '14:00', available: false }
        }
      }
    };

    // Enviar respuesta
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Error en worker login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener información del usuario actual
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui');
    
    // Obtener usuario
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Mapear tipo de SQLite3 a userType para el frontend
    let userType;
    switch (user.tipo) {
      case 'cliente':
        userType = 'client';
        break;
      case 'krizoworker':
        userType = 'mechanic';
        break;
      default:
        userType = 'client';
    }

    // Preparar respuesta compatible con el frontend
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.nombres,
      lastName: user.apellidos,
      cedula: user.cedula,
      telefono: user.telefono,
      userType: userType,
      isEmailVerified: false,
      isPhoneVerified: false,
      wallet: {
        balance: 0,
        currency: 'COP'
      },
      workerInfo: user.tipo === 'krizoworker' ? {
        services: ['mechanic'],
        availability: {
          monday: { start: '08:00', end: '18:00', available: true },
          tuesday: { start: '08:00', end: '18:00', available: true },
          wednesday: { start: '08:00', end: '18:00', available: true },
          thursday: { start: '08:00', end: '18:00', available: true },
          friday: { start: '08:00', end: '18:00', available: true },
          saturday: { start: '08:00', end: '14:00', available: true },
          sunday: { start: '08:00', end: '14:00', available: false }
        }
      } : null
    };

    res.json({
      success: true,
      data: {
        user: userResponse
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 