//para iniciar el carrirto (vacio)
export function createCart(){
    return{
        items: [], //productos
        total: 0 //valor total, inicial
    };
}

//Agrega productos al carrito
export function addToCart(cart, product, qty){
    
    //validamos que la cantidad no sea negativa
    if (qty <=0) throw new Error('Cantidad inválida');
    
    //validamos si ya existe en el carrito
    const existing = cart.items.find(i => i.id === product.id);

    //calculamos la cantidad final deseada
    const desired = (existing ? existing.qty : 0) + qty;
    
    //validamos stock
    if (desired > product.stock) {
        throw new Error ('Stock insuficiente');
    }
    //si ya existe, lo sumamos
    if (existing){
        existing.qty += qty;
    }else {
        //si no, lo agregamos
        cart.items.push({...product,qty});
    }
    //recalculamos el total
    calculateTotal(cart);
}
//Calculamos el total con IVA
export function calculateTotal(cart) {
    let subtotal = 0;
    //sumamos los precios
    cart.items.forEach(i => {
        subtotal += i.price * i.qty;
    });

    const iva = subtotal * 0.19;
    cart.total = parseFloat((subtotal + iva).toFixed(2));
}