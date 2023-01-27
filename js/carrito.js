document.title = "Menu";
const btnRegistro = document.getElementById('btnRegistro'),
    btnLogOut = document.getElementById('btnLogOut'),
    textoBienvenida = document.getElementById('bienvenida'),
    mensajeCarrito = document.getElementById('mensajeCarrito'),
    btnComprar = document.getElementById('btnComprar'),
    contenedorCarrito = document.getElementById('carrito');

let carrito = [];

function checkBtnComprar() {
    if (localStorage.getItem("carrito") == "null") {
        hacerInvisible(btnComprar);
    }
}

function checkLogIn() {
    if ((localStorage.getItem("logueado")) != "true") {
        hacerInvisible(btnLogOut);
        Swal.fire({
            icon: 'question',
            title: 'Aun no te has registrado?',
            text: 'Para acceder a todas las opciones debes estar registrado',
            footer: '<a href="/pages/register.html">Registrarme</a>'
        });
    } else {
        hacerInvisible(btnRegistro);
        textoBienvenida.innerText = "Bienvenido " + (localStorage.getItem("usuario"));
    }
}

function hacerInvisible(elemento) {
    elemento.style.display = "";
    elemento.hidden = false;
    elemento.style.display = "none";
}

function verificarCarrito() {
    if ((localStorage.getItem("carrito")) == "null") {
        mensajeCarrito.innerHTML = '<p class="text-center">Aún no ha agregado nada al carrito</p>';
        return false;
    } else { return true; }
}

btnLogOut.addEventListener('click', () => {
    localStorage.setItem("logueado", false);
    location.reload();
});

function crearHTML(array) {
    let html;
    for (const elemento of array) {
        html =
            `<div class="col">
                <div class="card shadow">
                    <div class="card-body">
                        <h5 class="card-title text-selected text-center">${elemento.nombre}</h5>
                        <p class="card-text text-center texto-precio">$${(elemento.precio) * elemento.cantidad} x${elemento.cantidad}</p>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-danger btnBorrar btn-producto" data-card-id="${elemento.id}">Borrar Pedido</button>
                        </div>
                    </div>
                </div>
            </div>`;
        contenedorCarrito.innerHTML += html;
    }
}

function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    crearHTML(carrito);
}

checkLogIn();

checkBtnComprar();

let estado = verificarCarrito();

cargarCarrito();

btnComprar.addEventListener('click', () => {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    let precioTotal = carrito.reduce((acc, producto) => acc + parseFloat(producto.precio) * producto.cantidad, 0);
    Swal.fire({
        title: 'Deseas confirmar la compra?',
        text: "Este pago no puede ser revertido",
        imageUrl: '../img/pagar.png',
        imageWidth: 100,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, deseo pagar!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'El pago de $' + precioTotal + ' ha sido enviado',
                'Enseguida le enviaremos el pedido.',
                'success'
            ).then(() => {
                localStorage.setItem("carrito", "null");
                location.reload();
            })
        }
    })
})

// Función manejadora de eventos para el botón dentro de la tarjeta
const handleButtonClick = e => {
    // Obtener el nombre del producto de la tarjeta
    const productName = e.target.closest('.card').querySelector('.card-title').innerText;
    console.log("El nombre del producto clickeado es: " + productName);
    // Buscar el objeto con el nombre correspondiente en el carrito
    carrito = JSON.parse(localStorage.getItem("carrito"));
    const productIndex = carrito.findIndex(producto => producto.nombre === productName);
    // Si el producto se encuentra en el carrito
    if (productIndex !== -1) {
        // Si la cantidad es igual a 1, borrar el objeto del carrito
        if (carrito[productIndex].cantidad === 1) {
            carrito.splice(productIndex, 1);
        } else {
            // Si la cantidad es mayor a 1, restar 1 a la cantidad
            carrito[productIndex].cantidad -= 1;
        }
    }
    if (carrito.length === 0) {
        localStorage.setItem("carrito", "null");
        location.reload();
    } else {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        location.reload();
    }

}

const btnBorrar = document.querySelectorAll('.btnBorrar');
btnBorrar.forEach(boton => boton.addEventListener('click', handleButtonClick));
