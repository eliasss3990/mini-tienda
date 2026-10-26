function ProductCard({ product, inCart, onAdd }) { // inCart: true si el producto ya está en el carrito; onAdd: la función de App para agregarlo
    return (
        <div className="card">
            <img src={product.thumbnail} alt={product.title} />
            <h3 className="card-title">{product.title}</h3>
            <p className="card-price">Gs. {product.price.toLocaleString("es-PY")}</p>
            <button
                className={inCart ? "btn btn-added" : "btn"} // si ya está en el carrito, cambia el estilo del botón
                onClick={() => onAdd(product)} // al hacer clic, avisa a App con el producto completo
                disabled={inCart} // si ya está en el carrito, el botón no se puede apretar
            >
                {inCart ? "En el carrito" : "Agregar"}
            </button>
        </div>
    )
}
export default ProductCard;
