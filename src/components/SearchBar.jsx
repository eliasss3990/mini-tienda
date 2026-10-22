function SearchBar({search, onSearchChange}) { 
    //Search: Es una variable de texto (un string) con lo que el usuario tiene escrito en ese momento.
    //onSearchChange: Es la función para avisarle a App que el usuario tocó una tecla.
    return (
    <input
     className="search"
     type="text" 
     placeholder="Buscar producto..." 
     value={search} 
     onChange={(e) => onSearchChange(e.target.value)} 
     //e.target (El Objetivo): Apunta directamente al elemento HTML que disparó el evento. En este caso: la etiqueta <input>.
     //e.target.value (El Texto actual): Es el contenido que tiene la cajita en ese microsegundo.
     />
    );
}
export default SearchBar;