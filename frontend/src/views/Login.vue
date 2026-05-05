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
* {
  box-sizing: border-box;
}

.login-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  height: 100vh;
  max-height: 100vh;
  overflow: visible;
  font-family: 'Georgia', serif;
  background: #0a0a0f;
  color: #f0f0f0;   
}

/* HERO */
.hero-panel {
  background: radial-gradient(ellipse at 50% 30%, #1a0005 0%, #0a0a0f 70%);
  padding: 4rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #1a1a22;
  overflow: hidden;
}

.hero-content {
  max-width: 480px;
}

.hero-brand {
  font-size: clamp(3rem, 5vw, 5rem);
  font-weight: 800;
  color: #e50914;
  letter-spacing: 4px;
  margin-bottom: 1.5rem;
  line-height: 1;
}

.hero-content p {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.8;
  color: #666;
  font-family: sans-serif;
}

/* AUTH PANEL */
.autenticacion-panel {
  background: #0a0a0f;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.autenticacion-content {
  width: 100%;
  max-width: 400px;
  background: #141419;
  border: 1px solid #2a2a35;
  border-radius: 16px;
  padding: 2rem;
}

/* TABS */
.autenticacion-tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin-bottom: 1.8rem;
  background: #0f0f18;
  border-radius: 10px;
  padding: 4px;
}

.tab {
  border: none;
  padding: 0.65rem 1rem;
  border-radius: 7px;
  background: transparent;
  color: #555;
  font-size: 0.83rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  font-family: sans-serif;
  font-weight: 500;
}

.tab.active {
  background: #e50914;
  color: #fff;
}

.tab:not(.active):hover {
  color: #ccc;
}

/* FORM */
.form-panel h2 {
  margin: 0 0 1.4rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #f0f0f0;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.73rem;
  color: #888;
  letter-spacing: 0.5px;
  font-family: sans-serif;
}

.input-wrap {
  position: relative;
}

/* Inputs dentro de input-wrap (con ojito) */
.input-wrap input {
  width: 100%;
  padding: 0.68rem 2.6rem 0.68rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid #2a2a35;
  background: #0f0f18;
  color: #f0f0f0;
  font-size: 0.88rem;
  outline: none;
  font-family: sans-serif;
  transition: border-color 0.2s;
}

/* Inputs directos sin ojito */
.field > input {
  width: 100%;
  padding: 0.68rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid #2a2a35;
  background: #0f0f18;
  color: #f0f0f0;
  font-size: 0.88rem;
  outline: none;
  font-family: sans-serif;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #555;
}

input.ok {
  border-color: #2a7a2a;
}

input.err {
  border-color: #8b1a1a;
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
  color: #444;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.eye-btn:hover {
  color: #aaa;
}

/* FORTALEZA */
.retroalimentacion-clave {
  margin-top: 0.5rem;
}

.barra-fondo {
  height: 3px;
  border-radius: 2px;
  background: #2a2a35;
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
  font-size: 0.73rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.retroalimentacion-clave li.valid   { color: #5cb85c; }
.retroalimentacion-clave li.invalid { color: #e05555; }

/* CONFIRMAR */
.confirm-hint {
  margin-top: 0.35rem;
  font-size: 0.73rem;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  gap: 5px;
}

.confirm-hint.ok  { color: #5cb85c; }
.confirm-hint.err { color: #e05555; }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  background: currentColor;
  display: inline-block;
}

/* BOTÓN */
.boton {
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 0.72rem 1rem;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  font-family: sans-serif;
  letter-spacing: 0.5px;
  margin-top: 0.4rem;
}

.boton.primary {
  background: #e50914;
  color: #fff;
  transition: background 0.2s;
}

.boton.primary:hover:not(:disabled) {
  background: #ff1f27;
}

.boton.primary:disabled {
  background: #4a0408;
  color: #555;
  cursor: not-allowed;
}

/* MENSAJES */
.autenticacion-mensaje {
  margin-top: 1.2rem;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-family: sans-serif;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a2a35;
  color: #888;
}

.autenticacion-mensaje.error {
  background: rgba(229, 9, 20, 0.08);
  border-color: rgba(229, 9, 20, 0.25);
  color: #ffaaaa;
}

.autenticacion-mensaje.success {
  background: rgba(76, 175, 80, 0.08);
  border-color: rgba(76, 175, 80, 0.25);
  color: #c8f5c9;
}

/* RESPONSIVE */
@media (min-height: 1100px) {
  .autenticacion-panel {
    overflow-y: hidden;
    align-items: center;
  }

  .autenticacion-content {
    transform: scale(0.95);
  }
}

@media (max-height: 1099px) {
  .autenticacion-panel {
    overflow-y: auto;
  }
}

@media (max-width: 900px) {
  .login-container {
    grid-template-columns: 1fr;
    background: #0a0a0f;
    gap: 0;
    padding: 1rem;
    height: auto;
    min-height: 100vh;
  }

  .autenticacion-panel {
    min-height: auto;
    padding: 2rem 1.5rem;
  }

  .hero-panel {
    padding: 1.5rem 1rem;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    flex: 0 0 auto;
    align-items: flex-start;
  }

  .hero-brand {
    font-size: 2rem;
  }
}

@media (max-height: 700px) {
  .autenticacion-content {
    padding: 1.25rem;
  }

  .tab {
    padding: 0.6rem 1rem;
  }

  .form-panel h2 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }

  input {
    padding: 0.65rem 1rem;
    margin-bottom: 0.6rem;
  }

  .boton {
    padding: 0.65rem 1rem;
  }

  .autenticacion-tabs {
    margin-bottom: 1rem;
  }
}

@media (max-width: 560px) {
  .autenticacion-content {
    padding: 1.5rem;
  }

  .hero-brand {
    font-size: 3rem;
  }

  .hero-content p {
    display: none;
  }
}
</style>