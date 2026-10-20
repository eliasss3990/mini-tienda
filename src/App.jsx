import "./App.css";
import { useState } from "react";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";

const prueba = [
  {
    id: 1,
    title: "Auriculares Bluetooth",
    price: 189000,
    thumbnail: "https://picsum.photos/seed/tienda1/400/300",
  },
  {
    id: 2,
    title: "Mouse Inalámbrico",
    price: 95000,
    thumbnail: "https://picsum.photos/seed/tienda2/400/300",
  },
  {
    id: 3,
    title: "Teclado Mecánico",
    price: 320000,
    thumbnail: "https://picsum.photos/seed/tienda3/400/300",
  },
];

function App() {
  const [search, setSearch] = useState("");

  const filterProducts = prueba.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="app">
      <h1>Mini Tienda</h1>
      <SearchBar search={search} onSearchChange={setSearch} />
      {filterProducts.length === 0 ? (
        <p className="message">No se encontraron productos</p>
      ) : (
        <ProductList products={filterProducts} />
      )}
    </div>
  );
}

export default App;
