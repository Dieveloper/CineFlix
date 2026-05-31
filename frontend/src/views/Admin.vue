<template>
  <div class="admin-pantalla">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">CINEFLIX</div>
      <div class="sidebar-subtitle">Panel de control</div>
      <nav class="sidebar-nav">
        <button :class="{ active: seccion === 'peliculas' }" @click="seccion = 'peliculas'">
          <Film :size="16" /> Películas
        </button>
        <button :class="{ active: seccion === 'series' }" @click="seccion = 'series'">
          <Tv :size="16" /> Series
        </button>
        <button :class="{ active: seccion === 'usuarios' }" @click="seccion = 'usuarios'">
          <Users :size="16" /> Usuarios
        </button>
        <button :class="{ active: seccion === 'avatares' }" @click="seccion = 'avatares'">
          <ImageIcon :size="16" /> Avatares
        </button>
      </nav>
      <button class="btn-volver" @click="router.push('/catalogo')">
        <ArrowLeft :size="15" /> Volver al catálogo
      </button>
    </aside>

    <!-- CONTENIDO -->
    <main class="admin-main">

      <!-- ==================== PELÍCULAS ==================== -->
      <div v-if="seccion === 'peliculas'">
        <div class="admin-header">
          <div>
            <h1>Películas</h1>
            <p class="admin-subhead">Gestiona el catálogo de películas</p>
          </div>
          <button class="btn-primary" @click="abrirModalPelicula(null)">
            <Plus :size="15" /> Añadir película
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
                  <div v-else class="portada-vacia"><ImageOff :size="16" /></div>
                </td>
                <td class="td-titulo">{{ pelicula.titulo }}</td>
                <td class="td-secondary">{{ pelicula.director }}</td>
                <td class="td-secondary">{{ pelicula.anio }}</td>
                <td class="td-secondary">{{ pelicula.genero || '—' }}</td>
                <td>
                  <span class="badge" :class="pelicula.videoUrl ? 'badge-ok' : 'badge-no'">
                    {{ pelicula.videoUrl ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="abrirModalPelicula(pelicula)" title="Editar"><Pencil :size="14" /></button>
                  <button class="btn-icon" @click="abrirModalPortada(pelicula)" title="Subir portada"><Image :size="14" /></button>
                  <button class="btn-icon" @click="abrirModalVideo(pelicula)" title="Subir video"><Film :size="14" /></button>
                  <button class="btn-icon danger" @click="eliminarPelicula(pelicula.id)" title="Eliminar"><Trash2 :size="14" /></button>
                </td>
              </tr>
              <tr v-if="peliculas.length === 0">
                <td colspan="7" class="vacio">No hay películas todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== SERIES ==================== -->
      <div v-if="seccion === 'series'">
        <div class="admin-header">
          <div>
            <h1>Series</h1>
            <p class="admin-subhead">Gestiona el catálogo de series</p>
          </div>
          <button class="btn-primary" @click="abrirModalSerie(null)">
            <Plus :size="15" /> Añadir serie
          </button>
        </div>
        <div class="tabla-contenedor">
          <table class="tabla">
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Creador</th>
                <th>Año</th>
                <th>Género</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="serie in series" :key="serie.id">
                <td>
                  <img v-if="serie.imagenUrl" :src="`http://localhost:5097${serie.imagenUrl}`" class="portada-mini" />
                  <div v-else class="portada-vacia"><ImageOff :size="16" /></div>
                </td>
                <td class="td-titulo">{{ serie.titulo }}</td>
                <td class="td-secondary">{{ serie.creador }}</td>
                <td class="td-secondary">{{ serie.anio }}</td>
                <td class="td-secondary">{{ serie.genero || '—' }}</td>
                <td class="acciones">
                  <button class="btn-icon" @click="abrirModalSerie(serie)" title="Editar"><Pencil :size="14" /></button>
                  <button class="btn-icon" @click="abrirModalCapitulos(serie)" title="Capítulos"><Tv :size="14" /></button>
                  <button class="btn-icon" @click="abrirModalSeriePortada(serie)" title="Subir portada"><Image :size="14" /></button>
                  <button class="btn-icon danger" @click="eliminarSerie(serie.id)" title="Eliminar"><Trash2 :size="14" /></button>
                </td>
              </tr>
              <tr v-if="series.length === 0">
                <td colspan="6" class="vacio">No hay series todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== USUARIOS ==================== -->
      <div v-if="seccion === 'usuarios'">
        <div class="admin-header">
          <div>
            <h1>Usuarios</h1>
            <p class="admin-subhead">Gestión de cuentas y permisos</p>
          </div>
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
                <td class="td-secondary td-id">#{{ usuario.id }}</td>
                <td class="td-titulo">{{ usuario.nombre }}</td>
                <td class="td-secondary">{{ usuario.email }}</td>
                <td>
                  <span class="badge" :class="usuario.esAdmin ? 'badge-ok' : 'badge-neutral'">
                    {{ usuario.esAdmin ? 'Admin' : 'Usuario' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="toggleAdmin(usuario)" :title="usuario.esAdmin ? 'Quitar admin' : 'Hacer admin'">
                    <ShieldCheck v-if="!usuario.esAdmin" :size="14" />
                    <ShieldOff v-else :size="14" />
                  </button>
                  <button class="btn-icon danger" @click="eliminarUsuario(usuario.id)" title="Eliminar"><Trash2 :size="14" /></button>
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
          <div>
            <h1>Avatares</h1>
            <p class="admin-subhead">Imágenes de perfil disponibles</p>
          </div>
        </div>
        <div
          class="drop-zone"
          :class="{ 'drag-over': arrastandoAvatar }"
          @dragover.prevent="arrastandoAvatar = true"
          @dragleave="arrastandoAvatar = false"
          @drop.prevent="onDropAvatar"
          @click="$refs.inputAvatar.click()"
        >
          <Upload :size="28" />
          <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
          <small>PNG, JPG, WEBP</small>
          <input ref="inputAvatar" type="file" accept="image/*" style="display:none" @change="onSelectAvatar" />
        </div>
        <div v-if="subiendoAvatar" class="indicador-carga">
          <div class="spinner"></div>
          <span>Subiendo avatar...</span>
        </div>
        <div class="avatares-grid">
          <div v-for="avatar in avatares" :key="avatar" class="avatar-item">
            <img :src="`http://localhost:5097${avatar}`" />
            <button class="btn-borrar-avatar" @click="eliminarAvatar(avatar)" title="Eliminar">
              <Trash2 :size="12" />
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
          <button class="cerrar-modal" @click="cerrarModalPelicula"><X :size="18" /></button>
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
          <h3>Subir portada — {{ peliculaEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalPortada"><X :size="18" /></button>
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
              <Upload :size="28" />
              <p>Arrastra la portada aquí o haz clic</p>
              <small>PNG, JPG, WEBP</small>
            </div>
            <input ref="inputPortada" type="file" accept="image/*" style="display:none" @change="onSelectPortada" />
          </div>
          <div v-if="subiendoPortada" class="indicador-carga">
            <div class="spinner"></div>
            <span>Subiendo portada...</span>
          </div>
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
          <h3>Subir video — {{ peliculaEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalVideo"><X :size="18" /></button>
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
              <CheckCircle :size="28" />
              <p>Video seleccionado</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="28" />
              <p>Arrastra el video aquí o haz clic</p>
              <small>MP4, WebM, Ogg</small>
            </div>
            <input ref="inputVideo" type="file" accept="video/*" style="display:none" @change="onSelectVideo" />
          </div>
          <div v-if="subiendoVideo" class="indicador-carga">
            <div class="spinner"></div>
            <span>Subiendo video... puede tardar unos segundos.</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalVideo">Cancelar</button>
          <button class="btn-primary" @click="guardarVideo" :disabled="subiendoVideo || !archivoVideoSeleccionado">
            {{ subiendoVideo ? 'Subiendo...' : 'Guardar video' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL SERIE ==================== -->
    <div class="modal-overlay" v-if="modalSerieVisible" @click.self="cerrarModalSerie">
      <div class="modal-contenido">
        <div class="modal-header">
          <h3>{{ serieEditando ? 'Editar serie' : 'Añadir serie' }}</h3>
          <button class="cerrar-modal" @click="cerrarModalSerie"><X :size="18" /></button>
        </div>
        <div class="form-grid">
          <div class="field">
            <label>Título *</label>
            <input v-model="formSerie.titulo" type="text" placeholder="Título de la serie" />
          </div>
          <div class="field">
            <label>Creador *</label>
            <input v-model="formSerie.creador" type="text" placeholder="Nombre del creador" />
          </div>
          <div class="field">
            <label>Año *</label>
            <input v-model="formSerie.anio" type="number" placeholder="2024" />
          </div>
          <div class="field field-full">
            <label>Géneros</label>
            <div class="generos-grid">
              <label v-for="g in generos" :key="g" class="genero-check">
                <input type="checkbox" :value="g" :checked="generosSeleccionadosSerie.includes(g)" @change="toggleGeneroSerie(g)" />
                {{ g }}
              </label>
            </div>
          </div>
          <div class="field field-full">
            <label>Sinopsis</label>
            <textarea v-model="formSerie.sinopsis" rows="3" placeholder="Descripción de la serie"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalSerie">Cancelar</button>
          <button class="btn-primary" @click="guardarSerie" :disabled="guardando">
            {{ guardando ? 'Guardando...' : serieEditando ? 'Guardar cambios' : 'Añadir serie' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL CAPÍTULOS ==================== -->
    <div class="modal-overlay" v-if="modalCapitulosVisible" @click.self="cerrarModalCapitulos">
      <div class="modal-contenido modal-grande">
        <div class="modal-header">
          <h3>Capítulos — {{ serieEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalCapitulos"><X :size="18" /></button>
        </div>
        <div class="form-grid form-grid-capitulo">
          <div class="field">
            <label>Título del capítulo *</label>
            <input v-model="formCapitulo.titulo" type="text" placeholder="Título del capítulo" />
          </div>
          <div class="field">
            <label>Número *</label>
            <input v-model="formCapitulo.numero" type="number" min="1" />
          </div>
          <div class="field">
            <button class="btn-primary btn-add-cap" @click="crearCapitulo" type="button">
              <Plus :size="14" /> Añadir capítulo
            </button>
          </div>
        </div>
        <div class="tabla-contenedor tabla-modal">
          <table class="tabla">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Título</th>
                <th>Portada</th>
                <th>Video</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="capitulo in capitulos" :key="capitulo.id">
                <td class="td-secondary">{{ capitulo.numero }}</td>
                <td class="td-titulo">{{ capitulo.titulo }}</td>
                <td>
                  <img v-if="capitulo.imagenUrl" :src="`http://localhost:5097${capitulo.imagenUrl}`" class="portada-mini" />
                  <div v-else class="portada-vacia"><ImageOff :size="14" /></div>
                </td>
                <td>
                  <span class="badge" :class="capitulo.videoUrl ? 'badge-ok' : 'badge-no'">
                    {{ capitulo.videoUrl ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-icon" @click="abrirModalCapituloPortada(capitulo)" title="Subir portada"><Image :size="14" /></button>
                  <button class="btn-icon" @click="abrirModalCapituloVideo(capitulo)" title="Subir video"><Film :size="14" /></button>
                  <button class="btn-icon danger" @click="eliminarCapitulo(capitulo.id)" title="Eliminar"><Trash2 :size="14" /></button>
                </td>
              </tr>
              <tr v-if="capitulos.length === 0">
                <td colspan="5" class="vacio">No hay capítulos todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL PORTADA CAPÍTULO ==================== -->
    <div class="modal-overlay" v-if="modalCapituloPortadaVisible" @click.self="cerrarModalCapituloPortada">
      <div class="modal-contenido modal-archivo">
        <div class="modal-header">
          <h3>Subir portada — {{ capituloEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalCapituloPortada"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div
            class="drop-zone-small"
            :class="{ 'drag-over': arrastandoPortadaCapitulo }"
            @dragover.prevent="arrastandoPortadaCapitulo = true"
            @dragleave="arrastandoPortadaCapitulo = false"
            @drop.prevent="onDropPortadaCapitulo"
            @click="$refs.inputPortadaCapitulo.click()"
          >
            <div v-if="previewPortadaCapitulo" class="preview-portada-modal">
              <img :src="previewPortadaCapitulo" />
              <p>Portada seleccionada</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="28" />
              <p>Arrastra la portada aquí o haz clic</p>
              <small>PNG, JPG, WEBP</small>
            </div>
            <input ref="inputPortadaCapitulo" type="file" accept="image/*" style="display:none" @change="onSelectPortadaCapitulo" />
          </div>
          <div v-if="subiendoPortadaCapitulo" class="indicador-carga">
            <div class="spinner"></div>
            <span>Subiendo portada...</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalCapituloPortada">Cancelar</button>
          <button class="btn-primary" @click="guardarCapituloPortada" :disabled="subiendoPortadaCapitulo || !archivoPortadaCapituloSeleccionado">
            {{ subiendoPortadaCapitulo ? 'Subiendo...' : 'Guardar portada' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL VIDEO CAPÍTULO ==================== -->
    <div class="modal-overlay" v-if="modalCapituloVideoVisible" @click.self="cerrarModalCapituloVideo">
      <div class="modal-contenido modal-archivo">
        <div class="modal-header">
          <h3>Subir vídeo — {{ capituloEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalCapituloVideo"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div
            class="drop-zone-small"
            :class="{ 'drag-over': arrastandoVideoCapitulo }"
            @dragover.prevent="arrastandoVideoCapitulo = true"
            @dragleave="arrastandoVideoCapitulo = false"
            @drop.prevent="onDropVideoCapitulo"
            @click="$refs.inputVideoCapitulo.click()"
          >
            <div v-if="previewVideoCapitulo" class="preview-portada-modal">
              <p>{{ previewVideoCapitulo }}</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="28" />
              <p>Arrastra el vídeo aquí o haz clic</p>
              <small>MP4, WEBM, MOV</small>
            </div>
            <input ref="inputVideoCapitulo" type="file" accept="video/*" style="display:none" @change="onSelectVideoCapitulo" />
          </div>
          <div v-if="subiendoVideoCapitulo" class="indicador-carga">
            <div class="spinner"></div>
            <span>Subiendo video...</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalCapituloVideo">Cancelar</button>
          <button class="btn-primary" @click="guardarCapituloVideo" :disabled="subiendoVideoCapitulo || !archivoVideoCapituloSeleccionado">
            {{ subiendoVideoCapitulo ? 'Subiendo...' : 'Guardar vídeo' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL PORTADA SERIE ==================== -->
    <div class="modal-overlay" v-if="modalSeriePortadaVisible" @click.self="cerrarModalSeriePortada">
      <div class="modal-contenido modal-archivo">
        <div class="modal-header">
          <h3>Subir portada — {{ serieEditando?.titulo }}</h3>
          <button class="cerrar-modal" @click="cerrarModalSeriePortada"><X :size="18" /></button>
        </div>
        <div class="modal-body">
          <div
            class="drop-zone-small"
            :class="{ 'drag-over': arrastandoPortadaSerie }"
            @dragover.prevent="arrastandoPortadaSerie = true"
            @dragleave="arrastandoPortadaSerie = false"
            @drop.prevent="onDropPortadaSerie"
            @click="$refs.inputPortadaSerie.click()"
          >
            <div v-if="previewPortadaSerie" class="preview-portada-modal">
              <img :src="previewPortadaSerie" />
              <p>Portada seleccionada</p>
            </div>
            <div v-else class="drop-placeholder-modal">
              <Upload :size="28" />
              <p>Arrastra la portada aquí o haz clic</p>
              <small>PNG, JPG, WEBP</small>
            </div>
            <input ref="inputPortadaSerie" type="file" accept="image/*" style="display:none" @change="onSelectPortadaSerie" />
          </div>
          <div v-if="subiendoPortadaSerie" class="indicador-carga">
            <div class="spinner"></div>
            <span>Subiendo portada...</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="cerrarModalSeriePortada">Cancelar</button>
          <button class="btn-primary" @click="guardarSeriePortada" :disabled="subiendoPortadaSerie || !archivoPortadaSerieSeleccionado">
            {{ subiendoPortadaSerie ? 'Subiendo...' : 'Guardar portada' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<!-- El <script setup> es idéntico al original, sin cambios funcionales -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import {
  Film, Tv, Users, ArrowLeft, Plus, Pencil, Trash2, X,
  ImageOff, ShieldCheck, ShieldOff, Upload, CheckCircle, Image,
  Image as ImageIcon
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const seccion = ref('peliculas')
const peliculas = ref([])
const series = ref([])
const capitulos = ref([])
const usuarios = ref([])
const avatares = ref([])

const modalPeliculaVisible = ref(false)
const peliculaEditando = ref(null)
const modalSerieVisible = ref(false)
const serieEditando = ref(null)
const modalCapitulosVisible = ref(false)
const capituloEditando = ref(null)
const guardando = ref(false)

const modalPortadaVisible = ref(false)
const modalVideoVisible = ref(false)
const modalSeriePortadaVisible = ref(false)
const modalCapituloPortadaVisible = ref(false)
const modalCapituloVideoVisible = ref(false)

const subiendoPortada = ref(false)
const subiendoPortadaSerie = ref(false)
const subiendoVideo = ref(false)
const subiendoPortadaCapitulo = ref(false)
const subiendoVideoCapitulo = ref(false)
const subiendoAvatar = ref(false)
const arrastandoPortada = ref(false)
const arrastandoPortadaSerie = ref(false)
const arrastandoVideo = ref(false)
const arrastandoVideoCapitulo = ref(false)
const arrastandoAvatar = ref(false)
const arrastandoPortadaCapitulo = ref(false)

const inputPortada = ref(null)
const inputVideo = ref(null)
const inputAvatar = ref(null)
const inputPortadaSerie = ref(null)
const inputPortadaCapitulo = ref(null)
const inputVideoCapitulo = ref(null)

const archivoPortadaSeleccionado = ref(null)
const archivoPortadaSerieSeleccionado = ref(null)
const archivoPortadaCapituloSeleccionado = ref(null)
const archivoVideoSeleccionado = ref(null)
const archivoVideoCapituloSeleccionado = ref(null)

const previewPortada = ref(null)
const previewPortadaSerie = ref(null)
const previewPortadaCapitulo = ref(null)
const previewVideo = ref(null)
const previewVideoCapitulo = ref(null)

const generos = ['Acción', 'Aventura', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Documental', 'Animación', 'Thriller', 'Corto']
const generosSeleccionados = ref([])
const generosSeleccionadosSerie = ref([])

const form = ref({ titulo: '', director: '', sinopsis: '', anio: new Date().getFullYear(), genero: '', imagenUrl: '', videoUrl: '' })
const formSerie = ref({ titulo: '', creador: '', sinopsis: '', anio: new Date().getFullYear(), genero: '', imagenUrl: '', videoUrl: '' })
const formCapitulo = ref({ serieId: 0, titulo: '', numero: 1, imagenUrl: '', videoUrl: '' })

onMounted(() => {
  if (!auth.usuario?.esAdmin) { router.push('/catalogo'); return }
  cargarPeliculas(); cargarSeries(); cargarUsuarios(); cargarAvatares()
})

async function cargarPeliculas() { try { const res = await axios.get('/api/Peliculas'); peliculas.value = res.data } catch (e) { console.error(e) } }
async function cargarSeries() { try { const res = await axios.get('/api/Series'); series.value = res.data } catch (e) { console.error(e) } }
async function cargarCapitulos(serieId) { try { const res = await axios.get(`/api/Capitulos/serie/${serieId}`); capitulos.value = res.data } catch (e) { console.error(e) } }
async function cargarUsuarios() { try { const res = await axios.get('/api/Usuarios'); usuarios.value = res.data } catch (e) { console.error(e) } }
async function cargarAvatares() { try { const res = await axios.get('/api/Perfiles/avatares'); avatares.value = res.data } catch (e) { console.error(e) } }

function toggleGenero(g) { const i = generosSeleccionados.value.indexOf(g); i === -1 ? generosSeleccionados.value.push(g) : generosSeleccionados.value.splice(i, 1); form.value.genero = generosSeleccionados.value.join(', ') }
function toggleGeneroSerie(g) { const i = generosSeleccionadosSerie.value.indexOf(g); i === -1 ? generosSeleccionadosSerie.value.push(g) : generosSeleccionadosSerie.value.splice(i, 1); formSerie.value.genero = generosSeleccionadosSerie.value.join(', ') }

function abrirModalPelicula(pelicula) { peliculaEditando.value = pelicula; if (pelicula) { form.value = { titulo: pelicula.titulo, director: pelicula.director, sinopsis: pelicula.sinopsis, anio: pelicula.anio, genero: pelicula.genero || '', imagenUrl: pelicula.imagenUrl || '', videoUrl: pelicula.videoUrl || '' }; generosSeleccionados.value = pelicula.genero ? pelicula.genero.split(', ').filter(Boolean) : [] } else { form.value = { titulo: '', director: '', sinopsis: '', anio: new Date().getFullYear(), genero: '', imagenUrl: '', videoUrl: '' }; generosSeleccionados.value = [] }; modalPeliculaVisible.value = true }
function cerrarModalPelicula() { modalPeliculaVisible.value = false; peliculaEditando.value = null; generosSeleccionados.value = [] }

async function guardarPelicula() { if (!form.value.titulo || !form.value.director || !form.value.anio) { alert('Por favor rellena título, director y año'); return }; guardando.value = true; try { const anio = parseInt(form.value.anio); if (isNaN(anio)) { alert('El año debe ser un número válido'); guardando.value = false; return }; let datos = { titulo: form.value.titulo, director: form.value.director, anio, sinopsis: form.value.sinopsis || '', genero: form.value.genero || '' }; if (peliculaEditando.value) { datos.imagenUrl = form.value.imagenUrl || ''; datos.videoUrl = form.value.videoUrl || ''; await axios.put(`/api/Peliculas/${peliculaEditando.value.id}`, { id: peliculaEditando.value.id, ...datos }); alert('Película actualizada correctamente') } else { const res = await axios.post('/api/Peliculas', datos); peliculaEditando.value = res.data; alert('Película creada correctamente.') }; await cargarPeliculas(); cerrarModalPelicula() } catch (e) { console.error(e); alert(`Error al guardar: ${e.response?.data?.message || e.message}`) } finally { guardando.value = false } }
async function eliminarPelicula(id) { if (!confirm('¿Seguro que quieres eliminar esta película?')) return; try { await axios.delete(`/api/Peliculas/${id}`); await cargarPeliculas() } catch (e) { console.error(e) } }

function abrirModalSerie(serie) { serieEditando.value = serie; if (serie) { formSerie.value = { titulo: serie.titulo, creador: serie.creador, sinopsis: serie.sinopsis, anio: serie.anio, genero: serie.genero || '', imagenUrl: serie.imagenUrl || '', videoUrl: serie.videoUrl || '' }; generosSeleccionadosSerie.value = serie.genero ? serie.genero.split(', ').filter(Boolean) : [] } else { formSerie.value = { titulo: '', creador: '', sinopsis: '', anio: new Date().getFullYear(), genero: '', imagenUrl: '', videoUrl: '' }; generosSeleccionadosSerie.value = [] }; modalSerieVisible.value = true }
function cerrarModalSerie() { modalSerieVisible.value = false; serieEditando.value = null; generosSeleccionadosSerie.value = [] }

async function guardarSerie() { if (!formSerie.value.titulo || !formSerie.value.creador || !formSerie.value.anio) { alert('Por favor rellena título, creador y año'); return }; guardando.value = true; try { const anio = parseInt(formSerie.value.anio); if (isNaN(anio)) { alert('El año debe ser un número válido'); guardando.value = false; return }; let datos = { titulo: formSerie.value.titulo, creador: formSerie.value.creador, anio, sinopsis: formSerie.value.sinopsis || '', genero: formSerie.value.genero || '' }; if (serieEditando.value) { datos.imagenUrl = formSerie.value.imagenUrl || ''; datos.videoUrl = formSerie.value.videoUrl || ''; await axios.put(`/api/Series/${serieEditando.value.id}`, { id: serieEditando.value.id, ...datos }); alert('Serie actualizada correctamente') } else { const res = await axios.post('/api/Series', datos); serieEditando.value = res.data; alert('Serie creada correctamente.') }; await cargarSeries(); cerrarModalSerie() } catch (e) { console.error(e); alert(`Error al guardar serie: ${e.response?.data?.message || e.message}`) } finally { guardando.value = false } }
async function eliminarSerie(id) { if (!confirm('¿Seguro que quieres eliminar esta serie?')) return; try { await axios.delete(`/api/Series/${id}`); await cargarSeries() } catch (e) { console.error(e) } }

function abrirModalCapitulos(serie) { serieEditando.value = serie; formCapitulo.value.serieId = serie.id; formCapitulo.value.titulo = ''; formCapitulo.value.numero = capitulos.value.length + 1; modalCapitulosVisible.value = true; cargarCapitulos(serie.id) }
function cerrarModalCapitulos() { modalCapitulosVisible.value = false; serieEditando.value = null; capitulos.value = [] }
async function crearCapitulo() { if (!formCapitulo.value.titulo || !formCapitulo.value.numero) { alert('Rellena título y número de capítulo'); return }; try { await axios.post('/api/Capitulos', { serieId: formCapitulo.value.serieId, titulo: formCapitulo.value.titulo, numero: parseInt(formCapitulo.value.numero), imagenUrl: '', videoUrl: '' }); await cargarCapitulos(formCapitulo.value.serieId); formCapitulo.value.titulo = ''; formCapitulo.value.numero = capitulos.value.length + 2; alert('Capítulo creado correctamente') } catch (e) { console.error(e); alert(`Error al crear capítulo: ${e.response?.data?.message || e.message}`) } }
async function eliminarCapitulo(id) { if (!confirm('¿Seguro que quieres eliminar este capítulo?')) return; try { await axios.delete(`/api/Capitulos/${id}`); if (serieEditando.value) await cargarCapitulos(serieEditando.value.id) } catch (e) { console.error(e) } }

function abrirModalCapituloPortada(capitulo) { capituloEditando.value = capitulo; previewPortadaCapitulo.value = null; archivoPortadaCapituloSeleccionado.value = null; modalCapituloPortadaVisible.value = true }
function cerrarModalCapituloPortada() { modalCapituloPortadaVisible.value = false; archivoPortadaCapituloSeleccionado.value = null; previewPortadaCapitulo.value = null }
async function guardarCapituloPortada() { if (!archivoPortadaCapituloSeleccionado.value) { alert('Selecciona una imagen primero'); return }; await subirPortadaCapitulo(archivoPortadaCapituloSeleccionado.value); archivoPortadaCapituloSeleccionado.value = null; previewPortadaCapitulo.value = null; if (serieEditando.value) await cargarCapitulos(serieEditando.value.id); cerrarModalCapituloPortada(); alert('Portada de capítulo subida correctamente') }
async function subirPortadaCapitulo(archivo) { if (!capituloEditando.value || !archivo) { alert('Error: capítulo no encontrado o archivo no válido'); return }; subiendoPortadaCapitulo.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); const res = await axios.post(`/api/Capitulos/${capituloEditando.value.id}/upload-portada`, fd); formCapitulo.value.imagenUrl = res.data.url } catch (e) { console.error(e); alert(`Error: ${e.response?.data?.message || e.message}`) } finally { subiendoPortadaCapitulo.value = false; arrastandoPortadaCapitulo.value = false } }
function onDropPortadaCapitulo(e) { const a = e.dataTransfer.files[0]; if (a) { archivoPortadaCapituloSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortadaCapitulo.value = ev.target.result }; r.readAsDataURL(a) } }
function onSelectPortadaCapitulo(e) { const a = e.target.files[0]; if (a) { archivoPortadaCapituloSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortadaCapitulo.value = ev.target.result }; r.readAsDataURL(a) } }

function abrirModalCapituloVideo(capitulo) { capituloEditando.value = capitulo; previewVideoCapitulo.value = null; archivoVideoCapituloSeleccionado.value = null; modalCapituloVideoVisible.value = true }
function cerrarModalCapituloVideo() { modalCapituloVideoVisible.value = false; archivoVideoCapituloSeleccionado.value = null; previewVideoCapitulo.value = null }
async function guardarCapituloVideo() { if (!archivoVideoCapituloSeleccionado.value) { alert('Selecciona un video primero'); return }; await subirVideoCapitulo(archivoVideoCapituloSeleccionado.value); archivoVideoCapituloSeleccionado.value = null; previewVideoCapitulo.value = null; if (serieEditando.value) await cargarCapitulos(serieEditando.value.id); cerrarModalCapituloVideo(); alert('Video de capítulo subido correctamente') }
async function subirVideoCapitulo(archivo) { if (!capituloEditando.value || !archivo) { alert('Error'); return }; subiendoVideoCapitulo.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); const res = await axios.post(`/api/Capitulos/${capituloEditando.value.id}/upload-video`, fd); formCapitulo.value.videoUrl = res.data.url } catch (e) { console.error(e); alert(`Error: ${e.response?.data?.message || e.message}`) } finally { subiendoVideoCapitulo.value = false; arrastandoVideoCapitulo.value = false } }
function onDropVideoCapitulo(e) { const a = e.dataTransfer.files[0]; if (a) { archivoVideoCapituloSeleccionado.value = a; previewVideoCapitulo.value = `Video: ${a.name}` } }
function onSelectVideoCapitulo(e) { const a = e.target.files[0]; if (a) { archivoVideoCapituloSeleccionado.value = a; previewVideoCapitulo.value = `Video: ${a.name}` } }

function abrirModalSeriePortada(serie) { serieEditando.value = serie; previewPortadaSerie.value = null; archivoPortadaSerieSeleccionado.value = null; modalSeriePortadaVisible.value = true }
function cerrarModalSeriePortada() { modalSeriePortadaVisible.value = false; archivoPortadaSerieSeleccionado.value = null; previewPortadaSerie.value = null }
async function guardarSeriePortada() { if (!archivoPortadaSerieSeleccionado.value) { alert('Selecciona una imagen primero'); return }; await subirPortadaSerie(archivoPortadaSerieSeleccionado.value); archivoPortadaSerieSeleccionado.value = null; previewPortadaSerie.value = null; await cargarSeries(); cerrarModalSeriePortada(); alert('Portada de serie subida correctamente') }
async function subirPortadaSerie(archivo) { if (!serieEditando.value || !archivo) { alert('Error'); return }; subiendoPortadaSerie.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); const res = await axios.post(`/api/Series/${serieEditando.value.id}/upload-portada`, fd); formSerie.value.imagenUrl = res.data.url } catch (e) { console.error(e); alert(`Error: ${e.response?.data?.message || e.message}`) } finally { subiendoPortadaSerie.value = false; arrastandoPortadaSerie.value = false } }
function onDropPortadaSerie(e) { if (!serieEditando.value) return; const a = e.dataTransfer.files[0]; if (a) { archivoPortadaSerieSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortadaSerie.value = ev.target.result }; r.readAsDataURL(a) } }
function onSelectPortadaSerie(e) { const a = e.target.files[0]; if (a) { archivoPortadaSerieSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortadaSerie.value = ev.target.result }; r.readAsDataURL(a) } }

function abrirModalPortada(pelicula) { peliculaEditando.value = pelicula; previewPortada.value = null; archivoPortadaSeleccionado.value = null; modalPortadaVisible.value = true }
function cerrarModalPortada() { modalPortadaVisible.value = false; archivoPortadaSeleccionado.value = null; previewPortada.value = null }
async function guardarPortada() { if (!archivoPortadaSeleccionado.value) { alert('Selecciona una imagen primero'); return }; await subirPortada(archivoPortadaSeleccionado.value); archivoPortadaSeleccionado.value = null; previewPortada.value = null; await cargarPeliculas(); cerrarModalPortada(); alert('Portada subida correctamente') }
async function subirPortada(archivo) { if (!peliculaEditando.value || !archivo) { alert('Error'); return }; subiendoPortada.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); const res = await axios.post(`/api/Peliculas/${peliculaEditando.value.id}/upload-portada`, fd); form.value.imagenUrl = res.data.url } catch (e) { console.error(e); alert(`Error: ${e.response?.data?.message || e.message}`) } finally { subiendoPortada.value = false; arrastandoPortada.value = false } }
function onDropPortada(e) { if (!peliculaEditando.value) return; const a = e.dataTransfer.files[0]; if (a) { archivoPortadaSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortada.value = ev.target.result }; r.readAsDataURL(a) } }
function onSelectPortada(e) { const a = e.target.files[0]; if (a) { archivoPortadaSeleccionado.value = a; const r = new FileReader(); r.onload = ev => { previewPortada.value = ev.target.result }; r.readAsDataURL(a) } }

function abrirModalVideo(pelicula) { peliculaEditando.value = pelicula; previewVideo.value = null; archivoVideoSeleccionado.value = null; modalVideoVisible.value = true }
function cerrarModalVideo() { modalVideoVisible.value = false; archivoVideoSeleccionado.value = null; previewVideo.value = null }
async function guardarVideo() { if (!archivoVideoSeleccionado.value) { alert('Selecciona un video primero'); return }; await subirVideo(archivoVideoSeleccionado.value); archivoVideoSeleccionado.value = null; previewVideo.value = null; await cargarPeliculas(); cerrarModalVideo(); alert('Video subido correctamente') }
async function subirVideo(archivo) { if (!peliculaEditando.value || !archivo) { alert('Error'); return }; subiendoVideo.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); const res = await axios.post(`/api/Peliculas/${peliculaEditando.value.id}/upload-video`, fd); form.value.videoUrl = res.data.url } catch (e) { console.error(e); alert(`Error: ${e.response?.data?.message || e.message}`) } finally { subiendoVideo.value = false; arrastandoVideo.value = false } }
function onDropVideo(e) { if (!peliculaEditando.value) return; const a = e.dataTransfer.files[0]; if (a) { archivoVideoSeleccionado.value = a; previewVideo.value = `Video: ${a.name}` } }
function onSelectVideo(e) { const a = e.target.files[0]; if (a) { archivoVideoSeleccionado.value = a; previewVideo.value = `Video: ${a.name}` } }

async function subirAvatar(archivo) { subiendoAvatar.value = true; try { const fd = new FormData(); fd.append('Archivo', archivo); await axios.post('/api/Perfiles/upload-avatar', fd); await cargarAvatares() } catch (e) { console.error(e) } finally { subiendoAvatar.value = false; arrastandoAvatar.value = false } }
function onDropAvatar(e) { const a = e.dataTransfer.files[0]; if (a) subirAvatar(a) }
function onSelectAvatar(e) { const a = e.target.files[0]; if (a) subirAvatar(a) }
async function eliminarAvatar(url) { if (!confirm('¿Seguro que quieres eliminar este avatar?')) return; try { await axios.delete('/api/Perfiles/eliminar-avatar', { data: { url } }); await cargarAvatares() } catch (e) { console.error(e) } }

async function toggleAdmin(usuario) { try { await axios.put(`/api/Usuarios/${usuario.id}`, { nombre: usuario.nombre, email: usuario.email, password: usuario.password || '', esAdmin: !usuario.esAdmin }); await cargarUsuarios() } catch (e) { console.error(e) } }
async function eliminarUsuario(id) { if (!confirm('¿Seguro que quieres eliminar este usuario?')) return; try { await axios.delete(`/api/Usuarios/${id}`); await cargarUsuarios() } catch (e) { console.error(e) } }
</script>

<style scoped>
/* =============================================
   VARIABLES
   ============================================= */
.admin-pantalla {
  --crimson: #AD004F;
  --crimson-bright: #D4005F;
  --crimson-dark: #7A0037;
  --crimson-glow: rgba(173, 0, 79, 0.2);
  --crimson-subtle: rgba(173, 0, 79, 0.08);
  --bg-base: #0a0005;
  --bg-surface: #110008;
  --bg-card: #180010;
  --bg-elevated: #1e0013;
  --bg-main: #0f000a;
  --text-primary: #f5eef0;
  --text-secondary: #c4aab2;
  --text-muted: #7a6070;
  --border-subtle: rgba(173, 0, 79, 0.14);
  --border-medium: rgba(173, 0, 79, 0.28);
  --font-display: 'Georgia', 'Times New Roman', serif;
  --font-body: 'Trebuchet MS', 'Segoe UI', sans-serif;

  display: flex;
  min-height: 100vh;
  background: var(--bg-main);
  font-family: var(--font-body);
  color: var(--text-primary);
}

/* =============================================
   SIDEBAR
   ============================================= */
.sidebar {
  width: 210px;
  background: var(--bg-base);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1rem 1.25rem;
  gap: 0.25rem;
  flex-shrink: 0;
}

.sidebar-logo {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--crimson);
  letter-spacing: 4px;
  text-transform: uppercase;
  padding: 0 0.5rem;
  margin-bottom: 0.2rem;
}

.sidebar-subtitle {
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 0 0.5rem;
  margin-bottom: 1.75rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border: none;
  background: none;
  color: var(--text-muted);
  border-radius: 7px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: var(--font-body);
  transition: background 0.15s, color 0.15s;
  text-align: left;
  letter-spacing: 0.2px;
}

.sidebar-nav button:hover {
  background: var(--crimson-subtle);
  color: var(--text-secondary);
}

.sidebar-nav button.active {
  background: var(--crimson);
  color: white;
  font-weight: 600;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--border-subtle);
  background: none;
  color: var(--text-muted);
  border-radius: 7px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: var(--font-body);
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  margin-top: 0.5rem;
}

.btn-volver:hover {
  border-color: var(--border-medium);
  color: var(--text-secondary);
  background: var(--crimson-subtle);
}

/* =============================================
   MAIN
   ============================================= */
.admin-main {
  flex: 1;
  padding: 2rem 2.5rem;
  overflow-y: auto;
  background: var(--bg-main);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
}

.admin-header h1 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.admin-subhead {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  letter-spacing: 0.2px;
}

/* =============================================
   TABLA
   ============================================= */
.tabla-contenedor {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  overflow: hidden;
}

.tabla-modal {
  margin: 0 1.5rem 1.5rem;
  border-radius: 8px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla thead {
  background: var(--bg-elevated);
}

.tabla th {
  padding: 0.8rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-subtle);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.tabla td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--border-subtle);
  vertical-align: middle;
}

.tabla tr:last-child td { border-bottom: none; }

.tabla tbody tr:hover td {
  background: var(--crimson-subtle);
}

.td-titulo { color: var(--text-primary); font-weight: 500; }
.td-secondary { color: var(--text-muted); }
.td-id { font-size: 0.78rem; font-variant-numeric: tabular-nums; }

.portada-mini {
  width: 36px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
  border: 1px solid var(--border-subtle);
}

.portada-vacia {
  width: 36px;
  height: 50px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.badge {
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge-ok {
  background: rgba(20, 120, 70, 0.2);
  color: #4cda8a;
  border: 1px solid rgba(76, 218, 138, 0.2);
}

.badge-no {
  background: rgba(173, 0, 79, 0.15);
  color: var(--crimson-bright);
  border: 1px solid var(--border-medium);
}

.badge-neutral {
  background: var(--bg-elevated);
  color: var(--text-muted);
  border: 1px solid var(--border-subtle);
}

.acciones {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.btn-icon {
  background: none;
  border: 1px solid var(--border-subtle);
  border-radius: 5px;
  padding: 0.35rem;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: var(--crimson-subtle);
  border-color: var(--border-medium);
  color: var(--text-primary);
}

.btn-icon.danger:hover {
  background: rgba(173, 0, 79, 0.2);
  border-color: var(--crimson);
  color: var(--crimson-bright);
}

.vacio {
  text-align: center;
  color: var(--text-muted);
  padding: 2.5rem !important;
  font-style: italic;
  font-size: 0.875rem;
}

/* =============================================
   BOTONES GLOBALES
   ============================================= */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  background: var(--crimson);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-body);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  letter-spacing: 0.2px;
}

.btn-primary:hover:not(:disabled) {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px var(--crimson-glow);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  padding: 0.6rem 1.1rem;
  background: none;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-family: var(--font-body);
  transition: background 0.15s, color 0.15s;
}

.btn-secondary:hover {
  background: var(--crimson-subtle);
  color: var(--text-primary);
}

/* =============================================
   DROP ZONES
   ============================================= */
.drop-zone {
  border: 2px dashed var(--border-medium);
  border-radius: 10px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.drop-zone:hover,
.drop-zone.drag-over {
  border-color: var(--crimson);
  background: var(--crimson-subtle);
  color: var(--crimson-bright);
}

.drop-zone p { margin: 0; font-size: 0.9rem; }
.drop-zone small { font-size: 0.78rem; color: var(--text-muted); }

.drop-zone-small {
  border: 2px dashed var(--border-medium);
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: var(--bg-elevated);
  text-align: center;
}

.drop-zone-small:hover,
.drop-zone-small.drag-over {
  border-color: var(--crimson);
  background: var(--crimson-subtle);
}

.drop-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.drop-placeholder.ok { color: #4cda8a; }

.drop-placeholder-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.drop-placeholder-modal p { margin: 0; }
.drop-placeholder-modal small { font-size: 0.78rem; color: var(--text-muted); }

.preview-portada-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.preview-portada-modal img {
  max-width: 130px;
  max-height: 180px;
  border-radius: 6px;
  object-fit: contain;
  border: 1px solid var(--border-medium);
}

.preview-portada-modal p {
  font-size: 0.85rem;
  color: #4cda8a;
  font-weight: 600;
  margin: 0;
}

/* =============================================
   AVATARES
   ============================================= */
.avatares-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 0.875rem;
}

.avatar-item { position: relative; }

.avatar-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s;
  display: block;
}

.avatar-item:hover img { border-color: var(--border-medium); }

.btn-borrar-avatar {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(10, 0, 5, 0.8);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.avatar-item:hover .btn-borrar-avatar { opacity: 1; }
.btn-borrar-avatar:hover { background: var(--crimson); border-color: var(--crimson); color: white; }

.vacio-avatares {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-muted);
  padding: 2rem;
  font-size: 0.875rem;
  font-style: italic;
}

/* =============================================
   MODALES
   ============================================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 0, 10, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.modal-contenido {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px var(--border-subtle);
  scrollbar-width: thin;
  scrollbar-color: var(--border-medium) transparent;
}

.modal-grande { max-width: 680px; }
.modal-archivo { max-width: 460px; }

.modal-body { padding: 1.25rem 1.5rem; }

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.2px;
}

.cerrar-modal {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 0.3rem;
  border-radius: 5px;
  transition: color 0.15s, background 0.15s;
}

.cerrar-modal:hover {
  color: var(--text-primary);
  background: var(--crimson-subtle);
}

/* =============================================
   FORMULARIOS
   ============================================= */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
}

.form-grid-capitulo {
  grid-template-columns: 1fr 0.5fr auto;
  align-items: end;
  padding-bottom: 0.5rem;
}

.btn-add-cap { white-space: nowrap; height: fit-content; }

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-full { grid-column: 1 / -1; }

.field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.field input,
.field textarea {
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.field input:focus,
.field textarea:focus {
  border-color: var(--crimson);
  box-shadow: 0 0 0 3px var(--crimson-glow);
}

.field input::placeholder,
.field textarea::placeholder { color: var(--text-muted); }

.generos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem 0.75rem;
  padding: 0.5rem 0;
}

.genero-check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.825rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.genero-check input {
  cursor: pointer;
  accent-color: var(--crimson);
  width: auto;
  padding: 0;
  border: none;
  background: none;
  box-shadow: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid var(--border-subtle);
}

/* =============================================
   CARGA
   ============================================= */
.indicador-carga {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.875rem;
  background: var(--bg-elevated);
  border-radius: 7px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-medium);
  border-top-color: var(--crimson);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>