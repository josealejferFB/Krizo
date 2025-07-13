const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Obtener notificaciones del usuario
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread = false } = req.query;

    // TODO: Implementar modelo de notificaciones
    // Por ahora simulamos las notificaciones
    
    const notifications = [
      {
        id: '1',
        type: 'request',
        title: 'Nueva solicitud de servicio',
        message: 'Tienes una nueva solicitud de servicio mecánico',
        data: {
          requestId: '123',
          serviceType: 'mechanic'
        },
        isRead: false,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'payment',
        title: 'Pago recibido',
        message: 'Has recibido un pago de $150 por tu servicio',
        data: {
          amount: 150,
          requestId: '456'
        },
        isRead: true,
        createdAt: new Date(Date.now() - 86400000) // 1 día atrás
      }
    ];

    // Filtrar por no leídas si se especifica
    let filteredNotifications = notifications;
    if (unread === 'true') {
      filteredNotifications = notifications.filter(n => !n.isRead);
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotifications = filteredNotifications.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredNotifications.length,
          pages: Math.ceil(filteredNotifications.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Marcar notificación como leída
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar actualización real en base de datos
    // Por ahora simulamos la actualización

    res.json({
      success: true,
      message: 'Notificación marcada como leída'
    });

  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Marcar todas las notificaciones como leídas
// @access  Private
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    // TODO: Implementar actualización real en base de datos
    // Por ahora simulamos la actualización

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });

  } catch (error) {
    console.error('Error marcando notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Eliminar notificación
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implementar eliminación real en base de datos
    // Por ahora simulamos la eliminación

    res.json({
      success: true,
      message: 'Notificación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Obtener cantidad de notificaciones no leídas
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    // TODO: Implementar conteo real en base de datos
    // Por ahora simulamos el conteo
    
    const unreadCount = 3; // Simulado

    res.json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    console.error('Error obteniendo conteo de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/notifications/send
// @desc    Enviar notificación (para uso interno)
// @access  Private
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, data } = req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // TODO: Implementar envío real de notificación
    // Por ahora simulamos el envío

    // Enviar notificación en tiempo real via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${userId}`).emit('notification', {
      type,
      title,
      message,
      data
    });

    res.json({
      success: true,
      message: 'Notificación enviada exitosamente'
    });

  } catch (error) {
    console.error('Error enviando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/notifications/register-device
// @desc    Registrar dispositivo para notificaciones push
// @access  Private
router.post('/register-device', authenticateToken, async (req, res) => {
  try {
    const { deviceToken, platform } = req.body;

    if (!deviceToken || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Token del dispositivo y plataforma son requeridos'
      });
    }

    // TODO: Implementar registro real del dispositivo
    // Por ahora simulamos el registro

    res.json({
      success: true,
      message: 'Dispositivo registrado exitosamente'
    });

  } catch (error) {
    console.error('Error registrando dispositivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/notifications/unregister-device
// @desc    Desregistrar dispositivo para notificaciones push
// @access  Private
router.delete('/unregister-device', authenticateToken, async (req, res) => {
  try {
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: 'Token del dispositivo es requerido'
      });
    }

    // TODO: Implementar desregistro real del dispositivo
    // Por ahora simulamos el desregistro

    res.json({
      success: true,
      message: 'Dispositivo desregistrado exitosamente'
    });

  } catch (error) {
    console.error('Error desregistrando dispositivo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 