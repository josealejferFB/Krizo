const jwt = require('jsonwebtoken');
const { db } = require('../database/users');

// Middleware para verificar token JWT con SQLite
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Auth Debug - Token recibido:', token ? 'SÍ' : 'NO');
    console.log('🔐 Auth Debug - Auth Header:', authHeader);

    if (!token) {
      console.log('❌ Auth Debug - No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui');
    console.log('🔐 Auth Debug - Token decodificado:', decoded);
    
    // Buscar usuario en la base de datos SQLite
    db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err) {
        console.error('❌ Auth Debug - Error al buscar usuario:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error interno del servidor' 
        });
      }
      
      console.log('🔐 Auth Debug - Usuario encontrado:', user ? 'SÍ' : 'NO');
      if (user) {
        console.log('🔐 Auth Debug - User ID:', user.id);
        console.log('🔐 Auth Debug - User isActive:', user.isActive);
      }
      
      if (!user) {
        console.log('❌ Auth Debug - Usuario no encontrado');
        return res.status(401).json({ 
          success: false, 
          message: 'Usuario no encontrado' 
        });
      }

      // Verificar si el usuario está activo (si el campo existe)
      if (user.isActive !== undefined && !user.isActive) {
        console.log('❌ Auth Debug - Usuario inactivo');
        return res.status(401).json({ 
          success: false, 
          message: 'Cuenta desactivada' 
        });
      }

      console.log('✅ Auth Debug - Usuario autenticado correctamente');
      req.user = user;
      next();
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado' 
      });
    }

    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

// Middleware para verificar roles específicos
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'No autorizado' 
      });
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  };
};

// Middleware para verificar si es cliente
const isClient = authorizeRoles('client');

// Middleware para verificar si es trabajador
const isWorker = authorizeRoles('mechanic', 'crane_operator', 'shop_owner');

// Middleware para verificar si es mecánico
const isMechanic = authorizeRoles('mechanic');

// Middleware para verificar si es operador de grúa
const isCraneOperator = authorizeRoles('crane_operator');

// Middleware para verificar si es dueño de taller
const isShopOwner = authorizeRoles('shop_owner');

module.exports = {
  authenticateToken,
  authorizeRoles,
  isClient,
  isWorker,
  isMechanic,
  isCraneOperator,
  isShopOwner
}; 