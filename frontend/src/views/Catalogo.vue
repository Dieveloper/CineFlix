<template>
  <div class="catalogo-pantalla">

    <!-- NAVEGACIÓN -->
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
        <button class="btn-buscar" @click="toggleBuscar">
          <Search :size="20" />
        </button>
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
        ? { backgroundImage: `linear-gradient(to bottom, rgba(10,0,5,0.2) 0%, rgba(10,0,5,0.7) 60%, #0a0005 100%), url(http://localhost:5097${heroItem.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: colorAleatorio(heroItem.id) }"
    >
      <div class="hero-eyebrow">
        <span class="hero-badge">★ DESTACADO HOY</span>
      </div>
      <div class="hero-title">{{ heroItem.titulo }}</div>
      <div class="hero-desc">{{ heroItem.sinopsis }} · {{ heroItem.anio }}</div>
      <div class="hero-btns">
        <button class="btn-play" @click="abrirModal(heroItem)"><Play :size="18" /> Reproducir</button>
        <button class="btn-info" @click="abrirModal(heroItem)"><Info :size="18" /> Más info</button>
      </div>
    </div>
    <div class="hero hero-vacio" v-else>
      <div class="hero-eyebrow"><span class="hero-badge">★ CINEFLIX</span></div>
      <div class="hero-title">Bienvenido</div>
      <div class="hero-desc">Pronto habrá contenido disponible.</div>
    </div>

    <!-- CATÁLOGO -->
    <div class="catalogo">

      <!-- PELÍCULAS -->
      <div class="fila" v-if="seccionActiva === 'inicio' || seccionActiva === 'peliculas'">
        <div class="titulo-fila">
          <span class="titulo-fila-texto">Películas</span>
          <span class="ver-todo" @click="seccionActiva = 'peliculas'">Ver todo →</span>
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
              <div class="tarjeta-hover-overlay">
                <Play :size="28" class="play-icon-hover" />
              </div>
            </div>
            <div class="overlay-tarjeta">{{ pelicula.titulo }}</div>
          </div>
          <p v-if="peliculas.length === 0" class="fila-vacia">No hay películas disponibles aún.</p>
        </div>
      </div>

      <!-- SERIES -->
      <div class="fila" v-if="seccionActiva === 'inicio' || seccionActiva === 'series'">
        <div class="titulo-fila">
          <span class="titulo-fila-texto">Series</span>
          <span class="ver-todo" @click="seccionActiva = 'series'">Ver todo →</span>
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
              <div class="tarjeta-hover-overlay">
                <Play :size="28" class="play-icon-hover" />
              </div>
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

        <div class="modal-video" v-if="videoSeleccionado" :key="capituloSeleccionado?.id || 'pelicula'">
          <video ref="videoRef" controls :src="`http://localhost:5097${videoSeleccionado}`" @loadedmetadata="() => console.log('Video cargado')">
            Tu navegador no soporta el vídeo.
          </video>
        </div>
        <div class="modal-sin-video" v-else-if="itemSeleccionado?.imagenUrl"
          :style="{ backgroundImage: `url(http://localhost:5097${itemSeleccionado.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
        ></div>
        <div class="modal-sin-video modal-sin-video--fallback" v-else :style="{ background: colorAleatorio(itemSeleccionado?.id) }">
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

          <!-- CAPÍTULOS SERIE -->
          <div v-if="itemSeleccionado?.tipo === 'serie' && capitulos.length > 0" class="seccion-capitulos">
            <h3>Capítulos</h3>
            <div class="lista-capitulos">
              <div
                v-for="cap in capitulos"
                :key="cap.id"
                class="item-capitulo"
                :class="{ active: capituloSeleccionado?.id === cap.id }"
                @click="() => { seleccionarCapitulo(cap); console.log('Capítulo seleccionado:', cap) }"
              >
                <div class="portada-cap"
                  :style="cap.imagenUrl
                    ? { backgroundImage: `url(http://localhost:5097${cap.imagenUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : { background: '#1a0010' }"
                >
                  <div class="numero-overlay">{{ cap.numero }}</div>
                </div>
                <div class="info-cap">
                  <div class="titulo-cap">{{ cap.titulo }}</div>
                  <div class="estado-cap">{{ cap.videoUrl ? '✓ Video disponible' : 'Sin video' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- BOTONES -->
          <div class="modal-acciones">
            <button class="btn-play-modal" v-if="videoSeleccionado || (itemSeleccionado?.tipo === 'pelicula' && itemSeleccionado?.videoUrl)" @click="reproducir">
              <Play :size="16" /> Reproducir
            </button>
            <button class="btn-play-modal" v-else-if="itemSeleccionado?.tipo === 'serie' && capituloSeleccionado?.videoUrl" @click="reproducir">
              <Play :size="16" /> Reproducir capítulo
            </button>
            <p class="proximamente" v-else>Contenido no disponible aún</p>
          </div>
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
const capitulos = ref([])
const seccionActiva = ref('inicio')
const scrolled = ref(false)
const menuPerfilVisible = ref(false)
const buscarVisible = ref(false)
const queryBuscar = ref('')
const modalVisible = ref(false)
const itemSeleccionado = ref(null)
const capituloSeleccionado = ref(null)
const inputBuscar = ref(null)
const dropdownRef = ref(null)
const videoRef = ref(null)

const avatarPerfil = computed(() => {
  const perfil = auth.perfilActivo || JSON.parse(localStorage.getItem('perfilActivo'))
  if (!perfil?.fotoUrl) return ''
  if (perfil.fotoUrl.startsWith('/src/') || perfil.fotoUrl.startsWith('data:')) return perfil.fotoUrl
  return `http://localhost:5097${perfil.fotoUrl}`
})

