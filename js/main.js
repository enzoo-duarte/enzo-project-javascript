let productos = [];
let tasaCambio = 1; // VARIABLE GLOBAL PARA DECLARAR LA TASA DE CAMBIO

// FUNCIÓN PARA LLAMAR LOS PRODUCTOS DESDE EL ARCHIVO JSON
async function obtenerProductos() {
    try {
        const response = await fetch("./data/productos.json");
        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        productos = data;
        cargarProductos(productos);
    } catch (error) {
        console.error(error);
        alert("Error al cargar los productos. Por favor, inténtalo más tarde.");
    }
}

// LLAMADO A LA FUNCIÓN LUEGO DE LA COMPROBACIÓN DEL FETCH, PARA TRAER LOS PRODUCTOS AL INICIALIZAR
obtenerProductos();

// SELECCIÓN DE LOS ELEMENTOS DEL DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const contador = document.querySelector(".contador");
const selectorMoneda = document.querySelector("#selector-moneda");

// FUNCIÓN PARA OBTENER LAS TASAS DE CAMBIO DE LA API
async function obtenerTasaCambio(moneda) {
    try {
        const response = await fetch(`https://www.floatrates.com/daily/${moneda.toLowerCase()}.json`); 
        if (!response.ok) {
            throw new Error("Error al obtener la tasa de cambio");
        }
        const data = await response.json();
        tasaCambio = data.usd.rate; // CONVIERTE EL VALOR AL CAMBIO USD
        cargarProductos(productos); 
    } catch (error) {
        console.error(error);
        alert("Error al obtener la tasa de cambio. Por favor, inténtalo más tarde.");
    }
}

// FUNCIÓN PARA OBTENER LA MONEDA AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    const monedaGuardada = localStorage.getItem("monedaSeleccionada"); // LEE LA MONEDA DEL LOCALSTORAGE
    if (monedaGuardada) {
        selectorMoneda.value = monedaGuardada; // ASIGNA LA MONEDA SELECCIONADA
        if (monedaGuardada !== "USD") {
            obtenerTasaCambio(monedaGuardada); // OBTIENE LA TASA DE CAMBIO SI NO ES USD
        }
    }
});

// EVENTO PARA GUARDAR LA MONEDA SELECCIONADA EN EL LOCALSTORAGE
selectorMoneda.addEventListener("change", (e) => {
    const monedaSeleccionada = e.target.value;
    localStorage.setItem("monedaSeleccionada", monedaSeleccionada); // GUARDA LA MONEDA SELECCIONADA
    if (monedaSeleccionada === "USD") {
        tasaCambio = 1; // RESTABLECE A USD
        cargarProductos(productos); // MUESTRA LOS PRODUCTOS
    } else {
        obtenerTasaCambio(monedaSeleccionada); // OBTIENE LA TASA PARA OTRA MONEDA
    }
});

// FUNCIÓN PARA TRAER LOS DIVS DE LOS PRODUCTOS AL DOM
function cargarProductos(productosSeleccionados) {
    contenedorProductos.innerHTML = ""; 

    productosSeleccionados.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.img}" alt="${producto.nombre}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-precio">${(producto.precio * tasaCambio).toFixed(2)} ${selectorMoneda.value}</p> 
                <div class="producto-talle">
                    <label for="select-talle-${producto.id}" class="producto-talle-label">Talle:</label>
                    <select class="producto-select-talle" id="select-talle-${producto.id}">
                        <option value="" disabled selected hidden></option>
                        ${producto.talle.map(talle => `<option value="${talle}">${talle}</option>`).join("")}
                    </select>
                </div>
                <p class="error-talle" id="error-talle-${producto.id}" style="color: red; display: none;">Debes seleccionar un talle.</p>
                <button class="producto-agregar" id="boton-agregar-${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();
}

// MÉTODO DE FILTRADO POR CATEGORÍAS USANDO LA CLASE ACTIVE DE LOS BOTONES
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
            const productosFiltrados = productos.filter(producto => producto.categoria === e.currentTarget.id);
            tituloPrincipal.innerText = e.currentTarget.textContent.trim();
            cargarProductos(productosFiltrados);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// FUNCIÓN PARA ACTUALIZAR EL CARRITO AL APRETAR LOS BOTONES "AGREGAR"
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// LLAMAR LOS PRODUCTOS AL CARRITO DESDE EL LOCALSTORAGE
let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
// ACTUALIZAR EL NÚMERO DEL CONTADOR SI SE AGREGARON PRODUCTOS AL CARRITO
if (productosEnCarrito.length > 0) {
    actualizarContador();
}

// FUNCIÓN PARA AGREGAR LOS PRODUCTOS AL CARRITO
function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id.replace("boton-agregar-", ""); 
    const productoAgregado = productos.find(producto => producto.id === parseInt(idBoton));

// PARA QUE SE VALIDE EL TALLE SELECCIONADO
    const selectorTalle = document.querySelector(`#select-talle-${productoAgregado.id}`);
    const errorTalle = document.querySelector(`#error-talle-${productoAgregado.id}`);

    if (!selectorTalle.value) {
// SE MUESTRA EL MENSAJE DE ERROR SI NO SE ELIGIÓ UN TALLE DEL DROPDOWN
        errorTalle.style.display = "block";
        setTimeout(() => {
            errorTalle.style.display = "none";
        }, 2500);

        return; 
    }

// PARA AGREGAR EL PRODUCTO CON EL TALLE SELECCIONADO
    const productoConTalle = { ...productoAgregado, talle: selectorTalle.value };

    if (productosEnCarrito.some(producto => producto.id === productoConTalle.id && producto.talle === productoConTalle.talle)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === productoConTalle.id && producto.talle === productoConTalle.talle);
        productosEnCarrito[index].cantidad++;
    } else {
        productoConTalle.cantidad = 1;
        productosEnCarrito.push(productoConTalle);
    }

    Toastify({
        text: "Producto agregado al carrito",
        duration: 2500,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #231f20, #5f565b)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".8rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
    }).showToast();

    actualizarContador(); 
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito)); // Y LO GUARDA EN LOCALSTORAGE
}

// FUNCIÓN PARA ACTUALIZAR EL CONTADOR DEL CARRITO MISMO
function actualizarContador() {
    const nuevoContador = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    contador.innerText = nuevoContador;
}
