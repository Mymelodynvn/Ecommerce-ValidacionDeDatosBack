//importa las funciones que usaremos jeje, pq sino, no sirve
import { registerUser, login } from "../services/authService";
import { users } from "../mocks/DBfalsa";

//descrbe agrupa todos los tests del módulo
describe('Modulo 1 - Auth', () => {
    //antes de cada test se limpia la db
    beforeEach(() => users.length = 0);

    test('Registro Exitoso;)', () => {
        //preparamos los datos
        const email = 'a@test.com';
        const password = '4empanadas!';

        //ejecutamos la acción
        const user = registerUser(email, password);

        //validamos los resultados
        expect(user.email).toBe(email);
        expect(users.length).toBe(1);
    });

    test('No se permiten usuarios duplicados', () => {
        registerUser('a@test.com', '4empanadas!');
        expect(() => {
            registerUser('a@test.com', '4empanadas!');
        }).toThrow('El usuario ya existe');
    });

    test('Login incorrecto, devuelve un error genérico', () => {
        registerUser('a@test.com', '4empanadas!');

        expect(() => {
            login('a@test.com', 'mala');
        }).toThrow('Credenciales Inválidas');
    });
});