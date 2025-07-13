const express = require('express');
const Service = require('../models/Service');
const User = require('../models/User');
const { 
  authenticateToken, 
  isWorker,
  isVerifiedWorker,
  isActiveWorker,
  checkOwnership 
} = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/services
// @desc    Crear nuevo servicio
// @access  Private (Solo trabajadores)
router.post('/', authenticateToken, isWorker, isVerifiedWorker, isActiveWorker, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      pricing,
      serviceArea,
      requirements,
      availability,
      images,
      documents,
      tags
    } = req.body;

    // Validar campos requeridos
    if (!name || !description || !category || !subcategory || !pricing) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar que el usuario tenga el tipo correcto para la categoría
    const userTypeMap = {
      'mechanic': 'mechanic',
      'crane': 'crane_operator',
      'shop': 'shop_owner'
    };

    if (userTypeMap[category] !== req.user.userType) {
      return res.status(400).json({
        success: false,
        message: 'No tienes permisos para crear este tipo de servicio'
      });
    }

    const serviceData = {
      name,
      description,
      category,
      subcategory,
      pricing,
      serviceArea,
      requirements,
      availability,
      images,
      documents,
      tags,
      provider: req.user._id
    };

    // Agregar información específica según la categoría
    if (category === 'mechanic') {
      serviceData.mechanicServices = req.body.mechanicServices || {};
    } else if (category === 'crane') {
      serviceData.craneServices = req.body.craneServices || {};
    } else if (category === 'shop') {
      serviceData.shopServices = req.body.shopServices || {};
    }

    const service = new Service(serviceData);
    await service.save();

    // Poblar información del proveedor
    await service.populate('provider', 'firstName lastName userType');

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: { service }
    });

  } catch (error) {
    console.error('Error creando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/services
// @desc    Obtener lista de servicios
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      latitude,
      longitude,
      radius = 50,
      minRating,
      maxPrice,
      isEmergency,
      availability,
      page = 1,
      limit = 10
    } = req.query;

    let query = { isActive: true };

    // Filtrar por categoría
    if (category) {
      query.category = category;
    }

    // Filtrar por subcategoría
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Filtrar por rating mínimo
    if (minRating) {
      query['stats.averageRating'] = { $gte: parseFloat(minRating) };
    }

    // Filtrar por precio máximo
    if (maxPrice) {
      query['pricing.basePrice'] = { $lte: parseFloat(maxPrice) };
    }

    // Filtrar por servicios de emergencia
    if (isEmergency === 'true') {
      query['availability.emergency24h'] = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let services = await Service.find(query)
      .populate('provider', 'firstName lastName userType workerInfo.rating')
      .sort({ 'stats.averageRating': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filtrar por ubicación si se proporcionan coordenadas
    if (latitude && longitude) {
      services = services.filter(service => {
        const provider = service.provider;
        if (!provider.address || !provider.address.coordinates) {
          return false;
        }

        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          provider.address.coordinates.latitude,
          provider.address.coordinates.longitude
        );

        return distance <= radius;
      });
    }

    // Filtrar por disponibilidad si se especifica
    if (availability) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
      services = services.filter(service => {
        const daySchedule = service.availability[today];
        return daySchedule && daySchedule.available;
      });
    }

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      data: {
        services,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/services/:id
// @desc    Obtener servicio específico
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'firstName lastName userType workerInfo phone address');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    if (!service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no disponible'
      });
    }

    res.json({
      success: true,
      data: { service }
    });

  } catch (error) {
    console.error('Error obteniendo servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   PUT /api/services/:id
// @desc    Actualizar servicio
// @access  Private (Solo propietario del servicio)
router.put('/:id', authenticateToken, isWorker, checkOwnership(Service), async (req, res) => {
  try {
    const {
      name,
      description,
      subcategory,
      pricing,
      serviceArea,
      requirements,
      availability,
      images,
      documents,
      tags
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (subcategory) updateData.subcategory = subcategory;
    if (pricing) updateData.pricing = pricing;
    if (serviceArea) updateData.serviceArea = serviceArea;
    if (requirements) updateData.requirements = requirements;
    if (availability) updateData.availability = availability;
    if (images) updateData.images = images;
    if (documents) updateData.documents = documents;
    if (tags) updateData.tags = tags;

    // Actualizar servicios específicos según la categoría
    if (req.resource.category === 'mechanic' && req.body.mechanicServices) {
      updateData.mechanicServices = req.body.mechanicServices;
    } else if (req.resource.category === 'crane' && req.body.craneServices) {
      updateData.craneServices = req.body.craneServices;
    } else if (req.resource.category === 'shop' && req.body.shopServices) {
      updateData.shopServices = req.body.shopServices;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('provider', 'firstName lastName userType');

    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: { service }
    });

  } catch (error) {
    console.error('Error actualizando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Eliminar servicio
// @access  Private (Solo propietario del servicio)
router.delete('/:id', authenticateToken, isWorker, checkOwnership(Service), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/services/my-services
// @desc    Obtener servicios del usuario actual
// @access  Private (Solo trabajadores)
router.get('/my-services', authenticateToken, isWorker, async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    console.error('Error obteniendo mis servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/services/:id/toggle-status
// @desc    Activar/desactivar servicio
// @access  Private (Solo propietario del servicio)
router.post('/:id/toggle-status', authenticateToken, isWorker, checkOwnership(Service), async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: !req.resource.isActive },
      { new: true }
    ).populate('provider', 'firstName lastName userType');

    res.json({
      success: true,
      message: `Servicio ${service.isActive ? 'activado' : 'desactivado'} exitosamente`,
      data: { service }
    });

  } catch (error) {
    console.error('Error cambiando estado del servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   GET /api/services/categories
// @desc    Obtener categorías de servicios disponibles
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category');
    const subcategories = await Service.distinct('subcategory');

    res.json({
      success: true,
      data: {
        categories,
        subcategories
      }
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// @route   POST /api/services/:id/rate
// @desc    Calificar un servicio
// @access  Private
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating debe estar entre 1 y 5'
      });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Actualizar estadísticas del servicio
    await service.updateStats(rating);

    // Actualizar rating del proveedor
    const provider = await User.findById(service.provider);
    if (provider) {
      await provider.updateRating(rating);
    }

    res.json({
      success: true,
      message: 'Servicio calificado exitosamente'
    });

  } catch (error) {
    console.error('Error calificando servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Función auxiliar para calcular distancia
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