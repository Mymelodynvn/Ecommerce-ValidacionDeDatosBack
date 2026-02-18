import { orders, products } from '../mock/DBfalsa.js';

/**
 * Obtiene el total de ventas del día
 * @param {string} date - Fecha en formato ISO (opcional, por defecto hoy)
 * @returns {object} - Total de ventas y órdenes del día
 */
export function getVentasDelDia(date = null) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const ordenesDelDia = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startOfDay && orderDate <= endOfDay && order.status !== 'cancelled';
    });

    const totalVentas = ordenesDelDia.reduce((sum, order) => sum + order.total, 0);

    return {
        fecha: targetDate.toISOString().split('T')[0],
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        cantidadOrdenes: ordenesDelDia.length,
        ordenes: ordenesDelDia
    };
}

/**
 * Obtiene productos con stock bajo
 * @param {number} umbralMinimo - Stock mínimo permitido (por defecto 5)
 * @returns {Array} - Productos con stock bajo
 */
export function getProductosStockBajo(umbralMinimo = 5) {
    const productosStockBajo = products.filter(product => product.stock < umbralMinimo);

    return productosStockBajo.map(product => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        umbral: umbralMinimo,
        diferencia: umbralMinimo - product.stock
    }));
}

/**
 * Obtiene reporte de ventas mensual
 * @param {number} mes - Mes (1-12)
 * @param {number} anio - Año
 * @returns {object} - Reporte mensual
 */
export function getReporteMensual(mes, anio) {
    if (!mes || !anio || mes < 1 || mes > 12) {
        throw new Error('Mes y año son requeridos y deben ser válidos');
    }

    // Crear rango de fechas del mes
    const startOfMonth = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(anio, mes, 0, 23, 59, 59, 999);

    const ordenesDelMes = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startOfMonth && orderDate <= endOfMonth && order.status !== 'cancelled';
    });

    const totalVentas = ordenesDelMes.reduce((sum, order) => sum + order.total, 0);
    const totalSubtotal = ordenesDelMes.reduce((sum, order) => sum + order.subtotal, 0);
    const totalIva = ordenesDelMes.reduce((sum, order) => sum + order.iva, 0);

    return {
        mes,
        anio,
        periodo: `${mes}/${anio}`,
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        subtotal: parseFloat(totalSubtotal.toFixed(2)),
        iva: parseFloat(totalIva.toFixed(2)),
        cantidadOrdenes: ordenesDelMes.length,
        ordenes: ordenesDelMes
    };
}

/**
 * Compara ventas de hoy vs ayer (Tendencia de Ventas)
 * @returns {object} - Comparación de ventas
 */
export function getTendenciaVentas() {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);

    const ventasHoy = getVentasDelDia(hoy.toISOString());
    const ventasAyer = getVentasDelDia(ayer.toISOString());

    const diferencia = ventasHoy.totalVentas - ventasAyer.totalVentas;
    const porcentajeCambio = ventasAyer.totalVentas > 0 
        ? ((diferencia / ventasAyer.totalVentas) * 100).toFixed(2)
        : 0;

    let tendencia = 'estable';
    if (diferencia > 0) tendencia = 'creciente';
    if (diferencia < 0) tendencia = 'decreciente';

    return {
        hoy: {
            fecha: ventasHoy.fecha,
            total: ventasHoy.totalVentas,
            ordenes: ventasHoy.cantidadOrdenes
        },
        ayer: {
            fecha: ventasAyer.fecha,
            total: ventasAyer.totalVentas,
            ordenes: ventasAyer.cantidadOrdenes
        },
        diferencia: parseFloat(diferencia.toFixed(2)),
        porcentajeCambio: parseFloat(porcentajeCambio),
        tendencia
    };
}

/**
 * Obtiene KPIs generales del dashboard
 * @returns {object} - KPIs principales
 */
export function getKPIs() {
    const ventasHoy = getVentasDelDia();
    const stockBajo = getProductosStockBajo();
    const tendencia = getTendenciaVentas();

    // Total de productos
    const totalProductos = products.length;
    const productosActivos = products.filter(p => p.stock > 0).length;

    // Total de órdenes
    const totalOrdenes = orders.length;
    const ordenesPendientes = orders.filter(o => o.status === 'pending').length;
    const ordenesCompletadas = orders.filter(o => o.status === 'completed').length;

    return {
        ventas: {
            hoy: ventasHoy.totalVentas,
            ordenesHoy: ventasHoy.cantidadOrdenes,
            tendencia: tendencia.tendencia,
            cambio: tendencia.porcentajeCambio
        },
        inventario: {
            totalProductos,
            productosActivos,
            productosStockBajo: stockBajo.length
        },
        ordenes: {
            total: totalOrdenes,
            pendientes: ordenesPendientes,
            completadas: ordenesCompletadas
        }
    };
}

/**
 * Obtiene productos más vendidos
 * @param {number} limite - Cantidad de productos a retornar (por defecto 5)
 * @returns {Array} - Productos más vendidos
 */
export function getProductosMasVendidos(limite = 5) {
    const ventasPorProducto = {};

    orders.forEach(order => {
        if (order.status !== 'cancelled') {
            order.items.forEach(item => {
                if (!ventasPorProducto[item.productId]) {
                    ventasPorProducto[item.productId] = {
                        productId: item.productId,
                        productName: item.productName,
                        cantidadVendida: 0,
                        totalVentas: 0
                    };
                }
                ventasPorProducto[item.productId].cantidadVendida += item.quantity;
                ventasPorProducto[item.productId].totalVentas += item.subtotal;
            });
        }
    });

    const productosArray = Object.values(ventasPorProducto);
    productosArray.sort((a, b) => b.cantidadVendida - a.cantidadVendida);

    return productosArray.slice(0, limite).map(p => ({
        ...p,
        totalVentas: parseFloat(p.totalVentas.toFixed(2))
    }));
}
