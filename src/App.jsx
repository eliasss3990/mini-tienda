import { useState, useEffect } from 'react' // Trae useState y useEffect de React
import './App.css'
import ProductList from './components/ProductList'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import Cart from './components/Cart'

const CART_KEY = 'mini-tienda-cart' // clave propia para guardar el carrito, así otro proyecto de localhost no la pisa

function App() { // es una funcion y React la vuelve a ejecutar cada vez que algo cambia
    // useState devuelve dos cosas: el valor actual y la función para cambiarlo. [] es el valor inicial. Hace que React guarde el valor afuera de la función y te lo devuelva en cada ejecución.
    const [products, setProducts] = useState([]) // useState([]): es la llamada al hook. Le dice a React: “guardame un dato y su valor inicial es []”. Devuelve un arreglo de dos cosas: el valor actual y la función para cambiarlo 
    const [loading, setLoading] = useState(true) // true: al arrancar, todavía se está cargando.
    const [error, setError] = useState(null) // null: todavía no hubo ningún error.
    const [cart, setCart] = useState(() => { // cart: productos agregados; setCart: la función para cambiarlo y que React redibuje. Al darle una función, React la ejecuta solo la primera vez para sacar el valor inicial
        try { // intenta leer el carrito guardado en el navegador
            const saved = JSON.parse(localStorage.getItem(CART_KEY)) // lee el texto guardado y lo vuelve a convertir en datos
            if (!Array.isArray(saved)) return [] // solo sirve si es un arreglo, si no arranca vacío
            return saved.filter((item) => item && typeof item.id === 'number' && typeof item.price === 'number' && Number.isInteger(item.quantity) && item.quantity >= 1) // se queda solo con los productos que tienen id, precio y una cantidad válida, así uno dañado no rompe el total
        } catch { // si lo guardado está dañado o el navegador no deja leer, no rompe la página
            return [] // y arranca con el carrito vacío
        }
    })
    useEffect(() => { // se ejecuta cada vez que cart cambia (por la lista de abajo)
        try { // intenta guardar el carrito en el navegador
            localStorage.setItem(CART_KEY, JSON.stringify(cart)) // lo pasa a texto porque localStorage solo guarda texto
        } catch {
            // si el navegador no deja guardar (lleno o bloqueado), la página sigue andando, solo no se recuerda al recargar
        }
    }, [cart])
    const [search, setSearch] = useState('')// Sirve para crear una variable estado que almacena un texto. useState("") es el hook que inicializa el estado con un string vacio
    const [category, setCategory] = useState('') // category: la categoría elegida en el filtro; '' significa "todas"
    const categories = [...new Set(products.map((product) => product.category))] // map saca la categoría de cada producto y Set quita las repetidas, así el filtro arma sus opciones solo
    const filterProducts = products.filter((product) => product.title.toLowerCase().includes(search.trim().toLocaleLowerCase()) && (category === '' || product.category === category)) // se queda con los que coinciden con el buscador y, si hay una categoría elegida, también con ella
    const [order, setOrder] = useState('') // order: cómo ordenar por precio; '' = como vienen de la API, 'asc' = de menor a mayor, 'desc' = de mayor a menor
    const sortedProducts = [...filterProducts].sort((a, b) => order === 'asc' ? a.price - b.price : order === 'desc' ? b.price - a.price : 0) // [...] hace una copia para no cambiar la lista original (sort modifica el arreglo); restar precios ordena de menor a mayor, y al revés de mayor a menor; 0 deja el orden como está
    // App pide los 20 productos a la API y los guarda en products
    useEffect(() => { // funcion con lo que hay que hacer, mas una lista de dependencias. Ejecutá esto después de pintar, y solo cuando cambie algo de esta lista
        async function cargarProductos() { // define una funcion asincrona que puede esperar resultados lentos. Se declara adentro porque la función que le pasás a useEffect no puede ser async directamente.
            // atrapar el error y apagar “cargando”
            try { // intenta esto
                const res = await fetch('http://localhost:3001/products') // pide los datos a la API y espera la respuesta, obligatorio async para usar await 
                if (!res.ok) throw new Error('No se pudieron cargar los productos') // si la API tira error corta la función y lanza el error 
                const data = await res.json() // si no tira error, lee el cuerpo de la respuesta y lo convierte en datos de JavaScript
                setProducts(data) // guarda la lista en el estado. Es la unica forma correcta de cambiarlo, y avisa a React de que algo se cambio
                setCart((saved) => saved // el carrito guardado puede tener datos viejos, así que se actualiza con lo que dice la API
                    .filter((item) => data.some((product) => product.id === item.id)) // saca los que ya no existen en la API
                    .map((item) => {
                        const product = data.find((product) => product.id === item.id) // el producto actual de la API
                        return { ...product, quantity: Math.min(item.quantity, product.stock) } // precio y stock nuevos; la cantidad no puede pasar del stock
                    })
                    .filter((item) => item.quantity >= 1)) // saca los que quedaron sin stock
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

    function addToCart(product) { // recibe el producto completo que se quiere agregar. La función vive en App porque es la dueña de cart
        if (cart.some((item) => item.id === product.id)) return // some devuelve true si algún elemento de cart cumple la condición. Si el producto ya está, sale sin agregarlo de nuevo
        setCart([...cart, { ...product, quantity: 1 }]) // ...cart desparrama los elementos que ya había; al final va una copia del producto (...product) con quantity: 1, la cantidad con la que entra al carrito. El resultado es un arreglo nuevo, no el mismo modificado
    }

    function changeQuantity(id, change) { // recibe el id del producto y cuánto sumar a su cantidad: 1 para subir, -1 para bajar
        setCart(cart.map((item) => { // map arma un carrito nuevo recorriendo cada producto
            if (item.id !== id) return item // los demás productos quedan igual
            const quantity = item.quantity + change // la cantidad nueva
            if (quantity < 1 || quantity > item.stock) return item // no baja de 1 (para quitarlo está la x) ni sube más del stock que hay
            return { ...item, quantity } // copia del producto con la cantidad nueva
        }))
    }

    function removeFromCart(id) { // recibe el id del producto que se quiere quitar
        setCart(cart.filter((item) => item.id !== id)) // filter se queda con todos los productos menos el que tiene ese id, y eso es el carrito nuevo
    }

    function clearCart() { // vacía el carrito completo
        setCart([]) // el carrito nuevo es un arreglo vacío, y React redibuja todo
    }

    return ( // parentesis para varias lineas
        <div className="app"> {/* el contenedor principal, un solo elemento raíz, la clase app limita el ancho, lo centra y le da relleno */}
            <Header count={cart.length} /> {/* le pasa al Header la cantidad de elementos del arreglo cart. Con [] es 0 */}
            <main className="layout"> {/* la clase layout pone el catálogo y el carrito lado a lado */}
                <section> {/* el catálogo: buscador, mensajes y lista */}
                    <SearchBar search={search} onSearchChange={setSearch}/>
                    <select className="search" value={category} onChange={(e) => setCategory(e.target.value)}> {/* desplegable de categorías; usa el mismo estilo que el buscador. Al elegir una, guarda su valor en category */}
                        <option value="">Todas las categorías</option>
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)} {/* una opción por cada categoría que viene de la API */}
                    </select>
                    <select className="search" value={order} onChange={(e) => setOrder(e.target.value)}> {/* desplegable para ordenar por precio; mismo estilo que el buscador. Al elegir, guarda el valor en order */}
                        <option value="">Ordenar por precio</option>
                        <option value="asc">Menor a mayor</option>
                        <option value="desc">Mayor a menor</option>
                    </select>
                    {loading && <p className="message">Cargando...</p>} {/* evalua de izquierda a derecha y se corta cuando es falso */}
                    {error && <p className="message error">{error}</p>} {/* el error es null (falso) mientras no haya fallo, cuando se guarda el texto con setError, pasa a ser un texto no vacío, que cuenta como verdadero, y aparece el <p> */}
                    {!loading && !error && filterProducts.length === 0 && <p className="message">No se encontraron productos</p> }  {/* Si NO está cargando y NO hay error, pero no hay coincidencias */}
                    {!loading && !error && filterProducts.length > 0 && <ProductList products={sortedProducts} cart={cart} onAdd={addToCart} />} {/* cart: para que cada tarjeta sepa si su producto ya está; onAdd: le pasa la función de agregar */}
                </section>
                <Cart cart={cart} onRemove={removeFromCart} onClear={clearCart} onChangeQuantity={changeQuantity} /> {/* le pasa el carrito para mostrarlo y las funciones para quitar uno, vaciar todo o cambiar la cantidad */}
            </main>
        </div>
    )
}

export default App