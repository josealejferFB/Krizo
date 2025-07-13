// Utilidades para geolocalización
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distancia en kilómetros
  return distance;
};

// Calcular precio basado en distancia
const calculateDistancePrice = (distance, basePrice, pricePerKm = 2) => {
  if (distance <= 5) return basePrice; // 5km gratis
  const extraDistance = distance - 5;
  return basePrice + (extraDistance * pricePerKm);
};

// Encontrar trabajadores cercanos
const findNearbyWorkers = async (User, latitude, longitude, maxDistance = 50, userType = null) => {
  try {
    // Obtener todos los trabajadores activos
    const whereClause = {
      isActive: true,
      workerIsActive: true
    };

    if (userType) {
      whereClause.userType = userType;
    }

    const workers = await User.findAll({
      where: whereClause,
      attributes: [
        'id', 'firstName', 'lastName', 'userType', 'addressLatitude', 
        'addressLongitude', 'workerHourlyRate', 'workerRatingAverage',
        'workerSpecialties', 'workerAvailability'
      ]
    });

    // Calcular distancias y filtrar
    const nearbyWorkers = workers
      .map(worker => {
        if (!worker.addressLatitude || !worker.addressLongitude) {
          return null;
        }

        const distance = calculateDistance(
          latitude, 
          longitude, 
          worker.addressLatitude, 
          worker.addressLongitude
        );

        return {
          ...worker.toJSON(),
          distance: Math.round(distance * 100) / 100, // Redondear a 2 decimales
          estimatedPrice: calculateDistancePrice(distance, worker.workerHourlyRate || 25)
        };
      })
      .filter(worker => worker && worker.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);

    return nearbyWorkers;
  } catch (error) {
    console.error('Error buscando trabajadores cercanos:', error);
    throw error;
  }
};

// Validar coordenadas
const isValidCoordinates = (latitude, longitude) => {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180 &&
    latitude !== 0 && longitude !== 0
  );
};

// Obtener dirección desde coordenadas (usando API de geocodificación)
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    // Por ahora retornamos un objeto básico
    // En producción podrías usar Google Maps API, OpenStreetMap, etc.
    return {
      street: 'Dirección aproximada',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: '00000',
      coordinates: { latitude, longitude }
    };
  } catch (error) {
    console.error('Error obteniendo dirección:', error);
    return null;
  }
};

// Obtener coordenadas desde dirección (geocodificación inversa)
const getCoordinatesFromAddress = async (address) => {
  try {
    // Por ahora retornamos coordenadas de ejemplo
    // En producción usarías una API de geocodificación
    return {
      latitude: 19.4326, // Ejemplo: Ciudad de México
      longitude: -99.1332
    };
  } catch (error) {
    console.error('Error obteniendo coordenadas:', error);
    return null;
  }
};

module.exports = {
  calculateDistance,
  calculateDistancePrice,
  findNearbyWorkers,
  isValidCoordinates,
  getAddressFromCoordinates,
  getCoordinatesFromAddress
}; 