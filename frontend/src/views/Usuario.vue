<template>
  <div class="admin-pantalla">
    <main class="admin-main">
      <div class="admin-header">
        <div>
          <h1>Mi cuenta</h1>
          <p class="admin-subhead">Desde aquí puedes cambiar tu contraseña, cerrar sesión o eliminar tu cuenta.</p>
        </div>
      </div>

      <div class="acciones-superior">
        <button class="btn-volver" @click="router.push('/catalogo')">
          <ArrowLeft class="icono" /> Volver al catálogo
        </button>
      </div>

      <section class="tarjeta">
        <h2 class="titulo-seccion">Datos de la cuenta</h2>
        <div class="grid-cuenta">
          <div class="item-cuenta">
            <div class="etiqueta"><User class="icono" /> Nombre</div>
            <div class="valor">{{ auth.usuario?.nombre }}</div>
          </div>
          <div class="item-cuenta">
            <div class="etiqueta"><Mail class="icono" /> Email</div>
            <div class="valor">{{ auth.usuario?.email }}</div>
          </div>
        </div>
      </section>

      <section class="tarjeta">
        <div class="encabezado-seccion">
          <div>
            <h2 class="titulo-seccion">Cambiar contraseña</h2>
            <p class="descripcion-tarjeta">Introduce tu nueva contraseña y confirma.</p>
          </div>
        </div>

        <div class="grid-formulario">
          <label class="campo-formulario">
            <span class="etiqueta-campo"><Lock class="icono" /> Nueva contraseña</span>
            <div class="input-wrap">
              <input
                v-model="nuevaPassword"
                :type="mostrarNuevaPwd ? 'text' : 'password'"
                placeholder="Escribe tu nueva contraseña"
                class="entrada"
                @input="validarClave"
                :class="{
                  ok: fortaleza >= 60,
                  err: nuevaPassword.length > 0 && fortaleza < 40
                }"
              />
              <button
                type="button"
                class="eye-btn"
                @click="mostrarNuevaPwd = !mostrarNuevaPwd"
                :aria-label="mostrarNuevaPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <Eye v-if="!mostrarNuevaPwd" :size="17" />
                <EyeOff v-else :size="17" />
              </button>
            </div>
            <div class="retroalimentacion-clave" v-if="nuevaPassword.length > 0">
              <div class="barra-fondo">
                <div class="barra-fortaleza" :style="{ width: fortaleza + '%', background: colorFortaleza }"></div>
              </div>
              <ul>
                <li :class="{ valid: requisitos.largo, invalid: !requisitos.largo }">
                  {{ requisitos.largo ? '✓' : '✗' }} Mínimo 8 caracteres
                </li>
                <li :class="{ valid: requisitos.mayuscula, invalid: !requisitos.mayuscula }">
                  {{ requisitos.mayuscula ? '✓' : '✗' }} Una mayúscula
                </li>
                <li :class="{ valid: requisitos.minuscula, invalid: !requisitos.minuscula }">
                  {{ requisitos.minuscula ? '✓' : '✗' }} Una minúscula
                </li>
                <li :class="{ valid: requisitos.numero, invalid: !requisitos.numero }">
                  {{ requisitos.numero ? '✓' : '✗' }} Un número
                </li>
                <li :class="{ valid: requisitos.especial, invalid: !requisitos.especial }">
                  {{ requisitos.especial ? '✓' : '✗' }} Un carácter especial
                </li>
              </ul>
            </div>
          </label>

          <label class="campo-formulario">
            <span class="etiqueta-campo"><Lock class="icono" /> Confirmar contraseña</span>
            <div class="input-wrap">
              <input
                v-model="confirmarPassword"
                :type="mostrarConfirmPwd ? 'text' : 'password'"
                placeholder="Confirma la contraseña"
                class="entrada"
                :class="{
                  ok: confirmarPassword.length > 0 && confirmarPassword === nuevaPassword,
                  err: confirmarPassword.length > 0 && confirmarPassword !== nuevaPassword
                }"
              />
              <button
                type="button"
                class="eye-btn"
                @click="mostrarConfirmPwd = !mostrarConfirmPwd"
                :aria-label="mostrarConfirmPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <Eye v-if="!mostrarConfirmPwd" :size="17" />
                <EyeOff v-else :size="17" />
              </button>
            </div>
            <div v-if="confirmarPassword.length > 0" class="confirm-hint" :class="confirmarPassword === nuevaPassword ? 'ok' : 'err'">
              <span class="dot"></span>
              {{ confirmarPassword === nuevaPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
            </div>
          </label>
        </div>

        <button @click="cambiarPassword" :disabled="guardando" class="btn-primary">
          {{ guardando ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </section>

      <section class="tarjeta">
        <div class="espacio-entre">
          <div>
            <h2 class="titulo-seccion peligro">Eliminar cuenta</h2>
            <p class="descripcion-tarjeta">Esta acción es irreversible. Se eliminarán todos los datos del usuario.</p>
          </div>
          <button @click="borrarCuenta" class="btn-secondary"><Trash2 class="icono" /> Borrar cuenta</button>
        </div>
      </section>

      <div class="acciones-derecha">
        <button @click="cerrarSesion" class="btn-secondary"><LogOut class="icono" /> Cerrar sesión</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, Trash2, LogOut } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()
const nuevaPassword = ref('')
const confirmarPassword = ref('')
const mostrarNuevaPwd = ref(false)
const mostrarConfirmPwd = ref(false)
const guardando = ref(false)

const requisitos = ref({
  largo: false,
  mayuscula: false,
  minuscula: false,
  numero: false,
  especial: false,
})

const fortaleza = computed(() => {
  const cumplidos = Object.values(requisitos.value).filter(Boolean).length
  return (cumplidos / 5) * 100
})

const colorFortaleza = computed(() => {
  if (fortaleza.value <= 40) return '#e50914'
  if (fortaleza.value <= 80) return '#f5a623'
  return '#4caf50'
})

function validarClave() {
  const c = nuevaPassword.value
  requisitos.value = {
    largo: c.length >= 8,
    mayuscula: /[A-Z]/.test(c),
    minuscula: /[a-z]/.test(c),
    numero: /[0-9]/.test(c),
    especial: /[^A-Za-z0-9]/.test(c),
  }
}

if (!auth.usuario) {
  router.push('/login')
}

async function cambiarPassword() {
  if (!nuevaPassword.value || !confirmarPassword.value) {
    alert('Rellena ambos campos de contraseña.')
    return
  }

  if (nuevaPassword.value !== confirmarPassword.value) {
    alert('Las contraseñas no coinciden.')
    return
  }

  guardando.value = true
  try {
    await axios.put(`/api/Usuarios/${auth.usuario.id}`, {
      nombre: auth.usuario.nombre,
      email: auth.usuario.email,
      password: nuevaPassword.value,
      esAdmin: auth.usuario.esAdmin || false
    })

    alert('Contraseña actualizada correctamente.')
    nuevaPassword.value = ''
    confirmarPassword.value = ''
  } catch (error) {
    console.error(error)
    alert(`No se pudo cambiar la contraseña: ${error.response?.data || error.message}`)
  } finally {
    guardando.value = false
  }
}

async function borrarCuenta() {
  const confirmado = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')
  if (!confirmado) return

  try {
    await axios.delete(`/api/Usuarios/${auth.usuario.id}`)
    auth.logout()
    router.push('/login')
  } catch (error) {
    console.error(error)
    alert(`No se pudo eliminar la cuenta: ${error.response?.data || error.message}`)
  }
}

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
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

  min-height: 100vh;
  background: var(--bg-main);
  color: var(--text-primary);
  font-family: var(--font-body);
}

.admin-main {
  max-width: 980px;
  margin: 0 auto;
  padding: 2.5rem 2rem 3rem;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, 2.7rem);
  color: var(--text-primary);
}

.admin-subhead {
  margin: 0.75rem 0 0;
  color: var(--text-secondary);
  max-width: 760px;
  line-height: 1.7;
}

.tarjeta {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 22px;
  padding: 1.75rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.25);
}

