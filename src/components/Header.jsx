function Header({ count }) { // Header: componente (mayus), count: prop, dato que le pasa la app (cantidad de productos del carrito), y lo destructura
    return (<header className="header"> {/* className en lugar de class porque en JS es una palabra reservada */}
        <h1>Mini Tienda</h1>
        <span className="cart-count">Carrito ({count})</span>
    </header>)
}

export default Header // Para que se pueda importar el compotente Header