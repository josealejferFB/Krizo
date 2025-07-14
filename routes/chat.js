const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth-simple');
const { 
  createMessage, 
  getMessagesByRequestId, 
  getMessagesBySessionId,
  markMessagesAsRead,
  createChatSession,
  getChatSession,
  updateChatSession,
  getUserById
} = require('../database/users');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos
const dbPath = path.join(__dirname, '../database/krizo.sqlite');
const db = new sqlite3.Database(dbPath);

// POST /api/chat/session - Crear una nueva sesión de chat
router.post('/session', authenticateToken, async (req, res) => {
  try {
    const { worker_id, client_id, service_type } = req.body;

    if (!worker_id || !client_id || !service_type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: worker_id, client_id, service_type'
      });
    }

    const sessionData = {
      worker_id,
      client_id,
      service_type,
      status: 'active',
      created_at: new Date().toISOString()
    };

    const newSession = await createChatSession(sessionData);

    res.status(201).json({
      success: true,
      message: 'Sesión de chat creada correctamente',
      data: newSession
    });

  } catch (error) {
    console.error('Error creando sesión de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/session/:sessionId - Obtener sesión de chat
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await getChatSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión de chat no encontrada'
      });
    }

    res.json({
      success: true,
      data: session
    });

  } catch (error) {
    console.error('Error obteniendo sesión de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/sessions/search - Buscar sesión existente entre cliente y trabajador
router.get('/sessions/search', authenticateToken, async (req, res) => {
  try {
    const { client_id, worker_id } = req.query;
    
    if (!client_id || !worker_id) {
      return res.status(400).json({
        success: false,
        message: 'client_id y worker_id son requeridos'
      });
    }
    
    const selectSQL = `
      SELECT * FROM chat_sessions 
      WHERE client_id = ? AND worker_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    // Usar la instancia de db del módulo database/users.js
    const { db } = require('../database/users');
    
    db.get(selectSQL, [client_id, worker_id], (err, row) => {
      if (err) {
        console.error('Error buscando sesión de chat:', err);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      } else {
        console.log('Sesión encontrada:', row);
        res.json({
          success: true,
          data: row
        });
      }
    });
  } catch (error) {
    console.error('Error buscando sesión de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/sessions/worker/:workerId - Obtener sesiones de chat de un trabajador
router.get('/sessions/worker/:workerId', authenticateToken, async (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Consulta mejorada que consolida sesiones duplicadas y obtiene el último mensaje
    const selectSQL = `
      SELECT 
        cs.id,
        cs.worker_id,
        cs.client_id,
        cs.service_type,
        cs.status,
        cs.agreed_price,
        cs.created_at,
        cs.updated_at,
        u.nombres as client_firstName,
        u.apellidos as client_lastName,
        (
          SELECT m.message 
          FROM messages m 
          WHERE m.session_id = cs.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message,
        (
          SELECT m.created_at 
          FROM messages m 
          WHERE m.session_id = cs.id 
          ORDER BY m.created_at DESC 
          LIMIT 1
        ) as last_message_time,
        (
          SELECT COUNT(*) 
          FROM messages m 
          WHERE m.session_id = cs.id
        ) as message_count
      FROM chat_sessions cs
      JOIN users u ON cs.client_id = u.id
      WHERE cs.worker_id = ? AND cs.status = 'active'
      GROUP BY cs.client_id
      ORDER BY last_message_time DESC, cs.created_at DESC
    `;
    
    // Usar la instancia de db del módulo database/users.js
    const { db } = require('../database/users');
    
    db.all(selectSQL, [workerId], (err, rows) => {
      if (err) {
        console.error('Error obteniendo sesiones de chat:', err);
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      } else {
        console.log('Sesiones de chat encontradas:', rows);
        res.json({
          success: true,
          data: rows
        });
      }
    });
  } catch (error) {
    console.error('Error obteniendo sesiones de chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/chat/messages - Crear un nuevo mensaje
router.post('/messages', authenticateToken, async (req, res) => {
  try {
    const { session_id, message, sender_type } = req.body;
    const sender_id = req.user.id;

    if (!session_id || !message || !sender_type) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: session_id, message, sender_type'
      });
    }

    if (!['client', 'worker'].includes(sender_type)) {
      return res.status(400).json({
        success: false,
        message: 'sender_type debe ser "client" o "worker"'
      });
    }

    const messageData = {
      session_id,
      sender_id,
      sender_type,
      message: message.trim()
    };

    const newMessage = await createMessage(messageData);

    // Enviar notificación push al otro usuario
    await sendPushNotification(session_id, sender_type, message);

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado correctamente',
      data: newMessage
    });

  } catch (error) {
    console.error('Error creando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/chat/messages/:sessionId - Obtener mensajes de una sesión
router.get('/messages/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sender_type } = req.query;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId es requerido'
      });
    }



    const messages = await getMessagesBySessionId(sessionId);

    // Marcar mensajes como leídos si se especifica el sender_type
    if (sender_type && ['client', 'worker'].includes(sender_type)) {
      await markMessagesAsRead(sessionId, sender_type);
    }

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/chat/messages/:sessionId/read - Marcar mensajes como leídos
router.put('/messages/:sessionId/read', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { sender_type } = req.body;

    if (!sessionId || !sender_type) {
      return res.status(400).json({
        success: false,
        message: 'sessionId y sender_type son requeridos'
      });
    }

    if (!['client', 'worker'].includes(sender_type)) {
      return res.status(400).json({
        success: false,
        message: 'sender_type debe ser "client" o "worker"'
      });
    }

    const result = await markMessagesAsRead(sessionId, sender_type);

    res.json({
      success: true,
      message: 'Mensajes marcados como leídos',
      data: result
    });

  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Función para enviar notificación push
async function sendPushNotification(sessionId, senderType, message) {
  try {
    // Obtener información de la sesión
    const session = await getChatSession(sessionId);
    if (!session) return;

    // Determinar el destinatario
    const recipientId = senderType === 'client' ? session.worker_id : session.client_id;
    
    // Obtener token de notificación del destinatario
    const recipient = await getUserById(recipientId);
    if (!recipient || !recipient.push_token) return;

    // Enviar notificación push
    const notificationData = {
      to: recipient.push_token,
      title: senderType === 'client' ? 'Nuevo mensaje del cliente' : 'Nuevo mensaje del trabajador',
      body: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      data: {
        sessionId: sessionId,
        type: 'chat_message'
      }
    };

    // Aquí implementarías el envío real de notificación push
    // Por ahora solo log
    console.log('📱 Notificación push enviada:', notificationData);

  } catch (error) {
    console.error('Error enviando notificación push:', error);
  }
}

module.exports = router; 