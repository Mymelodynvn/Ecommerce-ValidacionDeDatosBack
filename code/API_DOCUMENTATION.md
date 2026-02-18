# Documentación de API - E-commerce Backend

Base URL: `http://localhost:3000`

## Autenticación

### Login
Inicia sesión con un usuario existente.

**Endpoint:** `POST /login`

**Body (JSON):**
```json
{
  "email": "juan.perez@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "u1",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com"
}
```

**Errores:**
- 400: Email inválido o credenciales incorrectas

---

## Usuarios

### Registrar Usuario
Crea un nuevo usuario en el sistema.

**Endpoint:** `POST /api/register`

**Body (JSON):**
```json
{
  "name": "Miguel Amaya",
  "email": "miguel@example.com",
  "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "u5",
  "name": "Miguel Amaya",
  "email": "miguel@example.com"
}
```

**Errores:**
- 400: Email duplicado, nombre vacío, o contraseña menor a 6 caracteres

---

### Obtener Todos los Usuarios
Lista todos los usuarios registrados (sin contraseñas).

**Endpoint:** `GET /api/users`

**Respuesta exitosa (200):**
```json
[
  {
    "id": "u1",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com"
  },
  {
    "id": "u2",
    "name": "María López",
    "email": "maria.lopez@example.com"
  }
]
```

---

### Obtener Usuario por ID
Obtiene la información de un usuario específico.

**Endpoint:** `GET /api/users/:id`

**Ejemplo:** `GET /api/users/u1`

**Respuesta exitosa (200):**
```json
{
  "id": "u1",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com"
}
```

**Errores:**
- 404: Usuario no encontrado

---

## Productos

### Crear Producto
Agrega un nuevo producto al catálogo.

**Endpoint:** `POST /api/products`

**Body (JSON):**
```json
{
  "name": "Pastel de Chocolate",
  "price": 30,
  "stock": 10,
  "image": "https://ejemplo.com/imagen.jpg"
}
```

**Nota:** El campo `image` es opcional. Si no se proporciona, se usa una imagen por defecto.

**Respuesta exitosa (201):**
```json
{
  "id": "p6",
  "name": "Pastel de Chocolate",
  "price": 30,
  "stock": 10,
  "image": "https://ejemplo.com/imagen.jpg"
}
```

**Errores:**
- 400: Nombre vacío, precio negativo, o stock negativo

---

### Obtener Todos los Productos
Lista todos los productos disponibles.

**Endpoint:** `GET /api/products`

**Respuesta exitosa (200):**
```json
[
  {
    "id": "p1",
    "name": "Torta chocolate",
    "price": 20,
    "stock": 5,
    "image": "https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg"
  },
  {
    "id": "p2",
    "name": "Cupcake vainilla",
    "price": 5,
    "stock": 10,
    "image": "https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg"
  }
]
```

---

### Obtener Producto por ID
Obtiene la información de un producto específico.

**Endpoint:** `GET /api/products/:id`

**Ejemplo:** `GET /api/products/p1`

**Respuesta exitosa (200):**
```json
{
  "id": "p1",
  "name": "Torta chocolate",
  "price": 20,
  "stock": 5,
  "image": "https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg"
}
```

**Errores:**
- 404: Producto no encontrado

---

### Actualizar Producto
Modifica la información de un producto existente.

**Endpoint:** `PUT /api/products/:id`

**Ejemplo:** `PUT /api/products/p1`

**Body (JSON):**
```json
{
  "name": "Torta chocolate premium",
  "price": 25,
  "stock": 8,
  "image": "https://nueva-imagen.com/torta.jpg"
}
```

**Nota:** Puedes enviar solo los campos que quieres actualizar:
```json
{
  "price": 25
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "p1",
  "name": "Torta chocolate premium",
  "price": 25,
  "stock": 8,
  "image": "https://nueva-imagen.com/torta.jpg"
}
```

**Errores:**
- 400: Nombre vacío, precio negativo, o stock negativo
- 404: Producto no encontrado

---

### Eliminar Producto
Elimina un producto del catálogo.

**Endpoint:** `DELETE /api/products/:id`

**Ejemplo:** `DELETE /api/products/p1`

**Respuesta exitosa (200):**
```json
{
  "message": "Producto eliminado exitosamente",
  "product": {
    "id": "p1",
    "name": "Torta chocolate",
    "price": 20,
    "stock": 5,
    "image": "https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg"
  }
}
```

**Errores:**
- 404: Producto no encontrado

---

## Órdenes

### Obtener Todas las Órdenes
Lista todas las órdenes registradas.

**Endpoint:** `GET /orders`

**Respuesta exitosa (200):**
```json
[
  {
    "id": "o1",
    "userId": "u1",
    "productId": "p1",
    "quantity": 2,
    "total": 40
  }
]
```

---

## Ejemplos de Uso en Frontend

### Fetch API (JavaScript)

**Login:**
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  return data;
};
```

**Crear Producto:**
```javascript
const crearProducto = async (producto) => {
  const response = await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto)
  });
  const data = await response.json();
  return data;
};
```

**Obtener Productos:**
```javascript
const obtenerProductos = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  const data = await response.json();
  return data;
};
```

**Actualizar Producto:**
```javascript
const actualizarProducto = async (id, cambios) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambios)
  });
  const data = await response.json();
  return data;
};
```

**Eliminar Producto:**
```javascript
const eliminarProducto = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  return data;
};
```

---

## Axios (JavaScript)

**Configuración:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});
```

**Login:**
```javascript
const login = async (email, password) => {
  const { data } = await api.post('/login', { email, password });
  return data;
};
```

**Crear Producto:**
```javascript
const crearProducto = async (producto) => {
  const { data } = await api.post('/api/products', producto);
  return data;
};
```

**Obtener Productos:**
```javascript
const obtenerProductos = async () => {
  const { data } = await api.get('/api/products');
  return data;
};
```

**Actualizar Producto:**
```javascript
const actualizarProducto = async (id, cambios) => {
  const { data } = await api.put(`/api/products/${id}`, cambios);
  return data;
};
```

**Eliminar Producto:**
```javascript
const eliminarProducto = async (id) => {
  const { data } = await api.delete(`/api/products/${id}`);
  return data;
};
```

---

## Notas Importantes

1. **CORS:** El servidor está configurado para aceptar peticiones desde `http://localhost:5173`. Si tu frontend corre en otro puerto, actualiza la configuración en `server.js`.

2. **Persistencia:** Los datos se guardan en memoria (DBfalsa.js) y se pierden al reiniciar el servidor.

3. **Validaciones:**
   - Contraseñas: mínimo 6 caracteres
   - Emails: deben ser únicos y tener formato válido
   - Precios y stock: no pueden ser negativos
   - Nombres: no pueden estar vacíos

4. **IDs:** Se generan automáticamente en formato `u1, u2, u3...` para usuarios y `p1, p2, p3...` para productos.