.titulo-seccion {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--text-primary);
}

.descripcion-tarjeta {
  margin: 0.35rem 0 0;
  color: var(--text-secondary);
  line-height: 1.7;
}

.grid-cuenta,
.grid-formulario {
  display: grid;
  gap: 1rem;
}

.item-cuenta {
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: 16px;
}

.etiqueta,
.etiqueta-campo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.valor {
  margin-top: 0.65rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.grid-formulario {
  margin-bottom: 1.75rem;
}

.campo-formulario {
  display: grid;
  gap: 0.55rem;
}

.entrada {
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border-medium);
  background: var(--bg-base);
  color: var(--text-primary);
  outline: none;
  font-size: 0.95rem;
}

.entrada.ok {
  border-color: rgba(76, 175, 80, 0.6);
}

.entrada.err {
  border-color: rgba(173, 0, 79, 0.6);
}

.entrada::placeholder {
  color: var(--text-muted);
}

.entrada:focus {
  border-color: var(--crimson);
  box-shadow: 0 0 0 3px rgba(212, 0, 95, 0.12);
}

.retroalimentacion-clave {
  margin-top: 0.65rem;
}

.barra-fondo {
  height: 3px;
  border-radius: 999px;
  background: var(--border-subtle);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.barra-fortaleza {
  height: 100%;
  border-radius: 999px;
  transition: width 0.25s ease;
}

.retroalimentacion-clave ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.45rem;
}

.retroalimentacion-clave li {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.retroalimentacion-clave li.valid {
  color: #8bc34a;
}

.retroalimentacion-clave li.invalid {
  color: var(--text-muted);
}

.input-wrap {
  position: relative;
}

.input-wrap .eye-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.input-wrap .eye-btn:hover {
  color: var(--text-secondary);
}

.confirm-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.confirm-hint.ok {
  color: #8bc34a;
}

.confirm-hint.err {
  color: #e50914;
}

.confirm-hint .dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.espacio-entre {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--crimson);
  color: white;
  border: 1px solid transparent;
}

.btn-primary:hover:not(:disabled) {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 0, 95, 0.2);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
}

.btn-secondary:hover {
  background: var(--crimson-subtle);
  color: var(--text-primary);
  border-color: var(--crimson);
}

.peligro {
  color: var(--crimson-bright);
}

.acciones-derecha {
  display: flex;
  justify-content: flex-end;
}

.acciones-superior {
  margin-bottom: 1.5rem;
}

.btn-volver {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem 1.25rem;
  border-radius: 14px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  transition: all 0.2s ease;
}

.btn-volver:hover {
  background: var(--crimson-subtle);
  color: var(--text-primary);
  border-color: var(--crimson);
}

.icono {
  width: 1.05em;
  height: 1.05em;
}

@media (max-width: 720px) {
  .admin-main {
    padding: 1.75rem 1rem 2.5rem;
  }

  .espacio-entre {
    flex-direction: column;
    align-items: stretch;
  }

  .acciones-derecha {
    justify-content: center;
  }
}
</style>
