import { orders, products, saveDB } from '../mock/DBfalsa.js';

// Función para generar un ID único para órdenes
function generateOrderId() {
    const maxId = orders.reduce((max, o) => {
        const num = parseInt(o.id.replace('o', ''));
        return num > max ? num : max;
    }, 0);
    return `o${maxId + 1}`;
}

/**
 * Crea una orden desde el carrito
 * @param {string} userId - ID del usuario
 * @param {Array} cartItems - Items del carrito [{id, name, price, qty}, ...]
 * @returns {object} - La orden creada
 */
export function createOrder(userId, cartItems) {
    if (!userId) throw new Error('El ID de usuario es requerido');
    if (!cartItems || cartItems.length === 0) {
        throw new Error('El carrito está vacío');
    }

    // Validar stock y calcular total
    let total = 0;
    const orderItems = [];

    for (const item of cartItems) {
        const product = products.find(p => p.id === item.id);
        
        if (!product) {
            throw new Error(`Producto ${item.id} no encontrado`);
        }
        
        if (product.stock < item.qty) {
            throw new Error(`Stock insuficiente para ${product.name}`);
        }

        // Calcular subtotal del item
        const itemTotal = product.price * item.qty;
        total += itemTotal;

        orderItems.push({
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: item.qty,
            subtotal: itemTotal
        });
    }

    // Reducir stock de todos los productos después de validar
    for (const item of cartItems) {
        const product = products.find(p => p.id === item.id);
        product.stock -= item.qty;
    }

    // Calcular IVA
    const iva = total * 0.19;
    const totalWithIva = parseFloat((total + iva).toFixed(2));

    // Crear la orden
    const newOrder = {
        id: generateOrderId(),
        userId,
        items: orderItems,
        subtotal: parseFloat(total.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        total: totalWithIva,
        date: new Date().toISOString(),
        status: 'completed'
    };

    orders.push(newOrder);
    saveDB();

    return newOrder;
}

// Obtener todas las órdenes
export function getAllOrders() {
    return orders;
}

// Obtener órdenes de un usuario
export function getOrdersByUserId(userId) {
    return orders.filter(o => o.userId === userId);
}

// Obtener una orden por ID
export function getOrderById(id) {
    const order = orders.find(o => o.id === id);
    if (!order) throw new Error('La orden no existe');
    return order;
}
