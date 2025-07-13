const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  // Información básica del servicio
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['mechanic', 'crane', 'shop'],
    required: true
  },
  
  // Subcategorías específicas
  subcategory: {
    type: String,
    required: true
  },
  
  // Para mecánicos
  mechanicServices: {
    engine: Boolean,
    transmission: Boolean,
    brakes: Boolean,
    electrical: Boolean,
    airConditioning: Boolean,
    diagnostics: Boolean,
    emergency: Boolean,
    preventive: Boolean
  },
  
  // Para grúas
  craneServices: {
    towing: Boolean,
    roadside: Boolean,
    longDistance: Boolean,
    heavyDuty: Boolean,
    emergency: Boolean
  },
  
  // Para talleres
  shopServices: {
    bodyWork: Boolean,
    painting: Boolean,
    detailing: Boolean,
    glass: Boolean,
    tires: Boolean,
    alignment: Boolean
  },
  
  // Precios y disponibilidad
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    hourlyRate: Number,
    emergencyFee: Number,
    distanceFee: Number, // por km
    minPrice: Number,
    maxPrice: Number
  },
  
  // Información de ubicación
  serviceArea: {
    radius: Number, // en km
    cities: [String],
    states: [String]
  },
  
  // Requisitos y restricciones
  requirements: {
    vehicleTypes: [String], // sedan, suv, truck, etc.
    maxWeight: Number, // para grúas
    tools: [String],
    certifications: [String]
  },
  
  // Estado del servicio
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Estadísticas
  stats: {
    totalRequests: { type: Number, default: 0 },
    completedRequests: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  
  // Configuración de disponibilidad
  availability: {
    monday: { start: String, end: String, available: Boolean },
    tuesday: { start: String, end: String, available: Boolean },
    wednesday: { start: String, end: String, available: Boolean },
    thursday: { start: String, end: String, available: Boolean },
    friday: { start: String, end: String, available: Boolean },
    saturday: { start: String, end: String, available: Boolean },
    sunday: { start: String, end: String, available: Boolean },
    emergency24h: { type: Boolean, default: false }
  },
  
  // Imágenes y documentos
  images: [String],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Referencias
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Tags para búsqueda
  tags: [String]
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ 'serviceArea.cities': 1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ 'stats.averageRating': -1 });

// Método para calcular precio estimado
serviceSchema.methods.calculateEstimatedPrice = function(distance = 0, hours = 1, isEmergency = false) {
  let totalPrice = this.pricing.basePrice;
  
  if (this.pricing.hourlyRate) {
    totalPrice += this.pricing.hourlyRate * hours;
  }
  
  if (this.pricing.distanceFee && distance > 0) {
    totalPrice += this.pricing.distanceFee * distance;
  }
  
  if (isEmergency && this.pricing.emergencyFee) {
    totalPrice += this.pricing.emergencyFee;
  }
  
  // Aplicar límites
  if (this.pricing.minPrice && totalPrice < this.pricing.minPrice) {
    totalPrice = this.pricing.minPrice;
  }
  
  if (this.pricing.maxPrice && totalPrice > this.pricing.maxPrice) {
    totalPrice = this.pricing.maxPrice;
  }
  
  return totalPrice;
};

// Método para verificar disponibilidad
serviceSchema.methods.isAvailable = function(day, time, isEmergency = false) {
  if (isEmergency && this.availability.emergency24h) {
    return true;
  }
  
  const daySchedule = this.availability[day.toLowerCase()];
  if (!daySchedule || !daySchedule.available) return false;
  
  const requestTime = new Date(`2000-01-01T${time}`);
  const startTime = new Date(`2000-01-01T${daySchedule.start}`);
  const endTime = new Date(`2000-01-01T${daySchedule.end}`);
  
  return requestTime >= startTime && requestTime <= endTime;
};

// Método para actualizar estadísticas
serviceSchema.methods.updateStats = function(rating = null) {
  this.stats.totalRequests += 1;
  
  if (rating !== null) {
    const currentTotal = this.stats.averageRating * this.stats.totalReviews;
    this.stats.totalReviews += 1;
    this.stats.averageRating = (currentTotal + rating) / this.stats.totalReviews;
  }
  
  return this.save();
};

// Método para marcar como completado
serviceSchema.methods.markCompleted = function() {
  this.stats.completedRequests += 1;
  return this.save();
};

module.exports = mongoose.model('Service', serviceSchema); 