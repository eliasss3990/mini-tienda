import './App.css'
import ProductList from './components/ProductList'

const prueba = [
    {
    id: 1,
    title: "Auriculares Bluetooth",
    price: 189000,
    thumbnail: "https://picsum.photos/seed/tienda1/400/300"
  },
  {
    id: 2,
    title: "Mouse Inalámbrico",
    price: 95000,
    thumbnail: "https://picsum.photos/seed/tienda2/400/300"
  },
  {
    id: 3,
    title: "Teclado Mecánico",
    price: 320000,
    thumbnail: "https://picsum.photos/seed/tienda3/400/300"
  }
];

function App() {
  return (
    <div className="app">
      <h1>Mini Tienda</h1>
      <ProductList products={prueba}/>
    </div>
  )
}

export default App
