# Backend de Krizo - API REST

Este es el backend completo para la aplicación Krizo, una plataforma de servicios automotrices que conecta clientes con mecánicos, operadores de grúas y talleres.

## 🚀 Características

- **Autenticación JWT** con roles de usuario
- **API RESTful** completa
- **Socket.IO** para comunicación en tiempo real
- **Sistema de pagos** integrado con wallet
- **Notificaciones push** y en tiempo real
- **Geolocalización** para encontrar servicios cercanos
- **Sistema de calificaciones** y reseñas
- **Manejo de archivos** y documentos

## 📋 Requisitos

- Node.js (v18 o superior)
- SQLite3 (incluido con Node.js)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Krizo-master
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Copiar el archivo de ejemplo y configurar:
```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
PORT=5000
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
EMAIL_FROM=noreply@krizo.com
DB_PATH=./database/krizo.sqlite
```

4. **Configurar Email (Opcional)**
Para verificación de email, configurar Gmail:
1. Activar verificación en 2 pasos
2. Generar contraseña de aplicación
3. Usar esa contraseña en `EMAIL_PASS`

5. **Ejecutar el servidor**
```bash
# Desarrollo (con nodemon)
npm run server:dev

# Producción
npm run server

# Desarrollo completo (backend + frontend)
npm run dev
```

## 📁 Estructura del Proyecto

```
├── server.js                 # Archivo principal del servidor
├── models/                   # Modelos de MongoDB
│   ├── User.js              # Modelo de usuario
│   ├── Service.js           # Modelo de servicio
│   └── Request.js           # Modelo de solicitud
├── routes/                   # Rutas de la API
│   ├── auth.js              # Autenticación
│   ├── users.js             # Gestión de usuarios
│   ├── services.js          # Gestión de servicios
│   ├── requests.js          # Gestión de solicitudes
│   ├── payments.js          # Sistema de pagos
│   └── notifications.js     # Notificaciones
├── middleware/               # Middleware personalizado
│   └── auth.js              # Autenticación y autorización
└── config/                   # Configuraciones
```

## 🔐 Autenticación

### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+1234567890",
  "userType": "client",
  "address": {
    "street": "Calle Principal 123",
    "city": "Ciudad",
    "state": "Estado",
    "zipCode": "12345"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Login para Trabajadores
```http
POST /api/auth/worker-login
Content-Type: application/json

{
  "email": "mecanico@ejemplo.com",
  "password": "contraseña123"
}
```

## 👥 Tipos de Usuario

### Cliente (`client`)
- Solicitar servicios automotrices
- Gestionar vehículos
- Realizar pagos
- Calificar servicios

### Mecánico (`mechanic`)
- Ofrecer servicios mecánicos
- Gestionar disponibilidad
- Aceptar/rechazar solicitudes
- Recibir pagos

### Operador de Grúa (`crane_operator`)
- Servicios de remolque
- Servicios de emergencia
- Gestión de equipos pesados

### Dueño de Taller (`shop_owner`)
- Servicios de taller
- Gestión de instalaciones
- Servicios especializados

## 🔧 Servicios Disponibles

### Mecánicos
- Reparación de motor
- Transmisión
- Frenos
- Sistema eléctrico
- Aire acondicionado
- Diagnósticos
- Servicios de emergencia
- Mantenimiento preventivo

### Grúas
- Remolque
- Servicios de carretera
- Distancia larga
- Equipos pesados
- Emergencias 24/7

### Talleres
- Trabajos de carrocería
- Pintura
- Detallado
- Cristales
- Neumáticos
- Alineación

## 💰 Sistema de Pagos

### Wallet
- Depósitos y retiros
- Pagos por servicios
- Historial de transacciones
- Comisión automática (15%)

### Métodos de Pago
- Wallet interna
- Tarjeta de crédito/débito
- Transferencia bancaria
- Efectivo

## 📱 Notificaciones

### Tipos de Notificación
- Nuevas solicitudes
- Actualizaciones de estado
- Pagos recibidos
- Mensajes en tiempo real
- Recordatorios

### Canales
- Push notifications
- Email
- SMS
- Socket.IO (tiempo real)

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `POST /api/auth/worker-login` - Login trabajadores
- `GET /api/auth/me` - Perfil actual
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña

### Usuarios
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/worker-profile` - Perfil de trabajador
- `PUT /api/users/client-profile` - Perfil de cliente
- `GET /api/users/workers` - Listar trabajadores
- `GET /api/users/workers/:id` - Perfil público de trabajador

### Servicios
- `POST /api/services` - Crear servicio
- `GET /api/services` - Listar servicios
- `GET /api/services/:id` - Obtener servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio
- `GET /api/services/my-services` - Mis servicios
- `POST /api/services/:id/toggle-status` - Activar/desactivar
- `GET /api/services/categories` - Categorías disponibles

### Solicitudes
- `POST /api/requests` - Crear solicitud
- `GET /api/requests` - Mis solicitudes
- `GET /api/requests/:id` - Obtener solicitud
- `PUT /api/requests/:id/accept` - Aceptar solicitud
- `PUT /api/requests/:id/reject` - Rechazar solicitud
- `PUT /api/requests/:id/start` - Iniciar servicio
- `PUT /api/requests/:id/complete` - Completar servicio
- `PUT /api/requests/:id/cancel` - Cancelar solicitud
- `POST /api/requests/:id/message` - Enviar mensaje

### Pagos
- `GET /api/payments/wallet` - Información de wallet
- `POST /api/payments/deposit` - Depositar
- `POST /api/payments/withdraw` - Retirar
- `POST /api/payments/pay-request` - Pagar solicitud
- `GET /api/payments/transactions` - Historial
- `GET /api/payments/request/:id` - Info de pago
- `POST /api/payments/refund` - Solicitar reembolso

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/:id/read` - Marcar como leída
- `PUT /api/notifications/read-all` - Marcar todas como leídas
- `DELETE /api/notifications/:id` - Eliminar notificación
- `GET /api/notifications/unread-count` - Contar no leídas

## 🔌 Socket.IO Events

### Cliente → Servidor
- `join_room` - Unirse a sala
- `leave_room` - Salir de sala

### Servidor → Cliente
- `new_request` - Nueva solicitud
- `request_accepted` - Solicitud aceptada
- `request_rejected` - Solicitud rechazada
- `service_started` - Servicio iniciado
- `service_completed` - Servicio completado
- `request_cancelled` - Solicitud cancelada
- `new_message` - Nuevo mensaje
- `notification` - Notificación general

## 🛡️ Seguridad

- **JWT Tokens** para autenticación
- **Bcrypt** para encriptación de contraseñas
- **CORS** configurado
- **Validación** de datos de entrada
- **Middleware** de autorización por roles
- **Sanitización** de datos

## 📊 Base de Datos

### Colecciones Principales
- **users** - Información de usuarios
- **services** - Servicios ofrecidos
- **requests** - Solicitudes de servicio
- **transactions** - Transacciones de pago

### Índices Optimizados
- Email (único)
- Coordenadas geográficas
- Estado de solicitudes
- Ratings de trabajadores

## 🚀 Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://production-db-url
JWT_SECRET=secret-super-seguro-produccion
JWT_EXPIRE=7d
```

### Comandos de Despliegue
```bash
# Instalar dependencias de producción
npm install --production

# Ejecutar migraciones (si las hay)
npm run migrate

# Iniciar servidor
npm run server
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📝 TODO

- [ ] Implementar modelo de notificaciones
- [ ] Integrar pasarela de pagos real
- [ ] Implementar envío de emails
- [ ] Implementar envío de SMS
- [ ] Agregar tests unitarios
- [ ] Implementar rate limiting
- [ ] Agregar logging avanzado
- [ ] Implementar cache con Redis
- [ ] Agregar documentación con Swagger

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contacta a:
- Email: soporte@krizo.com
- Teléfono: +1-234-567-8900 