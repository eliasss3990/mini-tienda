import ProductCard from "./ProductCard";

function ProductList({ products, cart, onAdd }) { // cart y onAdd llegan desde App y se los pasa a cada tarjeta
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inCart={cart.some((item) => item.id === product.id)} // true si este producto ya está en el carrito
          onAdd={onAdd}
        />
      ))} {/* Le entrega el objeto completo a ProductCard para que muestre su foto, título y precio. */}
    </div>
  );
}

export default ProductList;
