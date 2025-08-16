const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth-simple');
const { db, updateProduct, deleteProduct, getAllProducts } = require('../database/products');

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

// Obtener todos los productos (solo los no eliminados)
router.get('/', async (req, res) => {
  try {
    // Llama a la función de la base de datos que ya filtra por 'is_deleted = 0'
    const products = await getAllProducts();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, brand, quantity, price, category } = req.body;
  
  let imageUri;

  // 1. Verificar si se ha subido un nuevo archivo
  if (req.file) {
    imageUri = req.file.path; // Usa la ruta del nuevo archivo
  } else {
    // 2. Si no hay nuevo archivo, usar la ruta existente del cuerpo de la solicitud
    imageUri = req.body.imageUri;
  }

  // 3. Validar que los campos esenciales estén presentes
  if (!name || !brand || !quantity || !price || !category || !imageUri) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, completa todos los campos requeridos, incluyendo la imagen.'
    });
  }

  try {
    // 4. Llamar a la función de actualización con todos los datos
    const updatedProduct = await updateProduct(id, {
      name,
      brand,
      quantity,
      price,
      category,
      imageUri
    });
    
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ success: false, message: `Error interno del servidor. ${error}` });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteProduct(id);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    if (error.message === 'Producto no encontrado') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Obtener un solo producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.get(query, [id], (err, product) => {
      if (err) {
        console.error('Error obteniendo producto:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }

      if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
      }

      res.json({ success: true, data: product });
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Exportar el router
module.exports = router;
