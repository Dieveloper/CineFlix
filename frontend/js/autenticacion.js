/**
 * Sistema de autenticación para CineFlix
 */

function guardarSesion(usuarioData) {
    localStorage.setItem("usuario_id", usuarioData.id);
    localStorage.setItem("usuario_nombre", usuarioData.nombre);
    localStorage.setItem("usuario_email", usuarioData.email);
    localStorage.setItem("autenticado", "true");
}

function estaAutenticado() {
    return localStorage.getItem("autenticado") === "true";
}

function obtenerUsuario() {
    if (!estaAutenticado()) {
        return null;
    }
    
    return {
        id: localStorage.getItem("usuario_id"),
        nombre: localStorage.getItem("usuario_nombre"),
        email: localStorage.getItem("usuario_email")
    };
}

function protegerPagina() {
    if (!estaAutenticado()) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "../index.html";
        return false;
    }
    return true;
}

function cerrarSesion() {
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("usuario_nombre");
    localStorage.removeItem("usuario_email");
    localStorage.removeItem("autenticado");
}

function redirigirALogin() {
    cerrarSesion();
    window.location.href = "../index.html";
}
