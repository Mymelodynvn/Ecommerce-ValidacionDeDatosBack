import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// Función para leer la base de datos
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo la base de datos:', error);
    return { users: [], products: [], orders: [] };
  }
}

// Función para escribir en la base de datos
function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error escribiendo en la base de datos:', error);
  }
}

// Cargar datos iniciales
let db = readDB();

// Exportar arrays con getters y setters para mantener sincronización
export const users = new Proxy(db.users, {
  set(target, property, value) {
    target[property] = value;
    db.users = target;
    writeDB(db);
    return true;
  }
});

export const products = new Proxy(db.products, {
  set(target, property, value) {
    target[property] = value;
    db.products = target;
    writeDB(db);
    return true;
  }
});

export const orders = new Proxy(db.orders, {
  set(target, property, value) {
    target[property] = value;
    db.orders = target;
    writeDB(db);
    return true;
  }
});

// Función helper para guardar cambios manualmente cuando se usan métodos como push
export function saveDB() {
  db = { users: [...users], products: [...products], orders: [...orders] };
  writeDB(db);
}
