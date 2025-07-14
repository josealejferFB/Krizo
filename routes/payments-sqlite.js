const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { db } = require('../database/users');

// POST /api/payments/submit - Enviar comprobante de pago
router.post('/submit', authMiddleware, async (req, res) => {
  try {
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
    db.get('SELECT * FROM quotes WHERE id = ?', [quote_id], (err, quote) => {
      if (err) {
        console.error('Error al obtener cotización:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      if (!quote) {
        return res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
      }
      
      // Insertar el pago
      const insertQuery = `
        INSERT INTO payments (
          quote_id, 
          client_id, 
          worker_id, 
          payment_method, 
          amount, 
          reference, 
          payment_date, 
          payment_time,
          payment_screenshot, 
          status, 
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
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
          console.error('Error al insertar pago:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al procesar el pago'
          });
        }
        
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
router.get('/worker', authMiddleware, async (req, res) => {
  try {
    const workerId = req.user.id;
    
    const query = `
      SELECT p.*, 
             c.firstName as client_firstName, 
             c.lastName as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(query, [workerId], (err, payments) => {
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
router.get('/worker/:workerId', authMiddleware, async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    const query = `
      SELECT p.*, 
             c.firstName as client_firstName, 
             c.lastName as client_lastName
      FROM payments p
      JOIN users c ON p.client_id = c.id
      WHERE p.worker_id = ?
      ORDER BY p.created_at DESC
    `;
    
    db.all(query, [workerId], (err, payments) => {
      if (err) {
        console.error('Error al obtener pagos del trabajador:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      res.json({
        success: true,
        data: payments
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
router.get('/client/:clientId', authMiddleware, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    
    const query = `
      SELECT p.*, 
             w.firstName as worker_firstName, 
             w.lastName as worker_lastName
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
        data: payments
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
router.put('/:paymentId/verify', authMiddleware, async (req, res) => {
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

module.exports = router; 