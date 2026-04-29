<template>
  <div class="login-container">
    <div class="hero-panel">
      <div class="hero-content">
        <h1>CINEFLIX</h1>
        <p>Tu plataforma de películas y series. Regístrate o inicia sesión para empezar a disfrutar.</p>
      </div>
    </div>

    <div class="autenticacion-panel">
      <div class="autenticacion-content">

        <!-- TABS -->
        <div class="autenticacion-tabs">
          <button
            class="tab"
            :class="{ active: tabActiva === 'login' }"
            @click="tabActiva = 'login'"
          >
            Iniciar sesión
          </button>
          <button
            class="tab"
            :class="{ active: tabActiva === 'register' }"
            @click="tabActiva = 'register'"
          >
            Registrarse
          </button>
        </div>

        <!-- FORMULARIO LOGIN -->
        <div v-if="tabActiva === 'login'" class="form-panel">
          <h2>Inicia sesión</h2>
          <form @submit.prevent="handleLogin">
            <label for="loginEmail">Correo electrónico</label>
            <input
              id="loginEmail"
              v-model="loginEmail"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
            <label for="loginPassword">Contraseña</label>
            <input
              id="loginPassword"
              v-model="loginPassword"
              type="password"
              placeholder="••••••••"
              required
            />
            <button type="submit" class="boton primary" :disabled="cargando">
              {{ cargando ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </div>

        <!-- FORMULARIO REGISTRO -->
        <div v-if="tabActiva === 'register'" class="form-panel">
          <h2>Regístrate</h2>
          <form @submit.prevent="handleRegister">
            <label for="nombre-usuario">Nombre completo</label>
            <input
              id="nombre-usuario"
              v-model="nombreUsuario"
              type="text"
              placeholder="Tu nombre"
              required
            />
            <label for="correo-registro">Correo electrónico</label>
            <input
              id="correo-registro"
              v-model="correoRegistro"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
            <label for="clave-registro">Contraseña</label>
            <input
              id="clave-registro"
              v-model="claveRegistro"
              type="password"
              placeholder="••••••••"
              required
              @input="validarClave"
            />

            <!-- INDICADOR FORTALEZA -->
            <div v-if="claveRegistro.length > 0" class="retroalimentacion-clave">
              <div class="barra-fortaleza" :style="{ width: fortaleza + '%', background: colorFortaleza }"></div>
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

            <button type="submit" class="boton primary" :disabled="cargando">
              {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>
        </div>

        <!-- MENSAJE ERROR/ÉXITO -->
        <div
          v-if="mensaje"
          class="autenticacion-mensaje"
          :class="mensajeTipo"
        >
          {{ mensaje }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const tabActiva = ref('login')
const cargando = ref(false)

// Campos login
const loginEmail = ref('')
const loginPassword = ref('')

// Campos registro
const nombreUsuario = ref('')
const correoRegistro = ref('')
const claveRegistro = ref('')

// Mensaje
const mensaje = ref('')
const mensajeTipo = ref('')

// Validación contraseña
const requisitos = ref({
  largo: false,
  mayuscula: false,
  minuscula: false,
  numero: false,
  especial: false,
})

function validarClave() {
  const c = claveRegistro.value
  requisitos.value = {
    largo: c.length >= 8,
    mayuscula: /[A-Z]/.test(c),
    minuscula: /[a-z]/.test(c),
    numero: /[0-9]/.test(c),
    especial: /[^A-Za-z0-9]/.test(c),
  }
}

const fortaleza = computed(() => {
  const cumplidos = Object.values(requisitos.value).filter(Boolean).length
  return (cumplidos / 5) * 100
})

const colorFortaleza = computed(() => {
  if (fortaleza.value <= 40) return '#E50914'
  if (fortaleza.value <= 80) return '#f5a623'
  return '#4caf50'
})

async function handleLogin() {
  cargando.value = true
  mensaje.value = ''
  const exito = await auth.login({
    email: loginEmail.value,
    password: loginPassword.value,
  })
  cargando.value = false

  if (exito) {
    router.push('/perfiles')
  } else {
    mensaje.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
    mensajeTipo.value = 'error'
  }
}

async function handleRegister() {
  cargando.value = true
  mensaje.value = ''
  const exito = await auth.register({
    nombre: nombreUsuario.value,
    email: correoRegistro.value,
    password: claveRegistro.value,
  })
  cargando.value = false

  if (exito) {
    mensaje.value = '¡Cuenta creada correctamente! Inicia sesión.'
    mensajeTipo.value = 'success'
    tabActiva.value = 'login'
  } else {
    mensaje.value = 'Error al crear la cuenta. El email puede que ya esté en uso.'
    mensajeTipo.value = 'error'
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.login-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 100vh;
  font-family: "Inter", system-ui, sans-serif;
  background: #0b1220;
  color: #f7f8fb;
}

/* HERO PANEL */
.hero-panel {
  background: linear-gradient(135deg, #292f48 0%, #1e2439 100%);
  padding: 4rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 520px;
}

.hero-content h1 {
  margin: 0 0 1rem;
  font-size: clamp(2.4rem, 3vw, 3.8rem);
  line-height: 1.05;
}

.hero-content p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #c6c9d6;
}

/* AUTH PANEL */
.autenticacion-panel {
  background: #111826;
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.autenticacion-content {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.2);
}

/* TABS */
.autenticacion-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab {
  border: none;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  color: #c8ccd9;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.tab.active {
  background: #4454d1;
  color: white;
}

/* FORM */
.form-panel h2 {
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.6rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
  color: #d1d5db;
}

input {
  width: 100%;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #f8f9fb;
  margin-bottom: 1rem;
  outline: none;
  font-family: inherit;
}

input:focus {
  border-color: #6676ff;
  box-shadow: 0 0 0 4px rgba(102, 118, 255, 0.12);
}

.boton {
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 0.95rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;
}

.boton.primary {
  background: #5f72ff;
  color: white;
  transition: background 0.2s;
}

.boton.primary:hover:not(:disabled) {
  background: #4d5fdd;
}

.boton.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* VALIDACIÓN CONTRASEÑA */
.retroalimentacion-clave {
  margin-bottom: 1rem;
}

.barra-fortaleza {
  height: 6px;
  border-radius: 4px;
  transition: width 0.3s, background 0.3s;
  margin-bottom: 0.75rem;
}

.retroalimentacion-clave ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.retroalimentacion-clave li.valid {
  color: #4caf50;
}

.retroalimentacion-clave li.invalid {
  color: #ff5252;
}

/* MENSAJE */
.autenticacion-mensaje {
  margin-top: 1.25rem;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cad3ff;
  font-size: 0.9rem;
}

.autenticacion-mensaje.error {
  background: rgba(255, 82, 82, 0.12);
  border-color: rgba(255, 82, 82, 0.25);
  color: #ffdddd;
}

.autenticacion-mensaje.success {
  background: rgba(118, 255, 140, 0.12);
  border-color: rgba(118, 255, 140, 0.25);
  color: #e7ffdb;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .login-container {
    grid-template-columns: 1fr;
  }
  .hero-panel {
    padding: 2.5rem 1.5rem;
    text-align: center;
  }
  .autenticacion-panel {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 560px) {
  .autenticacion-content {
    padding: 1.5rem;
  }
  .hero-content h1 {
    font-size: 2.4rem;
  }
}
</style>