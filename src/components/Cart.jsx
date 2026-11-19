function Cart({ cart, onRemove, onClear }) { // cart: la lista de productos agregados; onRemove: la función de App para quitar uno; onClear: la de App para vaciar todo
    const total = cart.reduce((suma, item) => suma + item.price, 0) // reduce recorre el carrito y va sumando los precios, empezando desde 0

    return (
        <section className="cart">
            <h2>Carrito</h2>
            {cart.length === 0 && <p className="message">El carrito está vacío</p>} {/* mensaje cuando no hay nada agregado */}
            <ul className="cart-list">
                {cart.map((item) => ( // una fila por cada producto del carrito
                    <li className="cart-item" key={item.id}>
                        <span>{item.title}</span>
                        <span>Gs. {item.price.toLocaleString("es-PY")}</span>
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
