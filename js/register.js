document.title = "Sign Up - Burger King";
const input = document.querySelectorAll('input'),
    mensaje = document.querySelector('#mensaje'),
    formulario = document.querySelector('form')


// PRESIONO EL BOTON DE COMPLETAR EL FORMULARIO
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    user = e.target.children[0].children[0].value;
    email = e.target.children[1].children[0].value;
    password = e.target.children[2].children[0].value;
    // LLAMO A LA FUNCION QUE GUARDA EL USUARIO A REGISTRAR
    if (!(comprobarCamposVacios(user, email, password))) {
        if (!verificarExistencia(user)) {
            registrarUsuario(user, password, email);
        }
    }

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registrado con éxito',
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        localStorage.setItem("usuario", user);
        localStorage.setItem("logueado", true);
        window.location.replace("../index.html");
    });
})

// FUNCION QUE UTILIZO PARA BORRAR EL MENSAJE EMERGENTE EN CASO DE UN ERROR
function borrarMensaje() {
    setTimeout(() => {
        mensaje.innerText = "";
    }, 3000);
}
// FUNCION QUE COMPRUEBA Y REGISTRA USUARIO NUEVO
function comprobarCamposVacios(usuario, email, pass) {
    // CREO UN NUEVO USER
    let user = { usuario: usuario, email: email, pass: pass }
    // SI EL USUARIO O CONTRASEÑA ESTAN VACÍOS LE INFORMO CON UN CARTEL
    if (user.usuario == "" || user.pass == "") {
        mensaje.innerText = "Asegurate de rellenar todos los campos solicitados";
        borrarMensaje();
        return true;
    } else { return false; }
}

// VERIFICO SI EL USUARIO YA EXISTE
function verificarExistencia(nuevoUser) {
    let encontrado = false;
    let bdUsuarios = JSON.parse(localStorage.getItem("bdUsuarios"));
    bdUsuarios.forEach(usuario => {
        if (usuario.nombre == nuevoUser) {
            mensaje.innerText = "Lo siento este usuario ya existe";
            borrarMensaje();
            encontrado = true;
        }
    });
    if (!encontrado) {
        return false;
    } else { return true; }
}

function registrarUsuario(user, pass, email) {
    let bdUsuarios = JSON.parse(localStorage.getItem("bdUsuarios"));
    bdUsuarios.push({ nombre: user, contra: pass, email: email });
    localStorage.setItem("bdUsuarios", JSON.stringify(bdUsuarios));
}