const videoSeleccionado = computed(() => {
  if (itemSeleccionado.value?.tipo === 'serie' && capituloSeleccionado.value) {
    return capituloSeleccionado.value.videoUrl
  } else if (itemSeleccionado.value?.tipo === 'pelicula') {
    return itemSeleccionado.value.videoUrl
  }
  return null
})

const heroItem = computed(() => {
  const todo = [
    ...peliculas.value.map(p => ({ ...p, tipo: 'pelicula' })),
    ...series.value.map(s => ({ ...s, tipo: 'serie' })),
  ]
  return todo.length > 0 ? todo[0] : null
})

const resultadosBuscar = computed(() => {
  if (queryBuscar.value.length < 2) return []
  const q = queryBuscar.value.toLowerCase()
  const peli = peliculas.value.filter(p => p.titulo.toLowerCase().includes(q)).map(p => ({ ...p, tipo: 'pelicula' }))
  const ser = series.value.filter(s => s.titulo.toLowerCase().includes(q)).map(s => ({ ...s, tipo: 'serie' }))
  return [...peli, ...ser]
})

function colorAleatorio(id) {
  const colores = [
    '#1a0010', '#0f0018', '#0a0a0a', '#1a000a',
    '#0d0005', '#150010', '#0a000f', '#100005',
    '#0d0d0d', '#120008', '#0a0012', '#180010',
  ]
  return colores[(id || 0) % colores.length]
}

function onScroll() { scrolled.value = window.scrollY > 50 }
function toggleMenuPerfil() { menuPerfilVisible.value = !menuPerfilVisible.value }
function cerrarMenuFuera(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) menuPerfilVisible.value = false
}

async function toggleBuscar() {
  buscarVisible.value = !buscarVisible.value
  if (buscarVisible.value) { await nextTick(); inputBuscar.value?.focus() }
  else queryBuscar.value = ''
}

async function abrirModal(item) {
  itemSeleccionado.value = item
  modalVisible.value = true
  buscarVisible.value = false
  if (item.tipo === 'serie') {
    await cargarCapitulos(item.id)
    if (capitulos.value.length > 0) capituloSeleccionado.value = capitulos.value[0]
  } else {
    capitulos.value = []
    capituloSeleccionado.value = null
  }
}

async function cargarCapitulos(serieId) {
  try {
    const res = await axios.get(`/api/Capitulos/serie/${serieId}`)
    capitulos.value = res.data
  } catch (error) { console.error('Error al cargar capítulos:', error) }
}

