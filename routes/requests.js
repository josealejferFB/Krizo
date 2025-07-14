const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth-simple');
const { db } = require('../database/users');

// Crear nueva solicitud de servicio
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      service_type, 
      description, 
      location, 
      urgency, 
      vehicle_info 
    } = req.body;
    const client_id = req.user.id;

    // Obtener información del cliente
    db.get('SELECT nombres, apellidos, telefono FROM users WHERE id = ?', [client_id], (err, client) => {
      if (err) {
        console.error('Error obteniendo cliente:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }
      
      // Buscar un worker disponible del tipo de servicio
      db.get(`
        SELECT id, nombres, apellidos 
        FROM users 
        WHERE tipo = 'krizoworker' AND services LIKE '%${service_type}%'
        LIMIT 1
      `, [], (err, worker) => {
        if (err) {
          console.error('Error buscando worker:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }

        if (!worker) {
          return res.status(404).json({
            success: false,
            message: 'No hay trabajadores disponibles para este tipo de servicio'
          });
        }

        const query = `
          INSERT INTO requests (
            client_id, worker_id, service_type, description, 
            client_location, client_phone, client_name, worker_name,
            latitude, longitude, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        db.run(query, [
          client_id, 
          worker.id, 
          service_type, 
          description,
          location.address || '',
          client.telefono || '',
          `${client.nombres} ${client.apellidos}`,
          `${worker.nombres} ${worker.apellidos}`,
          location.latitude || null,
          location.longitude || null,
          'pending'
        ], function(err) {
          if (err) {
            console.error('Error creando solicitud:', err);
            return res.status(500).json({
              success: false,
              message: 'Error interno del servidor'
            });
          }

          const requestId = this.lastID;

          // Obtener la solicitud creada
          db.get('SELECT * FROM requests WHERE id = ?', [requestId], (err, getRequest) => {
            if (err) {
              console.error('Error obteniendo solicitud creada:', err);
              return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
              });
            }

            res.json({
              success: true,
              message: 'Solicitud creada correctamente',
              data: getRequest
            });
          });
        });
      });
    });

  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todas las solicitudes (para workers)
router.get('/', authenticateToken, async (req, res) => {
  console.log('🔍 GET /api/requests - Usuario:', req.user);
  console.log('🔍 UserType:', req.user.userType);
  console.log('🔍 Query params:', req.query);
  
  try {
    const userType = req.user.userType;
    const { status } = req.query;
    
    if (userType === 'worker') {
      // Workers ven solicitudes asignadas a ellos con información de cotizaciones
      const worker_id = req.user.id;
      
      let query = `
        SELECT r.*, u.nombres as client_nombres, u.apellidos as client_apellidos,
               CASE WHEN EXISTS (SELECT 1 FROM quotes q WHERE q.request_id = r.id AND q.worker_id = ?) THEN 1 ELSE 0 END as has_quote
        FROM requests r
        JOIN users u ON r.client_id = u.id
        WHERE r.worker_id = ?
      `;
      
      const params = [worker_id, worker_id];
      
      // Si se especifica un status, agregar el filtro
      if (status) {
        query += ` AND r.status = ?`;
        params.push(status);
      }
      
      query += ` ORDER BY r.created_at DESC`;
      
      db.all(query, params, (err, requests) => {
        if (err) {
          console.error('Error obteniendo solicitudes del worker:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }
        
        console.log('🔍 Solicitudes del worker encontradas:', requests.length);
        console.log('🔍 Datos de solicitudes:', JSON.stringify(requests, null, 2));
        
        res.json({
          success: true,
          data: requests
        });
      });
    } else {
      // Clientes ven sus propias solicitudes
      const client_id = req.user.id;
      let query = `
        SELECT r.*, u.nombres as worker_nombres, u.apellidos as worker_apellidos
        FROM requests r
        JOIN users u ON r.worker_id = u.id
        WHERE r.client_id = ?
      `;
      
      const params = [client_id];
      
      // Si se especifica un status, agregar el filtro
      if (status) {
        query += ` AND r.status = ?`;
        params.push(status);
      }
      
      query += ` ORDER BY r.created_at DESC`;
      
      db.all(query, params, (err, requests) => {
        if (err) {
          console.error('Error obteniendo solicitudes del cliente:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }
        
        res.json({
          success: true,
          data: requests
        });
      });
    }

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener solicitud específica
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const userType = req.user.userType;

    let query;
    let params;

    if (userType === 'worker') {
      query = `
        SELECT r.*, u.nombres as client_nombres, u.apellidos as client_apellidos
        FROM requests r
        JOIN users u ON r.client_id = u.id
        WHERE r.id = ? AND r.worker_id = ?
      `;
      params = [id, user_id];
    } else {
      query = `
        SELECT r.*, u.nombres as worker_nombres, u.apellidos as worker_apellidos
        FROM requests r
        JOIN users u ON r.worker_id = u.id
        WHERE r.id = ? AND r.client_id = ?
      `;
      params = [id, user_id];
    }

    db.get(query, params, (err, request) => {
      if (err) {
        console.error('Error obteniendo solicitud específica:', err);
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

      res.json({
        success: true,
        data: request
      });
    });

  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar estado de solicitud
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;
    const userType = req.user.userType;

    // Verificar que el usuario puede actualizar esta solicitud
    let checkQuery;
    let checkParams;

    if (userType === 'worker') {
      checkQuery = 'SELECT id FROM requests WHERE id = ? AND worker_id = ?';
      checkParams = [id, user_id];
    } else {
      checkQuery = 'SELECT id FROM requests WHERE id = ? AND client_id = ?';
      checkParams = [id, user_id];
    }

    db.get(checkQuery, checkParams, (err, existingRequest) => {
      if (err) {
        console.error('Error verificando solicitud:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada o no autorizada'
        });
      }

      const query = `
        UPDATE requests 
        SET status = ?, updated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(query, [status, id], (err) => {
        if (err) {
          console.error('Error actualizando estado:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }

        res.json({
          success: true,
          message: 'Estado actualizado correctamente'
        });
      });
    });

  } catch (error) {
    console.error('Error actualizando estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener solicitudes completadas de un trabajador
router.get('/worker/:workerId/completed', authenticateToken, async (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Verificar que el usuario autenticado es el worker
    if (req.user.id != workerId || req.user.userType !== 'worker') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const query = `
      SELECT r.*, u.nombres as client_nombres, u.apellidos as client_apellidos
      FROM requests r
      JOIN users u ON r.client_id = u.id
      WHERE r.worker_id = ? AND r.status = 'accepted'
      ORDER BY r.updated_at DESC
    `;

    db.all(query, [workerId], (err, requests) => {
      if (err) {
        console.error('Error obteniendo solicitudes completadas:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      res.json({
        success: true,
        data: requests
      });
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes completadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener pagos verificados de un trabajador
router.get('/worker/:workerId/verified-payments', authenticateToken, async (req, res) => {
  try {
    const { workerId } = req.params;
    
    // Verificar que el usuario autenticado es el worker
    if (req.user.id != workerId || req.user.userType !== 'worker') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const query = `
      SELECT p.*, u.nombres as client_nombres, u.apellidos as client_apellidos
      FROM payments p
      JOIN users u ON p.client_id = u.id
      WHERE p.worker_id = ? AND p.status = 'verified'
      ORDER BY p.updated_at DESC
    `;

    db.all(query, [workerId], (err, payments) => {
      if (err) {
        console.error('Error obteniendo pagos verificados:', err);
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
    console.error('Error obteniendo pagos verificados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 