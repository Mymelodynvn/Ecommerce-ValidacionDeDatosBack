import { registerUser } from './authService.js'; // Importa la función de registro
import { users } from '../mock/DBfalsa.js'; // Importa la base de datos mockeada

/**
 * Registra un nuevo usuario en la base de datos mockeada.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {object} - El usuario registrado.
 * @throws {Error} - Si el usuario ya existe o la contraseña es débil.
 */
export function registerUserInDB(name, email, password) {
    // Registra el usuario utilizando la lógica existente
    const newUser = registerUser(email, password);

    // Agrega el nombre al usuario registrado
    newUser.name = name;

    // Actualiza la base de datos mockeada
    users.push(newUser);

    return newUser;
}