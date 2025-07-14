# 🚗 Krizo - Plataforma de Servicios Automotrices

[![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.11-black.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightgrey.svg)](https://www.sqlite.org/)

> **Krizo** es una plataforma móvil completa que conecta clientes con trabajadores automotrices especializados (mecánicos, grúas, repuestos) en tiempo real, facilitando la solicitud de servicios, cotizaciones y pagos.

## 📱 Características Principales

### 🔧 **Para Clientes**
- **Solicitud de Servicios**: Crear solicitudes para servicios automotrices
- **Cotizaciones**: Recibir y comparar cotizaciones de diferentes trabajadores
- **Sistema de Pagos**: Pagos seguros con múltiples métodos (PayPal, Binance, Transferencia, Efectivo, Zelle)
- **Subida de Comprobantes**: Enviar comprobantes de pago con imágenes
- **Seguimiento**: Monitorear el estado de solicitudes y pagos
- **Chat en Tiempo Real**: Comunicación directa con trabajadores

### 👨‍🔧 **Para Trabajadores (KrizoWorkers)**
- **Gestión de Solicitudes**: Ver y gestionar solicitudes asignadas
- **Envío de Cotizaciones**: Crear y enviar cotizaciones detalladas
- **Verificación de Pagos**: Aceptar o rechazar comprobantes de pago
- **Órdenes Finalizadas**: Historial de servicios completados y pagos verificados
- **Perfil de Servicios**: Configurar servicios ofrecidos y métodos de pago
- **Notificaciones**: Alertas en tiempo real de nuevas solicitudes

## 🛠️ Tecnologías Utilizadas

### **Frontend (React Native + Expo)**
- **React Native 0.79.4** - Framework móvil
- **Expo 53.0.11** - Plataforma de desarrollo
- **React Navigation 7** - Navegación entre pantallas
- **React Native Paper** - Componentes de UI
- **Expo Image Picker** - Selección de imágenes
- **AsyncStorage** - Almacenamiento local

### **Backend (Node.js + Express)**
- **Node.js** - Runtime de JavaScript
- **Express 5.1.0** - Framework web
- **SQLite3** - Base de datos ligera
- **JWT** - Autenticación con tokens
- **Multer** - Manejo de archivos
- **Nodemailer** - Envío de emails
- **Socket.io** - Comunicación en tiempo real

### **Base de Datos**
- **SQLite3** - Base de datos relacional
- **Migraciones automáticas** - Gestión de esquemas

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/krizo.git
cd krizo
```

### **2. Instalar Dependencias**
```bash
# Instalar dependencias del proyecto
npm install

# Instalar dependencias de desarrollo
npm install -g nodemon
```

### **3. Configurar Variables de Entorno**
Copiar el archivo de ejemplo y configurar:
```bash
cp env.example .env
```

Editar `.env` con tus configuraciones:
```env
# Configuración del servidor
PORT=5000
NODE_ENV=development

# JWT Secret (cambiar por uno seguro)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Configuración de email (Gmail con contraseña de aplicación)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion

# Configuración de la base de datos SQLite
DB_PATH=./database/krizo.sqlite
```

### **4. Configurar Email (Opcional)**
Para que funcione la verificación de email, configurar Gmail:
1. Activar verificación en 2 pasos en tu cuenta Gmail
2. Generar contraseña de aplicación
3. Usar esa contraseña en `EMAIL_PASS`

### **5. Inicializar la Base de Datos**
```bash
# El servidor creará automáticamente las tablas al iniciar
npm run server:dev
```

### **6. Ejecutar el Proyecto**

#### **Opción A: Desarrollo Completo (Backend + Frontend)**
```bash
# Ejecutar backend y frontend simultáneamente
npm run dev:sqlite
```

#### **Opción B: Ejecutar por Separado**
```bash
# Terminal 1: Backend
npm run server:dev

# Terminal 2: Frontend
npm start
```

## 📱 Uso de la Aplicación

### **Registro y Autenticación**
1. **Registro de Cliente**: Crear cuenta con email, contraseña y datos personales
2. **Registro de Trabajador**: Registro especializado con servicios ofrecidos
3. **Login**: Autenticación segura con JWT

### **Flujo de Trabajo**

#### **Para Clientes:**
1. **Crear Solicitud**: Seleccionar tipo de servicio y proporcionar detalles
2. **Recibir Cotizaciones**: Revisar cotizaciones de trabajadores disponibles
3. **Aceptar Cotización**: Elegir la mejor opción
4. **Realizar Pago**: Pagar con método preferido y subir comprobante
5. **Seguimiento**: Monitorear estado hasta completar el servicio

#### **Para Trabajadores:**
1. **Recibir Solicitudes**: Ver solicitudes asignadas automáticamente
2. **Enviar Cotización**: Crear cotización detallada con precios
3. **Gestionar Pagos**: Verificar comprobantes de pago
4. **Completar Servicio**: Marcar solicitud como finalizada

## 🗂️ Estructura del Proyecto

```
krizo/
├── 📱 Frontend (React Native)
│   ├── screens/                 # Pantallas de la aplicación
│   │   ├── KrizoWorker/        # Pantallas específicas del trabajador
│   │   └── Registration/       # Pantallas de registro
│   ├── components/             # Componentes reutilizables
│   ├── context/               # Contextos de React
│   ├── utils/                 # Utilidades y helpers
│   └── assets/                # Imágenes y recursos
├── 🔧 Backend (Node.js)
│   ├── routes/                # Rutas de la API
│   ├── middleware/            # Middlewares de autenticación
│   ├── database/              # Configuración de base de datos
│   ├── models/                # Modelos de datos
│   ├── config/                # Configuraciones
│   └── uploads/               # Archivos subidos por usuarios
├── 📊 Base de Datos
│   ├── database/              # Archivos SQLite
│   └── migrations/            # Scripts de migración
└── 📝 Documentación
    ├── README.md              # Este archivo
    └── scripts/               # Scripts de utilidad
```

## 🔌 API Endpoints

### **Autenticación**
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/verify` - Verificar token

### **Solicitudes**
- `GET /api/requests` - Obtener solicitudes (con filtros)
- `POST /api/requests` - Crear nueva solicitud
- `PUT /api/requests/:id/status` - Actualizar estado

### **Cotizaciones**
- `GET /api/quotes` - Obtener cotizaciones
- `POST /api/quotes` - Crear cotización
- `PUT /api/quotes/:id/status` - Actualizar estado

### **Pagos**
- `POST /api/payments/submit` - Enviar comprobante de pago
- `GET /api/payments/worker` - Pagos del trabajador
- `PUT /api/payments/:id/verify` - Verificar pago

### **Usuarios**
- `GET /api/users/:id` - Obtener perfil de usuario
- `PUT /api/users/:id` - Actualizar perfil
- `GET /api/users/workers` - Listar trabajadores

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev:sqlite          # Backend + Frontend con SQLite
npm run server:dev          # Solo backend con nodemon
npm start                   # Solo frontend Expo

# Producción
npm run server              # Servidor de producción
npm run server:sqlite       # Servidor SQLite de producción

# Plataformas específicas
npm run android             # Ejecutar en Android
npm run ios                 # Ejecutar en iOS
npm run web                 # Ejecutar en web

# Utilidades
node scripts/create-test-users.js    # Crear usuarios de prueba
node scripts/create-test-request.js  # Crear solicitudes de prueba
node scripts/reset-database.js       # Resetear base de datos
```

## 🧪 Usuarios de Prueba

### **Cliente de Prueba**
- **Email**: cliente@krizo.com
- **Contraseña**: 123456

### **Trabajador de Prueba**
- **Email**: admin@krizo.com
- **Contraseña**: 123456

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para sesiones
- **Validación de Datos**: Validación en frontend y backend
- **Sanitización**: Limpieza de datos de entrada
- **CORS**: Configuración de seguridad para APIs
- **Variables de Entorno**: Configuración segura

## 📊 Base de Datos

### **Tablas Principales**
- `users` - Usuarios (clientes y trabajadores)
- `requests` - Solicitudes de servicio
- `quotes` - Cotizaciones
- `payments` - Pagos y comprobantes
- `chat_sessions` - Sesiones de chat
- `messages` - Mensajes del chat

### **Migraciones**
Las migraciones se ejecutan automáticamente al iniciar el servidor.

## 🚀 Despliegue

### **Backend (Heroku/Vercel)**
```bash
# Configurar variables de entorno en la plataforma
# Subir código al repositorio
# Conectar con servicio de despliegue
```

### **Frontend (Expo)**
```bash
# Construir para producción
expo build:android
expo build:ios

# Publicar en Expo
expo publish
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@krizo.com
- **Documentación**: [docs.krizo.com](https://docs.krizo.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/krizo/issues)

## 🙏 Agradecimientos

- **Expo** por la plataforma de desarrollo móvil
- **React Native** por el framework
- **SQLite** por la base de datos ligera
- **Express** por el framework web

---

**Desarrollado con ❤️ para la comunidad automotriz** 