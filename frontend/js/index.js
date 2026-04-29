const API_BASE_URL = "http://localhost:5097/api";
const IMAGES_PATH = 'img/';
const DEFAULT_IMAGE = 'red.jpg';

// Imágenes disponibles para perfiles
const AVAILABLE_IMAGES = [
    'FLOWER_BOY.jpg',
    'KLK.jpg',
    'mecagoenlaputa.jpg',
    'omero.jpg',
    'red.jpg'
];

// Data para el catálogo
const DATA = {
    trending: [
        {e:'🌌',t:'Cosmos X',c:'#0f3460'},
        {e:'🔪',t:'Blood Pact',c:'#3d0000'},
        {e:'🕵️',t:'The Mole',c:'#1a2a1a'},
        {e:'🐉',t:'Dragonfall',c:'#1a0d2e'},
        {e:'🤖',t:'Replica',c:'#0a1628'},
        {e:'🌊',t:'Deep Blue',c:'#002244'},
        {e:'🔥',t:'Inferno',c:'#3d1200'},
        {e:'🎭',t:'Masquerade',c:'#1a1a0a'},
    ],
    series: [
        {e:'👁️',t:'Watchful',c:'#0d0d1a'},
        {e:'🏔️',t:'Highlands',c:'#0a1a0a'},
        {e:'🕯️',t:'Candlewick',c:'#1a0d00'},
        {e:'🧬',t:'Gene Zero',c:'#001a1a'},
        {e:'🎪',t:'Circus Noir',c:'#1a001a'},
        {e:'⚡',t:'Volt City',c:'#0a1a00'},
        {e:'🌙',t:'Moonwatch',c:'#000d1a'},
        {e:'🦊',t:'Red Fox',c:'#1a0500'},
    ],
    action: [
        {e:'💥',t:'Blast Zone',c:'#1a0800'},
        {e:'🚀',t:'Orbital',c:'#000d1a'},
        {e:'🥊',t:'Iron Fist',c:'#1a0a0a'},
        {e:'🏎️',t:'Overdrive',c:'#0a1a00'},
        {e:'🗡️',t:'Blade Run',c:'#0a000a'},
        {e:'🌪️',t:'Vortex',c:'#000a1a'},
        {e:'🎯',t:'Dead Shot',c:'#1a0000'},
        {e:'🔱',t:'Trident',c:'#001a1a'},
    ],
    docs: [
        {e:'🌍',t:'Earth Now',c:'#001a0a'},
        {e:'🧠',t:'Mind Map',c:'#0d0a1a'},
        {e:'🐋',t:'Deep Ocean',c:'#000d1a'},
        {e:'🏛️',t:'Ruins',c:'#1a1505'},
        {e:'🔭',t:'Stargazer',c:'#000a1a'},
        {e:'🌿',t:'Green Pact',c:'#001a05'},
        {e:'🎵',t:'Sound Trip',c:'#1a0010'},
        {e:'🏺',t:'Lost Worlds',c:'#1a0f00'},
    ],
};

// Cache de perfiles
let perfilesCache = [];

// Elementos del DOM
const pestanaIngresar = document.getElementById("loginTab");
const pestanaRegistrar = document.getElementById("registerTab");
const formularioIngreso = document.getElementById("loginForm");
const formularioRegistro = document.getElementById("registerForm");
const mensajeAcceso = document.getElementById("mensajeAutenticacion");

const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

// ============ AUTH FUNCTIONS ============

function setActiveTab(tab) {
    pestanaIngresar.classList.toggle("active", tab === "login");
    pestanaRegistrar.classList.toggle("active", tab === "register");
    formularioIngreso.classList.toggle("activo", tab === "login");
    formularioRegistro.classList.toggle("activo", tab === "register");
    clearMessage();
}

function displayMessage(message, type = "info") {
    mensajeAcceso.textContent = message;
    mensajeAcceso.classList.remove("error", "success");
    if (type === "error") mensajeAcceso.classList.add("error");
    if (type === "success") mensajeAcceso.classList.add("success");
}

function clearMessage() {
    mensajeAcceso.textContent = "";
    mensajeAcceso.classList.remove("error", "success");
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    const domain = email.split("@")[1]?.toLowerCase();
    return allowedDomains.includes(domain);
}

