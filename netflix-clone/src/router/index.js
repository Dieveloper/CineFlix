import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Perfiles from '../views/Perfiles.vue'
import Catalogo from '../views/Catalogo.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/perfiles', component: Perfiles },
    { path: '/catalogo', component: Catalogo },
    { path: '/', redirect: '/login' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router