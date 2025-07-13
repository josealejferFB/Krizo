# Configuración de Email con Gmail SMTP

## Pasos para configurar Gmail SMTP:

### 1. Habilitar verificación en 2 pasos
1. Ve a tu cuenta de Google
2. Ve a "Seguridad"
3. Habilita "Verificación en 2 pasos"

### 2. Generar contraseña de aplicación
1. Ve a "Seguridad" en tu cuenta de Google
2. Busca "Contraseñas de aplicación"
3. Selecciona "Otra" y dale un nombre (ej: "Krizo App")
4. Copia la contraseña generada (16 caracteres)

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto con:

```env
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-de-aplicación
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 4. Reemplazar valores
- `tu-email@gmail.com`: Tu dirección de Gmail
- `tu-contraseña-de-aplicación`: La contraseña de 16 caracteres generada en el paso 2

### 5. Reiniciar el servidor
Después de configurar las variables, reinicia el servidor:
```bash
npm run server:sqlite
```

## Notas importantes:
- ✅ La verificación en 2 pasos es obligatoria
- ✅ Usa contraseñas de aplicación, NO tu contraseña normal
- ✅ El archivo `.env` NO debe subirse a Git
- ✅ Los emails se envían automáticamente al registrar y verificar

## Prueba:
1. Registra un nuevo usuario
2. Revisa tu email (incluyendo spam)
3. Verifica el código en la app
4. Recibirás un email de bienvenida 