function isValidPassword(password) {
    const lengthCheck = password.length >= 8;
    const upperCheck = /[A-Z]/.test(password);
    const lowerCheck = /[a-z]/.test(password);
    const digitCheck = /[0-9]/.test(password);
    const specialCheck = /[^A-Za-z0-9]/.test(password);

    return lengthCheck && upperCheck && lowerCheck && digitCheck && specialCheck;
}

function validateLogin(email, password) {
    if (!isValidEmail(email)) {
        return "Ingresa un correo válido y permitido.";
    }
    if (password.length === 0) {
        return "Ingresa tu contraseña.";
    }
    return "";
}

function validateRegistration(name, email, password) {
    if (name.length < 2) {
        return "Ingresa tu nombre completo.";
    }
    if (!isValidEmail(email)) {
        return `El correo debe ser válido y pertenecer a uno de estos dominios: ${allowedDomains.join(", ")}.`;
    }
    if (!isValidPassword(password)) {
        return "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
    }
    return "";
}

function updatePasswordFeedback(password) {
    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    document.getElementById("verificar-largo").className = checks.length ? "valid" : "invalid";
    document.getElementById("verificar-mayuscula").className = checks.upper ? "valid" : "invalid";
    document.getElementById("verificar-minuscula").className = checks.lower ? "valid" : "invalid";
    document.getElementById("verificar-numero").className = checks.digit ? "valid" : "invalid";
    document.getElementById("verificar-especial").className = checks.special ? "valid" : "invalid";

    const score = Object.values(checks).filter(Boolean).length;
    const bar = document.getElementById("barra-fortaleza");

    const width = (score / 5) * 100;
    bar.style.width = width + "%";

    if (score <= 2) bar.style.background = "red";
    else if (score <= 4) bar.style.background = "orange";
    else bar.style.background = "green";
}

// ============ SCREEN SYSTEM ============

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    el.classList.add('active');
    el.classList.remove('fade-enter');
    void el.offsetWidth;
    el.classList.add('fade-enter');
}

// ============ NAVIGATION ============

function navegarA(seccion) {
    event.preventDefault();
    // Aquí puedes implementar la navegación a diferentes secciones
    // Por ahora, marcamos el enlace activo
    document.querySelectorAll('.enlace-nav').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

// ============ MENÚ DE PERFIL ============

function toggleProfileMenu() {
    const menu = document.getElementById('menu-perfil');
    menu.classList.toggle('active');
    
    // Cargar perfiles en el menú si no están cargados
    if (menu.classList.contains('active')) {
        cargarPerfilesEnMenu();
    }
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('desplegable-perfil');
    const menu = document.getElementById('menu-perfil');
    if (!dropdown.contains(e.target) && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
});

function cargarPerfilesEnMenu() {
    const container = document.getElementById('lista-perfiles-menu');
    container.innerHTML = '';
    
    perfilesCache.forEach(perfil => {
        const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
        
        const item = document.createElement('div');
        item.className = 'item-perfil-menu';
        item.onclick = () => cambiarPerfil(perfil);
        item.innerHTML = `
            <div class="avatar-perfil-menu" style="background-image: url('${fotoPerfil}');"></div>
            <span>${perfil.nombre}</span>
        `;
        container.appendChild(item);
    });
}

function cambiarPerfil(perfil) {
    localStorage.setItem('perfil_id', perfil.id);
    localStorage.setItem('perfil_nombre', perfil.nombre);
    
    const avatarNav = document.getElementById('avatar-nav');
    const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
    avatarNav.style.backgroundImage = `url('${fotoPerfil}')`;
    
    document.getElementById('menu-perfil').classList.remove('active');
}

// ============ BÚSQUEDA ============

function toggleSearch() {
    const modal = document.getElementById('modal-buscar');
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        document.getElementById('input-buscar').focus();
    }
}

function buscarContenido(query) {
    const resultsContainer = document.getElementById('resultados-buscar');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    // Buscar en todos los datos
    const resultados = [];
    const queryLower = query.toLowerCase();
    
    Object.values(DATA).forEach(categoria => {
        categoria.forEach(item => {
            if (item.t.toLowerCase().includes(queryLower)) {
                resultados.push(item);
            }
        });
    });
    
    if (resultados.length === 0) {
        resultsContainer.innerHTML = '<p style="color: var(--muted); text-align: center;">No se encontraron resultados</p>';
        return;
    }
    
    resultsContainer.innerHTML = resultados.map(item => `
        <div class="item-resultado">
            <div class="icono-resultado" style="background: ${item.c};">${item.e}</div>
            <div class="info-resultado">
                <h4>${item.t}</h4>
                <p>Ver en catálogo</p>
            </div>
        </div>
    `).join('');
}

