<template>
  <div class="admin-pantalla">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">CINEFLIX Admin</div>
      <nav class="sidebar-nav">
        <button :class="{ active: seccion === 'peliculas' }" @click="seccion = 'peliculas'">
          <Film :size="18" /> Películas
        </button>
        <button :class="{ active: seccion === 'usuarios' }" @click="seccion = 'usuarios'">
          <Users :size="18" /> Usuarios
        </button>
        <button :class="{ active: seccion === 'avatares' }" @click="seccion = 'avatares'">
          <ImageIcon :size="18" /> Avatares
        </button>
      </nav>
      <button class="btn-volver" @click="router.push('/catalogo')">
        <ArrowLeft :size="18" /> Volver al catálogo
      </button>
    </aside>

    <!-- CONTENIDO -->
    <main class="admin-main">

      <!-- ==================== PELÍCULAS ==================== -->
      <div v-if="seccion === 'peliculas'">
        <div class="admin-header">
          <h1>Películas</h1>
          <button class="btn-primary" @click="abrirModalPelicula(null)">
            <Plus :size="16" /> Añadir película
          </button>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla">
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Director</th>
                <th>Año</th>
                <th>Género</th>
                <th>Vídeo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pelicula in peliculas" :key="pelicula.id">
                <td>
                  <img v-if="pelicula.imagenUrl" :src="`http://localhost:5097${pelicula.imagenUrl}`" class="portada-mini" />
                  <div v-else class="portada-vacia"><ImageOff :size="20" /></div>
                </td>
                <td>{{ pelicula.titulo }}</td>
                <td>{{ pelicula.director }}</td>
                <td>{{ pelicula.anio }}</td>
                <td>{{ pelicula.genero || '—' }}</td>
                <td>
                  <span class="badge" :class="pelicula.videoUrl ? 'badge-ok' : 'badge-no'">
                    {{ pelicula.videoUrl ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="abrirModalPelicula(pelicula)" title="Editar"><Pencil :size="16" /></button>
                  <button class="btn-icon" @click="abrirModalPortada(pelicula)" title="Subir portada"><Image :size="16" /></button>
                  <button class="btn-icon" @click="abrirModalVideo(pelicula)" title="Subir video"><Film :size="16" /></button>
                  <button class="btn-icon danger" @click="eliminarPelicula(pelicula.id)" title="Eliminar"><Trash2 :size="16" /></button>
                </td>
              </tr>
              <tr v-if="peliculas.length === 0">
                <td colspan="7" class="vacio">No hay películas todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== USUARIOS ==================== -->
      <div v-if="seccion === 'usuarios'">
        <div class="admin-header">
          <h1>Usuarios</h1>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario.id">
                <td>{{ usuario.id }}</td>
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="badge" :class="usuario.esAdmin ? 'badge-ok' : 'badge-no'">
                    {{ usuario.esAdmin ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="toggleAdmin(usuario)" :title="usuario.esAdmin ? 'Quitar admin' : 'Hacer admin'">
                    <ShieldCheck v-if="!usuario.esAdmin" :size="16" />
                    <ShieldOff v-else :size="16" />
                  </button>
                  <button class="btn-icon danger" @click="eliminarUsuario(usuario.id)" title="Eliminar"><Trash2 :size="16" /></button>
                </td>
              </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="vacio">No hay usuarios todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== AVATARES ==================== -->
      <div v-if="seccion === 'avatares'">
        <div class="admin-header">
          <h1>Avatares</h1>
        </div>
        <div
          class="drop-zone"
          :class="{ 'drag-over': arrastandoAvatar }"
          @dragover.prevent="arrastandoAvatar = true"
          @dragleave="arrastandoAvatar = false"
          @drop.prevent="onDropAvatar"
          @click="$refs.inputAvatar.click()"
        >
          <Upload :size="32" />
          <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
          <small>PNG, JPG, WEBP</small>
          <input ref="inputAvatar" type="file" accept="image/*" style="display:none" @change="onSelectAvatar" />
        </div>
        <div v-if="subiendoAvatar" class="subiendo">Subiendo avatar...</div>
        <div class="avatares-grid">
          <div v-for="avatar in avatares" :key="avatar" class="avatar-item">
            <img :src="`http://localhost:5097${avatar}`" />
            <button class="btn-borrar-avatar" @click="eliminarAvatar(avatar)" title="Eliminar">
              <Trash2 :size="14" />
            </button>
          </div>
          <div v-if="avatares.length === 0" class="vacio-avatares">No hay avatares todavía. Sube el primero.</div>
        </div>
      </div>

    </main>

    <!-- ==================== MODAL PELÍCULA ==================== -->
    <div class="modal-overlay" v-if="modalPeliculaVisible" @click.self="cerrarModalPelicula">
      <div class="modal-contenido">
        <div class="modal-header">
          <h3>{{ peliculaEditando ? 'Editar película' : 'Añadir película' }}</h3>
          <button class="cerrar-modal" @click="cerrarModalPelicula"><X :size="20" /></button>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Título *</label>
            <input v-model="form.titulo" type="text" placeholder="Título de la película" />
          </div>
          <div class="field">
            <label>Director *</label>
            <input v-model="form.director" type="text" placeholder="Nombre del director" />
          </div>
          <div class="field">
            <label>Año *</label>
            <input v-model="form.anio" type="number" placeholder="2024" />
          </div>
          <div class="field field-full">
            <label>Géneros</label>
            <div class="generos-grid">
              <label v-for="g in generos" :key="g" class="genero-check">
                <input type="checkbox" :value="g" :checked="generosSeleccionados.includes(g)" @change="toggleGenero(g)" />
                {{ g }}
              </label>
            </div>
          </div>
          <div class="field field-full">
            <label>Sinopsis</label>
            <textarea v-model="form.sinopsis" rows="3" placeholder="Descripción de la película"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalPelicula">Cancelar</button>
          <button class="btn-primary" @click="guardarPelicula" :disabled="guardando">
            {{ guardando ? 'Guardando...' : peliculaEditando ? 'Guardar cambios' : 'Añadir película' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL PORTADA ==================== -->
    <div class="modal-overlay" v-if="modalPortadaVisible" @click.self="cerrarModalPortada">
      <div class="modal-contenido modal-archivo">
        <div class="modal-header">
          <h3>Subir portada - {{ peliculaEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalPortada"><X :size="20" /></button>
        </div>

        <div class="modal-body">
          <div
            class="drop-zone-small"
            :class="{ 'drag-over': arrastandoPortada }"
            @dragover.prevent="arrastandoPortada = true"
            @dragleave="arrastandoPortada = false"
            @drop.prevent="onDropPortada"
            @click="$refs.inputPortada.click()"
          >
            <div v-if="previewPortada" class="preview-portada-modal">
              <img :src="previewPortada" />
              <p>Portada seleccionada</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="32" />
              <p>Arrastra la portada aquí o haz clic</p>
              <small>PNG, JPG, WEBP</small>
            </div>
            <input ref="inputPortada" type="file" accept="image/*" style="display:none" @change="onSelectPortada" />
          </div>
          <div v-if="subiendoPortada" class="subiendo">Subiendo portada...</div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalPortada">Cancelar</button>
          <button class="btn-primary" @click="guardarPortada" :disabled="subiendoPortada || !archivoPortadaSeleccionado">
            {{ subiendoPortada ? 'Subiendo...' : 'Guardar portada' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL VIDEO ==================== -->
    <div class="modal-overlay" v-if="modalVideoVisible" @click.self="cerrarModalVideo">
      <div class="modal-contenido modal-archivo">
        <div class="modal-header">
          <h3>Subir video - {{ peliculaEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalVideo"><X :size="20" /></button>
        </div>

        <div class="modal-body">
          <div
            class="drop-zone-small"
            :class="{ 'drag-over': arrastandoVideo }"
            @dragover.prevent="arrastandoVideo = true"
            @dragleave="arrastandoVideo = false"
            @drop.prevent="onDropVideo"
            @click="$refs.inputVideo.click()"
          >
            <div v-if="previewVideo" class="drop-placeholder ok">
              <CheckCircle :size="32" />
              <p>Video seleccionado</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="32" />
              <p>Arrastra el video aquí o haz clic</p>
              <small>MP4, WebM, Ogg</small>
            </div>
            <input ref="inputVideo" type="file" accept="video/*" style="display:none" @change="onSelectVideo" />
          </div>
          <div v-if="subiendoVideo" class="subiendo">Subiendo video... puede tardar unos segundos.</div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalVideo">Cancelar</button>
          <button class="btn-primary" @click="guardarVideo" :disabled="subiendoVideo || !archivoVideoSeleccionado">
            {{ subiendoVideo ? 'Subiendo...' : 'Guardar video' }}
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
import {
  Film, Users, ArrowLeft, Plus, Pencil, Trash2, X,
  ImageOff, ShieldCheck, ShieldOff, Upload, CheckCircle, Image,
  Image as ImageIcon
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const seccion = ref('peliculas')
const peliculas = ref([])
const usuarios = ref([])
const avatares = ref([])

const modalPeliculaVisible = ref(false)
const peliculaEditando = ref(null)
const guardando = ref(false)

const modalPortadaVisible = ref(false)
const modalVideoVisible = ref(false)

const subiendoPortada = ref(false)
const subiendoVideo = ref(false)
const subiendoAvatar = ref(false)
const arrastandoPortada = ref(false)
const arrastandoVideo = ref(false)
const arrastandoAvatar = ref(false)

const inputPortada = ref(null)
const inputVideo = ref(null)
const inputAvatar = ref(null)

const archivoPortadaSeleccionado = ref(null)
const archivoVideoSeleccionado = ref(null)

const previewPortada = ref(null)
const previewVideo = ref(null)

const generos = [
  'Acción', 'Aventura', 'Comedia', 'Drama', 'Terror',
  'Ciencia Ficción', 'Documental', 'Animación', 'Thriller', 'Corto'
]

const generosSeleccionados = ref([])

const form = ref({
  titulo: '',
  director: '',
  sinopsis: '',
  anio: new Date().getFullYear(),
  genero: '',
  imagenUrl: '',
  videoUrl: '',
})

onMounted(() => {
  if (!auth.usuario?.esAdmin) {
    router.push('/catalogo')
    return
  }
  cargarPeliculas()
  cargarUsuarios()
  cargarAvatares()
})

async function cargarPeliculas() {
  try {
    const res = await axios.get('/api/Peliculas')
    peliculas.value = res.data
  } catch (error) {
    console.error('Error al cargar películas:', error)
  }
}

async function cargarUsuarios() {
  try {
    const res = await axios.get('/api/Usuarios')
    usuarios.value = res.data
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

async function cargarAvatares() {
  try {
    const res = await axios.get('/api/Perfiles/avatares')
    avatares.value = res.data
  } catch (error) {
    console.error('Error al cargar avatares:', error)
  }
}

// ---- GÉNEROS ----

function toggleGenero(g) {
  const idx = generosSeleccionados.value.indexOf(g)
  if (idx === -1) {
    generosSeleccionados.value.push(g)
  } else {
    generosSeleccionados.value.splice(idx, 1)
  }
  form.value.genero = generosSeleccionados.value.join(', ')
}

// ---- MODAL PELÍCULA ----

function abrirModalPelicula(pelicula) {
  peliculaEditando.value = pelicula
  if (pelicula) {
    form.value = {
      titulo: pelicula.titulo,
      director: pelicula.director,
      sinopsis: pelicula.sinopsis,
      anio: pelicula.anio,
      genero: pelicula.genero || '',
      imagenUrl: pelicula.imagenUrl || '',
      videoUrl: pelicula.videoUrl || '',
    }
    generosSeleccionados.value = pelicula.genero
      ? pelicula.genero.split(', ').filter(Boolean)
      : []
  } else {
    form.value = {
      titulo: '', director: '', sinopsis: '',
      anio: new Date().getFullYear(),
      genero: '', imagenUrl: '', videoUrl: '',
    }
    generosSeleccionados.value = []
  }
  modalPeliculaVisible.value = true
}

function cerrarModalPelicula() {
  modalPeliculaVisible.value = false
  peliculaEditando.value = null
  generosSeleccionados.value = []
}

async function guardarPelicula() {
  if (!form.value.titulo || !form.value.director || !form.value.anio) {
    alert('Por favor rellena título, director y año')
    return
  }
  guardando.value = true
  try {
    const anio = parseInt(form.value.anio)
    if (isNaN(anio)) {
      alert('El año debe ser un número válido')
      guardando.value = false
      return
    }

    let datos = {
      titulo: form.value.titulo,
      director: form.value.director,
      anio: anio,
      sinopsis: form.value.sinopsis || '',
      genero: form.value.genero || ''
    }

    if (peliculaEditando.value) {
      // Para editar, enviamos también los URLs
      datos.imagenUrl = form.value.imagenUrl || ''
      datos.videoUrl = form.value.videoUrl || ''
      await axios.put(`/api/Peliculas/${peliculaEditando.value.id}`, {
        id: peliculaEditando.value.id,
        ...datos
      })
      alert('Película actualizada correctamente')
    } else {
      // Para crear, NO enviamos URLs (se suben después)
      const res = await axios.post('/api/Peliculas', datos)
      peliculaEditando.value = res.data
      alert('Película creada correctamente. Ahora puedes subir portada y video.')
    }
    await cargarPeliculas()
    cerrarModalPelicula()
  } catch (error) {
    console.error('Error al guardar película:', error)
    alert(`Error al guardar: ${error.response?.data?.message || error.message}`)
  } finally {
    guardando.value = false
  }
}

async function eliminarPelicula(id) {
  if (!confirm('¿Seguro que quieres eliminar esta película?')) return
  try {
    await axios.delete(`/api/Peliculas/${id}`)
    await cargarPeliculas()
  } catch (error) {
    console.error('Error al eliminar película:', error)
  }
}

// ---- MODAL PORTADA ----

function abrirModalPortada(pelicula) {
  peliculaEditando.value = pelicula
  previewPortada.value = null
  archivoPortadaSeleccionado.value = null
  modalPortadaVisible.value = true
}

function cerrarModalPortada() {
  modalPortadaVisible.value = false
  archivoPortadaSeleccionado.value = null
  previewPortada.value = null
}

async function guardarPortada() {
  if (!archivoPortadaSeleccionado.value) {
    alert('Selecciona una imagen primero')
    return
  }
  await subirPortada(archivoPortadaSeleccionado.value)
  archivoPortadaSeleccionado.value = null
  previewPortada.value = null
  await cargarPeliculas()
  cerrarModalPortada()
  alert('Portada subida correctamente')
}

// ---- MODAL VIDEO ----

function abrirModalVideo(pelicula) {
  peliculaEditando.value = pelicula
  previewVideo.value = null
  archivoVideoSeleccionado.value = null
  modalVideoVisible.value = true
}

function cerrarModalVideo() {
  modalVideoVisible.value = false
  archivoVideoSeleccionado.value = null
  previewVideo.value = null
}

async function guardarVideo() {
  if (!archivoVideoSeleccionado.value) {
    alert('Selecciona un video primero')
    return
  }
  await subirVideo(archivoVideoSeleccionado.value)
  archivoVideoSeleccionado.value = null
  previewVideo.value = null
  await cargarPeliculas()
  cerrarModalVideo()
  alert('Video subido correctamente')
}

// ---- SUBIDA PORTADA ----

async function subirPortada(archivo) {
  if (!peliculaEditando.value || !archivo) {
    alert('Error: Película no encontrada o archivo no válido')
    return
  }
  subiendoPortada.value = true
  try {
    const fd = new FormData()
    fd.append('Archivo', archivo)
    const res = await axios.post(`/api/Peliculas/${peliculaEditando.value.id}/upload-portada`, fd)
    form.value.imagenUrl = res.data.url
  } catch (error) {
    console.error('Error al subir portada:', error)
    alert(`Error al subir portada: ${error.response?.data?.message || error.message}`)
  } finally {
    subiendoPortada.value = false
    arrastandoPortada.value = false
  }
}

function onDropPortada(e) {
  if (!peliculaEditando.value) return
  const archivo = e.dataTransfer.files[0]
  if (archivo) {
    archivoPortadaSeleccionado.value = archivo
    const reader = new FileReader()
    reader.onload = (event) => {
      previewPortada.value = event.target.result
    }
    reader.readAsDataURL(archivo)
  }
}

function onSelectPortada(e) {
  const archivo = e.target.files[0]
  if (archivo) {
    archivoPortadaSeleccionado.value = archivo
    const reader = new FileReader()
    reader.onload = (event) => {
      previewPortada.value = event.target.result
    }
    reader.readAsDataURL(archivo)
  }
}

// ---- SUBIDA VÍDEO ----

async function subirVideo(archivo) {
  if (!peliculaEditando.value || !archivo) {
    alert('Error: Película no encontrada o archivo no válido')
    return
  }
  subiendoVideo.value = true
  try {
    const fd = new FormData()
    fd.append('Archivo', archivo)
    const res = await axios.post(`/api/Peliculas/${peliculaEditando.value.id}/upload-video`, fd)
    form.value.videoUrl = res.data.url
  } catch (error) {
    console.error('Error al subir vídeo:', error)
    alert(`Error al subir video: ${error.response?.data?.message || error.message}`)
  } finally {
    subiendoVideo.value = false
    arrastandoVideo.value = false
  }
}

function onDropVideo(e) {
  if (!peliculaEditando.value) return
  const archivo = e.dataTransfer.files[0]
  if (archivo) {
    archivoVideoSeleccionado.value = archivo
    previewVideo.value = `Video: ${archivo.name}`
  }
}

function onSelectVideo(e) {
  const archivo = e.target.files[0]
  if (archivo) {
    archivoVideoSeleccionado.value = archivo
    previewVideo.value = `Video: ${archivo.name}`
  }
}

// ---- SUBIDA AVATAR ----

async function subirAvatar(archivo) {
  subiendoAvatar.value = true
  try {
    const fd = new FormData()
    fd.append('Archivo', archivo)
    await axios.post('/api/Perfiles/upload-avatar', fd)
    await cargarAvatares()
  } catch (error) {
    console.error('Error al subir avatar:', error)
  } finally {
    subiendoAvatar.value = false
    arrastandoAvatar.value = false
  }
}

function onDropAvatar(e) {
  const archivo = e.dataTransfer.files[0]
  if (archivo) subirAvatar(archivo)
}

function onSelectAvatar(e) {
  const archivo = e.target.files[0]
  if (archivo) subirAvatar(archivo)
}

async function eliminarAvatar(url) {
  if (!confirm('¿Seguro que quieres eliminar este avatar?')) return
  try {
    await axios.delete('/api/Perfiles/eliminar-avatar', { data: { url } })
    await cargarAvatares()
  } catch (error) {
    console.error('Error al eliminar avatar:', error)
  }
}

// ---- USUARIOS ----

async function toggleAdmin(usuario) {
  try {
    await axios.put(`/api/Usuarios/${usuario.id}`, {
      nombre: usuario.nombre,
      email: usuario.email,
      password: usuario.password || '',
      esAdmin: !usuario.esAdmin,
    })
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
  }
}

async function eliminarUsuario(id) {
  if (!confirm('¿Seguro que quieres eliminar este usuario?')) return
  try {
    await axios.delete(`/api/Usuarios/${id}`)
    await cargarUsuarios()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}
</script>

<style scoped>
.admin-pantalla {
  display: flex;
  min-height: 100vh;
  background: #f4f5f7;
  font-family: sans-serif;
  color: #1a1a2e;
}

.sidebar {
  width: 220px;
  background: #1a1a2e;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  gap: 0.5rem;
  flex-shrink: 0;
}

.sidebar-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #E50914;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border: none;
  background: none;
  color: #aaa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  text-align: left;
}

.sidebar-nav button:hover { background: rgba(255,255,255,0.08); color: #fff; }
.sidebar-nav button.active { background: #E50914; color: #fff; }

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: 1px solid #333;
  background: none;
  color: #aaa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  margin-top: auto;
}

.btn-volver:hover { border-color: #fff; color: #fff; }

.admin-main { flex: 1; padding: 2rem; overflow-y: auto; }

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.admin-header h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }

.tabla-contenedor {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
}

.tabla { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.tabla thead { background: #f8f9fa; }

.tabla th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #eee;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
}

.tabla tr:last-child td { border-bottom: none; }
.tabla tr:hover td { background: #fafafa; }

.portada-mini { width: 40px; height: 56px; object-fit: cover; border-radius: 4px; }

.portada-vacia {
  width: 40px;
  height: 56px;
  background: #eee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}

.badge { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
.badge-ok { background: #e6f9f0; color: #1a7a4a; }
.badge-no { background: #fde8e8; color: #c0392b; }

.acciones { display: flex; gap: 0.5rem; }

.btn-icon {
  background: none;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.4rem;
  cursor: pointer;
  color: #555;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.btn-icon:hover { background: #f0f0f0; color: #333; }
.btn-icon.danger:hover { background: #fde8e8; border-color: #e74c3c; color: #e74c3c; }

.vacio { text-align: center; color: #aaa; padding: 2rem !important; }

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #E50914;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) { background: #c0070f; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  padding: 0.6rem 1.2rem;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-secondary:hover { background: #f5f5f5; }

.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  margin-bottom: 1.5rem;
}

.drop-zone:hover, .drop-zone.drag-over { border-color: #E50914; background: #fff5f5; color: #E50914; }
.drop-zone p { margin: 0; font-size: 0.95rem; }
.drop-zone small { font-size: 0.8rem; color: #bbb; }

.drop-zone-small {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.drop-zone-small:hover, .drop-zone-small.drag-over { border-color: #E50914; background: #fff5f5; }

.drop-placeholder {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #aaa;
  font-size: 0.85rem;
}

.drop-placeholder.ok { color: #1a7a4a; }

.preview-portada { display: flex; align-items: center; gap: 0.75rem; }
.preview-portada img { width: 40px; height: 56px; object-fit: cover; border-radius: 4px; }
.preview-portada span { font-size: 0.8rem; color: #666; }

.preview-portada-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.preview-portada-modal img {
  max-width: 150px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: contain;
}

.preview-portada-modal p {
  font-size: 0.9rem;
  color: #1a7a4a;
  font-weight: 600;
}

.drop-placeholder-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #888;
  font-size: 0.9rem;
}

.drop-placeholder-modal p { margin: 0; }
.drop-placeholder-modal small { font-size: 0.8rem; color: #bbb; }

.subiendo { font-size: 0.82rem; color: #E50914; margin-top: 0.4rem; }

.avatares-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.avatar-item { position: relative; }

.avatar-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #eee;
}

.btn-borrar-avatar {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.7);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-item:hover .btn-borrar-avatar { opacity: 1; }
.btn-borrar-avatar:hover { background: #E50914; }

.vacio-avatares {
  grid-column: 1 / -1;
  text-align: center;
  color: #aaa;
  padding: 2rem;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.modal-contenido {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-archivo {
  max-width: 500px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 { margin: 0; font-size: 1.1rem; }

.cerrar-modal {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.cerrar-modal:hover { color: #333; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field-full { grid-column: 1 / -1; }
.field label { font-size: 0.82rem; font-weight: 600; color: #555; }

.field input,
.field textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  color: #333;
  background: #fff;
}

.field input:focus, .field textarea:focus { border-color: #E50914; }

.generos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.genero-check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  color: #444;
  cursor: pointer;
}

.genero-check input { cursor: pointer; accent-color: #E50914; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}
</style>