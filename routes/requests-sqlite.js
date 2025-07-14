const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getWorkerRequests, 
  getClientRequests, 
  updateRequestStatus,
  getUserById 
} = require('../database/users');
const { authenticateToken } = require('../middleware/auth-simple');

// GET /api/requests - Obtener solicitudes según el tipo de usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userType = req.user.userType;
    const userId = req.user.id;
    
    let requests;
    
    if (userType === 'worker') {
      // Workers ven solicitudes asignadas a ellos
      requests = await getWorkerRequests(userId);
    } else {
      // Clientes ven sus propias solicitudes
      requests = await getClientRequests(userId);
    }
    
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
    
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/requests - Crear nueva solicitud
router.post('/', async (req, res) => {
  try {
    console.log('📝 Recibiendo solicitud con datos:', JSON.stringify(req.body, null, 2));
    
    const { 
      client_id, 
      worker_id, 
      service_type, 
      description, 
      client_location, 
      client_phone,
      problem_description,
      vehicle_info,
      urgency_level,
      coordinates
    } = req.body;
    
    // Validar campos requeridos
    if (!client_id || !worker_id || !service_type) {
      return res.status(400).json({ 
        error: 'client_id, worker_id y service_type son obligatorios' 
      });
    }
    
    // Verificar que el cliente existe
    const client = await getUserById(client_id);
    if (!client) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    // Verificar que el trabajador existe
    const worker = await getUserById(worker_id);
    if (!worker) {
      return res.status(404).json({ 
        error: 'Trabajador no encontrado' 
      });
    }
    
    // Preparar datos de la solicitud
    const requestData = {
      client_id: parseInt(client_id),
      worker_id: parseInt(worker_id),
      service_type,
      description: description || '',
      client_location: client_location || '',
      client_phone: client_phone || client.telefono,
      client_name: `${client.nombres} ${client.apellidos}`,
      worker_name: `${worker.nombres} ${worker.apellidos}`,
      coordinates: coordinates || null,
      problem_description: problem_description || '',
      vehicle_info: vehicle_info || '',
      urgency_level: urgency_level || 'normal'
    };
    
    // Crear la solicitud
    console.log('Creando solicitud con datos:', requestData);
    const newRequest = await createRequest(requestData);
    
    res.status(201).json({
      success: true,
      message: 'Solicitud creada correctamente',
      data: newRequest
    });
    
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/requests/worker/:workerId - Obtener solicitudes de un trabajador
router.get('/worker/:workerId', async (req, res) => {
  try {
    const workerId = parseInt(req.params.workerId);
    
    if (isNaN(workerId)) {
      return res.status(400).json({ 
        error: 'ID de trabajador inválido' 
      });
    }
    
    // Verificar que el trabajador existe
    const worker = await getUserById(workerId);
    if (!worker) {
      return res.status(404).json({ 
        error: 'Trabajador no encontrado' 
      });
    }
    
    // Obtener solicitudes del trabajador
    const requests = await getWorkerRequests(workerId);
    
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
    
  } catch (error) {
    console.error('Error obteniendo solicitudes del trabajador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/requests/client/:clientId - Obtener solicitudes de un cliente
router.get('/client/:clientId', async (req, res) => {
  try {
    const clientId = parseInt(req.params.clientId);
    
    if (isNaN(clientId)) {
      return res.status(400).json({ 
        error: 'ID de cliente inválido' 
      });
    }
    
    // Verificar que el cliente existe
    const client = await getUserById(clientId);
    if (!client) {
      return res.status(404).json({ 
        error: 'Cliente no encontrado' 
      });
    }
    
    // Obtener solicitudes del cliente
    const requests = await getClientRequests(clientId);
    
    res.json({
      success: true,
      data: requests,
      count: requests.length
    });
    
  } catch (error) {
    console.error('Error obteniendo solicitudes del cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/requests/worker/:workerId/completed - Obtener solicitudes completadas de un trabajador
router.get('/worker/:workerId/completed', async (req, res) => {
  try {
    const workerId = parseInt(req.params.workerId);
    
    if (isNaN(workerId)) {
      return res.status(400).json({ 
        error: 'ID de trabajador inválido' 
      });
    }
    
    // Verificar que el trabajador existe
    const worker = await getUserById(workerId);
    if (!worker) {
      return res.status(404).json({ 
        error: 'Trabajador no encontrado' 
      });
    }
    
    // Obtener solicitudes completadas del trabajador
    const { db } = require('../database/users');
    
    const query = `
      SELECT r.*, 
             c.nombres as client_firstName, 
             c.apellidos as client_lastName
      FROM requests r
      JOIN users c ON r.client_id = c.id
      WHERE r.worker_id = ? AND r.status = 'completed'
      ORDER BY r.created_at DESC
    `;
    
    db.all(query, [workerId], (err, requests) => {
      if (err) {
        console.error('Error al obtener solicitudes completadas:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        data: requests,
        count: requests.length
      });
    });
    
  } catch (error) {
    console.error('Error obteniendo solicitudes completadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/requests/:requestId/status - Actualizar estado de una solicitud
router.put('/:requestId/status', async (req, res) => {
  try {
    const requestId = parseInt(req.params.requestId);
    const { status } = req.body;
    
    if (isNaN(requestId)) {
      return res.status(400).json({ 
        error: 'ID de solicitud inválido' 
      });
    }
    
    // Validar estado
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Estados permitidos: pending, accepted, rejected, completed, cancelled' 
      });
    }
    
    // Actualizar estado de la solicitud
    const result = await updateRequestStatus(requestId, status);
    
    res.json({
      success: true,
      message: 'Estado de solicitud actualizado correctamente',
      data: result
    });
    
  } catch (error) {
    console.error('Error actualizando estado de solicitud:', error);
    
    if (error.message === 'Solicitud no encontrada') {
      return res.status(404).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 