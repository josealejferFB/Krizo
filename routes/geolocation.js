const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { findNearbyWorkers, isValidCoordinates, getAddressFromCoordinates } = require('../utils/geolocation');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/geolocation/nearby-workers
// @desc    Buscar trabajadores cercanos a una ubicación
// @access  Private
router.get('/nearby-workers', authenticateToken, async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      maxDistance = 50, 
      userType = null,
      serviceType = null 
    } = req.query;

    // Validar coordenadas
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    if (!isValidCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Coordenadas inválidas'
      });
    }

    // Buscar trabajadores cercanos
    const nearbyWorkers = await findNearbyWorkers(
      User,
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(maxDistance),
      userType
    );

    // Filtrar por tipo de servicio si se especifica
    let filteredWorkers = nearbyWorkers;
    if (serviceType) {
      filteredWorkers = nearbyWorkers.filter(worker => 
        worker.workerServices && worker.workerServices.includes(serviceType)
      );
    }

    res.json({
      success: true,
      data: {
        workers: filteredWorkers,
        total: filteredWorkers.length,
        searchLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        maxDistance: parseFloat(maxDistance)
      }
    });

  } catch (error) {
    console.error('Error buscando trabajadores cercanos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/geolocation/update-location
// @desc    Actualizar ubicación del usuario
// @access  Private
router.post('/update-location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    if (!isValidCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Coordenadas inválidas'
      });
    }

    // Actualizar ubicación del usuario
    const user = await User.findByPk(req.user.id);
    
    user.addressLatitude = parseFloat(latitude);
    user.addressLongitude = parseFloat(longitude);

    // Si se proporciona dirección, actualizarla también
    if (address) {
      user.addressStreet = address.street || user.addressStreet;
      user.addressCity = address.city || user.addressCity;
      user.addressState = address.state || user.addressState;
      user.addressZipCode = address.zipCode || user.addressZipCode;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Ubicación actualizada correctamente',
      data: {
        location: {
          latitude: user.addressLatitude,
          longitude: user.addressLongitude,
          address: {
            street: user.addressStreet,
            city: user.addressCity,
            state: user.addressState,
            zipCode: user.addressZipCode
          }
        }
      }
    });

  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/geolocation/address-from-coordinates
// @desc    Obtener dirección desde coordenadas
// @access  Private
router.get('/address-from-coordinates', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    if (!isValidCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({
        success: false,
        message: 'Coordenadas inválidas'
      });
    }

    const address = await getAddressFromCoordinates(
      parseFloat(latitude), 
      parseFloat(longitude)
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'No se pudo obtener la dirección'
      });
    }

    res.json({
      success: true,
      data: { address }
    });

  } catch (error) {
    console.error('Error obteniendo dirección:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/geolocation/emergency-workers
// @desc    Buscar trabajadores de emergencia cercanos (24/7)
// @access  Private
router.get('/emergency-workers', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 100 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    // Buscar trabajadores de emergencia (grúas principalmente)
    const emergencyWorkers = await findNearbyWorkers(
      User,
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(maxDistance),
      'crane_operator'
    );

    // Filtrar solo los que están disponibles 24/7
    const available24h = emergencyWorkers.filter(worker => {
      const availability = worker.workerAvailability;
      return availability && 
             availability.sunday && availability.sunday.available &&
             availability.monday && availability.monday.available &&
             availability.tuesday && availability.tuesday.available &&
             availability.wednesday && availability.wednesday.available &&
             availability.thursday && availability.thursday.available &&
             availability.friday && availability.friday.available &&
             availability.saturday && availability.saturday.available;
    });

    res.json({
      success: true,
      data: {
        workers: available24h,
        total: available24h.length,
        searchLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        maxDistance: parseFloat(maxDistance)
      }
    });

  } catch (error) {
    console.error('Error buscando trabajadores de emergencia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 