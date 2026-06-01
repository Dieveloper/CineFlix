import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Perfiles from '../views/Perfiles.vue'
import Catalogo from '../views/Catalogo.vue'
import Admin from '../views/Admin.vue'
import Usuario from '../views/Usuario.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/perfiles', component: Perfiles, meta: { requiereAuth: true } },
  { path: '/catalogo', component: Catalogo, meta: { requiereAuth: true } },
  { path: '/usuario', component: Usuario, meta: { requiereAuth: true } },
  { path: '/admin', component: Admin, meta: { requiereAuth: true, requiereAdmin: true } },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (to.meta.requiereAuth && !usuario) {
    next('/login')
  } else if (to.meta.requiereAdmin && !usuario?.esAdmin) {
    next('/catalogo')
  } else if (to.path === '/login' && usuario) {
    next('/perfiles')
  } else {
    next()
  }
})

export default router