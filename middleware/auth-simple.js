// Middleware de autenticación simplificado para desarrollo
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

    // Para desarrollo, aceptar cualquier token JWT válido
    if (token === 'test-token' || token.startsWith('eyJ')) {
      // Intentar decodificar el JWT para obtener el ID del usuario
      try {
        // Decodificar el JWT (sin verificar la firma para desarrollo)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        
        const userId = payload.userId || payload.user_id || 4;
        
        // Obtener userType real de la base de datos usando la instancia correcta
        const { db } = require('../database/users');
        
        return new Promise((resolve, reject) => {
          db.get('SELECT tipo FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
              console.error('❌ Error obteniendo tipo:', err);
              return res.status(500).json({ 
                success: false, 
                message: 'Error interno del servidor' 
              });
            }
            
            if (!user) {
              console.error('❌ Usuario no encontrado en BD:', userId);
              return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
              });
            }
            
            // Mapear 'tipo' a 'userType' para compatibilidad
            const userTypeMap = {
              'cliente': 'client',
              'krizoworker': 'worker'
            };
            
            req.user = {
              id: userId,
              userType: userTypeMap[user.tipo] || 'client'
            };
            
            // Solo mostrar logs para requests que no sean polling de mensajes
            if (!req.path.includes('/messages/') || req.method !== 'GET') {
              console.log('👤 Usuario autenticado:', req.user);
            }
            next();
          });
        });
      } catch (decodeError) {
        console.error('❌ Error decodificando token:', decodeError);
        // Fallback para desarrollo
        req.user = {
          id: 4,
          userType: 'client'
        };
        return next();
      }
    }

    // Aquí iría la verificación real del JWT
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });

  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  authenticateToken
}; 