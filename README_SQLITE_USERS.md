# Sistema de Usuarios con SQLite3 Puro

Este sistema implementa una tabla `users` usando SQLite3 puro (sin ORM) en Express.js, con todas las validaciones y funcionalidades CRUD.

## 📋 Estructura de la Tabla

La tabla `users` incluye los siguientes campos:

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| `nombres` | TEXT | NOT NULL |
| `apellidos` | TEXT | NOT NULL |
| `cedula` | TEXT | UNIQUE, NOT NULL |
| `email` | TEXT | UNIQUE, NOT NULL |
| `telefono` | TEXT | UNIQUE, NOT NULL |
| `password` | TEXT | NOT NULL (encriptada) |
| `tipo` | TEXT | CHECK ('cliente' OR 'krizoworker'), NOT NULL |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
npm install sqlite3 bcryptjs express cors dotenv
```

### 2. Archivos creados
- `database/users.js` - Módulo principal de la base de datos
- `routes/users-sqlite.js` - Rutas de Express.js
- `example-server-integration.js` - Ejemplo de integración

### 3. Integrar en tu servidor
```javascript
// En tu server.js principal
const usersRoutes = require('./routes/users-sqlite');
app.use('/api/users', usersRoutes);
```

## 📡 Endpoints Disponibles

### Crear Usuario
```http
POST /api/users
Content-Type: application/json

{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "cedula": "1234567890",
  "email": "juan@example.com",
  "telefono": "3001234567",
  "password": "123456",
  "tipo": "cliente"
}
```

### Obtener Todos los Usuarios
```http
GET /api/users
```

### Obtener Usuario por ID
```http
GET /api/users/1
```

### Obtener Usuario por Email
```http
GET /api/users/email/juan@example.com
```

### Obtener Usuario por Cédula
```http
GET /api/users/cedula/1234567890
```

### Actualizar Usuario
```http
PUT /api/users/1
Content-Type: application/json

{
  "nombres": "Juan Carlos",
  "apellidos": "Pérez García",
  "cedula": "1234567890",
  "email": "juancarlos@example.com",
  "telefono": "3001234567",
  "password": "nueva123456",
  "tipo": "cliente"
}
```

### Eliminar Usuario
```http
DELETE /api/users/1
```

## 🔒 Validaciones Implementadas

### Validaciones de Entrada
- ✅ Todos los campos son requeridos
- ✅ Tipo debe ser "cliente" o "krizoworker"
- ✅ Formato de email válido
- ✅ Contraseña mínimo 6 caracteres

### Validaciones de Base de Datos
- ✅ Cédula única
- ✅ Email único
- ✅ Teléfono único
- ✅ Restricción CHECK en tipo

### Seguridad
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Contraseñas no se devuelven en respuestas
- ✅ Manejo de errores de restricciones únicas
- ✅ Validación de IDs numéricos

## 🗄️ Funciones de Base de Datos

### Funciones Principales
- `initUsersTable()` - Inicializa la tabla y índices
- `createUser(userData)` - Crea un nuevo usuario
- `getUserById(id)` - Obtiene usuario por ID
- `getUserByEmail(email)` - Obtiene usuario por email
- `getUserByCedula(cedula)` - Obtiene usuario por cédula
- `getAllUsers()` - Obtiene todos los usuarios
- `updateUser(id, userData)` - Actualiza un usuario
- `deleteUser(id)` - Elimina un usuario
- `checkUserExists(email, cedula, telefono)` - Verifica existencia
- `closeDatabase()` - Cierra la conexión

## 📊 Índices Creados

Para optimizar el rendimiento, se crean automáticamente:
- `idx_users_cedula` - Para búsquedas por cédula
- `idx_users_email` - Para búsquedas por email
- `idx_users_telefono` - Para búsquedas por teléfono
- `idx_users_tipo` - Para filtros por tipo

## 🧪 Ejemplo de Uso

```javascript
const { createUser, getUserByEmail } = require('./database/users');

// Crear un usuario
const newUser = await createUser({
  nombres: "María",
  apellidos: "González",
  cedula: "0987654321",
  email: "maria@example.com",
  telefono: "3009876543",
  password: "123456",
  tipo: "krizoworker"
});

// Buscar por email
const user = await getUserByEmail("maria@example.com");
```

## ⚠️ Manejo de Errores

El sistema maneja los siguientes errores:
- **400** - Datos inválidos o faltantes
- **404** - Usuario no encontrado
- **409** - Conflicto de datos únicos
- **500** - Error interno del servidor

## 🔧 Configuración

La base de datos se crea automáticamente en:
```
database/krizo.sqlite
```

Para cambiar la ubicación, modifica la variable `dbPath` en `database/users.js`.

## 📝 Notas Importantes

1. **Inicialización**: La tabla se crea automáticamente al importar el módulo
2. **Índices**: Se crean automáticamente para optimizar consultas
3. **Timestamps**: Se actualizan automáticamente
4. **Encriptación**: Las contraseñas se encriptan con bcrypt (salt rounds: 10)
5. **Seguridad**: Las contraseñas nunca se devuelven en las respuestas 