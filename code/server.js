// Importamos las dependencias necesarias
import express from 'express';
import { login } from './services/authService.js';
import { orders } from './mock/DBfalsa.js';
import cors from 'cors';
import { registerUserInDB, getAllUsers, getUserById } from './services/registerUsersService.js';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from './services/productService.js';
import { createOrder, getAllOrders, getOrdersByUserId, getOrderById } from './services/orderService.js';
import { getVentasDelDia, getProductosStockBajo, getReporteMensual, getTendenciaVentas, getKPIs, getProductosMasVendidos, getReporteSemanal, getReportePorRango } from './services/dashboardService.js';
import { requireAdmin } from './middleware/authMiddleware.js';
import { addToCart, createCart } from './services/cartService.js';

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS para permitir solicitudes desde el frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
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

// Ruta para obtener órdenes (deprecated - usar /api/orders)
app.get('/orders', (req, res) => {
  res.status(200).json(orders);
});

// ========== RUTAS DE CARRITO ==========

// Validar disponibilidad de producto para agregar al carrito
app.post('/api/cart/validate', (req, res) => {
    const { productId, quantity, currentCartItems } = req.body;

    try {
        // Crear un carrito temporal con los items actuales
        const tempCart = createCart();
        
        // Agregar items actuales del carrito
        if (currentCartItems && currentCartItems.length > 0) {
            currentCartItems.forEach(item => {
                tempCart.items.push(item);
            });
        }
        
        // Intentar agregar el nuevo producto
        const product = getProductById(productId);
        addToCart(tempCart, product, quantity);
        
        res.status(200).json({ 
            available: true, 
            message: 'Producto disponible',
            stock: product.stock
        });
    } catch (error) {
        res.status(400).json({ 
            available: false, 
            error: error.message 
        });
    }
});

// ========== RUTAS DE ÓRDENES ==========

// Crear una nueva orden desde el carrito
app.post('/api/orders', (req, res) => {
    const { userId, cartItems } = req.body;

    try {
        const newOrder = createOrder(userId, cartItems);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las órdenes
app.get('/api/orders', (req, res) => {
    try {
        const allOrders = getAllOrders();
        res.status(200).json(allOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener órdenes de un usuario específico
app.get('/api/orders/user/:userId', (req, res) => {
    const { userId } = req.params;

    try {
        const userOrders = getOrdersByUserId(userId);
        res.status(200).json(userOrders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una orden por ID
app.get('/api/orders/:id', (req, res) => {
    const { id } = req.params;

    try {
        const order = getOrderById(id);
        res.status(200).json(order);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// ========== RUTAS DE USUARIOS ==========

// Registrar un nuevo usuario
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    // El rol siempre será 'user' por defecto, no se acepta desde el request

    try {
        const newUser = registerUserInDB(name, email, password, 'user');
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

// ========== RUTAS DE DASHBOARD (Solo Admin) ==========

// Obtener KPIs generales
app.get('/api/dashboard/kpis', requireAdmin, (req, res) => {
    try {
        const kpis = getKPIs();
        res.status(200).json(kpis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener ventas del día
app.get('/api/dashboard/ventas-dia', requireAdmin, (req, res) => {
    const { fecha } = req.query;
    
    try {
        const ventas = getVentasDelDia(fecha);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener productos con stock bajo
app.get('/api/dashboard/stock-bajo', requireAdmin, (req, res) => {
    const { umbral } = req.query;
    const umbralMinimo = umbral ? parseInt(umbral) : 5;
    
    try {
        const productos = getProductosStockBajo(umbralMinimo);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener reporte mensual
app.get('/api/dashboard/reporte-mensual', requireAdmin, (req, res) => {
    const { mes, anio } = req.query;
    
    try {
        const reporte = getReporteMensual(parseInt(mes), parseInt(anio));
        res.status(200).json(reporte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener tendencia de ventas (hoy vs ayer)
app.get('/api/dashboard/tendencia-ventas', requireAdmin, (req, res) => {
    try {
        const tendencia = getTendenciaVentas();
        res.status(200).json(tendencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener productos más vendidos
app.get('/api/dashboard/productos-mas-vendidos', requireAdmin, (req, res) => {
    const { limite } = req.query;
    const limiteNum = limite ? parseInt(limite) : 5;
    
    try {
        const productos = getProductosMasVendidos(limiteNum);
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener reporte semanal
app.get('/api/dashboard/reporte-semanal', requireAdmin, (req, res) => {
    const { fechaInicio } = req.query;
    
    try {
        const reporte = getReporteSemanal(fechaInicio);
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener reporte por rango de fechas
app.get('/api/dashboard/reporte-rango', requireAdmin, (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    try {
        const reporte = getReportePorRango(fechaInicio, fechaFin);
        res.status(200).json(reporte);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});