// Cerrar search con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const searchModal = document.getElementById('modal-buscar');
        if (searchModal.classList.contains('active')) {
            toggleSearch();
        }
    }
});

// ============ PERFILES ============

async function cargarPerfilesYMostrar() {
    const usuarioId = localStorage.getItem('usuario_id');
    if (!usuarioId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/perfiles/usuario/${usuarioId}`);
        if (response.ok) {
            perfilesCache = await response.json();
        } else {
            perfilesCache = [];
        }
    } catch (err) {
        console.error('Error al cargar perfiles:', err);
        perfilesCache = [];
    }

    mostrarPerfilesEnPantalla();
    showScreen('pantalla-perfiles');
}

function mostrarPerfilesEnPantalla() {
    const container = document.getElementById('profiles-grid');
    container.innerHTML = '';

    perfilesCache.forEach((perfil) => {
        const card = document.createElement('div');
        card.className = 'tarjeta-perfil';
        card.onclick = () => seleccionarPerfil(perfil);
        
        const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
        
        card.innerHTML = `
            <div class="avatar-perfil" style="background-image: url('${fotoPerfil}'); background-size: cover; background-position: center;"></div>
            <div class="nombre-perfil">${perfil.nombre}</div>
        `;
        container.appendChild(card);
    });

    const crearCard = document.createElement('div');
    crearCard.className = 'tarjeta-perfil';
    crearCard.onclick = abrirModalCrearPerfil;
    crearCard.innerHTML = `
        <div class="agregar-perfil">+</div>
        <div class="nombre-perfil">Añadir</div>
    `;
    container.appendChild(crearCard);
}

function seleccionarPerfil(perfil) {
    localStorage.setItem('perfil_id', perfil.id);
    localStorage.setItem('perfil_nombre', perfil.nombre);
    
    const avatarNav = document.getElementById('avatar-nav');
    const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
    avatarNav.style.backgroundImage = `url('${fotoPerfil}')`;
    avatarNav.style.backgroundSize = 'cover';
    avatarNav.style.backgroundPosition = 'center';
    
    showScreen('pantalla-catalogo');
}

// ============ MODAL CREAR PERFIL ============

let imagenSeleccionada = DEFAULT_IMAGE;

function abrirModalCrearPerfil() {
    const modal = document.getElementById('modal-crear-perfil');
    modal.classList.add('active');
    
    imagenSeleccionada = AVAILABLE_IMAGES[0];
    
    const container = document.getElementById('opciones-imagen');
    container.innerHTML = '';
    
    AVAILABLE_IMAGES.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'opcion-imagen' + (index === 0 ? ' selected' : '');
        div.style.backgroundImage = `url('${IMAGES_PATH}${img}')`;
        div.onclick = () => seleccionarImagen(img, div);
        container.appendChild(div);
    });
}

function seleccionarImagen(img, element) {
    imagenSeleccionada = img;
    document.querySelectorAll('.opcion-imagen').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function cerrarModalCrearPerfil() {
    document.getElementById('modal-crear-perfil').classList.remove('active');
    document.getElementById('nombre-perfil-modal').value = '';
}

async function almacenarNuevoPerfil() {
    const nombre = document.getElementById('nombre-perfil-modal').value.trim();
    if (!nombre) {
        alert('Por favor, ingresa un nombre para el perfil');
        return;
    }
    
    const usuarioId = localStorage.getItem('usuario_id');
    
    try {
        const response = await fetch(`${API_BASE_URL}/perfiles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                fotoUrl: imagenSeleccionada,
                usuarioId: parseInt(usuarioId)
            })
        });
        
        if (response.ok) {
            cerrarModalCrearPerfil();
            await cargarPerfilesYMostrar();
        } else {
            alert('Error al crear el perfil');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al crear el perfil');
    }
}

// ============ GESTIONAR PERFILES ============

function abrirGestionarPerfiles() {
    document.getElementById('menu-perfil').classList.remove('active');
    const modal = document.getElementById('modal-administrar-perfiles');
    modal.classList.add('active');
    renderizarListaPerfiles();
}

function cerrarGestionarPerfiles() {
    document.getElementById('modal-administrar-perfiles').classList.remove('active');
}

