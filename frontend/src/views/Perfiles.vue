<template>
  <div class="perfiles-pantalla">

    <!-- SELECCIÓN DE PERFIL -->
    <div v-if="!mostrarGestion">
      <div class="perfiles-titulo">¿QUIÉN VE ESTO?</div>
      <div class="perfiles-subtitulo">ELIGE TU PERFIL</div>

      <div class="profiles-grid">
        <div
          v-for="perfil in perfiles"
          :key="perfil.id"
          class="tarjeta-perfil"
          @click="seleccionarPerfil(perfil)"
        >
          <div
            class="avatar-perfil"
            :style="{ backgroundImage: `url(${getAvatarUrl(perfil.fotoUrl)})` }"
          ></div>
          <div class="nombre-perfil">{{ perfil.nombre }}</div>
        </div>

        <div class="tarjeta-perfil" @click="abrirModalCrear">
          <div class="agregar-perfil">+</div>
          <div class="nombre-perfil">Añadir perfil</div>
        </div>
      </div>

      <button class="btn-gestionar-perfiles" @click="mostrarGestion = true">
        Gestionar perfiles
      </button>
    </div>

    <!-- GESTIÓN DE PERFILES -->
    <div v-if="mostrarGestion" class="gestion-perfiles">
      <div class="gestion-header">
        <h2>Gestionar perfiles</h2>
        <button class="btn-volver" @click="mostrarGestion = false">← Volver</button>
      </div>

      <div class="lista-perfiles-gestion">
        <div v-for="perfil in perfiles" :key="perfil.id" class="perfil-item">
          <div
            class="perfil-item-avatar"
            :style="{ backgroundImage: `url(${getAvatarUrl(perfil.fotoUrl)})` }"
          ></div>
          <div class="perfil-item-info">
            <h4>{{ perfil.nombre }}</h4>
          </div>
          <button class="btn-eliminar-perfil" @click="eliminarPerfil(perfil.id)" title="Eliminar">
            🗑️
          </button>
        </div>
      </div>

      <button class="btn-crear-perfil" @click="abrirModalCrear">+ Añadir nuevo perfil</button>
    </div>

    <!-- MODAL CREAR PERFIL -->
    <div v-if="modalCrearVisible" class="modal-overlay" @click.self="cerrarModalCrear">
      <div class="modal-contenido">
        <div class="modal-header">
          <h3>Crear perfil</h3>
          <button class="cerrar-modal" @click="cerrarModalCrear">&times;</button>
        </div>

        <div class="form-nuevo-perfil">
          <label>Nombre del perfil</label>
          <input
            v-model="nuevoNombre"
            type="text"
            placeholder="Nombre del perfil"
            maxlength="20"
          />

          <p class="etiqueta-foto">Selecciona un avatar:</p>

          <div v-if="cargandoAvatares" class="cargando-avatares">Cargando avatares...</div>

          <div v-else class="opciones-imagen">
            <div
              v-for="avatar in avatares"
              :key="avatar"
              class="opcion-imagen"
              :class="{ selected: avatarSeleccionado === avatar }"
              :style="{ backgroundImage: `url(http://localhost:5097${avatar})` }"
              @click="avatarSeleccionado = avatar"
            ></div>
            <div v-if="avatares.length === 0" class="sin-avatares">
              No hay avatares disponibles.
            </div>
          </div>

          <button
            class="btn-guardar"
            :disabled="!nuevoNombre.trim() || !avatarSeleccionado || creando"
            @click="crearPerfil"
          >
            {{ creando ? 'Creando...' : 'Crear perfil' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()

const perfiles = ref([])
const avatares = ref([])
const mostrarGestion = ref(false)
const modalCrearVisible = ref(false)
const nuevoNombre = ref('')
const avatarSeleccionado = ref(null)
const creando = ref(false)
const cargandoAvatares = ref(false)

onMounted(async () => {
  if (!auth.usuario) {
    router.push('/login')
    return
  }
  await cargarPerfiles()
  await cargarAvatares()
})

async function cargarPerfiles() {
  try {
    const res = await axios.get(`/api/Perfiles/usuario/${auth.usuario.id}`)
    perfiles.value = res.data
  } catch (error) {
    console.error('Error al cargar perfiles:', error)
  }
}

async function cargarAvatares() {
  cargandoAvatares.value = true
  try {
    const res = await axios.get('/api/Perfiles/avatares')
    avatares.value = res.data
  } catch (error) {
    console.error('Error al cargar avatares:', error)
  } finally {
    cargandoAvatares.value = false
  }
}

function getAvatarUrl(fotoUrl) {
  if (!fotoUrl) return ''
  if (fotoUrl.startsWith('http')) return fotoUrl
  return `http://localhost:5097${fotoUrl}`
}

function seleccionarPerfil(perfil) {
  auth.perfilActivo = perfil
  localStorage.setItem('perfilActivo', JSON.stringify(perfil))
  router.push('/catalogo')
}

function abrirModalCrear() {
  nuevoNombre.value = ''
  avatarSeleccionado.value = null
  modalCrearVisible.value = true
}

function cerrarModalCrear() {
  modalCrearVisible.value = false
}

async function crearPerfil() {
  if (!nuevoNombre.value.trim() || !avatarSeleccionado.value) return
  creando.value = true
  try {
    await axios.post('/api/Perfiles', {
      nombre: nuevoNombre.value.trim(),
      usuarioId: auth.usuario.id,
      fotoUrl: avatarSeleccionado.value,
    })
    await cargarPerfiles()
    cerrarModalCrear()
  } catch (error) {
    console.error('Error al crear perfil:', error)
  } finally {
    creando.value = false
  }
}

async function eliminarPerfil(id) {
  if (!confirm('¿Seguro que quieres eliminar este perfil?')) return
  try {
    await axios.delete(`/api/Perfiles/${id}`)
    await cargarPerfiles()
  } catch (error) {
    console.error('Error al eliminar perfil:', error)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

.perfiles-pantalla {
  --crimson: #AD004F;
  --crimson-bright: #D4005F;
  --crimson-dark: #7A0037;
  --crimson-glow: rgba(173, 0, 79, 0.3);
  --crimson-subtle: rgba(173, 0, 79, 0.1);
  --bg-base: #0a0005;
  --bg-surface: #120009;
  --bg-card: #180010;
  --bg-elevated: #200015;
  --bg-main: #0a0005;
  --text-primary: #f5eef0;
  --text-secondary: #b09aa0;
  --text-muted: #6e5560;
  --border-subtle: rgba(173, 0, 79, 0.18);
  --border-medium: rgba(173, 0, 79, 0.35);
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;

  min-height: 100vh;
  background: radial-gradient(circle at top, rgba(173, 0, 79, 0.08), transparent 22%), var(--bg-main);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem 3rem;
  font-family: var(--font-body);
}

.perfiles-titulo {
  text-align: center;
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 0.35rem;
  color: var(--text-primary);
}

.perfiles-subtitulo {
  text-align: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 2px;
  margin-bottom: 2rem;
  text-transform: uppercase;
  font-weight: 600;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem;
  justify-items: center;
  width: 100%;
  max-width: 960px;
  margin-bottom: 2.5rem;
}

.tarjeta-perfil {
  width: 150px;
  text-align: center;
  cursor: pointer;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 7px;
  padding: 1rem 0.75rem 0.85rem;
  transition: transform 0.3s, border-color 0.2s, box-shadow 0.3s;
}

.tarjeta-perfil:hover {
  transform: scale(1.06) translateY(-3px);
  border-color: var(--border-medium);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 0 1px var(--border-medium);
}

.avatar-perfil,
.agregar-perfil {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 7px;
  margin-bottom: 0.85rem;
  transition: border-color 0.2s, transform 0.2s, background 0.2s;
}

.avatar-perfil {
  background-size: cover;
  background-position: center;
  background-color: var(--bg-base);
  border: 2px solid transparent;
}

.tarjeta-perfil:hover .avatar-perfil {
  border-color: var(--border-medium);
}

.agregar-perfil {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-base);
  border: 2px dashed var(--border-medium);
  color: var(--text-muted);
  font-size: 2.5rem;
}

.tarjeta-perfil:hover .agregar-perfil {
  border-color: var(--crimson);
  color: var(--crimson-bright);
}

.nombre-perfil {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.btn-gestionar-perfiles,
.btn-crear-perfil,
.btn-guardar,
.btn-volver {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.65rem 1.5rem;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.btn-gestionar-perfiles,
.btn-crear-perfil,
.btn-guardar {
  background: var(--crimson);
  color: white;
  border: none;
}

.btn-gestionar-perfiles:hover,
.btn-crear-perfil:hover,
.btn-guardar:hover:not(:disabled) {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 0, 95, 0.25);
}

.gestion-perfiles {
  width: min(100%, 720px);
  margin: 0 auto;
}

.gestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.gestion-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  padding-left: 0.875rem;
}

.gestion-header h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  height: 70%;
  width: 3px;
  background: var(--crimson);
  border-radius: 2px;
}

.btn-volver {
  border: 1px solid rgba(245, 238, 240, 0.2);
  background: rgba(245, 238, 240, 0.1);
  color: var(--text-primary);
}

.btn-volver:hover {
  background: rgba(245, 238, 240, 0.15);
  border-color: rgba(245, 238, 240, 0.3);
}

.lista-perfiles-gestion {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-bottom: 1.5rem;
}

.perfil-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 7px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.perfil-item:hover {
  border-color: var(--border-medium);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.perfil-item-avatar {
  width: 56px;
  height: 56px;
  border-radius: 7px;
  background-size: cover;
  background-position: center;
  background-color: var(--bg-base);
  border: 1px solid var(--border-medium);
  flex-shrink: 0;
}

.perfil-item-info {
  flex: 1;
}

.perfil-item-info h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
}

.btn-eliminar-perfil {
  margin-left: auto;
  background: none;
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  border-radius: 5px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  padding: 0.4rem;
  font-size: 0.9rem;
}

.btn-eliminar-perfil:hover {
  background: rgba(173, 0, 79, 0.12);
  border-color: var(--crimson);
  color: var(--crimson-bright);
}

.btn-crear-perfil {
  width: 100%;
  padding: 0.65rem 1.5rem;
  background: var(--crimson);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-crear-perfil:hover {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 0, 95, 0.25);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 0, 5, 0.92);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1.5rem;
}

.modal-contenido {
  width: min(100%, 520px);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-family: var(--font-display);
  font-weight: 700;
}

.cerrar-modal {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.cerrar-modal:hover {
  color: var(--text-primary);
}

.form-nuevo-perfil {
  display: grid;
  gap: 1rem;
}

.form-nuevo-perfil label {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.form-nuevo-perfil input {
  width: 100%;
  background: var(--bg-base);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  border-radius: 5px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s;
}

.form-nuevo-perfil input::placeholder {
  color: var(--text-muted);
}

.form-nuevo-perfil input:focus {
  border-color: var(--crimson);
}

.etiqueta-foto,
.cargando-avatares,
.sin-avatares {
  color: var(--text-muted);
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
}

.opciones-imagen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 0.75rem;
}

.opcion-imagen {
  aspect-ratio: 1;
  border-radius: 7px;
  background-size: cover;
  background-position: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.opcion-imagen:hover {
  border-color: var(--border-medium);
  transform: scale(1.06) translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.opcion-imagen.selected {
  border-color: var(--crimson);
  box-shadow: 0 0 0 1px var(--crimson);
}

.btn-guardar {
  padding: 0.65rem 1.5rem;
  background: var(--crimson);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-body);
  letter-spacing: 0.3px;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.btn-guardar:hover:not(:disabled) {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 0, 95, 0.25);
}

.btn-guardar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>