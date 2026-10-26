import { useState, useEffect } from 'react' // Trae useState y useEffect de React
import './App.css'
import ProductList from './components/ProductList'
import SearchBar from './components/SearchBar'

function App() { // es una funcion y React la vuelve a ejecutar cada vez que algo cambia
    // useState devuelve dos cosas: el valor actual y la función para cambiarlo. [] es el valor inicial. Hace que React guarde el valor afuera de la función y te lo devuelva en cada ejecución.
    const [products, setProducts] = useState([]) // useState([]): es la llamada al hook. Le dice a React: “guardame un dato y su valor inicial es []”. Devuelve un arreglo de dos cosas: el valor actual y la función para cambiarlo 
    const [loading, setLoading] = useState(true) // true: al arrancar, todavía se está cargando.
    const [error, setError] = useState(null) // null: todavía no hubo ningún error.
    const [search, setSearch] = useState('')// Sirve para crear una variable estado que almacena un texto. useState("") es el hook que inicializa el estado con un string vacio
    const filterProducts = products.filter((product) => product.title.toLowerCase().includes(search.trim().toLocaleLowerCase()))
    // App pide los 20 productos a la API y los guarda en products
    useEffect(() => { // funcion con lo que hay que hacer, mas una lista de dependencias. Ejecutá esto después de pintar, y solo cuando cambie algo de esta lista
        async function cargarProductos() { // define una funcion asincrona que puede esperar resultados lentos. Se declara adentro porque la función que le pasás a useEffect no puede ser async directamente.
            // atrapar el error y apagar “cargando”
            try { // intenta esto
                const res = await fetch('http://localhost:3001/products') // pide los datos a la API y espera la respuesta, obligatorio async para usar await 
                if (!res.ok) throw new Error('No se pudieron cargar los productos') // si la API tira error corta la función y lanza el error 
                const data = await res.json() // si no tira error, lee el cuerpo de la respuesta y lo convierte en datos de JavaScript
                setProducts(data) // guarda la lista en el estado. Es la unica forma correcta de cambiarlo, y avisa a React de que algo se cambio
            }
            catch { // si algo adentro del try falla, salta acá en lugar de romper
                setError('No se pudieron cargar los productos') // guarda el texto en el estado error
            }
            finally { // se ejecuta siempre, apaga el "Cargando..."
                setLoading(false)
            }
        }
        cargarProductos()
    }, [])

    return ( // parentesis para varias lineas
        <div className="app"> {/* el contenedor principal, un solo elemento raíz, la clase app limita el ancho, lo centra y le da relleno */}
            <h1>Mini Tienda</h1>
            <SearchBar search={search} onSearchChange={setSearch}/>
            {loading && <p className="message">Cargando...</p>} {/* evalua de izquierda a derecha y se corta cuando es falso */}
            {error && <p className="message error">{error}</p>} {/* el error es null (falso) mientras no haya fallo, cuando se guarda el texto con setError, pasa a ser un texto no vacío, que cuenta como verdadero, y aparece el <p> */}
            {!loading && !error && filterProducts.length === 0 && <p className="message">No se encontraron productos</p> }  {/* Si NO está cargando y NO hay error, pero no hay coincidencias */}
            {!loading && !error && filterProducts.length > 0 && <ProductList products={filterProducts} />}
            {/* se escribe como una etiqueta HTML porque es un componente: su nombre empieza con mayúscula. */}
        </div>
    )
}

export default App