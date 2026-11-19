function ProductCard({ product, inCart, onAdd }) { // inCart: true si el producto ya está en el carrito; onAdd: la función de App para agregarlo
    const soldOut = product.stock === 0 // true si ya no queda stock de este producto

    return (
        <div className="card">
            <img src={product.thumbnail} alt={product.title} />
            <h3 className="card-title">{product.title}</h3>
            <p style={{ margin: "0 12px 4px" }}>★ {product.rating.toFixed(1)}</p> {/* muestra la calificación del producto que viene de la API; toFixed(1) siempre deja un decimal (4 se ve como 4.0) para que todas se vean parejas; el estilo en línea solo le da el mismo margen lateral que al precio */}
            <p className="card-price">Gs. {product.price.toLocaleString("es-PY")}</p>
            <button
                className={inCart ? "btn btn-added" : "btn"} // si ya está en el carrito, cambia el estilo del botón
                onClick={() => onAdd(product)} // al hacer clic, avisa a App con el producto completo
                disabled={inCart || soldOut} // si ya está en el carrito o está agotado, el botón no se puede apretar (el estilo gris ya lo da .btn:disabled)
            >
                {soldOut ? "Agotado" : inCart ? "En el carrito" : "Agregar"} {/* si no hay stock dice Agotado; si no, el texto de siempre */}
            </button>
        </div>
    )
}
export default ProductCard;
