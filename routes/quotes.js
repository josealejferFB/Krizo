const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth-simple');
const { db } = require('../database/users');

// Crear nueva cotización
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { request_id, services, transport_fee, total_price, estimated_time, notes, status } = req.body;
    const worker_id = req.user.id;

    // Obtener client_id de la solicitud
    return new Promise((resolve, reject) => {
      db.get('SELECT client_id FROM requests WHERE id = ?', [request_id], (err, request) => {
        if (err) {
          console.error('Error obteniendo solicitud:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }

        if (!request) {
          return res.status(404).json({
            success: false,
            message: 'Solicitud no encontrada'
          });
        }

        const client_id = request.client_id;

        // Crear cotización
        const quoteQuery = `
          INSERT INTO quotes (
            request_id, worker_id, client_id, transport_fee, 
            total_price, estimated_time, notes, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        db.run(quoteQuery, [
          request_id, worker_id, client_id, transport_fee,
          total_price, estimated_time, notes, status || 'pending'
        ], function(err) {
          if (err) {
            console.error('Error creando cotización:', err);
            return res.status(500).json({
              success: false,
              message: 'Error interno del servidor'
            });
          }

          const quoteId = this.lastID;

          // Crear servicios de la cotización
          let servicesCreated = 0;
          for (const service of services) {
            db.run(`
              INSERT INTO quote_services (
                quote_id, description, price
              ) VALUES (?, ?, ?)
            `, [quoteId, service.description, service.price], (err) => {
              if (err) {
                console.error('Error creando servicio:', err);
              }
              servicesCreated++;
              
              if (servicesCreated === services.length) {
                // Obtener cotización completa
                db.get('SELECT * FROM quotes WHERE id = ?', [quoteId], (err, quote) => {
                  if (err) {
                    console.error('Error obteniendo cotización:', err);
                    return res.status(500).json({
                      success: false,
                      message: 'Error interno del servidor'
                    });
                  }

                  db.all('SELECT * FROM quote_services WHERE quote_id = ?', [quoteId], (err, quoteServices) => {
                    if (err) {
                      console.error('Error obteniendo servicios:', err);
                      return res.status(500).json({
                        success: false,
                        message: 'Error interno del servidor'
                      });
                    }

                    const fullQuote = {
                      ...quote,
                      services: quoteServices
                    };

                    res.json({
                      success: true,
                      message: 'Cotización creada correctamente',
                      data: fullQuote
                    });
                  });
                });
              }
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Error creando cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener cotizaciones del cliente
router.get('/client', authenticateToken, async (req, res) => {
  try {
    const client_id = req.user.id;

    const query = `
      SELECT q.*, u.nombres as worker_name, u.apellidos as worker_lastName,
             r.problem_description, r.vehicle_info
      FROM quotes q
      JOIN users u ON q.worker_id = u.id
      JOIN requests r ON q.request_id = r.id
      WHERE q.client_id = ?
      ORDER BY q.created_at DESC
    `;

    db.all(query, [client_id], (err, quotes) => {
      if (err) {
        console.error('Error obteniendo cotizaciones:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      // Obtener servicios para cada cotización
      let quotesProcessed = 0;
      const quotesWithServices = [];

      if (quotes.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      quotes.forEach((quote) => {
        db.all('SELECT * FROM quote_services WHERE quote_id = ?', [quote.id], (err, services) => {
          if (err) {
            console.error('Error obteniendo servicios:', err);
          }
          
          quote.services = services || [];
          quotesWithServices.push(quote);
          quotesProcessed++;

          if (quotesProcessed === quotes.length) {
            res.json({
              success: true,
              data: quotesWithServices
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Error obteniendo cotizaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener cotizaciones del trabajador
router.get('/worker', authenticateToken, async (req, res) => {
  try {
    const worker_id = req.user.id;

    const query = `
      SELECT q.*, u.nombres as client_name, u.apellidos as client_lastName,
             r.problem_description, r.vehicle_info
      FROM quotes q
      JOIN users u ON q.client_id = u.id
      JOIN requests r ON q.request_id = r.id
      WHERE q.worker_id = ?
      ORDER BY q.created_at DESC
    `;

    db.all(query, [worker_id], (err, quotes) => {
      if (err) {
        console.error('Error obteniendo cotizaciones:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      // Obtener servicios para cada cotización
      let quotesProcessed = 0;
      const quotesWithServices = [];

      if (quotes.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      quotes.forEach((quote) => {
        db.all('SELECT * FROM quote_services WHERE quote_id = ?', [quote.id], (err, services) => {
          if (err) {
            console.error('Error obteniendo servicios:', err);
          }
          
          quote.services = services || [];
          quotesWithServices.push(quote);
          quotesProcessed++;

          if (quotesProcessed === quotes.length) {
            res.json({
              success: true,
              data: quotesWithServices
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Error obteniendo cotizaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Aceptar cotización (cliente)
router.put('/:id/accept', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const client_id = req.user.id;

    // Verificar que la cotización pertenece al cliente
    const quote = await db.get(
      'SELECT * FROM quotes WHERE id = ? AND client_id = ?',
      [id, client_id]
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }

    // Actualizar estado
    await db.run(`
      UPDATE quotes 
      SET status = 'accepted', updated_at = datetime('now')
      WHERE id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Cotización aceptada correctamente'
    });

  } catch (error) {
    console.error('Error aceptando cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Rechazar cotización (cliente)
router.put('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const client_id = req.user.id;

    // Verificar que la cotización pertenece al cliente
    const quote = await db.get(
      'SELECT * FROM quotes WHERE id = ? AND client_id = ?',
      [id, client_id]
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }

    // Actualizar estado
    await db.run(`
      UPDATE quotes 
      SET status = 'rejected', rejection_reason = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [reason, id]);

    res.json({
      success: true,
      message: 'Cotización rechazada correctamente'
    });

  } catch (error) {
    console.error('Error rechazando cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Procesar pago
router.put('/:id/pay', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method } = req.body;
    const client_id = req.user.id;

    // Verificar que la cotización pertenece al cliente y está aceptada
    const quote = await db.get(
      'SELECT * FROM quotes WHERE id = ? AND client_id = ? AND status = "accepted"',
      [id, client_id]
    );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada o no aceptada'
      });
    }

    // Actualizar estado a pagado
    await db.run(`
      UPDATE quotes 
      SET status = 'paid', payment_method = ?, paid_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `, [payment_method, id]);

    // Actualizar estado de la solicitud
    await db.run(`
      UPDATE service_requests 
      SET status = 'in_progress', updated_at = datetime('now')
      WHERE id = ?
    `, [quote.request_id]);

    res.json({
      success: true,
      message: 'Pago procesado correctamente'
    });

  } catch (error) {
    console.error('Error procesando pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 