// Clase para los productos
class Producto {
    constructor(nombre, precio, talle) {
        this.nombre = nombre;
        this.precio = precio;
        this.talle = talle;
        this.disponible = true;
    }

    marcarComoNoDisponible() {
        this.disponible = false;
    }

    marcarComoDisponible() {
        this.disponible = true;
    }
}

// Array para los productos disponibles
let productos = [
    new Producto("Camiseta", 1500, "L"),
    new Producto("Zapatillas casuales", 4000, "40"),
    new Producto("Gorra de visera", 1000, "Ajustable"),
    new Producto("Campera de abrigo", 3500, "M"),
    new Producto("Buzo estampado", 2500, "M")
];

// Array para el carrito de compras
const carrito = [];
let total = 0;

// Función para resetear el carrito
const resetearCarrito = () => {
    carrito.length = 0;
    total = 0;
    productos.forEach(producto => producto.marcarComoDisponible());
    alert("Tu carrito ha sido reseteado.");
    verProductos();
};

// NUEVA FUNCIÓN PARA RESETEAR FILTROS Y MOSTRAR PRODUCTOS SIN FILTRO
const resetearFiltros = () => {
    alert("Los filtros han sido reseteados. Mostrando todos los productos disponibles.");
    verProductos();
};

// FUNCIÓN PARA MOSTRAR EL MENÚ INICIAL
const mostrarMenu = () => {
    let opcion = "";

    do {
        opcion = prompt(
            `Selecciona una opción:

    1. Ver productos disponibles.
    2. Aplicar filtros.
    3. Salir del simulador`
        );

        switch (opcion) {
            case "1":
                verProductos();
                break;
            case "2":
                mostrarFiltros();
                break;
            case "3":
                alert("Gracias por visitar Nexus Second Hand. ¡Hasta la próxima!");
                break;
            default:
                alert("Opción inválida. Por favor, ingresa otro valor.");
        }
    } while (opcion !== "3");
};

// FUNCIÓN PARA MOSTRAR LOS PRODUCTOS DISPONIBLES
const verProductos = () => {
    let mensaje = "Productos disponibles:\n\n";

    productos.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - $${producto.precio} - Talle: ${producto.talle} (${producto.disponible ? "Disponible" : "No disponible"})\n`;
    });

    mensaje += `${productos.length + 1}. Ir al carrito\n`;

    let seleccion = parseInt(prompt(mensaje + "\nIngresa el número del producto que deseas agregar:")) - 1;

    if (seleccion === productos.length) {
        mostrarCarrito();
        return;
    }

    if (seleccion >= 0 && seleccion < productos.length && productos[seleccion].disponible) {
        productos[seleccion].marcarComoNoDisponible();
        carrito.push(productos[seleccion]);
        total += productos[seleccion].precio;

        alert(`${productos[seleccion].nombre} se ha agregado al carrito.`);

        let seguirComprando = prompt("¿Deseas agregar otro producto? (si/no)").toLowerCase();

        if (seguirComprando === "si") {
            verProductos();
        } else if (seguirComprando === "no") {
            mostrarCarrito();
        } else {
            alert("Opción inválida, regresando a productos.");
            verProductos();
        }

    } else if (seleccion >= 0 && seleccion < productos.length && !productos[seleccion].disponible) {
        alert("Lo sentimos, el producto que seleccionaste ya no está disponible.");
        verProductos();
    } else {
        alert("Opción inválida, por favor intenta nuevamente.");
        verProductos();
    }
};

// FUNCIÓN PARA MOSTRAR PRODUCTOS FILTRADOS E INTERACTUAR CON ELLOS
const mostrarProductosFiltrados = (productosFiltrados) => {
    if (productosFiltrados.length === 0) {
        alert("No se encontraron productos con ese filtro.");
        verProductos();
        return;
    }

    let mensaje = "Productos filtrados:\n\n";

    productosFiltrados.forEach((producto, index) => {
        mensaje += `${index + 1}. ${producto.nombre} - $${producto.precio} - Talle: ${producto.talle} (${producto.disponible ? "Disponible" : "No disponible"})\n`;
    });

    // OPCIÓN NUEVA PARA RESETEAR FILTROS
    mensaje += `${productosFiltrados.length + 1}. Resetear filtros\n`;

    let seleccion = parseInt(prompt(mensaje + "\nIngresa el número del producto que deseas agregar:")) - 1;

    if (seleccion === productosFiltrados.length) {
        resetearFiltros();
        return;
    }

    if (seleccion >= 0 && seleccion < productosFiltrados.length && productosFiltrados[seleccion].disponible) {
        productosFiltrados[seleccion].marcarComoNoDisponible();
        carrito.push(productosFiltrados[seleccion]);
        total += productosFiltrados[seleccion].precio;

        alert(`${productosFiltrados[seleccion].nombre} se ha agregado al carrito.`);

        let seguirComprando = prompt("¿Deseas agregar otro producto? (si/no)").toLowerCase();

        if (seguirComprando === "si") {
            mostrarProductosFiltrados(productosFiltrados);
        } else if (seguirComprando === "no") {
            mostrarCarrito();
        } else {
            alert("Opción inválida, regresando a productos filtrados.");
            mostrarProductosFiltrados(productosFiltrados);
        }
    } else if (seleccion >= 0 && seleccion < productosFiltrados.length && !productosFiltrados[seleccion].disponible) {
        alert("Lo sentimos, el producto que seleccionaste ya no está disponible.");
        mostrarProductosFiltrados(productosFiltrados);
    } else {
        alert("Opción inválida, por favor intenta nuevamente.");
        mostrarProductosFiltrados(productosFiltrados);
    }
};

// FUNCIÓN PARA MOSTRAR FILTROS Y APLICARLOS
const mostrarFiltros = () => {
    let opcionFiltro = prompt(
        `Selecciona un filtro:
    1. Ordenar por precio (Menor a Mayor)
    2. Ordenar por precio (Mayor a Menor)
    3. Filtrar por rango de precio
    4. Filtrar por categoría`
    );

    let productosFiltrados;

    switch (opcionFiltro) {
        case "1":
            productosFiltrados = filtrarPrecioAscendente();
            break;
        case "2":
            productosFiltrados = filtrarPrecioDescendente();
            break;
        case "3":
            let min = parseInt(prompt("Ingresa el precio mínimo:"));
            let max = parseInt(prompt("Ingresa el precio máximo:"));
            productosFiltrados = filtrarPorRangoDePrecio(min, max);
            break;
        case "4":
            let categoria = prompt("Ingresa la categoría (Indumentaria, Calzado, Accesorios):");
            productosFiltrados = filtrarPorCategoria(categoria);
            break;
        default:
            alert("Opción inválida. Intenta nuevamente.");
            mostrarFiltros();
            return;
    }

    mostrarProductosFiltrados(productosFiltrados);
};

// Funciones de filtro
const filtrarPrecioAscendente = () => productos.slice().sort((a, b) => a.precio - b.precio);
const filtrarPrecioDescendente = () => productos.slice().sort((a, b) => b.precio - a.precio);
const filtrarPorRangoDePrecio = (min, max) => productos.filter(producto => producto.precio >= min && producto.precio <= max);
const filtrarPorCategoria = (categoria) => productos.filter(producto => producto.categoria?.toLowerCase() === categoria.toLowerCase());

mostrarMenu();
