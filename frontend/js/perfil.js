const API_BASE_URL = "http://localhost:5097/api/perfiles";

let perfilesCache = [];

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

function mostrarPerfiles(perfiles) {
    const container = document.getElementById("grilla-perfiles");
    container.innerHTML = "";

    perfiles.forEach(perfil => {
        const perfilDiv = document.createElement("div");
        perfilDiv.className = "tarjeta-perfil";
        perfilDiv.innerHTML = `
            <div class="contenedor-foto-perfil">
                <div class="foto-perfil" style="${perfil.Foto ? `background-image: url(${perfil.Foto})` : `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)`}">
                </div>
                <div class="opciones-perfil">
                    <button class="btn-editar-perfil" onclick="abrirModalEditar(${perfil.Id}, '${perfil.Nombre}')">✎</button>
                    <button class="btn-eliminar-perfil" onclick="eliminarPerfil(${perfil.Id})">✕</button>
                </div>
            </div>
            <p class="nombre-perfil">${perfil.Nombre}</p>
        `;
        perfilDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".opciones-perfil")) {
                seleccionarPerfil(perfil.Id, perfil.Nombre);
            }
        });
        container.appendChild(perfilDiv);
    });

    const crearDiv = document.createElement("div");
    crearDiv.className = "tarjeta-perfil crear-perfil";
    crearDiv.innerHTML = `
        <div class="contenedor-foto-perfil">
            <div class="foto-perfil">
                <span>+ Crear Perfil</span>
            </div>
        </div>
    `;
    crearDiv.addEventListener("click", abrirModalCrear);
    container.appendChild(crearDiv);
}

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

function seleccionarPerfil(id, nombre) {
    localStorage.setItem("perfil_id", id);
    localStorage.setItem("perfil_nombre", nombre);
    alert(`Perfil "${nombre}" seleccionado.`);
}

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

function cerrarModal() {
    const modal = document.getElementById("modalPerfil");
    modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const inputFoto = document.getElementById("fotoPerfil");
    if (inputFoto) {
        inputFoto.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
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

window.addEventListener("click", (e) => {
    const modal = document.getElementById("modalPerfil");
    if (e.target === modal) {
        cerrarModal();
    }
});