function seleccionarCapitulo(capitulo) { capituloSeleccionado.value = capitulo }

watch(capituloSeleccionado, async (nuevo) => {
  if (nuevo && videoRef.value) {
    await nextTick()
    videoRef.value.load()
    videoRef.value.play().catch(() => {})
  }
})

function cerrarModal() {
  modalVisible.value = false
  itemSeleccionado.value = null
  capituloSeleccionado.value = null
  capitulos.value = []
  if (videoRef.value) { videoRef.value.pause(); videoRef.value.currentTime = 0 }
}

function reproducir() {
  if (!videoRef.value) { alert('Video no disponible'); return }
  if (videoRef.value.readyState >= 2) {
    videoRef.value.play().catch(err => { console.error('Error al reproducir:', err); alert('No se pudo reproducir el video') })
  } else {
    const onCanPlay = () => {
      videoRef.value.play().catch(err => console.error('Error:', err))
      videoRef.value.removeEventListener('canplay', onCanPlay)
    }
    videoRef.value.addEventListener('canplay', onCanPlay)
  }
}

function cerrarSesion() { auth.logout(); router.push('/login') }

async function cargarDatos() {
  try {
    const [resPelis, resSeries] = await Promise.all([axios.get('/api/Peliculas'), axios.get('/api/Series')])
    peliculas.value = resPelis.data
    series.value = resSeries.data
  } catch (error) { console.error('Error al cargar datos:', error) }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (modalVisible.value) cerrarModal()
    if (buscarVisible.value) toggleBuscar()
  }
}

function cambiarPerfil() { menuPerfilVisible.value = false; router.push('/perfiles') }
function irAdmin() { menuPerfilVisible.value = false; router.push('/admin') }

onMounted(() => {
  if (!auth.usuario) { router.push('/login'); return }
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
/* VARIABLES & BASE */
.catalogo-pantalla {
  --crimson: #AD004F;
  --crimson-bright: #D4005F;
  --crimson-dark: #7A0037;
  --crimson-glow: rgba(173, 0, 79, 0.25);
  --crimson-subtle: rgba(173, 0, 79, 0.08);
  --bg-base: #0a0005;
  --bg-surface: #120009;
  --bg-card: #180010;
  --bg-elevated: #200015;
  --bg-overlay: rgba(10, 0, 5, 0.96);
  --text-primary: #f5eef0;
  --text-secondary: #b09aa0;
  --text-muted: #6e5560;
  --border-subtle: rgba(173, 0, 79, 0.15);
  --border-medium: rgba(173, 0, 79, 0.3);
  --font-display: 'Georgia', 'Times New Roman', serif;
  --font-body: 'Trebuchet MS', 'Segoe UI', sans-serif;

  background: var(--bg-base);
  color: var(--text-primary);
  min-height: 100vh;
  font-family: var(--font-body);
}

/* NAVEGACIÓN */

.navegacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
  background: linear-gradient(to bottom, rgba(10,0,5,0.9) 0%, transparent 100%);
  box-sizing: border-box;
}

.navegacion.scrolled {
  background: rgba(10, 0, 5, 0.97);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.nav-lado {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-lado-derecho {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.marca-nav {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--crimson);
  cursor: pointer;
  letter-spacing: 4px;
  text-transform: uppercase;
  position: relative;
}

.marca-nav::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--crimson);
  opacity: 0.4;
}

.enlaces-nav {
  display: flex;
  gap: 2rem;
}

.enlace-nav {
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.enlace-nav:hover {
  color: var(--text-primary);
}

.enlace-nav.active {
  color: var(--text-primary);
  position: relative;
}

.enlace-nav.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--crimson);
  border-radius: 1px;
}

.btn-buscar {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  border-radius: 50%;
}

.btn-buscar:hover {
  color: var(--text-primary);
}

.desplegable-perfil {
  position: relative;
}

.avatar-nav {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg-elevated);
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.avatar-nav:hover {
  border-color: var(--crimson);
  transform: scale(1.05);
}

.menu-perfil {
  display: none;
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  min-width: 210px;
  padding: 0.5rem 0;
  box-shadow: 0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px var(--border-subtle);
}

