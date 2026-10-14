# Mini Tienda

Van a construir una **tienda online sencilla en React** que muestra productos traídos de una API, permite buscarlos y armar un carrito. Es lo mismo que se hace en proyectos reales, pero en versión mini.

---

## 1. Qué van a practicar

- Componentes y props
- `useState` y `useEffect`
- Traer datos de una API con `fetch`
- Mostrar "Cargando..." y mensajes de error
- Mostrar listas de elementos (`.map`)
- Compartir estado entre componentes (el carrito)
- Git y GitHub: ramas y Pull Requests

---

## 2. Preparar el entorno

### Requisitos

- **Node 22 o superior.** Se verifica con `node -v`. Con Node 20.19 también funciona.
- **Git** y una cuenta de GitHub con acceso a este repositorio (se acepta la invitación que llega por correo).

### Paso 1: clonar el repo

```bash
git clone https://github.com/eliasss3990/mini-tienda.git
cd mini-tienda
```

Dentro del repo ya están `ENUNCIADO.md` (este documento), `db.json` y `styles.css`. La app de React se crea **en esta misma carpeta**, al lado de esos archivos.

### Paso 2: levantar la API (terminal 1)

```bash
npx json-server@0.17.4 db.json --port 3001
```

- Si pregunta `Ok to proceed? (y)`, respondan `y`. Es normal: instala json-server la primera vez.
- Puede aparecer un aviso `npm warn deprecated connect-pause`. **Se ignora**, no afecta nada.

**Verificación:** abran `http://localhost:3001/products` en el navegador. Tiene que aparecer un JSON con 20 productos. Prueben también `http://localhost:3001/products?q=ergo`: debe traer solo el mouse. Con una búsqueda sin resultados (`?q=zzz`) la API responde `[]`, no un error.

**Dejen esa terminal abierta** y usen otra para lo siguiente.

### Paso 3: crear la app de React (terminal 2)

Desde la carpeta `mini-tienda` (la raíz del repo). Ojo con el punto `.` del comando: significa "en esta carpeta".

```bash
npm create vite@latest . -- --template react
```

Si pregunta `Ok to proceed? (y)`, respondan `y`. Después hace tres preguntas (se navega con las flechas y se confirma con Enter):

- **Current directory is not empty** → elijan `Ignore files and continue`. **Nunca elijan `Remove existing files and continue`**: borra `db.json` y `styles.css`.
- **Which linter to use?** → elijan `ESLint` (viene marcada `Oxlint`; hay que cambiarla).
- **Install with npm and start now?** → elijan `No` (viene marcada `Yes`; hay que cambiarla).

> Estas preguntas salieron con `create-vite` 9.2.1. Si en su máquina aparecen otras, avisen antes de seguir.

Vite crea acá `README.md`, `package.json`, `index.html` y la carpeta `src/`, entre otros. Ese `README.md` es el de ejemplo de Vite, y es el que ustedes reemplazan al final con el suyo.

Instalen e inicien:

```bash
npm install
npm run dev
```

**Verificación:** la terminal muestra una dirección, normalmente `http://localhost:5173/`. Ábranla: tiene que verse la pantalla de ejemplo de Vite ("Get started" y un contador).

> **Atención:** todos los comandos de este documento se corren parados en la carpeta indicada. Si un comando falla con "No such file or directory", casi siempre es porque se está en otra carpeta. Pueden comprobarlo con `pwd`.

### Paso 4: poner los estilos y dejar la app en blanco

Estando en la raíz del repo:

```bash
cp styles.css src/styles.css
echo "" > src/App.css
rm src/index.css
```

Después:

1. Abran `src/main.jsx` y cambien la línea `import './index.css'` por `import './styles.css'`. **Tiene que quedar exactamente así**, con `./styles.css` (no con una ruta que salga de `src`).
2. Reemplacen **todo** el contenido de `src/App.jsx` por:

```jsx
function App() {
  return <h1>Mini Tienda</h1>
}

export default App
```

**Verificación:** el navegador (con `npm run dev` corriendo) muestra solo el título "Mini Tienda" sobre un fondo gris claro, sin logos ni botones de Vite. Si siguen viendo la pantalla de Vite, revisen que `App.jsx` esté reemplazado.

Las imágenes de `src/assets/` quedan sin usar; pueden borrarlas.

---

## 3. La API

**Base URL:** `http://localhost:3001`

| Método | Endpoint | Para qué sirve |
| --- | --- | --- |
| GET | `/products` | Trae todos los productos |
| GET | `/products?q=texto` | Busca productos por texto |

Ejemplo:

```js
const res = await fetch("http://localhost:3001/products");
if (!res.ok) throw new Error("No se pudieron cargar los productos");
const products = await res.json();
```

> `fetch` **no** da error cuando el servidor responde 404 o 500, por eso se revisa `res.ok`. Si la API está apagada, `fetch` sí falla, y ahí hay que mostrar el mensaje de error.

### Cómo es un producto

