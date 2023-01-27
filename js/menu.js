document.title = "Menu";
const contenedorMenu = document.getElementById('menu'),
    btnRegistro = document.getElementById('btnRegistro'),
    btnLogOut = document.getElementById('btnLogOut'),
    textoBienvenida = document.getElementById('bienvenida');

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

btnLogOut.addEventListener('click', () => {
    localStorage.setItem("logueado", false);
    location.reload();
});


// DEFINO LA CLASE NUEVAHAMBURGUESA
class NuevaHamburguesa {
    constructor(nombre, precio, id, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.cantidad = cantidad;
    }
};

// INICIALIZO CARRITO DONDE GUARDARE EL ARRAY PARA LUEGO HACERLE STRINGIFY
let carrito = [];

function crearHTML(array) {
    let html;
    for (const menu of array) {
        html =
            `<div class="col">
                <div class="card shadow">
                    <img src=".../img/${menu.img}" class="card-img-top burger-mouseon" alt="articulo">
                    <div class="card-body">
                        <h5 class="card-title text-selected text-center">${menu.nombre}</h5>
                        <p class="card-text text-center texto-precio">$${menu.precio}</p>
                        <div class="d-grid">
                            <button type="submit" class="btn btn-primary btn-producto" data-card-id="${menu.id}">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>`;
        contenedorMenu.innerHTML += html;
    }
}

function hacerInvisible(elemento) {
    elemento.style.display = "";
    elemento.hidden = false;
    elemento.style.display = "none";
}

async function fetchAPI() {
    const response = await fetch('../data/menu.json');
    const datos = await response.json();
    crearHTML(datos);
}

async function fetchMenu() {
    const response = await fetch('../data/menu.json');
    const datos = await response.json();
    return datos;
}

checkLogIn();

fetchAPI()
    .then(() => {
        const botones = document.querySelectorAll('.btn-producto');
        botones.forEach(boton => {
            boton.addEventListener('click', e => {
                const cardId = e.target.dataset.cardId;
                buscarProducto(cardId).then(producto => {
                    if (producto != false) {
                        añadirCarrito(producto);
                    }
                })
            });
        });
    });


// aca funciona todo bien
function buscarProducto(idPedido) {
    return fetchMenu().then(lista => {
        for (const producto of lista) {
            if (producto.id == idPedido) {
                return producto;
            }
        }
        return false;
    });
}

function añadirCarrito(producto) {
    Swal.fire({
        title: producto.nombre,
        text: 'Agrega al carrito con un valor de ' + producto.precio,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Agregar X1',
        imageUrl: "../img/" + producto.img,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: 'hamburguesa',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Listo!',
                'Su pedido ha sido agregado al carrito',
                'success'
            );
            if (localStorage.getItem("carrito") == "null") {
                const nuevaHamburguesa = new NuevaHamburguesa(producto.nombre, producto.precio, producto.id, 1);
                carrito.push(nuevaHamburguesa);
                localStorage.setItem("carrito", JSON.stringify(carrito));
            } else {
                carrito = JSON.parse(localStorage.getItem("carrito"));
                let existe = false;
                const nuevaHamburguesa = new NuevaHamburguesa(producto.nombre, producto.precio, producto.id, 1);
                // RECORRO EL CARRITO PARA VERIFICAR SI YA HAY ALGUNA HAMBURGUESA DEL MISMO TIPO EN EL CARRITO Y SUMARLA
                carrito.forEach(hamburguesa => {
                    if (hamburguesa.id === nuevaHamburguesa.id) {
                        hamburguesa.cantidad += 1;
                        existe = true;
                        // Escribir el archivo JSON actualizado
                        localStorage.setItem("carrito", JSON.stringify(carrito));
                    }
                });
                if (!existe) {
                    carrito.push(nuevaHamburguesa);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                }
            }
        }
    });
}