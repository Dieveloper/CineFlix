const API_BASE_URL = "http://localhost:5097/api";
const IMAGES_PATH = '../img/';
const DEFAULT_IMAGE = 'red.jpg'; // Imagen por defecto si no existe default.jpg

// Lista de imágenes disponibles en la carpeta img
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalog();
    verificarEstado();
    configurarEventosLogin();
});

// Verificar estado de autenticación y mostrar pantalla correcta
function verificarEstado() {
    const autenticado = localStorage.getItem('autenticado') === 'true';
    const perfilId = localStorage.getItem('perfil_id');

    if (autenticado && perfilId) {
        showScreen('catalog-screen');
    } else if (autenticado) {
        // Si está autenticado pero no tiene perfil seleccionado, ir a selección de perfiles
        cargarPerfilesYMostrar();
    } else {
        showScreen('login-screen');
    }
}

// Función para mostrar una pantalla específica
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    el.classList.add('active');
    el.classList.remove('fade-enter');
    void el.offsetWidth;
    el.classList.add('fade-enter');
}

// ---- FUNCIONES DE AUTH ----
function configurarEventosLogin() {
    // Tabs de login/register
    document.getElementById('loginTab').addEventListener('click', () => {
        document.getElementById('loginTab').classList.add('active');
        document.getElementById('registerTab').classList.remove('active');
        document.getElementById('loginForm').classList.add('activo');
        document.getElementById('registerForm').classList.remove('activo');
    });

    document.getElementById('registerTab').addEventListener('click', () => {
        document.getElementById('registerTab').classList.add('active');
        document.getElementById('loginTab').classList.remove('active');
        document.getElementById('registerForm').classList.add('activo');
        document.getElementById('loginForm').classList.remove('activo');
    });

    // Validación de password
    document.getElementById('registerPassword').addEventListener('input', (e) => {
        validarPassword(e.target.value);
    });

    // Formulario de login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await iniciarSesion(email, password);
    });

    // Formulario de registro
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        await registrarUsuario(nombre, email, password);
    });
}

// Validar password con indicadores
function validarPassword(password) {
    const checks = {
        checkLength: password.length >= 8,
        checkUpper: /[A-Z]/.test(password),
        checkLower: /[a-z]/.test(password),
        checkDigit: /[0-9]/.test(password),
        checkSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const feedback = document.getElementById('passwordFeedback');
    const bar = document.getElementById('passwordStrengthBar');
    
    if (password.length > 0) {
        feedback.classList.add('mostrar');
        let validos = Object.values(checks).filter(c => c).length;
        bar.className = validos >= 4 ? 'fuerte' : '';
    } else {
        feedback.classList.remove('mostrar');
    }

    for (let [id, valido] of Object.entries(checks)) {
        const el = document.getElementById(id);
        el.className = valido ? 'valido' : '';
    }
}

// Iniciar sesión
async function iniciarSesion(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const usuario = await response.json();
            localStorage.setItem('usuario_id', usuario.id);
            localStorage.setItem('usuario_nombre', usuario.nombre);
            localStorage.setItem('usuario_email', usuario.email);
            localStorage.setItem('autenticado', 'true');
            
            // Después de iniciar sesión, ir a selección de perfiles (no al catálogo)
            cargarPerfilesYMostrar();
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (err) {
        alert('Error al iniciar sesión');
        console.error(err);
    }
}

// Registrar usuario
async function registrarUsuario(nombre, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        if (response.ok) {
            alert('Cuenta creada. Ahora puedes iniciar sesión.');
            document.getElementById('loginTab').click();
        } else {
            alert('Error al registrar. El correo puede estar en uso.');
        }
    } catch (err) {
        alert('Error al registrar');
        console.error(err);
    }
}

// Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('usuario_email');
    localStorage.removeItem('autenticado');
    localStorage.removeItem('perfil_id');
    localStorage.removeItem('perfil_nombre');
    showScreen('login-screen');
}

// ---- PERFILES ----
// Cargar perfiles del usuario y mostrar pantalla de perfiles
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
    showScreen('profile-screen');
}

