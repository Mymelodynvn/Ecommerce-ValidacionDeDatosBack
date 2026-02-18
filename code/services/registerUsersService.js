import { users } from '../mock/DBfalsa.js';

// Función para generar un ID único para usuarios
function generateUserId() {
    const maxId = users.reduce((max, u) => {
        const num = parseInt(u.id.replace('u', ''));
        return num > max ? num : max;
    }, 0);
    return `u${maxId + 1}`;
}

/**
 * Registra un nuevo usuario en la base de datos mockeada.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {object} - El usuario registrado.
 * @throws {Error} - Si el usuario ya existe o los datos son inválidos.
 */
export function registerUserInDB(name, email, password) {
    // Validaciones
    if (!name || name.trim() === '') {
        throw new Error('El nombre es requerido');
    }
    if (!email || email.trim() === '') {
        throw new Error('El email es requerido');
    }
    if (!password || password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        throw new Error('El usuario ya existe con ese email');
    }

    // Crear el nuevo usuario
    const newUser = {
        id: generateUserId(),
        name: name.trim(),
        email: email.trim(),
        password: password
    };

    // Agregar a la base de datos
    users.push(newUser);

    // Retornar sin la contraseña por seguridad
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}

// Obtener todos los usuarios (sin contraseñas)
export function getAllUsers() {
    return users.map(({ password, ...user }) => user);
}

// Obtener un usuario por ID
export function getUserById(id) {
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('El usuario no existe');
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}