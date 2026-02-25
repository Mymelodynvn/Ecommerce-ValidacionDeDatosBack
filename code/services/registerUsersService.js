import { users, saveDB } from '../mock/DBfalsa.js';

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
 * @param {string} role - Rol del usuario (user o admin, por defecto user).
 * @returns {object} - El usuario registrado.
 * @throws {Error} - Si el usuario ya existe o los datos son inválidos.
 */
export function registerUserInDB(name, email, password, role = 'user') {
    // Validaciones - verificar espacios ANTES de cualquier otra validación
    if (name && /\s/.test(name)) {
        throw new Error('El nombre no puede contener espacios');
    }
    
    if (email && /\s/.test(email)) {
        throw new Error('El email no puede contener espacios');
    }
    
    if (password && /\s/.test(password)) {
        throw new Error('La contraseña no puede contener espacios');
    }
    
    // Validaciones de campos requeridos
    if (!name || name.trim() === '') {
        throw new Error('El nombre es requerido');
    }
    
    if (!email || email.trim() === '') {
        throw new Error('El email es requerido');
    }
    
    // Validar que el email contenga .com
    if (!email.includes('.com')) {
        throw new Error('El email debe contener .com');
    }
    
    if (!password) {
        throw new Error('La contraseña es requerida');
    }
    
    // Validar que la contraseña no contenga espacios
    if (/\s/.test(password)) {
        throw new Error('La contraseña no puede contener espacios');
    }
    
    // Validar contraseña: mínimo 8 caracteres, al menos un número y un carácter especial
    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    
    // Validar que no contenga caracteres prohibidos
    if (/[<>\\/&]/.test(password)) {
        throw new Error('La contraseña no puede contener los caracteres: < > / \\ &');
    }
    
    const tieneNumero = /\d/.test(password);
    const tieneCaracterEspecial = /[!@#$%^*(),.?":{}|]/.test(password);
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    
    if (!tieneNumero) {
        throw new Error('La contraseña debe contener al menos un número');
    }
    
    if (!tieneCaracterEspecial) {
        throw new Error('La contraseña debe contener al menos un carácter especial (!@#$%^*(),.?":{}|)');
    }
    
    if (!tieneMayuscula) {
        throw new Error('La contraseña debe contener al menos una letra mayúscula');
    }
    
    if (!tieneMinuscula) {
        throw new Error('La contraseña debe contener al menos una letra minúscula');
    }
    
    if (!['user', 'admin'].includes(role)) {
        throw new Error('El rol debe ser "user" o "admin"');
    }

    // Verificar si el usuario ya existe (comparar sin espacios para evitar duplicados)
    const existingUser = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (existingUser) {
        throw new Error('El usuario ya existe con ese email');
    }

    // Crear el nuevo usuario
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        password: password,
        role: role
    };

    // Agregar a la base de datos
    users.push(newUser);
    saveDB();

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

// Verificar si un usuario es admin
export function isAdmin(userId) {
    const user = users.find(u => u.id === userId);
    return user && user.role === 'admin';
}