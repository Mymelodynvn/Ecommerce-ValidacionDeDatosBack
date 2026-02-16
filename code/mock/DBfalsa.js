export const users = [
  { id: 'u1', name: 'Juan Pérez', email: 'juan.perez@example.com', password: '123456' },
  { id: 'u2', name: 'María López', email: 'maria.lopez@example.com', password: 'password' },
  { id: 'u3', name: 'Carlos García', email: 'carlos.garcia@example.com', password: 'qwerty' },
  { id: 'u4', name: 'Ana Martínez', email: 'miguel.amaya@gmail.com', password: '123456789' }
];
// aquí se guardan los usuarios que registramos

export const products = [
  { id: 'p1', name: 'Torta chocolate', price: 20, stock: 5, image: 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg' },
  { id: 'p2', name: 'Cupcake vainilla', price: 5, stock: 10, image: 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg' },
  { id: 'p3', name: 'Brownie', price: 15, stock: 8, image: 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg' },
  { id: 'p4', name: 'Galleta chispas', price: 3, stock: 20, image: 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg' },
  { id: 'p5', name: 'Cheesecake', price: 25, stock: 4, image: 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg' }
];
// Catálogo inicial, hecho con productos simulados

export const orders = [
  { id: 'o1', userId: 'u1', productId: 'p1', quantity: 2, total: 40 },
  { id: 'o2', userId: 'u2', productId: 'p3', quantity: 1, total: 15 },
  { id: 'o3', userId: 'u3', productId: 'p2', quantity: 3, total: 15 }
];
