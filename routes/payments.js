const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken } = require('../middleware/auth-sqlite');
const { db } = require('../database/users');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

// POST /api/payments/submit - Enviar comprobante de pago
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    console.log('🔧 POST /api/payments/submit - Datos recibidos:', req.body);
    console.log('🔧 Client ID:', req.user.id);
    
    const { 
      quote_id, 
      payment_method, 
      amount, 
      reference, 
      payment_date, 
      payment_time,
      payment_screenshot 
    } = req.body;
    
    const clientId = req.user.id;
    
    // Obtener información de la cotización
    console.log('🔧 Buscando cotización con ID:', quote_id);
    db.get('SELECT * FROM quotes WHERE id = ?', [quote_id], (err, quote) => {
      if (err) {
        console.error('❌ Error al obtener cotización:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      console.log('🔧 Cotización encontrada:', quote);
      
      if (!quote) {
        console.log('❌ Cotización no encontrada');
        return res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
      }
      
      // Insertar el pago
      console.log('🔧 Insertando pago con datos:', {
        quote_id,
        clientId,
        worker_id: quote.worker_id,
        payment_method,
        amount,
        reference,
        payment_date,
        payment_time,
        payment_screenshot
      });
      
      const insertQuery = `
        INSERT INTO payments (
          quote_id, 
          client_id, 
          worker_id, 
          payment_method, 
          payment_amount, 
          payment_reference, 
          payment_date, 
          payment_time,
          payment_screenshot, 
          status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_verification', datetime('now'))
      `;
      
      db.run(insertQuery, [
        quote_id,
        clientId,
        quote.worker_id,
        payment_method,
        amount,
        reference,
        payment_date,
        payment_time,
        payment_screenshot
      ], function(err) {
        if (err) {
          console.error('❌ Error al insertar pago:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al procesar el pago'
          });
        }
        
        console.log('✅ Pago insertado correctamente con ID:', this.lastID);
        res.json({
          success: true,
          message: 'Pago enviado correctamente',
          payment_id: this.lastID
        });
      });
    });
  } catch (error) {
    console.error('Error en POST /api/payments/submit:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/payments/worker - Obtener pagos del trabajador autenticado
router.get('/worker', authenticateToken, async (req, res) => {
  try {
    const workerId = req.user.id;
    const { status } = req.query;
    
    let query = `
      SELECT p.*, 
             c.nombres as client_firstName, 
             c.apellidos as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
    `;
    const params = [workerId];
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    query += ` ORDER BY p.created_at DESC`;
    
    db.all(query, params, (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del trabajador:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      res.json({
        success: true,
        payments: payments
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/worker:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/payments/worker/:workerId - Obtener pagos del trabajador (alternativa)
router.get('/worker/:workerId', authenticateToken, async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const { status } = req.query;
    
    let query = `
      SELECT p.*, 
             c.nombres as client_firstName, 
             c.apellidos as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
    `;
    
    const params = [workerId];
    
    // Si se especifica un status, agregar el filtro
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    db.all(query, params, (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del trabajador:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        payments: payments
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/worker/:workerId:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/payments/client/:clientId - Obtener pagos del cliente
router.get('/client/:clientId', authenticateToken, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const query = `
      SELECT p.*, 
             w.nombres as worker_firstName, 
             w.apellidos as worker_lastName
      FROM payments p
      JOIN users w ON p.worker_id = w.id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(query, [clientId], (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del cliente:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        payments: payments
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/client/:clientId:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// PUT /api/payments/:paymentId/verify - Verificar pago (trabajador)
router.put('/:paymentId/verify', authenticateToken, async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const workerId = req.user.id;
    const { status } = req.body; // 'verified' o 'rejected'
    
    // Verificar que el pago pertenece al trabajador
    db.get('SELECT * FROM payments WHERE id = ? AND worker_id = ?', [paymentId, workerId], (err, payment) => {
      if (err) {
        console.error('Error al verificar pago:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Pago no encontrado'
        });
      }
      
      // Actualizar el estado del pago
      const updateQuery = `
        UPDATE payments
        SET status = ?, updated_at = datetime('now')
        WHERE id = ?
      `;
      
      db.run(updateQuery, [status, paymentId], function(err) {
        if (err) {
          console.error('Error al actualizar pago:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al actualizar el pago'
          });
        }
        
        res.json({
          success: true,
          message: `Pago ${status === 'verified' ? 'verificado' : 'rechazado'} correctamente`
        });
      });
    });
  } catch (error) {
    console.error('Error en PUT /api/payments/:paymentId/verify:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/payments/upload-screenshot - Subir imagen de comprobante
router.post('/upload-screenshot', authenticateToken, upload.single('screenshot'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No se subió ningún archivo' 
      });
    }

    // URL pública de la imagen
    const baseUrl = req.protocol + '://' + req.get('host');
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    console.log('📸 Imagen subida:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: imageUrl
    });

    res.json({ 
      success: true, 
      url: imageUrl,
      filename: req.file.filename,
      message: 'Imagen subida correctamente'
    });

  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la imagen'
    });
  }
});

// GET /api/payments/worker-info/:workerId - Obtener información de pago del worker
router.get('/worker-info/:workerId', authenticateToken, async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    const query = `
      SELECT 
        u.id,
        u.nombres,
        u.apellidos,
        u.telefono,
        u.email,
        u.paypal_email,
        u.binance_id,
        wi.payment_methods,
        wi.payment_info
      FROM users u
      LEFT JOIN worker_info wi ON u.id = wi.user_id
      WHERE u.id = ? AND u.tipo = 'krizoworker'
    `;
    
    db.get(query, [workerId], (err, worker) => {
      if (err) {
        console.error('Error al obtener información del worker:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      if (!worker) {
        return res.status(404).json({
          success: false,
          message: 'Worker no encontrado'
        });
      }
      
      // Parsear los métodos de pago si existen
      let paymentMethods = [];
      let paymentInfo = {};
      
      if (worker.payment_methods) {
        try {
          paymentMethods = JSON.parse(worker.payment_methods);
        } catch (e) {
          console.error('Error al parsear payment_methods:', e);
        }
      }
      
      if (worker.payment_info) {
        try {
          paymentInfo = JSON.parse(worker.payment_info);
        } catch (e) {
          console.error('Error al parsear payment_info:', e);
        }
      }
      
      // Crear métodos de pago desde los datos del usuario
      const userPaymentMethods = [];
      
      if (worker.paypal_email) {
        userPaymentMethods.push({
          method: 'paypal',
          name: 'PayPal',
          email: worker.paypal_email
        });
      }
      
      if (worker.binance_id) {
        userPaymentMethods.push({
          method: 'binance',
          name: 'Binance Pay',
          id: worker.binance_id
        });
      }
      
      if (worker.telefono) {
        userPaymentMethods.push({
          method: 'transfer',
          name: 'Transferencia',
          phone: worker.telefono
        });
      }
      
      // Combinar métodos de la tabla worker_info con los del usuario
      const allPaymentMethods = [...userPaymentMethods, ...paymentMethods];
      
      console.log('🔧 Worker data:', {
        id: worker.id,
        nombres: worker.nombres,
        paypal_email: worker.paypal_email,
        binance_id: worker.binance_id,
        telefono: worker.telefono,
        userPaymentMethods,
        allPaymentMethods
      });
      
      res.json({
        success: true,
        worker: {
          id: worker.id,
          nombres: worker.nombres,
          apellidos: worker.apellidos,
          telefono: worker.telefono,
          email: worker.email,
          paymentMethods: allPaymentMethods,
          paymentInfo: paymentInfo
        }
      });
    });
  } catch (error) {
    console.error('Error en GET /api/payments/worker-info/:workerId:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Manejo de errores de multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB'
      });
    }
  }
  
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen (JPG, PNG, etc.)'
    });
  }

  console.error('Error en upload:', error);
  res.status(500).json({
    success: false,
    message: 'Error al subir el archivo'
  });
});

module.exports = router; 