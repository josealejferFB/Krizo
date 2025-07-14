const nodemailer = require('nodemailer');

// Configuración del transportador de Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.GMAIL_USER || 'equipo.krizo@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'hnggevabdkmmfizy'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Función para enviar código de verificación
const sendVerificationEmail = async (email, verificationCode, userName) => {
  try {
    console.log('📧 Configuración de email:', {
      user: process.env.GMAIL_USER || 'equipo.krizo@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD ? '✅ Configurado' : '❌ No configurado',
      env_user: process.env.GMAIL_USER,
      env_pass: process.env.GMAIL_APP_PASSWORD ? 'SÍ' : 'NO'
    });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'equipo.krizo@gmail.com',
      to: email,
      subject: '🔐 Verifica tu cuenta - Krizo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FC5501, #C24100); padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Bienvenido a Krizo!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Tu cuenta está casi lista</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 15px 15px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Hola ${userName},</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Gracias por registrarte en Krizo. Para completar tu registro, necesitamos verificar tu dirección de email.
            </p>
            
            <div style="background: #fff; border: 2px solid #FC5501; border-radius: 10px; padding: 25px; text-align: center; margin: 25px 0;">
              <h3 style="color: #FC5501; margin: 0 0 15px 0; font-size: 18px;">Tu código de verificación:</h3>
              <div style="background: #FC5501; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 8px; letter-spacing: 5px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </div>
              <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">
                Este código expira en 10 minutos
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Ingresa este código en la aplicación para verificar tu cuenta. Si no solicitaste este código, puedes ignorar este email.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 Krizo. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email enviado a ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar email de bienvenida
const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'equipo.krizo@gmail.com',
      to: email,
      subject: '🎉 ¡Bienvenido a Krizo!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #FC5501, #C24100); padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Cuenta verificada!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Ya puedes usar Krizo</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 15px 15px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">¡Hola ${userName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Tu cuenta ha sido verificada exitosamente. Ya puedes disfrutar de todos los servicios de Krizo.
            </p>
            
            <div style="background: #fff; border: 2px solid #FC5501; border-radius: 10px; padding: 25px; text-align: center; margin: 25px 0;">
              <h3 style="color: #FC5501; margin: 0 0 15px 0;">¿Qué puedes hacer ahora?</h3>
              <ul style="text-align: left; color: #666; line-height: 1.8;">
                <li>📱 Solicitar servicios de grúa</li>
                <li>🔧 Encontrar mecánicos cercanos</li>
                <li>🏪 Visitar talleres de confianza</li>
                <li>💳 Gestionar tu billetera</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              ¡Gracias por confiar en Krizo para tus necesidades automotrices!
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 Krizo. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email de bienvenida enviado a ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail
}; 