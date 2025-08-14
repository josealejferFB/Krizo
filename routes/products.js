const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth-simple');
const { db } = require('../database/products'); // Asegúrate de que la conexión a la base de datos esté configurada

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
	   const uploadPath = 'uploads/';
    
    // Verificar si la carpeta existe, si no, crearla
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
	  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Renombrar el archivo para evitar conflictos
  }
});

const upload = multer({ storage });

// Crear nuevo producto
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, quantity, price, category } = req.body; // No necesitas imageUri aquí
    const user_id = req.user.id; // Suponiendo que el usuario que crea el producto es el que está autenticado

    // Validar que todos los campos requeridos estén presentes
    if (!name || !brand || !quantity || !price || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, completa todos los campos requeridos.'
      });
    }

    // Obtener la ruta de la imagen
    const imageUri = req.file.path; // Ruta donde se guardó la imagen

    // Crear producto
    const productQuery = `
      INSERT INTO products (name, brand, quantity, price, category, imageUri, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;

    db.run(productQuery, [name, brand, quantity, price, category, imageUri], function(err) {
      if (err) {
        console.error('Error creando producto:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      const productId = this.lastID; // Obtener el ID del nuevo producto

      // Obtener el producto creado
      db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
          console.error('Error obteniendo producto:', err);
          return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
          });
        }

        res.json({
          success: true,
          message: 'Producto creado correctamente',
          data: product
        });
      });
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';

    db.all(query, [], (err, products) => {
      if (err) {
        console.error('Error obteniendo productos:', err);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor'
        });
      }

      res.json({
        success: true,
        data: products
      });
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});




// Exportar el router
module.exports = router;
