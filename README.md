======= Nexus Underground Store - eCommerce =======

Nexus Underground Store simula una tienda en línea para la compra de productos de moda. 

Este proyecto lo desarrollé usando HTML, CSS y JavaScript, integrando funcionalidades dinámicas como en el carrito de compras interactivo y la conversión de monedas en tiempo real.

Prioricé darle un diseño simple, intuitivo y funcional, con una paleta de colores moderna y agradable que ofrezca una experiencia de usuario lo más smooth posible. 

======= Características principales =======

- Catálogo dinámico de productos -

Los productos se cargan desde un archivo JSON local (productos.json).
Los productos pueden organizarse por categorías para facilitar la navegación y búsqueda.

Comentarios: me hubiera gustado agregar una barra de búsqueda.

- Carrito de compras interactivo -

Se pueden agregar y eliminar productos desde carrito.html.
Visualización de subtotales y total calculados dinámicamente y funcionando con la conversión de moneda.

Comentarios: me hubiera gustado agregarle un botón de sumar y restar allí mismo para modificar la cantidad desde ahí. La cantidad sólo aumenta (suma 1) al apretar "Agregar" multiples veces.

- Conversión de moneda -

Tiene un selector de monedas con tasas de cambio que se actualizan desde una API en tiempo real.
Persistencia de la moneda seleccionada a través de localStorage (se mantiene aunque se cambie de un html al otro).

Comentarios: no supe cómo resolver el hecho de que cuando me posiciono en una categoría (por ejemplo en "Indumentaria"), si cambio la moneda, me muestra todos los productos en pantalla, no mantiene los productos filtrados en pantalla. Sin embargo al apretar de nuevo vuelven a mostrarse y la elección de la moneda por suerte se mantiene.

- Validación de datos del cliente -

Modales al vaciar el carrito (sujeto a confirmación, lo cual vacía el array) y al finalizar la compra con campos para recolectar información (nombre, apellido y correo electrónico).

Comentarios: me hubiera gustado asignarle las restricciones de sólo aceptar letras, o de sólo aceptar el formato válido para email (ejemplo: email@dominio.com), ya que se ponga lo que se ponga, lo toma igual. No sé por qué aunque (por ejemplo en el input de email) le agregué el type="email" no me sale el mensaje de error, ponga lo que ponga.

- Notificaciones dinámicas -

Usé Toastify para las notificaciones rápidas y los estilicé en CSS para hacerlos coherentes con el diseño de la web.
Usé SweetAlert2 para modales personalizados y confirmaciones y también estilicé lo mejor posible

Comentarios: me hubiese gustado estilizar mucho mejor el modal que aparece al clickear "FINALIZAR COMPRA" con el "Ingresa tus datos" con los imputs con esos border radius que tengo en el selector de tall, y en la parte "Detalle del pedido" mostrando por ejemplo la lista de los productos en un miniatura más linda, como lo que se muestra en el carrito.html, que también permitiera borrar los productos desde ahí y eso, pero no encontré la forma. 

---.---.---.---.---.---.---.---.---.---.---.---.---.---.---.---

Gracias por tomarse el tiempo de leer y corregir este proyecto, espero ansioso su devolución :D

PD: Como el hecho de estar commiteando, trabajando en otra rama, actualizar los cambios cuidadosamente y eso me tomaba mucho tiempo para validar todo, trabajé en este proyecto o carpeta espejo (que le llamé enzo-project-javascript-v2.0 transitoriamente) de forma aislada, luego mudé los cambios y actualicé los nombres de las carpetas y páginas en la carpeta/repositorio que ya tenía, con mucha fe de que nada se rompiera! 

Por eso verán un commit y un push que subió todo esto de una vez sola, lo que luego (o digamos actualmente, mientras leen esto) estará subido al servidor.