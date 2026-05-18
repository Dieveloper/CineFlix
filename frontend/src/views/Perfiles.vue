<template>
  <div class="perfiles-pantalla">

    <!-- SELECCIÓN DE PERFIL -->
    <div v-if="!mostrarGestion">
      <div class="perfiles-titulo">¿QUIÉN VE ESTO?</div>
      <div class="perfiles-subtitulo">ELIGE TU PERFIL</div>

      <div class="profiles-grid">
        <!-- Perfiles existentes -->
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

        <!-- Botón añadir perfil -->
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
          <div class="opciones-imagen">
            <div
              v-for="avatar in avatares"
              :key="avatar"
              class="opcion-imagen"
              :class="{ selected: avatarSeleccionado === avatar }"
              :style="{ backgroundImage: `url(${avatar})` }"
              @click="avatarSeleccionado = avatar"
            ></div>
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

// Importa los avatares de tu carpeta assets
import avatar1 from '../assets/avatares/FLOWER_BOY.jpg'
import avatar2 from '../assets/avatares/KLK.jpg'
import avatar3 from '../assets/avatares/mecagoenlaputa.jpg'
import avatar4 from '../assets/avatares/omero.jpg'
import avatar5 from '../assets/avatares/red.jpg'

const router = useRouter()
const auth = useAuthStore()

const perfiles = ref([])
const mostrarGestion = ref(false)
const modalCrearVisible = ref(false)
const nuevoNombre = ref('')
const avatarSeleccionado = ref(null)
const creando = ref(false)

const avatares = [avatar1, avatar2, avatar3, avatar4, avatar5]

// Carga los perfiles del usuario al entrar
onMounted(async () => {
  if (!auth.usuario) {
    router.push('/login')
    return
  }
  await cargarPerfiles()
})

async function cargarPerfiles() {
  try {
    const res = await axios.get(`/api/Perfiles/usuario/${auth.usuario.id}`)
    perfiles.value = res.data
  } catch (error) {
    console.error('Error al cargar perfiles:', error)
  }
}

function getAvatarUrl(fotoUrl) {
  if (!fotoUrl) return avatar1
  // Si ya es una URL completa (importada), la devuelve tal cual
  if (fotoUrl.startsWith('data:') || fotoUrl.startsWith('blob:') || fotoUrl.startsWith('/src/')) return fotoUrl
  // Si es una ruta del backend
  return `http://localhost:5097${fotoUrl}`
}

function seleccionarPerfil(perfil) {
  // Guarda el perfil activo en el store y navega al catálogo
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
.perfiles-pantalla {
  min-height: 100vh;
  background: #141414;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  padding: 2rem;
}

.perfiles-titulo {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
}

.perfiles-subtitulo {
  text-align: center;
  font-size: 1rem;
  color: #999;
  letter-spacing: 2px;
  margin-bottom: 2.5rem;
}

/* GRID DE PERFILES */
.profiles-grid {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tarjeta-perfil {
  width: 150px;
  text-align: center;
  cursor: pointer;
}

.tarjeta-perfil:hover .avatar-perfil,
.tarjeta-perfil:hover .agregar-perfil {
  border: 3px solid #fff;
  transform: scale(1.05);
}

.avatar-perfil {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  background-color: #333;
  margin-bottom: 0.75rem;
  border: 3px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.agregar-perfil {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #666;
  border: 3px dashed #444;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s, transform 0.2s;
}

.nombre-perfil {
  font-size: 0.95rem;
  color: #ccc;
}

.btn-gestionar-perfiles {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 1.5rem;
  background: transparent;
  border: 1px solid #666;
  color: #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-gestionar-perfiles:hover {
  border-color: #fff;
  color: #fff;
}

/* GESTIÓN */
.gestion-perfiles {
  width: 100%;
  max-width: 500px;
}

.gestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.gestion-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-volver {
  background: none;
  border: 1px solid #555;
  color: #ccc;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-volver:hover {
  border-color: #fff;
  color: #fff;
}

.lista-perfiles-gestion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.perfil-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: #2a2a2a;
}

.perfil-item-avatar {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  background-color: #444;
  flex-shrink: 0;
}

.perfil-item-info {
  flex: 1;
}

.perfil-item-info h4 {
  margin: 0;
  font-size: 1rem;
}

.btn-eliminar-perfil {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 0.4rem;
}

.btn-eliminar-perfil:hover {
  opacity: 1;
}

.btn-crear-perfil {
  width: 100%;
  padding: 0.75rem;
  background: #E50914;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.btn-crear-perfil:hover {
  background: #ff1f27;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-contenido {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
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
}

.cerrar-modal {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.cerrar-modal:hover {
  color: #fff;
}

.form-nuevo-perfil {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-nuevo-perfil label {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 0.25rem;
  display: block;
}

.form-nuevo-perfil input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2a2a2a;
  color: #fff;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
}

.form-nuevo-perfil input:focus {
  border-color: #666;
}

.etiqueta-foto {
  font-size: 0.85rem;
  color: #aaa;
  margin: 0;
}

.opciones-imagen {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.opcion-imagen {
  aspect-ratio: 1;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  background-color: #333;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.2s, transform 0.2s;
}

.opcion-imagen:hover {
  transform: scale(1.05);
}

.opcion-imagen.selected {
  border-color: #E50914;
}

.btn-guardar {
  padding: 0.75rem;
  background: #E50914;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  transition: background 0.2s;
}

.btn-guardar:hover:not(:disabled) {
  background: #ff1f27;
}

.btn-guardar:disabled {
  background: #4a0408;
  color: #555;
  cursor: not-allowed;
}
</style>