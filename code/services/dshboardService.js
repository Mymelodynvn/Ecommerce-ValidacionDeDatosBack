//Importamos productos y órdenes
import { orders, products } from "../mocks/DBfalsa";

//kpi: total de ventas
export function salesKPI(){
    //suma todas las órdenes
    return orders.reduce((sum, o) => sum + o.total, 0);
}

//productos con stock bajo
export function lowStock(threshold){
    return products.filter(p => p.stock < threshold);
}