/**
 * Módulo para gestionar perfiles de usuario
 */

const API_BASE_URL = "http://localhost:5097/api/perfiles";

let perfilesCache = [];

// Cargar perfiles del usuario
async function cargarPerfiles() {
    const usuario = obtenerUsuario();
    if (!usuario) return;

    try {
        const response = await fetch(`${API_BASE_URL}/usuario/${usuario.id}`);
        
        if (response.ok) {
            perfilesCache = await response.json();
            mostrarPerfiles(perfilesCache);
        } else if (response.status === 404) {
            mostrarPerfiles([]);
        }
    } catch (err) {
        console.error("Error al cargar perfiles:", err);
        mostrarPerfiles([]);
    }
}

// Mostrar perfiles en la interfaz
function mostrarPerfiles(perfiles) {
    const container = document.getElementById("perfiles-grid");
    container.innerHTML = "";

    perfiles.forEach(perfil => {
        const perfilDiv = document.createElement("div");
        perfilDiv.className = "perfil-card";
        perfilDiv.innerHTML = `
            <div class="perfil-imagen-container">
                <div class="perfil-imagen" style="${perfil.Foto ? `background-image: url(${perfil.Foto})` : `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}">
                </div>
                <div class="perfil-opciones">
                    <button class="btn-editar" onclick="abrirModalEditar(${perfil.Id}, '${perfil.Nombre}')">✎</button>
                    <button class="btn-eliminar" onclick="eliminarPerfil(${perfil.Id})">✕</button>
                </div>
            </div>
            <p class="perfil-nombre">${perfil.Nombre}</p>
        `;
        perfilDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".perfil-opciones")) {
                seleccionarPerfil(perfil.Id, perfil.Nombre);
            }
        });
        container.appendChild(perfilDiv);
    });

    // Agregar tarjeta para crear nuevo perfil
    const crearDiv = document.createElement("div");
    crearDiv.className = "perfil-card crear-perfil";
    crearDiv.innerHTML = `
        <div class="perfil-imagen-container">
            <div class="perfil-imagen">
                <span>+ Crear Perfil</span>
            </div>
        </div>
    `;
    crearDiv.addEventListener("click", abrirModalCrear);
    container.appendChild(crearDiv);
}

// Crear nuevo perfil
async function crearPerfil(nombre, foto = null) {
    const usuario = obtenerUsuario();
    if (!usuario) return;

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                foto: foto,
                usuarioId: parseInt(usuario.id)
            })
        });

        if (response.ok) {
            const nuevoPerfil = await response.json();
            perfilesCache.push(nuevoPerfil);
            mostrarPerfiles(perfilesCache);
            cerrarModal();
            alert(`Perfil "${nombre}" creado exitosamente.`);
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (err) {
        alert("Error al crear el perfil. Intenta nuevamente.");
        console.error(err);
    }
}

// Actualizar perfil
async function actualizarPerfil(id, nombre, foto) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                nombre: nombre,
                foto: foto,
                usuarioId: parseInt(obtenerUsuario().id)
            })
        });

        if (response.ok) {
            await cargarPerfiles();
            cerrarModal();
            alert("Perfil actualizado correctamente.");
        } else {
            alert("Error al actualizar el perfil.");
        }
    } catch (err) {
        alert("Error al actualizar el perfil. Intenta nuevamente.");
        console.error(err);
    }
}

// Eliminar perfil
async function eliminarPerfil(id) {
    if (!confirm("¿Deseas eliminar este perfil?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            perfilesCache = perfilesCache.filter(p => p.Id !== id);
            mostrarPerfiles(perfilesCache);
            alert("Perfil eliminado correctamente.");
        } else {
            alert("Error al eliminar el perfil.");
        }
    } catch (err) {
        alert("Error al eliminar el perfil. Intenta nuevamente.");
        console.error(err);
    }
}

// Seleccionar perfil
function seleccionarPerfil(id, nombre) {
    localStorage.setItem("perfil_id", id);
    localStorage.setItem("perfil_nombre", nombre);
    alert(`Perfil "${nombre}" seleccionado.`);
    // Aquí puedes redirigir a la página principal del contenido
    // window.location.href = "peliculas.html";
}

// Modal para crear perfil
function abrirModalCrear() {
    const modal = document.getElementById("modalPerfil");
    const modalTitle = document.getElementById("crear");
    const nombreInput = document.getElementById("nombrePerfil");
    const fotoInput = document.getElementById("fotoPerfil");
    const btnGuardar = document.getElementById("btnGuardarPerfil");

    modalTitle.textContent = "Crear nuevo perfil";
    nombreInput.value = "";
    fotoInput.value = "";
    btnGuardar.onclick = () => {
        if (nombreInput.value.trim().length < 2) {
            alert("El nombre debe tener al menos 2 caracteres.");
            return;
        }
        crearPerfil(nombreInput.value, fotoInput.value || null);
    };

    modal.style.display = "flex";
}

// Modal para editar perfil
function abrirModalEditar(id, nombre) {
    const modal = document.getElementById("modalPerfil");
    const modalTitle = document.getElementById("crear");
    const nombreInput = document.getElementById("nombrePerfil");
    const fotoInput = document.getElementById("fotoPerfil");
    const btnGuardar = document.getElementById("btnGuardarPerfil");

    const perfil = perfilesCache.find(p => p.Id === id);

    modalTitle.textContent = "Editar perfil";
    nombreInput.value = nombre;
    fotoInput.value = perfil?.Foto || "";
    btnGuardar.onclick = () => {
        if (nombreInput.value.trim().length < 2) {
            alert("El nombre debe tener al menos 2 caracteres.");
            return;
        }
        actualizarPerfil(id, nombreInput.value, fotoInput.value || null);
    };

    modal.style.display = "flex";
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById("modalPerfil");
    modal.style.display = "none";
}

// Manejar foto en el modal
document.addEventListener("DOMContentLoaded", () => {
    const inputFoto = document.getElementById("fotoPerfil");
    if (inputFoto) {
        inputFoto.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Guardar la imagen como base64
                    inputFoto.value = event.target.result;
                    const preview = document.getElementById("previewFoto");
                    if (preview) {
                        preview.style.backgroundImage = `url(${event.target.result})`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Cerrar modal al hacer clic fuera
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modalPerfil");
    if (e.target === modal) {
        cerrarModal();
    }
});
