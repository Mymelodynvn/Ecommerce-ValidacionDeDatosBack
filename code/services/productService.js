// Importamos productos
import { products } from "../mock/DBfalsa.js";

// Función para generar un ID único para productos
function generateProductId() {
    const maxId = products.reduce((max, p) => {
        const num = parseInt(p.id.replace('p', ''));
        return num > max ? num : max;
    }, 0);
    return `p${maxId + 1}`;
}

// Crear un nuevo producto
export function createProduct(name, price, stock, image = 'https://www.valoraanalitik.com/wp-content/uploads/2025/05/De-Todito.jpg') {
    // Validaciones
    if (!name || name.trim() === '') throw new Error('El nombre del producto es requerido');
    if (price < 0) throw new Error('El precio debe ser mayor o igual a 0');
    if (stock < 0) throw new Error('El stock debe ser mayor o igual a 0');

    // Crear el nuevo producto
    const newProduct = {
        id: generateProductId(),
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        image
    };

    // Agregar a la base de datos
    products.push(newProduct);
    return newProduct;
}

// Obtener todos los productos
export function getAllProducts() {
    return products;
}

// Obtener un producto por ID
export function getProductById(id) {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('El producto no existe');
    return product;
}

// Actualizar un producto completo
export function updateProduct(id, updates) {
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('El producto no existe');

    // Validaciones
    if (updates.name !== undefined && updates.name.trim() === '') {
        throw new Error('El nombre del producto no puede estar vacío');
    }
    if (updates.price !== undefined && updates.price < 0) {
        throw new Error('El precio debe ser mayor o igual a 0');
    }
    if (updates.stock !== undefined && updates.stock < 0) {
        throw new Error('El stock debe ser mayor o igual a 0');
    }

    // Actualizar campos
    if (updates.name !== undefined) product.name = updates.name.trim();
    if (updates.price !== undefined) product.price = parseFloat(updates.price);
    if (updates.stock !== undefined) product.stock = parseInt(updates.stock);
    if (updates.image !== undefined) product.image = updates.image;

    return product;
}

// Actualizar solo el precio de un producto
export function updatePrice(id, newPrice) {
    if (newPrice < 0) throw new Error('Precio inválido');
    
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('El producto no existe');

    product.price = parseFloat(newPrice);
    return product;
}

// Eliminar un producto
export function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('El producto no existe');

    const deletedProduct = products.splice(index, 1)[0];
    return deletedProduct;
}