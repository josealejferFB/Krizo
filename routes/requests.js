const express = require('express');
const Request = require('../models/Request');
const Service = require('../models/Service');
const User = require('../models/User');
const { 
  authenticateToken, 
  isClient,
  isWorker,
  checkOwnership 
} = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests
// @desc    Crear nueva solicitud de servicio
// @access  Private (Solo clientes)
router.post('/', authenticateToken, isClient, async (req, res) => {
  try {
    const {
      serviceId,
      providerId,
      serviceType,
      serviceDetails,
      location,
      scheduledDate,
      scheduledTime,
      isEmergency = false
    } = req.body;

    // Validar campos requeridos
    if (!serviceId || !providerId || !serviceType || !serviceDetails || !location || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que el servicio existe y está activo
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o no disponible'
      });
    }

    // Verificar que el proveedor existe y está activo
    const provider = await User.findById(providerId);
    if (!provider || !provider.isActive || !provider.workerInfo.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Proveedor no encontrado o no disponible'
      });
    }

    // Verificar disponibilidad del servicio
    const scheduledDateTime = new Date(scheduledDate);
    const dayOfWeek = scheduledDateTime.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    if (!service.isAvailable(dayOfWeek, scheduledTime, isEmergency)) {
      return res.status(400).json({
        success: false,
        message: 'El servicio no está disponible en la fecha y hora seleccionada'
      });
    }

    // Calcular precio estimado
    const estimatedPrice = service.calculateEstimatedPrice(
      location.distance || 0,
      serviceDetails.estimatedDuration || 1,
      isEmergency
    );

    // Crear la solicitud
    const requestData = {
      client: req.user._id,
      provider: providerId,
      service: serviceId,
      serviceType,
      serviceDetails: {
        ...serviceDetails,
        isEmergency
      },
      location,
      scheduledDate: scheduledDateTime,
      scheduledTime,
      pricing: {
        estimatedPrice,
        distance: location.distance || 0,
        hours: serviceDetails.estimatedDuration || 1,
        emergencyFee: isEmergency ? (service.pricing.emergencyFee || 0) : 0,
        distanceFee: service.pricing.distanceFee || 0
      }
    };

    const request = new Request(requestData);
    await request.save();

    // Calcular precio final
    await request.calculateFinalPrice();

    // Poblar información relacionada
    await request.populate([
      { path: 'client', select: 'firstName lastName phone' },
      { path: 'provider', select: 'firstName lastName phone workerInfo' },
      { path: 'service', select: 'name description pricing' }
    ]);

    // Notificar al proveedor (Socket.IO)
    const io = req.app.get('io');
    io.to(`provider_${providerId}`).emit('new_request', {
      requestId: request._id,
      clientName: req.user.getFullName(),
      serviceType,
      scheduledDate: scheduledDateTime,
      scheduledTime
    });

    res.status(201).json({
      success: true,
      message: 'Solicitud creada exitosamente',
      data: { request }
    });

  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/requests
// @desc    Obtener solicitudes del usuario
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filtrar por rol del usuario
    if (req.user.userType === 'client') {
      query.client = req.user._id;
    } else {
      query.provider = req.user._id;
    }

    // Filtrar por estado
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .populate([
        { path: 'client', select: 'firstName lastName phone' },
        { path: 'provider', select: 'firstName lastName phone workerInfo' },
        { path: 'service', select: 'name description pricing' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/requests/:id
// @desc    Obtener solicitud específica
// @access  Private (Cliente o proveedor involucrado)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate([
        { path: 'client', select: 'firstName lastName phone address' },
        { path: 'provider', select: 'firstName lastName phone address workerInfo' },
        { path: 'service', select: 'name description pricing' }
      ]);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario tiene acceso a esta solicitud
    if (request.client.toString() !== req.user._id.toString() && 
        request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta solicitud'
      });
    }

    res.json({
      success: true,
      data: { request }
    });

  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/requests/:id/accept
