import ProductCard from "./ProductCard";

function ProductList({ products }) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />  
      ))} {/* Le entrega el objeto completo a ProductCard para que muestre su foto, título y precio. */}
    </div>
  );
}

export default ProductList;
