import { users } from "../mock/DBfalsa.js";

// Función para iniciar sesión
export function login(email, password) {
    // Validar que el correo electrónico tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('El correo electrónico no es válido.');
    }

    // Buscar el usuario en la base de datos
    const user = users.find((u) => u.email === email);
    if (!user) {
        throw new Error('La contraseña o el usuario es incorrecto.');
    }

    // Verificar que la contraseña coincida
    if (user.password !== password) {
        throw new Error('La contraseña o el usuario es incorrecto.');
    }

    // Retornar el usuario sin la contraseña
    return { id: user.id, name: user.name, email: user.email, role: user.role };
}