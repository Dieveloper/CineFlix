<template>
  <div class="login-container">

    <!-- PANEL IZQUIERDO: HERO -->
    <div class="hero-panel">
      <div class="hero-content">
        <div class="hero-brand">CINEFLIX</div>
        <p>Tu plataforma de películas y series. Regístrate o inicia sesión para empezar a disfrutar.</p>
      </div>
    </div>

    <!-- PANEL DERECHO: AUTH -->
    <div class="autenticacion-panel">
      <div class="autenticacion-content">

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
          <h2>Bienvenido de nuevo</h2>
          <form @submit.prevent="handleLogin">

            <div class="field">
              <label for="loginEmail">Correo electrónico</label>
              <input
                id="loginEmail"
                v-model="loginEmail"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div class="field">
              <label for="loginPassword">Contraseña</label>
              <div class="input-wrap">
                <input
                  id="loginPassword"
                  v-model="loginPassword"
                  :type="mostrarLoginPwd ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="mostrarLoginPwd = !mostrarLoginPwd"
                  :aria-label="mostrarLoginPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <Eye v-if="!mostrarLoginPwd" :size="17" />
                  <EyeOff v-else :size="17" />
                </button>
              </div>
            </div>

            <button type="submit" class="boton primary" :disabled="cargando">
              {{ cargando ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>
        </div>

        <!-- FORMULARIO REGISTRO -->
        <div v-if="tabActiva === 'register'" class="form-panel">
          <h2>Crear cuenta</h2>
          <form @submit.prevent="handleRegister">

            <div class="field">
              <label for="nombre-usuario">Nombre completo</label>
              <input
                id="nombre-usuario"
                v-model="nombreUsuario"
                type="text"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div class="field">
              <label for="correo-registro">Correo electrónico</label>
              <input
                id="correo-registro"
                v-model="correoRegistro"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div class="field">
              <label for="clave-registro">Contraseña</label>
              <div class="input-wrap">
                <input
                  id="clave-registro"
                  v-model="claveRegistro"
                  :type="mostrarRegPwd ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  @input="validarClave"
                  :class="{
                    ok: fortaleza >= 60,
                    err: claveRegistro.length > 0 && fortaleza < 40
                  }"
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="mostrarRegPwd = !mostrarRegPwd"
                  :aria-label="mostrarRegPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <Eye v-if="!mostrarRegPwd" :size="17" />
                  <EyeOff v-else :size="17" />
                </button>
              </div>

              <p class="requisitos-minimos">
                Tu contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.
              </p>

              <!-- INDICADOR FORTALEZA -->
              <div v-if="claveRegistro.length > 0" class="retroalimentacion-clave">
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
            </div>

            <!-- REPETIR CONTRASEÑA -->
            <div class="field">
              <label for="clave-confirmar">Repetir contraseña</label>
              <div class="input-wrap">
                <input
                  id="clave-confirmar"
                  v-model="claveConfirmar"
                  :type="mostrarConfirmPwd ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :class="{
                    ok: claveConfirmar.length > 0 && claveConfirmar === claveRegistro,
                    err: claveConfirmar.length > 0 && claveConfirmar !== claveRegistro
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
              <div v-if="claveConfirmar.length > 0" class="confirm-hint" :class="claveConfirmar === claveRegistro ? 'ok' : 'err'">
                <span class="dot"></span>
                {{ claveConfirmar === claveRegistro ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden' }}
              </div>
            </div>

            <button type="submit" class="boton primary" :disabled="cargando || !registroValido">
              {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>
        </div>

        <!-- MENSAJE ERROR / ÉXITO -->
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
import { Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const tabActiva = ref('login')
const cargando = ref(false)

// Campos login
const loginEmail = ref('')
const loginPassword = ref('')
const mostrarLoginPwd = ref(false)

// Campos registro
const nombreUsuario = ref('')
const correoRegistro = ref('')
const claveRegistro = ref('')
const claveConfirmar = ref('')
const mostrarRegPwd = ref(false)
const mostrarConfirmPwd = ref(false)

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
  if (fortaleza.value <= 40) return '#e50914'
  if (fortaleza.value <= 80) return '#f5a623'
  return '#4caf50'
})

const registroValido = computed(() => {
  return (
    nombreUsuario.value.trim().length > 0 &&
    correoRegistro.value.trim().length > 0 &&
    claveRegistro.value === claveConfirmar.value &&
    claveConfirmar.value.length > 0 &&
    fortaleza.value >= 40
  )
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
    claveConfirmar.value = ''
  } else {
    mensaje.value = 'Error al crear la cuenta. El email puede que ya esté en uso.'
    mensajeTipo.value = 'error'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
}

.login-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  height: 100vh;
  max-height: 100vh;
  overflow: visible;
  font-family: 'DM Sans', sans-serif;
  background: #0a0005;
  color: #f5eef0;

  --crimson: #AD004F;
  --crimson-bright: #D4005F;
  --crimson-glow: rgba(173, 0, 79, 0.3);
  --crimson-subtle: rgba(173, 0, 79, 0.1);
  --bg-base: #0a0005;
  --bg-surface: #120009;
  --bg-card: #180010;
  --bg-elevated: #200015;
  --text-primary: #f5eef0;
  --text-secondary: #b09aa0;
  --text-muted: #6e5560;
  --border-subtle: rgba(173, 0, 79, 0.18);
  --border-medium: rgba(173, 0, 79, 0.35);
}

/* HERO */
.hero-panel {
  background: linear-gradient(135deg, #1a000d 0%, #0a0005 50%, #120009 100%);
  padding: 4rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--border-subtle);
  overflow: hidden;
  position: relative;
}

/* Acento radial, igual que el hero del catálogo */
.hero-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 30% 50%, rgba(173, 0, 79, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* Línea decorativa vertical */
.hero-panel::after {
  content: '';
  position: absolute;
  top: 0;
  right: 60px;
  height: 100%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border-subtle), transparent);
}

.hero-content {
  max-width: 480px;
  position: relative;
}

.hero-brand {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 900;
  color: var(--crimson);
  letter-spacing: 4px;
  margin-bottom: 1.5rem;
  line-height: 1;
  position: relative;
}

/* Línea bajo el logo, igual que .logo::after del nav */
.hero-brand::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--crimson);
  opacity: 0.4;
}

.hero-content p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

/* AUTH PANEL */
.autenticacion-panel {
  background: var(--bg-base);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.autenticacion-content {
  width: 100%;
  max-width: 400px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}

/* TABS */
.autenticacion-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-bottom: 1.8rem;
  background: var(--bg-base);
  border-radius: 7px;
  padding: 4px;
  border: 1px solid var(--border-subtle);
}

.tab {
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 5px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.tab.active {
  background: var(--crimson);
  color: #fff;
}

.tab:not(.active):hover {
  color: var(--text-primary);
}

/* FORM */
.form-panel h2 {
  margin: 0 0 1.4rem;
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 600;
}

.input-wrap {
  position: relative;
}

.input-wrap input,
.field > input {
  width: 100%;
  background: var(--bg-base);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  border-radius: 5px;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.input-wrap input {
  padding: 0.72rem 2.6rem 0.72rem 0.9rem;
}

.field > input {
  padding: 0.72rem 0.9rem;
}

input::placeholder {
  color: var(--text-muted);
}

input:focus {
  border-color: var(--crimson);
}

input.ok {
  border-color: rgba(76, 175, 80, 0.6);
}

input.err {
  border-color: rgba(173, 0, 79, 0.6);
}

.requisitos-minimos {
  margin: 0.65rem 0 0;
  color: var(--text-secondary);
  font-size: 0.82rem;
  line-height: 1.5;
}

/* OJITO */
.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-muted);
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.eye-btn:hover {
  color: var(--text-secondary);
}

/* FORTALEZA */
.retroalimentacion-clave {
  margin-top: 0.5rem;
}

.barra-fondo {
  height: 2px;
  border-radius: 2px;
  background: var(--border-subtle);
  margin-bottom: 0.6rem;
  overflow: hidden;
}

.barra-fortaleza {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s, background 0.3s;
}

.retroalimentacion-clave ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.7rem;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.retroalimentacion-clave li.valid   { color: #5cb85c; }
.retroalimentacion-clave li.invalid { color: var(--crimson-bright); }

/* CONFIRMAR */
.confirm-hint {
  margin-top: 0.35rem;
  font-size: 0.7rem;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 5px;
}

.confirm-hint.ok  { color: #5cb85c; }
.confirm-hint.err { color: var(--crimson-bright); }

.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
  display: inline-block;
}

/* BOTÓN */
.boton {
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 0.68rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
  margin-top: 0.4rem;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}

.boton.primary {
  background: var(--crimson);
  color: #fff;
}

.boton.primary:hover:not(:disabled) {
  background: var(--crimson-bright);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(212, 0, 95, 0.25);
}

.boton.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* MENSAJES */
.autenticacion-mensaje {
  margin-top: 1.2rem;
  padding: 0.75rem 1rem;
  border-radius: 5px;
  font-size: 0.78rem;
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-base);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
}

.autenticacion-mensaje.error {
  background: rgba(173, 0, 79, 0.08);
  border-color: var(--border-medium);
  color: #ffaacc;
}

.autenticacion-mensaje.success {
  background: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.25);
  color: #c8f5c9;
}

/* RESPONSIVE */
@media (min-height: 1100px) {
  .autenticacion-panel { overflow-y: hidden; align-items: center; }
  .autenticacion-content { transform: scale(0.95); }
}

@media (max-height: 1099px) {
  .autenticacion-panel { overflow-y: auto; }
}

@media (max-width: 900px) {
  .login-container {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 1rem;
    height: auto;
    min-height: 100vh;
  }
  .autenticacion-panel { min-height: auto; padding: 2rem 1.5rem; }
  .hero-panel { padding: 1.5rem 1rem; align-items: flex-start; }
  .hero-brand { font-size: 2rem; }
  .hero-panel::after { display: none; }
}

@media (max-height: 700px) {
  .autenticacion-content { padding: 1.25rem; }
  .tab { padding: 0.6rem 1rem; }
  .form-panel h2 { font-size: 1.1rem; margin-bottom: 0.75rem; }
  .autenticacion-tabs { margin-bottom: 1rem; }
  .boton { padding: 0.65rem 1rem; }
}

@media (max-width: 560px) {
  .autenticacion-content { padding: 1.5rem; }
  .hero-brand { font-size: 3rem; }
  .hero-content p { display: none; }
}
</style>