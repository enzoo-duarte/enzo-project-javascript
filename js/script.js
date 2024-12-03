// Clase para los productos
class Producto {
    constructor(nombre, precio, talle, categoria, id, img) {
        this.nombre = nombre;
        this.precio = precio;
        this.talle = talle;
        this.categoria = categoria;
        this.id = id;
        this.img = img;
        this.cantidad = 1;
    }
}

// Array para los productos disponibles con categorías
const stockProductos = [
    new Producto("Camiseta", 1500, "L", "Indumentaria", 1, "https://via.placeholder.com/150"),
    new Producto("Zapatillas", 4000, "40", "Calzado", 2, "https://via.placeholder.com/150"),
    new Producto("Gorra", 1000, "Ajustable", "Accesorios", 3, "https://via.placeholder.com/150"),
    new Producto("Campera de abrigo", 3500, "M", "Indumentaria", 4, "https://via.placeholder.com/150"),
    new Producto("Buzo estampado", 2500, "M", "Indumentaria", 5, "https://via.placeholder.com/150"),
];

// Carrito de compras
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarrito = document.getElementById("total-carrito");

// Función para mostrar una notificación
const mostrarNotificacion = (mensaje) => {
    const notificacion = document.createElement("div");
    notificacion.classList.add("notificacion");
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 2000);
};

// Renderizar productos en el DOM
const renderizarProductos = (array) => {
    contenedorProductos.innerHTML = "";

    array.forEach((prd) => {
        const div = document.createElement("div");
        div.classList.add("producto", "card", "m-2");
        div.style.width = "18rem";
        div.innerHTML = `
            <img src="${prd.img}" class="card-img-top" alt="${prd.nombre}">
            <div class="card-body">
                <h5 class="card-title">${prd.nombre}</h5>
                <p class="card-text">Talle ${prd.talle}</p>
                <p class="card-text">$${prd.precio}</p>
                <button id="agregar${prd.id}" class="btn btn-primary">Comprar</button>
            </div>
        `;
        contenedorProductos.appendChild(div);

        const boton = document.getElementById(`agregar${prd.id}`);
        boton.addEventListener("click", () => agregarAlCarrito(prd));
    });
};

// Función para agregar productos al carrito ========> PENDIENTE: DEFINIR QUE QUEDE EN STOCK 0 LUEGO DE AGREGADO, MOSTRAR "ESTE PRODUCTO YA NO ESTÁ DISPONIBLE"
const agregarAlCarrito = (producto) => {
    const prodExistente = carrito.find((prod) => prod.id === producto.id);

    if (prodExistente) {
        prodExistente.cantidad++;
    } else {
        carrito.push({ ...producto });
    }
    mostrarNotificacion(`${producto.nombre} se ha agregado al carrito`);
    actualizarCarrito();
};

// Actualizar carrito en el DOM
const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <h5>${producto.nombre}</h5>
            <p>Precio: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button onclick="eliminarDelCarrito(${producto.id})" class="btn btn-danger">Eliminar</button>
        `;
        contenedorCarrito.appendChild(div);
    });
    totalCarrito.textContent = `Total: $${carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)}`;
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Eliminar producto del carrito
const eliminarDelCarrito = (id) => {
    const index = carrito.findIndex((prod) => prod.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
        actualizarCarrito();
    }
};

// Resetear carrito
document.getElementById("resetear-carrito").addEventListener("click", () => {
    carrito.length = 0;
    actualizarCarrito();
});

// Filtrar productos por categoría desde el navbar
const filtrarPorCategoria = (categoria) => {
    if (categoria === "Todo") {
        renderizarProductos(stockProductos);
    } else {
        const productosFiltrados = stockProductos.filter((prod) => prod.categoria === categoria);
        renderizarProductos(productosFiltrados);
    }
};

// Enlaces de navegación para filtrar productos
document.getElementById("nav-todos").addEventListener("click", (e) => {
    e.preventDefault();
    filtrarPorCategoria("Todo");
});
document.getElementById("nav-indumentaria").addEventListener("click", (e) => {
    e.preventDefault();
    filtrarPorCategoria("Indumentaria");
});
document.getElementById("nav-calzado").addEventListener("click", (e) => {
    e.preventDefault();
    filtrarPorCategoria("Calzado");
});
document.getElementById("nav-accesorios").addEventListener("click", (e) => {
    e.preventDefault();
    filtrarPorCategoria("Accesorios");
});

// Inicializar
renderizarProductos(stockProductos);
actualizarCarrito();

