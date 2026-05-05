import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Perfiles from '../views/Perfiles.vue'
import Catalogo from '../views/Catalogo.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/perfiles', component: Perfiles, meta: { requiereAuth: true } },
  { path: '/catalogo', component: Catalogo, meta: { requiereAuth: true } },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuario')

  if (to.meta.requiereAuth && !usuario) {
    next('/login')
  } else if (to.path === '/login' && usuario) {
    next('/perfiles')
  } else {
    next()
  }
})

export default router