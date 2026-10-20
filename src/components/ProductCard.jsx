function ProductCard({product}) {
    return (
        <div className="card">
            <img src={product.thumbnail} alt={product.title} />
            <h3 className="card-title">{product.title}</h3>
            <p className="card-price">Gs. {product.price.toLocaleString("es-PY")}</p>
            <button className="btn">Agregar</button>
        </div>
    )
}
export default ProductCard;