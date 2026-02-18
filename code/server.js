// Importamos las dependencias necesarias
import express from 'express';
import { login } from './services/authService.js';
import { products, users, orders } from './mock/DBfalsa.js';
import cors from 'cors';
import { registerUserInDB } from './services/registerUsersService.js';

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

// Ruta para obtener productos
app.get('/products', (req, res) => {
  res.status(200).json(products);
});

// Ruta para obtener usuarios
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// Ruta para obtener órdenes
app.get('/orders', (req, res) => {
  res.status(200).json(orders);
});

// Ruta para registrar usuarios
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = registerUserInDB(name, email, password);
        res.status(201).json(newUser); // Respuesta con el usuario registrado
    } catch (error) {
        res.status(400).json({ error: error.message }); // Respuesta con el error
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});