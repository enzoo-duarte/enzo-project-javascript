// Clases para los productos
class Producto {
    constructor(nombre, precio, talle) {
        this.nombre = nombre
        this.precio = precio
        this.talle = talle
        this.disponible = true // Indicador de disponibilidad
    }
}

// Array para los productos disponibles
let productos = [
    new Producto("Camiseta", 1500, "L"),
    new Producto("Zapatillas casuales", 4000, "40"),
    new Producto("Gorra de visera", 1000, "Ajustable"),
    new Producto("Campera de abrigo", 3500, "M"),
    new Producto("Buzo estampado", 2500, "M")
]

// Array para el carrito de compras
const carrito = []

// Variable para acumular el total
let total = 0

// Función para resetear el carrito
const resetearCarrito = () => {
    carrito.length = 0 // Para vaciar el carrito
    total = 0 // Esto resetea el monto total a 0
    // Para poner todos los productos como "Disponible" de nuevo
    for (let i = 0; i < productos.length; i++) {
        productos[i].disponible = true
    }
    alert("Tu carrito ha sido reseteado.")
    verProductos() // Para volver a "Productos disponibles"
}

// Función para mostrar el menú inicial
const mostrarMenu = () => {
    let opcion = ""

    do {
        opcion = prompt(
            `Selecciona una opción:

    1. Ver productos disponibles.
    2. Salir del simulador`
        )

        switch (opcion) {
            case "1":
                verProductos()
                break
            case "2":
                alert("Gracias por visitar Nexus Second Hand. ¡Hasta la próxima!")
                break
            default:
                alert("Opción inválida. Por favor, ingresa otro valor.")
        }
    } while (opcion !== "2")
}

// Función para "Productos disponibles"
const verProductos = () => {
    let mensaje = "Productos disponibles: \n\n"

    // Para mostrar todos los productos y si está Disponible o No disponible 
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].disponible) {
            mensaje += `${i + 1}. ${productos[i].nombre} - $${productos[i].precio} - Talle: ${productos[i].talle} (Disponible)\n`
        } else {
            mensaje += `${i + 1}. ${productos[i].nombre} - $${productos[i].precio} - Talle: ${productos[i].talle} (No disponible)\n`
        }
    }

    // Opción para ir al carrito
    mensaje += `${productos.length + 1}. Ir al carrito \n`

    // Prompt para ingresar el número de la opción elegida
    let seleccion = parseInt(prompt(mensaje + "\nIngresa el número del producto que deseas agregar: ")) - 1

    // Verificar si ingresó la opción de "Ir al carrito" y mostrar los productos del carrito o si está vacío
    if (seleccion === productos.length) {
        mostrarCarrito()
        return
    } 

    // Verificar si el producto está disponible
    if (seleccion >= 0 && seleccion < productos.length && productos[seleccion].disponible) {
        // Para dejar el producto como No disponible antes de ir al carrito
        productos[seleccion].disponible = false

        // Para agregar el producto al carrito
        carrito.push(productos[seleccion])

        // Para sumar/acumular el precio al Total
        total += productos[seleccion].precio

        alert(`${productos[seleccion].nombre} se ha agregado al carrito.`)

        // Para preguntar si desea agregar más productos
        let seguirComprando

        do {
            seguirComprando = prompt("¿Deseas agregar otro producto? (si/no)").toLowerCase()

            if (seguirComprando !== "si" && seguirComprando !== "no") {
                alert("Opción inválida, por favor ingresa 'si' o 'no'.")
            }
                
        } while (seguirComprando !== "si" && seguirComprando !== "no")

        // Para que cuando elige "si" lo regrese a "Productos disponibles" ya mostrando si está Disponible o No disponible
        if (seguirComprando === "si") {
            verProductos()
        } else {
            mostrarCarrito() // Para que cuando elige "no" vaya al prompt del carrito y ya pregunte para confirmar compra
        }

    } else if (seleccion >= 0 && seleccion < productos.length && !productos[seleccion].disponible) {
        // Alert si el producto no está disponible
        alert("Lo sentimos, el producto que seleccionaste ya no está disponible.")
        verProductos() // Para volver a "Produtos disponibles"
    } else {
        // Alert si ingresa un valor incorrecto
        alert("Opción inválida, por favor intenta nuevamente.")
        verProductos() // Para que vuelta a "Productos disponibles"
    }
}

// Función para mostrar el carrito actual
const mostrarCarrito = () => {
    let mensajeCarrito = "Productos en tu carrito: \n\n"

    if (carrito.length === 0) {
        // Alert con el mensaje de carrito vacío 
        alert("Tu carrito está vacío.")
        verProductos() // Para enseguida volver regresar a "Productos disponibles"
    } else {
        for (let i = 0; i < carrito.length; i++) {
            mensajeCarrito += `${i + 1}. ${carrito[i].nombre}\n • $${carrito[i].precio}\n • Talle: ${carrito[i].talle}\n` // Lo que muestra el producto elegido
        }
        // Mostrar la lista de los productos que fueron agregados al carrito y el monto total de la compra
        mensajeCarrito += `\nTotal a pagar: $${total}\n`

        // Prompt para confirmar la compra
        let confirmacion

        do {
            confirmacion = prompt(`${mensajeCarrito}\n¿Deseas confirmar tu compra o resetear el carrito? (si/no/resetear)`).toLowerCase()

            // Para que si el valor ingresado no es válido, muestre el alert de inválido y vuelva al prompt para confirmar
            if (confirmacion !== "si" && confirmacion !== "no" && confirmacion !== "resetear") {
                alert("Opción inválida, por favor ingrese 'si', 'no' o 'resetear'.")
            }

        } while (confirmacion !== "si" && confirmacion !== "no" && confirmacion !== "resetear")

        // Lo que pasa luego de la confirmación
        if (confirmacion === "si") {
            seleccionarMetodoPago()
        } else if (confirmacion === "resetear") {
            resetearCarrito() // Acá llama a la función para resetear el carrito
        } else {
            verProductos() // Para volver a "Productos disponibles"
        }
    }
}

// Función para elegir el método de pago
const seleccionarMetodoPago = () => {
    let metodoPago

    do {
        metodoPago = prompt(
            `Selecciona tu método de pago:
    1. Transferencia
    2. MercadoPago
    3. Redes de Cobranza
    4. Volver`
        ).toLowerCase()

        // Condición por si elige la opción para Volver
        if (metodoPago === "4" || metodoPago === "volver") {
            mostrarCarrito() // Volver a la pantalla de confirmación de compra
            return
        }

        // Validar el método de pago que se eligió
        switch (metodoPago) {
            case "1":
            case "3":
                // Alert para las opciones de Transferencia y Redes de Cobranza
                alert("Un representante se pondrá en contacto contigo para que puedas finalizar tu compra.")
                break
            case "2":
                // Alert para la opción MercadoPago
                alert("Serás redirigido a MercadoPago para que puedas finalizar tu compra.")
                break
            default:
                alert("Opción inválida, por favor intenta nuevamente.")
        }

    } while (metodoPago !== "1" && metodoPago !== "2" && metodoPago !== "3")

    // Mensaje de agradecimiento final
    alert("¡Gracias por tu compra! Equipo de Nexus Second Hand.")
    total = 0 // Esto resetea el total a 0 cuando se confirma/finaliza la compra
}

// Para mostrar el menú inicial del simulador 
mostrarMenu()
