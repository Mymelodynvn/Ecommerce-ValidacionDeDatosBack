// Importamos las dependencias necesarias
import express from 'express';
import { login } from './services/authService.js';
import { orders } from './mock/DBfalsa.js';
import cors from 'cors';
import { registerUserInDB, getAllUsers, getUserById } from './services/registerUsersService.js';
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from './services/productService.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const user = login(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener órdenes
app.get('/orders', (req, res) => {
  res.status(200).json(orders);
});

// ========== RUTAS DE USUARIOS ==========

// Registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = registerUserInDB(name, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los usuarios
app.get('/api/users', (req, res) => {
    try {
        const allUsers = getAllUsers();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario por ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    try {
        const user = getUserById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// ========== RUTAS DE PRODUCTOS ==========

// Crear un nuevo producto
app.post('/api/products', (req, res) => {
    const { name, price, stock, image } = req.body;

    try {
        const newProduct = createProduct(name, price, stock, image);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los productos
app.get('/api/products', (req, res) => {
    try {
        const allProducts = getAllProducts();
        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;

    try {
        const product = getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Actualizar un producto
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = updateProduct(id, updates);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = deleteProduct(id);
        res.status(200).json({ message: 'Producto eliminado exitosamente', product: deletedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});