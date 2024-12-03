const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// SELECCIÓN DE LOS ELEMENTOS DEL DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector(".carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector(".carrito-acciones-comprar");
const selectorMoneda = document.querySelector("#selector-moneda"); 

let tasaCambio = 1; // VARIABLE GLOBAL PARA DECLARAR LA TASA DE CAMBIO

// FUNCIÓN PARA OBTENER LAS TASAS DE CAMBIO DE LA API
async function obtenerTasaCambio(moneda) {
    try {
        const response = await fetch(`https://www.floatrates.com/daily/${moneda.toLowerCase()}.json`); 
        if (!response.ok) {
            throw new Error("Error al obtener la tasa de cambio");
        }
        const data = await response.json();
        tasaCambio = data.usd.rate; // CONVIERTE EL VALOR AL CAMBIO USD
        cargarProductosCarrito(); // ACTUALIZA SÓLO EN LOS PRODUCTOS EN EL CARRITO
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

// FUNCIÓN PARA DEFINIR CÓMO SE CARGAN LOS PRODUCTOS AL CARRITO
function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        // LAS DIFERENTES SECCIONES SE AJUSTAN EN CONSECUENCIA 
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

// PARA QUE SE PUEDAN RENDERIZAR LOS PRODUCTOS EN EL CARRITO
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.img}" alt="${producto.nombre}">
                <div class="carrito-producto-titulo">
                    <small>Nombre</small>
                    <h3>${producto.nombre}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-talle">
                    <small>Talle</small>
                    <p>${producto.talle}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>${(producto.precio * tasaCambio).toFixed(2)} ${selectorMoneda.value}</p> 
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>${(producto.precio * producto.cantidad * tasaCambio).toFixed(2)} ${selectorMoneda.value}</p> 
                </div>
                <button class="carrito-producto-eliminar" id="eliminar-${producto.id}-${producto.talle}">
                    <i class="bi bi-trash-fill"></i>
                </button>
            `;
// Y EN CASO DE QUE EXISTAN, SE INSERTA ESE DIV
            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
// CONFIGURACIÓN PARA MOSTRAR EL MENSAJE DE CARRITO VACÍO
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// FUNCIÓN PARA MOSTRAR EL MODAL AL FINALIZAR COMPRA
botonComprar.addEventListener("click", () => {
    const modalContent = `
        <div style="display: flex; justify-content: space-between;">
            <div style="width: 45%;">
                <h3>Ingresa tus datos</h3>
                <form id="formulario-usuario">                    
                    <input type="text" id="nombre" required placeholder= "Nombre">
                    
                    <input type="text" id="apellido" required placeholder= "Apellido">
                    
                    <input type="email" id="email" required placeholder= "Email">
                </form>
            </div>
            <div style="width: 45%;">
                <h3>Detalle del pedido</h3>
                ${productosEnCarrito.map(producto => `
                    <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px;">
                        <p><strong>${producto.nombre}</strong></p>
                        <p>Talle: ${producto.talle} | Cantidad: ${producto.cantidad}</p>
                        <p>Subtotal: ${(producto.precio * producto.cantidad * tasaCambio).toFixed(2)} ${selectorMoneda.value}</p>
                    </div>
                `).join("")}
                <p><strong>Total: ${contenedorTotal.innerText}</strong></p>
            </div>
        </div>
    `;

    Swal.fire({
        html: modalContent,
        confirmButtonText: 'Confirmar compra',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        customClass: {
            popup: 'alerta-fondo',
            confirmButton: 'boton-confirmar',
            cancelButton: 'boton-cancelar',
        },
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const apellido = document.getElementById('apellido').value;
            const email = document.getElementById('email').value;

            if (!nombre || !apellido || !email) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }
            return { nombre, apellido, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, apellido, email } = result.value;
            Swal.fire({
                title: '¡Compra confirmada!',
                text: `¡Muchas gracias por tu compra, ${nombre} ${apellido}! Recibirás las instrucciones de pago en tu correo electrónico ${email}.`,
                icon: 'success',
                footer: "Equipo de Nexus Underground Store",
                customClass: {
                    popup: 'alerta-fondo',
                    confirmButton: 'boton-confirmar',
                }
            });

            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
});

// FUNCIÓN PARA LLAMAR O DECLARAR EL BOTÓN DE ELIMINAR Y CÓMO SE COMPORTARÁ
function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// FUNCIÓN PARA ELIMINAR EL PRODUCTO DEL CARRITO
function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id.replace("eliminar-", "");
    const [id, talle] = idBoton.split("-"); // EXTRAER ID Y TALLE

    const index = productosEnCarrito.findIndex(
        producto => producto.id === parseInt(id) && producto.talle === talle
    );

    Toastify({
        text: "Producto eliminado del carrito",
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

// CON ESTO SE ELIMINA EL PRODUCTO DEL ARRAY
    productosEnCarrito.splice(index, 1);

// Y DESDE ACÁ SE ACTUALIZA EN EL LOCALSTORAGE
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

// RECARGAR EL CARRITO LUEGO DE ESO
    cargarProductosCarrito();
}

// FUNCIÓN PARA VACIAR EL CARRITO
botonVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se borrarán <strong>${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)}</strong> producto/s.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        customClass: {
            popup: 'alerta-fondo',
            confirmButton: 'boton-confirmar',
            cancelButton: 'boton-cancelar'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
// SE ACTUALIZA (SE VACÍA) EL LOCAL STORAGE LUEGO DE CONFIRMAR
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();

            Swal.fire({
                title: 'Tu carrito está vacío',
                icon: 'success',
                timer: 2500,
                showConfirmButton: false,
                customClass: {
                    popup: 'alerta-exito'
                }
            });
        }
    });
}

// FUNCIÓN PARA ACTUALIZAR EL MONTO TOTAL DEL CARRITO
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad * tasaCambio), 0);
    contenedorTotal.innerText = `${totalCalculado.toFixed(2)} ${selectorMoneda.value}`; // ACTUALIZA EL TOTAL SEGÚN LA TASA DE CAMBIO
}

// SE ACTUALIZA EL CARRITO
cargarProductosCarrito();