```json
{
  "id": 1,
  "title": "Auriculares Bluetooth Sonic X",
  "description": "Auriculares inalámbricos con cancelación de ruido...",
  "price": 189000,
  "category": "tecnologia",
  "brand": "Sonic",
  "stock": 25,
  "rating": 4.5,
  "thumbnail": "https://picsum.photos/seed/tienda1/400/300"
}
```

Para el proyecto básico necesitan solo: `id`, `title`, `price` y `thumbnail`. El precio está en **guaraníes**. Las imágenes se cargan desde internet: sin conexión no se ven.

---

## 4. Cómo debe verse y comportarse

La pantalla tiene, de arriba hacia abajo:

| Zona | Qué muestra |
|---|---|
| Encabezado | `Mini Tienda` a la izquierda y `Carrito (2)` a la derecha (la cantidad de productos del carrito) |
| Buscador | Un campo de texto con el texto de ayuda `Buscar producto...` |
| Productos | Tarjetas en una grilla. Si no entran, pasan a la fila de abajo |
| Carrito | Un panel al costado de los productos (debajo, en pantallas angostas) |

Cada tarjeta de producto muestra:

| Elemento | Ejemplo |
|---|---|
| Foto | la imagen del producto |
| Título | Auriculares Bluetooth Sonic X |
| Precio | Gs. 189.000 |
| Botón | Agregar |

El carrito, con dos productos agregados, se ve así:

| Producto | Precio | Quitar |
|---|---|---|
| Mouse Inalámbrico Ergo | Gs. 95.000 | [x] |
| Termo de Acero Inoxidable 1L | Gs. 145.000 | [x] |
| **TOTAL** | **Gs. 240.000** | |

### Lo que tiene que hacer la app

1. Al abrir, muestra **"Cargando..."** y después los productos.
2. Si la API falla, muestra un **mensaje de error**.
3. El buscador filtra los productos mientras se escribe. Se filtra la lista que ya se descargó (con `.filter()` sobre el texto escrito), sin volver a llamar a la API.
4. Si no hay resultados, muestra **"No se encontraron productos"**.
5. El botón **Agregar** mete el producto en el carrito. Si ya está en el carrito, el botón dice **"En el carrito"** y no se agrega de nuevo.
6. En el carrito, el botón **[x]** quita el producto.
7. El carrito muestra el **total** y el encabezado muestra cuántos productos hay.
8. Los precios se ven con puntos: `189.000` (pista: `toLocaleString("es-PY")`).

### Cómo guardar el carrito

Es una lista (array) en `useState`. Cada elemento es el producto completo:

```js
const [cart, setCart] = useState([]);
```

---

## 5. Componentes

Dentro de `src/` se crea una carpeta `components/` con un archivo por componente:

| Archivo | Qué hace |
|---|---|
| `src/components/Header.jsx` | Título y contador del carrito |
| `src/components/SearchBar.jsx` | Input de búsqueda |
| `src/components/ProductList.jsx` | Recorre los productos |
| `src/components/ProductCard.jsx` | Muestra un producto |
| `src/components/Cart.jsx` | Lista del carrito y total |
| `src/App.jsx` | Acá viven los estados (productos, búsqueda, carrito) |
| `src/main.jsx` | Ya existe; solo se cambia el import de estilos (sección 2, paso 4) |

Regla simple: **los estados viven en `App`** y se pasan a los demás componentes por props.

---

## 6. El diseño ya viene hecho

El archivo `styles.css` de este repo trae todos los estilos. **No hace falta escribir CSS ni cambiarlo**: el diseño no es parte de lo que se evalúa. Lo suyo es la lógica. Ya lo copiaron en el paso 4 de la sección 2.

**Estructura de cada componente.** Usen estos nombres de clase tal cual; en React la clase se escribe `className`:

```jsx
// App: todo el contenido va dentro de un div "app", y el catálogo y el carrito dentro de "layout"
<div className="app">
  <Header />
  <main className="layout">
    <section>
      <SearchBar />
      {/* mensajes o lista de productos */}
    </section>
    <Cart />
  </main>
</div>

// Header
<header className="header">
  <h1>Mini Tienda</h1>
  <span className="cart-count">Carrito (2)</span>
</header>

// SearchBar
<input className="search" type="text" placeholder="Buscar producto..." />

// Mensajes (cargando, error, sin resultados, carrito vacío)
<p className="message">Cargando...</p>
<p className="message error">No se pudieron cargar los productos</p>

// ProductList
<div className="grid">{/* una ProductCard por producto */}</div>

// ProductCard
<div className="card">
  <img src="..." alt="..." />
  <h3 className="card-title">Título</h3>
  <p className="card-price">Gs. 189.000</p>
  <button className="btn">Agregar</button>
  {/* si ya está en el carrito: className="btn btn-added" y texto "En el carrito" */}
</div>

// Cart
<section className="cart">
  <h2>Carrito</h2>
  <ul className="cart-list">
    <li className="cart-item">
      <span>Título</span>
      <span>Gs. 95.000</span>
      <button className="btn-remove">x</button>
    </li>
  </ul>
  <p className="cart-total">TOTAL: Gs. 240.000</p>
</section>
```

> Los textos de ejemplo van fijos para mostrar la forma. En su código esos valores salen de los datos con `{product.title}`, `{product.price}`, etc.

