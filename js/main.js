document.title = "Burger King";
const contenedorNoticias = document.getElementById('noticias'),
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

function iniciarCarrito() {
    if ((localStorage.getItem("carrito")) == null) {
        localStorage.setItem("carrito", "null");
    }
}

// CARGO UNA BASE DE DATOS SIMULADA POR PRIMERA VEZ SI ES QUE ESTÁ VACÍA
function bdRegistro() {

    if ((localStorage.getItem("bdUsuarios")) == null) {
        const bdUsuarios = [
            {
                nombre: "eze",
                contra: "1234",
                email: "ezequiasherrera99@gmail.com"
            },
            {
                nombre: "admin",
                contra: "admin",
                email: "admin@gmail.com"
            }
        ];

        localStorage.setItem("bdUsuarios", JSON.stringify(bdUsuarios));
    }

}

btnLogOut.addEventListener('click', () => {
    localStorage.setItem("logueado", false);
    location.reload();
});

function crearHTML(array) {
    let html;
    for (const noticia of array) {
        html =
            `<div class="col">
        <div class="card shadow">
        <a href="${noticia.href}"><img src="/img/${noticia.img}" class="card-img-top" alt="articulo"></a>
        <div class="card-body">
        <h5 class="card-title text-selected">${noticia.titulo}</h5>
        <p class="card-text">${noticia.texto}</p>
        </div>
        </div>
        </div>`;
        contenedorNoticias.innerHTML += html;
    }
}

function hacerInvisible(elemento) {
    elemento.style.display = "";
    elemento.hidden = false;
    elemento.style.display = "none";
}

async function fetchAPI() {
    const response = await fetch('./data/lista.json');
    const datos = await response.json();
    crearHTML(datos);
}

bdRegistro();

iniciarCarrito()

checkLogIn();

fetchAPI();

