import { useState, useEffect } from 'react' // Trae useState y useEffect de React
import './App.css'
import ProductList from './components/ProductList'

function App() { // es una funcion y React la vuelve a ejecutar cada vez que algo cambia
    // useState devuelve dos cosas: el valor actual y la función para cambiarlo. [] es el valor inicial. Hace que React guarde el valor afuera de la función y te lo devuelva en cada ejecución.
    const [products, setProducts] = useState([]) // useState([]): es la llamada al hook. Le dice a React: “guardame un dato y su valor inicial es []”. Devuelve un arreglo de dos cosas: el valor actual y la función para cambiarlo 
    const [loading, setLoading] = useState(true) // true: al arrancar, todavía se está cargando.
    const [error, setError] = useState(null) // null: todavía no hubo ningún error.

    // App pide los 20 productos a la API y los guarda en products
    useEffect(() => { // funcion con lo que hay que hacer, mas una lista de dependencias. Ejecutá esto después de pintar, y solo cuando cambie algo de esta lista
        async function cargarProductos() { // define una funcion asincrona que puede esperar resultados lentos. Se declara adentro porque la función que le pasás a useEffect no puede ser async directamente.
            // atrapar el error y apagar “cargando”
            try { // intenta esto
                const res = await fetch('http://localhost:3001/products') // pide los datos a la API y espera la respuesta, obligatorio async para usar await 
                if (!res.ok) throw new Error('No se pudieron cargar los productos') // si la API tira error corta la función y lanza el error 
                const data = await res.json() // si no tira error, la res llega como texto JSON y se convierte en un arreglo
                setProducts(data) // guarda la lista en el estado. Es la unica forma correcta de cambiarlo, y avisa a React de que algo se cambio
            }
            catch { // si algo adentro del try falla, salta acá en lugar de romper
                setError('No se pudieron cargar los productos') // muestra el texto de error y lo guarda el error que hubo 
            }
            finally { // se ejecuta siempre, apaga el "Cargando..."
                setLoading(false)
            }
        }
        cargarProductos()
    }, [])

    return ( // parentesis para varias lineas
        <div className="app"> {/* fragmento, ya que un componente solo puede devolver un elemento raiz, esto agrupa el h1 con la lista */}
            <h1>Mini Tienda</h1>
            {loading && <p className="message">Cargando...</p>} {/* evalua de izquierda a derecha y se corta cuando es falso */}
            {error && <p className="message error">{error}</p>} {/* el error es null (falso) mientras no haya fallo, cuando se guarda el texto con setError, pasa a ser un texto no vacío, que cuenta como verdadero, y aparece el <p> */}
            <ProductList products={products} /> {/* se escribe como una etiqueta HTML porque es un componente: su nombre empieza con mayúscula. */}
        </div>
    )
}

export default App