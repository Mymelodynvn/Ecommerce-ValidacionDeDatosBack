import { users } from "../mock/DBfalsa.js"; //importamos los usuarios de la db falsa

//Esta funcion valida si la contraseña es segura
export  function validatePassword(password){
    return(
        password.length > 8 && //debe tener más de 8 carácteres
        /\d/.test(password) && //al menos un número
        /[!@#$%^&*]/.test(password) //y un carácter especial
    );
}

//función para registrar un usuario
export function registerUser(email, password){
    //Valida que la contraseña sea fuere/segura
    if (!validatePassword(password)){
        throw new Error('Contraseña débil:p');
    }

//Busca el email, por si existe
const exists = users.find(u=>u.email ===email);
if (exists) throw new Error('El usuario ya existe.')

//Crea el usuario
const user = {id: Date.now(), email, password}; //crea un id simple con timestamp

users.push(user); //Guarda el usuario en la db

return user; //retorna el usuario creado
}

//funcion para iniciar sesión
export function login(email, password){
    //Validar que el correo electrónico tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('El correo electrónico no es válido.');
    }

    // Buscar el usuario en la base de datos mockeada
    const user = users.find((u) => u.email === email);
    if (!user) {
        throw new Error('La contraseña o el usuario es incorrecto..');
    }

    // Verificar que la contraseña coincida
    if (user.password !== password) {
        throw new Error('La contraseña o el usuario es incorrecto.');
    }

    // Retornar el usuario si las credenciales son correctas
    return { id: user.id, name: user.name, email: user.email };
}