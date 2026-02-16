//importamos productos
import { products } from "../mocks/DBfalsa";

//Para actualizar el precio de un producto
export function updatePrice(id, newPrice){

    //válidamos que el precio sea válido
    if (newPrice < 0) throw new Error('Precio inválido');

    //buscamos el producto
    const product = products.find(p => p.id ===id);

    //si no existe
    if (!product) throw new Error('El producto no existe');

    //actualizamos
    product.price= newPrice;
    return product
}