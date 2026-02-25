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
 * @param {number}  Stock mínimo permitido (por defecto 5)
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
 * @param {number} Mes (1-12)
 * @param {number} Año
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

/**
 * Obtiene reporte de ventas semanal
 * @param {string} fechaInicio - Fecha de inicio de la semana (opcional, por defecto inicio de semana actual)
 * @returns {object} - Reporte semanal
 */
export function getReporteSemanal(fechaInicio = null) {
    let startOfWeek;
    
    if (fechaInicio) {
        startOfWeek = new Date(fechaInicio);
    } else {
        // Obtener el inicio de la semana actual (lunes)
        const hoy = new Date();
        const dia = hoy.getDay();
        const diff = dia === 0 ? -6 : 1 - dia; // Si es domingo, retroceder 6 días
        startOfWeek = new Date(hoy);
        startOfWeek.setDate(hoy.getDate() + diff);
    }
    
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Fin de semana (domingo)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const ordenesDeLaSemana = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startOfWeek && orderDate <= endOfWeek && order.status !== 'cancelled';
    });
    
    const totalVentas = ordenesDeLaSemana.reduce((sum, order) => sum + order.total, 0);
    const totalSubtotal = ordenesDeLaSemana.reduce((sum, order) => sum + order.subtotal, 0);
    const totalIva = ordenesDeLaSemana.reduce((sum, order) => sum + order.iva, 0);
    
    // Ventas por día de la semana
    const ventasPorDia = {};
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
    ordenesDeLaSemana.forEach(order => {
        const orderDate = new Date(order.date);
        const diaNombre = diasSemana[orderDate.getDay()];
        
        if (!ventasPorDia[diaNombre]) {
            ventasPorDia[diaNombre] = {
                dia: diaNombre,
                totalVentas: 0,
                cantidadOrdenes: 0
            };
        }
        
        ventasPorDia[diaNombre].totalVentas += order.total;
        ventasPorDia[diaNombre].cantidadOrdenes += 1;
    });
    
    return {
        fechaInicio: startOfWeek.toISOString().split('T')[0],
        fechaFin: endOfWeek.toISOString().split('T')[0],
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        subtotal: parseFloat(totalSubtotal.toFixed(2)),
        iva: parseFloat(totalIva.toFixed(2)),
        cantidadOrdenes: ordenesDeLaSemana.length,
        ventasPorDia: Object.values(ventasPorDia).map(v => ({
            ...v,
            totalVentas: parseFloat(v.totalVentas.toFixed(2))
        })),
        ordenes: ordenesDeLaSemana
    };
}

/**
 * Obtiene reporte de ventas por rango de fechas personalizado
 * @param {string} fechaInicio - Fecha de inicio en formato ISO
 * @param {string} fechaFin - Fecha de fin en formato ISO
 * @returns {object} - Reporte personalizado
 */
export function getReportePorRango(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) {
        throw new Error('Las fechas de inicio y fin son requeridas');
    }
    
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);
    
    if (startDate > endDate) {
        throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
    }
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    const ordenesDelRango = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate && order.status !== 'cancelled';
    });
    
    const totalVentas = ordenesDelRango.reduce((sum, order) => sum + order.total, 0);
    const totalSubtotal = ordenesDelRango.reduce((sum, order) => sum + order.subtotal, 0);
    const totalIva = ordenesDelRango.reduce((sum, order) => sum + order.iva, 0);
    
    // Calcular días en el rango
    const diasEnRango = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const promedioDiario = ordenesDelRango.length > 0 ? totalVentas / diasEnRango : 0;
    
    // Productos más vendidos en el rango
    const ventasPorProducto = {};
    ordenesDelRango.forEach(order => {
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
    });
    
    const productosArray = Object.values(ventasPorProducto);
    productosArray.sort((a, b) => b.cantidadVendida - a.cantidadVendida);
    
    return {
        fechaInicio: startDate.toISOString().split('T')[0],
        fechaFin: endDate.toISOString().split('T')[0],
        diasEnRango,
        totalVentas: parseFloat(totalVentas.toFixed(2)),
        subtotal: parseFloat(totalSubtotal.toFixed(2)),
        iva: parseFloat(totalIva.toFixed(2)),
        cantidadOrdenes: ordenesDelRango.length,
        promedioDiario: parseFloat(promedioDiario.toFixed(2)),
        productosMasVendidos: productosArray.slice(0, 5).map(p => ({
            ...p,
            totalVentas: parseFloat(p.totalVentas.toFixed(2))
        })),
        ordenes: ordenesDelRango
    };
}
