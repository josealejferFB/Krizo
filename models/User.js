const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userType: {
    type: DataTypes.ENUM('client', 'mechanic', 'crane_operator', 'shop_owner'),
    allowNull: false
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Dirección
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressState: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressZipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressLatitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  addressLongitude: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  // Información de trabajador
  workerServices: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('workerServices');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('workerServices', JSON.stringify(value));
    }
  },
  workerSpecialties: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('workerSpecialties');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('workerSpecialties', JSON.stringify(value));
    }
  },
  workerExperience: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  workerCertifications: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('workerCertifications');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('workerCertifications', JSON.stringify(value));
    }
  },
  workerAvailability: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('workerAvailability');
      return value ? JSON.parse(value) : {
        monday: { start: '08:00', end: '18:00', available: true },
        tuesday: { start: '08:00', end: '18:00', available: true },
        wednesday: { start: '08:00', end: '18:00', available: true },
        thursday: { start: '08:00', end: '18:00', available: true },
        friday: { start: '08:00', end: '18:00', available: true },
        saturday: { start: '08:00', end: '14:00', available: true },
        sunday: { start: '08:00', end: '14:00', available: false }
      };
    },
    set(value) {
      this.setDataValue('workerAvailability', JSON.stringify(value));
    }
  },
  workerHourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  workerRatingAverage: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0
  },
  workerRatingCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  workerIsVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  workerIsActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  // Información de cliente
  clientVehicles: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('clientVehicles');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('clientVehicles', JSON.stringify(value));
    }
  },
  clientEmergencyContacts: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('clientEmergencyContacts');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('clientEmergencyContacts', JSON.stringify(value));
    }
  },
  // Wallet
  walletBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  walletTransactions: {
    type: DataTypes.TEXT, // JSON string
    allowNull: true,
    get() {
      const value = this.getDataValue('walletTransactions');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('walletTransactions', JSON.stringify(value));
    }
  },
  // Configuración de notificaciones
  notificationsPush: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  notificationsEmail: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  notificationsSms: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  // Estado de la cuenta
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Tokens de verificación
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailVerificationExpires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Métodos de instancia
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

User.prototype.updateRating = async function(newRating) {
  const currentTotal = this.workerRatingAverage * this.workerRatingCount;
  this.workerRatingCount += 1;
  this.workerRatingAverage = (currentTotal + newRating) / this.workerRatingCount;
  return await this.save();
};

User.prototype.isAvailable = function(day, time) {
  if (this.userType === 'client') return false;
  
  const availability = this.workerAvailability;
  const daySchedule = availability[day.toLowerCase()];
  if (!daySchedule || !daySchedule.available) return false;
  
  const requestTime = new Date(`2000-01-01T${time}`);
  const startTime = new Date(`2000-01-01T${daySchedule.start}`);
  const endTime = new Date(`2000-01-01T${daySchedule.end}`);
  
  return requestTime >= startTime && requestTime <= endTime;
};

module.exports = User; 