const express = require('express');
const User = require('../models/User');
const { 
  authenticateToken, 
  checkOwnership, 
  isWorker,
  isVerifiedWorker,
  isActiveWorker 
} = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Obtener perfil del usuario actual
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('wallet.transactions')
      .select('-password');

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Actualizar perfil del usuario
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      address,
      profileImage
    } = req.body;

    const updateData = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profileImage) updateData.profileImage = profileImage;

    // Verificar si el teléfono ya existe (si se está actualizando)
    if (phone && phone !== req.user.phone) {
      const existingPhone = await User.findOne({ phone, _id: { $ne: req.user._id } });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'El teléfono ya está registrado'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/worker-profile
// @desc    Actualizar perfil de trabajador
// @access  Private (Solo trabajadores)
router.put('/worker-profile', authenticateToken, isWorker, async (req, res) => {
  try {
    const {
      specialties,
      experience,
      certifications,
      availability,
      hourlyRate
    } = req.body;

    const updateData = {};
    
    if (specialties) updateData['workerInfo.specialties'] = specialties;
    if (experience) updateData['workerInfo.experience'] = experience;
    if (certifications) updateData['workerInfo.certifications'] = certifications;
    if (availability) updateData['workerInfo.availability'] = availability;
    if (hourlyRate) updateData['workerInfo.hourlyRate'] = hourlyRate;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil de trabajador actualizado exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando perfil de trabajador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/client-profile
// @desc    Actualizar perfil de cliente
// @access  Private (Solo clientes)
router.put('/client-profile', authenticateToken, async (req, res) => {
  try {
    const { vehicles, emergencyContacts } = req.body;

    const updateData = {};
    
    if (vehicles) updateData['clientInfo.vehicles'] = vehicles;
    if (emergencyContacts) updateData['clientInfo.emergencyContacts'] = emergencyContacts;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil de cliente actualizado exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando perfil de cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/users/notifications
// @desc    Actualizar configuración de notificaciones
// @access  Private
router.put('/notifications', authenticateToken, async (req, res) => {
  try {
    const { push, email, sms } = req.body;

    const updateData = {};
    
    if (typeof push === 'boolean') updateData['notifications.push'] = push;
    if (typeof email === 'boolean') updateData['notifications.email'] = email;
    if (typeof sms === 'boolean') updateData['notifications.sms'] = sms;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada',
      data: { user }
    });

  } catch (error) {
    console.error('Error actualizando notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/workers
// @desc    Obtener lista de trabajadores disponibles
// @access  Public
router.get('/workers', async (req, res) => {
  try {
    const {
      serviceType,
      latitude,
      longitude,
      radius = 50, // km por defecto
      rating,
      availability
    } = req.query;

    let query = {
      userType: { $in: ['mechanic', 'crane_operator', 'shop_owner'] },
      'workerInfo.isActive': true,
      'workerInfo.isVerified': true
    };

    // Filtrar por tipo de servicio
    if (serviceType) {
      query['workerInfo.services'] = serviceType;
    }

    // Filtrar por rating mínimo
    if (rating) {
      query['workerInfo.rating.average'] = { $gte: parseFloat(rating) };
    }

    let workers = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ 'workerInfo.rating.average': -1 });

    // Filtrar por ubicación si se proporcionan coordenadas
    if (latitude && longitude) {
      workers = workers.filter(worker => {
        if (!worker.address.coordinates.latitude || !worker.address.coordinates.longitude) {
          return false;
        }

        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          worker.address.coordinates.latitude,
          worker.address.coordinates.longitude
        );

        return distance <= radius;
      });
    }

    // Filtrar por disponibilidad si se especifica
    if (availability) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
      workers = workers.filter(worker => {
        const daySchedule = worker.workerInfo.availability[today];
        return daySchedule && daySchedule.available;
      });
    }

    res.json({
      success: true,
      data: { workers }
    });

  } catch (error) {
    console.error('Error obteniendo trabajadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/users/workers/:id
// @desc    Obtener perfil público de un trabajador
// @access  Public
router.get('/workers/:id', async (req, res) => {
  try {
    const worker = await User.findOne({
      _id: req.params.id,
      userType: { $in: ['mechanic', 'crane_operator', 'shop_owner'] },
      'workerInfo.isActive': true
    }).select('-password -email -phone -emailVerificationToken -passwordResetToken -wallet');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Trabajador no encontrado'
      });
    }

    res.json({
      success: true,
      data: { worker }
    });

  } catch (error) {
    console.error('Error obteniendo trabajador:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/users/verify-phone
// @desc    Verificar número de teléfono
// @access  Private
router.post('/verify-phone', authenticateToken, async (req, res) => {
  try {
    const { verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Código de verificación requerido'
      });
    }

    // TODO: Implementar verificación real del código
    // Por ahora simulamos la verificación
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isPhoneVerified: true },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Teléfono verificado exitosamente',
      data: { user }
    });

  } catch (error) {
    console.error('Error verificando teléfono:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/users/send-verification-code
// @desc    Enviar código de verificación por SMS
// @access  Private
router.post('/send-verification-code', authenticateToken, async (req, res) => {
  try {
    // TODO: Implementar envío real de SMS
    // Por ahora simulamos el envío
    
    res.json({
      success: true,
      message: 'Código de verificación enviado'
    });

  } catch (error) {
    console.error('Error enviando código:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Función auxiliar para calcular distancia entre dos puntos
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

module.exports = router; 