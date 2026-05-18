import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5097'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,
    perfilActivo: JSON.parse(localStorage.getItem('perfilActivo')) || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.usuario,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/Usuarios/login', credentials)
        this.usuario = {
          id: response.data.id,
          nombre: response.data.nombre,
          perfiles: response.data.perfiles
        }
        localStorage.setItem('usuario', JSON.stringify(this.usuario))
        return true
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return false
      }
    },

    async register(datos) {
      try {
        await axios.post('/api/Usuarios/register', datos)
        return true
      } catch (error) {
        console.error('Error al registrarse:', error)
        return false
      }
    },

    logout() {
      this.usuario = null
      this.perfilActivo = null
      localStorage.removeItem('usuario')
      localStorage.removeItem('perfilActivo')
    }
  }
})