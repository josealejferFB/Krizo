const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  // Información básica de la solicitud
  requestNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Usuarios involucrados
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  
  // Información del servicio solicitado
  serviceType: {
    type: String,
    enum: ['mechanic', 'crane', 'shop'],
    required: true
  },
  
  // Detalles específicos del servicio
  serviceDetails: {
    description: {
      type: String,
      required: true
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    estimatedDuration: Number, // en horas
    vehicleInfo: {
      make: String,
      model: String,
      year: Number,
      licensePlate: String,
      vin: String,
      color: String,
      issue: String
    }
  },
  
  // Ubicación del servicio
  location: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    notes: String
  },
  
  // Programación
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  actualStartTime: Date,
  actualEndTime: Date,
  
  // Estado de la solicitud
  status: {
    type: String,
    enum: [
      'pending',      // Pendiente de aceptación
      'accepted',     // Aceptada por el proveedor
      'in_progress',  // En progreso
      'completed',    // Completada
      'cancelled',    // Cancelada
      'rejected',     // Rechazada
      'expired'       // Expirada
    ],
    default: 'pending'
  },
  
  // Información financiera
  pricing: {
    estimatedPrice: Number,
    finalPrice: Number,
    distance: Number, // en km
    hours: Number,
    emergencyFee: Number,
    distanceFee: Number,
    totalAmount: Number
  },
  
  // Pagos
  payment: {
    method: {
      type: String,
      enum: ['wallet', 'card', 'cash'],
      default: 'wallet'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  
  // Comunicación
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Calificaciones y reseñas
  rating: {
    clientRating: {
      rating: Number,
      comment: String,
      timestamp: Date
    },
    providerRating: {
      rating: Number,
      comment: String,
      timestamp: Date
    }
  },
  
  // Documentos e imágenes
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Notas y comentarios
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Historial de cambios de estado
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Configuración de notificaciones
  notifications: {
    clientNotified: { type: Boolean, default: false },
    providerNotified: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Índices para mejorar rendimiento
requestSchema.index({ client: 1, status: 1 });
requestSchema.index({ provider: 1, status: 1 });
requestSchema.index({ serviceType: 1, status: 1 });
requestSchema.index({ scheduledDate: 1 });
requestSchema.index({ 'location.coordinates': '2dsphere' });
requestSchema.index({ requestNumber: 1 });

// Middleware para generar número de solicitud
requestSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Contar solicitudes del día
    const todayRequests = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    });
    
    const sequence = String(todayRequests + 1).padStart(4, '0');
    this.requestNumber = `KRZ-${year}${month}${day}-${sequence}`;
  }
  next();
});

// Método para actualizar estado
requestSchema.methods.updateStatus = function(newStatus, userId, reason = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    reason: reason
  });
  return this.save();
};

// Método para agregar mensaje
requestSchema.methods.addMessage = function(senderId, message) {
  this.messages.push({
    sender: senderId,
    message: message
  });
  return this.save();
};

// Método para calcular precio final
requestSchema.methods.calculateFinalPrice = function() {
  let total = this.pricing.estimatedPrice || 0;
  
  if (this.pricing.emergencyFee) {
    total += this.pricing.emergencyFee;
  }
  
  if (this.pricing.distanceFee && this.pricing.distance) {
    total += this.pricing.distanceFee * this.pricing.distance;
  }
  
  this.pricing.finalPrice = total;
  return this.save();
};

// Método para verificar si está expirada
requestSchema.methods.isExpired = function() {
  const now = new Date();
  const scheduledDateTime = new Date(this.scheduledDate);
  scheduledDateTime.setHours(
    parseInt(this.scheduledTime.split(':')[0]),
    parseInt(this.scheduledTime.split(':')[1])
  );
  
  // Considerar expirada si pasaron más de 2 horas de la hora programada
  const expirationTime = new Date(scheduledDateTime.getTime() + (2 * 60 * 60 * 1000));
  return now > expirationTime;
};

// Método para obtener duración real
requestSchema.methods.getActualDuration = function() {
  if (!this.actualStartTime || !this.actualEndTime) {
    return null;
  }
  
  const duration = this.actualEndTime - this.actualStartTime;
  return Math.round(duration / (1000 * 60 * 60)); // en horas
};

module.exports = mongoose.model('Request', requestSchema); 