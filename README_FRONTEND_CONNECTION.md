# 🔗 Conexión Frontend con Sistema SQLite3

El frontend ya está **conectado** con el nuevo sistema SQLite3. Aquí te explico cómo funciona y cómo activarlo.

## ✅ **Estado Actual:**

### **Frontend (React Native/Expo):**
- ✅ **AuthContext** configurado para usar `http://localhost:5000/api`
- ✅ **Rutas de autenticación** compatibles con el nuevo sistema
- ✅ **Manejo de tokens JWT** implementado
- ✅ **Almacenamiento local** con AsyncStorage

### **Backend (Express.js + SQLite3):**
- ✅ **Nuevas rutas de autenticación** (`routes/auth-sqlite.js`)
- ✅ **Sistema de usuarios SQLite3** (`database/users.js`)
- ✅ **Validaciones completas** implementadas
- ✅ **Compatibilidad** con el formato de respuesta del frontend

## 🚀 **Cómo Activar el Nuevo Sistema:**

### **1. Opción 1: Cambio Automático (Recomendado)**
El servidor ya está configurado para usar el nuevo sistema. Solo necesitas:

```bash
# Iniciar el servidor
npm run server

# O en modo desarrollo
npm run server:dev
```

### **2. Opción 2: Variable de Entorno**
Si quieres controlar qué sistema usar:

```bash
# Usar el nuevo sistema SQLite3
USE_SQLITE3_PURE=true npm run server

# Usar el sistema anterior (Sequelize)
USE_SQLITE3_PURE=false npm run server
```

## 📱 **Endpoints Conectados:**

### **Autenticación:**
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de clientes
- `POST /api/auth/worker-login` - Login de trabajadores
- `GET /api/auth/me` - Obtener usuario actual

### **Usuarios:**
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/email/:email` - Obtener usuario por email
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## 🔄 **Mapeo de Datos:**

### **Registro/Login:**
```javascript
// Frontend envía:
{
  email: "usuario@example.com",
  password: "123456",
  firstName: "Juan",
  lastName: "Pérez",
  phone: "3001234567",
  userType: "client" // o "mechanic", "crane_operator", "shop_owner"
}

// Backend SQLite3 almacena:
{
  nombres: "Juan",
  apellidos: "Pérez",
  cedula: "CED_1234567890",
  email: "usuario@example.com",
  telefono: "3001234567",
  password: "hash_encriptado",
  tipo: "cliente" // o "krizoworker"
}

// Frontend recibe:
{
  id: 1,
  email: "usuario@example.com",
  firstName: "Juan",
  lastName: "Pérez",
  userType: "client",
  isEmailVerified: false,
  isPhoneVerified: false,
  wallet: { balance: 0, currency: "COP" },
  workerInfo: null // o datos de trabajador
}
```

## 🧪 **Probar la Conexión:**

### **1. Ejecutar pruebas automáticas:**
```bash
node scripts/test-sqlite-connection.js
```

### **2. Probar manualmente desde el frontend:**
1. Abrir la app en el emulador/dispositivo
2. Ir a la pantalla de registro
3. Crear una cuenta nueva
4. Verificar que se guarde en SQLite3

### **3. Verificar en la base de datos:**
```bash
# Usar SQLite CLI para ver los datos
sqlite3 database/krizo.sqlite
.tables
SELECT * FROM users;
```

## 🔧 **Configuración Avanzada:**

### **Archivo de Configuración:**
```javascript
// config/database-config.js
const config = {
  // Cambiar URL de la API si es necesario
  api: {
    baseURL: 'http://localhost:5000/api'
  },
  
  // Configuración de autenticación
  auth: {
    jwtSecret: 'tu_jwt_secret_super_seguro_aqui',
    jwtExpire: '7d',
    bcryptRounds: 10
  }
};
```

### **Variables de Entorno:**
```bash
# .env
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d
USE_SQLITE3_PURE=true
PORT=5000
```

## 📋 **Funcionalidades Implementadas:**

### **✅ Autenticación:**
- Registro de usuarios (clientes y trabajadores)
- Login con validación de credenciales
- Tokens JWT para sesiones
- Verificación de tipo de usuario

### **✅ Validaciones:**
- Email único
- Teléfono único
- Cédula única
- Formato de email válido
- Contraseña mínima 6 caracteres
- Tipo de usuario válido

### **✅ Seguridad:**
- Contraseñas encriptadas con bcrypt
- Tokens JWT seguros
- Validación de sesiones
- Manejo de errores robusto

### **✅ Compatibilidad:**
- Formato de respuesta compatible con frontend
- Mapeo automático de tipos de usuario
- Estructura de datos consistente
- Manejo de errores estandarizado

## 🚨 **Solución de Problemas:**

### **Error: "Cannot connect to server"**
```bash
# Verificar que el servidor esté corriendo
npm run server

# Verificar puerto
curl http://localhost:5000/api
```

### **Error: "Email already exists"**
- El email ya está registrado en la base de datos
- Usar un email diferente para pruebas

### **Error: "Invalid credentials"**
- Verificar que el email y contraseña sean correctos
- La contraseña debe tener al menos 6 caracteres

### **Error: "Token invalid"**
- El token JWT ha expirado
- Hacer logout y login nuevamente

## 🎉 **¡Listo para Usar!**

El frontend ya está **completamente conectado** con el nuevo sistema SQLite3. Puedes:

1. **Registrar usuarios** desde la app
2. **Iniciar sesión** con credenciales válidas
3. **Gestionar perfiles** de usuarios
4. **Usar todas las funcionalidades** de la app

El sistema mantiene **compatibilidad total** con el frontend existente mientras usa la nueva base de datos SQLite3 pura. 