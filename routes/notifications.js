const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { updateUserPushToken, getUserById } = require('../database/users');

// POST /api/notifications/register - Registrar token de notificación
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { pushToken } = req.body;
    const userId = req.user.id;

    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: 'Token de notificación es requerido'
      });
    }

    const result = await updateUserPushToken(userId, pushToken);

    res.json({
      success: true,
      message: 'Token de notificación registrado correctamente',
      data: result
    });

  } catch (error) {
    console.error('Error registrando token de notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/notifications/send - Enviar notificación push
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'userId, title y body son requeridos'
      });
    }

    // Obtener el token de notificación del usuario
    const user = await getUserById(userId);
    if (!user || !user.push_token) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado o sin token de notificación'
      });
    }

    // Enviar notificación push usando Expo
    const message = {
      to: user.push_token,
      sound: 'default',
      title: title,
      body: body,
      data: data || {}
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (response.ok) {
      res.json({
        success: true,
        message: 'Notificación enviada correctamente',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Error enviando notificación',
        data: result
      });
    }

  } catch (error) {
    console.error('Error enviando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 