.menu-perfil.active { display: block; }

.encabezado-menu {
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: 0.3px;
}

.divisor-menu {
  height: 1px;
  background: var(--border-subtle);
  margin: 0.3rem 0;
}

.opcion-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 1.1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
}

.opcion-menu:hover {
  background: var(--crimson-subtle);
  color: var(--text-primary);
}

/* MODAL BÚSQUEDA */

.modal-buscar {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(16px);
  z-index: 200;
  padding: 4rem 2rem 2rem;
}

.modal-buscar.active { display: block; }

.contenedor-buscar {
  max-width: 580px;
  margin: 0 auto;
  position: relative;
}

.cerrar-buscar {
  position: absolute;
  top: -2.5rem;
  right: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.cerrar-buscar:hover { color: var(--text-primary); }

.envoltorio-input {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border-medium);
  border-radius: 10px;
  padding: 0.85rem 1.1rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s;
}

.envoltorio-input:focus-within {
  border-color: var(--crimson);
  box-shadow: 0 0 0 3px var(--crimson-glow);
}

.icono-buscar { color: var(--text-muted); flex-shrink: 0; }

.envoltorio-input input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  font-family: var(--font-body);
}

.envoltorio-input input::placeholder { color: var(--text-muted); }

.resultados-buscar {
  max-height: 55vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.item-resultado {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.item-resultado:hover {
  background: var(--crimson-subtle);
}

.icono-resultado {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--text-secondary);
}

.info-resultado h4 { margin: 0 0 0.2rem; font-size: 0.95rem; color: var(--text-primary); }
.info-resultado p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }

.sin-resultados {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
  font-size: 0.9rem;
}

/* HERO */

.hero {
  padding: 9rem 3rem 5rem;
  min-height: 65vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 860px;
  position: relative;
}

.hero-vacio {
  background: linear-gradient(135deg, #0a0005, #1a0010) !important;
}

.hero-eyebrow {
  margin-bottom: 1.25rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--crimson);
  color: rgba(255,255,255,0.95);
  padding: 0.3rem 0.9rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 5.5vw, 4rem);
  font-weight: 700;
  margin: 0 0 1rem;
  line-height: 1.05;
  color: var(--text-primary);
  text-shadow: 0 2px 20px rgba(0,0,0,0.8);
  letter-spacing: -0.5px;
}

.hero-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  max-width: 460px;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.hero-btns { display: flex; gap: 0.875rem; }

.btn-play, .btn-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.btn-play {
  background: var(--crimson);
  color: white;
}

.btn-play:hover {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px var(--crimson-glow);
}

.btn-info {
  background: rgba(245, 238, 240, 0.1);
  color: var(--text-primary);
  border: 1px solid rgba(245, 238, 240, 0.2);
  backdrop-filter: blur(8px);
}

.btn-info:hover {
  background: rgba(245, 238, 240, 0.18);
  border-color: rgba(245, 238, 240, 0.35);
}

/* CATÁLOGO */

.catalogo {
  padding: 2.5rem 3rem 4rem;
}

.fila { margin-bottom: 3rem; }

.titulo-fila {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.25rem;
}

.titulo-fila-texto {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.3px;
  position: relative;
  padding-left: 1rem;
}

.titulo-fila-texto::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 3px;
  background: var(--crimson);
  border-radius: 2px;
}

.ver-todo {
  font-size: 0.8rem;
  color: var(--crimson);
  cursor: pointer;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.2s, letter-spacing 0.2s;
}

.ver-todo:hover {
  color: var(--crimson-bright);
  letter-spacing: 1px;
}