function renderizarListaPerfiles() {
    const container = document.getElementById('lista-perfiles-modal');
    container.innerHTML = '';
    
    perfilesCache.forEach(perfil => {
        const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
        
        const item = document.createElement('div');
        item.className = 'perfil-item';
        item.innerHTML = `
            <div class="perfil-item-avatar" style="background-image: url('${fotoPerfil}'); background-size: cover; background-position: center;"></div>
            <div class="perfil-item-info">
                <h4>${perfil.nombre}</h4>
            </div>
            <button class="btn-editar-perfil" onclick="editarPerfil(${perfil.id})">✏️</button>
            <button class="btn-eliminar-perfil" onclick="eliminarPerfil(${perfil.id})">🗑️</button>
        `;
        container.appendChild(item);
    });
}

async function eliminarPerfil(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este perfil?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/perfiles/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await cargarPerfilesYMostrar();
            renderizarListaPerfiles();
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

function editarPerfil(id) {
    const perfil = perfilesCache.find(p => p.id === id);
    if (!perfil) return;
    
    // Guardar el ID del perfil que se está editando
    document.getElementById('modal-administrar-perfiles').dataset.perfilEditando = id;
    
    // Abrir modal de edición con los datos del perfil
    const modal = document.getElementById('modal-crear-perfil');
    modal.classList.add('active');
    
    // Llenar el campo de nombre
    document.getElementById('nombre-perfil-modal').value = perfil.nombre;
    
    // Seleccionar la imagen actual
    imagenSeleccionada = perfil.fotoUrl || DEFAULT_IMAGE;
    
    const container = document.getElementById('opciones-imagen');
    container.innerHTML = '';
    
    AVAILABLE_IMAGES.forEach((img, index) => {
        const div = document.createElement('div');
        const isSelected = img === imagenSeleccionada;
        div.className = 'opcion-imagen' + (isSelected ? ' selected' : '');
        div.style.backgroundImage = `url('${IMAGES_PATH}${img}')`;
        div.onclick = () => seleccionarImagen(img, div);
        container.appendChild(div);
    });
    
    // Cambiar el texto del botón
    const btnCrear = modal.querySelector('.btn-guardar');
    btnCrear.textContent = 'Guardar cambios';
    btnCrear.onclick = () => guardarCambiosPerfil(id);
    
    // Añadir botón de cancelar si no existe
    let btnCancelar = modal.querySelector('.btn-anular-editar');
    if (!btnCancelar) {
        btnCancelar = document.createElement('button');
        btnCancelar.className = 'btn-anular btn-anular-editar';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = () => {
            cerrarModalCrearPerfil();
            restaurarBotonCrear();
        };
        btnCrear.after(btnCancelar);
    }
    btnCancelar.style.display = 'inline-block';
}

function restaurarBotonCrear() {
    const modal = document.getElementById('modal-crear-perfil');
    const btnCrear = modal.querySelector('.btn-guardar');
    btnCrear.textContent = 'Crear perfil';
    btnCrear.onclick = () => almacenarNuevoPerfil();
    
    const btnCancelar = modal.querySelector('.btn-anular-editar');
    if (btnCancelar) {
        btnCancelar.style.display = 'none';
    }
    
    delete modal.dataset.perfilEditando;
}

async function guardarCambiosPerfil(id) {
    const nombre = document.getElementById('nombre-perfil-modal').value.trim();
    if (!nombre) {
        alert('Por favor, ingresa un nombre para el perfil');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/perfiles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                nombre: nombre,
                fotoUrl: imagenSeleccionada
            })
        });
        
        if (response.ok) {
            cerrarModalCrearPerfil();
            restaurarBotonCrear();
            await cargarPerfilesYMostrar();
            renderizarListaPerfiles();
        } else {
            alert('Error al guardar los cambios');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Error al guardar los cambios');
    }
}

// ============ CUENTA ============

function verCuenta() {
    document.getElementById('menu-perfil').classList.remove('active');
    const usuario = obtenerUsuario();
    if (usuario) {
        alert(`Cuenta: ${usuario.nombre}\nEmail: ${usuario.email}`);
    }
}

// ============ INICIALIZACIÓN ============