---

## 7. Plan por fases

Se avanza fase por fase. Una fase se da por terminada cuando se cumple su objetivo, no cuando pasa cierto tiempo.

### Fase 1: Mostrar productos

**Objetivo:** la app muestra los productos que vienen de la API.

- [ ] Clonar el repo, levantar la API y crear la app con Vite (sección 2)
- [ ] Crear `ProductCard` y `ProductList` con 3 productos escritos a mano
- [ ] Reemplazar esos datos por `fetch` + `useEffect`
- [ ] Mostrar "Cargando..." y el mensaje de error
- [ ] Subir lo hecho con una rama y un Pull Request (sección 8)

### Fase 2: Buscar y comprar

**Objetivo:** se puede buscar un producto y armar un carrito.

- [ ] Crear `SearchBar` y filtrar los productos
- [ ] Crear el estado del carrito en `App`
- [ ] Botón **Agregar** y botón **[x]** para quitar
- [ ] Crear `Cart` y `Header` con el contador

### Fase 3: Terminar y presentar

**Objetivo:** la app funciona completa y cada uno puede explicar su código.

- [ ] Calcular y mostrar el total
- [ ] Formatear los precios
- [ ] Revisar que todo funcione junto (probar casos raros: buscar algo que no existe, apagar la API, agregar y quitar varias veces)
- [ ] Escribir su README con capturas
- [ ] Preparar la mini demo

---

## 8. Git: cómo entregan su trabajo

**No se puede subir directo a `main`.** Todo entra por un Pull Request (PR) que revisa Elias. Si intentan un `git push` a `main`, GitHub lo rechaza con un error `protected branch`: es lo esperado, no es una falla.

Cada uno trabaja en su **propia rama**, con un nombre que diga quién y qué: `ana/catalogo`, `luis/carrito`.

> El primero en subir incluye el proyecto de Vite completo (`package.json`, `package-lock.json`, `index.html`, `src/`, etc.). Sin `package-lock.json` las verificaciones automáticas fallan. `git add .` ya lo incluye, y `node_modules` queda afuera por el `.gitignore`. El segundo, antes de crear su rama, hace `git pull` en `main` para traer esa base en vez de crear otra.

```bash
# 1. Crear su rama (estando en la raíz del repo)
git checkout -b ana/catalogo

# 2. Trabajar. Cada tanto, guardar con commits chicos y claros
git status                      # revisar qué archivos cambiaron
git add .
git commit -m "agrega ProductCard"

# 3. Subir la rama a GitHub
git push -u origin ana/catalogo
```

1. En GitHub aparece un botón **Compare & pull request**. Lo abren, escriben qué hicieron y crean el PR.
2. GitHub corre unas verificaciones automáticas (`lint` y `build`). Tienen que salir en verde.
3. Elias revisa y puede dejar preguntas o pedir cambios. Respondan y suban los cambios con otro `git push` en la misma rama.
4. Con la aprobación, se hace **Merge**. Después, para seguir:

```bash
git checkout main
git pull
git checkout -b ana/buscador      # nueva rama para lo siguiente
```

Reglas:

- **Commits chicos y frecuentes** con mensajes claros (ejemplo: `agrega buscador`).
- **Una rama por funcionalidad.** No acumulen todo el trabajo en una sola.
- **No suban `node_modules`.** El proyecto de Vite ya trae un `.gitignore` que lo evita.
- **Reparto sugerido:** uno hace catálogo y buscador, el otro el carrito. Después los unen en `App`. Si los dos tocan `App.jsx`, puede aparecer un conflicto al hacer merge: pidan ayuda, es parte del aprendizaje.
- **Sobre la IA:** pueden usarla para entender, no para copiar sin leer. **Si no pueden explicar una línea, no la entreguen.**
- **Ante un error:** lean el mensaje de la consola, prueben con `console.log`, y después pregunten. Preguntar está bien.

---

## 9. Extras (solo si terminan lo obligatorio)

Del más fácil al más difícil:

- [ ] Mostrar el `rating` o la `brand` en cada tarjeta
- [ ] Marcar como **Agotado** los productos con `stock: 0` y bloquear el botón
- [ ] Botón para vaciar el carrito
- [ ] Filtro por categoría (usando el campo `category`)
- [ ] Cantidades en el carrito (`+` y `-`)
- [ ] Guardar el carrito en `localStorage`
- [ ] Ordenar por precio

---

## 10. Entregables

1. Sus Pull Requests aprobados y mergeados en este repositorio
2. `README.md` propio con descripción, capturas y cómo correrla (reemplaza el que genera Vite)
3. Mini demo de 5 minutos: mostrar la app y explicar **una parte del código**

---

## 11. Lista final de control

- [ ] Los productos vienen de la API (no escritos a mano)
- [ ] Se ve "Cargando..." y el error si falla
- [ ] El buscador funciona
- [ ] Se puede agregar y quitar del carrito
- [ ] El total es correcto
- [ ] El código está dividido en componentes
- [ ] El repo tiene commits y PRs de cada uno
- [ ] La app corre en local siguiendo su propio README

¡Éxitos!
