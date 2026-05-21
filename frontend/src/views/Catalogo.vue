<template>
  <div class="catalogo-pantalla">

    <!-- NAVBAR -->
    <nav class="navegacion" :class="{ scrolled: scrolled }">
      <div class="nav-lado">
        <span class="marca-nav">CINEFLIX</span>
        <div class="enlaces-nav">
          <a class="enlace-nav" :class="{ active: seccionActiva === 'inicio' }" @click="seccionActiva = 'inicio'">Inicio</a>
          <a class="enlace-nav" :class="{ active: seccionActiva === 'peliculas' }" @click="seccionActiva = 'peliculas'">Películas</a>
          <a class="enlace-nav" :class="{ active: seccionActiva === 'series' }" @click="seccionActiva = 'series'">Series</a>
        </div>
      </div>
      <div class="nav-lado-derecho">
        <!-- BÚSQUEDA -->
        <button class="btn-buscar" @click="toggleBuscar">
          <Search :size="20" />
        </button>

        <!-- AVATAR PERFIL -->
        <div class="desplegable-perfil" ref="dropdownRef">
          <div
            class="avatar-nav"
            :style="{ backgroundImage: `url(${avatarPerfil})` }"
            @click="toggleMenuPerfil"
          ></div>
          <div class="menu-perfil" :class="{ active: menuPerfilVisible }">
            <div class="encabezado-menu">{{ auth.perfilActivo?.nombre }}</div>
            <div class="divisor-menu"></div>
            
            <div class="opcion-menu" @click="cambiarPerfil">
              <UserCircle :size="16" /> Cambiar perfil
            </div>

            <div class="opcion-menu" v-if="auth.usuario?.esAdmin" @click="irAdmin">
              <Settings :size="16" /> Panel de control
            </div>

            <div class="divisor-menu"></div>
            <div class="opcion-menu" @click="cerrarSesion">
              <LogOut :size="16" /> Cerrar sesión
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- MODAL BÚSQUEDA -->
    <div class="modal-buscar" :class="{ active: buscarVisible }" @click.self="toggleBuscar">
      <div class="contenedor-buscar">
        <button class="cerrar-buscar" @click="toggleBuscar">
          <X :size="24" />
        </button>
        <div class="envoltorio-input">
          <Search :size="20" class="icono-buscar" />
          <input
            ref="inputBuscar"
            v-model="queryBuscar"
            type="text"
            placeholder="Buscar películas, series..."
          />
        </div>
        <div class="resultados-buscar">
          <div
            v-for="item in resultadosBuscar"
            :key="item.id + item.tipo"
            class="item-resultado"
            @click="abrirModal(item)"
          >
            <div class="icono-resultado" :style="{ background: colorAleatorio(item.id) }">
              <Film v-if="item.tipo === 'pelicula'" :size="22" />
              <Tv v-else :size="22" />
            </div>
            <div class="info-resultado">
              <h4>{{ item.titulo }}</h4>
              <p>{{ item.tipo === 'pelicula' ? 'Película' : 'Serie' }} · {{ item.anio }}</p>
            </div>
          </div>
          <p v-if="queryBuscar.length >= 2 && resultadosBuscar.length === 0" class="sin-resultados">
            No se encontraron resultados
          </p>
        </div>
      </div>
    </div>

    <!-- HERO -->
    <div class="hero" v-if="heroItem"
      :style="heroItem.imagenUrl
        ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #141414), url(http://localhost:5097${heroItem.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: colorAleatorio(heroItem.id) }"
    >
      <div class="hero-badge">★ DESTACADO HOY</div>
      <div class="hero-title">{{ heroItem.titulo }}</div>
      <div class="hero-desc">{{ heroItem.sinopsis }} · {{ heroItem.anio }}</div>
      <div class="hero-btns">
        <button class="btn-play" @click="abrirModal(heroItem)"><Play :size="18" /> Reproducir</button>
        <button class="btn-info" @click="abrirModal(heroItem)"><Info :size="18" /> Más info</button>
      </div>
    </div>
    <div class="hero hero-vacio" v-else>
      <div class="hero-badge">★ CINEFLIX</div>
      <div class="hero-title">Bienvenido</div>
      <div class="hero-desc">Pronto habrá contenido disponible.</div>
    </div>

    <!-- CATÁLOGO -->
    <div class="catalogo">

      <!-- PELÍCULAS -->
      <div class="fila" v-if="seccionActiva === 'inicio' || seccionActiva === 'peliculas'">
        <div class="titulo-fila">
          Películas
          <span @click="seccionActiva = 'peliculas'">Ver todo →</span>
        </div>
        <div class="tarjetas-deslizar">
          <div
            v-for="pelicula in peliculas"
            :key="pelicula.id"
            class="tarjeta"
            @click="abrirModal({ ...pelicula, tipo: 'pelicula' })"
          >
            <div
              class="fondo-tarjeta"
              :style="pelicula.imagenUrl
                ? { backgroundImage: `url(http://localhost:5097${pelicula.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: colorAleatorio(pelicula.id) }"
            >
              <Film v-if="!pelicula.imagenUrl" :size="40" />
            </div>
            <div class="overlay-tarjeta">{{ pelicula.titulo }}</div>
          </div>
          <p v-if="peliculas.length === 0" class="fila-vacia">No hay películas disponibles aún.</p>
        </div>
      </div>

      <!-- SERIES -->
      <div class="fila" v-if="seccionActiva === 'inicio' || seccionActiva === 'series'">
        <div class="titulo-fila">
          Series
          <span @click="seccionActiva = 'series'">Ver todo →</span>
        </div>
        <div class="tarjetas-deslizar">
          <div
            v-for="serie in series"
            :key="serie.id"
            class="tarjeta"
            @click="abrirModal({ ...serie, tipo: 'serie' })"
          >
            <div
              class="fondo-tarjeta"
              :style="serie.imagenUrl
                ? { backgroundImage: `url(http://localhost:5097${serie.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : { background: colorAleatorio(serie.id) }"
            >
              <Tv v-if="!serie.imagenUrl" :size="40" />
            </div>
            <div class="overlay-tarjeta">{{ serie.titulo }}</div>
          </div>
          <p v-if="series.length === 0" class="fila-vacia">No hay series disponibles aún.</p>
        </div>
      </div>

    </div>

    <!-- MODAL REPRODUCCIÓN / INFO -->
    <div class="modal-overlay" v-if="modalVisible" @click.self="cerrarModal">
      <div class="modal-contenido">
        <button class="cerrar-modal" @click="cerrarModal"><X :size="20" /></button>

        <div class="modal-video" v-if="itemSeleccionado?.videoUrl">
          <video controls autoplay :src="`http://localhost:5097${itemSeleccionado.videoUrl}`">
            Tu navegador no soporta el vídeo.
          </video>
        </div>
        <div class="modal-sin-video" v-else-if="itemSeleccionado?.imagenUrl"
          :style="{ backgroundImage: `url(http://localhost:5097${itemSeleccionado.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
        ></div>
        <div class="modal-sin-video" v-else :style="{ background: colorAleatorio(itemSeleccionado?.id) }">
          <Film v-if="itemSeleccionado?.tipo === 'pelicula'" :size="80" />
          <Tv v-else :size="80" />
        </div>

        <div class="modal-info">
          <div class="modal-badge">{{ itemSeleccionado?.tipo === 'pelicula' ? 'Película' : 'Serie' }}</div>
          <h2>{{ itemSeleccionado?.titulo }}</h2>
          <div class="modal-meta">
            <span>{{ itemSeleccionado?.anio }}</span>
            <span v-if="itemSeleccionado?.director">· Dir. {{ itemSeleccionado?.director }}</span>
            <span v-if="itemSeleccionado?.creador">· Creado por {{ itemSeleccionado?.creador }}</span>
          </div>
          <p class="modal-sinopsis">{{ itemSeleccionado?.sinopsis }}</p>
          <button class="btn-play-modal" v-if="itemSeleccionado?.videoUrl" @click="reproducir">
            <Play :size="16" /> Reproducir
          </button>
          <p class="proximamente" v-else>Próximamente disponible</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { Search, X, LogOut, Film, Tv, Play, Info, UserCircle, Settings } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const peliculas = ref([])
const series = ref([])
const seccionActiva = ref('inicio')
const scrolled = ref(false)
const menuPerfilVisible = ref(false)
const buscarVisible = ref(false)
const queryBuscar = ref('')
const modalVisible = ref(false)
const itemSeleccionado = ref(null)
const inputBuscar = ref(null)
const dropdownRef = ref(null)

// Avatar del perfil activo
const avatarPerfil = computed(() => {
  const perfil = auth.perfilActivo || JSON.parse(localStorage.getItem('perfilActivo'))
  if (!perfil?.fotoUrl) return ''
  if (perfil.fotoUrl.startsWith('/src/') || perfil.fotoUrl.startsWith('data:')) return perfil.fotoUrl
  return `http://localhost:5097${perfil.fotoUrl}`
})

// Hero — primera película o serie disponible
const heroItem = computed(() => {
  const todo = [
    ...peliculas.value.map(p => ({ ...p, tipo: 'pelicula' })),
    ...series.value.map(s => ({ ...s, tipo: 'serie' })),
  ]
  return todo.length > 0 ? todo[0] : null
})

// Búsqueda
const resultadosBuscar = computed(() => {
  if (queryBuscar.value.length < 2) return []
  const q = queryBuscar.value.toLowerCase()
  const peli = peliculas.value
    .filter(p => p.titulo.toLowerCase().includes(q))
    .map(p => ({ ...p, tipo: 'pelicula' }))
  const ser = series.value
    .filter(s => s.titulo.toLowerCase().includes(q))
    .map(s => ({ ...s, tipo: 'serie' }))
  return [...peli, ...ser]
})

// Color de fondo basado en el ID
function colorAleatorio(id) {
  const colores = [
    '#0f3460', '#3d0000', '#1a2a1a', '#1a0d2e',
    '#0a1628', '#002244', '#3d1200', '#1a1a0a',
    '#0d0d1a', '#0a1a0a', '#1a0d00', '#001a1a',
  ]
  return colores[(id || 0) % colores.length]
}

// Scroll navbar
function onScroll() {
  scrolled.value = window.scrollY > 50
}

// Menú perfil
function toggleMenuPerfil() {
  menuPerfilVisible.value = !menuPerfilVisible.value
}

function cerrarMenuFuera(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    menuPerfilVisible.value = false
  }
}

// Búsqueda
async function toggleBuscar() {
  buscarVisible.value = !buscarVisible.value
  if (buscarVisible.value) {
    await nextTick()
    inputBuscar.value?.focus()
  } else {
    queryBuscar.value = ''
  }
}

// Modal
function abrirModal(item) {
  itemSeleccionado.value = item
  modalVisible.value = true
  buscarVisible.value = false
}

function cerrarModal() {
  modalVisible.value = false
  itemSeleccionado.value = null
}

function reproducir() {
  // El vídeo ya está en el modal con autoplay
}

// Cerrar sesión
function cerrarSesion() {
  auth.logout()
  router.push('/login')
}

// Cargar datos
async function cargarDatos() {
  try {
    const [resPelis, resSeries] = await Promise.all([
      axios.get('/api/Peliculas'),
      axios.get('/api/Series'),
    ])
    peliculas.value = resPelis.data
    series.value = resSeries.data
  } catch (error) {
    console.error('Error al cargar datos:', error)
  }
}

// Escape para cerrar modales
function onKeydown(e) {
  if (e.key === 'Escape') {
    if (modalVisible.value) cerrarModal()
    if (buscarVisible.value) toggleBuscar()
  }
}

function cambiarPerfil() {
  menuPerfilVisible.value = false
  router.push('/perfiles')
}

function irAdmin() {
  menuPerfilVisible.value = false
  router.push('/admin')
}

onMounted(() => {
  if (!auth.usuario) {
    router.push('/login')
    return
  }
  cargarDatos()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('click', cerrarMenuFuera)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('click', cerrarMenuFuera)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.catalogo-pantalla {
  background: #141414;
  color: #fff;
  min-height: 100vh;
  font-family: sans-serif;
}

/* NAVBAR */
.navegacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: background 0.3s;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  box-sizing: border-box;
}

.navegacion.scrolled {
  background: #141414;
}

.nav-lado {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-lado-derecho {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.marca-nav {
  font-size: 1.5rem;
  font-weight: bold;
  color: #E50914;
  cursor: pointer;
  letter-spacing: 2px;
}

.enlaces-nav {
  display: flex;
  gap: 1.5rem;
}

.enlace-nav {
  color: #e5e5e5;
  font-size: 0.95rem;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: none;
}

.enlace-nav:hover,
.enlace-nav.active {
  color: white;
  font-weight: 600;
}

.btn-buscar {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.desplegable-perfil {
  position: relative;
}

.avatar-nav {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  background: #333;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.avatar-nav:hover {
  border-color: #fff;
}

.menu-perfil {
  display: none;
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 200px;
  padding: 0.5rem 0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}

.menu-perfil.active {
  display: block;
}

.encabezado-menu {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 600;
}

.divisor-menu {
  height: 1px;
  background: #333;
  margin: 0.4rem 0;
}

.opcion-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.opcion-menu:hover {
  background: #333;
}

/* BÚSQUEDA */
.modal-buscar {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 200;
  padding: 2rem;
}

.modal-buscar.active {
  display: block;
}

.contenedor-buscar {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.cerrar-buscar {
  position: absolute;
  top: -10px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.envoltorio-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #333;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
}

.icono-buscar { color: #999; }

.envoltorio-input input {
  flex: 1;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  outline: none;
  font-family: inherit;
}

.resultados-buscar {
  max-height: 60vh;
  overflow-y: auto;
}

.item-resultado {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.item-resultado:hover { background: #333; }

.icono-resultado {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-resultado h4 { margin: 0 0 0.25rem; font-size: 1rem; }
.info-resultado p { margin: 0; font-size: 0.85rem; color: #999; }

.sin-resultados {
  text-align: center;
  color: #666;
  padding: 2rem;
}

/* HERO */
.hero {
  padding: 8rem 2rem 4rem;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 800px;
  position: relative;
}

.hero-vacio {
  background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
}

.hero-badge {
  display: inline-block;
  background: #E50914;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: bold;
  margin: 0 0 1rem;
  line-height: 1.1;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
}

.hero-desc {
  font-size: 1rem;
  color: #ccc;
  max-width: 500px;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.hero-btns { display: flex; gap: 1rem; }

.btn-play, .btn-info {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-play { background: white; color: black; }
.btn-play:hover { background: #e5e5e5; }
.btn-info { background: rgba(109,109,110,0.7); color: white; }
.btn-info:hover { background: rgba(109,109,110,0.5); }

/* CATÁLOGO */
.catalogo { padding: 2rem; }

.fila { margin-bottom: 2.5rem; }

.titulo-fila {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo-fila span {
  font-size: 0.9rem;
  color: #54b9c5;
  cursor: pointer;
}

.titulo-fila span:hover { text-decoration: underline; }

.tarjetas-deslizar {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

.tarjetas-deslizar::-webkit-scrollbar { height: 6px; }
.tarjetas-deslizar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

.tarjeta {
  flex: 0 0 auto;
  width: 180px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.tarjeta:hover { transform: scale(1.05); }

.fondo-tarjeta {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.overlay-tarjeta {
  padding: 0.75rem;
  background: #1a1a1a;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fila-vacia {
  color: #666;
  font-size: 0.9rem;
  padding: 1rem 0;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-contenido {
  background: #1a1a1a;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.cerrar-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.6);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  line-height: 1;
}

.cerrar-modal:hover { background: rgba(0,0,0,0.9); }

.modal-video video {
  width: 100%;
  border-radius: 12px 12px 0 0;
  display: block;
  max-height: 400px;
  object-fit: cover;
}

.modal-sin-video {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  border-radius: 12px 12px 0 0;
}

.modal-info {
  padding: 1.5rem;
}

.modal-badge {
  display: inline-block;
  background: #E50914;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.modal-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

.modal-meta {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.modal-sinopsis {
  color: #ccc;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.btn-play-modal {
  padding: 0.75rem 2rem;
  background: white;
  color: black;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-play-modal:hover { background: #e5e5e5; }

.proximamente {
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .navegacion { padding: 1rem; }
  .enlaces-nav { gap: 1rem; }
  .tarjeta { width: 140px; }
  .hero { padding: 6rem 1rem 2rem; }
  .catalogo { padding: 1rem; }
}
</style>