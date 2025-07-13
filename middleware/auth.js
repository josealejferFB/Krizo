const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui');
    
    // Buscar usuario en la base de datos
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Cuenta desactivada' 
      });
    }

    req.user = user;
    next();
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

// Middleware para verificar propiedad del recurso
const checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resource = await model.findByPk(req.params[paramName]);
      
      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          message: 'Recurso no encontrado' 
        });
      }

      // Verificar si el usuario es propietario del recurso
      const ownerField = resource.client ? 'client' : 'provider';
      
      if (resource[ownerField].toString() !== req.user.id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'No tienes permisos para acceder a este recurso' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Error verificando propiedad:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  };
};

// Middleware para verificar si el usuario está verificado (para trabajadores)
const isVerifiedWorker = async (req, res, next) => {
  if (req.user.userType === 'client') {
    return next();
  }

  if (!req.user.workerInfo.isVerified) {
    return res.status(403).json({ 
      success: false, 
      message: 'Tu cuenta debe estar verificada para realizar esta acción' 
    });
  }

  next();
};

// Middleware para verificar si el usuario está activo como trabajador
const isActiveWorker = async (req, res, next) => {
  if (req.user.userType === 'client') {
    return next();
  }

  if (!req.user.workerInfo.isActive) {
    return res.status(403).json({ 
      success: false, 
      message: 'Tu cuenta de trabajador está inactiva' 
    });
  }

  next();
};

// Middleware para actualizar último login
const updateLastLogin = async (req, res, next) => {
  try {
    if (req.user) {
      await User.update({ 
        lastLogin: new Date() 
      }, {
        where: { id: req.user.id }
      });
    }
    next();
  } catch (error) {
    console.error('Error actualizando último login:', error);
    next(); // Continuar aunque falle
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  isClient,
  isWorker,
  isMechanic,
  isCraneOperator,
  isShopOwner,
  checkOwnership,
  isVerifiedWorker,
  isActiveWorker,
  updateLastLogin
}; 