function inicializarCatalog() {
    // Renderizar las filas del catálogo
    const rowTrending = document.getElementById('fila-tendencias');
    const rowSeries = document.getElementById('fila-series');
    const rowAction = document.getElementById('fila-accion');
    const rowDocs = document.getElementById('fila-docs');
    
    rowTrending.innerHTML = DATA.trending.map(item => crearCard(item)).join('');
    rowSeries.innerHTML = DATA.series.map(item => crearCard(item)).join('');
    rowAction.innerHTML = DATA.action.map(item => crearCard(item)).join('');
    rowDocs.innerHTML = DATA.docs.map(item => crearCard(item)).join('');
}

function crearCard(item) {
    return `
        <div class="tarjeta">
            <div class="fondo-tarjeta" style="background: ${item.c};">${item.e}</div>
            <div class="overlay-tarjeta">${item.t}</div>
        </div>
    `;
}

function verificarEstado() {
    const autenticado = localStorage.getItem('autenticado') === 'true';
    const perfilId = localStorage.getItem('perfil_id');

    if (autenticado && perfilId) {
        // Cargar perfiles y mostrar catálogo
        cargarPerfilesYMostrar().then(() => {
            showScreen('pantalla-catalogo');
            // Actualizar avatar del nav
            const avatarNav = document.getElementById('avatar-nav');
            const perfilNombre = localStorage.getItem('perfil_nombre');
            // Buscar la foto del perfil actual
            const perfilActual = perfilesCache.find(p => p.id == perfilId);
            if (perfilActual) {
                const fotoPerfil = perfilActual.fotoUrl ? `${IMAGES_PATH}${perfilActual.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
                avatarNav.style.backgroundImage = `url('${fotoPerfil}')`;
                avatarNav.style.backgroundSize = 'cover';
                avatarNav.style.backgroundPosition = 'center';
            }
        });
    } else if (autenticado) {
        cargarPerfilesYMostrar();
    } else {
        showScreen('login-screen');
    }
}

// Event listeners para login/register
pestanaIngresar.addEventListener("click", () => setActiveTab("login"));
pestanaRegistrar.addEventListener("click", () => setActiveTab("register"));

const passwordInput = document.getElementById("clave-registro");
const feedback = document.getElementById("retroalimentacion-clave");

if (passwordInput && feedback) {
    passwordInput.addEventListener("input", (e) => {
        const value = e.target.value;
        if (value.length > 0) {
            feedback.classList.add("visible");
            updatePasswordFeedback(value);
        } else {
            feedback.classList.remove("visible");
        }
    });
}

// Login form
const API_USUARIOS_URL = "http://localhost:5097/api/usuarios";

document.querySelector("#loginForm form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const error = validateLogin(email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    try {
        const response = await fetch(`${API_USUARIOS_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Email: email, Password: password })
        });

        if (!response.ok) {
            const message = await response.text();
            displayMessage(message || "Credenciales incorrectas.", "error");
            return;
        }

        const result = await response.json();
        displayMessage(`Bienvenido, ${result.nombre || email}.`, "success");
        
        guardarSesion({
            id: result.id,
            nombre: result.nombre,
            email: email
        });
        
        document.querySelector("#formulario-ingreso form").reset();
        
        setTimeout(() => {
            cargarPerfilesYMostrar();
        }, 500);
    } catch (err) {
        displayMessage("No se pudo conectar con el servidor. Intenta nuevamente.", "error");
        console.error(err);
    }
});

// Register form
document.querySelector("#registerForm form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("nombre-usuario").value.trim();
    const email = document.getElementById("correo-registro").value.trim();
    const password = document.getElementById("clave-registro").value;
    const error = validateRegistration(name, email, password);

    if (error) {
        displayMessage(error, "error");
        return;
    }

    try {
        const response = await fetch(`${API_USUARIOS_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Nombre: name, email, Password: password })
        });

        if (!response.ok) {
            const message = await response.text();
            displayMessage(message || "Error al registrar el usuario.", "error");
            return;
        }

        const result = await response.json();
        displayMessage(`Cuenta creada para ${result.Nombre}. Ahora puedes iniciar sesión.`, "success");
        document.querySelector("#registerForm form").reset();
        if (feedback) {
            feedback.classList.remove("visible");
            updatePasswordFeedback("");
        }
    } catch (err) {
        displayMessage("No se pudo conectar con el servidor. Intenta nuevamente.", "error");
        console.error(err);
    }
});

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    setActiveTab("login");
    inicializarCatalog();
    verificarEstado();
});