// @desc    Aceptar solicitud (proveedor)
// @access  Private (Solo proveedor)
router.put('/:id/accept', authenticateToken, isWorker, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para aceptar esta solicitud'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya no está pendiente'
      });
    }

    // Actualizar estado
    await request.updateStatus('accepted', req.user._id, 'Solicitud aceptada por el proveedor');

    // Poblar información relacionada
    await request.populate([
      { path: 'client', select: 'firstName lastName phone' },
      { path: 'provider', select: 'firstName lastName phone' },
      { path: 'service', select: 'name description' }
    ]);

    // Notificar al cliente
    const io = req.app.get('io');
    io.to(`client_${request.client}`).emit('request_accepted', {
      requestId: request._id,
      providerName: req.user.getFullName()
    });

    res.json({
      success: true,
      message: 'Solicitud aceptada exitosamente',
      data: { request }
    });

  } catch (error) {
    console.error('Error aceptando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/requests/:id/reject
// @desc    Rechazar solicitud (proveedor)
// @access  Private (Solo proveedor)
router.put('/:id/reject', authenticateToken, isWorker, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para rechazar esta solicitud'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya no está pendiente'
      });
    }

    // Actualizar estado
    await request.updateStatus('rejected', req.user._id, reason || 'Solicitud rechazada por el proveedor');

    // Notificar al cliente
    const io = req.app.get('io');
    io.to(`client_${request.client}`).emit('request_rejected', {
      requestId: request._id,
      providerName: req.user.getFullName(),
      reason: reason || 'Solicitud rechazada'
    });

    res.json({
      success: true,
      message: 'Solicitud rechazada exitosamente'
    });

  } catch (error) {
    console.error('Error rechazando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/requests/:id/start
// @desc    Iniciar servicio (proveedor)
// @access  Private (Solo proveedor)
router.put('/:id/start', authenticateToken, isWorker, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para iniciar esta solicitud'
      });
    }

    if (request.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud debe estar aceptada para iniciarla'
      });
    }

    // Actualizar estado y hora de inicio
    request.status = 'in_progress';
    request.actualStartTime = new Date();
    await request.save();

    await request.updateStatus('in_progress', req.user._id, 'Servicio iniciado');

    // Notificar al cliente
    const io = req.app.get('io');
    io.to(`client_${request.client}`).emit('service_started', {
      requestId: request._id,
      providerName: req.user.getFullName()
    });

    res.json({
      success: true,
      message: 'Servicio iniciado exitosamente'
    });

  } catch (error) {
    console.error('Error iniciando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/requests/:id/complete
// @desc    Completar servicio (proveedor)
// @access  Private (Solo proveedor)
router.put('/:id/complete', authenticateToken, isWorker, async (req, res) => {
  try {
    const { finalPrice } = req.body;
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    if (request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para completar esta solicitud'
      });
    }

    if (request.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud debe estar en progreso para completarla'
      });
    }

    // Actualizar estado y hora de finalización
    request.status = 'completed';
    request.actualEndTime = new Date();
    if (finalPrice) {
      request.pricing.finalPrice = finalPrice;
    }
    await request.save();

    await request.updateStatus('completed', req.user._id, 'Servicio completado');

    // Actualizar estadísticas del servicio
    const service = await Service.findById(request.service);
    if (service) {
      await service.markCompleted();
    }

    // Notificar al cliente
    const io = req.app.get('io');
    io.to(`client_${request.client}`).emit('service_completed', {
      requestId: request._id,
      providerName: req.user.getFullName(),
      finalPrice: request.pricing.finalPrice
    });

    res.json({
      success: true,
      message: 'Servicio completado exitosamente'
    });

  } catch (error) {
    console.error('Error completando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/requests/:id/cancel
// @desc    Cancelar solicitud (cliente o proveedor)
// @access  Private
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario puede cancelar esta solicitud
    const canCancel = request.client.toString() === req.user._id.toString() || 
                     request.provider.toString() === req.user._id.toString();

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para cancelar esta solicitud'
      });
    }

    if (['completed', 'cancelled', 'rejected'].includes(request.status)) {
      return res.status(400).json({
        success: false,
        message: 'La solicitud no puede ser cancelada en su estado actual'
      });
    }

    // Actualizar estado
    await request.updateStatus('cancelled', req.user._id, reason || 'Solicitud cancelada');

    // Notificar al otro usuario
    const io = req.app.get('io');
    const otherUserId = request.client.toString() === req.user._id.toString() ? 
                       request.provider : request.client;
    
    io.to(`user_${otherUserId}`).emit('request_cancelled', {
      requestId: request._id,
      cancelledBy: req.user.getFullName(),
      reason: reason || 'Solicitud cancelada'
    });

    res.json({
      success: true,
      message: 'Solicitud cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error cancelando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/requests/:id/message
// @desc    Enviar mensaje en una solicitud
// @access  Private (Cliente o proveedor involucrado)
router.post('/:id/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Mensaje es requerido'
      });
    }

    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que el usuario puede enviar mensajes en esta solicitud
    const canMessage = request.client.toString() === req.user._id.toString() || 
                      request.provider.toString() === req.user._id.toString();

    if (!canMessage) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para enviar mensajes en esta solicitud'
      });
    }

    // Agregar mensaje
    await request.addMessage(req.user._id, message);

    // Notificar al otro usuario
    const io = req.app.get('io');
    const otherUserId = request.client.toString() === req.user._id.toString() ? 
                       request.provider : request.client;
    
    io.to(`user_${otherUserId}`).emit('new_message', {
      requestId: request._id,
      senderName: req.user.getFullName(),
      message
    });

    res.json({
      success: true,
      message: 'Mensaje enviado exitosamente'
    });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 