// Mostrar perfiles en la pantalla
function mostrarPerfilesEnPantalla() {
    const container = document.getElementById('profiles-grid');
    container.innerHTML = '';

    perfilesCache.forEach((perfil) => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.onclick = () => seleccionarPerfil(perfil);
        
        // Usar la foto del perfil o la default
        const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
        
        card.innerHTML = `
            <div class="profile-avatar" style="background-image: url('${fotoPerfil}'); background-size: cover; background-position: center;"></div>
            <div class="profile-name">${perfil.nombre}</div>
        `;
        container.appendChild(card);
    });

    // Añadir botón de crear perfil
    const crearCard = document.createElement('div');
    crearCard.className = 'profile-card';
    crearCard.onclick = abrirModalCrearPerfil;
    crearCard.innerHTML = `
        <div class="add-profile">+</div>
        <div class="profile-name">Añadir</div>
    `;
    container.appendChild(crearCard);
}

// Seleccionar un perfil
function seleccionarPerfil(perfil) {
    localStorage.setItem('perfil_id', perfil.id);
    localStorage.setItem('perfil_nombre', perfil.nombre);
    
    // Actualizar avatar en el nav
    const navAvatar = document.getElementById('nav-avatar');
    const fotoPerfil = perfil.fotoUrl ? `${IMAGES_PATH}${perfil.fotoUrl}` : `${IMAGES_PATH}${DEFAULT_IMAGE}`;
    navAvatar.style.backgroundImage = `url('${fotoPerfil}')`;
    navAvatar.style.backgroundSize = 'cover';
    navAvatar.style.backgroundPosition = 'center';
    
    showScreen('catalog-screen');
}

// ---- MODAL CREAR PERFIL ----
let imagenSeleccionada = DEFAULT_IMAGE;

function abrirModalCrearPerfil() {
    const modal = document.getElementById('modal-crear-perfil');
    modal.classList.add('active');
    
    // Resetear la selección
    imagenSeleccionada = AVAILABLE_IMAGES[0];
    
    // Renderizar las opciones de imágenes
    const container = document.getElementById('imagenes-opciones');
    container.innerHTML = '';
    
    AVAILABLE_IMAGES.forEach((img, index) => {
        const imgDiv = document.createElement('div');
        imgDiv.className = 'imagen-opcion';
        if (index === 0) {
            imgDiv.classList.add('selected');
        }
        imgDiv.style.backgroundImage = `url('${IMAGES_PATH}${img}')`;
        imgDiv.dataset.img = img;
        imgDiv.onclick = function() {
            seleccionarImagen(this);
        };
        container.appendChild(imgDiv);
    });
}

function cerrarModalCrearPerfil() {
    document.getElementById('modal-crear-perfil').classList.remove('active');
    document.getElementById('nuevo-perfil-nombre').value = '';
}

function seleccionarImagen(element) {
    imagenSeleccionada = element.dataset.img;
    
    // Quitar selected de todas
    document.querySelectorAll('.imagen-opcion').forEach(el => el.classList.remove('selected'));
    // Agregar selected a la actual
    element.classList.add('selected');
}

async function crearNuevoPerfil() {
    const nombre = document.getElementById('nuevo-perfil-nombre').value.trim();
    if (!nombre) {
        alert('Ingresa un nombre para el perfil');
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
            await cargarPerfilesYMostrar();
            cerrarModalCrearPerfil();
        } else {
            const error = await response.text();
            alert('Error al crear el perfil: ' + error);
        }
    } catch (err) {
        alert('Error al crear el perfil');
        console.error(err);
    }
}

// ---- CATALOGO ----
// Inicializar el catálogo con las tarjetas
function inicializarCatalog() {
    makeCards('row-trending', DATA.trending);
    makeCards('row-series', DATA.series);
    makeCards('row-action', DATA.action);
    makeCards('row-docs', DATA.docs);
}

// Crear tarjetas para una fila del catálogo
function makeCards(rowId, items) {
    const el = document.getElementById(rowId);
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-bg" style="background:${item.c}">${item.e}</div>
            <div class="card-overlay">${item.t}</div>
        `;
        el.appendChild(card);
    });
}