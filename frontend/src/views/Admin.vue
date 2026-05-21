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
      </nav>
      <button class="btn-volver" @click="router.push('/catalogo')">
        <ArrowLeft :size="18" /> Volver al catálogo
      </button>
    </aside>

    <!-- CONTENIDO -->
    <main class="admin-main">

      <!-- PELÍCULAS -->
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
                <th>Vídeo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pelicula in peliculas" :key="pelicula.id">
                <td>
                  <img
                    v-if="pelicula.imagenUrl"
                    :src="`http://localhost:5097${pelicula.imagenUrl}`"
                    class="portada-mini"
                  />
                  <div v-else class="portada-vacia"><ImageOff :size="20" /></div>
                </td>
                <td>{{ pelicula.titulo }}</td>
                <td>{{ pelicula.director }}</td>
                <td>{{ pelicula.anio }}</td>
                <td>
                  <span class="badge" :class="pelicula.videoUrl ? 'badge-ok' : 'badge-no'">
                    {{ pelicula.videoUrl ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="abrirModalPelicula(pelicula)" title="Editar">
                    <Pencil :size="16" />
                  </button>
                  <button class="btn-icon danger" @click="eliminarPelicula(pelicula.id)" title="Eliminar">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="peliculas.length === 0">
                <td colspan="6" class="vacio">No hay películas todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- USUARIOS -->
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
                  <button
                    class="btn-icon"
                    @click="toggleAdmin(usuario)"
                    :title="usuario.esAdmin ? 'Quitar admin' : 'Hacer admin'"
                  >
                    <ShieldCheck v-if="!usuario.esAdmin" :size="16" />
                    <ShieldOff v-else :size="16" />
                  </button>
                  <button class="btn-icon danger" @click="eliminarUsuario(usuario.id)" title="Eliminar">
                    <Trash2 :size="16" />
                  </button>
                </td>
              </tr>
              <tr v-if="usuarios.length === 0">
                <td colspan="5" class="vacio">No hay usuarios todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </main>

    <!-- MODAL PELÍCULA -->
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
            <label>Sinopsis</label>
            <textarea v-model="form.sinopsis" rows="3" placeholder="Descripción de la película"></textarea>
          </div>
          <div class="field field-full">
            <label>Ruta de portada</label>
            <input v-model="form.imagenUrl" type="text" placeholder="/peliculas/portadas/portada.webp" />
            <small>El archivo debe estar en <code>wwwroot/peliculas/portadas/</code></small>
          </div>
          <div class="field field-full">
            <label>Ruta del vídeo</label>
            <input v-model="form.videoUrl" type="text" placeholder="/peliculas/videos/pelicula.mp4" />
            <small>El archivo debe estar en <code>wwwroot/peliculas/videos/</code></small>
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

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { Film, Users, ArrowLeft, Plus, Pencil, Trash2, X, ImageOff, ShieldCheck, ShieldOff } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const seccion = ref('peliculas')
const peliculas = ref([])
const usuarios = ref([])
const modalPeliculaVisible = ref(false)
const peliculaEditando = ref(null)
const guardando = ref(false)

const form = ref({
  titulo: '',
  director: '',
  sinopsis: '',
  anio: new Date().getFullYear(),
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

function abrirModalPelicula(pelicula) {
  peliculaEditando.value = pelicula
  if (pelicula) {
    form.value = {
      titulo: pelicula.titulo,
      director: pelicula.director,
      sinopsis: pelicula.sinopsis,
      anio: pelicula.anio,
      imagenUrl: pelicula.imagenUrl || '',
      videoUrl: pelicula.videoUrl || '',
    }
  } else {
    form.value = {
      titulo: '',
      director: '',
      sinopsis: '',
      anio: new Date().getFullYear(),
      imagenUrl: '',
      videoUrl: '',
    }
  }
  modalPeliculaVisible.value = true
}

function cerrarModalPelicula() {
  modalPeliculaVisible.value = false
  peliculaEditando.value = null
}

async function guardarPelicula() {
  if (!form.value.titulo || !form.value.director || !form.value.anio) return
  guardando.value = true
  try {
    if (peliculaEditando.value) {
      await axios.put(`/api/Peliculas/${peliculaEditando.value.id}`, {
        id: peliculaEditando.value.id,
        ...form.value,
        anio: parseInt(form.value.anio),
      })
    } else {
      await axios.post('/api/Peliculas', {
        ...form.value,
        anio: parseInt(form.value.anio),
      })
    }
    await cargarPeliculas()
    cerrarModalPelicula()
  } catch (error) {
    console.error('Error al guardar película:', error)
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

async function toggleAdmin(usuario) {
  try {
    await axios.put(`/api/Usuarios/${usuario.id}`, {
      ...usuario,
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

/* SIDEBAR */
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

.sidebar-nav button:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}

.sidebar-nav button.active {
  background: #E50914;
  color: #fff;
}

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

.btn-volver:hover {
  border-color: #fff;
  color: #fff;
}

/* MAIN */
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

/* TABLA */
.tabla-contenedor {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabla thead {
  background: #f8f9fa;
}

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

.tabla tr:last-child td {
  border-bottom: none;
}

.tabla tr:hover td {
  background: #fafafa;
}

.portada-mini {
  width: 40px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
}

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

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-ok {
  background: #e6f9f0;
  color: #1a7a4a;
}

.badge-no {
  background: #fde8e8;
  color: #c0392b;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

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

.btn-icon:hover {
  background: #f0f0f0;
  color: #333;
}

.btn-icon.danger:hover {
  background: #fde8e8;
  border-color: #e74c3c;
  color: #e74c3c;
}

.vacio {
  text-align: center;
  color: #aaa;
  padding: 2rem !important;
}

/* BOTONES */
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

.btn-primary:hover:not(:disabled) {
  background: #c0070f;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.btn-secondary:hover {
  background: #f5f5f5;
}

/* MODAL */
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
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

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

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-full {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #555;
}

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
}

.field input:focus,
.field textarea:focus {
  border-color: #E50914;
}

.field small {
  font-size: 0.75rem;
  color: #999;
}

.field small code {
  background: #f0f0f0;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  font-size: 0.72rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}
</style>