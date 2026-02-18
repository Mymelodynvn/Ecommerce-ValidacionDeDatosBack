import { users } from '../mock/DBfalsa.js';

/**
 * Middleware para verificar que el usuario sea admin
 * Espera que el userId venga en el header 'x-user-id'
 */
export function requireAdmin(req, res, next) {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ 
            error: 'No autorizado. Se requiere autenticación.' 
        });
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(401).json({ 
            error: 'Usuario no encontrado.' 
        });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }

    // Usuario es admin, continuar
    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
}

/**
 * Middleware para verificar que el usuario esté autenticado (cualquier rol)
 */
export function requireAuth(req, res, next) {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ 
            error: 'No autorizado. Se requiere autenticación.' 
        });
    }

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(401).json({ 
            error: 'Usuario no encontrado.' 
        });
    }

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
}
