function Cart({ cart, onRemove, onClear, onChangeQuantity }) { // cart: la lista de productos agregados; onRemove: la función de App para quitar uno; onClear: la de App para vaciar todo; onChangeQuantity: la de App para subir o bajar la cantidad
    const total = cart.reduce((suma, item) => suma + item.price * item.quantity, 0) // reduce recorre el carrito y va sumando el precio de cada producto por su cantidad, empezando desde 0

    return (
        <section className="cart">
            <h2>Carrito</h2>
            {cart.length === 0 && <p className="message">El carrito está vacío</p>} {/* mensaje cuando no hay nada agregado */}
            <ul className="cart-list">
                {cart.map((item) => ( // una fila por cada producto del carrito
                    <li className="cart-item" key={item.id}>
                        <span>{item.title}</span>
                        <button className="btn-remove" onClick={() => onChangeQuantity(item.id, -1)}>-</button> {/* baja la cantidad en 1; App no la deja bajar de 1 */}
                        <span>{item.quantity}</span> {/* cuántas unidades hay de este producto */}
                        <button className="btn-remove" onClick={() => onChangeQuantity(item.id, 1)}>+</button> {/* sube la cantidad en 1; App no la deja pasar del stock */}
                        <span>Gs. {(item.price * item.quantity).toLocaleString("es-PY")}</span> {/* precio de esa fila: precio por cantidad */}
                        <button className="btn-remove" onClick={() => onRemove(item.id)}>x</button> {/* al hacer clic, avisa a App qué id quitar */}
                    </li>
                ))}
            </ul>
            <p className="cart-total">TOTAL: Gs. {total.toLocaleString("es-PY")}</p>
            {cart.length > 0 && <button className="btn" onClick={onClear}>Vaciar carrito</button>} {/* solo aparece si hay algo en el carrito; al hacer clic avisa a App para vaciarlo */}
        </section>
    )
}

export default Cart
