document.title = "Sign In - Burger King";
const input = document.querySelectorAll('input'),
    mensaje = document.querySelector('#mensaje'),
    formulario = document.querySelector('form');

// PRESIONO EL BOTON DE COMPLETAR EL FORMULARIO
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    user = e.target.children[0].children[0].value;
    password = e.target.children[1].children[0].value;
    // LLAMO A LA FUNCION QUE GUARDA EL USUARIO A REGISTRAR
    if (!(comprobarCamposVacios(user, password))) {
        console.log("No hay campos vacios");

        if (verificarExistencia(user, password)) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Logueado con éxito',
                showConfirmButton: false,
                timer: 1500,
            }).then(() => {
                localStorage.setItem("usuario", user);
                localStorage.setItem("logueado", true);
                window.location.replace("../index.html");
            });
        }
    }
});

// FUNCION QUE UTILIZO PARA BORRAR EL MENSAJE EMERGENTE EN CASO DE UN ERROR
function borrarMensaje() {
    setTimeout(() => {
        mensaje.innerText = "";
    }, 3000);
}

// FUNCION QUE COMPRUEBA Y REGISTRA USUARIO NUEVO
function comprobarCamposVacios(usuario, pass) {
    // CREO UN NUEVO USER
    let user = { usuario: usuario, pass: pass }
    // SI EL USUARIO O CONTRASEÑA ESTAN VACÍOS LE INFORMO CON UN CARTEL
    if (user.usuario == "" || user.pass == "") {
        mensaje.innerText = "Asegurate de rellenar todos los campos solicitados";
        borrarMensaje();
        return true;
    } else { return false; }
}

function verificarExistencia(nombre, contra) {
    let encontrado = false;
    let bdUsuarios = JSON.parse(localStorage.getItem("bdUsuarios"));
    bdUsuarios.forEach(usuario => {
        if (usuario.nombre == nombre && usuario.contra == contra) {
            encontrado = true;
        }
    });
    if (!encontrado) {
        mensaje.innerText = "Verifique los datos ingresados";
        borrarMensaje();
        return false;
    } else {
        return true;
    }
}