.tarjetas-deslizar {
  display: flex;
  gap: 0.875rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.tarjetas-deslizar::-webkit-scrollbar { height: 4px; }
.tarjetas-deslizar::-webkit-scrollbar-thumb { background: var(--border-medium); border-radius: 2px; }

.tarjeta {
  flex: 0 0 auto;
  width: 175px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
}

.tarjeta:hover {
  transform: scale(1.06) translateY(-4px);
  box-shadow: 0 12px 36px rgba(0,0,0,0.6), 0 0 0 1px var(--border-medium);
}

.fondo-tarjeta {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  position: relative;
  overflow: hidden;
}

.tarjeta-hover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(173, 0, 79, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.tarjeta:hover .tarjeta-hover-overlay {
  opacity: 1;
}

.play-icon-hover {
  color: white;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}

.overlay-tarjeta {
  padding: 0.7rem 0.75rem;
  background: var(--bg-card);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid var(--border-subtle);
  transition: color 0.2s;
}

.tarjeta:hover .overlay-tarjeta {
  color: var(--text-primary);
}

.fila-vacia {
  color: var(--text-muted);
  font-size: 0.875rem;
  padding: 1.5rem 0;
  font-style: italic;
}

/* MODAL */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 0, 10, 0.9);
  backdrop-filter: blur(8px);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-contenido {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px var(--border-subtle);
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.cerrar-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(10, 0, 5, 0.7);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
}

.cerrar-modal:hover {
  background: var(--crimson);
  color: white;
  border-color: var(--crimson);
}

.modal-video video {
  width: 100%;
  border-radius: 14px 14px 0 0;
  display: block;
  max-height: 400px;
  object-fit: contain;
  background: #000;
}

.modal-sin-video {
  width: 100%;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px 14px 0 0;
  color: var(--text-muted);
}

.modal-sin-video--fallback {
  position: relative;
}

.modal-sin-video--fallback::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, var(--bg-surface) 100%);
  border-radius: 14px 14px 0 0;
}

.modal-info {
  padding: 1.75rem 2rem 2rem;
}

.modal-badge {
  display: inline-block;
  background: var(--crimson-subtle);
  color: var(--crimson-bright);
  border: 1px solid var(--border-medium);
  padding: 0.2rem 0.7rem;
  border-radius: 3px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
}

.modal-info h2 {
  margin: 0 0 0.6rem;
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.3px;
}

.modal-meta {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 1.1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.modal-sinopsis {
  color: var(--text-secondary);
  line-height: 1.75;
  margin-bottom: 1.75rem;
  font-size: 0.9rem;
}

.btn-play-modal {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: var(--crimson);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  letter-spacing: 0.3px;
}

.btn-play-modal:hover {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--crimson-glow);
}

.proximamente {
  color: var(--text-muted);
  font-size: 0.875rem;
  font-style: italic;
}

/* CAPÍTULOS */

.seccion-capitulos {
  margin: 1.75rem 0;
  padding: 1.25rem;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
}

.seccion-capitulos h3 {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-family: var(--font-body);
  font-weight: 600;
}

.lista-capitulos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.item-capitulo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  background: var(--bg-card);
  border: 1px solid transparent;
  border-left: 3px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.item-capitulo:hover {
  background: var(--bg-elevated);
  border-left-color: var(--crimson);
  border-color: var(--border-subtle);
}

.item-capitulo.active {
  background: var(--bg-elevated);
  border-left-color: var(--crimson);
  border-color: var(--border-medium);
}

.portada-cap {
  width: 84px;
  height: 56px;
  border-radius: 5px;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--bg-base);
}

.numero-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  transition: background 0.2s;
  font-family: var(--font-display);
}

.item-capitulo:hover .numero-overlay,
.item-capitulo.active .numero-overlay {
  background: rgba(173, 0, 79, 0.75);
  color: white;
}

.info-cap { flex: 1; min-width: 0; }

.titulo-cap {
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.estado-cap {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
}

.item-capitulo.active .estado-cap {
  color: var(--crimson);
}

.modal-acciones {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: center;
}

/* RESPONSIVE */

@media (max-width: 768px) {
  .navegacion { padding: 1rem 1.25rem; }
  .enlaces-nav { gap: 1.25rem; }
  .tarjeta { width: 140px; }
  .hero { padding: 6.5rem 1.25rem 2.5rem; }
  .catalogo { padding: 1.5rem 1.25rem 3rem; }
  .titulo-fila-texto { font-size: 1.1rem; }
  .modal-info { padding: 1.25rem; }
  .modal-info h2 { font-size: 1.5rem; }
}
</style>