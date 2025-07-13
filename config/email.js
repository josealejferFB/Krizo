// Configuración para Gmail SMTP
// Para usar esto, necesitas:
// 1. Habilitar la verificación en 2 pasos en tu cuenta de Gmail
// 2. Generar una contraseña de aplicación
// 3. Reemplazar estos valores con tus credenciales reales

module.exports = {
  gmail: {
    user: process.env.GMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'tu-app-password'
  }
}; 